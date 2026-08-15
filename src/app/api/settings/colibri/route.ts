import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-security';
import { checkColibriStatus } from '@/lib/llm-router';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const status = await checkColibriStatus();
    return NextResponse.json({
      success: true,
      engine: 'Colibrì Sovereign MoE (Air-Gapped Pure C Inference)',
      version: 'v1.1.0',
      description: 'Zero-cloud-dependency, on-premise frontier MoE intelligence streaming experts from disk.',
      ...status,
      benefits: [
        'Zero Cloud Data Exfiltration — 100% On-Premise Air-Gapped Execution',
        'Runs 744-Billion Frontier Parameter MoE Models on Consumer SSD & RAM',
        '$0.00 Marginal Cost per Executive Deliberation & Contract Audit',
        '19,456 Neural Experts Dynamic Tiering (RAM + NVMe Streaming)',
      ],
      quickStartCommand: './coli web --ram 24G',
    });
  } catch (e: any) {
    console.error('[Colibrì Status] Error:', e);
    return NextResponse.json({ error: 'Failed to retrieve Colibrì status' }, { status: 500 });
  }
}
