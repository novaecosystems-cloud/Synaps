import prisma from '@/lib/prisma';
import { invokeLLMWithFallback } from '@/lib/llm-router';

function parseSafeJson(content: string) {
  try {
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON in risk-prediction-engine:", content);
    return {};
  }
}

export interface RiskItem {
  id: string;
  category: 'MISSING_SIGNATURE' | 'POLICY_CONFLICT' | 'FINANCIAL_RISK' | 'LEGAL_RISK' | 'SECURITY_ISSUE' | 'COMPLIANCE_VIOLATION' | 'INCOMPLETE_SOP' | 'DUPLICATE_PROCESS';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  supportingEvidence: string;
  mitigationRecommendation: string;
  documentName?: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  createdAt: string;
}

export interface PredictionItem {
  id: string;
  targetMetric: 'CUSTOMER_CHURN' | 'REVENUE_CHANGE' | 'PROJECT_DELAY' | 'BUDGET_OVERRUN' | 'CONTRACT_EXPIRY' | 'EMPLOYEE_ATTRITION' | 'COMPLIANCE_FAILURE' | 'KNOWLEDGE_GAP';
  predictedValue: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
  confidenceScore: number;
  explanation: string;
  supportingEvidence: string[];
  createdAt: string;
}

export interface RiskDashboardData {
  overallRiskScore: number; // 0-100
  criticalRiskCount: number;
  highRiskCount: number;
  openRiskCount: number;
  predictions: PredictionItem[];
  risks: RiskItem[];
}

export async function scanEnterpriseRisks(organizationId: string): Promise<RiskItem[]> {
  // Fetch organization documents and decisions
  const docs = await prisma.document.findMany({
    where: { organizationId, isDeleted: false },
    take: 12,
    orderBy: { updatedAt: 'desc' },
    select: { id: true, name: true, mimeType: true }
  });

  const decisions = await prisma.decision.findMany({
    where: { organizationId },
    take: 6,
    select: { title: true, recommendation: true, status: true, executiveSummary: true }
  });

  const contextText = `ENTERPRISE DATA CONTENT:
Documents: ${docs.map(d => d.name).join(', ') || 'Enterprise Standard SOPs & Contracts'}
Decisions: ${decisions.map(d => `${d.title} (${d.status})`).join('; ') || 'None'}`;

  const systemPrompt = `You are the AI Risk Scanner for Synaps.
Scan the provided enterprise documents and corporate data for operational vulnerabilities across 8 categories:
1. MISSING_SIGNATURE (Unsigned contracts, draft execution blocks)
2. POLICY_CONFLICT (Contradictory SOP clauses or policy requirements)
3. FINANCIAL_RISK (Uncapped liabilities, budget overruns, payment term risks)
4. LEGAL_RISK (Indemnification liabilities, IP ownership ambiguity)
5. SECURITY_ISSUE (Data privacy gaps, missing encryption standards)
6. COMPLIANCE_VIOLATION (Non-compliance with GDPR, HIPAA, SOC2)
7. INCOMPLETE_SOP (Draft or outdated standard operating procedures)
8. DUPLICATE_PROCESS (Redundant workflows or overlapping departmental duties)

You MUST return valid JSON containing an array of risk objects:
{
  "risks": [
    {
      "category": "MISSING_SIGNATURE", // MUST be one of the 8 categories
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "title": "Clear risk title",
      "description": "2-3 sentence description of the detected risk",
      "supportingEvidence": "Direct quote or evidence from enterprise data",
      "mitigationRecommendation": "Recommended action step"
    }
  ]
}`;

  try {
    const rawContent = await invokeLLMWithFallback([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: contextText }
    ], { response_format: { type: 'json_object' } });

    const parsed = parseSafeJson(rawContent);
    const scannedRisks = Array.isArray(parsed.risks) ? parsed.risks : [];

    // Clear old open risks for fresh scan
    await prisma.enterpriseRisk.deleteMany({
      where: { organizationId, status: 'OPEN' }
    });

    const savedRisks: RiskItem[] = [];

    for (const r of scannedRisks) {
      const dbRisk = await prisma.enterpriseRisk.create({
        data: {
          organizationId,
          category: (r.category || 'POLICY_CONFLICT') as any,
          severity: (r.severity || 'MEDIUM') as any,
          title: r.title || 'Detected Vulnerability',
          description: r.description || 'Enterprise risk detected during AI scan.',
          supportingEvidence: r.supportingEvidence || 'Grounded in corporate documents.',
          mitigationRecommendation: r.mitigationRecommendation || 'Review document clauses.',
          status: 'OPEN'
        }
      });

      savedRisks.push({
        id: dbRisk.id,
        category: dbRisk.category as any,
        severity: dbRisk.severity as any,
        title: dbRisk.title,
        description: dbRisk.description,
        supportingEvidence: dbRisk.supportingEvidence,
        mitigationRecommendation: dbRisk.mitigationRecommendation,
        status: dbRisk.status as any,
        createdAt: dbRisk.createdAt.toISOString()
      });
    }

    return savedRisks;

  } catch (error) {
    console.error("Error in scanEnterpriseRisks:", error);
    return [];
  }
}

export async function generateEnterprisePredictions(organizationId: string): Promise<PredictionItem[]> {
  const docs = await prisma.document.findMany({
    where: { organizationId, isDeleted: false },
    take: 10,
    select: { name: true }
  });

  const decisions = await prisma.decision.findMany({
    where: { organizationId },
    take: 5,
    select: { title: true, status: true, expectedOutcome: true, actualOutcome: true }
  });

  const contextText = `ENTERPRISE DATA BASE:
Documents: ${docs.map(d => d.name).join(', ') || 'Corporate Data'}
Decisions: ${decisions.map(d => `${d.title} (Outcome: ${d.actualOutcome || d.expectedOutcome})`).join('; ') || 'None'}`;

  const systemPrompt = `You are the AI Predictive Intelligence Center for Synaps.
Generate predictions with explicit explanations and supporting evidence for 8 target metrics:
1. CUSTOMER_CHURN
2. REVENUE_CHANGE
3. PROJECT_DELAY
4. BUDGET_OVERRUN
5. CONTRACT_EXPIRY
6. EMPLOYEE_ATTRITION
7. COMPLIANCE_FAILURE
8. KNOWLEDGE_GAP

You MUST return valid JSON with:
{
  "predictions": [
    {
      "targetMetric": "CUSTOMER_CHURN",
      "predictedValue": "14.2% Risk Level",
      "trend": "UP" | "DOWN" | "STABLE",
      "confidenceScore": 0.88, // float between 0 and 1
      "explanation": "Explicit 2-3 sentence explanation of WHY this prediction was generated based on enterprise trends.",
      "supportingEvidence": ["Evidence citation 1 from corporate data", "Evidence citation 2"]
    },
    ... (MUST include predictions for all 8 target metrics)
  ]
}`;

  try {
    const rawContent = await invokeLLMWithFallback([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: contextText }
    ], { response_format: { type: 'json_object' } });

    const parsed = parseSafeJson(rawContent);
    const scannedPredictions = Array.isArray(parsed.predictions) ? parsed.predictions : [];

    // Clear old predictions for fresh generation
    await prisma.enterprisePrediction.deleteMany({
      where: { organizationId }
    });

    const savedPredictions: PredictionItem[] = [];

    for (const p of scannedPredictions) {
      const dbPred = await prisma.enterprisePrediction.create({
        data: {
          organizationId,
          targetMetric: (p.targetMetric || 'CUSTOMER_CHURN') as any,
          predictedValue: p.predictedValue || 'Normal Range',
          trend: (p.trend || 'STABLE') as any,
          confidenceScore: typeof p.confidenceScore === 'number' ? p.confidenceScore : 0.85,
          explanation: p.explanation || 'Prediction generated from enterprise patterns.',
          supportingEvidence: Array.isArray(p.supportingEvidence) ? p.supportingEvidence : ['Corporate Data Context']
        }
      });

      savedPredictions.push({
        id: dbPred.id,
        targetMetric: dbPred.targetMetric as any,
        predictedValue: dbPred.predictedValue,
        trend: dbPred.trend as any,
        confidenceScore: dbPred.confidenceScore,
        explanation: dbPred.explanation,
        supportingEvidence: dbPred.supportingEvidence as any,
        createdAt: dbPred.createdAt.toISOString()
      });
    }

    return savedPredictions;

  } catch (error) {
    console.error("Error in generateEnterprisePredictions:", error);
    return [];
  }
}

export async function getEnterpriseRiskDashboard(organizationId: string): Promise<RiskDashboardData> {
  let risks = await prisma.enterpriseRisk.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' }
  });

  let predictions = await prisma.enterprisePrediction.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' }
  });

  // If risks or predictions are empty, trigger auto-generation!
  if (risks.length === 0) {
    const freshRisks = await scanEnterpriseRisks(organizationId);
    risks = await prisma.enterpriseRisk.findMany({ where: { organizationId }, orderBy: { createdAt: 'desc' } });
  }

  if (predictions.length === 0) {
    const freshPreds = await generateEnterprisePredictions(organizationId);
    predictions = await prisma.enterprisePrediction.findMany({ where: { organizationId }, orderBy: { createdAt: 'desc' } });
  }

  const criticalCount = risks.filter(r => r.severity === 'CRITICAL').length;
  const highCount = risks.filter(r => r.severity === 'HIGH').length;
  const openCount = risks.filter(r => r.status === 'OPEN').length;

  const baseScore = 20;
  const overallRiskScore = Math.min(100, baseScore + (criticalCount * 25) + (highCount * 12) + (openCount * 3));

  return {
    overallRiskScore,
    criticalRiskCount: criticalCount,
    highRiskCount: highCount,
    openRiskCount: openCount,
    predictions: predictions.map(p => ({
      id: p.id,
      targetMetric: p.targetMetric as any,
      predictedValue: p.predictedValue,
      trend: p.trend as any,
      confidenceScore: p.confidenceScore,
      explanation: p.explanation,
      supportingEvidence: (p.supportingEvidence as any) || [],
      createdAt: p.createdAt.toISOString()
    })),
    risks: risks.map(r => ({
      id: r.id,
      category: r.category as any,
      severity: r.severity as any,
      title: r.title,
      description: r.description,
      supportingEvidence: r.supportingEvidence,
      mitigationRecommendation: r.mitigationRecommendation,
      status: r.status as any,
      createdAt: r.createdAt.toISOString()
    }))
  };
}
