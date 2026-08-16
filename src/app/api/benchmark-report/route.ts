export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const candidatePaths = [
      path.join(process.cwd(), 'public', 'SYNAPS_ENTERPRISE_HELM_BENCHMARK_REPORT.pdf'),
      path.join(process.cwd(), 'SYNAPS_ENTERPRISE_HELM_BENCHMARK_REPORT.pdf'),
      'D:/Synaps/public/SYNAPS_ENTERPRISE_HELM_BENCHMARK_REPORT.pdf',
      'D:/Synaps/SYNAPS_ENTERPRISE_HELM_BENCHMARK_REPORT.pdf'
    ];

    let pdfBuffer: Buffer | null = null;
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        pdfBuffer = fs.readFileSync(p);
        break;
      }
    }

    if (!pdfBuffer) {
      return NextResponse.json({ error: 'Benchmark PDF report not found' }, { status: 404 });
    }

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="SYNAPS_ENTERPRISE_HELM_BENCHMARK_REPORT.pdf"',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error: any) {
    console.error('Failed to serve benchmark PDF:', error);
    return NextResponse.json({ error: 'Failed to load PDF report' }, { status: 500 });
  }
}
