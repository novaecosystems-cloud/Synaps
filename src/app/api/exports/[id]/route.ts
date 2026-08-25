import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, assertOrgAccess } from '@/lib/api-security';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const _auth = await requireAuth(request);
  if (_auth instanceof NextResponse) return _auth;

  try {
    const params = await props.params;
    const job = await prisma.exportJob.findUnique({
      where: { id: params.id }
    });

    if (!job) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    const orgCheck = assertOrgAccess(_auth.organizationId, job.organizationId);
    if (orgCheck) return orgCheck;

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
