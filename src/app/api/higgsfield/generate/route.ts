import { NextRequest, NextResponse } from 'next/server';
import { HiggsfieldMCPEngine } from '@/lib/services/higgsfield-mcp';
import { requireAuth, requireAuthForLLM } from '@/lib/api-security';

export async function POST(req: NextRequest) {
  const _auth = await requireAuthForLLM(req);
  if (_auth instanceof NextResponse) return _auth;
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
