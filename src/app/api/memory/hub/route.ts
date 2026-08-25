import { NextRequest, NextResponse } from 'next/server';
import { TeamAgentMemoryHub } from '@/lib/memory/team-agent-memory-hub';
import { resolveAuthContext, safeErrorResponse } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = await resolveAuthContext(req);
    const { searchParams } = new URL(req.url);
    const orgId = auth.orgId !== 'no_org_fallback' ? auth.orgId : (searchParams.get('orgId') || 'no_org_fallback');
    const q = searchParams.get('q') || '';
    const domain = searchParams.get('domain') || undefined;

    if (q) {
      const results = await TeamAgentMemoryHub.queryTeamMemory(orgId, q, domain);
      return NextResponse.json({ success: true, results }, { status: 200 });
    }

    const state = await TeamAgentMemoryHub.getMemoryState(orgId);
    return NextResponse.json({ success: true, memoryState: state }, { status: 200 });
  } catch (error: any) {
    return safeErrorResponse(error, 'Failed to query memory hub');
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await resolveAuthContext(req);
    const body = await req.json();
    const { organizationId, sessionId = `sess_${Date.now()}`, topic, deliberationLogs = [], consensusDossier } = body;
    const effectiveOrgId = auth.orgId !== 'no_org_fallback' ? auth.orgId : (organizationId || 'no_org_fallback');

    if (!topic || !consensusDossier) {
      return NextResponse.json({ success: false, error: 'Missing topic or consensusDossier' }, { status: 400 });
    }

    const result = await TeamAgentMemoryHub.commitBoardroomSession(
      effectiveOrgId,
      sessionId,
      topic,
      deliberationLogs,
      consensusDossier
    );

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error: any) {
    return safeErrorResponse(error, 'Failed to commit memory session');
  }
}


