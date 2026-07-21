export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const { sectionId, content } = await req.json();

    if (!sectionId) {
      return NextResponse.json({ success: false, error: 'Section ID required' }, { status: 400 });
    }

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

