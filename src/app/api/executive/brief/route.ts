export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { generateExecutiveBriefData, askAiCooQuestion } from '@/lib/ai-coo';

async function getOrProvisionOrganizationId(uid: string, email?: string, name?: string): Promise<string> {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: uid },
      select: { organizationId: true }
    });

    if (dbUser?.organizationId) {
      return dbUser.organizationId;
    }

    // Auto-provision if missing
    const userEmail = email || `${uid}@synaps.ai`;
    const userName = name || 'Enterprise User';
    const newOrg = await prisma.organization.create({
      data: {
        name: `${userName}'s Organization`,
        users: {
          create: {
            id: uid,
            email: userEmail,
            name: userName,
            role: 'OWNER'
          }
        }
      }
    });

    return newOrg.id;
  } catch (err) {
    console.warn('[AUTH] Could not fetch or provision org from DB, using fallback org:', err);
    return 'default_org';
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded || !decoded.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const organizationId = await getOrProvisionOrganizationId(decoded.uid, decoded.email, decoded.name);
    const briefData = await generateExecutiveBriefData(organizationId);

    return NextResponse.json({
      success: true,
      data: briefData
    });

  } catch (error: any) {
    console.error("GET /api/executive/brief error:", error);
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

    const organizationId = await getOrProvisionOrganizationId(decoded.uid, decoded.email, decoded.name);

    const { question } = await req.json();
    if (!question) return NextResponse.json({ success: false, error: 'Question is required' }, { status: 400 });

    const answerData = await askAiCooQuestion(organizationId, question);

    return NextResponse.json({
      success: true,
      data: answerData
    });

  } catch (error: any) {
    console.error("POST /api/executive/brief error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
