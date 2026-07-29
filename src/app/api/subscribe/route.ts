export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required.' },
        { status: 400 }
      );
    }

    console.log(`[SYNAPS Newsletter] New subscription registered: ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing to SYNAPS enterprise updates.',
      email: email,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Subscription API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription.' },
      { status: 500 }
    );
  }
}
