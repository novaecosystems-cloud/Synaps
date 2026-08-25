export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import { requireAuth, assertOrgAccess } from '@/lib/api-security';

export async function PATCH(req: NextRequest) {
  const _auth = await requireAuth(req);
  if (_auth instanceof NextResponse) return _auth;

  try {
    const { sectionId, content } = await req.json();

    if (!sectionId) {
      return NextResponse.json({ success: false, error: 'Section ID required' }, { status: 400 });
    }

    const existingSection = await prisma.proposalSection.findUnique({
      where: { id: sectionId },
      include: { proposal: true }
    });

    if (!existingSection) {
      return NextResponse.json({ success: false, error: 'Section not found' }, { status: 404 });
    }

    const orgCheck = assertOrgAccess(_auth.organizationId, existingSection.organizationId || existingSection.proposal?.organizationId);
    if (orgCheck) return orgCheck;

    const updatedSection = await prisma.proposalSection.update({
      where: { id: sectionId },
      data: { content }
    });

    return NextResponse.json({ success: true, section: updatedSection });
  } catch (error: any) {
    console.error('Proposals Section PATCH Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

