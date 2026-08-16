import { NextRequest, NextResponse } from 'next/server';

const DIRECT_WIN_EXE = 'https://github.com/novaecosystems-cloud/Synaps/releases/download/v2.5.0/Synaps-Setup-0.1.0.exe';
const RELEASES_HUB = 'https://github.com/novaecosystems-cloud/Synaps/releases/tag/v2.5.0';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const p = (platform || '').toLowerCase();

  if (p === 'win' || p === 'windows' || p === 'exe') {
    return NextResponse.redirect(DIRECT_WIN_EXE, { status: 307 });
  }

  return NextResponse.redirect(RELEASES_HUB, { status: 307 });
}
