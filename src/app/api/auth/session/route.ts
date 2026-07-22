export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { syncUserAction } from '@/app/actions/auth';
import { createSessionCookie } from '@/lib/auth-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    // 1. Sync user and organization in Database
    const syncRes = await syncUserAction(idToken);
    if (!syncRes.success) {
      return NextResponse.json({ error: syncRes.error || 'User sync failed' }, { status: 400 });
    }

    // 2. Create session cookie token
    const sessionCookie = await createSessionCookie(idToken);
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Session creation failed' }, { status: 500 });
    }

    // 3. Construct response and explicitly attach Set-Cookie header to response object
    const response = NextResponse.json({ success: true, organizationId: syncRes.organizationId });

    response.cookies.set('synaps-session', sessionCookie, {
      maxAge: 60 * 60 * 24 * 5, // 5 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    console.log('[AUTH API] Explicitly set synaps-session cookie on response headers');

    return response;
  } catch (error: any) {
    console.error('Session creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
