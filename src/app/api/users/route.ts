export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

/**
 * GET /api/users
 * Returns list of members belonging to the authenticated user's organization.
 * Enforces strict multi-tenant isolation against URL parameter manipulation.
 */
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decodedToken = await verifySessionCookie(session);
    if (!decodedToken || !decodedToken.uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.uid },
      select: { id: true, organizationId: true },
    });

    if (!user || !user.organizationId) {
      return NextResponse.json({ error: 'User does not belong to an active organization' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const requestedOrgId = searchParams.get('organizationId');

    // Strict Tenant Isolation: Reject HTTP request parameter tampering
    if (requestedOrgId && requestedOrgId !== user.organizationId) {
      return NextResponse.json({ error: 'Forbidden: Cross-tenant access attempt blocked' }, { status: 403 });
    }

    const targetOrgId = user.organizationId;

    const users = await prisma.user.findMany({
      where: { organizationId: targetOrgId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
