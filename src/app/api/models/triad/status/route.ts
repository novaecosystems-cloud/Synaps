export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getTriadModelsStatus } from '@/lib/triad-models';

export async function GET() {
  try {
    const status = getTriadModelsStatus();
    const allAvailable = Object.values(status).every((m) => m.isAvailable);

    return NextResponse.json({
      success: true,
      ready: allAvailable,
      count: Object.keys(status).length,
      models: status,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to check Triad models status',
    }, { status: 500 });
  }
}
