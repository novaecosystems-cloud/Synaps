export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { runReasoningAgent } from '@/lib/agents/reasoning-agent';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

/**
 * POST /api/agent/research
 * Phase 3 — Web + Document + Autonomous Research Endpoint.
 * Executes multi-agent synthesis combining internal vault documents + external web search.
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;

    let organizationId = 'demo_apex_org_id';
    let userId = 'demo-user';

    if (sessionCookie) {
      try {
        const decoded = await verifySessionCookie(sessionCookie);
        if (decoded?.uid) {
          userId = decoded.uid;
          const user = await prisma.user.findUnique({
            where: { id: decoded.uid },
            select: { organizationId: true }
          });
          if (user?.organizationId) organizationId = user.organizationId;
        }
      } catch (_) {}
    }

    const { query, documentId } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ success: false, error: 'query string is required' }, { status: 400 });
    }

    console.log(`[Phase 3 Multi-Agent Research] User ${userId} Query: "${query}" (docId: ${documentId || 'none'})`);

    const result = await runReasoningAgent(query, organizationId, documentId);

    return NextResponse.json({
      success: true,
      query,
      documentId,
      synthesisAnswer: result.synthesisAnswer,
      documentFindings: result.documentFindings,
      webFindings: result.webFindings,
      internalCitations: result.internalCitations,
      externalCitations: result.externalCitations,
      caseTimeline: result.caseTimeline,
      risksIdentified: result.risksIdentified,
      executionSteps: result.executionSteps
    });

  } catch (error: any) {
    console.error('POST /api/agent/research error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Research agent error' }, { status: 500 });
  }
}
