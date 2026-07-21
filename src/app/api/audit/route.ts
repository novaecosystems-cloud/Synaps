export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const organizationId = searchParams.get('organizationId');
  if (!organizationId) {
    return NextResponse.json({ error: 'Missing organizationId' }, { status: 400 });
  }

  const action = searchParams.get('action');
  const entityId = searchParams.get('entityId');
  const userId = searchParams.get('userId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const search = searchParams.get('search');
  
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  try {
    const whereClause: Prisma.AuditLogWhereInput = { organizationId };

    if (action) whereClause.action = action;
    if (entityId) whereClause.entityId = entityId;
    if (userId) whereClause.userId = userId;
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate);
      if (endDate) whereClause.createdAt.lte = new Date(endDate);
    }

    // A basic search on the action or entityId or metadata
    if (search) {
      whereClause.OR = [
        { action: { contains: search, mode: 'insensitive' } },
        { entityId: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: whereClause,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.auditLog.count({ where: whereClause })
    ]);

    return NextResponse.json({ logs, total });
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { organizationId, userId, action, entityType, entityId, before, after, ipAddress, metadata } = body;

    if (!organizationId || !action || !entityType || !entityId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const log = await prisma.auditLog.create({
      data: {
        organizationId,
        userId,
        action,
        entityType,
        entityId,
        before,
        after,
        ipAddress,
        metadata
      }
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error('Failed to create audit log:', error);
    return NextResponse.json({ error: 'Failed to create audit log' }, { status: 500 });
  }
}

