export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { encryptApiKey, maskApiKey } from '@/lib/encryption';
import { setCustomUserApiKey, getCustomUserApiKey } from '@/lib/ai-credit-limiter';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded || !decoded.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const rawKey = getCustomUserApiKey(decoded.uid);
    const hasKey = !!rawKey;
    const maskedKey = hasKey ? maskApiKey(rawKey) : '';

    return NextResponse.json({
      success: true,
      hasKey,
      maskedKey
    });

  } catch (error: any) {
    console.error('GET /api/settings/ai/keys error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded || !decoded.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { apiKey } = await req.json();

    if (!apiKey) {
      // Remove custom key
      setCustomUserApiKey(decoded.uid, '');
      return NextResponse.json({
        success: true,
        message: 'Custom API key removed. Workspace returned to standard daily credit quotas.',
        hasKey: false,
        maskedKey: ''
      });
    }

    // Encrypt key with AES-256-GCM zero-knowledge encryption
    const encrypted = encryptApiKey(apiKey);
    setCustomUserApiKey(decoded.uid, encrypted);

    return NextResponse.json({
      success: true,
      message: 'Custom API Key encrypted with AES-256-GCM & saved! Unlimited AI credits activated for your account.',
      hasKey: true,
      maskedKey: maskApiKey(apiKey)
    });

  } catch (error: any) {
    console.error('POST /api/settings/ai/keys error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
