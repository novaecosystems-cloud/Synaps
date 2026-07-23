export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded || !decoded.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { memberId, role } = await req.json();

    if (!memberId || !role) {
      return NextResponse.json({ success: false, error: 'memberId and role are required' }, { status: 400 });
    }

    const currentLeader = await prisma.user.findUnique({ where: { id: decoded.uid } });
    if (!currentLeader || !currentLeader.organizationId || !['OWNER', 'LEADER', 'ADMIN'].includes(currentLeader.role)) {
      return NextResponse.json({ success: false, error: 'Permission denied' }, { status: 403 });
    }

    const targetMember = await prisma.user.findUnique({ where: { id: memberId } });
    if (!targetMember || targetMember.organizationId !== currentLeader.organizationId) {
      return NextResponse.json({ success: false, error: 'Member not found in organization' }, { status: 404 });
    }

    // Update target member role
    await prisma.user.update({
      where: { id: memberId },
      data: { role }
    });

    // If transferring OWNER, update organization ownerId
    if (role === 'OWNER') {
      await prisma.organization.update({
        where: { id: currentLeader.organizationId },
        data: { ownerId: memberId }
      });
    }

    // Notify member of role change
    await prisma.notification.create({
      data: {
        userId: memberId,
        organizationId: currentLeader.organizationId,
        title: `Role Updated`,
        content: `Your role in the organization was updated to ${role} by ${currentLeader.name || 'a Leader'}.`,
        type: 'ROLE_CHANGED'
      }
    });

    return NextResponse.json({
      success: true,
      message: `Updated ${targetMember.name || targetMember.email}'s role to ${role}.`
    });

  } catch (error: any) {
    console.error('[API] Update member role error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded || !decoded.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return NextResponse.json({ success: false, error: 'memberId is required' }, { status: 400 });
    }

    const currentLeader = await prisma.user.findUnique({ where: { id: decoded.uid } });
    if (!currentLeader || !currentLeader.organizationId || !['OWNER', 'LEADER', 'ADMIN'].includes(currentLeader.role)) {
      return NextResponse.json({ success: false, error: 'Permission denied' }, { status: 403 });
    }

    if (memberId === decoded.uid) {
      return NextResponse.json({ success: false, error: 'Cannot remove yourself' }, { status: 400 });
    }

    const targetMember = await prisma.user.findUnique({ where: { id: memberId } });
    if (!targetMember || targetMember.organizationId !== currentLeader.organizationId) {
      return NextResponse.json({ success: false, error: 'Member not found in organization' }, { status: 404 });
    }

    // Remove member from organization
    await prisma.user.update({
      where: { id: memberId },
      data: {
        organizationId: null,
        role: 'MEMBER'
      }
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: memberId,
        organizationId: currentLeader.organizationId,
        title: `Removed from Organization`,
        content: `You were removed from ${currentLeader.organizationId} by ${currentLeader.name || 'a Leader'}.`,
        type: 'MEMBER_REMOVED'
      }
    });

    return NextResponse.json({
      success: true,
      message: `Removed ${targetMember.name || targetMember.email} from organization.`
    });

  } catch (error: any) {
    console.error('[API] Remove member error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
