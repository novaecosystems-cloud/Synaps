import { NextRequest, NextResponse } from 'next/server';
import { HiggsfieldMCPEngine } from '@/lib/services/higgsfield-mcp';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, model, aspectRatio, durationSeconds, cameraMotion } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Missing required field: prompt' }, { status: 400 });
    }

    const result = await HiggsfieldMCPEngine.generateVideo({
      prompt,
      model,
      aspectRatio,
      durationSeconds,
      cameraMotion
    });

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        engine: 'Higgsfield AI MCP Server',
        mcpStatus: 'ACTIVE',
        modelsAvailable: ['soul', 'cinema-studio', 'kling', 'minimax-hailuo', 'veo2']
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
