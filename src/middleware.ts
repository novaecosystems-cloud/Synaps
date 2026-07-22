import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/projects', '/knowledge'];
const publicRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const session = request.cookies.get('synaps-session')?.value;
  const path = request.nextUrl.pathname;

  // Always allow legal & landing pages
  if (path.startsWith('/legal') || path === '/' || path === '/index.html') {
    const res = NextResponse.next();
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    return res;
  }

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  // STRICT AUTH ENFORCEMENT: Require login for all protected routes
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from login/register to dashboard
  if (isPublicRoute && session) {
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
