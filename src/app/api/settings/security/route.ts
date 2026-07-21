export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/firebase-admin';

import prisma from '@/lib/prisma';

export async function DELETE(req: NextRequest) {
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
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role === 'OWNER') {
      return NextResponse.json({ error: 'Organization owners cannot delete their account without transferring ownership first.' }, { status: 400 });
    }

    // Instead of raw deletion, we might archive or anonymize, but for now we hard delete to satisfy requirements.
    // We log it before deletion via the auth user, but wait, if user is deleted, auditLog might fail if it relies on userId foreign key.
    // In our schema, userId on AuditLog is optional, so we can set it to null or keep it (if it doesn't cascade delete).
    // Let's check schema: AuditLog user relation does not have onDelete: Cascade. 
    // We should delete user.

    await prisma.user.delete({
      where: { id: userId }
    });
    
    // Also delete from firebase
    await auth.deleteUser(userId);

    // We can't easily log to AuditLog with the deleted user's ID because of FK constraint, 
    // unless we log with null userId and include email in metadata.
    await prisma.auditLog.create({
      data: {
        organizationId: user.organizationId,
        action: 'ACCOUNT_DELETED',
        entityType: 'USER',
        entityId: userId,
        metadata: { email: user.email, name: user.name }
      }
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Account Deletion API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

