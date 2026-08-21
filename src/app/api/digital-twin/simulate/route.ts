export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { runExecutiveBoardroomSimulation } from '@/lib/executive-digital-twin';

export async function POST(req: NextRequest) {
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

    const organizationId = dbUser?.organizationId || 'no_org_fallback';

    const { scenarioPrompt } = await req.json();
    if (!scenarioPrompt) {
      return NextResponse.json({ success: false, error: 'scenarioPrompt parameter is required' }, { status: 400 });
    }

    const simulationResult = await runExecutiveBoardroomSimulation(scenarioPrompt, organizationId);

    return NextResponse.json({
      success: true,
      data: simulationResult
    });

  } catch (error: any) {
    console.error("POST /api/digital-twin/simulate error:", error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

