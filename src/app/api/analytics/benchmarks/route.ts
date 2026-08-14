import { NextRequest, NextResponse } from 'next/server';
import { DataMoatEngine } from '@/lib/data-moat-engine';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clauseType = searchParams.get('clauseType') || 'INDEMNITY';

  // Mock benchmark aggregation demonstrating Data As A Moat analytics
  const benchmarkData = {
    clauseType,
    totalContractsAnalyzed: 14250,
    averageRiskScore: 38.5,
    industryP90Risk: 72.0,
    insights: [
      "84% of B2B SaaS contracts limit liability to 12 months of fees.",
      "Indemnity clauses with uncapped IP infringement are flagged in 91% of enterprise reviews.",
      "Synaps Prime RLM has reduced contract audit cycle times by 82% across all active orgs."
    ],
    verifiedLedgerStatus: "IMMUTABLE_HASH_SYNCED"
  };

  return NextResponse.json(benchmarkData);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (body.type === 'DECISION_FEEDBACK') {
      const result = await DataMoatEngine.recordDecisionFeedback({
        orgId: body.orgId || 'org_default',
        agentRole: body.agentRole || 'CFO',
        recommendationId: body.recommendationId || 'rec_123',
        userAction: body.userAction || 'ACCEPTED',
        userOverrideReason: body.userOverrideReason
      });
      return NextResponse.json(result);
    }

    if (body.type === 'ANONYMOUS_CLAUSE') {
      const result = await DataMoatEngine.recordAnonymizedClause({
        clauseType: body.clauseType || 'INDEMNITY',
        anonymizedText: body.text || '',
        riskScore: body.riskScore || 50,
        industryCategory: body.industryCategory
      });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid DAAM event type" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
