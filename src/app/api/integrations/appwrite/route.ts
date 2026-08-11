import { NextResponse } from 'next/server';
import { checkAppwriteHealth, getAppwriteConfig } from '@/lib/appwrite';

/**
 * GET /api/integrations/appwrite
 * Checks Appwrite integration health and configuration status without leaking secret keys.
 */
export async function GET() {
  try {
    const config = getAppwriteConfig();
    const health = await checkAppwriteHealth();

    return NextResponse.json({
      status: 'active',
      integration: 'Appwrite Backend Service',
      endpoint: config.endpoint,
      projectId: config.projectId,
      // SECURITY MASKING: Never output the full API key!
      serverApiKeyConfigured: Boolean(config.apiKey),
      health,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to query Appwrite integration status' },
      { status: 500 }
    );
  }
}
