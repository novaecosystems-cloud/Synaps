export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/api-security';

export async function GET(req: NextRequest) {
  const _auth = await requireAuth(req);
  if (_auth instanceof NextResponse) return _auth;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const organizationId = searchParams.get('organizationId');

  if (!userId || !organizationId) {
    return NextResponse.json({ history: [] });
  }

  try {
    const history = await prisma.searchHistory.findMany({
      where: { userId, organizationId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      distinct: ['query']
    });

    return NextResponse.json({ history: history.map(h => h.query) });
  } catch (error: any) {
    console.error('History API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

