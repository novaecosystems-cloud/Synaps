export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { processMeetingData } from '@/lib/meeting-intelligence';

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

    const organizationId = dbUser?.organizationId || 'default_org';

    let meetings: any[] = [];
    try {
      meetings = await prisma.meeting.findMany({
        where: { organizationId },
        orderBy: { date: 'desc' },
        include: {
          document: { select: { id: true, name: true } }
        }
      });
    } catch (err) {
      console.warn('[MEETINGS] Warning fetching meetings from DB:', err);
    }

    return NextResponse.json({
      success: true,
      data: meetings
    });

  } catch (error: any) {
    console.error("GET /api/meetings error:", error);
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(req: NextRequest) {
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

    const organizationId = dbUser?.organizationId || 'default_org';
    const { title, textContent, documentId } = await req.json();

    if (!title || !textContent) {
      return NextResponse.json({ success: false, error: 'Title and textContent are required' }, { status: 400 });
    }

    const meetingResult = await processMeetingData(title, textContent, organizationId, documentId);

    return NextResponse.json({
      success: true,
      data: meetingResult
    });

  } catch (error: any) {
    console.error("POST /api/meetings error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
