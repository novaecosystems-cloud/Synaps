import prisma from '@/lib/prisma';
import { generateEmbedding } from '@/lib/embeddings';

export interface SearchResultChunk {
  id: string;
  documentId: string;
  text: string;
  section: string | null;
  pageNumber: number | null;
  score: number;
}

/**
 * Hybrid Vector & Keyword Search Engine for Agents
 * Combines semantic vector similarity with text matching for high-precision retrieval.
 */
export async function agentHybridSearch(
  query: string,
  organizationId: string,
  limit: number = 6
): Promise<SearchResultChunk[]> {
  const results: Map<string, SearchResultChunk> = new Map();

  // 1. Text Keyword Search via Prisma
  try {
    const textMatches = await prisma.documentChunk.findMany({
      where: {
        organizationId,
        text: { contains: query, mode: 'insensitive' }
      },
      take: limit,
      select: {
        id: true,
        documentId: true,
        text: true,
        section: true,
        pageNumber: true
      }
    });

    textMatches.forEach(match => {
      results.set(match.id, {
        id: match.id,
        documentId: match.documentId,
        text: match.text,
        section: match.section,
        pageNumber: match.pageNumber,
        score: 0.85
      });
    });
  } catch (err) {
    console.warn('[Hybrid RAG Agent] Keyword search fallback:', err);
  }

  // 2. Vector Search (if embeddings are configured and present)
  try {
    const queryVector = await generateEmbedding(query);
    if (queryVector && queryVector.length > 0) {
      const vectorSql = `
        SELECT id, "documentId", text, section, "pageNumber",
               1 - (embedding <=> $1::vector) as similarity
        FROM "DocumentChunk"
        WHERE "organizationId" = $2 AND embedding IS NOT NULL
        ORDER BY similarity DESC
        LIMIT $3;
      `;
      const rawVectorResults: any[] = await (prisma as any).$queryRawUnsafe(
        vectorSql,
        JSON.stringify(queryVector),
        organizationId,
        limit
      );

      if (Array.isArray(rawVectorResults)) {
        rawVectorResults.forEach((row: any) => {
          const existing = results.get(row.id);
          const vectorScore = Number(row.similarity) || 0.75;
          const combinedScore = existing ? Math.max(existing.score, vectorScore) + 0.1 : vectorScore;

          results.set(row.id, {
            id: row.id,
            documentId: row.documentId,
            text: row.text,
            section: row.section || null,
            pageNumber: row.pageNumber || null,
            score: combinedScore
          });
        });
      }
    }
  } catch (vectorErr) {
    // Vector search is optional depending on pgvector extension presence
    console.log('[Hybrid RAG Agent] Vector similarity fallback to keyword matching');
  }

  return Array.from(results.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
