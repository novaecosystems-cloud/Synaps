export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { ROLE_CREDIT_LIMITS } from '@/lib/ai-credit-limiter';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded?.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    // Only OWNER can upgrade users
    const caller = await prisma.user.findUnique({ where: { id: decoded.uid }, select: { role: true } });
    if (!caller || !['OWNER', 'LEADER'].includes(caller.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden — only Owner can upgrade users' }, { status: 403 });
    }

    const { userId, planId } = await req.json();
    if (!userId || !planId) return NextResponse.json({ success: false, error: 'userId and planId required' }, { status: 400 });

    let newRole = 'MEMBER';
    let newCreditLimit = 50;

    if (planId === 'pro') { newRole = 'ADMIN'; newCreditLimit = 500; }
    else if (planId === 'enterprise') { newRole = 'LEADER'; newCreditLimit = 10000; }

    const target = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole as any },
      select: { name: true, email: true }
    });

    ROLE_CREDIT_LIMITS[newRole] = newCreditLimit;

    // Create audit log
    try {
      const targetUser = await prisma.user.findUnique({ where: { id: userId }, select: { organizationId: true } });
      await prisma.auditLog.create({
        data: {
          organizationId: targetUser?.organizationId || 'default_org',
          userId: decoded.uid,
          action: 'ADMIN_PLAN_UPGRADE',
          resource: 'Billing',
          details: `Admin manually upgraded ${target.email} to ${planId.toUpperCase()} plan (${newCreditLimit} daily AI credits).`
        }
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `${target.name || target.email} upgraded to ${planId.toUpperCase()} — ${newCreditLimit} daily AI credits active!`
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
