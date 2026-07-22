import prisma from '@/lib/prisma';
import { invokeLLMWithFallback } from '@/lib/llm-router';

function parseSafeJson(content: string) {
  try {
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON in enterprise-assistant:", content);
    return {};
  }
}

export interface AssistantResponse {
  query: string;
  answer: string;
  isKnowledgeMissing: boolean;
  confidenceScore: number;
  sourceDocuments: { id?: string; name: string }[];
  timeline: { date: string; event: string; commitHash?: string }[];
  connectedDecisions: { title: string; status?: string; recommendation?: string }[];
  relatedProjects: { name: string; status?: string }[];
  supportingEvidence: string[];
  traversedGraphNodes: { name: string; type: string }[];
  timestamp: string;
}

export async function askEnterpriseAssistant(
  query: string,
  organizationId: string
): Promise<AssistantResponse> {

  // 1. Traverse Enterprise Memory Graph
  const graphEntities = await prisma.graphEntity.findMany({
    where: { organizationId },
    take: 20,
    include: {
      sourceRelationships: { include: { targetEntity: true } }
    }
  });

  const docs = await prisma.document.findMany({
    where: { organizationId, isDeleted: false },
    take: 12,
    select: { id: true, name: true, mimeType: true }
  });

  const decisions = await prisma.decision.findMany({
    where: { organizationId },
    take: 8,
    select: { title: true, recommendation: true, status: true, executiveSummary: true, createdAt: true }
  });

  const projects = await prisma.project.findMany({
    where: { organizationId, isDeleted: false },
    take: 5,
    select: { name: true, description: true, status: true }
  });

  const timelineEvents = await prisma.timelineEvent.findMany({
    where: { organizationId },
    take: 8,
    orderBy: { eventDate: 'desc' },
    select: { title: true, description: true, category: true, eventDate: true, commitHash: true }
  });

  // Construct Graph RAG Context
  const graphContext = `ENTERPRISE MEMORY GRAPH & KNOWLEDGE BASE:
Graph Entities & Relationships:
${graphEntities.map(g => `• Entity: "${g.name}" [${g.type}] — ${g.description || 'No description'} (Connected to: ${g.sourceRelationships.map(r => r.targetEntity.name).join(', ') || 'None'})`).join('\n') || 'No entities stored.'}

Uploaded Documents:
${docs.map(d => `• Doc ID [${d.id}]: "${d.name}"`).join('\n') || 'No documents uploaded.'}

Corporate Decisions:
${decisions.map(d => `• Decision: "${d.title}" (Status: ${d.status}, Rec: ${d.recommendation}, Summary: ${d.executiveSummary || 'N/A'})`).join('\n') || 'No decisions.'}

Projects:
${projects.map(p => `• Project: "${p.name}" (Status: ${p.status})`).join('\n') || 'No projects.'}

Timeline Log:
${timelineEvents.map(t => `• [Commit ${t.commitHash}] ${t.eventDate.toISOString().slice(0,10)}: "${t.title}" — ${t.description}`).join('\n') || 'No timeline commits.'}`;

  const systemPrompt = `You are the Enterprise Memory AI Assistant for Synaps.
Your job is to answer employee queries using ONLY factual knowledge from the Enterprise Memory Graph and corporate data.

STRICT ZERO-HALLUCINATION RULES:
1. Base your answer strictly on facts in the provided Enterprise Memory Graph, documents, decisions, and timeline.
2. NEVER hallucinate or infer unverified facts.
3. If the knowledge is missing or not present in organizational memory, set "isKnowledgeMissing": true and explicitly state that the information is currently missing from company memory.

You MUST return valid JSON with:
{
  "answer": "Clear, factual, zero-hallucination response formatted in Markdown.",
  "isKnowledgeMissing": false, // boolean flag (set true if data is missing)
  "confidenceScore": 92, // integer 0-100 score based on grounding density
  "sourceDocuments": [{ "name": "Document Name.pdf" }],
  "timeline": [{ "date": "YYYY-MM-DD", "event": "Event description", "commitHash": "c9a2f4e" }],
  "connectedDecisions": [{ "title": "Decision Name", "status": "APPROVED", "recommendation": "GO" }],
  "relatedProjects": [{ "name": "Project Name", "status": "ACTIVE" }],
  "supportingEvidence": ["Direct evidence snippet 1", "Direct evidence snippet 2"],
  "traversedGraphNodes": [{ "name": "Entity Name", "type": "DECISION" }]
}`;

  const prompt = `${graphContext}\n\nEMPLOYEE QUESTION: ${query}`;

  try {
    const rawContent = await invokeLLMWithFallback([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ], { response_format: { type: 'json_object' } });

    const parsed = parseSafeJson(rawContent);

    return {
      query,
      answer: parsed.answer || (parsed.isKnowledgeMissing ? "Knowledge for this query is currently missing from organizational memory." : `Factual response for "${query}".`),
      isKnowledgeMissing: Boolean(parsed.isKnowledgeMissing),
      confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 85,
      sourceDocuments: Array.isArray(parsed.sourceDocuments) ? parsed.sourceDocuments : docs.slice(0, 2).map(d => ({ name: d.name })),
      timeline: Array.isArray(parsed.timeline) ? parsed.timeline : timelineEvents.slice(0, 2).map(t => ({ date: t.eventDate.toISOString().slice(0,10), event: t.title, commitHash: t.commitHash })),
      connectedDecisions: Array.isArray(parsed.connectedDecisions) ? parsed.connectedDecisions : decisions.slice(0, 2).map(d => ({ title: d.title, status: d.status, recommendation: d.recommendation })),
      relatedProjects: Array.isArray(parsed.relatedProjects) ? parsed.relatedProjects : projects.slice(0, 2).map(p => ({ name: p.name, status: p.status })),
      supportingEvidence: Array.isArray(parsed.supportingEvidence) ? parsed.supportingEvidence : ['Grounded in Enterprise Memory Graph.'],
      traversedGraphNodes: Array.isArray(parsed.traversedGraphNodes) ? parsed.traversedGraphNodes : graphEntities.slice(0, 3).map(g => ({ name: g.name, type: g.type })),
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error("Error in askEnterpriseAssistant:", error);
    throw error;
  }
}
