export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { getUserDailyAiCredits } from '@/lib/ai-credit-limiter';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded || !decoded.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    let userRole = 'MEMBER';
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: decoded.uid },
        select: { role: true }
      });
      if (dbUser?.role) userRole = dbUser.role;
    } catch (e) {}

    const credits = getUserDailyAiCredits(decoded.uid, userRole);

    return NextResponse.json({
      success: true,
      credits: {
        role: userRole,
        ...credits
      }
    });

  } catch (error: any) {
    console.error('GET /api/settings/ai/credits error:', error);
    return NextResponse.json({
      success: true,
      credits: { role: 'MEMBER', creditsUsed: 0, creditLimit: 50, remaining: 50, resetAt: 'Midnight UTC' }
    });
  }
}
