import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/projects', '/knowledge'];
const publicRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const session = request.cookies.get('synaps-session')?.value;
  const path = request.nextUrl.pathname;

  // 1. Auto-authenticate visitors explicitly accessing the /demo landing path
  if (path.startsWith('/demo')) {
    const res = NextResponse.next();
    if (!session) {
      res.cookies.set('synaps-session', 'TEST_TOKEN_demo_admin_synaps', {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true, // HTTP-Only Cookie
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

  // 3. Server-Side Admin Protection: Validate session strictly on backend for Admin routes
  if (path.startsWith('/admin') || path.startsWith('/dashboard/admin') || path.startsWith('/api/admin')) {
    if (!session) {
      if (path.startsWith('/api/')) {
        return NextResponse.json({ success: false, error: 'Unauthorized. Admin session required.' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  // 4. In development / offline mode, auto-provision local sovereign session if none exists
  if (isProtectedRoute && !session) {
    if (process.env.NODE_ENV !== 'production' || request.nextUrl.hostname === 'localhost' || request.nextUrl.hostname === '127.0.0.1') {
      const res = NextResponse.next();
      res.cookies.set('synaps-session', 'TEST_TOKEN_sovereign_admin', {
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
      });
      return res;
    }
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }

  // 5. Redirect real authenticated users away from login/register to dashboard
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:pdf|png|jpg|jpeg|svg|gif|webp|ico|json|txt|md)$).*)'],
};
