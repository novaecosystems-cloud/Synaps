export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL('/dashboard', request.url);
  const response = NextResponse.redirect(url);
  
  // Set demo guest session cookie for 30 days — 0 login required
  response.cookies.set('synaps-session', 'TEST_TOKEN_demo_guest_user', {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });

  return response;
}
