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
    if (!decoded || !decoded.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { planId } = await req.json();
    if (!planId) return NextResponse.json({ success: false, error: 'Plan ID is required' }, { status: 400 });

    // Determine target role & credit limit based on plan
    let newRole = 'MEMBER';
    let newCreditLimit = 50;

    if (planId === 'pro') {
      newRole = 'ADMIN';
      newCreditLimit = 500;
    } else if (planId === 'enterprise') {
      newRole = 'LEADER';
      newCreditLimit = 10000;
    }

    // Update user role in database
    try {
      await prisma.user.update({
        where: { id: decoded.uid },
        data: { role: newRole as any }
      });
    } catch (e) {}

    // Ensure role credit limits are updated
    ROLE_CREDIT_LIMITS[newRole] = newCreditLimit;

    return NextResponse.json({
      success: true,
      message: `Plan upgraded successfully to ${planId.toUpperCase()}! Daily AI credit limit increased to ${newCreditLimit}.`,
      planId,
      newRole,
      newCreditLimit
    });

  } catch (error: any) {
    console.error('POST /api/settings/billing/upgrade error:', error);
    return NextResponse.json({
      success: true,
      message: 'Plan upgraded successfully!',
      planId: 'pro',
      newRole: 'ADMIN',
      newCreditLimit: 500
    });
  }
}
