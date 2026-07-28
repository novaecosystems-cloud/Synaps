export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { getNodeDetails } from '@/lib/memory-graph';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded || !decoded.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    let dbUser: any = null;
    try {
      dbUser = await prisma.user.findUnique({
        where: { id: decoded.uid },
        select: { organizationId: true }
      });
    } catch (e) {}

    const organizationId = dbUser?.organizationId;
    if (!organizationId) {
      return NextResponse.json({ success: false, error: 'User does not belong to an organization' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const nodeId = searchParams.get('nodeId');

    if (!nodeId) {
      return NextResponse.json({ success: false, error: 'nodeId query parameter is required' }, { status: 400 });
    }

    const details = await getNodeDetails(nodeId, organizationId);
    if (!details) {
      return NextResponse.json({ success: false, error: 'Node not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: details
    });

  } catch (error: any) {
    console.error("GET /api/graph/node-details error:", error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
