export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';

/**
 * GET /api/documents/[id]/pages
 * Phase 1 — Fetch all chunks for a specific page (or page range).
 * 
 * Query params:
 *   page        — page number to fetch (required)
 *   context     — number of surrounding pages to also include (default: 0)
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
    const pageNum = parseInt(searchParams.get('page') || '1', 10);
    const contextPages = parseInt(searchParams.get('context') || '0', 10);

    // Verify document access
    const doc = await prisma.document.findFirst({
      where: {
        id: documentId,
        isDeleted: false,
        ...(organizationId ? { organizationId } : {})
      },
      select: {
        id: true,
        name: true,
        processedDoc: {
          select: { pageCount: true, detectedType: true }
        }
      }
    });

    if (!doc) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    const pageCount = doc.processedDoc?.pageCount || 1;
    const minPage = Math.max(1, pageNum - contextPages);
    const maxPage = Math.min(pageCount, pageNum + contextPages);

    // Fetch chunks for the requested page(s)
    const chunks = await prisma.documentChunk.findMany({
      where: {
        documentId,
        pageNumber: { gte: minPage, lte: maxPage }
      },
      select: {
        id: true,
        text: true,
        pageNumber: true,
        section: true,
        chunkType: true,
        positionIdx: true
      },
      orderBy: [
        { pageNumber: 'asc' },
        { positionIdx: 'asc' }
      ]
    });

    // Group chunks by page
    const pageGroups: Record<number, typeof chunks> = {};
    for (const chunk of chunks) {
      const pg = chunk.pageNumber || pageNum;
      if (!pageGroups[pg]) pageGroups[pg] = [];
      pageGroups[pg].push(chunk);
    }

    // Build a list of pages with their text
    const pages = Object.entries(pageGroups).map(([pg, pageChunks]) => ({
      pageNumber: parseInt(pg, 10),
      text: pageChunks.map(c => c.text).join('\n\n'),
      sections: [...new Set(pageChunks.map(c => c.section).filter(Boolean))],
      chunkCount: pageChunks.length,
      chunks: pageChunks
    })).sort((a, b) => a.pageNumber - b.pageNumber);

    return NextResponse.json({
      success: true,
      documentId,
      documentName: doc.name,
      requestedPage: pageNum,
      pageCount,
      detectedType: doc.processedDoc?.detectedType || 'Unknown',
      pages
    });

  } catch (error: any) {
    console.error('Document pages fetch error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
