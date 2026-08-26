export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { CorporateTacticsEngine } from '@/lib/corporate-tactics';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    let orgId = 'default_org';
    try {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get('synaps-session')?.value;
      if (sessionCookie) {
        const decoded = await verifySessionCookie(sessionCookie);
        if (decoded?.uid) {
          const user = await prisma.user.findUnique({
            where: { id: decoded.uid },
            select: { organizationId: true }
          });
          if (user?.organizationId) orgId = user.organizationId;
        }
      }
    } catch (_) {}

    const tactics = CorporateTacticsEngine.getTactics(orgId);
    return NextResponse.json({ success: true, data: tactics });
  } catch (error: any) {
    console.error('GET /api/decisions/tactics error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let orgId = 'default_org';
    let actorName = 'Executive Committee';

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
    const { title, domain, rule, triggerCondition, policyDirective, confidenceScore, status, notes } = body;

    if (!title || !domain || !rule) {
      return NextResponse.json({ success: false, error: 'Title, domain, and rule are required.' }, { status: 400 });
    }

    const created = CorporateTacticsEngine.addTactic(orgId, {
      title,
      domain,
      rule,
      triggerCondition: triggerCondition || 'When relevant strategic decisions are evaluated',
      policyDirective: policyDirective || rule,
      confidenceScore: confidenceScore || 90,
      supportingDecisionsCount: 1,
      status: status || 'ACTIVE',
      alignedBy: actorName,
      notes: notes || '',
      precedents: []
    }, actorName);

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error('POST /api/decisions/tactics error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    let orgId = 'default_org';
    let actorName = 'Executive Alignment Review';

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
    const { tacticId, updates } = body;

    if (!tacticId || !updates) {
      return NextResponse.json({ success: false, error: 'tacticId and updates are required' }, { status: 400 });
    }

    const updated = CorporateTacticsEngine.updateTactic(orgId, tacticId, updates, actorName);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('PATCH /api/decisions/tactics error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
