export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decodedToken = await verifySessionCookie(session);
    if (!decodedToken) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    
    const user = await prisma.user.findUnique({ where: { id: decodedToken.uid } });
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const documentId = searchParams.get('documentId');
    const category = searchParams.get('category');
    
    const where: any = {
      document: {
        organizationId: user.organizationId
      }
    };
    if (documentId) where.documentId = documentId;
    if (category && category !== 'ALL') where.category = category;

    const requirements = await prisma.requirement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        document: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      requirements
    });

  } catch (error: any) {
    console.error('Requirements API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

