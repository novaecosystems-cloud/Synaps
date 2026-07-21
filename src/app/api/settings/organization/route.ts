export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/firebase-admin';

import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Insufficient role' }, { status: 403 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid organization name' }, { status: 400 });
    }

    const beforeState = user.organization;

    const updatedOrg = await prisma.organization.update({
      where: { id: user.organizationId },
      data: { name }
    });

    // Audit logging
    await prisma.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: 'ORGANIZATION_UPDATED',
        entityType: 'ORGANIZATION',
        entityId: updatedOrg.id,
        before: { name: beforeState.name },
        after: { name: updatedOrg.name },
      }
    });

    return NextResponse.json({ success: true, organization: updatedOrg });

  } catch (error: any) {
    console.error('Organization Update API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

