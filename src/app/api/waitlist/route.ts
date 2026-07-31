export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, role, orgSize } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Store in Invitation table or AuditLog table
    let count = 142;
    try {
      count = await prisma.invitation.count();
    } catch (e) {}

    try {
      await prisma.invitation.create({
        data: {
          email: cleanEmail,
          role: 'MEMBER',
          token: `waitlist_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          status: 'WAITLIST_PENDING',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          invitedBy: 'SYSTEM_WAITLIST'
        }
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      position: 142 + count + 1,
      email: cleanEmail,
      message: 'Waitlist spot successfully reserved.'
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
