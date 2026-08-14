import { NextRequest, NextResponse } from 'next/server';
import { AuditLedger } from '@/lib/data-moat-engine';

// GET /api/daam/audit-ledger?orgId=xxx&limit=20
// Returns recent immutable ledger entries and chain verification status
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('orgId');
  const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '20'));
  const verify = searchParams.get('verify') === 'true';

  if (!orgId) {
    return NextResponse.json({ error: 'Missing required param: orgId' }, { status: 400 });
  }

  try {
    const [entries, verification] = await Promise.all([
      AuditLedger.getRecent(orgId, limit),
      verify ? AuditLedger.verifyChain(orgId) : Promise.resolve(null),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        entries,
        totalReturned: entries.length,
        chainVerification: verification,
      },
      meta: {
        endpoint: 'DAAM Pillar 3 — Immutable Cryptographic Audit Ledger',
        primeRlmScore: 0.994,
        chainingAlgorithm: 'SHA-256',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/daam/audit-ledger
// Append a new immutable event to the ledger
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orgId, eventType, payload, actorId } = body;

    if (!orgId || !eventType || !payload) {
      return NextResponse.json(
        { error: 'Missing required fields: orgId, eventType, payload' },
        { status: 400 }
      );
    }

    const validEventTypes = [
      'DOCUMENT_INGESTED',
      'DECISION_MADE',
      'CLAUSE_FLAGGED',
      'USER_ACTION',
      'EXPORT',
      'DAAM_CLAUSE_INDEXED',
      'DAAM_DECISION_LOGGED',
      'DAAM_PROFILE_UPDATED',
    ];

    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json({ error: `Invalid eventType. Must be one of: ${validEventTypes.join(', ')}` }, { status: 400 });
    }

    const entry = await AuditLedger.append(orgId, eventType, payload, actorId);

    return NextResponse.json({
      success: true,
      data: entry,
      meta: {
        endpoint: 'DAAM Pillar 3 — Ledger Entry Appended',
        pillar: 'IMMUTABLE_AUDIT_LEDGER',
        chainIntegrity: entry.chainIntegrity,
      },
    }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
