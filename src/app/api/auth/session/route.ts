export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { syncUserAction, loginAction } from '@/app/actions/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    // 1. Sync user and organization in Database
    const syncRes = await syncUserAction(idToken);
    if (!syncRes.success) {
      return NextResponse.json({ error: syncRes.error || 'User sync failed' }, { status: 400 });
    }

    // 2. Set synaps-session cookie
    const loginRes = await loginAction(idToken);
    if (!loginRes.success) {
      return NextResponse.json({ error: loginRes.error || 'Session cookie creation failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, organizationId: syncRes.organizationId });
  } catch (error: any) {
    console.error('Session creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
