import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

// In-memory store for TOTP secrets per user email
const totpSecretStore = new Map<string, string>();

/**
 * GET: Generate TOTP Secret + QR Code for setup
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email') || 'user@synaps.ai';
    const cleanEmail = email.trim().toLowerCase();

    // Generate or retrieve Base32 secret for user
    let secret = totpSecretStore.get(cleanEmail);
    if (!secret) {
      secret = authenticator.generateSecret();
      totpSecretStore.set(cleanEmail, secret);
    }

    // Format standardized otpauth:// URI
    const otpauthUrl = authenticator.keyuri(cleanEmail, 'Synaps AI', secret);

    // Fail-proof QR Code generation (Data URL with fallback HTTP API)
    let qrCodeDataUrl = '';
    try {
      qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl, {
        margin: 2,
        width: 260,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
    } catch (e) {
      console.warn('[TOTP QR] Native QRCode failed, using fallback:', e);
    }

    const fallbackQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(otpauthUrl)}`;

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
 * POST: Verify 6-digit TOTP code against stored secret
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

    // Check TOTP code validity with window tolerance for clock drift
    authenticator.options = { window: 1 };
    const isValid = authenticator.check(token, secret);

    if (isValid) {
      return NextResponse.json({
        success: true,
        message: 'Google Authenticator 2FA code verified successfully!',
      });
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
