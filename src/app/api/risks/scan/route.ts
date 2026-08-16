export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { scanEnterpriseRisks, generateEnterprisePredictions, getEnterpriseRiskDashboard } from '@/lib/risk-prediction-engine';

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

    // Enforce 2-Use IP Trial Quota for Risk Scan
    try {
      const { checkAndConsumeAiCredits, extractClientIp } = await import('@/lib/ai-credit-limiter');
      const clientIp = extractClientIp(req.headers);
      const creditCheck = await checkAndConsumeAiCredits(userId, userRole, 1, 'contract_redline', clientIp);
      if (!creditCheck.success && userRole !== 'ADMIN') {
        return NextResponse.json({ 
          success: false, 
          error: creditCheck.error || 'Daily AI Credit Limit Reached',
          creditCheck 
        }, { status: 429 });
      }
    } catch (creditErr) {}

    // Run AI Risk Scan & Predictive Intelligence in parallel
    await Promise.allSettled([
      scanEnterpriseRisks(organizationId),
      generateEnterprisePredictions(organizationId)
    ]);

    const updatedDashboard = await getEnterpriseRiskDashboard(organizationId);

    return NextResponse.json({
      success: true,
      data: updatedDashboard
    });

  } catch (error: any) {
    console.error("POST /api/risks/scan error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
