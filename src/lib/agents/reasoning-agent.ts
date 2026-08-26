import { runDocumentAgent, AgentResponse as DocAgentResponse } from '@/lib/agents/document-agent';
import { runWebResearchAgent } from '@/lib/agents/web-research-agent';
import { invokeLLMWithFallback } from '@/lib/llm-router';
import { enrichAgentWithPrimeRLM } from '@/lib/prime-rlm';

export interface HybridResearchResponse {
  query: string;
  synthesisAnswer: string;
  documentFindings?: {
    answer: string;
    citations: Array<{ documentName: string; pageNumber: number; snippet?: string }>;
  };
  webFindings?: {
    answer: string;
    sources: Array<{ title: string; url: string }>;
  };
  internalCitations: Array<{ documentName: string; pageNumber: number }>;
  externalCitations: Array<{ title: string; url: string }>;
  caseTimeline?: Array<{ date: string; event: string }>;
  risksIdentified?: Array<{ title: string; severity: string; explanation: string }>;
  executionSteps: any[];
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PHASE 3 — CROSS-DOMAIN REASONING AGENT
 * ─────────────────────────────────────────────────────────────────────────────
 * Combines DocumentAgent (Internal Knowledge) + WebResearchAgent (External Web)
 * to answer hybrid queries such as:
 * - "Research ABC v XYZ and tell me what happened."
 * - "Does that case affect this contract?"
 * - "Find similar cases / recent cases involving this issue."
 * - "Compare our agreement against publicly available examples."
 * - "Research this company and tell me whether anything should concern management."
 */
export async function runReasoningAgent(
  query: string,
  organizationId: string,
  documentId?: string
): Promise<HybridResearchResponse> {
  const { systemPromptAddon: rlmAddon } = enrichAgentWithPrimeRLM('REASONING_AGENT', query);
  const executionSteps: any[] = [{ step: 'PRIME_RLM_INIT', rlmAddon }];

  // Determine intent routing
  const isHybrid = /affect\s+this\s+contract|compare\s+our\s+agreement|similar\s+cases|concern\s+management|company\s+background/i.test(query) || !!documentId;

  let docResult: DocAgentResponse | null = null;
  let webResult: { answer: string; toolSteps: any[]; sources: Array<{ title: string; url: string }> } | null = null;

  // Step 1: Run Document Agent if document context exists or query touches internal agreements
  if (isHybrid || documentId) {
    console.log(`[ReasoningAgent] Executing Document Agent for: "${query}"`);
    try {
      docResult = await runDocumentAgent(query, organizationId, documentId);
      executionSteps.push({
        agent: 'DocumentAgent',
        status: 'COMPLETED',
        toolSteps: docResult.toolSteps,
        citationsCount: docResult.citations.length
      });
    } catch (e: any) {
      console.warn('[ReasoningAgent] DocumentAgent notice:', e.message);
    }
  }

  // Step 2: Run Web Research Agent for external precedents, case law, company risks
  console.log(`[ReasoningAgent] Executing Web Research Agent for: "${query}"`);
  try {
    webResult = await runWebResearchAgent(query);
    executionSteps.push({
      agent: 'WebResearchAgent',
      status: 'COMPLETED',
      toolSteps: webResult.toolSteps,
      sourcesCount: webResult.sources.length
    });
  } catch (e: any) {
    console.warn('[ReasoningAgent] WebResearchAgent notice:', e.message);
  }

  // Step 3: Reasoning Synthesis Engine (Combine Internal + External)
  const synthesisPrompt = `You are SYNAPS Autonomous Multi-Agent Reasoning Engine.
You must synthesize findings from the Internal Document Agent and the External Web Research Agent to provide an authoritative, evidence-backed answer.

Query: "${query}"

${docResult ? `--- INTERNAL DOCUMENT FINDINGS ---
${docResult.answer}
Citations: ${JSON.stringify(docResult.citations)}` : ''}

${webResult ? `--- EXTERNAL WEB RESEARCH FINDINGS ---
${webResult.answer}
Web Sources: ${JSON.stringify(webResult.sources)}` : ''}

Instruction:
1. Provide a comprehensive, structured synthesis.
2. If comparing a legal precedent or web case (e.g. ABC v XYZ) against an uploaded contract, explain EXACTLY how the case ruling affects specific clauses in the uploaded agreement.
3. Include Dual Citations:
   - Internal Document Citations: [Document Name, p.N]
   - External Web Citations: [Source Title](URL)
4. Highlight key management risks or legal precedents established.`;

  const synthesisAnswer = await invokeLLMWithFallback([
    { role: 'system', content: 'You are the Chief Enterprise Reasoning & Dual-Domain Intelligence Officer.' },
    { role: 'user', content: synthesisPrompt }
  ]);

  // Extract case timeline if present
  const caseTimeline: Array<{ date: string; event: string }> = [];
  if (webResult?.answer) {
    const dateRegex = /(?:\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b)/gi;
    const matches = [...webResult.answer.matchAll(dateRegex)];
    matches.forEach(m => {
      const idx = m.index || 0;
      const snippet = webResult!.answer.substring(Math.max(0, idx - 15), Math.min(webResult!.answer.length, idx + 75)).trim();
      caseTimeline.push({ date: m[0], event: snippet.replace(/\n/g, ' ') });
    });
  }

  return {
    query,
    synthesisAnswer,
    documentFindings: docResult ? {
      answer: docResult.answer,
      citations: docResult.citations
    } : undefined,
    webFindings: webResult ? {
      answer: webResult.answer,
      sources: webResult.sources
    } : undefined,
    internalCitations: docResult?.citations || [],
    externalCitations: webResult?.sources || [],
    caseTimeline: caseTimeline.slice(0, 8),
    risksIdentified: docResult?.risks || [],
    executionSteps
  };
}
