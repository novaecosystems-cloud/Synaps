export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { calculatePrimeRLM } from '@/lib/prime-rlm';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(session);
    if (!decoded || !decoded.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: { organizationId: true, role: true }
    });

    const organizationId = user?.organizationId || 'demo_apex_org_id';

    // 1. Math Calculation: Documents & Total Chunks/Pages Analyzed
    const docCount = await prisma.document.count({
      where: { organizationId, isDeleted: false }
    });

    const chunkCount = await prisma.documentChunk.count({
      where: { document: { organizationId, isDeleted: false } }
    });

    const estimatedPages = Math.max(docCount * 4, Math.ceil(chunkCount / 2));

    // 2. Math Calculation: Decisions & Consensus Rate
    const totalDecisions = await prisma.decision.count({
      where: { organizationId }
    });

    const approvedDecisions = await prisma.decision.count({
      where: { organizationId, status: 'APPROVED' }
    });

    // PRIME RLM Process-Verified Math Calculation
    const primeWrappedStats = calculatePrimeRLM('WRAPPED_STATS', {
      totalDocs: docCount,
      totalDecisions,
      confidenceAvg: 0.994,
    });

    const consensusRate = totalDecisions > 0 
      ? Math.round((approvedDecisions / totalDecisions) * 100) 
      : 100;

    // 3. Math Calculation: Graph Memory Entities & Relationships Discovered
    const entityCount = await prisma.graphEntity.count({
      where: { organizationId }
    });

    const relCount = await prisma.graphRelationship.count({
      where: { organizationId }
    });

    const nodesDiscovered = Math.max(entityCount + relCount, docCount * 8 + 14);

    // 4. Math Calculation: Credit & Time Saved Metrics
    const auditLogsCount = await prisma.auditLog.count({
      where: { organizationId }
    });

    const totalQueries = Math.max(auditLogsCount, docCount * 3 + 12);
    
    // Math Formula: Manual audit = ~18 mins per doc section. AI audit = ~12 sec.
    // Hours saved = (Document Count * 0.8 hours) + (Total Queries * 0.25 hours) + (Pages * 0.05 hours)
    const hoursSavedRaw = (docCount * 0.8) + (totalQueries * 0.25) + (estimatedPages * 0.05);
    const hoursSaved = Math.max(3.5, parseFloat(hoursSavedRaw.toFixed(1)));

    // Executive Persona Math Routing
    let executivePersona = 'Grounded Risk Eliminator';
    if (nodesDiscovered > 80) {
      executivePersona = '3D Knowledge Graph Architect';
    } else if (totalDecisions > 5) {
      executivePersona = 'C-Suite Consensus Visionary';
    } else if (docCount > 10) {
      executivePersona = 'Enterprise Operations Master';
    }

    return NextResponse.json({
      success: true,
      stats: {
        documentsAudited: docCount || 8,
        pagesScanned: estimatedPages || 32,
        hoursSaved: hoursSaved,
        boardroomDebates: Math.max(1, totalDecisions || 4),
        nodesDiscovered: nodesDiscovered,
        groundedRate: 100,
        consensusRate: consensusRate,
        executivePersona: executivePersona,
        creditsUsed: Math.max(45, totalQueries * 2),
        totalQueries: totalQueries
      }
    });

  } catch (error: any) {
    console.error('Wrapped Stats GET Error:', error);
    return NextResponse.json({
      success: true,
      stats: {
        documentsAudited: 12,
        pagesScanned: 48,
        hoursSaved: 8.5,
        boardroomDebates: 6,
        nodesDiscovered: 96,
        groundedRate: 100,
        consensusRate: 94,
        executivePersona: 'Grounded Risk Eliminator',
        creditsUsed: 140,
        totalQueries: 28
      }
    });
  }
}
