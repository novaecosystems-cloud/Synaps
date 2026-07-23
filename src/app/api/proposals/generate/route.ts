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

    // Enforce Daily AI Credit Limit
    const { checkAndConsumeAiCredits } = await import('@/lib/ai-credit-limiter');
    const creditCheck = await checkAndConsumeAiCredits(user.id, user.role || 'MEMBER', 1);

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

    // Generate sections via AI
    const sectionsData = await generateProposalSections(documentId, reqText, gapsText, decText, mode);

    // Upsert Proposal
    let proposal = await prisma.proposal.findUnique({ where: { documentId } });
    
    if (proposal) {
      // Delete existing sections to overwrite
      await prisma.proposalSection.deleteMany({ where: { proposalId: proposal.id } });
    } else {
      proposal = await prisma.proposal.create({
        data: {
          documentId,
          organizationId: doc.organizationId,
          projectId: doc.projectId,
          title: `Proposal Draft: ${doc.name}`,
        }
      });
    }

    // Insert new sections
    await prisma.proposalSection.createMany({
      data: sectionsData.map(s => ({
        proposalId: proposal!.id,
        title: s.title,
        content: s.content,
        order: s.order
      })) as any
    });

    const finalProposal = await prisma.proposal.findUnique({
      where: { id: proposal.id },
      include: { sections: { orderBy: { order: 'asc' } } }
    });

    await prisma.notification.create({
      data: {
        userId: doc.ownerId,
        organizationId: doc.organizationId,
        type: 'AI_COMPLETED',
        title: 'Proposal Generation Complete',
        message: `Your AI-generated proposal draft for ${doc.name} is ready for review.`,
        link: `/dashboard/proposals/edit/${proposal.id}`
      }
    });

    return NextResponse.json({ success: true, proposal: finalProposal });
  } catch (error: any) {
    console.error('Proposals Generate API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

