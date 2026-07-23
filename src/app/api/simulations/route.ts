export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { runBusinessSimulation } from '@/lib/simulation-engine';

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
        select: { organizationId: true, role: true }
      });
    } catch (e) {}

    // Enforce Daily AI Credit Limit
    const { checkAndConsumeAiCredits } = await import('@/lib/ai-credit-limiter');
    const creditCheck = await checkAndConsumeAiCredits(decoded.uid, dbUser?.role || 'MEMBER', 1);

    if (!creditCheck.success) {
      return NextResponse.json({ 
        success: false, 
        error: creditCheck.error || 'Daily AI Credit Limit Reached',
        creditCheck 
      }, { status: 429 });
    }

    const organizationId = dbUser?.organizationId || 'default_org';

    const { decisionType, decisionDetails } = await req.json();

    if (!decisionType || !decisionDetails) {
      return NextResponse.json({ success: false, error: 'decisionType and decisionDetails are required' }, { status: 400 });
    }

    const simulationResult = await runBusinessSimulation(decisionType, decisionDetails, organizationId);

    return NextResponse.json({
      success: true,
      data: simulationResult
    });

  } catch (error: any) {
    console.error("POST /api/simulations error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
