import prisma from '@/lib/prisma';
import { invokeLLMWithFallback } from '@/lib/llm-router';
import crypto from 'crypto';

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

  // Fetch corporate knowledge context
  const docs = await prisma.document.findMany({
    where: { organizationId, isDeleted: false },
    take: 10,
    select: { name: true }
  });

  const decisions = await prisma.decision.findMany({
    where: { organizationId },
    take: 5,
    select: { title: true, recommendation: true, status: true, expectedOutcome: true }
  });

  const contextText = `ENTERPRISE KNOWLEDGE CONTEXT:
Documents: ${docs.map(d => d.name).join(', ') || 'Corporate Knowledge Base'}
Past Decisions: ${decisions.map(d => `${d.title} (${d.recommendation})`).join('; ') || 'None'}`;

  const systemPrompt = `You are the AI Strategy Studio Engine for Synaps (powered by apivault.dev).
Generate a comprehensive, end-to-end strategic document for the user's business objective (e.g., "Expand into UAE").

You MUST perform:
1. Executive Summary & Research
2. Competitor Analysis
3. Market Analysis
4. Risk Analysis
5. Financial Planning & Budget Breakdown
6. Compliance Review
7. Hiring Plan
8. Go-to-Market (GTM) Strategy
9. SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats)
10. Red-Team AI Agent Challenges (Multiple AI agents stress-testing the strategy)
11. Implementation Roadmap Phases (Phase 1, Phase 2, Phase 3 with milestones)

You MUST return valid JSON with the following EXACT structure:
{
  "executiveSummary": "2-3 sentence executive summary",
  "research": "Comprehensive research notes on the strategic objective",
  "competitorAnalysis": {
    "keyCompetitors": ["Competitor A", "Competitor B"],
    "marketDisruption": "Analysis of competitive advantage"
  },
  "marketAnalysis": {
    "addressableMarket": "$1.2B TAM",
    "targetDemographic": "Enterprise Clients",
    "growthRate": "+18% CAGR"
  },
  "riskAnalysis": [
    { "risk": "Regulatory delay", "impact": "HIGH", "mitigation": "Retain local legal counsel" }
  ],
  "financialPlanning": {
    "estimatedBudget": "$500,000",
    "projectedRevenue": "$2.4M ARR",
    "roiEstimate": "380% over 24 months",
    "budgetBreakdown": [
      { "category": "Legal & Licensing", "amount": "$120,000" },
      { "category": "Local Hiring & Talent", "amount": "$200,000" },
      { "category": "Marketing & GTM", "amount": "$180,000" }
    ]
  },
  "complianceReview": [
    { "regulatoryRequirement": "Local Data Sovereignty (GDPR/UAE DPL)", "status": "REQUIRED", "recommendation": "Deploy in regional data centers" }
  ],
  "hiringPlan": [
    { "role": "Regional Managing Director", "headcount": 1, "priority": "HIGH" },
    { "role": "Enterprise Account Executives", "headcount": 3, "priority": "MEDIUM" }
  ],
  "gtmStrategy": {
    "positioning": "Premium Enterprise Security & Memory Intelligence",
    "distributionChannels": ["Direct Enterprise Sales", "Local Partner Network"],
    "pricingStrategy": "Tiered SaaS subscription with dedicated SLA"
  },
  "swotAnalysis": {
    "strengths": ["Proprietary AI Memory Graph", "Strong product-market fit"],
    "weaknesses": ["Limited local brand awareness"],
    "opportunities": ["Rapid enterprise digital transformation in UAE"],
    "threats": ["Established regional incumbents"]
  },
  "redTeamChallenges": [
    {
      "agentRole": "Risk Auditor Agent",
      "challenge": "Underestimating local licensing timelines by 3-4 months.",
      "severity": "CRITICAL",
      "mitigationSuggestion": "Initiate licensing filings immediately in parallel with team hiring."
    },
    {
      "agentRole": "Competitive Strategist Agent",
      "challenge": "Incumbent vendors may offer aggressive bundle discounts.",
      "severity": "HIGH",
      "mitigationSuggestion": "Differentiate strictly on Enterprise Memory Graph capabilities."
    }
  ],
  "implementationPhases": [
    {
      "phase": 1,
      "phaseName": "Phase 1: Foundation & Licensing",
      "duration": "Months 1-3",
      "milestones": ["Complete commercial registration", "Hire Regional MD", "Establish local cloud infrastructure"]
    },
    {
      "phase": 2,
      "phaseName": "Phase 2: GTM Launch & Pilot Clients",
      "duration": "Months 4-6",
      "milestones": ["Launch GTM marketing campaign", "Sign 3 enterprise pilot clients", "Onboard sales team"]
    },
    {
      "phase": 3,
      "phaseName": "Phase 3: Scale & Revenue Expansion",
      "duration": "Months 7-12",
      "milestones": ["Expand to $1M ARR", "Establish partner ecosystem", "Optimize operational margins"]
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

    // Save as Proposal record in Prisma
    const proposal = await prisma.proposal.create({
      data: {
        organizationId,
        title: `Strategy: ${objective}`,
        status: 'DRAFT'
      }
    });

    // Create Git commit event in Organization Timeline
    const shortHash = crypto.createHash('md5').update(`strat-${proposal.id}`).digest('hex').substring(0, 7);
    await prisma.timelineEvent.create({
      data: {
        organizationId,
        commitHash: shortHash,
        title: `Strategy Formulated: ${objective}`,
        description: parsed.executiveSummary || `Strategic plan formulated for ${objective}.`,
        category: 'PRODUCT_LAUNCH',
        eventDate: new Date(),
        metadata: {
          strategyId: proposal.id,
          budget: parsed.financialPlanning?.estimatedBudget,
          roi: parsed.financialPlanning?.roiEstimate
        }
      }
    });

    // Insert Strategy Node into Enterprise Memory Graph
    try {
      const stratEntity = await prisma.graphEntity.create({
        data: {
          organizationId,
          name: `Strategy: ${objective}`,
          type: 'STRATEGY',
          description: parsed.executiveSummary || `Corporate strategy for ${objective}`,
          metadata: {
            swot: parsed.swotAnalysis,
            budget: parsed.financialPlanning,
            redTeam: parsed.redTeamChallenges
          },
          confidenceScore: 0.92
        }
      });
    } catch (graphErr) {
      console.warn("Memory graph integration warning in strategy studio:", graphErr);
    }

    return {
      id: proposal.id,
      objective,
      executiveSummary: parsed.executiveSummary || `Executive Strategy for ${objective}.`,
      research: parsed.research || 'Market research notes.',
      competitorAnalysis: parsed.competitorAnalysis || { keyCompetitors: ['Regional Incumbents'], marketDisruption: 'AI Differentiating' },
      marketAnalysis: parsed.marketAnalysis || { addressableMarket: '$1B+', targetDemographic: 'Enterprise', growthRate: '15%' },
      riskAnalysis: Array.isArray(parsed.riskAnalysis) ? parsed.riskAnalysis : [],
      financialPlanning: parsed.financialPlanning || { estimatedBudget: '$500k', projectedRevenue: '$2M', roiEstimate: '300%', budgetBreakdown: [] },
      complianceReview: Array.isArray(parsed.complianceReview) ? parsed.complianceReview : [],
      hiringPlan: Array.isArray(parsed.hiringPlan) ? parsed.hiringPlan : [],
      gtmStrategy: parsed.gtmStrategy || { positioning: 'Enterprise Leader', distributionChannels: ['Direct Sales'], pricingStrategy: 'Subscription' },
      swotAnalysis: parsed.swotAnalysis || { strengths: [], weaknesses: [], opportunities: [], threats: [] },
      redTeamChallenges: Array.isArray(parsed.redTeamChallenges) ? parsed.redTeamChallenges : [],
      implementationPhases: Array.isArray(parsed.implementationPhases) ? parsed.implementationPhases : [],
      createdAt: proposal.createdAt.toISOString()
    };

  } catch (error) {
    console.error("Error in generateEnterpriseStrategy:", error);
    throw error;
  }
}
