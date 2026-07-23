export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded || !decoded.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: decoded.uid },
      include: {
        organization: {
          include: {
            users: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                role: true,
                createdAt: true
              }
            },
            joinRequests: {
              where: { status: 'PENDING' },
              include: {
                user: {
                  select: { id: true, name: true, email: true, avatarUrl: true }
                }
              }
            }
          }
        }
      }
    });

    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    return NextResponse.json({
      success: true,
      currentUser: {
        id: user.id,
        name: user.name || user.email.split('@')[0],
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
        organizationId: user.organizationId
      },
      organization: user.organization ? {
        id: user.organization.id,
        name: user.organization.name,
        description: user.organization.description,
        logoUrl: user.organization.logoUrl,
        slug: user.organization.slug,
        inviteCode: user.organization.inviteCode,
        isVerified: user.organization.isVerified,
        ownerId: user.organization.ownerId,
        members: user.organization.users,
        pendingJoinRequests: ['OWNER', 'LEADER', 'ADMIN'].includes(user.role) ? user.organization.joinRequests : []
      } : null
    });

  } catch (error: any) {
    console.error('[API] GET organization error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded || !decoded.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { name, description, logoUrl } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Organization name is required' }, { status: 400 });
    }

    const cleanName = name.trim();
    const slugBase = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const randomSuffix = crypto.randomBytes(3).toString('hex');
    const slug = `${slugBase}-${randomSuffix}`;
    const inviteCode = `SYN-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Create Organization and assign creator as OWNER & Leader
    const newOrg = await prisma.organization.create({
      data: {
        name: cleanName,
        description: description?.trim() || null,
        logoUrl: logoUrl?.trim() || null,
        slug,
        inviteCode,
        ownerId: decoded.uid,
        isVerified: true,
      }
    });

    // Update user to belong to this new org as OWNER
    await prisma.user.upsert({
      where: { id: decoded.uid },
      update: {
        organizationId: newOrg.id,
        role: 'OWNER'
      },
      create: {
        id: decoded.uid,
        email: decoded.email || `${decoded.uid}@synaps.ai`,
        name: decoded.name || 'Organization Owner',
        avatarUrl: decoded.picture || null,
        organizationId: newOrg.id,
        role: 'OWNER'
      }
    });

    return NextResponse.json({
      success: true,
      organization: {
        id: newOrg.id,
        name: newOrg.name,
        description: newOrg.description,
        logoUrl: newOrg.logoUrl,
        slug: newOrg.slug,
        inviteCode: newOrg.inviteCode
      }
    });

  } catch (error: any) {
    console.error('[API] Create organization error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
