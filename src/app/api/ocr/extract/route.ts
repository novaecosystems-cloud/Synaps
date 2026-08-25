import { NextRequest, NextResponse } from 'next/server';
import { performOneShotOcr } from '@/lib/ocr-engine';
import { resolveAuthContext, safeErrorResponse } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await resolveAuthContext(req);
    const body = await req.json().catch(() => ({}));
    const { imageBase64, mimeType = 'image/png', mode = 'general' } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { success: false, error: 'imageBase64 or file payload is required for 1-Shot OCR.' },
        { status: 400 }
      );
    }

    const result = await performOneShotOcr(imageBase64, mimeType, { mode });

    return NextResponse.json({
      success: result.success,
      text: result.text,
      tables: result.tables || [],
      confidence: result.confidence,
      engine: result.engine,
      latencyMs: result.latencyMs,
      metadata: result.metadata,
    });
  } catch (error: any) {
    console.error('[OCR API ERROR]', error.message);
    return safeErrorResponse(error, 'Failed to process document with 1-Shot OCR.');
  }
}

