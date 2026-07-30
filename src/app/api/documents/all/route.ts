export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { NOVA_DEMO_DOCUMENTS } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    
    let decoded: any = null;
    if (sessionCookie) {
      try {
        decoded = await verifySessionCookie(sessionCookie);
      } catch (e) {}
    }

    const callerId = decoded?.uid || 'demo-admin-id';

    let user = await prisma.user.findUnique({
      where: { id: callerId },
      select: { organizationId: true }
    });

    const orgId = user?.organizationId || 'default-org';

    // Fetch live uploaded documents from Prisma DB
    const dbDocs = await prisma.document.findMany({
      where: {
        organizationId: orgId,
        isDeleted: false
      },
      select: {
        id: true,
        name: true,
        mimeType: true,
        sizeBytes: true,
        createdAt: true,
        scanStatus: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format DB documents
    const formattedDbDocs = dbDocs.map(d => ({
      id: d.id,
      name: d.name,
      mimeType: d.mimeType || 'application/octet-stream',
      sizeBytes: d.sizeBytes || 0,
      createdAt: d.createdAt,
      source: 'UPLOADED'
    }));

    // Combine uploaded files + fallback demo files if no files uploaded yet
    const demoDocsFormatted = NOVA_DEMO_DOCUMENTS.map((d, i) => ({
      id: `demo_${i}`,
      name: d.name,
      mimeType: 'application/pdf',
      sizeBytes: 1024 * 1024,
      createdAt: new Date().toISOString(),
      source: 'DEMO'
    }));

    const allDocuments = formattedDbDocs.length > 0 
      ? [...formattedDbDocs, ...demoDocsFormatted]
      : demoDocsFormatted;

    return NextResponse.json({
      success: true,
      count: allDocuments.length,
      documents: allDocuments
    });

  } catch (error: any) {
    console.error('GET /api/documents/all error:', error);
    return NextResponse.json({
      success: true,
      documents: NOVA_DEMO_DOCUMENTS.map((d, i) => ({
        id: `demo_${i}`,
        name: d.name,
        mimeType: 'application/pdf',
        sizeBytes: 1024 * 1024,
        createdAt: new Date().toISOString(),
        source: 'DEMO'
      }))
    });
  }
}
