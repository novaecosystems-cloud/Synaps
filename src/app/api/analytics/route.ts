export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ProjectStatus, CoverageStatus, GapSeverity } from '@prisma/client';
import { subDays, format, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';

import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('synaps-session')?.value;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decodedToken = await verifySessionCookie(session);
    if (!decodedToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');
    const days = parseInt(searchParams.get('days') || '30', 10);
    
    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: decodedToken.uid } });
    if (!user || user.organizationId !== organizationId) {
      return NextResponse.json({ error: 'Unauthorized access to organization' }, { status: 403 });
    }

  const endDate = new Date();
  const startDate = subDays(endDate, days);

  try {
    // --- KPIs ---
    const activeProjects = await prisma.project.count({
      where: { organizationId, status: 'ACTIVE', isDeleted: false }
    });

    const documentsProcessed = await prisma.document.count({
      where: { organizationId, scanStatus: 'CLEAN', isDeleted: false }
    });

    const aiDecisions = await prisma.decision.count({
      where: { organizationId }
    });

    const proposals = await prisma.proposal.findMany({
      where: { organizationId },
      select: { status: true }
    });
    const approvedProposals = proposals.filter(p => p.status === 'APPROVED').length;
    const proposalSuccess = proposals.length > 0 ? Math.round((approvedProposals / proposals.length) * 100) : 0;

    // Compliance Score: Percentage of covered requirements
    const reqs = await prisma.requirement.findMany({
      where: { document: { organizationId } },
      select: { coverageStatus: true, coverageScore: true }
    });
    let complianceScore = 0;
    if (reqs.length > 0) {
      const covered = reqs.filter(r => r.coverageStatus === 'COVERED').length;
      const partial = reqs.filter(r => r.coverageStatus === 'PARTIALLY_COVERED').length;
      complianceScore = Math.round(((covered + (partial * 0.5)) / reqs.length) * 100);
    }

    // Risk Score: Simple heuristic based on severity counts
    const gaps = await prisma.gap.findMany({
      where: { organizationId },
      select: { severity: true }
    });
    let riskScore = 0;
    const severityWeights: Record<string, number> = { 'CRITICAL': 10, 'HIGH': 5, 'MEDIUM': 2, 'LOW': 1 };
    gaps.forEach(g => { riskScore += severityWeights[g.severity] || 0; });
    
    // Normalize risk score somewhat for the dashboard (0-100 gauge)
    const normalizedRiskScore = Math.min(Math.round((riskScore / Math.max(reqs.length, 1)) * 100), 100);

    const teamActivity = await prisma.auditLog.count({
      where: { organizationId, createdAt: { gte: startDate } }
    });

    const docs = await prisma.document.findMany({
      where: { organizationId, isDeleted: false },
      select: { sizeBytes: true, createdAt: true }
    });
    const storageUsageBytes = docs.reduce((acc, doc) => acc + doc.sizeBytes, 0);
    const storageUsage = (storageUsageBytes / (1024 * 1024)).toFixed(2); // MB

    // --- CHARTS ---

    // 1. Documents over time (Grouped by date in JS)
    const docsOverTimeMap: Record<string, number> = {};
    for (let i = days; i >= 0; i--) {
      docsOverTimeMap[format(subDays(endDate, i), 'MMM dd')] = 0;
    }
    docs.filter(d => isAfter(d.createdAt, startDate)).forEach(d => {
      const dateStr = format(d.createdAt, 'MMM dd');
      if (docsOverTimeMap[dateStr] !== undefined) docsOverTimeMap[dateStr]++;
    });
    const documentsOverTime = Object.entries(docsOverTimeMap).map(([name, value]) => ({ name, value }));

    // 2. AI Usage over time
    const aiLogs = await prisma.auditLog.findMany({
      where: { organizationId, action: { contains: 'AI' }, createdAt: { gte: startDate } },
      select: { createdAt: true }
    });
    const aiUsageMap: Record<string, number> = {};
    for (let i = days; i >= 0; i--) {
      aiUsageMap[format(subDays(endDate, i), 'MMM dd')] = 0;
    }
    aiLogs.forEach(log => {
      const dateStr = format(log.createdAt, 'MMM dd');
      if (aiUsageMap[dateStr] !== undefined) aiUsageMap[dateStr]++;
    });
    const aiUsage = Object.entries(aiUsageMap).map(([name, value]) => ({ name, value }));

    // 3. Project Status
    const projectGroups = await prisma.project.groupBy({
      by: ['status'],
      where: { organizationId, isDeleted: false },
      _count: true
    });
    const projectStatus = projectGroups.map(g => ({ name: g.status, value: g._count }));

    // 4. Risk Distribution
    const gapGroups = await prisma.gap.groupBy({
      by: ['severity'],
      where: { organizationId },
      _count: true
    });
    const riskDistribution = gapGroups.map(g => ({ name: g.severity, value: g._count }));

    // 5. Requirement Coverage
    const reqGroups = await prisma.requirement.groupBy({
      by: ['coverageStatus'],
      where: { document: { organizationId } },
      _count: true
    });
    const requirementCoverage = reqGroups.map(g => ({ 
      name: g.coverageStatus || 'UNASSESSED', 
      value: g._count 
    }));

    return NextResponse.json({
      kpis: {
        activeProjects,
        documentsProcessed,
        aiDecisions,
        proposalSuccess,
        complianceScore,
        riskScore: normalizedRiskScore,
        teamActivity,
        storageUsage
      },
      charts: {
        documentsOverTime,
        aiUsage,
        projectStatus,
        riskDistribution,
        requirementCoverage
      }
    });

  } catch (error: any) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

