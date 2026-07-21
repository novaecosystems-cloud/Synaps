export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const proposalId = searchParams.get('proposalId');

  if (!proposalId) {
    return NextResponse.json({ error: 'Missing proposalId' }, { status: 400 });
  }

  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        approvalRequests: {
          include: {
            reviewer: true,
            comments: {
              include: { user: true },
              orderBy: { createdAt: 'asc' }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      status: proposal.status, 
      approvalRequests: proposal.approvalRequests 
    });
  } catch (error) {
    console.error('Error fetching workflow:', error);
    return NextResponse.json({ error: 'Failed to fetch workflow' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, proposalId, userId, organizationId } = body;

    if (!proposalId || !userId || !organizationId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fallback logic for mock UI users
    const realUser = await prisma.user.findFirst();
    let actualUserId = userId;
    if (userId === 'system' || userId.startsWith('user-')) {
       actualUserId = realUser?.id || userId;
    }

    const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } });
    if (!proposal) return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });

    if (action === 'STATUS_CHANGE') {
      const { newStatus } = body;
      
      const updatedProposal = await prisma.proposal.update({
        where: { id: proposalId },
        data: { status: newStatus }
      });

      await prisma.auditLog.create({
        data: {
          organizationId,
          userId: actualUserId,
          action: 'STATUS_CHANGED',
          entityType: 'PROPOSAL',
          entityId: proposalId,
          before: { status: proposal.status },
          after: { status: newStatus }
        }
      });

      return NextResponse.json(updatedProposal);
    } 
    
    else if (action === 'ASSIGN_REVIEWER') {
      let { reviewerId } = body;
      if (reviewerId?.startsWith('user-') && realUser) {
        reviewerId = realUser.id; // Map mock to real
      }
      
      const newRequest = await prisma.approvalRequest.create({
        data: {
          proposalId,
          reviewerId,
          status: 'PENDING'
        } as any
      });

      await prisma.auditLog.create({
        data: {
          organizationId,
          userId: actualUserId,
          action: 'REVIEWER_ASSIGNED',
          entityType: 'PROPOSAL',
          entityId: proposalId,
          after: { reviewerId, requestId: newRequest.id }
        }
      });

      await prisma.notification.create({
        data: {
          userId: reviewerId,
          organizationId,
          type: 'APPROVAL_REQUIRED',
          title: 'Review Requested',
          message: `You have been assigned to review proposal draft: ${proposal.title}`,
          link: `/dashboard/requirements?documentId=${proposal.documentId}`
        }
      });

      // Automatically move proposal to REVIEW status
      if (proposal.status === 'DRAFT') {
        await prisma.proposal.update({
          where: { id: proposalId },
          data: { status: 'REVIEW' }
        });
        await prisma.auditLog.create({
          data: {
            organizationId,
            userId: actualUserId,
            action: 'STATUS_CHANGED',
            entityType: 'PROPOSAL',
            entityId: proposalId,
            before: { status: proposal.status },
            after: { status: 'REVIEW' }
          }
        });
      }

      return NextResponse.json(newRequest);
    }
    
    else if (action === 'UPDATE_APPROVAL') {
      const { requestId, status } = body;
      
      const oldRequest = await prisma.approvalRequest.findUnique({ where: { id: requestId } });
      
      const updatedRequest = await prisma.approvalRequest.update({
        where: { id: requestId },
        data: { status }
      });

      await prisma.auditLog.create({
        data: {
          organizationId,
          userId: actualUserId,
          action: 'APPROVAL_STATUS_CHANGED',
          entityType: 'APPROVAL',
          entityId: proposalId,
          before: { status: oldRequest?.status },
          after: { status }
        }
      });

      if (proposal.documentId) {
        const doc = await prisma.document.findUnique({ where: { id: proposal.documentId } });
        if (doc && doc.ownerId) {
          await prisma.notification.create({
            data: {
              userId: doc.ownerId,
              organizationId,
              type: 'REVIEW_COMPLETED',
              title: `Review ${status}`,
              message: `Your proposal draft "${proposal.title}" was ${status.toLowerCase()} by a reviewer.`,
              link: `/dashboard/requirements?documentId=${proposal.documentId}`
            }
          });
        }
      }

      return NextResponse.json(updatedRequest);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Workflow action failed:', error);
    return NextResponse.json({ error: 'Workflow action failed' }, { status: 500 });
  }
}

