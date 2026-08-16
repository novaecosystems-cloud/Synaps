export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { getEnterpriseRiskDashboard } from '@/lib/risk-prediction-engine';

export async function GET(req: NextRequest) {
  try {
    let organizationId = 'default_org';

    try {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get('synaps-session')?.value;
      if (sessionCookie) {
        const decoded = await verifySessionCookie(sessionCookie);
        if (decoded?.uid) {
          const dbUser = await prisma.user.findUnique({
            where: { id: decoded.uid },
            select: { organizationId: true }
          });
          if (dbUser?.organizationId) {
            organizationId = dbUser.organizationId;
          }
        }
      }
    } catch (authErr) {}

    const dashboardData = await getEnterpriseRiskDashboard(organizationId);

    return NextResponse.json({
      success: true,
      data: dashboardData
    });

  } catch (error: any) {
    console.error("GET /api/risks error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
