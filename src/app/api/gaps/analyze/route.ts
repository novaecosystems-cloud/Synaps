export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { analyzeGaps } from '@/lib/embeddings';
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

    // Find the document to get the organizationId
    const doc = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!doc || doc.organizationId !== user.organizationId) {
      return NextResponse.json({ success: false, error: 'Document not found or unauthorized' }, { status: 404 });
    }

    // Fetch all requirements for this document that are missing or partially covered
    const unmetRequirements = await prisma.requirement.findMany({
      where: {
        documentId,
        coverageStatus: {
          in: ['MISSING', 'PARTIALLY_COVERED']
        }
      }
    });

    if (unmetRequirements.length === 0) {
      // Clear existing gaps if there are no unmet requirements
      await prisma.gap.deleteMany({ where: { documentId } });
      return NextResponse.json({ success: true, count: 0, message: "No missing requirements found." });
    }

    // Format for AI
    const requirementsText = unmetRequirements.map(req => 
      `ID: ${req.id}\nRequirement: ${req.text}\nCategory: ${req.category}\nCoverage: ${req.coverageStatus}\n`
    ).join('\n---\n');

    // Run AI gap analysis
    const generatedGaps = await analyzeGaps(requirementsText);

    // Delete old gaps
    await prisma.gap.deleteMany({
      where: { documentId }
    });

    // Whitelist valid enum values — guards against AI hallucinations and stale Prisma client bundles
    const VALID_GAP_CATEGORIES = ['CAPABILITY', 'CERTIFICATION', 'DOCUMENT', 'EXPERIENCE', 'COMPLIANCE', 'TEAM', 'TECHNICAL', 'OTHER'] as const;
    const VALID_GAP_SEVERITIES  = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
    type GapCategory = typeof VALID_GAP_CATEGORIES[number];
    type GapSeverity  = typeof VALID_GAP_SEVERITIES[number];

    const sanitizeCategory = (raw: string): GapCategory =>
      VALID_GAP_CATEGORIES.includes(raw as GapCategory) ? (raw as GapCategory) : 'OTHER';

    const sanitizeSeverity = (raw: string): GapSeverity =>
      VALID_GAP_SEVERITIES.includes(raw as GapSeverity) ? (raw as GapSeverity) : 'MEDIUM';

    // Insert new gaps
    const createdGaps = await prisma.$transaction(
      generatedGaps.map((g: any) => {
        // Validate that relatedRequirementId exists in our unmet list to prevent FK violations
        const isValidId = unmetRequirements.some(req => req.id === g.relatedRequirementId);
        
        return prisma.gap.create({
          data: {
            documentId,
            organizationId: doc.organizationId,
            projectId: doc.projectId,
            title: g.title,
            description: g.description,
            category: sanitizeCategory(g.category),
            severity: sanitizeSeverity(g.severity),
            suggestedResolution: g.suggestedResolution,
            relatedRequirementId: isValidId ? g.relatedRequirementId : null
          }
        });
      })
    );

    return NextResponse.json({
      success: true,
      count: createdGaps.length,
      gaps: createdGaps
    });

  } catch (error: any) {
    console.error('Gap Analysis POST API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

