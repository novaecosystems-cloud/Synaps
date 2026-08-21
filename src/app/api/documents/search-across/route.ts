export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { generateEmbedding } from '@/lib/embeddings';

/**
 * GET /api/documents/search-across
 * Phase 1 â€” Multi-document search with page-level citations.
 * 
 * "Find every occurrence of X across all documents"
 * Returns results grouped by document, with page numbers and snippets.
 * 
 * Query params:
 *   q        â€” search query (required)
 *   mode     â€” "keyword" | "fuzzy" | "semantic" (default: "keyword")
 *   docIds   â€” comma-separated list of document IDs to restrict search
 *   limit    â€” max results per document (default: 5)
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;

    let organizationId: string = 'no_org_fallback';
    if (sessionCookie) {
      try {
        const decoded = await verifySessionCookie(sessionCookie);
        if (decoded?.uid) {
          const dbUser = await prisma.user.findUnique({
            where: { id: decoded.uid },
            select: { organizationId: true }
          });
          if (dbUser?.organizationId) organizationId = dbUser.organizationId;
        }
      } catch (_) {}
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();
    const mode = (searchParams.get('mode') || 'keyword') as 'keyword' | 'fuzzy' | 'semantic';
    const docIdsParam = searchParams.get('docIds');
    const limitPerDoc = Math.min(parseInt(searchParams.get('limit') || '5', 10), 20);
    const totalLimit = Math.min(parseInt(searchParams.get('totalLimit') || '100', 10), 500);

    if (!q || q.length < 1) {
      return NextResponse.json({ success: true, results: [], totalHits: 0 });
    }

    const docIdFilter = docIdsParam
      ? { documentId: { in: docIdsParam.split(',').map(s => s.trim()).filter(Boolean) } }
      : {};

    let rawHits: Array<{
      chunkId: string;
      documentId: string;
      documentName: string;
      pageNumber: number;
      section: string;
      text: string;
      score: number;
    }> = [];

    if (mode === 'semantic') {
      try {
        const queryVector = await generateEmbedding(q);
        const vectorString = `[${queryVector.join(',')}]`;

        const chunks: any[] = await prisma.$queryRaw`
          SELECT 
            c.id as "chunkId",
            c."documentId",
            d.name as "documentName",
            COALESCE(c."pageNumber", 1) as "pageNumber",
            COALESCE(c.section, 'General') as section,
            c.text,
            1 - (c.embedding <=> ${vectorString}::vector) as score
          FROM "DocumentChunk" c
          JOIN "Document" d ON c."documentId" = d.id
          WHERE d."organizationId" = ${organizationId}
            AND d."isDeleted" = false
            AND c.embedding IS NOT NULL
          ORDER BY c.embedding <=> ${vectorString}::vector
          LIMIT ${totalLimit}
        `;

        rawHits = chunks.map((c: any) => ({
          chunkId: c.chunkId,
          documentId: c.documentId,
          documentName: c.documentName,
          pageNumber: Number(c.pageNumber) || 1,
          section: c.section || 'General',
          text: c.text,
          score: Number(c.score) || 0
        }));
      } catch (vectorErr) {
        console.warn('Multi-doc semantic search fallback:', vectorErr);
        rawHits = await crossKeywordSearch(organizationId, q, docIdFilter, totalLimit);
      }
    } else if (mode === 'fuzzy') {
      const chunks: any[] = (await prisma.$queryRaw`
        SELECT 
          c.id as "chunkId",
          c."documentId",
          d.name as "documentName",
          COALESCE(c."pageNumber", 1) as "pageNumber",
          COALESCE(c.section, 'General') as section,
          c.text,
          similarity(c.text, ${q}) as score
        FROM "DocumentChunk" c
        JOIN "Document" d ON c."documentId" = d.id
        WHERE d."organizationId" = ${organizationId}
          AND d."isDeleted" = false
          AND (
            c.text ILIKE ${'%' + q + '%'}
            OR similarity(c.text, ${q}) > 0.1
          )
        ORDER BY score DESC
        LIMIT ${totalLimit}
      `) as any[];

      rawHits = (chunks as any[]).map((c: any) => ({
        chunkId: c.chunkId,
        documentId: c.documentId,
        documentName: c.documentName,
        pageNumber: Number(c.pageNumber) || 1,
        section: c.section || 'General',
        text: c.text,
        score: Number(c.score) || 0
      }));
    } else {
      rawHits = await crossKeywordSearch(organizationId, q, docIdFilter, totalLimit);
    }

    // Apply docId filter post-query if needed
    if (docIdsParam) {
      const allowedIds = new Set(docIdsParam.split(',').map(s => s.trim()));
      rawHits = rawHits.filter(h => allowedIds.has(h.documentId));
    }

    // Group hits by document
    const byDoc: Record<string, {
      documentId: string;
      documentName: string;
      occurrences: number;
      pages: number[];
      hits: typeof rawHits;
    }> = {};

    for (const hit of rawHits) {
      if (!byDoc[hit.documentId]) {
        byDoc[hit.documentId] = {
          documentId: hit.documentId,
          documentName: hit.documentName,
          occurrences: 0,
          pages: [],
          hits: []
        };
      }
      const entry = byDoc[hit.documentId];
      
      // Count keyword occurrences in this chunk
      const occurrences = (hit.text.toLowerCase().match(new RegExp(escapeRegex(q.toLowerCase()), 'g')) || []).length;
      entry.occurrences += Math.max(occurrences, 1);
      
      if (!entry.pages.includes(hit.pageNumber)) {
        entry.pages.push(hit.pageNumber);
      }
      
      if (entry.hits.length < limitPerDoc) {
        entry.hits.push(hit);
      }
    }

    // Sort documents by number of occurrences
    const results = Object.values(byDoc)
      .sort((a, b) => b.occurrences - a.occurrences)
      .map(doc => ({
        ...doc,
        pages: doc.pages.sort((a, b) => a - b),
        hits: doc.hits.map(h => ({
          ...h,
          highlightOffsets: findKeywordOffsets(h.text, q),
          snippet: buildSnippet(h.text, q)
        }))
      }));

    const totalOccurrences = results.reduce((sum, r) => sum + r.occurrences, 0);

    return NextResponse.json({
      success: true,
      query: q,
      mode,
      organizationId,
      totalDocumentsWithHits: results.length,
      totalOccurrences,
      results
    });

  } catch (error: any) {
    console.error('Cross-document search error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

async function crossKeywordSearch(
  organizationId: string,
  q: string,
  _docIdFilter: any,
  limit: number
) {
  const chunks: any[] = await prisma.$queryRaw`
    SELECT 
      c.id as "chunkId",
      c."documentId",
      d.name as "documentName",
      COALESCE(c."pageNumber", 1) as "pageNumber",
      COALESCE(c.section, 'General') as section,
      c.text,
      1.0 as score
    FROM "DocumentChunk" c
    JOIN "Document" d ON c."documentId" = d.id
    WHERE d."organizationId" = ${organizationId}
      AND d."isDeleted" = false
      AND c.text ILIKE ${'%' + q + '%'}
    ORDER BY c."pageNumber" ASC
    LIMIT ${limit}
  `;

  return chunks.map((c: any) => ({
    chunkId: c.chunkId,
    documentId: c.documentId,
    documentName: c.documentName,
    pageNumber: Number(c.pageNumber) || 1,
    section: c.section || 'General',
    text: c.text,
    score: 1.0
  }));
}

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

function buildSnippet(text: string, keyword: string, contextChars = 120): string {
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const idx = lowerText.indexOf(lowerKeyword);
  if (idx === -1) return text.substring(0, contextChars * 2) + '...';
  
  const start = Math.max(0, idx - contextChars);
  const end = Math.min(text.length, idx + keyword.length + contextChars);
  
  return (start > 0 ? '...' : '') + text.substring(start, end) + (end < text.length ? '...' : '');
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

