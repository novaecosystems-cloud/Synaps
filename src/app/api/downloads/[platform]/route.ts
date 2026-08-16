import { NextRequest, NextResponse } from 'next/server';

const GITHUB_REPO = 'https://github.com/novaecosystems-cloud/Synaps';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const p = (platform || '').toLowerCase();

  // Safely redirect to GitHub Releases hub
  return NextResponse.redirect(`${GITHUB_REPO}/releases`, { status: 307 });
}
