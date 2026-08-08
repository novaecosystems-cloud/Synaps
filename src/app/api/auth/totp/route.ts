import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { createSessionCookie } from '@/lib/auth-server';

// Server-side in-memory store mapping email -> unique TOTP Base32 secret
const totpSecretStore = new Map<string, string>();

/**
 * GET: Generate Unique TOTP Secret + QR Code for Google Authenticator
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email') || 'user@synaps.ai';
    const forceNew = searchParams.get('forceNew') === 'true';
    const cleanEmail = email.trim().toLowerCase();

    // Generate fresh unique Base32 secret if forced or not exists
    let secret = totpSecretStore.get(cleanEmail);
    if (!secret || forceNew) {
      secret = authenticator.generateSecret();
      totpSecretStore.set(cleanEmail, secret);
    }

    // Standard RFC 6238 format: otpauth://totp/Synaps%20AI:email?secret=...&issuer=Synaps%20AI
    const otpauthUrl = authenticator.keyuri(cleanEmail, 'Synaps AI', secret);

    // Fail-proof QR Code image generation (Native Data URL + API Fallback)
    let qrCodeDataUrl = '';
    try {
      qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl, {
        margin: 2,
        width: 280,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
    } catch (e) {
      console.warn('[TOTP QR] QRCode.toDataURL fallback triggered:', e);
    }

    const fallbackQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(otpauthUrl)}`;

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      secret,
      otpauthUrl,
      qrCode: qrCodeDataUrl || fallbackQrUrl,
      fallbackQrUrl,
    });
  } catch (error: any) {
    console.error('[TOTP SETUP] Error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to generate 2FA QR code.' },
      { status: 500 }
    );
  }
}

/**
 * POST: Verify 6-digit TOTP code & set HTTP-Only Session Cookie
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body.email || 'user@synaps.ai').trim().toLowerCase();
    const token = (body.token || body.code || '').trim();

    const secret = totpSecretStore.get(email);

    if (!secret) {
      return NextResponse.json({
        success: false,
        error: 'No 2FA secret setup found for this email. Please scan the QR code first.',
      });
    }

    // Allow 1-step window tolerance for slight device clock drift
    authenticator.options = { window: 1 };
    const isValid = authenticator.check(token, secret);

    if (isValid) {
      // 2FA Verified! Establish Backend HTTP-Only Session Cookie
      const targetToken = `TEST_TOKEN_${email.split('@')[0]}_synaps_totp`;
      const sessionCookieValue = await createSessionCookie(targetToken);

      const response = NextResponse.json({
        success: true,
        message: 'Google Authenticator 2FA code verified successfully!',
        redirect: '/dashboard',
      });

      // Set Backend HTTP-Only Secure Session Cookie
      response.cookies.set('synaps-session', sessionCookieValue, {
        maxAge: 60 * 60 * 24 * 30, // 30 Days
        path: '/',
        httpOnly: true, // STRICT HTTP-ONLY
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return response;
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid 6-digit authenticator code. Check your phone app.',
      });
    }
  } catch (error: any) {
    console.error('[TOTP VERIFY] Error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to verify TOTP code.' },
      { status: 500 }
    );
  }
}
