export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { generateDownloadUrl } from '@/lib/storage';
import * as fs from 'fs';

export async function GET(
  _req: NextRequest,
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

    // Fetch document metadata and versions
    const doc = await prisma.document.findFirst({
      where: {
        id: documentId,
        isDeleted: false,
        ...(organizationId ? { organizationId } : {})
      },
      include: {
        versions: { orderBy: { versionNum: 'desc' }, take: 1 },
        processedDoc: true
      }
    });

    if (!doc) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    const latestVersion = doc.versions[0];
    const fileName = doc.name || latestVersion?.originalName || 'document.pdf';
    const mimeType = doc.mimeType || latestVersion?.mimeType || 'application/pdf';

    // 1. Try Supabase / Cloud Storage signed URL
    if (latestVersion?.storagePath) {
      try {
        const cloudUrl = await generateDownloadUrl(latestVersion.storagePath);
        if (cloudUrl && cloudUrl.startsWith('http')) {
          return NextResponse.redirect(cloudUrl);
        }
      } catch (cloudErr) {
        console.warn('[Download Route] Supabase signed URL notice:', cloudErr);
      }

      // 2. Try local disk file
      if (fs.existsSync(latestVersion.storagePath)) {
        const fileBuffer = fs.readFileSync(latestVersion.storagePath);
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': mimeType,
            'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
            'Content-Length': fileBuffer.length.toString()
          }
        });
      }
    }

    // 3. Fallback for demo or text-only documents: stream text content as downloadable file
    const textContent = doc.processedDoc?.textContent || `SYNAPS DOCUMENT: ${doc.name}\n\nNo binary stream attached.`;
    const textBuffer = Buffer.from(textContent, 'utf-8');

    return new NextResponse(textBuffer, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName.replace(/\.[^/.]+$/, ""))}.txt"`,
        'Content-Length': textBuffer.length.toString()
      }
    });

  } catch (error: any) {
    console.error('GET /api/documents/[id]/download error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Download failed' }, { status: 500 });
  }
}
