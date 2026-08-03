export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';

/**
 * GET /api/user/profile
 * Strictly fetches the authenticated user's own profile based on session cookie.
 * Prevents HTTP ID tampering / enumeration.
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded || !decoded.uid) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Always fetch strictly by decoded session UID (Tenant / User Isolation)
    const user = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        organizationId: true,
        createdAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            plan: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: user,
    });
  } catch (error: any) {
    console.error('[API] GET User Profile Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/user/profile
 * Strictly updates the authenticated user's own profile based on session cookie.
 */
export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded || !decoded.uid) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, avatarUrl } = body;

    // Strict profile mutation bound ONLY to decoded.uid
    const updatedUser = await prisma.user.update({
      where: { id: decoded.uid },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(avatarUrl !== undefined && { avatarUrl: avatarUrl.trim() }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        organizationId: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      profile: updatedUser,
    });
  } catch (error: any) {
    console.error('[API] PATCH User Profile Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
