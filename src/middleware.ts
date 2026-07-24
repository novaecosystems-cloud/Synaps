import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/projects', '/knowledge'];
const publicRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const session = request.cookies.get('synaps-session')?.value;
  const path = request.nextUrl.pathname;

  // 1. Auto-authenticate any visitor accessing /demo as Demo Administrator
  if (path.startsWith('/demo') || request.headers.get('referer')?.includes('/demo')) {
    const res = NextResponse.next();
    if (!session) {
      res.cookies.set('synaps-session', 'TEST_TOKEN_demo_admin_synaps', {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
      });
    }
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    return res;
  }

  // 2. Allow Legal pages
  if (path.startsWith('/legal')) {
    const res = NextResponse.next();
    res.headers.set('X-Content-Type-Options', 'nosniff');
    return res;
  }

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  // 3. Strict Auth Protection: Require session cookie for protected dashboard routes
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }

  // 4. Redirect real authenticated users away from login/register to dashboard
  if (isPublicRoute && session && !session.startsWith('TEST_TOKEN_')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
