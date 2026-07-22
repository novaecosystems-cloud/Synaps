export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: { organizationId: true }
    });

    const organizationId = dbUser?.organizationId;
    if (!organizationId) return NextResponse.json({ success: false, error: 'User must belong to an organization' }, { status: 403 });

    const { actualOutcome, lessonsLearned, status } = await req.json();

    const existing = await prisma.decision.findFirst({
      where: { id, organizationId }
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Decision not found' }, { status: 404 });
    }

    const updated = await prisma.decision.update({
      where: { id },
      data: {
        actualOutcome: actualOutcome ?? existing.actualOutcome,
        lessonsLearned: lessonsLearned ?? existing.lessonsLearned,
        status: status || 'EXECUTED'
      }
    });

    return NextResponse.json({
      success: true,
      data: updated
    });

  } catch (error: any) {
    console.error("PATCH /api/decisions/[id]/outcome error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
