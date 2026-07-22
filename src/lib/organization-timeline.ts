import prisma from '@/lib/prisma';
import crypto from 'crypto';

export interface TimelineCommitItem {
  id: string;
  commitHash: string;
  title: string;
  description: string;
  category: 'HIRING' | 'PROJECT' | 'POLICY_CHANGE' | 'MEETING' | 'CONTRACT' | 'CUSTOMER' | 'DECISION' | 'INCIDENT' | 'PRODUCT_LAUNCH';
  eventDate: string;
  documentId?: string;
  documentName?: string;
  meetingId?: string;
  projectId?: string;
  metadata?: Record<string, any>;
}

export async function getOrganizationTimelineData(
  organizationId: string,
  categoryFilter?: string
): Promise<TimelineCommitItem[]> {

  // Fetch timeline events stored in database
  const whereClause: any = { organizationId };
  if (categoryFilter && categoryFilter !== 'ALL') {
    whereClause.category = categoryFilter;
  }

  let dbEvents = await prisma.timelineEvent.findMany({
    where: whereClause,
    orderBy: { eventDate: 'desc' },
    include: {
      document: { select: { id: true, name: true, mimeType: true } },
      meeting: { select: { id: true, title: true, summary: true, decisions: true, actionItems: true } }
    }
  });

  // If dbEvents are empty, auto-generate timeline commits from existing Documents, Projects, & Decisions!
  if (dbEvents.length === 0) {
    const docs = await prisma.document.findMany({
      where: { organizationId, isDeleted: false },
      take: 10,
      orderBy: { createdAt: 'desc' }
    });

    const projects = await prisma.project.findMany({
      where: { organizationId, isDeleted: false },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    const decisions = await prisma.decision.findMany({
      where: { organizationId },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    // Create synthetic commit entries for documents
    for (const d of docs) {
      const shortHash = crypto.createHash('md5').update(`doc-${d.id}`).digest('hex').substring(0, 7);
      let cat: any = 'CONTRACT';
      if (d.name.toLowerCase().includes('policy') || d.name.toLowerCase().includes('sop')) cat = 'POLICY_CHANGE';
      else if (d.name.toLowerCase().includes('hiring') || d.name.toLowerCase().includes('resume')) cat = 'HIRING';
      else if (d.name.toLowerCase().includes('meeting') || d.name.toLowerCase().includes('notes')) cat = 'MEETING';
      else if (d.name.toLowerCase().includes('launch') || d.name.toLowerCase().includes('product')) cat = 'PRODUCT_LAUNCH';

      await prisma.timelineEvent.create({
        data: {
          organizationId,
          commitHash: shortHash,
          title: `Ingested Document: ${d.name}`,
          description: `Document "${d.name}" was uploaded and processed into corporate memory.`,
          category: cat,
          eventDate: d.createdAt,
          documentId: d.id
        }
      });
    }

    for (const p of projects) {
      const shortHash = crypto.createHash('md5').update(`proj-${p.id}`).digest('hex').substring(0, 7);
      await prisma.timelineEvent.create({
        data: {
          organizationId,
          commitHash: shortHash,
          title: `Project Initialized: ${p.name}`,
          description: p.description || `New strategic project "${p.name}" created.`,
          category: 'PROJECT',
          eventDate: p.createdAt,
          projectId: p.id
        }
      });
    }

    for (const dec of decisions) {
      const shortHash = crypto.createHash('md5').update(`dec-${dec.id}`).digest('hex').substring(0, 7);
      await prisma.timelineEvent.create({
        data: {
          organizationId,
          commitHash: shortHash,
          title: `Executive Decision: ${dec.recommendation}`,
          description: dec.executiveSummary || 'Executive Go/No-Go decision approved.',
          category: 'DECISION',
          eventDate: dec.createdAt,
          decisionId: dec.id
        }
      });
    }

    // Re-fetch after auto-population
    dbEvents = await prisma.timelineEvent.findMany({
      where: whereClause,
      orderBy: { eventDate: 'desc' },
      include: {
        document: { select: { id: true, name: true, mimeType: true } },
        meeting: { select: { id: true, title: true, summary: true, decisions: true, actionItems: true } }
      }
    });
  }

  return dbEvents.map(e => ({
    id: e.id,
    commitHash: e.commitHash,
    title: e.title,
    description: e.description,
    category: e.category as any,
    eventDate: e.eventDate.toISOString(),
    documentId: e.documentId || undefined,
    documentName: e.document?.name,
    meetingId: e.meetingId || undefined,
    projectId: e.meeting?.id,
    metadata: (e.metadata as any) || {}
  }));
}
