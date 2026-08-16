import { NextRequest, NextResponse } from 'next/server';
import { DPDPUserRightsEngine } from '@/lib/dpdp-compliance';
import { requireAuth } from '@/lib/api-security';

// GET /api/dpdp/rights — Right to Information
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  // Use authenticated user's actual ID — never trust client-supplied userId
  const userId = auth.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Missing required param: userId' }, { status: 400 });
  }

  try {
    const summary = await DPDPUserRightsEngine.getUserDataSummary(userId);
    return NextResponse.json({
      success: true,
      data: summary,
      meta: {
        statutoryStandard: 'DPDP Act 2023 Section 11 (Right to Information)',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/dpdp/rights — Erasure & Nomination
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  try {
    const body = await req.json();
    const { action } = body;
    const userId = auth.userId; // Always use session-verified userId

    // 1. Right to Erasure (Data Deletion)
    if (action === 'ERASURE') {
      const result = await DPDPUserRightsEngine.executeRightToErasure(userId, body.reason);
      return NextResponse.json({
        success: true,
        data: result,
        meta: { statutoryStandard: 'DPDP Act 2023 Section 12 (Right to Erasure)' },
      });
    }

    // 2. Right to Nominate (Representative Designation)
    if (action === 'NOMINATE') {
      const { nomineeName, nomineeEmail, nomineePhone, relationship } = body;
      if (!nomineeName || !nomineeEmail || !relationship) {
        return NextResponse.json(
          { error: 'Missing nomination fields: nomineeName, nomineeEmail, relationship' },
          { status: 400 }
        );
      }

      const nomination = await DPDPUserRightsEngine.registerNominee({
        userId,
        nomineeName,
        nomineeEmail,
        nomineePhone: nomineePhone || '',
        relationship,
        registeredAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        data: nomination,
        meta: { statutoryStandard: 'DPDP Act 2023 Section 14 (Right to Nominate)' },
      });
    }

    return NextResponse.json({ error: 'Invalid action. Must be ERASURE or NOMINATE' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
