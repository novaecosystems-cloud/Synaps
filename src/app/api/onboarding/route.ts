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
 * Automatically provisions session if unauthenticated.
 * Persists initialScenario and customDilemma for executive cockpit pre-population.
 */
export async function POST(req: Request) {
  try {
    let session: string | undefined;
    let cookieStore: any = null;
    try {
      cookieStore = await cookies();
      session = cookieStore.get('synaps-session')?.value;
    } catch (cookieErr) {
      // In tests or outside Next request context
    }

    // Direct header fallback if cookieStore is unavailable or empty
    if (!session && req && req.headers) {
      const cookieHeader = typeof req.headers.get === 'function' ? req.headers.get('cookie') || '' : '';
      const match = cookieHeader.match(/synaps-session=([^;]+)/);
      if (match) {
        try {
          session = decodeURIComponent(match[1]);
        } catch {
          session = match[1];
        }
      }
    }

    let isAutoProvisioned = false;
    let sessionToken = session;

    let decoded: any = null;
    if (session) {
      try {
        decoded = await verifySessionCookie(session);
      } catch (e) {
        console.warn('[POST /api/onboarding] verifySessionCookie error:', e);
      }
    }

    // Auto-provision sovereign demo session if unauthenticated or invalid session
    if (!decoded?.uid) {
      const sovereignUid = 'sovereign-user';
      sessionToken = `DEMO_SESSION_${sovereignUid}`;
      isAutoProvisioned = true;
      decoded = {
        uid: sovereignUid,
        email: 'admin@apex-global.com',
        name: 'Sovereign Administrator',
      };
      if (cookieStore && typeof cookieStore.set === 'function') {
        try {
          cookieStore.set('synaps-session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 30 * 24 * 60 * 60, // 30 days
          });
        } catch (cookieErr) {
          console.warn('[POST /api/onboarding] cookieStore.set warning:', cookieErr);
        }
      }
    }

    const body = await req.json().catch(() => ({}));
    const {
      sector,
      orgType,
      companyName,
      size,
      primaryRole,
      priorities,
      customAgents,
      customMetrics,
      documentTypes,
      initialScenario,
      customDilemma,
    } = body;

    const cleanCompanyName = (companyName || 'Apex Global Enterprise').trim();
    const sanitizedCustomDilemma =
      typeof customDilemma === 'string' && customDilemma.trim().length > 0
        ? customDilemma.trim()
        : null;

    // 1. Ensure user exists in database
    let user: any = null;
    try {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { id: decoded.uid },
            ...(decoded.email ? [{ email: decoded.email }] : []),
          ],
        },
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
      sector: sector || 'legal',
      orgType: orgType || (sector === 'legal' ? 'professional-services' : sector === 'biotech' ? 'biotech' : 'enterprise'),
      companyName: cleanCompanyName,
      size: size || '51-200',
      primaryRole: primaryRole || 'general-counsel',
      priorities: Array.isArray(priorities) && priorities.length > 0 ? priorities : ['contract-risk', 'board-governance'],
      customAgents: Array.isArray(customAgents) ? customAgents : [],
      customMetrics: Array.isArray(customMetrics) ? customMetrics : [],
      documentTypes: Array.isArray(documentTypes) ? documentTypes : ['contracts', 'board-minutes'],
      initialScenario: initialScenario || 'contract',
      customDilemma: sanitizedCustomDilemma,
      onboardingCompleted: true,
      onboardingCompletedAt: new Date().toISOString(),
    };

    try {
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
            ownerId: user?.id || decoded.uid,
            isVerified: true,
            settings: updatedSettings,
          },
          select: { id: true, settings: true, name: true },
        });

        // Attach user to this new organization as OWNER
        if (user?.id) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              organizationId: org.id,
              role: 'OWNER',
            },
          });
        }
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
    } catch (dbErr) {
      console.warn('[POST /api/onboarding] Database persistence warning:', dbErr);
    }

    const res = NextResponse.json({
      success: true,
      autoProvisioned: isAutoProvisioned,
      sessionToken: isAutoProvisioned ? sessionToken : undefined,
      settings: updatedSettings,
    });

    if (isAutoProvisioned && sessionToken) {
      res.cookies.set('synaps-session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    return res;
  } catch (err: any) {
    console.error('[POST /api/onboarding] Uncaught error:', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/onboarding
 * Returns current onboarding status and persisted scenario settings for the user's org.
 */
export async function GET(req?: Request) {
  try {
    let session: string | undefined;
    let cookieStore: any = null;
    try {
      cookieStore = await cookies();
      session = cookieStore.get('synaps-session')?.value;
    } catch (e) {}

    if (!session && req && req.headers) {
      const cookieHeader = typeof req.headers.get === 'function' ? req.headers.get('cookie') || '' : '';
      const match = cookieHeader.match(/synaps-session=([^;]+)/);
      if (match) {
        try {
          session = decodeURIComponent(match[1]);
        } catch {
          session = match[1];
        }
      }
    }

    if (!session) return NextResponse.json({ error: 'Unauthorized', onboardingCompleted: false }, { status: 401 });

    const decoded = await verifySessionCookie(session);
    if (!decoded?.uid) return NextResponse.json({ error: 'Unauthorized', onboardingCompleted: false }, { status: 401 });

    let user: any = null;
    try {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { id: decoded.uid },
            ...(decoded.email ? [{ email: decoded.email }] : []),
          ],
        },
        select: {
          organizationId: true,
          organization: { select: { settings: true, name: true } },
        },
      });
    } catch (e) {
      console.warn('[GET /api/onboarding] user lookup warning:', e);
    }

    const settings = (user?.organization?.settings as Record<string, unknown>) ?? {};

    return NextResponse.json({
      onboardingCompleted: settings.onboardingCompleted === true,
      sector: settings.sector || null,
      orgType: settings.orgType || null,
      companyName: settings.companyName || user?.organization?.name || null,
      primaryRole: settings.primaryRole || null,
      initialScenario: settings.initialScenario || null,
      customDilemma: settings.customDilemma || null,
      settings,
    });
  } catch (err) {
    console.error('[GET /api/onboarding]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
