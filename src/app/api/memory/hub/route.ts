import { NextRequest, NextResponse } from 'next/server';
import { TeamAgentMemoryHub } from '@/lib/memory/team-agent-memory-hub';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get('orgId') || 'no_org_fallback';
    const q = searchParams.get('q') || '';
    const domain = searchParams.get('domain') || undefined;

    if (q) {
      const results = await TeamAgentMemoryHub.queryTeamMemory(orgId, q, domain);
      return NextResponse.json({ success: true, results }, { status: 200 });
    }

    const state = await TeamAgentMemoryHub.getMemoryState(orgId);
    return NextResponse.json({ success: true, memoryState: state }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { organizationId = 'no_org_fallback', sessionId = `sess_${Date.now()}`, topic, deliberationLogs = [], consensusDossier } = body;

    if (!topic || !consensusDossier) {
      return NextResponse.json({ success: false, error: 'Missing topic or consensusDossier' }, { status: 400 });
    }

    const result = await TeamAgentMemoryHub.commitBoardroomSession(
      organizationId,
      sessionId,
      topic,
      deliberationLogs,
      consensusDossier
    );

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

