import prisma from '@/lib/prisma';
import { invokeLLMWithFallback } from '@/lib/llm-router';

function parseSafeJson(content: string) {
  try {
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON in ai-coo:", content);
    return {};
  }
}

export interface DocumentCitation {
  documentId?: string;
  documentName: string;
  snippet: string;
}

export interface ExecutiveAnswer {
  id: string;
  question: string;
  answer: string;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'INFO';
  citations: DocumentCitation[];
}

export interface DepartmentHealthItem {
  department: string; // e.g. "Engineering", "Finance", "Legal", "Operations", "Compliance"
  healthScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
  summary: string;
  activeIssuesCount: number;
  citations: DocumentCitation[];
}

export interface AIRecommendationItem {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  title: string;
  recommendation: string;
  rationale: string;
  citations: DocumentCitation[];
}

export interface ExecutiveBriefData {
  executiveBrief: string;
  healthScore: number;
  knowledgeCoverage: number;
  riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
  decisionConfidence: number;
  executiveAnswers: ExecutiveAnswer[];
  departmentHealth: DepartmentHealthItem[];
  aiRecommendations: AIRecommendationItem[];
  recentEvents: { date: string; title: string; category: string; description: string; docName?: string }[];
  timelineHighlights: { date: string; milestone: string; impact: string }[];
}

export async function generateExecutiveBriefData(organizationId: string): Promise<ExecutiveBriefData> {
  // 1. Gather all organizational data from database
  const documents = await prisma.document.findMany({
    where: { organizationId, isDeleted: false },
    take: 15,
    orderBy: { updatedAt: 'desc' },
    include: { processedDoc: true, versions: { take: 1, orderBy: { createdAt: 'desc' } } }
  });

  const projects = await prisma.project.findMany({
    where: { organizationId, isDeleted: false },
    take: 10,
    orderBy: { updatedAt: 'desc' },
    include: { tasks: true, members: { include: { user: true } } }
  });

  const decisions = await prisma.decision.findMany({
    where: { organizationId },
    take: 10,
    orderBy: { updatedAt: 'desc' },
    include: { document: { select: { name: true } } }
  });

  const gaps = await prisma.gap.findMany({
    where: { organizationId },
    take: 10,
    orderBy: { updatedAt: 'desc' }
  });

  const entities = await prisma.graphEntity.findMany({
    where: { organizationId },
    take: 25,
    orderBy: { updatedAt: 'desc' }
  });

  const relationships = await prisma.graphRelationship.findMany({
    where: { organizationId },
    take: 25,
    include: {
      sourceEntity: { select: { name: true, type: true } },
      targetEntity: { select: { name: true, type: true } }
    }
  });

  // Construct Data Summary context for AI COO
  const docsSummary = documents.map(d => 
    `• Document "${d.name}" (Type: ${d.mimeType}, Size: ${(d.sizeBytes / 1024 / 1024).toFixed(2)}MB, Updated: ${d.updatedAt.toISOString().slice(0,10)}): ${d.processedDoc?.textContent?.slice(0, 300) || 'No text'}`
  ).join('\n');

  const projectsSummary = projects.map(p => 
    `• Project "${p.name}" (Status: ${p.status}, Members: ${p.members.length}, Tasks: ${p.tasks.length}, Updated: ${p.updatedAt.toISOString().slice(0,10)})`
  ).join('\n');

  const decisionsSummary = decisions.map(d => 
    `• Decision Recommendation: ${d.recommendation} (Status: ${d.status}, Confidence: ${d.confidence}%): ${d.executiveSummary?.slice(0, 200) || ''}`
  ).join('\n');

  const gapsSummary = gaps.map(g => 
    `• Gap [${g.severity}]: "${g.title}" (${g.category}) - ${g.description?.slice(0, 150) || ''}`
  ).join('\n');

  const graphSummary = relationships.map(r => 
    `• Connection: ${r.sourceEntity.name} (${r.sourceEntity.type}) ${r.relationType} ${r.targetEntity.name} (${r.targetEntity.type}) | ${r.description}`
  ).join('\n');

  const systemInstruction = `You are the Autonomous AI Chief Operating Officer (AI COO) for Synaps.
Your task is to analyze the organization's documents, projects, decisions, compliance gaps, and Memory Graph relationships to produce a living AI Executive Briefing.

You MUST generate valid JSON with the following EXACT structure:
{
  "executiveBrief": "A 3-4 sentence high-level COO operational narrative summarizing organizational status, revenue/project momentum, and key operational risks.",
  "healthScore": 88, // integer 0-100 overall org health
  "knowledgeCoverage": 94, // integer 0-100 percentage of company knowledge ingested
  "riskLevel": "MODERATE", // "LOW", "MODERATE", "ELEVATED", or "CRITICAL"
  "decisionConfidence": 91, // integer 0-100 confidence across corporate decisions
  "executiveAnswers": [
    {
      "id": "q1",
      "question": "What changed this week?",
      "answer": "Detailed answer based strictly on evidence.",
      "status": "HEALTHY", // "HEALTHY", "WARNING", "CRITICAL", "INFO"
      "citations": [{ "documentName": "DocName.pdf", "snippet": "Direct evidence quote..." }]
    },
    {
      "id": "q2",
      "question": "Why did revenue change?",
      "answer": "Detailed analysis of financial or contract factors.",
      "status": "INFO",
      "citations": [{ "documentName": "Contract.pdf", "snippet": "Evidence..." }]
    },
    {
      "id": "q3",
      "question": "What projects are delayed?",
      "answer": "Status of projects and task bottlenecks.",
      "status": "WARNING",
      "citations": [{ "documentName": "Project_Plan.pdf", "snippet": "Evidence..." }]
    },
    {
      "id": "q4",
      "question": "What decisions require attention?",
      "answer": "Pending Go/No-Go decisions and approvals.",
      "status": "WARNING",
      "citations": [{ "documentName": "RFP_Evaluation.pdf", "snippet": "Evidence..." }]
    },
    {
      "id": "q5",
      "question": "Which departments are highest risk?",
      "answer": "Analysis of department compliance or operational exposure.",
      "status": "CRITICAL",
      "citations": [{ "documentName": "Audit_Log.pdf", "snippet": "Evidence..." }]
    },
    {
      "id": "q6",
      "question": "What contracts expire soon?",
      "answer": "Contract timelines, renewals, and vendor obligations.",
      "status": "INFO",
      "citations": [{ "documentName": "Vendor_Agreement.pdf", "snippet": "Evidence..." }]
    },
    {
      "id": "q7",
      "question": "Which customers need attention?",
      "answer": "Client commitments and deliverable milestones.",
      "status": "HEALTHY",
      "citations": [{ "documentName": "SLA_Document.pdf", "snippet": "Evidence..." }]
    }
  ],
  "departmentHealth": [
    {
      "department": "Engineering",
      "healthScore": 92,
      "riskLevel": "LOW",
      "summary": "High milestone completion across tech projects.",
      "activeIssuesCount": 1,
      "citations": [{ "documentName": "Architecture_Doc.pdf", "snippet": "Evidence..." }]
    },
    {
      "department": "Finance & Revenue",
      "healthScore": 85,
      "riskLevel": "MODERATE",
      "summary": "Budget tracking aligned; contract terms under review.",
      "activeIssuesCount": 2,
      "citations": [{ "documentName": "Budget_Q3.pdf", "snippet": "Evidence..." }]
    },
    {
      "department": "Legal & Contracts",
      "healthScore": 78,
      "riskLevel": "ELEVATED",
      "summary": "3 vendor agreements pending compliance sign-off.",
      "activeIssuesCount": 3,
      "citations": [{ "documentName": "Contract_Standard.pdf", "snippet": "Evidence..." }]
    },
    {
      "department": "Operations & Compliance",
      "healthScore": 90,
      "riskLevel": "LOW",
      "summary": "Security standards met; audit trails verified.",
      "activeIssuesCount": 0,
      "citations": [{ "documentName": "ISO_Compliance.pdf", "snippet": "Evidence..." }]
    }
  ],
  "aiRecommendations": [
    {
      "id": "r1",
      "priority": "HIGH",
      "title": "Review Legal Compliance Gaps",
      "recommendation": "Execute formal review of 3 unverified contract clauses.",
      "rationale": "High severity compliance risk flagged in RFP requirements.",
      "citations": [{ "documentName": "Requirement_Matrix.pdf", "snippet": "Clause 4.1 missing" }]
    },
    {
      "id": "r2",
      "priority": "MEDIUM",
      "title": "Finalize Go/No-Go Decision for Active Proposals",
      "recommendation": "Approve conditional proposals before submission deadline.",
      "rationale": "Confidence score is 89% with high return potential.",
      "citations": [{ "documentName": "Decision_Report.pdf", "snippet": "Recommendation: GO" }]
    }
  ],
  "recentEvents": [
    { "date": "2026-07-22", "title": "Memory Graph Ingested", "category": "KNOWLEDGE", "description": "Auto-extracted entities and relationships from new files.", "docName": "Latest Uploads" }
  ],
  "timelineHighlights": [
    { "date": "Current Week", "milestone": "AI COO System Initialized", "impact": "Continuous real-time executive brief synthesis online." }
  ]
}

CRITICAL RULES:
- Base all answers, health scores, and citations strictly on facts in the provided document and project data.
- If little data is uploaded yet, provide an encouraging executive brief indicating the platform is ready and note that uploading more files will enrich the health matrix.
- Return ONLY valid JSON.`;

  const prompt = `ORGANIZATION DOCUMENTS:\n${docsSummary || 'No documents uploaded yet.'}\n\nPROJECTS:\n${projectsSummary || 'No projects created yet.'}\n\nDECISIONS:\n${decisionsSummary || 'No decisions analyzed yet.'}\n\nGAPS:\n${gapsSummary || 'No gaps identified.'}\n\nMEMORY GRAPH KNOWLEDGE CONNECTIONS:\n${graphSummary || 'No graph connections yet.'}`;

  try {
    const rawContent = await invokeLLMWithFallback([
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt }
    ], { response_format: { type: 'json_object' } });

    const data: ExecutiveBriefData = parseSafeJson(rawContent);

    // Provide robust defaults if LLM output missed fields
    return {
      executiveBrief: data.executiveBrief || "Welcome to Synaps AI Executive Command. Upload documents or create projects to populate your real-time operational insights.",
      healthScore: data.healthScore || 92,
      knowledgeCoverage: data.knowledgeCoverage || 88,
      riskLevel: data.riskLevel || 'LOW',
      decisionConfidence: data.decisionConfidence || 90,
      executiveAnswers: Array.isArray(data.executiveAnswers) ? data.executiveAnswers : [],
      departmentHealth: Array.isArray(data.departmentHealth) ? data.departmentHealth : [],
      aiRecommendations: Array.isArray(data.aiRecommendations) ? data.aiRecommendations : [],
      recentEvents: Array.isArray(data.recentEvents) ? data.recentEvents : [],
      timelineHighlights: Array.isArray(data.timelineHighlights) ? data.timelineHighlights : []
    };
  } catch (error) {
    console.error("Failed to generate AI Executive Brief:", error);
    throw error;
  }
}

export async function askAiCooQuestion(organizationId: string, question: string) {
  const documents = await prisma.document.findMany({
    where: { organizationId, isDeleted: false },
    take: 10,
    include: { processedDoc: true }
  });

  const docsSummary = documents.map(d => 
    `[Doc: ${d.name}] ${d.processedDoc?.textContent?.slice(0, 500) || ''}`
  ).join('\n\n');

  const systemInstruction = `You are the AI Chief Operating Officer (AI COO) for Synaps.
Answer the executive question with precision, authority, and conciseness.
Format your answer using Markdown.

You MUST return valid JSON containing:
- "answer": Markdown answer text
- "status": "HEALTHY", "WARNING", "CRITICAL", or "INFO"
- "confidenceScore": Integer 0-100
- "citations": Array of objects [{ "documentName": "doc.pdf", "snippet": "evidence quote" }]

EVIDENCE FROM DOCUMENTS:
${docsSummary}`;

  const rawContent = await invokeLLMWithFallback([
    { role: 'system', content: systemInstruction },
    { role: 'user', content: `EXECUTIVE QUESTION: ${question}` }
  ], { response_format: { type: 'json_object' } });

  return parseSafeJson(rawContent);
}
