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

    const { organizationId } = await req.json();

    if (!organizationId) {
      return NextResponse.json({ success: false, error: 'organizationId is required' }, { status: 400 });
    }

    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        users: {
          where: {
            role: { in: ['OWNER', 'LEADER', 'ADMIN'] }
          }
        }
      }
    });

    if (!org) {
      return NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.uid } });
    if (user?.organizationId === organizationId) {
      return NextResponse.json({ success: false, error: 'You are already a member of this organization' }, { status: 400 });
    }

    // Upsert join request
    const joinRequest = await prisma.joinRequest.upsert({
      where: {
        userId_organizationId: {
          userId: decoded.uid,
          organizationId
        }
      },
      update: {
        status: 'PENDING'
      },
      create: {
        userId: decoded.uid,
        organizationId,
        status: 'PENDING'
      }
    });

    const userName = user?.name || decoded.name || decoded.email || 'A user';

    // Create notifications for Org Leaders / Admins
    try {
      const leaderNotifications = org.users.map(leader => ({
        userId: leader.id,
        organizationId: org.id,
        title: `Join Request from ${userName}`,
        content: `${userName} wants to join ${org.name}.`,
        type: 'JOIN_REQUEST',
        metadata: {
          requestId: joinRequest.id,
          requesterId: decoded.uid,
          requesterName: userName,
          requesterEmail: decoded.email
        }
      }));

      if (leaderNotifications.length > 0) {
        await prisma.notification.createMany({
          data: leaderNotifications
        });
      }
    } catch (notifErr) {
      console.warn('[JOIN REQUEST] Could not dispatch leader notifications:', notifErr);
    }

    return NextResponse.json({
      success: true,
      message: `Join request submitted for ${org.name}. The organization leader will review your request.`,
      joinRequest
    });

  } catch (error: any) {
    console.error('[API] Join request error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
