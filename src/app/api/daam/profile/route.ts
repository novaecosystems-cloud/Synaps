import { NextRequest, NextResponse } from 'next/server';
import { DataMoatEngine, DomainRiskProfile } from '@/lib/data-moat-engine';

// GET /api/daam/profile?orgId=xxx
// Returns the full Domain Risk Profile (Moat Score, Agent Preferences, etc.)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('orgId');
  const status = searchParams.get('status') === 'true';

  if (!orgId) {
    return NextResponse.json({ error: 'Missing required param: orgId' }, { status: 400 });
  }

  try {
    const [profile, daamStatus] = await Promise.all([
      DomainRiskProfile.getProfile(orgId),
      status ? DataMoatEngine.getStatus(orgId) : Promise.resolve(null),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        profile,
        daamStatus,
      },
      meta: {
        endpoint: 'DAAM Pillar 4 — Proprietary Domain Risk Profile',
        primeRlmScore: 0.994,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/daam/profile
// Initialize or update compliance flags and industry vertical for an org
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orgId, industryVertical, complianceFlags, preferredGoverningLaw } = body;

    if (!orgId) {
      return NextResponse.json({ error: 'Missing required field: orgId' }, { status: 400 });
    }

    // Ensure profile exists
    await DomainRiskProfile.getOrCreate(orgId);

    // Apply updates
    const updateData: any = {};
    if (industryVertical) updateData.industryVertical = industryVertical;
    if (Array.isArray(complianceFlags)) updateData.complianceFlags = complianceFlags;
    if (preferredGoverningLaw) updateData.preferredGoverningLaw = preferredGoverningLaw;

    const { prisma } = await import('@/lib/prisma');
    const updated = await prisma.domainRiskProfile.update({
      where: { organizationId: orgId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updated,
      meta: {
        endpoint: 'DAAM Pillar 4 — Domain Risk Profile Updated',
        pillar: 'DOMAIN_RISK_PROFILE',
        primeRlmScore: 0.994,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
