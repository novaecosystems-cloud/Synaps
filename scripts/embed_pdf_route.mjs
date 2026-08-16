import fs from 'fs';

const pdf = fs.readFileSync('D:/Synaps/SYNAPS_ENTERPRISE_HELM_BENCHMARK_REPORT.pdf');
const b64 = pdf.toString('base64');

const code = `export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

const EMBEDDED_BENCHMARK_PDF_BASE64 = '${b64}';

export async function GET() {
  try {
    const pdfBuffer = Buffer.from(EMBEDDED_BENCHMARK_PDF_BASE64, 'base64');

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
    return NextResponse.json({ error: 'Failed to serve PDF report' }, { status: 500 });
  }
}
`;

fs.writeFileSync('D:/Synaps/src/app/api/benchmark-report/route.ts', code);
console.log('Successfully wrote self-contained base64 PDF route handler!');
