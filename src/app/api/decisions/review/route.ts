export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { evaluateAndStoreDecision } from '@/lib/decision-intelligence';

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

    const { title, problem, context, peopleInvolved, alternativesConsidered, risks, expectedOutcome, documentId, projectId } = await req.json();

    if (!title || !problem) {
      return NextResponse.json({ success: false, error: 'Title and problem statement are required' }, { status: 400 });
    }

    const reviewResult = await evaluateAndStoreDecision({
      title,
      problem,
      context: context || '',
      peopleInvolved: peopleInvolved || [],
      alternativesConsidered: alternativesConsidered || [],
      risks: risks || [],
      expectedOutcome: expectedOutcome || '',
      documentId,
      projectId
    }, organizationId);

    return NextResponse.json({
      success: true,
      data: reviewResult
    });

  } catch (error: any) {
    console.error("POST /api/decisions/review error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
