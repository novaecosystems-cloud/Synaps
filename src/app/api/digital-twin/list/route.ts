export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { getDefaultExecutiveTwins } from '@/lib/executive-digital-twin';

export async function GET(_req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded || !decoded.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const defaultTwins = getDefaultExecutiveTwins();

    return NextResponse.json({
      success: true,
      data: Object.values(defaultTwins)
    });

  } catch (error: any) {
    console.error("GET /api/digital-twin/list error:", error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
