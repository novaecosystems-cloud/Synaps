import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/auth-server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decodedToken = await verifySessionCookie(session);
    if (!decodedToken) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const params = await props.params;
    const job = await prisma.exportJob.findUnique({
      where: { id: params.id }
    });

    if (!job) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      status: job.status,
      progress: job.progress,
      fileUrl: job.fileUrl,
      error: job.error
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
