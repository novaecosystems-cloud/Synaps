export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded || !decoded.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json({ success: true, organizations: [] });
    }

    const organizations = await prisma.organization.findMany({
      where: {
        OR: [
          { name: { contains: query.trim(), mode: 'insensitive' } },
          { slug: { contains: query.trim(), mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        description: true,
        logoUrl: true,
        slug: true,
        isVerified: true,
        _count: {
          select: { users: true }
        }
      },
      take: 10
    });

    return NextResponse.json({
      success: true,
      organizations: organizations.map(org => ({
        id: org.id,
        name: org.name,
        description: org.description || '',
        logoUrl: org.logoUrl || null,
        slug: org.slug || org.id,
        isVerified: org.isVerified || false,
        memberCount: org._count.users
      }))
    });

  } catch (error: any) {
    console.error('[API] Search organizations error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
