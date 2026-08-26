export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { CorporateTacticsEngine } from '@/lib/corporate-tactics';
import { DecisionMemoryLoop } from '@/lib/data-moat-engine';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    let orgId = 'default_org';
    let actorName = 'Executive Leader';

    try {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get('synaps-session')?.value;
      if (sessionCookie) {
        const decoded = await verifySessionCookie(sessionCookie);
        if (decoded?.uid) {
          const user = await prisma.user.findUnique({
            where: { id: decoded.uid },
            select: { name: true, organizationId: true }
          });
          if (user?.organizationId) orgId = user.organizationId;
          if (user?.name) actorName = user.name;
        }
      }
    } catch (_) {}

    const body = await req.json();
    const {
      title,
      source = 'BOARDROOM',
      domain = 'STRATEGY',
      action,
      recommendation,
      problem,
      overrideReason,
      quickTags,
      modifiedDirectives,
      confidence = 95,
      participants
    } = body;

    if (!title || !action || !recommendation) {
      return NextResponse.json(
        { success: false, error: 'Title, action, and recommendation are required.' },
        { status: 400 }
      );
    }

    // 1. Record in Corporate Tactics Engine & Ledger with DGCL § 141 Merkle Seal
    const result = CorporateTacticsEngine.recordDecisionFeedback(orgId, {
      title,
      source,
      domain,
      action,
      recommendation,
      problem: problem || 'Strategic executive decision deliberation',
      overrideReason,
      quickTags,
      modifiedDirectives,
      confidence,
      actor: actorName,
      participants
    });

    // 2. Async hook into DAAM Pillar 2 DecisionMemoryLoop for Prime RLM memory fine-tuning
    try {
      if (action === 'ACCEPTED' || action === 'REJECTED' || action === 'MODIFIED') {
        DecisionMemoryLoop.record({
          orgId,
          agentRole: domain === 'LEGAL' ? 'LEGAL' : domain === 'FINANCE' ? 'CFO' : domain === 'TECH' ? 'CTO' : 'CEO',
          recommendationText: `${title}: ${recommendation}`,
          userAction: action,
          userOverrideReason: overrideReason || (quickTags ? quickTags.join(', ') : undefined)
        }).catch(err => console.warn('[Decision Feedback DAAM Hook Error]:', err));
      }
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: 'Decision recorded to organizational memory. Causarix has updated its corporate tactics playbook.',
      data: result.ledgerEntry,
      merkleProof: result.merkleProof,
      updatedTactics: result.updatedTactics
    });

  } catch (error: any) {
    console.error('POST /api/decisions/feedback error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
