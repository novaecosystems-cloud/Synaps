export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateEmbedding } from '@/lib/embeddings';

import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const userId = searchParams.get('userId');
  const organizationId = searchParams.get('organizationId');
  const semantic = searchParams.get('semantic') === 'true';

  if (!q || !userId || !organizationId) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Log the search in history
    await prisma.searchHistory.create({
      data: { userId, organizationId, query: q }
    });

    const results: any[] = [];

    // --- FUZZY & FULL TEXT SEARCH ---
    const [docs, projects, reqs, proposals, users] = await Promise.all([
      prisma.$queryRaw<any[]>`
        SELECT id, name, "mimeType" FROM "Document"
        WHERE "organizationId" = ${organizationId} AND "isDeleted" = false
        AND (name ILIKE ${'%' + q + '%'} OR similarity(name, ${q}) > 0.2)
        LIMIT 5
      `,
      prisma.$queryRaw<any[]>`
        SELECT id, name, description FROM "Project"
        WHERE "organizationId" = ${organizationId} AND "isDeleted" = false
        AND (
          name ILIKE ${'%' + q + '%'} OR similarity(name, ${q}) > 0.2 OR
          description ILIKE ${'%' + q + '%'} OR similarity(description, ${q}) > 0.2
        )
        LIMIT 5
      `,
      prisma.$queryRaw<any[]>`
        SELECT r.id, r.text, r.category, r."documentId" 
        FROM "Requirement" r
        JOIN "Document" d ON r."documentId" = d.id
        WHERE d."organizationId" = ${organizationId}
        AND (r.text ILIKE ${'%' + q + '%'} OR similarity(r.text, ${q}) > 0.2)
        LIMIT 5
      `,
      prisma.$queryRaw<any[]>`
        SELECT id, title, status FROM "Proposal"
        WHERE "organizationId" = ${organizationId}
        AND (title ILIKE ${'%' + q + '%'} OR similarity(title, ${q}) > 0.2)
        LIMIT 5
      `,
      prisma.$queryRaw<any[]>`
        SELECT id, name, email FROM "User"
        WHERE "organizationId" = ${organizationId}
        AND (
          name ILIKE ${'%' + q + '%'} OR similarity(name, ${q}) > 0.2 OR
          email ILIKE ${'%' + q + '%'} OR similarity(email, ${q}) > 0.2
        )
        LIMIT 5
      `
    ]);
    
    docs.forEach(doc => results.push({
      id: doc.id,
      resourceId: doc.id,
      type: 'Document',
      title: doc.name,
      snippet: `Document (${doc.mimeType})`,
      link: `/dashboard/documents?id=${doc.id}`
    }));

    projects.forEach(p => results.push({
      id: p.id,
      resourceId: p.id,
      type: 'Project',
      title: p.name,
      snippet: p.description || 'Project',
      link: `/dashboard/projects/${p.id}`
    }));

    reqs.forEach(r => results.push({
      id: r.id,
      resourceId: r.documentId,
      type: 'Requirement',
      title: `${r.category} Requirement`,
      snippet: r.text.substring(0, 100) + '...',
      link: `/dashboard/requirements?documentId=${r.documentId}`
    }));

    proposals.forEach(p => results.push({
      id: p.id,
      resourceId: p.id,
      type: 'Proposal',
      title: p.title,
      snippet: `Status: ${p.status}`,
      link: `/dashboard/proposals/edit/${p.id}`
    }));

    users.forEach(u => results.push({
      id: u.id,
      resourceId: u.id,
      type: 'User',
      title: u.name || u.email,
      snippet: u.email,
      link: `/dashboard/settings/team`
    }));

    // --- SEMANTIC SEARCH (Optional fallback for deep document matches) ---
    if (semantic && q.length > 5) {
      try {
        const queryVector = await generateEmbedding(q);
        const vectorString = `[${queryVector.join(',')}]`;

        // Find top 3 document chunks matching the query conceptually
        const chunks: any[] = await prisma.$queryRaw`
          SELECT c.id, c."documentId", c.text, d.name as "docName"
          FROM "DocumentChunk" c
          JOIN "Document" d ON c."documentId" = d.id
          WHERE d."organizationId" = ${organizationId}
          ORDER BY c.embedding <=> ${vectorString}::vector
          LIMIT 3
        `;

        chunks.forEach(c => {
          // Avoid duplicate document links if it was already found via exact text
          if (!results.some(r => r.resourceId === c.documentId && r.type === 'Document Chunk')) {
            results.push({
              id: c.id,
              resourceId: c.documentId,
              type: 'Document Chunk (AI Match)',
              title: `Conceptual match in ${c.docName}`,
              snippet: c.text.substring(0, 120) + '...',
              link: `/dashboard/documents?id=${c.documentId}`
            });
          }
        });
      } catch (err) {
        console.error('Semantic search failed, returning text results only:', err);
      }
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

