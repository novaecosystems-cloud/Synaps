export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { createMission } from '@/lib/mission-control';

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

    const { title, objective, digitalTwinPersona } = await req.json();
    if (!title || !objective) {
      return NextResponse.json({ success: false, error: 'Title and Objective parameters are required' }, { status: 400 });
    }

    const missionState = await createMission(title, objective, organizationId, digitalTwinPersona);

    return NextResponse.json({
      success: true,
      data: missionState
    });

  } catch (error: any) {
    console.error("POST /api/mission-control/create error:", error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

