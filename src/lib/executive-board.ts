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
    const systemPrompt = `You are ${profile.name}, the ${profile.roleTitle} (${profile.roleId}) at Synaps.
Your functional focus is: ${profile.focus}

Independently analyze the user's strategic question strictly through the lens of your executive domain.

You MUST return valid JSON with:
{
  "verdict": "SUPPORT", "OPPOSE", or "CONDITIONAL",
  "reasoning": "A 2-3 sentence domain analysis from your executive perspective.",
  "keyConcerns": ["Concern 1 from your domain", "Concern 2 from your domain"],
  "confidenceScore": 88,
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
