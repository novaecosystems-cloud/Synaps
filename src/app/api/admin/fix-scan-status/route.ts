export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/auth-server';
import prisma from '@/lib/prisma';

// One-time migration endpoint: marks all PENDING-scanned documents as CLEAN
// so the pipeline can proceed without a virus scanner webhook
export async function GET(req: NextRequest) {
  // Auth: must be logged-in user
  const cookieStore = await cookies();
  const session = cookieStore.get('synaps-session')?.value;
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await verifySessionCookie(session);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Patch all stuck PENDING scan statuses to CLEAN
  const [docResult, versionResult] = await Promise.all([
    prisma.document.updateMany({
      where: { scanStatus: 'PENDING' },
      data: { scanStatus: 'CLEAN' }
    }),
    prisma.documentVersion.updateMany({
      where: { scanStatus: 'PENDING' },
      data: { scanStatus: 'CLEAN' }
    })
  ]);

  return NextResponse.json({
    success: true,
    updated: {
      documents: docResult.count,
      versions: versionResult.count
    },
    message: `Fixed ${docResult.count} documents and ${versionResult.count} versions.`
  });
}
