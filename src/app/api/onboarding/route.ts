import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/auth-server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * POST /api/onboarding
 * Saves onboarding answers into org.settings JSON.
 * Marks onboardingCompleted: true.
 */
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifySessionCookie(session);
    if (!decoded?.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { sector, orgType, companyName, size, primaryRole, priorities, customAgents, customMetrics } = body;

    // Find the user's organization
    const user = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: { organizationId: true },
    });

    if (!user?.organizationId) {
      return NextResponse.json({ error: 'No organization found. Please create or join an organization first.' }, { status: 400 });
    }

    // Read existing settings and merge
    const org = await prisma.organization.findUnique({
      where: { id: user.organizationId },
      select: { settings: true },
    });

    const existingSettings = (org?.settings as Record<string, unknown>) ?? {};

    const updatedSettings = {
      ...existingSettings,
      sector: sector || 'default',
      orgType: orgType || 'enterprise',
      companyName: companyName || '',
      size: size || '11-50',
      primaryRole: primaryRole || 'executive',
      priorities: priorities || [],
      customAgents: customAgents || [],
      customMetrics: customMetrics || [],
      onboardingCompleted: true,
      onboardingCompletedAt: new Date().toISOString(),
    };

    // Also update org name if companyName provided
    const updateData: {
      settings: typeof updatedSettings;
      name?: string;
    } = { settings: updatedSettings };
    if (companyName && companyName.trim().length > 0) {
      updateData.name = companyName.trim();
    }

    await prisma.organization.update({
      where: { id: user.organizationId },
      data: updateData,
    });

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (err) {
    console.error('[POST /api/onboarding]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/onboarding
 * Returns current onboarding status for the user's org.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(session);
    if (!decoded?.uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: {
        organizationId: true,
        organization: { select: { settings: true, name: true } },
      },
    });

    const settings = (user?.organization?.settings as Record<string, unknown>) ?? {};

    return NextResponse.json({
      onboardingCompleted: settings.onboardingCompleted === true,
      sector: settings.sector || null,
      orgType: settings.orgType || null,
      companyName: settings.companyName || user?.organization?.name || null,
    });
  } catch (err) {
    console.error('[GET /api/onboarding]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
