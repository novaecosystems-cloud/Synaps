export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateProposalSections } from '@/lib/proposal-engine';
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

    // Enforce 2-Use IP Trial Quota for Proposal Generator
    const { checkAndConsumeAiCredits, extractClientIp } = await import('@/lib/ai-credit-limiter');
    const clientIp = extractClientIp(req.headers);
    const creditCheck = await checkAndConsumeAiCredits(user.id, user.role || 'MEMBER', 1, 'proposals_generator', clientIp);

    if (!creditCheck.success) {
      return NextResponse.json({ 
        success: false, 
        error: creditCheck.error || 'Daily AI Credit Limit Reached',
        creditCheck 
      }, { status: 429 });
    }

    const { documentId, mode = 'detailed' } = await req.json();
    if (!documentId) return NextResponse.json({ success: false, error: 'Document ID required' }, { status: 400 });

    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (!doc || doc.organizationId !== user.organizationId) {
      return NextResponse.json({ success: false, error: 'Document not found or unauthorized' }, { status: 403 });
    }

    // Fetch context
    const requirements = await prisma.requirement.findMany({ where: { documentId } });
    const gaps = await prisma.gap.findMany({ where: { documentId } });
    const decision = await prisma.decision.findUnique({ where: { documentId } });

    const reqText = requirements.map(r => `${r.text} (${r.category})`).join('\n');
    const gapsText = gaps.map(g => `${g.title}: ${g.description}`).join('\n');
    const decText = decision ? `Recommendation: ${decision.recommendation}\nSummary: ${decision.executiveSummary}` : '';

    // Fetch chunks for deep context
    const chunks = await prisma.documentChunk.findMany({
      where: { documentId },
      take: 10,
      orderBy: { pageNumber: 'asc' }
    });
    const docSummary = chunks.map(c => c.text).join('\n---\n').slice(0, 4000);

    const generatedSections = await generateProposalSections({
      documentTitle: doc.name,
      documentSummary: docSummary,
      requirementsSummary: reqText || 'No specific requirements extracted.',
      gapsSummary: gapsText || 'No major gaps flagged.',
      decisionSummary: decText || 'Standard proposal approval workflow.',
      mode: mode as any
    });

    // Check if a proposal already exists for this document or create a new one
    let proposal = await prisma.proposal.findFirst({
      where: { documentId }
    });

    if (!proposal) {
      proposal = await prisma.proposal.create({
        data: {
          title: `Proposal: ${doc.name}`,
          content: 'Generated Proposal via Synaps Multi-Agent Engine',
          status: 'DRAFT',
          organizationId: user.organizationId,
          documentId: doc.id,
          authorId: user.id
        }
      });
    }

    // Delete existing sections if any, and insert new ones
    await prisma.proposalSection.deleteMany({
      where: { proposalId: proposal.id }
    });

    for (const sec of generatedSections) {
      await prisma.proposalSection.create({
        data: {
          proposalId: proposal.id,
          organizationId: user.organizationId,
          sectionType: sec.sectionType,
          title: sec.title,
          content: sec.content,
          order: sec.order,
          confidenceScore: sec.confidenceScore
        }
      });
    }

    const fullProposal = await prisma.proposal.findUnique({
      where: { id: proposal.id },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json({
      success: true,
      proposal: fullProposal
    });

  } catch (error: any) {
    console.error('Error generating proposal:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
