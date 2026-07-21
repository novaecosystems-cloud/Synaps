export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateDecision } from '@/lib/embeddings';
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

    // Fetch requirements and gaps
    const requirements = await prisma.requirement.findMany({
      where: { documentId }
    });

    const gaps = await prisma.gap.findMany({
      where: { documentId }
    });

    if (requirements.length === 0) {
      return NextResponse.json({ success: false, error: "No requirements extracted. Run extraction first." }, { status: 400 });
    }

    // Format for AI
    const requirementsText = requirements.map(req => 
      `Requirement: ${req.text}\nCategory: ${req.category}\nCoverage: ${req.coverageStatus || 'UNKNOWN'}\n`
    ).join('\n---\n');

    const gapsText = gaps.map(gap => 
      `Gap: ${gap.title}\nSeverity: ${gap.severity}\nDescription: ${gap.description}\n`
    ).join('\n---\n');

    // Run AI decision engine
    const decisionData = await generateDecision(requirementsText, gapsText);

    // Upsert the decision
    const decision = await prisma.decision.upsert({
      where: { documentId },
      update: {
        recommendation: decisionData.recommendation,
        status: 'DRAFT',
        executiveSummary: decisionData.executiveSummary,
        businessImpact: decisionData.businessImpact,
        technicalRisk: decisionData.technicalRisk,
        complianceRisk: decisionData.complianceRisk,
        timelineRisk: decisionData.timelineRisk,
        financialRisk: decisionData.financialRisk,
        confidence: decisionData.confidence,
        supportingEvidence: decisionData.supportingEvidence,
        counterarguments: decisionData.counterarguments,
        alternativeRecommendation: decisionData.alternativeRecommendation
      },
      create: {
        documentId,
        organizationId: doc.organizationId,
        projectId: doc.projectId,
        recommendation: decisionData.recommendation,
        status: 'DRAFT',
        executiveSummary: decisionData.executiveSummary,
        businessImpact: decisionData.businessImpact,
        technicalRisk: decisionData.technicalRisk,
        complianceRisk: decisionData.complianceRisk,
        timelineRisk: decisionData.timelineRisk,
        financialRisk: decisionData.financialRisk,
        confidence: decisionData.confidence,
        supportingEvidence: decisionData.supportingEvidence,
        counterarguments: decisionData.counterarguments,
        alternativeRecommendation: decisionData.alternativeRecommendation
      }
    });

    return NextResponse.json({
      success: true,
      decision
    });

  } catch (error: any) {
    console.error('Decision Analysis POST API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

