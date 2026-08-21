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

    const { inviteCode } = await req.json();

    if (!inviteCode || !inviteCode.trim()) {
      return NextResponse.json({ success: false, error: 'Invite code is required' }, { status: 400 });
    }

    const cleanCode = inviteCode.trim().toUpperCase();

    // Find organization matching inviteCode (case-insensitive)
    const org = await prisma.organization.findFirst({
      where: {
        OR: [
          { inviteCode: { equals: cleanCode, mode: 'insensitive' } },
          { inviteCode: { equals: inviteCode.trim(), mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        description: true,
        logoUrl: true,
        slug: true,
        inviteCode: true,
        isVerified: true,
      }
    });

    if (!org) {
      return NextResponse.json({
        success: false,
        error: `Invalid invite code "${cleanCode}". Please check with your administrator.`
      }, { status: 404 });
    }

    // Join user to the organization
    await prisma.user.upsert({
      where: { id: decoded.uid },
      update: {
        organizationId: org.id,
        role: 'MEMBER'
      },
      create: {
        id: decoded.uid,
        email: decoded.email || `${decoded.uid}@causarix.ai`,
        name: decoded.name || 'Organization Member',
        organizationId: org.id,
        role: 'MEMBER'
      }
    });

    // Resolve any pending join requests
    try {
      await prisma.joinRequest.updateMany({
        where: {
          userId: decoded.uid,
          organizationId: org.id
        },
        data: {
          status: 'APPROVED'
        }
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `🎉 Successfully joined ${org.name}! Workspace access granted.`,
      organization: org
    });

  } catch (error: any) {
    console.error('[API] Join by invite code error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to join organization' }, { status: 500 });
  }
}
