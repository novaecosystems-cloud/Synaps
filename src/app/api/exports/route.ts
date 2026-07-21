export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { exportDocument } from '@/lib/services/export';

import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, format, documentId, projectId } = body;

    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decodedToken = await verifySessionCookie(session);
    if (!decodedToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: decodedToken.uid } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    const userId = user.id;
    const organizationId = user.organizationId;

    if (!type || !format) {
      return NextResponse.json({ success: false, error: 'Missing type or format' }, { status: 400 });
    }

    const exportJob = await prisma.exportJob.create({
      data: {
        userId,
        organizationId,
        documentId,
        type,
        format,
        status: 'PENDING',
        progress: 0,
      }
    });

    exportDocument(exportJob.id, type, format, documentId, projectId).catch(console.error);

    return NextResponse.json({ success: true, jobId: exportJob.id });
  } catch (error: any) {
    console.error('Export creation failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decodedToken = await verifySessionCookie(session);
    if (!decodedToken) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: decodedToken.uid } });
    if (!user) return NextResponse.json({ success: true, jobs: [] });
    
    const userId = user.id;
    const organizationId = user.organizationId;

    const jobs = await prisma.exportJob.findMany({
      where: { userId, organizationId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json({ success: true, jobs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

