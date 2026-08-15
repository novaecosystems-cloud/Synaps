import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-security';
import { checkOmniRouteStatus } from '@/lib/llm-router';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const status = await checkOmniRouteStatus();
    return NextResponse.json({
      success: true,
      gateway: 'OmniRoute Free AI Gateway',
      version: 'v3.8.51',
      freeMonthlyTokensCapacity: '1,510,000,000 (~1.51B)',
      supportedProviderPools: 42,
      totalDocumentedModels: 495,
      ...status,
      routingHierarchy: [
        '1. OmniRoute Free Gateway Pool (auto / zero-cost)',
        '2. Groq LLaMA 3.3 70B & Mixtral (Key Rotation)',
        '3. Google Gemini 2.5 Flash (Direct API Failover)',
        '4. OpenRouter Free Pool',
        '5. Synaps Grounded RAG Engine Fallback',
      ],
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
