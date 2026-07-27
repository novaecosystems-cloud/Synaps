import { NextRequest, NextResponse } from 'next/server';
import { verifySessionCookie } from '@/lib/auth-server';

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get('synaps-session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({
      authenticated: false,
      reason: 'no_session_cookie',
    }, { status: 401 });
  }

  const session = await verifySessionCookie(sessionCookie);

  if (!session) {
    // Session is invalid or expired
    const response = NextResponse.json({
      authenticated: false,
      reason: 'session_expired',
    }, { status: 401 });

    // Clear expired cookie
    response.cookies.set('synaps-session', '', {
      maxAge: 0,
      path: '/',
    });

    return response;
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const expiresAt = session.exp || (nowSec + 86400);
  const expiresInSeconds = Math.max(0, expiresAt - nowSec);

  return NextResponse.json({
    authenticated: true,
    user: {
      uid: session.uid,
      email: session.email,
      name: session.name,
    },
    expiresAt,
    expiresInSeconds,
    formattedExpiresAt: new Date(expiresAt * 1000).toISOString(),
  });
}

export async function POST(req: NextRequest) {
  // Logout / Terminate Session
  const response = NextResponse.json({
    success: true,
    message: 'Session successfully terminated.',
  });

  response.cookies.set('synaps-session', '', {
    maxAge: 0,
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
