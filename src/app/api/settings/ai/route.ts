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
    const { aiSettings } = body;

    const beforeState = user.organization.settings;
    
    const existingSettings = typeof beforeState === 'object' && beforeState !== null ? beforeState : {};
    const newSettings = {
      ...existingSettings,
      ai: aiSettings
    };

    const updatedOrg = await prisma.organization.update({
      where: { id: user.organizationId },
      data: { settings: newSettings }
    });

    await prisma.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: 'AI_SETTINGS_UPDATED',
        entityType: 'ORGANIZATION',
        entityId: updatedOrg.id,
        before: { ai: (existingSettings as any)?.ai },
        after: { ai: aiSettings },
      }
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('AI Settings Update API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

