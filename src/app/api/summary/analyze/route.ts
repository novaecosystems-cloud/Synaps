export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateExecutiveSummary } from '@/lib/embeddings';

import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { documentId } = await req.json();

    if (!documentId) {
      return NextResponse.json({ success: false, error: 'Document ID is required' }, { status: 400 });
    }

    // Find the document to get the organizationId
    const doc = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!doc) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    // Fetch requirements, gaps, and decisions
    const requirements = await prisma.requirement.findMany({
      where: { documentId }
    });

    const gaps = await prisma.gap.findMany({
      where: { documentId }
    });
    
    const decision = await prisma.decision.findUnique({
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
    
    const decisionText = decision ? 
      `Recommendation: ${decision.recommendation}\nSummary: ${decision.executiveSummary}\nConfidence: ${decision.confidence}%\nRisks: ${decision.technicalRisk} | ${decision.complianceRisk} | ${decision.timelineRisk} | ${decision.financialRisk}\nEvidence: ${decision.supportingEvidence}\nCounterarguments: ${decision.counterarguments}`
      : 'No decision generated yet.';

    // Run AI executive summary engine
    const summaryData = await generateExecutiveSummary(requirementsText, gapsText, decisionText);

    // Upsert the summary
    const summary = await prisma.executiveSummary.upsert({
      where: { documentId },
      update: {
        executiveSummary: summaryData.executiveSummary,
        projectOverview: summaryData.projectOverview,
        keyRequirements: summaryData.keyRequirements,
        topRisks: summaryData.topRisks,
        topOpportunities: summaryData.topOpportunities,
        estimatedEffort: summaryData.estimatedEffort,
        complianceStatus: summaryData.complianceStatus,
        businessRecommendation: summaryData.businessRecommendation,
        evidenceReferences: summaryData.evidenceReferences
      },
      create: {
        documentId,
        organizationId: doc.organizationId,
        projectId: doc.projectId,
        executiveSummary: summaryData.executiveSummary,
        projectOverview: summaryData.projectOverview,
        keyRequirements: summaryData.keyRequirements,
        topRisks: summaryData.topRisks,
        topOpportunities: summaryData.topOpportunities,
        estimatedEffort: summaryData.estimatedEffort,
        complianceStatus: summaryData.complianceStatus,
        businessRecommendation: summaryData.businessRecommendation,
        evidenceReferences: summaryData.evidenceReferences
      }
    });

    return NextResponse.json({
      success: true,
      summary
    });

  } catch (error: any) {
    console.error('Executive Summary POST API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

