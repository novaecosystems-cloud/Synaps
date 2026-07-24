export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding, generateChatResponse } from '@/lib/embeddings';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { ratelimit } from '@/lib/ratelimit';

// Bypass local SSL inspection/proxy issues causing fetch failed
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: { organizationId: true }
    });
    
    const organizationId = dbUser?.organizationId;
    if (!organizationId) return NextResponse.json({ success: false, error: 'User must belong to an organization' }, { status: 403 });

    // Rate & Daily AI Credit Limiting
    const { checkAndConsumeAiCredits } = await import('@/lib/ai-credit-limiter');
    const creditCheck = await checkAndConsumeAiCredits(decoded.uid, dbUser?.role || 'MEMBER', 1);

    if (!creditCheck.success) {
      return NextResponse.json({ success: false, error: creditCheck.error, creditCheck }, { status: 429 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ success: false, error: 'Messages array is required' }, { status: 400 });
    }

    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    if (latestMessage.role !== 'user') {
       return NextResponse.json({ success: false, error: 'Latest message must be from user' }, { status: 400 });
    }

    const query = latestMessage.content;

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

    // Fallback: If still no chunks, fetch most recent chunks from organization documents
    if (filteredResults.length === 0) {
      try {
        const recentChunks = await prisma.documentChunk.findMany({
          where: { document: { organizationId } },
          take: 8,
          orderBy: { createdAt: 'desc' },
          include: { document: { select: { name: true } } }
        });
        filteredResults = recentChunks.map(rc => ({
          id: rc.id,
          documentId: rc.documentId,
          text: rc.text,
          pageNumber: rc.pageNumber,
          section: rc.section,
          similarity: 0.5,
          name: rc.document?.name
        }));
      } catch (e) {}
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

    const combinedEvidence = [...enhancedChunks, ...graphChunks];

    // 3. Generate chat response using Gemini + Memory Graph Reasoning
    const aiResponse = await generateChatResponse(messages, combinedEvidence);

    return NextResponse.json({
      success: true,
      answer: aiResponse.answer,
      confidenceScore: aiResponse.confidenceScore,
      sources: aiResponse.sources,
      evidence: enhancedChunks
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

