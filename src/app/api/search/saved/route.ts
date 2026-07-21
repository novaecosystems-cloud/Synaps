export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const organizationId = searchParams.get('organizationId');

  if (!userId || !organizationId) {
    return NextResponse.json({ savedSearches: [] });
  }

  try {
    const saved = await prisma.savedSearch.findMany({
      where: { userId, organizationId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ savedSearches: saved });
  } catch (error: any) {
    console.error('Saved Search GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, organizationId, name, query, filters } = body;

    if (!userId || !organizationId || !name || !query) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const saved = await prisma.savedSearch.create({
      data: {
        userId,
        organizationId,
        name,
        query,
        filters: filters || {}
      }
    });

    return NextResponse.json({ success: true, savedSearch: saved });
  } catch (error: any) {
    console.error('Saved Search POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    await prisma.savedSearch.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Saved Search DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

