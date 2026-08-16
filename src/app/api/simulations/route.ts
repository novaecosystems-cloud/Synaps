export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { runBusinessSimulation } from '@/lib/simulation-engine';

export async function POST(req: NextRequest) {
  try {
    let organizationId = 'default_org';
    let userId = 'guest_user';
    let userRole = 'MEMBER';

    try {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get('synaps-session')?.value;
      if (sessionCookie) {
        const decoded = await verifySessionCookie(sessionCookie);
        if (decoded?.uid) {
          userId = decoded.uid;
          const dbUser = await prisma.user.findUnique({
            where: { id: decoded.uid },
            select: { organizationId: true, role: true }
          });
          if (dbUser?.organizationId) organizationId = dbUser.organizationId;
          if (dbUser?.role) userRole = dbUser.role;
        }
      }
    } catch (authErr) {}

    // Enforce 2-Use IP Trial Quota for Simulations
    try {
      const { checkAndConsumeAiCredits, extractClientIp } = await import('@/lib/ai-credit-limiter');
      const clientIp = extractClientIp(req.headers);
      const creditCheck = await checkAndConsumeAiCredits(userId, userRole, 1, 'digital_twin_simulation', clientIp);
      if (!creditCheck.success && userRole !== 'ADMIN') {
        return NextResponse.json({ 
          success: false, 
          error: creditCheck.error || 'Daily AI Credit Limit Reached',
          creditCheck 
        }, { status: 429 });
      }
    } catch (creditErr) {}

    const { decisionType, decisionDetails } = await req.json();

    if (!decisionType) {
      return NextResponse.json({ success: false, error: 'decisionType is required' }, { status: 400 });
    }

    const details = decisionDetails || `Simulating strategic impact of ${decisionType}`;
    const simulationResult = await runBusinessSimulation(decisionType, details, organizationId);

    return NextResponse.json({
      success: true,
      data: simulationResult
    });

  } catch (error: any) {
    console.error("POST /api/simulations error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
