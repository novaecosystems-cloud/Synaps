export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { updateMissionControlAction } from '@/lib/mission-control';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded || !decoded.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { missionId, action, payload } = await req.json();
    if (!missionId || !action) {
      return NextResponse.json({ success: false, error: 'missionId and action parameters are required' }, { status: 400 });
    }

    const updatedState = updateMissionControlAction(missionId, action, payload);

    return NextResponse.json({
      success: true,
      data: updatedState
    });

  } catch (error: any) {
    console.error("POST /api/mission-control/action error:", error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
