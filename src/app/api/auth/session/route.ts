export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { verifyIdToken, createSessionCookie } from '@/lib/auth-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    // 1. Verify the ID token
    const decoded = await verifyIdToken(idToken);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 2. Create a session cookie value
    const sessionCookie = await createSessionCookie(idToken);
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }

    // 3. Try to sync user to DB (optional, best-effort — won't block auth)
    try {
      const { rawPrisma } = await import('@/lib/prisma');
      const email = decoded.email || `${decoded.uid}@synaps.ai`;
      const existing = await rawPrisma.user.findUnique({ where: { id: decoded.uid } });
      if (!existing) {
        const orgName = decoded.name ? `${decoded.name}'s Organization` : 'My Organization';
        await rawPrisma.organization.create({
          data: {
            name: orgName,
            users: {
              create: {
                id: decoded.uid,
                email,
                name: decoded.name || null,
                avatarUrl: decoded.picture || null,
                role: 'OWNER',
              },
            },
          },
        });
      }
    } catch (dbErr) {
      // DB sync is best-effort — don't fail auth if DB is unavailable
      console.warn('[AUTH] DB sync skipped (non-fatal):', (dbErr as Error).message);
    }

    // 4. Set cookie directly on the response — this is the ONLY reliable way in Next.js 15 Route Handlers
    const response = NextResponse.json({ success: true, uid: decoded.uid });
    response.cookies.set('synaps-session', sessionCookie, {
      maxAge: 60 * 60 * 24 * 5, // 5 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    console.log('[AUTH] Session cookie set for UID:', decoded.uid);
    return response;

  } catch (error: any) {
    console.error('[AUTH] Session creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
