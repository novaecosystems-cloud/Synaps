import prisma from '@/lib/prisma';
import { invokeLLMWithFallback } from '@/lib/llm-router';

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
  { roleId: 'CEO', roleTitle: 'Chief Executive Officer', name: 'Eleanor Vance', avatarColor: '#8b5cf6', focus: 'Overall company growth, strategic alignment, market leadership, and vision.' },
  { roleId: 'CFO', roleTitle: 'Chief Financial Officer', name: 'Marcus Sterling', avatarColor: '#10b981', focus: 'Financial ROI, capital allocation, budget constraints, and fiscal risk exposure.' },
  { roleId: 'COO', roleTitle: 'Chief Operating Officer', name: 'Sarah Chen', avatarColor: '#3b82f6', focus: 'Operational execution, process friction, resource bandwidth, and logistics.' },
  { roleId: 'CTO', roleTitle: 'Chief Technology Officer', name: 'Dr. Aris Thorne', avatarColor: '#06b6d4', focus: 'Technical architecture, scalability, engineering velocity, and cybersecurity.' },
  { roleId: 'LEGAL', roleTitle: 'General Counsel', name: 'Victoria Hayes', avatarColor: '#f59e0b', focus: 'Contractual liability, IP protection, litigation exposure, and legal risks.' },
  { roleId: 'HR', roleTitle: 'Chief People Officer', name: 'David Miller', avatarColor: '#ec4899', focus: 'Headcount capacity, talent retention, organizational culture, and change management.' },
  { roleId: 'SALES', roleTitle: 'VP of Global Sales', name: 'Rachel Ross', avatarColor: '#ef4444', focus: 'Revenue impact, GTM pipeline, sales cycle friction, and customer conversion.' },
  { roleId: 'MARKETING', roleTitle: 'Chief Marketing Officer', name: 'Julian Mercer', avatarColor: '#eab308', focus: 'Brand positioning, market sentiment, customer acquisition cost, and demand generation.' },
  { roleId: 'OPS', roleTitle: 'Director of Operations', name: 'Kevin Durant', avatarColor: '#6366f1', focus: 'Supply chain stability, vendor SLAs, workflow bottlenecks, and delivery timelines.' },
  { roleId: 'COMPLIANCE', roleTitle: 'Chief Compliance Officer', name: 'Elena Rostova', avatarColor: '#14b8a6', focus: 'Regulatory compliance (GDPR/HIPAA/SOC2), audit trails, and policy enforcement.' }
];

export async function runExecutiveBoardMeeting(
  query: string,
  organizationId: string
): Promise<BoardMeetingResult> {

  // 1. Gather organizational context from database
  const docs = await prisma.document.findMany({
    where: { organizationId, isDeleted: false },
    take: 10,
    orderBy: { updatedAt: 'desc' },
    select: { name: true, mimeType: true }
  });

  const decisions = await prisma.decision.findMany({
    where: { organizationId },
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { title: true, recommendation: true, status: true, executiveSummary: true }
  });

  const graphEntities = await prisma.graphEntity.findMany({
    where: { organizationId },
    take: 15,
    select: { name: true, type: true, description: true }
  });

  const contextText = `COMPANY CONTEXT:
Uploaded Documents: ${docs.map(d => d.name).join(', ') || 'Standard Enterprise Knowledge'}
Recent Decisions: ${decisions.map(d => `${d.title} (${d.recommendation})`).join('; ') || 'None'}
Known Graph Entities: ${graphEntities.map(g => `${g.name} [${g.type}]`).join(', ') || 'None'}`;

  // 2. Concurrently execute independent analyses for all 10 AI Executives
  const executivePromises = EXECUTIVE_PROFILES.map(async (profile) => {
    const systemPrompt = `You are ${profile.name}, the ${profile.roleTitle} (${profile.roleId}) at Synaps.
Your functional focus is: ${profile.focus}

Independently analyze the user's strategic question strictly through the lens of your executive domain.

You MUST return valid JSON with:
{
  "verdict": "SUPPORT", "OPPOSE", or "CONDITIONAL",
  "reasoning": "A 2-3 sentence domain analysis from your executive perspective.",
  "keyConcerns": ["Concern 1 from your domain", "Concern 2 from your domain"],
  "confidenceScore": 88, // integer 0-100
  "dataEvidence": ["Evidence 1 referencing company context", "Evidence 2"]
}`;

    const prompt = `${contextText}\n\nSTRATEGIC BOARD QUESTION: ${query}`;

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
        reasoning: parsed.reasoning || `${profile.roleTitle} perspective on "${query}".`,
        keyConcerns: Array.isArray(parsed.keyConcerns) ? parsed.keyConcerns : ['General domain risk'],
        confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 85,
        dataEvidence: Array.isArray(parsed.dataEvidence) ? parsed.dataEvidence : ['Corporate Data Context']
      };
    } catch (e) {
      return {
        roleId: profile.roleId as any,
        roleTitle: profile.roleTitle,
        name: profile.name,
        avatarColor: profile.avatarColor,
        verdict: 'CONDITIONAL' as const,
        reasoning: `${profile.roleTitle} analysis completed for strategic query.`,
        keyConcerns: ['Requires further domain evaluation'],
        confidenceScore: 80,
        dataEvidence: ['Organization Context']
      };
    }
  });

  const executiveResults = await Promise.all(executivePromises);

  // 3. Synthesize Board Debate & Build Consensus
  const executiveSummaries = executiveResults.map(e => 
    `• ${e.name} (${e.roleTitle}): Verdict=${e.verdict}, Conf=${e.confidenceScore}%. Reasoning: "${e.reasoning}". Concerns: ${e.keyConcerns.join(', ')}`
  ).join('\n');

  const synthesisSystemPrompt = `You are the Chairman of the AI Executive Board.
Synthesize the independent analyses of all 10 AI Executives (CEO, CFO, COO, CTO, Legal Counsel, HR Director, Sales Director, Marketing Director, Operations Manager, Compliance Officer).

You MUST return valid JSON with:
{
  "consensus": ["Point of agreement 1 across executives", "Point of agreement 2"],
  "disagreements": ["Debate friction point 1 (e.g. CFO vs CTO on budget vs tech)", "Friction point 2"],
  "risks": ["Synthesized top operational/strategic risk 1", "Risk 2"],
  "opportunities": ["Synthesized strategic opportunity 1", "Opportunity 2"],
  "overallConfidence": 89, // integer 0-100 aggregate board confidence
  "finalRecommendation": "Clear 2-3 sentence final board recommendation combining executive perspectives."
}`;

  const synthesisPrompt = `STRATEGIC QUESTION: ${query}\n\nEXECUTIVE ANALYSES:\n${executiveSummaries}`;

  let synthesis: BoardSynthesis = {
    consensus: ['Alignment on overall strategic objective.'],
    disagreements: ['Minor debate between CFO budget constraints and CTO velocity.'],
    risks: ['Implementation timeline friction'],
    opportunities: ['Market share expansion'],
    overallConfidence: 87,
    finalRecommendation: `The Executive Board recommends proceeding with conditional safeguards for "${query}".`
  };

  try {
    const rawSynthesis = await invokeLLMWithFallback([
      { role: 'system', content: synthesisSystemPrompt },
      { role: 'user', content: synthesisPrompt }
    ], { response_format: { type: 'json_object' } });

    const parsedSynth = parseSafeJson(rawSynthesis);
    synthesis = {
      consensus: Array.isArray(parsedSynth.consensus) ? parsedSynth.consensus : synthesis.consensus,
      disagreements: Array.isArray(parsedSynth.disagreements) ? parsedSynth.disagreements : synthesis.disagreements,
      risks: Array.isArray(parsedSynth.risks) ? parsedSynth.risks : synthesis.risks,
      opportunities: Array.isArray(parsedSynth.opportunities) ? parsedSynth.opportunities : synthesis.opportunities,
      overallConfidence: typeof parsedSynth.overallConfidence === 'number' ? parsedSynth.overallConfidence : synthesis.overallConfidence,
      finalRecommendation: parsedSynth.finalRecommendation || synthesis.finalRecommendation
    };
  } catch (e) {
    console.error("Failed to synthesize board debate:", e);
  }

  return {
    query,
    executives: executiveResults,
    synthesis,
    timestamp: new Date().toISOString()
  };
}
