export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateEmbedding } from '@/lib/embeddings';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';

import prisma from '@/lib/prisma';

// GET: Search similar chunks
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('synaps-session')?.value;
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const decodedToken = await verifySessionCookie(session);
  if (!decodedToken) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: decodedToken.uid } });
  if (!user || !user.organizationId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ success: false, error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const queryVector = await generateEmbedding(query);
    const vectorString = `[${queryVector.join(',')}]`;

    // Perform vector similarity search using pgvector
    // <=> is cosine distance. 1 - cosine distance = cosine similarity
    const results = await prisma.$queryRaw`
      SELECT id, "documentId", text, "pageNumber", section, "tokenCount", 
             1 - (embedding <=> ${vectorString}::vector) as similarity
      FROM "DocumentChunk"
      WHERE "organizationId" = ${user.organizationId} AND embedding IS NOT NULL
      ORDER BY embedding <=> ${vectorString}::vector
      LIMIT 10;
    `;

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Generate embeddings for chunks missing them
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const decodedToken = await verifySessionCookie(session);
    if (!decodedToken) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { id: decodedToken.uid } });
    if (!user || !user.organizationId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    // Find chunks without embeddings
    const chunks = await prisma.$queryRaw<any[]>`
      SELECT id, text 
      FROM "DocumentChunk" 
      WHERE "organizationId" = ${user.organizationId} AND embedding IS NULL 
      LIMIT 20;
    `;

    if (chunks.length === 0) {
      return NextResponse.json({ success: true, message: 'No chunks need embeddings', processed: 0 });
    }

    let processedCount = 0;
    const errors: any[] = [];

    for (const chunk of chunks) {
      try {
        const vector = await generateEmbedding(chunk.text);
        const vectorString = `[${vector.join(',')}]`;

        await prisma.$executeRaw`
          UPDATE "DocumentChunk" 
          SET embedding = ${vectorString}::vector 
          WHERE id = ${chunk.id};
        `;
        processedCount++;
      } catch (err: any) {
        console.error(`Failed to generate embedding for chunk ${chunk.id}:`, err);
        errors.push({ id: chunk.id, error: err.message });
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: processedCount,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error('Embedding generation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Clear all embeddings
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const decodedToken = await verifySessionCookie(session);
    if (!decodedToken) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { id: decodedToken.uid } });
    if (!user || !user.organizationId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await prisma.$executeRaw`UPDATE "DocumentChunk" SET embedding = NULL WHERE "organizationId" = ${user.organizationId};`;
    return NextResponse.json({ success: true, message: 'All embeddings cleared' });
  } catch (error: any) {
    console.error('Clear embeddings error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

