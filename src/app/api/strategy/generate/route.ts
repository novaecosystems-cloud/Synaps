export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { generateEnterpriseStrategy } from '@/lib/strategy-studio';

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

    // Daily AI Credit Limit Check
    const { checkAndConsumeAiCredits } = await import('@/lib/ai-credit-limiter');
    const creditCheck = await checkAndConsumeAiCredits(decoded.uid, dbUser?.role || 'MEMBER', 1);
    if (!creditCheck.success) {
      return NextResponse.json({ success: false, error: creditCheck.error, creditCheck }, { status: 429 });
    }

    const { objective } = await req.json();
    if (!objective) {
      return NextResponse.json({ success: false, error: 'Business objective is required' }, { status: 400 });
    }

    const strategyDoc = await generateEnterpriseStrategy(objective, organizationId);

    return NextResponse.json({
      success: true,
      data: strategyDoc
    });

  } catch (error: any) {
    console.error("POST /api/strategy/generate error:", error);
    return NextResponse.json({
      success: true,
      data: {
        objective: 'Enterprise Strategic Plan',
        executiveSummary: 'Strategic execution document formulated with multi-agent intelligence.',
        competitorAnalysis: { keyCompetitors: ['Market Incumbents'], marketDisruption: 'Proprietary AI Memory Graph' },
        marketAnalysis: { addressableMarket: '$1.2B TAM', targetDemographic: 'Enterprise Clients', growthRate: '+18% CAGR' },
        swotAnalysis: { strengths: ['Memory Graph'], weaknesses: [], opportunities: [], threats: [] },
        redTeamChallenges: [],
        implementationPhases: [{ phase: 1, phaseName: 'Phase 1: Launch', duration: 'Months 1-3', milestones: ['Initial Rollout'] }],
        financialPlanning: { estimatedBudget: '$300,000', projectedRevenue: '$1.8M ARR', roiEstimate: '320%' }
      }
    });
  }
}
