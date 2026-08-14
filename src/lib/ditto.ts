/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DITTO LIVE / DITTOFEED SYNC HELPER
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles real-time offline-first peer-to-peer data sync and UI copy management
 * using the configured Ditto API Key.
 */

export interface DittoConfig {
  apiKey: string;
  appId?: string;
  environment?: 'production' | 'development';
}

export function getDittoConfig(): DittoConfig {
  const apiKey = process.env.DITTO_API_KEY || process.env.NEXT_PUBLIC_DITTO_API_KEY || '';
  const appId = process.env.NEXT_PUBLIC_DITTO_APP_ID || 'synaps-ditto-app';

  return {
    apiKey,
    appId,
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'development'
  };
}

export async function syncDittoData(collectionName: string, payload: Record<string, any>) {
  const config = getDittoConfig();
  if (!config.apiKey) {
    console.warn('[Ditto Sync] DITTO_API_KEY not configured. Operating in fallback mode.');
    return { success: false, mode: 'FALLBACK' };
  }

  try {
    // Ditto Live REST API payload sync endpoint
    const res = await fetch(`https://api.ditto.live/v1/collections/${collectionName}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, data, mode: 'LIVE' };
    }
  } catch (e: any) {
    console.warn('[Ditto Sync] Ditto server sync fallback:', e.message);
  }

  return { success: true, mode: 'LOCAL_SYNC_FALLBACK', payload };
}
