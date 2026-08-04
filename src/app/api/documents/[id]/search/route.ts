export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { generateEmbedding } from '@/lib/embeddings';

/**
 * GET /api/documents/[id]/search
 * Phase 1 — Per-document deep search with page-level citations.
 * 
 * Query params:
 *   q       — search term (required)
 *   mode    — "keyword" | "fuzzy" | "semantic" (default: "keyword")
 *   limit   — max results (default: 50)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;

    let organizationId: string | null = null;
    if (sessionCookie) {
      try {
        const decoded = await verifySessionCookie(sessionCookie);
        if (decoded?.uid) {
          const dbUser = await prisma.user.findUnique({
            where: { id: decoded.uid },
            select: { organizationId: true }
          });
          organizationId = dbUser?.organizationId || null;
        }
      } catch (_) {}
    }

    const { id: documentId } = await params;
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();
    const mode = (searchParams.get('mode') || 'keyword') as 'keyword' | 'fuzzy' | 'semantic';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);

    if (!q || q.length < 1) {
      return NextResponse.json({ success: true, hits: [], totalHits: 0 });
    }

    // Verify the document exists and belongs to the org (or is accessible)
    const doc = await prisma.document.findFirst({
      where: {
        id: documentId,
        isDeleted: false,
        ...(organizationId ? { organizationId } : {})
      },
      select: { id: true, name: true, organizationId: true }
    });

    if (!doc) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    let hits: Array<{
      chunkId: string;
      pageNumber: number;
      section: string;
      text: string;
      score: number;
      matchType: string;
      highlightOffsets?: Array<{ start: number; end: number }>;
    }> = [];

    if (mode === 'semantic' && q.length > 3) {
      // --- Semantic search via pgvector cosine similarity ---
      try {
        const queryVector = await generateEmbedding(q);
        const vectorString = `[${queryVector.join(',')}]`;
        
        const semanticChunks: any[] = await prisma.$queryRaw`
          SELECT 
            c.id as "chunkId",
            COALESCE(c."pageNumber", 1) as "pageNumber",
            COALESCE(c.section, 'General') as section,
            c.text,
            1 - (c.embedding <=> ${vectorString}::vector) as score
          FROM "DocumentChunk" c
          WHERE c."documentId" = ${documentId}
            AND c.embedding IS NOT NULL
          ORDER BY c.embedding <=> ${vectorString}::vector
          LIMIT ${limit}
        `;

        hits = semanticChunks.map((c: any) => ({
          chunkId: c.chunkId,
          pageNumber: Number(c.pageNumber) || 1,
          section: c.section || 'General',
          text: c.text,
          score: Number(c.score) || 0,
          matchType: 'semantic',
          highlightOffsets: findKeywordOffsets(c.text, q)
        }));
      } catch (vectorErr) {
        console.warn('Semantic search fallback to keyword:', vectorErr);
        // Fall through to keyword search
        hits = await keywordSearch(documentId, q, limit);
      }
    } else if (mode === 'fuzzy') {
      // --- Fuzzy search using pg_trgm similarity ---
      try {
        const fuzzyChunks: any[] = await prisma.$queryRaw`
          SELECT 
            c.id as "chunkId",
            COALESCE(c."pageNumber", 1) as "pageNumber",
            COALESCE(c.section, 'General') as section,
            c.text,
            similarity(c.text, ${q}) as score
          FROM "DocumentChunk" c
          WHERE c."documentId" = ${documentId}
            AND (
              c.text ILIKE ${'%' + q + '%'}
              OR similarity(c.text, ${q}) > 0.1
            )
          ORDER BY score DESC
          LIMIT ${limit}
        `;

        hits = fuzzyChunks.map((c: any) => ({
          chunkId: c.chunkId,
          pageNumber: Number(c.pageNumber) || 1,
          section: c.section || 'General',
          text: c.text,
          score: Number(c.score) || 0,
          matchType: 'fuzzy',
          highlightOffsets: findKeywordOffsets(c.text, q)
        }));
      } catch (err) {
        hits = await keywordSearch(documentId, q, limit);
      }
    } else {
      // --- Exact keyword search (ILIKE) ---
      hits = await keywordSearch(documentId, q, limit);
    }

    // Sort hits by page number for reading order
    hits.sort((a, b) => {
      if (a.pageNumber !== b.pageNumber) return a.pageNumber - b.pageNumber;
      return b.score - a.score;
    });

    // Count total occurrences across document
    const totalOccurrences = hits.reduce((sum, h) => {
      return sum + (h.highlightOffsets?.length || (h.text.toLowerCase().includes(q.toLowerCase()) ? 1 : 0));
    }, 0);

    // Get unique pages that have hits
    const pagesWithHits = [...new Set(hits.map(h => h.pageNumber))].sort((a, b) => a - b);

    return NextResponse.json({
      success: true,
      query: q,
      mode,
      documentId,
      documentName: doc.name,
      totalHits: hits.length,
      totalOccurrences,
      pagesWithHits,
      hits: hits.slice(0, limit)
    });

  } catch (error: any) {
    console.error('Document search error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * Exact keyword search using ILIKE
 */
async function keywordSearch(documentId: string, q: string, limit: number) {
  const chunks: any[] = await prisma.$queryRaw`
    SELECT 
      c.id as "chunkId",
      COALESCE(c."pageNumber", 1) as "pageNumber",
      COALESCE(c.section, 'General') as section,
      c.text,
      1.0 as score
    FROM "DocumentChunk" c
    WHERE c."documentId" = ${documentId}
      AND c.text ILIKE ${'%' + q + '%'}
    ORDER BY c."pageNumber" ASC, c."positionIdx" ASC
    LIMIT ${limit}
  `;

  return chunks.map((c: any) => ({
    chunkId: c.chunkId,
    pageNumber: Number(c.pageNumber) || 1,
    section: c.section || 'General',
    text: c.text,
    score: 1.0,
    matchType: 'keyword',
    highlightOffsets: findKeywordOffsets(c.text, q)
  }));
}

/**
 * Find all occurrences of a keyword in text and return their character offsets
 */
function findKeywordOffsets(text: string, keyword: string): Array<{ start: number; end: number }> {
  const offsets: Array<{ start: number; end: number }> = [];
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  let idx = 0;
  while (idx < lowerText.length) {
    const found = lowerText.indexOf(lowerKeyword, idx);
    if (found === -1) break;
    offsets.push({ start: found, end: found + keyword.length });
    idx = found + 1;
  }
  return offsets;
}
