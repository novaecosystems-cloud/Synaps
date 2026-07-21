export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateEmbedding, evaluateCoverageBatch } from '@/lib/embeddings';

import prisma from '@/lib/prisma';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: NextRequest) {
  try {
    const { documentId } = await req.json();

    if (!documentId) {
      return NextResponse.json({ success: false, error: 'Document ID is required' }, { status: 400 });
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });
    
    if (!document) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    const requirements = await prisma.requirement.findMany({
      where: { documentId }
    });

    if (requirements.length === 0) {
      return NextResponse.json({ success: false, error: 'No requirements found for this document' }, { status: 404 });
    }

    let processedCount = 0;
    
    // 1. Fetch embeddings and chunks for ALL requirements first (embeddings API has high limit)
    const itemsToEvaluate: { id: string, text: string, evidenceChunks: any[] }[] = [];

    for (const req of requirements) {
      const embedding = await generateEmbedding(req.text);
      const vectorString = `[${embedding.join(',')}]`;
      const results = await prisma.$queryRawUnsafe<any[]>(`
        SELECT "id", "documentId", "text", "pageNumber", 1 - (embedding <=> $1::vector) as similarity
        FROM "DocumentChunk"
        WHERE "documentId" != $2 AND "organizationId" = $3
        ORDER BY embedding <=> $1::vector
        LIMIT 10
      `, vectorString, documentId, document.organizationId);

      const filteredResults = results.filter(r => r.similarity > 0.3);

      if (filteredResults.length === 0) {
         await prisma.requirement.update({
           where: { id: req.id },
           data: {
             coverageStatus: 'MISSING',
             coverageScore: 0,
             coverageEvidence: 'No relevant company documents found to cover this requirement.',
             matchedDocumentIds: []
           }
         });
         processedCount++;
         continue;
      }

      const documentIds = Array.from(new Set(filteredResults.map(r => r.documentId)));
      const documents = await prisma.document.findMany({
        where: { id: { in: documentIds } },
        select: { id: true, name: true }
      });

      const enhancedChunks = filteredResults.map(chunk => {
        const doc = documents.find(d => d.id === chunk.documentId);
        return { ...chunk, name: doc?.name || chunk.documentId };
      });

      itemsToEvaluate.push({
        id: req.id,
        text: req.text,
        evidenceChunks: enhancedChunks
      });
    }

    // 2. Batch process using Gemini
    const BATCH_SIZE = 10;
    for (let i = 0; i < itemsToEvaluate.length; i += BATCH_SIZE) {
      const batch = itemsToEvaluate.slice(i, i + BATCH_SIZE);
      try {
        const evaluations = await evaluateCoverageBatch(batch);
        
        // Update DB
        for (const evalObj of evaluations) {
          if (!evalObj.id) continue;
          await prisma.requirement.update({
            where: { id: evalObj.id },
            data: {
              coverageStatus: evalObj.status,
              coverageScore: evalObj.confidenceScore,
              coverageEvidence: evalObj.evidence,
              matchedDocumentIds: evalObj.matchedDocuments || []
            }
          });
          processedCount++;
        }
        
        // Slight delay between batches to respect rate limits
        if (i + BATCH_SIZE < itemsToEvaluate.length) {
           await delay(3000);
        }
      } catch (err) {
        console.error("Batch processing error:", err);
      }
    }

    return NextResponse.json({ success: true, processed: processedCount });

  } catch (error: any) {
    console.error('Coverage API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

