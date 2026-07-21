export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { regenerateSection } from '@/lib/proposal-engine';

import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { sectionId, instructions } = await req.json();
    if (!sectionId || !instructions) {
      return NextResponse.json({ success: false, error: 'Section ID and instructions required' }, { status: 400 });
    }

    const section = await prisma.proposalSection.findUnique({
      where: { id: sectionId },
      include: { proposal: true }
    });

    if (!section || !section.proposal.documentId) {
      return NextResponse.json({ success: false, error: 'Section or related Document not found' }, { status: 404 });
    }

    // Fetch requirements for context
    const requirements = await prisma.requirement.findMany({ 
      where: { documentId: section.proposal.documentId } 
    });
    const reqText = requirements.map(r => `${r.text}`).join('\n');

    // Call AI to rewrite
    const newContent = await regenerateSection(section.content, instructions, reqText);

    // Save previous version into history
    const historyEntry = {
      content: section.content,
      timestamp: new Date().toISOString(),
      prompt: instructions
    };

    const currentHistory = Array.isArray(section.versionHistory) ? section.versionHistory : [];
    const newHistory = [...currentHistory, historyEntry];

    // Update section with new content and append history
    const updatedSection = await prisma.proposalSection.update({
      where: { id: sectionId },
      data: {
        content: newContent,
        aiPrompt: instructions,
        versionHistory: newHistory
      }
    });

    return NextResponse.json({ success: true, section: updatedSection });
  } catch (error: any) {
    console.error('Proposals Regenerate API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

