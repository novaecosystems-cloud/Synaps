export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { logDecisionToFlywheel, updateDecisionFlywheelState, listFlywheelDecisions, DecisionState, ActorType } from '@/lib/decision-memory-flywheel';
import { inspectPrompt } from '@/lib/ai-firewall';

/**
 * GET /api/decisions/memory
 * Retrieves multi-tenant isolated historical decisions, corporate tactics profile, and flywheel records.
 */
export async function GET(req: NextRequest) {
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

    const organizationId = dbUser?.organizationId || 'default_org';

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const status = searchParams.get('status') || undefined;
    const actorType = (searchParams.get('actorType') as ActorType) || undefined;

    // 1. Fetch flywheel decisions & corporate tactics profile
    const flywheelResult = await listFlywheelDecisions(organizationId, {
      query,
      state: (status && status !== 'ALL') ? (status as DecisionState) : undefined,
      actorType,
      limit: 50,
    });

    // 2. Fetch standard Prisma decisions for backward-compatibility
    const whereClause: any = { organizationId };
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    let decisions: any[] = [];
    try {
      const fullWhere = { ...whereClause };
      if (query) {
        fullWhere.OR = [
          { problem: { contains: query, mode: 'insensitive' } },
          { context: { contains: query, mode: 'insensitive' } },
          { lessonsLearned: { contains: query, mode: 'insensitive' } }
        ];
      }
      decisions = await prisma.decision.findMany({
        where: fullWhere,
        orderBy: { createdAt: 'desc' },
        include: {
          document: { select: { id: true, name: true } },
          project: { select: { id: true, name: true } }
        }
      });
    } catch (err1) {
      try {
        decisions = await prisma.decision.findMany({
          where: { organizationId },
          orderBy: { createdAt: 'desc' }
        });
      } catch (err2) {
        console.warn('[DECISION MEMORY] Database query notice:', err2);
      }
    }

    // Merge standard decisions into formatted list
    const formattedDecisions = decisions.map(d => ({
      ...d,
      title: d.title || d.problem || 'Strategic Decision Record',
      state: d.status === 'APPROVED' ? 'ACCEPTED' : d.status === 'REJECTED' ? 'REJECTED' : 'MODIFIED'
    }));

    return NextResponse.json({
      success: true,
      data: formattedDecisions,
      flywheelDecisions: flywheelResult.decisions,
      tacticsProfile: flywheelResult.profile,
      totalCount: flywheelResult.total + formattedDecisions.length,
    });

  } catch (error: any) {
    console.error("GET /api/decisions/memory error:", error);
    return NextResponse.json({ success: true, data: [], flywheelDecisions: [] });
  }
}

/**
 * POST /api/decisions/memory
 * Logs a new universal decision record into the flywheel (ACCEPTED, REJECTED, MODIFIED, IGNORED, SUPERSEDED)
 */
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
        select: { organizationId: true, name: true }
      });
    } catch (e) {}

    const organizationId = dbUser?.organizationId;
    if (!organizationId) return NextResponse.json({ success: false, error: 'User must belong to an organization' }, { status: 403 });

    const body = await req.json();
    const {
      dilemma,
      state,
      actorType = 'HUMAN',
      chosenOption,
      rejectedOptions,
      rejectionRationale,
      modifications,
      tacticsLearned,
      riskToleranceScore,
      agentRole,
      contextDocumentIds,
      supersededByDecisionId,
      metadata,
    } = body;

    if (!dilemma) {
      return NextResponse.json({ success: false, error: 'Dilemma statement is required' }, { status: 400 });
    }

    if (!state || !['ACCEPTED', 'REJECTED', 'MODIFIED', 'IGNORED', 'SUPERSEDED'].includes(state)) {
      return NextResponse.json({ success: false, error: 'Valid state (ACCEPTED, REJECTED, MODIFIED, IGNORED, SUPERSEDED) is required' }, { status: 400 });
    }

    // AI Firewall Ingress inspection
    const ingress = inspectPrompt(dilemma);
    if (!ingress.isAllowed) {
      return NextResponse.json({
        success: false,
        error: `[AI Firewall] Dilemma blocked: ${ingress.flaggedReasons.join('; ')}`
      }, { status: 400 });
    }

    const recorded = await logDecisionToFlywheel({
      organizationId,
      actorType: (actorType as ActorType) || 'HUMAN',
      actorId: decoded.uid,
      actorName: dbUser?.name || 'Executive User',
      agentRole: agentRole || 'BOARD',
      state: state as DecisionState,
      dilemma: ingress.sanitizedPrompt || dilemma,
      chosenOption: chosenOption || (state === 'ACCEPTED' ? 'Approved as-is' : 'Alternative selected'),
      rejectedOptions: rejectedOptions || [],
      rejectionRationale,
      modifications,
      tacticsLearned,
      riskToleranceScore: typeof riskToleranceScore === 'number' ? riskToleranceScore : 50,
      contextDocumentIds,
      supersededByDecisionId,
      metadata,
    });

    return NextResponse.json({
      success: true,
      data: recorded,
      merkleRootHash: recorded.merkleRootHash,
      tacticsDistilled: recorded.tacticsLearned,
    });

  } catch (error: any) {
    console.error("POST /api/decisions/memory error:", error);
    return NextResponse.json({ success: false, error: error.message || 'Server error logging decision' }, { status: 500 });
  }
}

/**
 * PATCH /api/decisions/memory
 * Updates the state of an existing decision (e.g. marking it SUPERSEDED or MODIFIED)
 */
export async function PATCH(req: NextRequest) {
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

    const organizationId = dbUser?.organizationId;
    if (!organizationId) return NextResponse.json({ success: false, error: 'User must belong to an organization' }, { status: 403 });

    const { decisionId, state, supersededBy, reason } = await req.json();

    if (!decisionId || !state) {
      return NextResponse.json({ success: false, error: 'decisionId and state are required' }, { status: 400 });
    }

    const updated = await updateDecisionFlywheelState(decisionId, state as DecisionState, {
      organizationId,
      supersededBy,
      reason,
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });

  } catch (error: any) {
    console.error("PATCH /api/decisions/memory error:", error);
    return NextResponse.json({ success: false, error: error.message || 'Server error updating decision state' }, { status: 500 });
  }
}
