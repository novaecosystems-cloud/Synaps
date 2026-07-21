export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { extractRequirements } from '@/lib/embeddings';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';

import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decodedToken = await verifySessionCookie(session);
    if (!decodedToken) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    
    const user = await prisma.user.findUnique({ where: { id: decodedToken.uid } });
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { documentId } = await req.json();

    if (!documentId) {
      return NextResponse.json({ success: false, error: 'Document ID is required' }, { status: 400 });
    }

    const processedDoc = await prisma.processedDocument.findUnique({
      where: { documentId },
      include: { document: true }
    });

    if (!processedDoc || !processedDoc.textContent) {
      return NextResponse.json({ success: false, error: 'Document not found or has no text content' }, { status: 404 });
    }

    if (processedDoc.document.organizationId !== user.organizationId) {
      return NextResponse.json({ success: false, error: 'Unauthorized access to document' }, { status: 403 });
    }

    // 1. Extract requirements using Gemini
    const requirements = await extractRequirements(processedDoc.textContent);

    // 2. Delete existing requirements for this document to avoid duplicates
    await prisma.requirement.deleteMany({
      where: { documentId }
    });

    // 3. Insert new requirements
    const createdRequirements = await prisma.$transaction(
      requirements.map((req: any) => prisma.requirement.create({
        data: {
          documentId,
          text: req.text,
          category: req.category || 'BUSINESS',
          priority: req.priority || 'MEDIUM',
          confidence: parseInt(req.confidence) || 85,
          pageNumber: parseInt(req.pageNumber) || null,
          evidence: req.evidence || ''
        } as any
      }))
    );

    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (doc) {
      await prisma.notification.create({
        data: {
          userId: doc.ownerId,
          organizationId: doc.organizationId,
          type: 'DOCUMENT_PROCESSED',
          title: 'Document Processing Complete',
          message: `Requirements extraction for ${doc.name} is complete.`,
          link: `/dashboard/requirements?documentId=${documentId}`
        }
      });
    }

    return NextResponse.json({
      success: true,
      count: createdRequirements.length,
      requirements: createdRequirements
    });

  } catch (error: any) {
    console.error('Requirements Extraction API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

