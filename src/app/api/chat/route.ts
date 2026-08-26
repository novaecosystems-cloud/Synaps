export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding, generateChatResponse } from '@/lib/embeddings';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';

import prisma from '@/lib/prisma';
import { inspectPrompt, inspectResponse } from '@/lib/ai-firewall';
import { getRelevantDecisionMemory } from '@/lib/decision-memory-flywheel';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: { organizationId: true, role: true }
    });
    
    const organizationId = dbUser?.organizationId;
    if (!organizationId) return NextResponse.json({ success: false, error: 'User must belong to an organization' }, { status: 403 });

    const { messages, webSearch, effort = 'Medium', responseLength = 'Standard' } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ success: false, error: 'Messages array is required' }, { status: 400 });
    }

    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    if (latestMessage.role !== 'user') {
       return NextResponse.json({ success: false, error: 'Latest message must be from user' }, { status: 400 });
    }

    const rawQuery = latestMessage.content;

    // ── AI FIREWALL: INGRESS INSPECTION ──────────────────────────────────────
    const ingressCheck = inspectPrompt(rawQuery);
    if (!ingressCheck.isAllowed) {
      return NextResponse.json({
        success: false,
        error: `[Causarix AI Firewall]: Your message was flagged and blocked. Reason: ${ingressCheck.flaggedReasons.join('; ')}`,
        flaggedReasons: ingressCheck.flaggedReasons,
        riskLevel: ingressCheck.riskLevel
      }, { status: 400 });
    }

    const query = ingressCheck.sanitizedPrompt || rawQuery;

    // Check if query triggers Phase 3 Hybrid Web + Doc Research Reasoning
    const isPhase3Research = webSearch ||
      /research|case|court|judg\w+|affect\s+this\s+contract|similar\s+cases|concern\s+management|company\s+background|publicly\s+available|benchmark|search the web|latest|recent|current|today|news/i.test(query);

    // Rate & Dynamic AI Credit Consumption (Cost: 5 for Max Effort In-Depth, 2 for Medium/Web, 1 for Brief/Standard)
    let creditCost = 1;
    if (effort === 'Max Effort' && responseLength === 'In-Depth') {
      creditCost = 5;
    } else if (effort === 'Max Effort' || responseLength === 'In-Depth' || effort === 'Medium' || isPhase3Research) {
      creditCost = 2;
    }

    const { checkAndConsumeAiCredits, extractClientIp } = await import('@/lib/ai-credit-limiter');
    const clientIp = extractClientIp(req.headers);
    const creditCheck = await checkAndConsumeAiCredits(decoded.uid, dbUser?.role || 'MEMBER', creditCost, 'cowork_matter_vault', clientIp);

    if (!creditCheck.success) {
      return NextResponse.json({
        success: false,
        error: creditCheck.error,
        credits: {
          remaining: 0,
          creditLimit: creditCheck.creditLimit,
          creditsUsed: creditCheck.creditsUsed,
        }
      }, { status: 429 });
    }

    const creditsPayload = {
      remaining: creditCheck.remaining,
      creditLimit: creditCheck.creditLimit,
      creditsUsed: creditCheck.creditsUsed,
      role: dbUser?.role || 'MEMBER'
    };

    if (isPhase3Research) {
      try {
        const { runReasoningAgent } = await import('@/lib/agents/reasoning-agent');
        const researchRes = await runReasoningAgent(query, organizationId);
        const egressCheck = inspectResponse(researchRes.synthesisAnswer);
        return NextResponse.json({
          success: true,
          answer: egressCheck.sanitizedOutput,
          confidenceScore: 0.98,
          sources: [
            ...researchRes.internalCitations.map(c => `${c.documentName} (p.${c.pageNumber})`),
            ...researchRes.externalCitations.map(s => `${s.title} (${s.url})`)
          ],
          evidence: researchRes.executionSteps.map(s => ({ text: `[${s.agent}] Completed with ${s.citationsCount || s.sourcesCount || 0} sources` })),
          internalCitations: researchRes.internalCitations,
          externalCitations: researchRes.externalCitations,
          caseTimeline: researchRes.caseTimeline,
          risksIdentified: researchRes.risksIdentified,
          credits: creditsPayload
        });
      } catch (researchErr) {
        console.warn('[CHAT] Phase 3 Reasoning Agent notice:', researchErr);
      }
    }

    // Check if query triggers Phase 2 Agentic Document Reasoning
    const isAgenticQuery = /page\s+\d+|find\s+every|compare|biggest\s+risk|risk|clause|all\t*document|mentioning|extract\s+table/i.test(query);

    if (isAgenticQuery) {
      try {
        const { runDocumentAgent } = await import('@/lib/agents/document-agent');
        const agentRes = await runDocumentAgent(query, organizationId);
        const egressCheck = inspectResponse(agentRes.answer);
        return NextResponse.json({
          success: true,
          answer: egressCheck.sanitizedOutput,
          confidenceScore: 0.95,
          sources: agentRes.citations.map(c => c.documentName),
          evidence: agentRes.toolSteps.map(s => ({ text: `[${s.action || 'Thought'}] ${JSON.stringify(s.observation || s.thought)}` })),
          toolSteps: agentRes.toolSteps,
          risks: agentRes.risks,
          timeline: agentRes.timeline,
          credits: creditsPayload
        });
      } catch (agentErr) {
        console.warn('[CHAT] Agentic query execution fallback:', agentErr);
      }
    }

    // 1. Generate embedding for the query
    let embedding: number[] = [];
    try {
      embedding = await generateEmbedding(query);
    } catch (e) {
      console.warn('[CHAT] Embedding generation fallback:', e);
    }

    let results: any[] = [];
    if (embedding.length > 0) {
      try {
        const vectorString = `[${embedding.join(',')}]`;
        results = await prisma.$queryRaw<any[]>`
          SELECT 
            c."id", 
            c."documentId", 
            c."text", 
            c."pageNumber", 
            c."section", 
            1 - (c.embedding <=> ${vectorString}::vector) as similarity
          FROM "DocumentChunk" c
          JOIN "Document" d ON c."documentId" = d."id"
          WHERE d."organizationId" = ${organizationId}
          ORDER BY c.embedding <=> ${vectorString}::vector
          LIMIT 10
        `;
      } catch (vecErr) {
        console.warn('[CHAT] Vector search notice:', vecErr);
      }
    }

    // Filter by similarity threshold (> 0.25) or use all top vector results
    let filteredResults = results.filter(r => r.similarity > 0.25);
    if (filteredResults.length === 0 && results.length > 0) {
      filteredResults = results.slice(0, 5);
    }

    // Keyword & Title Fallback: Search documents by title/name keywords if query mentions document names
    try {
      const allOrgDocs = await prisma.document.findMany({
        where: { organizationId, isDeleted: false },
        select: { id: true, name: true }
      });

      const matchedDocIds = allOrgDocs
        .filter(d => {
          const docNameLower = d.name.toLowerCase();
          const queryLower = query.toLowerCase();
          const words = queryLower.split(/\s+/).filter(w => w.length > 3);
          return words.some(w => docNameLower.includes(w));
        })
        .map(d => d.id);

      if (matchedDocIds.length > 0) {
        const keywordChunks = await prisma.documentChunk.findMany({
          where: { documentId: { in: matchedDocIds } },
          take: 10
        });

        for (const kc of keywordChunks) {
          if (!filteredResults.some(fr => fr.id === kc.id)) {
            filteredResults.push({
              id: kc.id,
              documentId: kc.documentId,
              text: kc.text,
              pageNumber: kc.pageNumber,
              section: kc.section,
              similarity: 0.9
            });
          }
        }
      }
    } catch (kwErr) {
      console.warn('[CHAT] Keyword fallback notice:', kwErr);
    }

    // Fallback: If still no chunks or general document overview query, fetch all organization documents & recent chunks
    const isDocOverviewQuery = /document|my doc|files|uploaded|cannot see|what do i have|summary of key insights/i.test(query);

    if (filteredResults.length === 0 || isDocOverviewQuery) {
      try {
        const orgDocs = await prisma.document.findMany({
          where: { organizationId, isDeleted: false },
          take: 12,
          orderBy: { createdAt: 'desc' },
          select: { id: true, name: true, mimeType: true, sizeBytes: true, createdAt: true }
        });

        const recentChunks = await prisma.documentChunk.findMany({
          where: { document: { organizationId, isDeleted: false } },
          take: 12,
          orderBy: { createdAt: 'desc' },
          include: { document: { select: { name: true } } }
        });

        const docListChunk = {
          id: 'org-docs-overview',
          documentId: 'doc-vault-summary',
          name: 'Organization Document Index',
          text: orgDocs.length > 0
            ? `Your Organization Document Index (${orgDocs.length} Documents Ingested):\n` +
              orgDocs.map((d, i) => `${i + 1}. **${d.name}** (${d.mimeType || 'PDF'}, uploaded ${new Date(d.createdAt).toLocaleDateString()})`).join('\n')
            : `No documents have been uploaded yet to your Organization Document Vault. You can upload PDF, Word, or TXT documents using the Document Vault (/dashboard/documents) to begin querying.`
        };

        const mappedChunks = recentChunks.map(rc => ({
          id: rc.id,
          documentId: rc.documentId,
          text: rc.text,
          pageNumber: rc.pageNumber,
          section: rc.section,
          similarity: 0.8,
          name: rc.document?.name
        }));

        filteredResults = [docListChunk, ...mappedChunks];
      } catch (e) {
        console.warn('[CHAT] Document overview fallback notice:', e);
      }
    }

    // Fetch document filenames to enhance context
    const documentIds = Array.from(new Set(filteredResults.map(r => r.documentId)));
    const documents = await prisma.document.findMany({
      where: { id: { in: documentIds } },
      select: { id: true, name: true }
    });

    const enhancedChunks = filteredResults.map(chunk => {
      const doc = documents.find(d => d.id === chunk.documentId);
      return {
        ...chunk,
        name: doc?.name || chunk.name || chunk.documentId
      };
    });

    // Fetch Memory Graph Entity Relationships for the organization
    let graphRelationships: any[] = [];
    try {
      graphRelationships = await prisma.graphRelationship.findMany({
        where: { organizationId },
        take: 15,
        select: {
          id: true,
          relationType: true,
          description: true,
          evidence: true,
          sourceEntity: { select: { name: true, type: true } },
          targetEntity: { select: { name: true, type: true } }
        }
      });
    } catch (graphErr) {
      console.warn('[CHAT] Notice: GraphRelationship query skipped (non-fatal):', (graphErr as Error).message);
    }

    const graphChunks = graphRelationships.map(r => ({
      id: r.id,
      documentId: 'graph-memory',
      name: `Memory Graph (${r.sourceEntity?.type || 'Entity'} → ${r.targetEntity?.type || 'Entity'})`,
      text: `[Enterprise Memory Graph] ${r.sourceEntity?.name || ''} (${r.sourceEntity?.type || ''}) ${r.relationType} ${r.targetEntity?.name || ''} (${r.targetEntity?.type || ''}). Description: ${r.description}. Evidence: ${r.evidence || 'Document Entity Connection'}`
    }));

    // ── Dynamic Decision Memory Flywheel & Corporate Tactics Injection ──
    const decisionMemory = await getRelevantDecisionMemory(organizationId, query, 4);
    const decisionMemoryChunk = {
      id: 'decision-memory-flywheel',
      documentId: 'corporate-tactics-memory',
      name: 'Institutional Decision Memory & Corporate Tactics',
      text: decisionMemory.tacticsSummaryPrompt
    };

    const combinedEvidence = [...enhancedChunks, ...graphChunks, decisionMemoryChunk];

    // 3. Generate chat response using Gemini + Decision Memory + Knowledge Graph Reasoning
    const aiResponse = await generateChatResponse(messages, combinedEvidence);
    const egressCheck = inspectResponse(aiResponse.answer);

    return NextResponse.json({
      success: true,
      answer: egressCheck.sanitizedOutput,
      confidenceScore: aiResponse.confidenceScore,
      sources: aiResponse.sources,
      evidence: enhancedChunks,
      credits: creditsPayload,
      memoryProvenanceHash: decisionMemory.merkleProvenanceHash
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
