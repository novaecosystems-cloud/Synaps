export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { evaluateModelResponse, getRLVRMetrics } from '@/lib/rlvr-reward-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, output, expectedNumbers, humanAction, humanCorrection } = body;

    if (!prompt || !output) {
      return NextResponse.json({ success: false, error: 'Prompt and output are required.' }, { status: 400 });
    }

    const evaluation = evaluateModelResponse({
      prompt,
      output,
      expectedNumbers,
      humanAction,
      humanCorrection,
    });

    const metrics = getRLVRMetrics();

    return NextResponse.json({
      success: true,
      evaluation,
      metrics,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Reward evaluation failed',
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const metrics = getRLVRMetrics();
    return NextResponse.json({
      success: true,
      metrics,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch RLVR metrics',
    }, { status: 500 });
  }
}
