export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded || !decoded.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { requestId, action } = await req.json(); // action: 'APPROVE' | 'REJECT'

    if (!requestId || !action) {
      return NextResponse.json({ success: false, error: 'requestId and action are required' }, { status: 400 });
    }

    const leaderUser = await prisma.user.findUnique({ where: { id: decoded.uid } });
    if (!leaderUser || !leaderUser.organizationId || !['OWNER', 'LEADER', 'ADMIN'].includes(leaderUser.role)) {
      return NextResponse.json({ success: false, error: 'Only Organization Leaders or Admins can respond to join requests' }, { status: 403 });
    }

    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: requestId },
      include: { organization: true, user: true }
    });

    if (!joinRequest || joinRequest.organizationId !== leaderUser.organizationId) {
      return NextResponse.json({ success: false, error: 'Join request not found' }, { status: 404 });
    }

    if (action === 'APPROVE') {
      // 1. Update request status to APPROVED
      await prisma.joinRequest.update({
        where: { id: requestId },
        data: { status: 'APPROVED' }
      });

      // 2. Add user to Organization as MEMBER
      await prisma.user.update({
        where: { id: joinRequest.userId },
        data: {
          organizationId: joinRequest.organizationId,
          role: 'MEMBER'
        }
      });

      // 3. Create notification for applicant
      await prisma.notification.create({
        data: {
          userId: joinRequest.userId,
          organizationId: joinRequest.organizationId,
          title: `Welcome to ${joinRequest.organization.name}! 🎉`,
          content: `Your request to join ${joinRequest.organization.name} was approved by ${leaderUser.name || 'a Leader'}.`,
          type: 'MEMBER_APPROVED'
        }
      });

      return NextResponse.json({
        success: true,
        message: `${joinRequest.user.name || joinRequest.user.email} has been approved and added to ${joinRequest.organization.name}.`
      });
    } else {
      // Reject request
      await prisma.joinRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' }
      });

      // Create rejection notification for applicant
      await prisma.notification.create({
        data: {
          userId: joinRequest.userId,
          organizationId: joinRequest.organizationId,
          title: `Join Request Update`,
          content: `Your request to join ${joinRequest.organization.name} was declined.`,
          type: 'MEMBER_REJECTED'
        }
      });

      return NextResponse.json({
        success: true,
        message: `Join request declined.`
      });
    }

  } catch (error: any) {
    console.error('[API] Respond join request error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
