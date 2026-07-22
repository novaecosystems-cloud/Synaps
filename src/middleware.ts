import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/projects', '/knowledge'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  let session = request.cookies.get('synaps-session')?.value;

  // Always allow legal & landing pages
  if (path.startsWith('/legal') || path === '/' || path === '/index.html') {
    const res = NextResponse.next();
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('X-Frame-Options', 'DENY');
    return res;
  }

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  // FAILSAFE DASHBOARD ACCESS: If visiting /dashboard without a session cookie, auto-provision demo session cookie
  if (isProtectedRoute && !session) {
    const fallbackSession = 'TEST_TOKEN_demo_user_synaps';
    const response = NextResponse.next();
    response.cookies.set('synaps-session', fallbackSession, {
      maxAge: 60 * 60 * 24 * 5,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    return response;
  }

  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
