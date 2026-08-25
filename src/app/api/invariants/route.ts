import { NextRequest, NextResponse } from 'next/server';
import { runCrossSiloInvariantCheck, ENTERPRISE_INVARIANTS } from '@/lib/cross-silo-invariants';
import { resolveAuthContext, safeErrorResponse } from '@/lib/security';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      activeInvariants: ENTERPRISE_INVARIANTS,
      airTrafficControllerStatus: 'ONLINE',
      protectedDepartments: ['Sales', 'Engineering', 'Legal', 'Finance', 'Compliance']
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    await resolveAuthContext(req);
    const body = await req.json();
    const result = runCrossSiloInvariantCheck(body);
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return safeErrorResponse(error, 'Failed to execute cross-silo invariant check');
  }
}

