export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { scanEnterpriseRisks, generateEnterprisePredictions, getEnterpriseRiskDashboard } from '@/lib/risk-prediction-engine';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: { organizationId: true }
    });

    const organizationId = dbUser?.organizationId;
    if (!organizationId) return NextResponse.json({ success: false, error: 'User must belong to an organization' }, { status: 403 });

    // Run AI Risk Scan & Predictive Intelligence in parallel
    await Promise.all([
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
