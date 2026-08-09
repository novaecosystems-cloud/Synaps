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

    // Only novaecosystems@gmail.com can upgrade users
    const caller = await prisma.user.findUnique({ where: { id: decoded.uid }, select: { role: true, email: true } });
    if (!caller || caller.email !== 'novaecosystems@gmail.com') {
      return NextResponse.json({ success: false, error: 'Forbidden — only the Owner can upgrade users' }, { status: 403 });
    }

    const { userId, userEmail, planId, requestId } = await req.json();
    if ((!userId && !userEmail) || !planId) {
      return NextResponse.json({ success: false, error: 'userId/userEmail and planId required' }, { status: 400 });
    }

    let targetUser: any = null;
    if (userId) {
      targetUser = await prisma.user.findUnique({ where: { id: userId } });
    } else if (userEmail) {
      targetUser = await prisma.user.findFirst({ where: { email: { equals: userEmail, mode: 'insensitive' } } });
    }

    if (!targetUser) {
      return NextResponse.json({ success: false, error: `User ${userEmail || userId} not found in database.` }, { status: 404 });
    }

    // Map to valid PostgreSQL Enum values (ADMIN for Pro 500, OWNER for Enterprise 10,000)
    let newRole: 'ADMIN' | 'OWNER' | 'MEMBER' = 'ADMIN';
    let newCreditLimit = 500;

    if (planId === 'enterprise' || planId === 'max') {
      newRole = 'OWNER';
      newCreditLimit = 10000;
    } else if (planId === 'pro') {
      newRole = 'ADMIN';
      newCreditLimit = 500;
    }

    // Update PostgreSQL safely
    await prisma.user.update({
      where: { id: targetUser.id },
      data: { role: newRole as any }
    });

    ROLE_CREDIT_LIMITS[newRole] = newCreditLimit;

    // Delete resolved pending request audit log if requestId was provided
    if (requestId) {
      try {
        await prisma.auditLog.delete({ where: { id: requestId } });
      } catch (e) {}
    }

    // Create confirmation audit log
    try {
      await prisma.auditLog.create({
        data: {
          organizationId: targetUser.organizationId || 'default_org',
          userId: decoded.uid,
          action: 'ADMIN_PLAN_UPGRADE',
          entityType: 'Billing',
          entityId: targetUser.id,
          metadata: { details: `Owner Admin approved & upgraded ${targetUser.email} to ${planId.toUpperCase()} plan (${newCreditLimit} daily AI credits active).` }
        }
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `${targetUser.name || targetUser.email} requested ${planId.toUpperCase()} plan $\\rightarrow$ ACCEPTED & UPGRADED (${newCreditLimit} daily AI credits active!)`
    });

  } catch (error: any) {
    console.error('POST /api/admin/upgrade-user error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
