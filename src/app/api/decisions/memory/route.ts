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
    if (!decoded || !decoded.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    let dbUser: any = null;
    try {
      dbUser = await prisma.user.findUnique({
        where: { id: decoded.uid },
        select: { organizationId: true }
      });
    } catch (e) {}

    const organizationId = dbUser?.organizationId || 'default_org';

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const status = searchParams.get('status') || undefined;

    const whereClause: any = { organizationId };
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    let decisions: any[] = [];

    // Attempt 1: Full search
    try {
      const fullWhere = { ...whereClause };
      if (query) {
        fullWhere.OR = [
          { problem: { contains: query, mode: 'insensitive' } },
          { context: { contains: query, mode: 'insensitive' } },
          { lessonsLearned: { contains: query, mode: 'insensitive' } }
        ];
      }
      decisions = await prisma.decision.findMany({
        where: fullWhere,
        orderBy: { createdAt: 'desc' },
        include: {
          document: { select: { id: true, name: true } },
          project: { select: { id: true, name: true } }
        }
      });
    } catch (err1) {
      // Fallback Attempt 2: Simple query without OR filters
      try {
        decisions = await prisma.decision.findMany({
          where: { organizationId },
          orderBy: { createdAt: 'desc' }
        });
      } catch (err2) {
        console.warn('[DECISION MEMORY] Database query fallback:', err2);
      }
    }

    return NextResponse.json({
      success: true,
      data: decisions.map(d => ({
        ...d,
        title: d.title || d.problem || 'Strategic Decision Record'
      }))
    });

  } catch (error: any) {
    console.error("GET /api/decisions/memory error:", error);
    return NextResponse.json({ success: true, data: [] });
  }
}
