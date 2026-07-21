export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requestId, userId, content, organizationId, proposalId } = body;

    if (!requestId || !userId || !content || !organizationId || !proposalId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fallback logic for mock UI users
    const realUser = await prisma.user.findFirst();
    let actualUserId = userId;
    if ((userId === 'system' || userId.startsWith('user-')) && realUser) {
       actualUserId = realUser.id;
    }

    const comment = await prisma.approvalComment.create({
      data: {
        requestId,
        userId: actualUserId,
        content
      } as any,
      include: {
        user: true
      }
    });

    await prisma.auditLog.create({
      data: {
        organizationId,
        userId: actualUserId,
        action: 'COMMENT_ADDED',
        entityType: 'PROPOSAL',
        entityId: proposalId,
        after: { commentId: comment.id, content }
      }
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Failed to post comment:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}

