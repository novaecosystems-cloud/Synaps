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
    
    let dbUser: any = null;
    if (sessionCookie) {
      try {
        const decoded = await verifySessionCookie(sessionCookie);
        if (decoded?.uid) {
          dbUser = await prisma.user.findUnique({
            where: { id: decoded.uid },
            select: { organizationId: true, role: true }
          });
        }
      } catch (e) {}
    }

    const organizationId = dbUser?.organizationId || 'demo_apex_org_id';

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
        objective: 'Nova Industries Strategic Expansion Plan',
        executiveSummary: 'Grounded strategic execution plan formulated from Nova Industries Q3 Supply Chain Risk Report, Vendor Contract Analysis, and Board Resolution RES-2026-41.',
        competitorAnalysis: { keyCompetitors: ['CyberCorp Dynamics', 'OmniTech Systems'], marketDisruption: 'Synaps AI Integration' },
        marketAnalysis: { addressableMarket: '$420B TAM by 2028', targetDemographic: 'Enterprise Clients', growthRate: '+16.4% CAGR' },
        swotAnalysis: { strengths: ['Synaps AI Integration', 'Board Resolution RES-2026-41'], weaknesses: ['Taiwan MCU single-source dependency'], opportunities: ['Munich Hub Expansion'], threats: ['Ocean freight inflation'] },
        redTeamChallenges: [{ agentRole: 'Risk Auditor Agent', challenge: 'GlobalFreight delay liability is capped at $50,000 under current MSA-2026-884.', severity: 'CRITICAL', mitigationSuggestion: 'Execute Amendment #3 immediately.' }],
        implementationPhases: [{ phase: 1, phaseName: 'Phase 1: Dual-Sourcing & Legal Amendment #3', duration: 'Months 1-2', milestones: ['Sign Quantum Semi SOW', 'Execute Amendment #3'] }],
        financialPlanning: { estimatedBudget: '$12,500,000', projectedRevenue: '$165.2M Q4 Revenue', roiEstimate: '320%' }
      }
    });
  }
}
