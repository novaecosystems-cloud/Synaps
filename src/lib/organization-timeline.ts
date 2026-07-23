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
  const whereClause: any = { organizationId };
  if (categoryFilter && categoryFilter !== 'ALL') {
    whereClause.category = categoryFilter;
  }

  let dbEvents: any[] = [];
  try {
    dbEvents = await prisma.timelineEvent.findMany({
      where: whereClause,
      orderBy: { eventDate: 'desc' },
      include: {
        document: { select: { id: true, name: true, mimeType: true } },
        meeting: { select: { id: true, title: true, summary: true, decisions: true, actionItems: true } }
      }
    });
  } catch (err) {
    console.warn('[TIMELINE] TimelineEvent fetch warning:', err);
  }

  // If dbEvents are empty, auto-generate timeline commits from existing Documents, Projects, & Decisions!
  if (dbEvents.length === 0) {
    let docs: any[] = [];
    let projects: any[] = [];
    let decisions: any[] = [];

    try {
      docs = await prisma.document.findMany({
        where: { organizationId, isDeleted: false },
        take: 10,
        orderBy: { createdAt: 'desc' }
      });
    } catch (e) {}

    try {
      projects = await prisma.project.findMany({
        where: { organizationId, isDeleted: false },
        take: 5,
        orderBy: { createdAt: 'desc' }
      });
    } catch (e) {}

    try {
      decisions = await prisma.decision.findMany({
        where: { organizationId },
        take: 5,
        orderBy: { createdAt: 'desc' }
      });
    } catch (e) {}

    const items: TimelineCommitItem[] = [];

    for (const d of docs) {
      const shortHash = crypto.createHash('md5').update(`doc-${d.id}`).digest('hex').substring(0, 7);
      items.push({
        id: `synth-doc-${d.id}`,
        commitHash: shortHash,
        title: `Ingested Document: ${d.name}`,
        description: `Ingested ${d.name} (${d.mimeType || 'PDF'}) into corporate memory graph.`,
        category: 'CONTRACT',
        eventDate: d.createdAt.toISOString().slice(0, 10),
        documentId: d.id,
        documentName: d.name
      });
    }

    for (const p of projects) {
      const shortHash = crypto.createHash('md5').update(`proj-${p.id}`).digest('hex').substring(0, 7);
      items.push({
        id: `synth-proj-${p.id}`,
        commitHash: shortHash,
        title: `Project Milestone: ${p.name}`,
        description: `Project status set to ${p.status}. Multi-agent workflows active.`,
        category: 'PROJECT',
        eventDate: p.createdAt.toISOString().slice(0, 10),
        projectId: p.id
      });
    }

    for (const dec of decisions) {
      const shortHash = crypto.createHash('md5').update(`dec-${dec.id}`).digest('hex').substring(0, 7);
      items.push({
        id: `synth-dec-${dec.id}`,
        commitHash: shortHash,
        title: `Executive Decision: ${dec.recommendation || 'Proposal Review'}`,
        description: dec.executiveSummary?.slice(0, 150) || 'Autonomous Go/No-Go evaluation finalized.',
        category: 'DECISION',
        eventDate: dec.createdAt.toISOString().slice(0, 10)
      });
    }

    if (items.length === 0) {
      return getFallbackTimeline();
    }

    return items;
  }

  return dbEvents.map(e => ({
    id: e.id,
    commitHash: crypto.createHash('md5').update(`event-${e.id}`).digest('hex').substring(0, 7),
    title: e.title,
    description: e.description,
    category: e.category,
    eventDate: e.eventDate.toISOString().slice(0, 10),
    documentId: e.documentId || undefined,
    documentName: e.document?.name || undefined,
    meetingId: e.meetingId || undefined,
    projectId: e.projectId || undefined,
    metadata: (e.metadata as Record<string, any>) || {}
  }));
}

function getFallbackTimeline(): TimelineCommitItem[] {
  return [
    {
      id: 'init-1',
      commitHash: 'a7b9c1d',
      title: 'Synaps Workspace Initialized',
      description: 'Established multi-tenant isolation, AI Executive Briefing engine, and Memory Graph.',
      category: 'PROJECT',
      eventDate: new Date().toISOString().slice(0, 10)
    },
    {
      id: 'init-2',
      commitHash: '3f8e21a',
      title: 'AI COO Briefing Pipeline Synchronized',
      description: 'Activated real-time intelligence feeds across enterprise departments.',
      category: 'POLICY_CHANGE',
      eventDate: new Date().toISOString().slice(0, 10)
    }
  ];
}
