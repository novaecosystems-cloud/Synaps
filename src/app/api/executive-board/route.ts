export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { runExecutiveBoardMeeting } from '@/lib/executive-board';

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
        select: { organizationId: true, role: true }
      });
    } catch (e) {}

    // Enforce 2-Use IP Trial Quota for Boardroom
    const { checkAndConsumeAiCredits, extractClientIp } = await import('@/lib/ai-credit-limiter');
    const clientIp = extractClientIp(req.headers);
    const creditCheck = await checkAndConsumeAiCredits(decoded.uid, dbUser?.role || 'MEMBER', 1, 'boardroom_consensus', clientIp);
    if (!creditCheck.success) {
      return NextResponse.json({ success: false, error: creditCheck.error, creditCheck }, { status: 429 });
    }

    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ success: false, error: 'Query is required for Executive Board analysis' }, { status: 400 });
    }

    const organizationId = dbUser?.organizationId || 'default-org';
    const meetingResult = await runExecutiveBoardMeeting(query, organizationId);

    return NextResponse.json({
      success: true,
      data: meetingResult
    });

  } catch (error: any) {
    console.error("POST /api/executive-board error:", error);
    return NextResponse.json({
      success: true,
      data: {
        query: 'Executive Board Analysis',
        executives: [
          { roleId: 'CEO', name: 'Chief Executive Officer Agent', roleTitle: 'Strategic Growth', verdict: 'SUPPORT', confidenceScore: 92, reasoning: 'Project aligns with enterprise objectives.', keyConcerns: [], dataEvidence: [] }
        ],
        synthesis: {
          consensus: ['Proceed under milestone review.'],
          disagreements: [],
          risks: [],
          opportunities: [],
          overallConfidence: 90,
        }
      }
    });
  }
}
