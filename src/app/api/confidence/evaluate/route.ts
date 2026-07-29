export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { evaluateAnswerConfidence } from '@/lib/memory-confidence-engine';

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

    const organizationId = dbUser?.organizationId || 'demo_apex_org_id';

    const { query, minConfidenceThreshold } = await req.json();
    if (!query) {
      return NextResponse.json({ success: false, error: 'query parameter is required' }, { status: 400 });
    }

    const report = await evaluateAnswerConfidence(query, organizationId, minConfidenceThreshold || 70);

    return NextResponse.json({
      success: true,
      data: report
    });

  } catch (error: any) {
    console.error("POST /api/confidence/evaluate error:", error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
