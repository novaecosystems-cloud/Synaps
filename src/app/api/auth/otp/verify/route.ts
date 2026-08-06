import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp-store';
import { createSessionCookie } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email || 'demo@synaps.ai';
    const otpCode = body.otpCode || body.code || '';
    const providedIdToken = body.idToken;

    if (!otpCode) {
      return NextResponse.json(
        { success: false, error: 'Please enter the 6-digit 2FA Security Code.' },
        { status: 400 }
      );
    }

    const verification = verifyOTP(email, otpCode);

    if (!verification.valid) {
      return NextResponse.json(
        { success: false, error: verification.reason || 'Invalid 2FA Security Code.' },
        { status: 400 }
      );
    }

    // 2FA Verified! Establish Backend HTTP-Only Session Token
    const targetToken = providedIdToken || verification.idToken || `TEST_TOKEN_${email.split('@')[0]}_synaps`;
    const sessionCookieValue = await createSessionCookie(targetToken);

    const response = NextResponse.json({
      success: true,
      message: '2FA Authentication Verified. Logging in...',
      redirect: '/dashboard',
    });

    // Set Backend HTTP-Only Secure Cookie (No JavaScript access -> 100% XSS Protection)
    response.cookies.set('synaps-session', sessionCookieValue, {
      maxAge: 60 * 60 * 24 * 30, // 30 Days
      path: '/',
      httpOnly: true, // STRICT HTTP-ONLY (No Client-side XSS access)
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('[API 2FA VERIFY] Error verifying OTP:', error.message);
    return NextResponse.json(
      { success: false, error: 'Internal server error during 2FA verification.' },
      { status: 500 }
    );
  }
}
