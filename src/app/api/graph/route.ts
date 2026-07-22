export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: { organizationId: true }
    });

    const organizationId = dbUser?.organizationId;
    if (!organizationId) return NextResponse.json({ success: false, error: 'User must belong to an organization' }, { status: 403 });

    // Fetch Entities & Relationships from Database
    const entities = await prisma.graphEntity.findMany({
      where: { organizationId },
      include: {
        document: {
          select: { id: true, name: true, mimeType: true, sizeBytes: true }
        }
      }
    });

    const relationships = await prisma.graphRelationship.findMany({
      where: { organizationId }
    });

    // Format Nodes
    const nodes = entities.map(e => ({
      id: e.id,
      name: e.name,
      type: e.type,
      description: e.description,
      metadata: e.metadata || {},
      properties: e.properties || {},
      confidenceScore: e.confidenceScore,
      sourceReferences: e.sourceReferences || [],
      documentId: e.documentId,
      document: e.document,
      val: e.type === 'DOCUMENT' ? 12 : e.type === 'PROJECT' ? 10 : 6
    }));

    const validNodeIds = new Set(nodes.map(n => n.id));

    // Format Links
    const links = relationships
      .filter(r => validNodeIds.has(r.sourceEntityId) && validNodeIds.has(r.targetEntityId))
      .map(r => ({
        id: r.id,
        source: r.sourceEntityId,
        target: r.targetEntityId,
        type: r.relationType,
        description: r.description,
        evidence: r.evidence,
        confidenceScore: r.confidenceScore
      }));

    return NextResponse.json({
      success: true,
      data: {
        nodes,
        links,
        stats: {
          totalNodes: nodes.length,
          totalRelationships: links.length,
          entityTypes: Array.from(new Set(nodes.map(n => n.type)))
        }
      }
    });

  } catch (error: any) {
    console.error("GET /api/graph error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
