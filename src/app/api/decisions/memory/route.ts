export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
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

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const status = searchParams.get('status') || undefined;

    const whereClause: any = { organizationId };
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }
    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { problem: { contains: query, mode: 'insensitive' } },
        { context: { contains: query, mode: 'insensitive' } },
        { lessonsLearned: { contains: query, mode: 'insensitive' } }
      ];
    }

    const decisions = await prisma.decision.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        document: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } }
      }
    });

    return NextResponse.json({
      success: true,
      data: decisions
    });

  } catch (error: any) {
    console.error("GET /api/decisions/memory error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
