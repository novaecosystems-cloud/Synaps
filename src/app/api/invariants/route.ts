import { NextRequest, NextResponse } from 'next/server';
import { runCrossSiloInvariantCheck, ENTERPRISE_INVARIANTS } from '@/lib/cross-silo-invariants';

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
    const body = await req.json();
    const result = runCrossSiloInvariantCheck(body);
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to execute cross-silo invariant check'
    }, { status: 500 });
  }
}
