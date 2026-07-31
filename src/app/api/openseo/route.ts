export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auditOpenSEO, getSoftwareApplicationJsonLd, getOpenSEOMetadata } from '@/lib/openseo';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const urlParam = searchParams.get('url') || process.env.NEXT_PUBLIC_APP_URL || 'https://synaps.ai';
    const titleParam = searchParams.get('title') || undefined;
    const descParam = searchParams.get('description') || undefined;

    const audit = auditOpenSEO(urlParam, titleParam, descParam);
    const jsonLd = getSoftwareApplicationJsonLd();

    return NextResponse.json({
      success: true,
      openSEO: {
        score: audit.score,
        audit,
        jsonLd,
        sitemapUrl: audit.sitemapStatus.sitemapUrl,
        robotsUrl: audit.robotsStatus.robotsUrl,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('GET /api/openseo error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, keywords } = body;

    const metadata = getOpenSEOMetadata({ title, description, keywords });
    const audit = auditOpenSEO(undefined, title, description);

    return NextResponse.json({
      success: true,
      metadata,
      audit
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
