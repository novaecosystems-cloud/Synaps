export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { runDocumentAgent } from '@/lib/agents/document-agent';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

/**
 * POST /api/agent/document
 * Phase 2 â€” Agentic Document Intelligence API endpoint.
 * Accepts user goal / prompt and executes ReAct Document Agent with tool calling.
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;

    let organizationId = 'no_org_fallback';
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

    const { goal, documentId } = await req.json();

    if (!goal || typeof goal !== 'string') {
      return NextResponse.json({ success: false, error: 'goal string is required' }, { status: 400 });
    }

    console.log(`[DocumentAgent Endpoint] User ${userId} Goal: "${goal}" (docId: ${documentId || 'all'})`);

    const result = await runDocumentAgent(goal, organizationId, documentId);

    return NextResponse.json({
      success: true,
      goal,
      documentId,
      answer: result.answer,
      toolSteps: result.toolSteps,
      citations: result.citations,
      risks: result.risks,
      timeline: result.timeline
    });

  } catch (error: any) {
    console.error('POST /api/agent/document error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Agent error' }, { status: 500 });
  }
}

