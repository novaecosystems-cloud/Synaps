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
    if (!decoded?.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    // Only novaecosystems@gmail.com can access admin user list
    const caller = await prisma.user.findUnique({ where: { id: decoded.uid }, select: { role: true, email: true } });
    if (!caller || caller.email !== 'novaecosystems@gmail.com') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, organizationId: true },
      orderBy: { createdAt: 'desc' },
      take: 200
    });

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
