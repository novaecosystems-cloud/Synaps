export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { generateEnterpriseStrategy } from '@/lib/strategy-studio';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: { organizationId: true }
    });

    const organizationId = dbUser?.organizationId;
    if (!organizationId) return NextResponse.json({ success: false, error: 'User must belong to an organization' }, { status: 403 });

    const { objective } = await req.json();
    if (!objective) {
      return NextResponse.json({ success: false, error: 'Business objective is required' }, { status: 400 });
    }

    const strategyDoc = await generateEnterpriseStrategy(objective, organizationId);

    return NextResponse.json({
      success: true,
      data: strategyDoc
    });

  } catch (error: any) {
    console.error("POST /api/strategy/generate error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
