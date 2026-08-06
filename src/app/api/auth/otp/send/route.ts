import { NextRequest, NextResponse } from 'next/server';
import { generateOTP } from '@/lib/otp-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email || 'demo@synaps.ai';
    const idToken = body.idToken;

    const { code, expiresAt } = generateOTP(email, idToken);

    return NextResponse.json({
      success: true,
      message: `2FA Security Code sent to ${email}.`,
      otpCodeHint: code, // Provided for user convenience & demo testing
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
