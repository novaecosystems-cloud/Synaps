import { track } from '@vercel/analytics';

export type SynapsFeatureFlag = 
  | 'sondaven-landing'
  | 'ai-boardroom-v2'
  | 'graph-rag-v3'
  | 'contract-redliner-v2'
  | 'enterprise-digital-twin'
  | 'gdpr-cookie-consent';

/**
 * Client-Side Track Event annotated with active Vercel Feature Flags
 */
export function trackSynapsEvent(
  eventName: string,
  properties?: Record<string, any>,
  flags: SynapsFeatureFlag[] = ['sondaven-landing', 'graph-rag-v3', 'ai-boardroom-v2']
) {
  try {
    if (typeof window !== 'undefined') {
      track(eventName, properties || {}, { flags });
    }
  } catch (err) {
    console.warn('[ANALYTICS] Notice: Track event failed (non-fatal):', err);
  }
}

/**
 * Server-Side Track Event annotated with active Vercel Feature Flags
 */
export async function trackSynapsServerEvent(
  eventName: string,
  properties?: Record<string, any>,
  flags: SynapsFeatureFlag[] = ['graph-rag-v3', 'ai-boardroom-v2']
) {
  try {
    const { track: serverTrack } = await import('@vercel/analytics/server');
    await serverTrack(eventName, properties || {}, { flags });
  } catch (err) {
    console.warn('[ANALYTICS SERVER] Notice: Server track failed (non-fatal):', err);
  }
}
