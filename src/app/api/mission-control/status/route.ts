export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { getMissionState } from '@/lib/mission-control';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded || !decoded.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const missionId = searchParams.get('missionId');

    if (!missionId) {
      return NextResponse.json({ success: false, error: 'missionId parameter is required' }, { status: 400 });
    }

    const state = getMissionState(missionId);
    if (!state) {
      return NextResponse.json({ success: false, error: 'Mission not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: state
    });

  } catch (error: any) {
    console.error("GET /api/mission-control/status error:", error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
