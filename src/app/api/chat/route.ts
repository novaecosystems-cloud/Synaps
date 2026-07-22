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

    // Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const { success, limit, reset, remaining } = await ratelimit.limit(`chat_${decoded.uid}_${ip}`);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded. Please try again later.' }, {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString()
        }
      });
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
    const embedding = await generateEmbedding(query);

    // 2. Perform similarity search in pgvector
    const vectorString = `[${embedding.join(',')}]`;
    const results = await prisma.$queryRaw<any[]>`
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
      LIMIT 5
    `;

    // Filter by similarity threshold (e.g., > 0.4)
    const filteredResults = results.filter(r => r.similarity > 0.4);

    // Fetch document filenames to enhance the context
    const documentIds = Array.from(new Set(filteredResults.map(r => r.documentId)));
    const documents = await prisma.document.findMany({
      where: { id: { in: documentIds } },
      select: { id: true, name: true }
    });

    const enhancedChunks = filteredResults.map(chunk => {
      const doc = documents.find(d => d.id === chunk.documentId);
      return {
        ...chunk,
        name: doc?.name || chunk.documentId
      };
    });

    // Fetch Memory Graph Entity Relationships for the organization
    const graphRelationships = await prisma.graphRelationship.findMany({
      where: { organizationId },
      take: 15,
      include: {
        sourceEntity: { select: { name: true, type: true } },
        targetEntity: { select: { name: true, type: true } }
      }
    });

    const graphChunks = graphRelationships.map(r => ({
      id: r.id,
      documentId: r.documentId || 'graph-memory',
      name: `Memory Graph (${r.sourceEntity.type} → ${r.targetEntity.type})`,
      text: `[Enterprise Memory Graph] ${r.sourceEntity.name} (${r.sourceEntity.type}) ${r.relationType} ${r.targetEntity.name} (${r.targetEntity.type}). Description: ${r.description}. Evidence: ${r.evidence || 'Document Entity Connection'}`
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

