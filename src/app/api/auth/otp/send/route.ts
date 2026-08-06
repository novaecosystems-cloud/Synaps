import { NextRequest, NextResponse } from 'next/server';
import { generateOTP } from '@/lib/otp-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email || 'guest.demo@synaps.ai';
    const idToken = body.idToken;

    const { code, expiresAt, isDemo } = generateOTP(email, idToken);

    return NextResponse.json({
      success: true,
      message: isDemo 
        ? `Demo 2FA Security Code sent. Code: 123456`
        : `6-digit 2FA Security Code sent to your email. Check your inbox or server logs.`,
      // Secret protection: Only reveal hint for guest demo accounts
      otpCodeHint: isDemo ? '123456' : undefined,
      expiresAt: new Date(expiresAt).toISOString(),
    });
  } catch (error: any) {
    console.error('[API 2FA SEND] Error generating OTP:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to generate 2FA security code.' },
      { status: 500 }
    );
  }
}
