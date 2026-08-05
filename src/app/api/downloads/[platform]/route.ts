import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const resolvedParams = await params;
  const platform = resolvedParams.platform.toLowerCase();

  if (platform === 'win' || platform === 'windows' || platform === 'exe') {
    const filePath = path.join(process.cwd(), 'public', 'downloads', 'Synaps-Setup-v2.5.exe');
    
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return new NextResponse(fileBuffer as unknown as BodyInit, {
        status: 200,
        headers: {
          'Content-Type': 'application/x-msdownload',
          'Content-Disposition': 'attachment; filename="Synaps-Setup-v2.5.exe"',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    // Fallback redirect directly to public binary
    return NextResponse.redirect(new URL('/downloads/Synaps-Setup-v2.5.exe', req.url));
  }

  if (platform === 'mac' || platform === 'macos' || platform === 'dmg') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (platform === 'cli') {
    const cliScript = `#!/usr/bin/env node
console.log("Synaps CLI v2.5.0");
console.log("Run: npx synapse ask 'summarize contract terms'");
`;

    return new NextResponse(cliScript, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Content-Disposition': 'attachment; filename="synaps-cli.js"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  return NextResponse.json({ error: 'Unsupported download platform.' }, { status: 404 });
}
