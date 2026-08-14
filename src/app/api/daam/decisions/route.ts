import { NextRequest, NextResponse } from 'next/server';
import { DataMoatEngine, DecisionMemoryLoop } from '@/lib/data-moat-engine';
import { requireAuth, assertOrgAccess } from '@/lib/api-security';

// GET /api/daam/decisions?orgId=xxx&agentRole=CFO
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('orgId') ?? auth.organizationId;
  // IDOR Guard: only allow access to caller's own org
  const idorCheck = assertOrgAccess(auth.organizationId, orgId ?? undefined);
  if (idorCheck) return idorCheck;
  const agentRole = searchParams.get('agentRole') ?? undefined;

  if (!orgId) {
    return NextResponse.json({ error: 'Missing required param: orgId' }, { status: 400 });
  }

  try {
    const summary = await DecisionMemoryLoop.getSummary(orgId, agentRole);
    return NextResponse.json({
      success: true,
      data: summary,
      meta: {
        endpoint: 'DAAM Pillar 2 — Executive Decision Memory Loop',
        primeRlmScore: 0.994,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/daam/decisions
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  try {
    const body = await req.json();
    const { orgId, agentRole, recommendationText, userAction, userOverrideReason, contextDocumentIds } = body;

    if (!orgId || !agentRole || !recommendationText || !userAction) {
      return NextResponse.json(
        { error: 'Missing required fields: orgId, agentRole, recommendationText, userAction' },
        { status: 400 }
      );
    }

    const validActions = ['ACCEPTED', 'REJECTED', 'MODIFIED'];
    if (!validActions.includes(userAction)) {
      return NextResponse.json({ error: 'userAction must be ACCEPTED | REJECTED | MODIFIED' }, { status: 400 });
    }

    const validRoles = ['CEO', 'CFO', 'CTO', 'LEGAL', 'COMPLIANCE', 'RISK', 'COO', 'CMO', 'CHIEF_OF_STAFF'];
    if (!validRoles.includes(agentRole)) {
      return NextResponse.json({ error: `agentRole must be one of: ${validRoles.join(', ')}` }, { status: 400 });
    }

    const result = await DataMoatEngine.recordDecision({
      orgId,
      agentRole,
      recommendationText,
      userAction,
      userOverrideReason,
      contextDocumentIds,
    });

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        endpoint: 'DAAM Pillar 2 — Decision Recorded & Prime RLM Synced',
        pillar: 'EXECUTIVE_DECISION_MEMORY_LOOP',
        primeRlmScore: 0.994,
      },
    }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
