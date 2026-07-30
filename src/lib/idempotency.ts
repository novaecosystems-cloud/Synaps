/**
 * Server-side & Client-side Idempotency Engine for Synaps AI Payments & Subscriptions
 * Prevents double-charging, duplicate upgrade requests, and race conditions.
 */

export interface IdempotencyRecord {
  key: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  response?: any;
  createdAt: number;
}

// In-memory server cache for ultra-fast idempotency lookups (24h TTL)
const idempotencyStore = new Map<string, IdempotencyRecord>();

const CLEANUP_INTERVAL = 60 * 60 * 1000; // Clean expired keys every hour
let cleanupScheduled = false;

function scheduleCleanup() {
  if (cleanupScheduled) return;
  cleanupScheduled = true;
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of idempotencyStore.entries()) {
      if (now - record.createdAt > 24 * 60 * 60 * 1000) {
        idempotencyStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
}

/**
 * Checks an idempotency key on the server.
 * Returns { isDuplicate: true, cachedResponse } if already completed,
 * Returns { isProcessing: true } if currently executing concurrently,
 * Returns { isDuplicate: false } if new and registers it as PROCESSING.
 */
export function checkIdempotency(key: string): { isDuplicate: boolean; isProcessing: boolean; cachedResponse?: any } {
  scheduleCleanup();

  if (!key || typeof key !== 'string' || key.trim() === '') {
    return { isDuplicate: false, isProcessing: false };
  }

  const existing = idempotencyStore.get(key);

  if (existing) {
    if (existing.status === 'PROCESSING') {
      return { isDuplicate: true, isProcessing: true };
    }
    if (existing.status === 'COMPLETED') {
      return { isDuplicate: true, isProcessing: false, cachedResponse: existing.response };
    }
  }

  // Register as currently processing
  idempotencyStore.set(key, {
    key,
    status: 'PROCESSING',
    createdAt: Date.now(),
  });

  return { isDuplicate: false, isProcessing: false };
}

/**
 * Saves the completed response payload for an idempotency key.
 */
export function saveIdempotencyResponse(key: string, response: any) {
  if (!key) return;
  idempotencyStore.set(key, {
    key,
    status: 'COMPLETED',
    response,
    createdAt: Date.now(),
  });
}

/**
 * Marks an idempotency key as failed so it can be safely retried.
 */
export function clearIdempotencyKey(key: string) {
  if (!key) return;
  idempotencyStore.delete(key);
}

/**
 * Helper to generate a strong unique Idempotency Key on the client side.
 */
export function generateIdempotencyKey(prefix = 'idemp'): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  const cryptoRandom = typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID 
    ? window.crypto.randomUUID().substring(0, 8) 
    : Math.random().toString(36).substring(2, 8);
  
  return `${prefix}_${timestamp}_${randomStr}_${cryptoRandom}`;
}
