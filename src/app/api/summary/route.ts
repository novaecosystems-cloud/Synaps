export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { requireAuth, assertOrgAccess } from '@/lib/api-security';

export async function GET(req: NextRequest) {
  const _auth = await requireAuth(req);
  if (_auth instanceof NextResponse) return _auth;
  try {
    const searchParams = req.nextUrl.searchParams;
    const documentId = searchParams.get('documentId');
    
    if (!documentId) {
      return NextResponse.json({ success: false, error: 'Document ID is required' }, { status: 400 });
    }

    const summary = await prisma.executiveSummary.findUnique({
      where: { documentId }
    });

    if (summary) {
      const orgCheck = assertOrgAccess(_auth.organizationId, summary.organizationId);
      if (orgCheck) return orgCheck;
    }

    return NextResponse.json({ success: true, summary });
  } catch (error: any) {
    console.error('Executive Summary GET API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

