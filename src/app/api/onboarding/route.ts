import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/auth-server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * POST /api/onboarding
 * Saves onboarding answers into org.settings JSON.
 * Marks onboardingCompleted: true.
 * Automatically creates organization and upserts user if missing.
 */
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const decoded = await verifySessionCookie(session);
    if (!decoded?.uid) {
      return NextResponse.json({ error: 'Invalid session. Please sign in again.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { sector, orgType, companyName, size, primaryRole, priorities, customAgents, customMetrics, documentTypes } = body;

    const cleanCompanyName = (companyName || 'My Organisation').trim();

    // 1. Ensure user exists in database
    let user: any = null;
    try {
      user = await prisma.user.findUnique({
        where: { id: decoded.uid },
        select: { id: true, organizationId: true, email: true, name: true, role: true },
      });
    } catch (e) {
      console.warn('[POST /api/onboarding] user lookup error:', e);
    }

    if (!user) {
      try {
        user = await prisma.user.create({
          data: {
            id: decoded.uid,
            email: decoded.email || `${decoded.uid}@causarix.ai`,
            name: decoded.name || 'Executive User',
            role: 'OWNER',
          },
          select: { id: true, organizationId: true, email: true, name: true, role: true },
        });
      } catch (e) {
        console.warn('[POST /api/onboarding] user create fallback:', e);
      }
    }

    // 2. Fetch or initialize Organization
    let org: any = null;
    if (user?.organizationId) {
      try {
        org = await prisma.organization.findUnique({
          where: { id: user.organizationId },
          select: { id: true, settings: true, name: true },
        });
      } catch (e) {
        console.warn('[POST /api/onboarding] org lookup error:', e);
      }
    }

    const existingSettings = (org?.settings as Record<string, unknown>) ?? {};

    const updatedSettings = {
      ...existingSettings,
      sector: sector || 'default',
      orgType: orgType || 'enterprise',
      companyName: cleanCompanyName,
      size: size || '11-50',
      primaryRole: primaryRole || 'executive',
      priorities: Array.isArray(priorities) ? priorities : [],
      customAgents: Array.isArray(customAgents) ? customAgents : [],
      customMetrics: Array.isArray(customMetrics) ? customMetrics : [],
      documentTypes: Array.isArray(documentTypes) ? documentTypes : [],
      onboardingCompleted: true,
      onboardingCompletedAt: new Date().toISOString(),
    };

    if (!org) {
      // Create new Organization automatically
      const slugBase = cleanCompanyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'org';
      const randomSuffix = crypto.randomBytes(3).toString('hex');
      const slug = `${slugBase}-${randomSuffix}`;
      const inviteCode = `CSX-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

      org = await prisma.organization.create({
        data: {
          name: cleanCompanyName,
          slug,
          inviteCode,
          ownerId: decoded.uid,
          isVerified: true,
          settings: updatedSettings,
        },
        select: { id: true, settings: true, name: true },
      });

      // Attach user to this new organization as OWNER
      await prisma.user.upsert({
        where: { id: decoded.uid },
        update: {
          organizationId: org.id,
          role: 'OWNER',
        },
        create: {
          id: decoded.uid,
          email: decoded.email || `${decoded.uid}@causarix.ai`,
          name: decoded.name || 'Executive User',
          organizationId: org.id,
          role: 'OWNER',
        },
      });
    } else {
      // Update existing organization
      await prisma.organization.update({
        where: { id: org.id },
        data: {
          name: cleanCompanyName || org.name,
          settings: updatedSettings,
        },
      });
    }

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (err: any) {
    console.error('[POST /api/onboarding] Uncaught error:', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
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

    let user: any = null;
    try {
      user = await prisma.user.findUnique({
        where: { id: decoded.uid },
        select: {
          organizationId: true,
          organization: { select: { settings: true, name: true } },
        },
      });
    } catch (e) {}

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
