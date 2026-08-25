export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
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

    const orgId = user.organizationId || 'default-org';
    const beforeState = user.organization?.settings || {};
    
    const existingSettings = typeof beforeState === 'object' && beforeState !== null ? beforeState : {};
    const newSettings = {
      ...existingSettings,
      ai: aiSettings
    };

    const updatedOrg = await prisma.organization.update({
      where: { id: orgId },
      data: { settings: newSettings }
    });

    await prisma.auditLog.create({
      data: {
        organizationId: orgId,
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

