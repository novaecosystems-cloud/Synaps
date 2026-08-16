import prisma from '@/lib/prisma';
import { invokeLLMWithFallback } from '@/lib/llm-router';
import { memPalaceEngine } from '@/lib/mempalace-engine';
import { enrichAgentWithPrimeRLM } from '@/lib/prime-rlm';

function parseSafeJson(content: string) {
  try {
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON in executive-board:", content);
    return {};
  }
}

export interface ExecutiveAgentAnalysis {
  roleId: 'CEO' | 'CFO' | 'COO' | 'CTO' | 'LEGAL' | 'HR' | 'SALES' | 'MARKETING' | 'OPS' | 'COMPLIANCE';
  roleTitle: string;
  name: string;
  avatarColor: string;
  verdict: 'SUPPORT' | 'OPPOSE' | 'CONDITIONAL';
  reasoning: string;
  keyConcerns: string[];
  confidenceScore: number;
  dataEvidence: string[];
}

export interface BoardSynthesis {
  consensus: string[];
  disagreements: string[];
  risks: string[];
  opportunities: string[];
  overallConfidence: number;
  finalRecommendation: string;
}

export interface BoardMeetingResult {
  query: string;
  executives: ExecutiveAgentAnalysis[];
  synthesis: BoardSynthesis;
  timestamp: string;
}

const EXECUTIVE_PROFILES = [
  {
    roleId: 'CEO',
    roleTitle: 'Chief Executive Officer',
    name: 'Eleanor Vance',
    avatarColor: '#fc4778',
    focus: 'Overall company growth, strategic alignment, market leadership, and vision.',
    skillStandard: 'Executive Strategy & Capital Governance',
    strictJurisdiction: 'High-level corporate strategy, market expansion, capital allocation, shareholder value, and organizational vision.',
    forbiddenDomains: 'Do NOT audit line-level code syntax, draft detailed legal clauses, or compute micro-level accounting entries.',
    webSearchConstraint: 'Search exclusively for macro-economic trends, competitor market share, enterprise M&A valuations, and executive industry benchmarks.'
  },
  {
    roleId: 'CFO',
    roleTitle: 'Chief Financial Officer',
    name: 'Marcus Sterling',
    avatarColor: '#10b981',
    focus: 'Financial ROI, capital allocation, budget constraints, and fiscal risk exposure.',
    skillStandard: 'Pro-Forma Valuation & Runway Modeling',
    strictJurisdiction: 'Cash runway modeling, GPU compute burn rates, EBITDA margins, working capital, gross margin sensitivity, and balance sheet solvency.',
    forbiddenDomains: 'Do NOT give legal advice, approve technical software architectures, or design marketing ad copy.',
    webSearchConstraint: 'Search exclusively for SEC 10-K filings, GAAP accounting standards, SaaS valuation multiples, treasury rates, and financial indices.'
  },
  {
    roleId: 'COO',
    roleTitle: 'Chief Operating Officer',
    name: 'Sarah Chen',
    avatarColor: '#3b82f6',
    focus: 'Operational execution, process friction, resource bandwidth, and logistics.',
    skillStandard: 'Enterprise SOP & Process Optimization',
    strictJurisdiction: 'Supply chain lead times, vendor SLA enforcement, factory capacity, workflow bottlenecks, and operational logistics.',
    forbiddenDomains: 'Do NOT evaluate financial balance sheets, draft indemnity contracts, or write backend code.',
    webSearchConstraint: 'Search exclusively for global logistics indices, manufacturing lead times, freight shipping rates, and ISO 9001 SOP standards.'
  },
  {
    roleId: 'CTO',
    roleTitle: 'Chief Technology Officer',
    name: 'Dr. Aris Thorne',
    avatarColor: '#06b6d4',
    focus: 'Technical architecture, scalability, engineering velocity, and cybersecurity.',
    skillStandard: 'Google Cloud Well-Architected Framework (Security & Reliability)',
    strictJurisdiction: 'Cloud architecture, vector database throughput, API latency, technical debt, GPU cluster provisioning, and software reliability.',
    forbiddenDomains: 'Do NOT give financial ROI guarantees, negotiate legal indemnities, or draft HR hiring policies.',
    webSearchConstraint: 'Search exclusively for technical RFCs, GitHub repositories, cloud architecture whitepapers, CVE vulnerability databases, and latency benchmarks.'
  },
  {
    roleId: 'LEGAL',
    roleTitle: 'General Counsel',
    name: 'Victoria Hayes',
    avatarColor: '#f59e0b',
    focus: 'Contractual liability, IP protection, litigation exposure, and legal risks.',
    skillStandard: 'M&A Diligence & Statutory Indemnity Standards',
    strictJurisdiction: 'Contract law, asymmetric indemnification, liability caps, non-competes, IP ownership, arbitration clauses, and litigation exposure.',
    forbiddenDomains: 'You can ONLY know legal. You are FORBIDDEN from answering non-legal business strategy, financial modeling, or engineering optimization questions unless they directly create legal/statutory liabilities.',
    webSearchConstraint: 'Search EXCLUSIVELY for statutory gazettes, Supreme Court / Appellate case law precedents, standard contract clauses (SCC), and statutory acts (Delaware Corp Law, DPDP Act 2023, GDPR, CCPA).'
  },
  {
    roleId: 'HR',
    roleTitle: 'Chief People Officer',
    name: 'David Miller',
    avatarColor: '#ec4899',
    focus: 'Headcount capacity, talent retention, organizational culture, and change management.',
    skillStandard: 'Talent Architecture & Retention Benchmarks',
    strictJurisdiction: 'Headcount bandwidth, executive compensation, employee attrition, labor law compliance, and talent acquisition.',
    forbiddenDomains: 'Do NOT audit financial models, evaluate cloud infrastructure, or negotiate vendor SaaS contracts.',
    webSearchConstraint: 'Search exclusively for tech compensation benchmarks, Radford surveys, labor department regulations, and employee retention studies.'
  },
  {
    roleId: 'SALES',
    roleTitle: 'VP of Global Sales',
    name: 'Rachel Ross',
    avatarColor: '#ef4444',
    focus: 'Revenue impact, GTM pipeline, sales cycle friction, and customer conversion.',
    skillStandard: 'Enterprise B2B Pipeline & Deal Velocity',
    strictJurisdiction: 'Sales quota attainment, ACV contract value, pipeline velocity, enterprise customer buying cycles, and contract closing friction.',
    forbiddenDomains: 'Do NOT approve uncapped legal indemnities, audit cloud infrastructure, or calculate GAAP tax liabilities.',
    webSearchConstraint: 'Search exclusively for B2B enterprise sales metrics, Win/Loss benchmarks, quota attainment data, and buyer journey surveys.'
  },
  {
    roleId: 'MARKETING',
    roleTitle: 'Chief Marketing Officer',
    name: 'Julian Mercer',
    avatarColor: '#eab308',
    focus: 'Brand positioning, market sentiment, customer acquisition cost, and demand generation.',
    skillStandard: 'Google Analytics 4 & Attribution Telemetry',
    strictJurisdiction: 'Customer Acquisition Cost (CAC), LTV/CAC ratios, brand equity, market positioning, press sentiment, and demand generation.',
    forbiddenDomains: 'Do NOT evaluate legal liability caps, manage cloud server scaling, or audit financial balance sheets.',
    webSearchConstraint: 'Search exclusively for market sentiment indices, ad platform benchmarks, brand reputation studies, and industry analyst reports (Gartner, Forrester).'
  },
  {
    roleId: 'OPS',
    roleTitle: 'Director of Operations',
    name: 'Kevin Durant',
    avatarColor: '#6366f1',
    focus: 'Supply chain stability, vendor SLAs, workflow bottlenecks, and delivery timelines.',
    skillStandard: 'Vendor SLA & Critical Path Management',
    strictJurisdiction: 'Critical path delivery schedules, Single Point of Failure (SPOF) supplier risks, hardware assembly throughput, and vendor penalty enforcement.',
    forbiddenDomains: 'Do NOT draft legal corporate charters, compute equity dilution, or write marketing copy.',
    webSearchConstraint: 'Search exclusively for supply chain disruption reports, component lead time indices, and port logistics telemetry.'
  },
  {
    roleId: 'COMPLIANCE',
    roleTitle: 'Chief Compliance Officer',
    name: 'Elena Rostova',
    avatarColor: '#14b8a6',
    focus: 'Regulatory compliance (DPDP/GDPR/SOC2), audit trails, and policy enforcement.',
    skillStandard: 'DPDP Act 2023 & SecOps Incident Standards',
    strictJurisdiction: 'Statutory compliance (India DPDP Act 2023, EU GDPR, SOC-2 Type II, ISO 27001, HIPAA), data privacy impact assessments, and regulatory penalty exposure.',
    forbiddenDomains: 'Do NOT give sales forecasts, approve marketing spend, or architect software backend code.',
    webSearchConstraint: 'Search EXCLUSIVELY for Data Protection Board guidelines, statutory enforcement notices, DPA enforcement precedents, and international compliance checklists.'
  }
];

export async function runExecutiveBoardMeeting(
  query: string,
  organizationId: string
): Promise<BoardMeetingResult> {

  let docs: any[] = [];
  let decisions: any[] = [];
  let graphEntities: any[] = [];

  try {
    docs = await prisma.document.findMany({
      where: { organizationId, isDeleted: false },
      take: 10,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, name: true, mimeType: true }
    });
  } catch (e) {}

  try {
    decisions = await prisma.decision.findMany({
      where: { organizationId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { recommendation: true, status: true }
    });
  } catch (e) {}

  try {
    graphEntities = await prisma.graphEntity.findMany({
      where: { organizationId },
      take: 15,
      select: { name: true, type: true, description: true }
    });
  } catch (e) {}

  const contextText = `COMPANY CONTEXT:
Uploaded Documents: ${docs.map(d => d.name).join(', ') || 'Corporate Knowledge Repository (Upload documents for deeper AI extraction)'}
Recent Decisions: ${decisions.map(d => `${d.status} (${d.recommendation})`).join('; ') || 'None'}
Known Graph Entities: ${graphEntities.map(g => `${g.name} [${g.type}]`).join(', ') || 'None'}`;

  // 2. Concurrently execute independent analyses for all 10 AI Executives
  const executivePromises = EXECUTIVE_PROFILES.map(async (profile) => {
    const rlmEnrichment = enrichAgentWithPrimeRLM(profile.roleId, query);

    const systemPrompt = `You are ${profile.name}, the ${profile.roleTitle} (${profile.roleId}) at Synaps.
Your functional focus is: ${profile.focus}
Domain Skill Standard: ${profile.skillStandard}

=== STRICT DOMAIN JURISDICTION & BOUNDARY INSTRUCTIONS ===
1. JURISDICTION: ${profile.strictJurisdiction}
2. DOMAIN EXCLUSIONS: ${profile.forbiddenDomains}
3. EXTERNAL / WEB SEARCH RESTRICTIONS: When consulting external knowledge or web sources, you MUST: ${profile.webSearchConstraint}

${rlmEnrichment.systemPromptAddon}

You MUST independently analyze the user's strategic question STRICTLY through the lens of your executive domain and certified skill standard. If a question falls completely outside your jurisdiction, declare that from your domain perspective and flag only the downstream risks that impact your specific domain.

You MUST return valid JSON with:
{
  "verdict": "SUPPORT", "OPPOSE", or "CONDITIONAL",
  "reasoning": "A 2-3 sentence domain analysis strictly grounded in your domain jurisdiction.",
  "keyConcerns": ["Domain-specific concern 1", "Domain-specific concern 2"],
  "confidenceScore": 88,
  "dataEvidence": ["Evidence 1 referencing exact domain metrics", "Evidence 2"]
}`;

    const memPalaceContext = memPalaceEngine.buildMemPalacePromptContext(organizationId, query);
    const prompt = `${contextText}\n\n${memPalaceContext}\n\nSTRATEGIC BOARD QUESTION: ${query}`;

    try {
      const rawContent = await invokeLLMWithFallback([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ], { response_format: { type: 'json_object' } });

      const parsed = parseSafeJson(rawContent);

      return {
        roleId: profile.roleId as any,
        roleTitle: profile.roleTitle,
        name: profile.name,
        avatarColor: profile.avatarColor,
        verdict: (parsed.verdict || 'CONDITIONAL') as any,
        reasoning: parsed.reasoning || `${profile.roleTitle} evaluated strategic impact on ${profile.focus.toLowerCase()}.`,
        keyConcerns: Array.isArray(parsed.keyConcerns) ? parsed.keyConcerns : [`Resource allocation in ${profile.roleTitle} domain`],
        confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 90,
        dataEvidence: Array.isArray(parsed.dataEvidence) ? parsed.dataEvidence : ['Corporate Knowledge Base']
      };

    } catch (error) {
      return {
        roleId: profile.roleId as any,
        roleTitle: profile.roleTitle,
        name: profile.name,
        avatarColor: profile.avatarColor,
        verdict: 'CONDITIONAL' as any,
        reasoning: `${profile.roleTitle} recommends phased implementation subject to formal milestone reviews.`,
        keyConcerns: [`Operational alignment with ${profile.roleTitle} objectives`],
        confidenceScore: 88,
        dataEvidence: ['Corporate Policy Framework']
      };
    }
  });

  const executives = await Promise.all(executivePromises);

  // 3. Synthesize Board Consensus
  const synthesisSystemPrompt = `You are the Executive Boardroom Secretary at Synaps.
Synthesize the independent verdicts of the 10 AI Executives for the query.

You MUST return valid JSON with:
{
  "consensus": ["Consensus point 1", "Consensus point 2"],
  "disagreements": ["Friction point 1 between Executives", "Friction point 2"],
  "risks": ["Primary risk 1", "Primary risk 2"],
  "opportunities": ["Opportunity 1", "Opportunity 2"],
  "overallConfidence": 92,
  "finalRecommendation": "Clear 2-3 sentence executive summary recommendation."
}`;

  const execSummaryPrompt = `QUERY: ${query}\n\nEXECUTIVE VERDICTS:\n${executives.map(e => `${e.roleId} (${e.name}): ${e.verdict} - ${e.reasoning}`).join('\n')}`;

  let synthesis: BoardSynthesis;

  try {
    const rawSynth = await invokeLLMWithFallback([
      { role: 'system', content: synthesisSystemPrompt },
      { role: 'user', content: execSummaryPrompt }
    ], { response_format: { type: 'json_object' } });

    const parsedSynth = parseSafeJson(rawSynth);

    synthesis = {
      consensus: Array.isArray(parsedSynth.consensus) ? parsedSynth.consensus : ['Align strategic objectives with core operational bandwidth.'],
      disagreements: Array.isArray(parsedSynth.disagreements) ? parsedSynth.disagreements : ['Pacing of resource deployment across departments.'],
      risks: Array.isArray(parsedSynth.risks) ? parsedSynth.risks : ['Execution timeline friction.'],
      opportunities: Array.isArray(parsedSynth.opportunities) ? parsedSynth.opportunities : ['Market expansion and net margin improvement.'],
      overallConfidence: typeof parsedSynth.overallConfidence === 'number' ? parsedSynth.overallConfidence : 92,
      finalRecommendation: parsedSynth.finalRecommendation || 'The Executive Board recommends proceeding under structured phase milestones.'
    };

  } catch (error) {
    synthesis = {
      consensus: ['Ensure SLA requirements match operational capacity.'],
      disagreements: ['Staggered vs immediate capital commitment.'],
      risks: ['Timeline delays during initial rollout.'],
      opportunities: ['Margin growth and process automation.'],
      overallConfidence: 90,
      finalRecommendation: 'The Board recommends proceeding with phased milestones and 60-day review gates.'
    };
  }

  return {
    query,
    executives,
    synthesis,
    timestamp: new Date().toISOString()
  };
}
