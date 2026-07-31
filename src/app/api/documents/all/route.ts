export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { NOVA_DEMO_DOCUMENTS } from '@/lib/demo-data';
import { hardDeleteDocument, updateDocumentGroup } from '@/app/actions/document';

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

    // Fetch live uploaded documents from Prisma DB with Metadata group info
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
        scanStatus: true,
        metadata: {
          where: { key: 'group' },
          select: { value: true }
        }
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
      group: d.metadata?.[0]?.value || 'General Vault',
      source: 'UPLOADED'
    }));

    // Combine uploaded files + fallback demo files if no files uploaded yet
    const demoDocsFormatted = NOVA_DEMO_DOCUMENTS.map((d, i) => ({
      id: `demo_${i}`,
      name: d.name,
      mimeType: 'application/pdf',
      sizeBytes: 1024 * 1024,
      createdAt: new Date().toISOString(),
      group: i === 0 ? 'Alibaba CoCreate Pitch' : i === 1 ? 'Legal & MSA' : 'Financial Audits',
      source: 'DEMO'
    }));

    const allDocuments = formattedDbDocs.length > 0 
      ? [...formattedDbDocs, ...demoDocsFormatted]
      : demoDocsFormatted;

    // Collect unique groups
    const availableGroups = Array.from(new Set(allDocuments.map(d => d.group || 'General Vault')));

    return NextResponse.json({
      success: true,
      count: allDocuments.length,
      groups: availableGroups,
      documents: allDocuments
    });

  } catch (error: any) {
    console.error('GET /api/documents/all error:', error);
    return NextResponse.json({
      success: true,
      groups: ['General Vault', 'Alibaba CoCreate Pitch', 'Legal & MSA'],
      documents: NOVA_DEMO_DOCUMENTS.map((d, i) => ({
        id: `demo_${i}`,
        name: d.name,
        mimeType: 'application/pdf',
        sizeBytes: 1024 * 1024,
        createdAt: new Date().toISOString(),
        group: i === 0 ? 'Alibaba CoCreate Pitch' : 'General Vault',
        source: 'DEMO'
      }))
    });
  }
}

/**
 * DELETE handler for 100% hard deleting a document and wiping its AI memory
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 });
    }

    const result = await hardDeleteDocument(documentId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST handler for assigning document groups
 */
export async function POST(req: NextRequest) {
  try {
    const { documentId, group } = await req.json();
    if (!documentId || !group) {
      return NextResponse.json({ error: 'documentId and group are required' }, { status: 400 });
    }

    const result = await updateDocumentGroup(documentId, group);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
