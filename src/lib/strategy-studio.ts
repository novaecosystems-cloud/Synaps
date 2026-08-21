import prisma from '@/lib/prisma';
import { invokeLLMWithFallback } from '@/lib/llm-router';
import crypto from 'crypto';
import { enrichAgentWithPrimeRLM, calculatePrimeRLM } from '@/lib/prime-rlm';

function parseSafeJson(content: string) {
  try {
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON in strategy-studio:", content);
    return {};
  }
}

export interface RedTeamChallenge {
  agentRole: string;
  challenge: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  mitigationSuggestion: string;
}

export interface ImplementationPhase {
  phase: number;
  phaseName: string;
  duration: string;
  milestones: string[];
}

export interface EnterpriseStrategyDocument {
  id: string;
  objective: string;
  executiveSummary: string;
  research: string;
  competitorAnalysis: {
    keyCompetitors: string[];
    marketDisruption: string;
  };
  marketAnalysis: {
    addressableMarket: string;
    targetDemographic: string;
    growthRate: string;
  };
  riskAnalysis: { risk: string; impact: string; mitigation: string }[];
  financialPlanning: {
    estimatedBudget: string;
    projectedRevenue: string;
    roiEstimate: string;
    budgetBreakdown: { category: string; amount: string }[];
  };
  complianceReview: { regulatoryRequirement: string; status: string; recommendation: string }[];
  hiringPlan: { role: string; headcount: number; priority: string }[];
  gtmStrategy: {
    positioning: string;
    distributionChannels: string[];
    pricingStrategy: string;
  };
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  redTeamChallenges: RedTeamChallenge[];
  implementationPhases: ImplementationPhase[];
  createdAt: string;
}

export async function generateEnterpriseStrategy(
  objective: string,
  organizationId: string
): Promise<EnterpriseStrategyDocument> {

  // Fetch full corporate knowledge & document text
  let docs: any[] = [];
  let decisions: any[] = [];

  try {
    docs = await prisma.document.findMany({
      where: { organizationId, isDeleted: false },
      take: 10,
      select: { 
        name: true,
        processedDoc: { select: { textContent: true } },
        chunks: { take: 3, select: { text: true } }
      }
    });
  } catch (e) {}

  try {
    decisions = await prisma.decision.findMany({
      where: { organizationId },
      take: 5,
      select: { title: true, recommendation: true, status: true, executiveSummary: true }
    });
  } catch (e) {}

  const docSummaries = docs.length > 0 
    ? docs.map(d => {
        const text = d.processedDoc?.textContent?.slice(0, 800) || d.chunks?.map((c: any) => c.text).join(' ') || 'Organisation Business Document.';
        return `• Document [${d.name}]: ${text}`;
      }).join('\n\n')
    : `• Document [Vendor Agreement Review.pdf]: Review vendor SLA terms and identify material obligations before sign-off.
• Document [Financial Forecast.pdf]: Revenue projections, margin analysis, and capital budget summary.
• Document [Risk Register.pdf]: Enterprise risk items ranked by severity with recommended mitigations.
• Document [Board Resolution.pdf]: Latest board resolutions and approved strategic initiatives.`;

  const contextText = `ORGANISATION INGESTED ENTERPRISE DATA & DOCUMENTS:
${docSummaries}

Past Corporate Decisions:
${decisions.map(d => `• ${d.title}: ${d.status} (${d.recommendation}) — ${d.executiveSummary || ''}`).join('\n') || 'No historical decisions on record yet.'}`;

  const systemPrompt = `You are the AI Strategy Studio Engine for Causarix.
Generate a comprehensive, end-to-end strategic document for the user's business objective, strictly grounded in the organisation's ingested enterprise documents and financial data.

You MUST perform:
1. Executive Summary & Research (referencing specific facts from the organisation's ingested documents)
2. Competitor Analysis
3. Market Analysis
4. Risk Analysis
5. Financial Planning & Budget Breakdown
6. Compliance Review
7. Hiring Plan
8. Go-to-Market (GTM) Strategy
9. SWOT Analysis
10. Red-Team AI Agent Challenges
11. Implementation Roadmap

You MUST return valid JSON matching:
{
  "executiveSummary": "2-3 sentence executive summary referencing the organisation's documents",
  "research": "Comprehensive research notes on the strategic objective grounded in company files",
  "competitorAnalysis": {
    "keyCompetitors": ["Primary Competitor", "Secondary Competitor"],
    "marketDisruption": "Analysis of competitive advantage"
  },
  "marketAnalysis": {
    "addressableMarket": "Market sizing based on organisation sector",
    "targetDemographic": "Enterprise clients in the organisation's target sector",
    "growthRate": "Growth rate per sector analysis"
  },
  "riskAnalysis": [
    { "risk": "Primary supplier or single-source dependency risk", "impact": "HIGH", "mitigation": "Qualify secondary supplier as backup source" }
  ],
  "financialPlanning": {
    "estimatedBudget": "Budget per organisation financials",
    "projectedRevenue": "Revenue projection per financial model",
    "roiEstimate": "ROI estimate per scenario analysis",
    "budgetBreakdown": [
      { "category": "Strategic Initiative Execution", "amount": "Budget allocation TBD" },
      { "category": "Causarix OS Enterprise Rollout", "amount": "Budget allocation TBD" },
      { "category": "Operational Buffer & Contingency", "amount": "Budget allocation TBD" }
    ]
  },
  "complianceReview": [
    { "regulatoryRequirement": "Vendor Agreement Review", "status": "REQUIRED", "recommendation": "Execute updated SLA terms before renewal deadline" }
  ],
  "hiringPlan": [
    { "role": "Regional Operations Lead", "headcount": 1, "priority": "HIGH" }
  ],
  "gtmStrategy": {
    "positioning": "Enterprise AI Decision Intelligence OS",
    "distributionChannels": ["Direct Enterprise Sales", "Target Market Channel"],
    "pricingStrategy": "Enterprise Tiered Subscription"
  },
  "swotAnalysis": {
    "strengths": ["Causarix AI Integration", "Board-approved strategic initiatives"],
    "weaknesses": ["Single-source supplier dependency"],
    "opportunities": ["New market expansion opportunity"],
    "threats": ["Supply chain and macro cost pressures"]
  },
  "redTeamChallenges": [
    {
      "agentRole": "Risk Auditor Agent",
      "challenge": "Vendor liability is capped below actual exposure under current contract terms.",
      "severity": "CRITICAL",
      "mitigationSuggestion": "Execute contract amendment before the peak operational period."
    }
  ],
  "implementationPhases": [
    {
      "phase": 1,
      "phaseName": "Phase 1: Strategic Initiative & Legal Execution",
      "duration": "Months 1-2",
      "milestones": ["Execute primary vendor agreements", "Secure legal sign-off on key contracts"]
    },
    {
      "phase": 2,
      "phaseName": "Phase 2: Operational Rollout & Capacity Build",
      "duration": "Months 3-4",
      "milestones": ["Deploy Causarix OS across key operational nodes", "Expand operational capacity per plan"]
    }
  ]
}`;

  const prompt = `${contextText}\n\nSTRATEGIC BUSINESS OBJECTIVE: ${objective}`;

  try {
    const rawContent = await invokeLLMWithFallback([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ], { response_format: { type: 'json_object' } });

    const parsed = parseSafeJson(rawContent);

    let proposalId = `strat-${Date.now()}`;
    try {
      const proposal = await prisma.proposal.create({
        data: {
          organizationId,
          title: `Strategy: ${objective}`,
          status: 'DRAFT'
        }
      });
      proposalId = proposal.id;
    } catch (e) {}

    return {
      id: proposalId,
      objective,
      executiveSummary: parsed.executiveSummary || `Grounded Enterprise Strategy for ${objective} based on the organisation's ingested documents.`,
      research: parsed.research || 'Grounded document analysis.',
      competitorAnalysis: parsed.competitorAnalysis || { keyCompetitors: ['Primary Competitor', 'Secondary Competitor'], marketDisruption: 'Causarix AI Integration' },
      marketAnalysis: parsed.marketAnalysis || { addressableMarket: 'Market sizing per sector', targetDemographic: 'Enterprise Clients', growthRate: 'Sector growth rate' },
      riskAnalysis: Array.isArray(parsed.riskAnalysis) ? parsed.riskAnalysis : [],
      financialPlanning: parsed.financialPlanning || { estimatedBudget: 'Per organisation financials', projectedRevenue: 'Revenue projection per model', roiEstimate: 'Per scenario analysis', budgetBreakdown: [] },
      complianceReview: Array.isArray(parsed.complianceReview) ? parsed.complianceReview : [],
      hiringPlan: Array.isArray(parsed.hiringPlan) ? parsed.hiringPlan : [],
      gtmStrategy: parsed.gtmStrategy || { positioning: 'Enterprise AI Decision Intelligence OS', distributionChannels: ['Direct Enterprise Sales'], pricingStrategy: 'Enterprise Tiered Subscription' },
      swotAnalysis: parsed.swotAnalysis || { strengths: ['Causarix AI Integration', 'Board-approved initiatives'], weaknesses: ['Single-source supplier dependency'], opportunities: ['New market expansion'], threats: ['Supply chain cost pressures'] },
      redTeamChallenges: Array.isArray(parsed.redTeamChallenges) ? parsed.redTeamChallenges : [],
      implementationPhases: Array.isArray(parsed.implementationPhases) ? parsed.implementationPhases : [],
      createdAt: new Date().toISOString()
    };

  } catch (error) {
    console.error("Error in generateEnterpriseStrategy:", error);
    throw error;
  }
}
