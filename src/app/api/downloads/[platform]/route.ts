import { NextRequest, NextResponse } from 'next/server';

const GITHUB_REPO = 'https://github.com/novaecosystems-cloud/Synaps';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const p = (platform || '').toLowerCase();

  if (p === 'windows' || p === 'win' || p === 'exe') {
    return NextResponse.redirect(`${GITHUB_REPO}/releases/latest/download/Synaps-Setup.exe`);
  }

  if (p === 'mac' || p === 'macos' || p === 'dmg') {
    return NextResponse.redirect(`${GITHUB_REPO}/releases/latest/download/Synaps.dmg`);
  }

  if (p === 'linux' || p === 'appimage') {
    return NextResponse.redirect(`${GITHUB_REPO}/releases/latest/download/Synaps.AppImage`);
  }

  // Fallback to releases page
  return NextResponse.redirect(`${GITHUB_REPO}/releases/latest`);
}
