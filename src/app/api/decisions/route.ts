export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decodedToken = await verifySessionCookie(session);
    if (!decodedToken) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    
    const user = await prisma.user.findUnique({ where: { id: decodedToken.uid } });
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const documentId = searchParams.get('documentId');
    
    if (!documentId) {
      return NextResponse.json({ success: false, error: 'Document ID is required' }, { status: 400 });
    }

    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (!doc || doc.organizationId !== user.organizationId) {
      return NextResponse.json({ success: false, error: 'Unauthorized access to document' }, { status: 403 });
    }

    const decision = await prisma.decision.findUnique({
      where: { documentId }
    });

    return NextResponse.json({ success: true, decision });
  } catch (error: any) {
    console.error('Decisions GET API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decodedToken = await verifySessionCookie(session);
    if (!decodedToken) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    
    const user = await prisma.user.findUnique({ where: { id: decodedToken.uid } });
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { documentId, status } = await req.json();

    if (!documentId || !status) {
      return NextResponse.json({ success: false, error: 'Document ID and status are required' }, { status: 400 });
    }

    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (!doc || doc.organizationId !== user.organizationId) {
      return NextResponse.json({ success: false, error: 'Unauthorized access to document' }, { status: 403 });
    }

    const decision = await prisma.decision.update({
      where: { documentId },
      data: { status }
    });

    return NextResponse.json({ success: true, decision });
  } catch (error: any) {
    console.error('Decisions PATCH API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
