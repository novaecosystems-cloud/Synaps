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
  let docs: any[] = [];
  let decisions: any[] = [];

  try {
    docs = await prisma.document.findMany({
      where: { organizationId, isDeleted: false },
      take: 12,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, name: true, mimeType: true }
    });
  } catch (e) {}

  try {
    decisions = await prisma.decision.findMany({
      where: { organizationId },
      take: 6,
      select: { title: true, recommendation: true, status: true, executiveSummary: true }
    });
  } catch (e) {}

  const contextText = `ENTERPRISE DATA CONTENT:
Documents: ${docs.map(d => d.name).join(', ') || 'Enterprise Standard SOPs & Contracts'}
Decisions: ${decisions.map(d => `${d.title} (${d.status})`).join('; ') || 'None'}`;

  const systemPrompt = `You are the AI Risk Scanner for Synaps.
Scan the provided enterprise documents and corporate data for operational vulnerabilities across 8 categories:
1. MISSING_SIGNATURE
2. POLICY_CONFLICT
3. FINANCIAL_RISK
4. LEGAL_RISK
5. SECURITY_ISSUE
6. COMPLIANCE_VIOLATION
7. INCOMPLETE_SOP
8. DUPLICATE_PROCESS

Return valid JSON with format:
{
  "risks": [
    {
      "category": "MISSING_SIGNATURE",
      "severity": "HIGH",
      "title": "Unsigned Contract Clause Detected",
      "description": "Found draft execution block in vendor agreement.",
      "supportingEvidence": "Section 12.4 signature block empty.",
      "mitigationRecommendation": "Request countersigned PDF from vendor legal representative."
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

    const savedRisks: RiskItem[] = [];

    for (const r of scannedRisks) {
      try {
        const dbRisk = await prisma.enterpriseRisk.create({
          data: {
            organizationId,
            category: (r.category || 'POLICY_CONFLICT') as any,
            severity: (r.severity || 'MEDIUM') as any,
            title: r.title || 'Identified Enterprise Compliance Exposure',
            description: r.description || 'Risk identified during enterprise document scanning.',
            supportingEvidence: r.supportingEvidence || 'Ingested Contract Policy Clause',
            mitigationRecommendation: r.mitigationRecommendation || 'Review terms with legal team.',
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
      } catch (dbErr) {
        console.warn('[RISK] Error saving enterprise risk:', dbErr);
      }
    }

    return savedRisks;

  } catch (error) {
    console.error("Error in scanEnterpriseRisks:", error);
    return [];
  }
}

export async function generateEnterprisePredictions(organizationId: string): Promise<PredictionItem[]> {
  let docs: any[] = [];
  try {
    docs = await prisma.document.findMany({
      where: { organizationId, isDeleted: false },
      take: 10,
      select: { name: true }
    });
  } catch (e) {}

  const contextText = `Ingested Documents: ${docs.map(d => d.name).join(', ') || 'Corporate Knowledge Repository'}`;

  const systemPrompt = `You are the AI Risk & Churn Predictive Engine for Synaps.
Generate 5 predictive metrics for:
CUSTOMER_CHURN, REVENUE_CHANGE, PROJECT_DELAY, BUDGET_OVERRUN, CONTRACT_EXPIRY.

Return valid JSON:
{
  "predictions": [
    {
      "targetMetric": "CUSTOMER_CHURN",
      "predictedValue": "2.4% Monthly Churn Risk",
      "trend": "DOWN",
      "confidenceScore": 92,
      "explanation": "SLA contract terms show high client satisfaction.",
      "supportingEvidence": ["SLA Deliverable Ingestion Log"]
    }
  ]
}`;

  try {
    const rawContent = await invokeLLMWithFallback([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: contextText }
    ], { response_format: { type: 'json_object' } });

    const parsed = parseSafeJson(rawContent);
    const scannedPredictions = Array.isArray(parsed.predictions) ? parsed.predictions : [];

    const savedPredictions: PredictionItem[] = [];

    for (const p of scannedPredictions) {
      try {
        const dbPred = await prisma.enterprisePrediction.create({
          data: {
            organizationId,
            targetMetric: (p.targetMetric || 'CUSTOMER_CHURN') as any,
            predictedValue: p.predictedValue || 'Normal Range',
            trend: (p.trend || 'STABLE') as any,
            confidenceScore: typeof p.confidenceScore === 'number' ? p.confidenceScore : 88,
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
      } catch (dbErr) {
        console.warn('[PREDICTION] Error saving prediction:', dbErr);
      }
    }

    return savedPredictions;

  } catch (error) {
    console.error("Error in generateEnterprisePredictions:", error);
    return [];
  }
}

export async function getEnterpriseRiskDashboard(organizationId: string): Promise<RiskDashboardData> {
  let risks: any[] = [];
  let predictions: any[] = [];

  try {
    risks = await prisma.enterpriseRisk.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' }
    });
  } catch (e) {
    console.warn('[RISK DASHBOARD] Notice fetching risks from DB:', e);
  }

  try {
    predictions = await prisma.enterprisePrediction.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' }
    });
  } catch (e) {
    console.warn('[RISK DASHBOARD] Notice fetching predictions from DB:', e);
  }

  // If risks or predictions are empty, trigger auto-generation!
  if (risks.length === 0) {
    await scanEnterpriseRisks(organizationId);
    try {
      risks = await prisma.enterpriseRisk.findMany({ where: { organizationId }, orderBy: { createdAt: 'desc' } });
    } catch (e) {}
  }

  if (predictions.length === 0) {
    await generateEnterprisePredictions(organizationId);
    try {
      predictions = await prisma.enterprisePrediction.findMany({ where: { organizationId }, orderBy: { createdAt: 'desc' } });
    } catch (e) {}
  }

  const criticalCount = risks.filter(r => r.severity === 'CRITICAL').length;
  const highCount = risks.filter(r => r.severity === 'HIGH').length;
  const openCount = risks.filter(r => r.status === 'OPEN').length;

  const baseScore = 15;
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
      confidenceScore: p.confidenceScore || 90,
      explanation: p.explanation || 'Analyzed from corporate patterns.',
      supportingEvidence: (p.supportingEvidence as any) || [],
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString()
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
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString()
    }))
  };
}
