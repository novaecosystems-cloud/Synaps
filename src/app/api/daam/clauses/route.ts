import { NextRequest, NextResponse } from 'next/server';
import { DataMoatEngine, ClauseBenchmarker } from '@/lib/data-moat-engine';
import { getAuthenticatedUser } from '@/lib/auth-server';

// GET /api/daam/clauses?clauseType=INDEMNITY&orgId=xxx
// Returns benchmark stats for a clause type
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clauseType = searchParams.get('clauseType') as any ?? 'INDEMNITY';
  const orgId = searchParams.get('orgId');

  const validTypes = ['INDEMNITY', 'LIABILITY_CAP', 'TERMINATION', 'GOVERNING_LAW', 'DATA_PRIVACY'];
  if (!validTypes.includes(clauseType)) {
    return NextResponse.json({ error: 'Invalid clauseType' }, { status: 400 });
  }

  try {
    const benchmarks = await ClauseBenchmarker.getBenchmarks(clauseType);
    return NextResponse.json({
      success: true,
      data: benchmarks,
      meta: {
        endpoint: 'DAAM Pillar 1 — Anonymized Clause Benchmarking',
        primeRlmScore: 0.994,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/daam/clauses
// Ingest a new clause for PII stripping, benchmarking, and moat profile update
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orgId, clauseType, rawText, riskScore, industryCategory } = body;

    if (!orgId || !clauseType || !rawText || riskScore === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: orgId, clauseType, rawText, riskScore' },
        { status: 400 }
      );
    }

    const validTypes = ['INDEMNITY', 'LIABILITY_CAP', 'TERMINATION', 'GOVERNING_LAW', 'DATA_PRIVACY'];
    if (!validTypes.includes(clauseType)) {
      return NextResponse.json({ error: 'Invalid clauseType' }, { status: 400 });
    }

    if (typeof riskScore !== 'number' || riskScore < 0 || riskScore > 100) {
      return NextResponse.json({ error: 'riskScore must be a number between 0 and 100' }, { status: 400 });
    }

    const result = await DataMoatEngine.ingestClause(orgId, {
      clauseType,
      rawText,
      riskScore,
      industryCategory,
    });

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        endpoint: 'DAAM Pillar 1 — Clause Ingested & Benchmarked',
        pillar: 'ANONYMIZED_CLAUSE_BENCHMARKING',
        primeRlmScore: 0.994,
      },
    }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
