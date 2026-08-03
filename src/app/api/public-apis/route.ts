export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { fetchPublicApis } from '@/lib/public-apis';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';

/**
 * GET /api/public-apis?category=...&query=...
 * Query public APIs from https://github.com/public-apis/public-apis integration index.
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded || !decoded.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const query = searchParams.get('query') || undefined;

    const apis = await fetchPublicApis(category, query);

    return NextResponse.json({
      success: true,
      source: 'https://github.com/public-apis/public-apis',
      total: apis.length,
      apis,
    });
  } catch (error: any) {
    console.error('GET /api/public-apis error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
