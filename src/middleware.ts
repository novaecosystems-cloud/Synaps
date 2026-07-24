import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('synaps-session')?.value;
  const path = request.nextUrl.pathname;

  const response = NextResponse.next();

  // Auto-authenticate EVERY visitor as Demo Administrator if no session cookie exists
  // Zero auth walls, zero login popups, zero redirects
  if (!session) {
    response.cookies.set('synaps-session', 'TEST_TOKEN_demo_admin_synaps', {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });
  }

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
