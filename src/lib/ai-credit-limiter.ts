import prisma from '@/lib/prisma';
import { decryptApiKey } from '@/lib/encryption';

interface CreditLimitResult {
  success: boolean;
  creditsUsed: number;
  creditLimit: number;
  remaining: number;
  resetAt: string;
  isByokActive?: boolean;
  error?: string;
  featureRemaining?: number;
}

// In-memory daily credit tracking: Map<"userId:YYYY-MM-DD", count>
const dailyCreditStore = new Map<string, number>();

// In-memory BYOK (Bring Your Own Key) cache: Map<userId, encryptedKey>
const userCustomKeysStore = new Map<string, string>();

// In-memory IP & Session Demo Feature Trial Tracker (Exactly 2 uses per IP per Pro & Max feature)
const demoFeatureUsesStore = new Map<string, number>();

export const DEMO_FEATURE_LIMIT = 2;

// Exact Role Credit Limits:
export const ROLE_CREDIT_LIMITS: Record<string, number> = {
  OWNER: 10000,
  LEADER: 10000,
  ADMIN: 500,
  MANAGER: 250,
  MEMBER: 50,
  GUEST: 10
};

/**
 * Extracts real client IP address across Vercel, Cloudflare, and local environments.
 */
export function extractClientIp(headers: Headers | { get: (header: string) => string | null }): string {
  try {
    const forwarded = headers.get('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    const realIp = headers.get('x-real-ip') || headers.get('cf-connecting-ip');
    if (realIp) return realIp.trim();
  } catch (e) {}
  return '127.0.0.1';
}

/**
 * Calculates credit consumption dynamically based on actual token usage & complexity.
 */
export function calculateTokenCreditCost(options: {
  promptText?: string;
  responseText?: string;
  contextDocCount?: number;
  complexity?: 'standard' | 'rag' | 'briefing' | 'simulation';
}): number {
  const promptTokens = Math.max(10, Math.ceil((options.promptText?.length || 0) / 4) + (options.contextDocCount || 0) * 150);
  const completionTokens = Math.max(20, Math.ceil((options.responseText?.length || 0) / 4));
  const totalTokens = promptTokens + completionTokens;

  let baseCost = Math.ceil(totalTokens / 150);

  const complexityMultipliers: Record<string, number> = {
    standard: 1,
    rag: 2,
    briefing: 3,
    simulation: 8
  };

  const multiplier = complexityMultipliers[options.complexity || 'standard'] || 1;
  return Math.max(1, Math.round(baseCost * multiplier));
}

export function setCustomUserApiKey(userId: string, encryptedKey: string) {
  if (!encryptedKey) {
    userCustomKeysStore.delete(userId);
  } else {
    userCustomKeysStore.set(userId, encryptedKey);
  }
}

export function getCustomUserApiKey(userId: string): string {
  const encryptedKey = userCustomKeysStore.get(userId);
  if (!encryptedKey) return '';
  return decryptApiKey(encryptedKey);
}

/**
 * Checks and enforces the exact 2-use trial quota per IP address for Pro & Max features on Demo sessions.
 */
export function checkAndConsumeDemoFeature(
  userId: string,
  featureName: string = 'general_feature',
  clientIp?: string
): { allowed: boolean; used: number; limit: number; remaining: number; error?: string } {
  const cleanId = (userId || 'demo-user').trim().toLowerCase();
  const isDemo = cleanId.includes('demo') || cleanId.startsWith('test_token');

  // Non-demo authenticated users with paid/workspace accounts are governed by standard account quotas
  if (!isDemo && !cleanId.startsWith('ip:')) {
    return { allowed: true, used: 0, limit: 9999, remaining: 9999 };
  }

  const effectiveIp = clientIp || (cleanId.startsWith('ip:') ? cleanId.replace('ip:', '') : '127.0.0.1');
  const ipKey = `ip:${effectiveIp}:${featureName.toLowerCase()}`;
  const userKey = `user:${cleanId}:${featureName.toLowerCase()}`;

  const ipUsed = demoFeatureUsesStore.get(ipKey) || 0;
  const userUsed = demoFeatureUsesStore.get(userKey) || 0;
  const maxUsed = Math.max(ipUsed, userUsed);

  if (maxUsed >= DEMO_FEATURE_LIMIT) {
    const formattedName = featureName.replace(/_/g, ' ').toUpperCase();
    return {
      allowed: false,
      used: maxUsed,
      limit: DEMO_FEATURE_LIMIT,
      remaining: 0,
      error: `IP Trial Quota Reached: Your IP (${effectiveIp}) has completed all 2 free trials for ${formattedName}. Upgrade to Pro or Max to unlock unlimited usage!`
    };
  }

  const newUsed = maxUsed + 1;
  demoFeatureUsesStore.set(ipKey, newUsed);
  demoFeatureUsesStore.set(userKey, newUsed);

  return {
    allowed: true,
    used: newUsed,
    limit: DEMO_FEATURE_LIMIT,
    remaining: DEMO_FEATURE_LIMIT - newUsed
  };
}

export function getDemoFeatureUsage(userId: string, featureName: string, clientIp?: string) {
  const cleanId = (userId || 'demo-user').trim().toLowerCase();
  const effectiveIp = clientIp || (cleanId.startsWith('ip:') ? cleanId.replace('ip:', '') : '127.0.0.1');
  const ipKey = `ip:${effectiveIp}:${featureName.toLowerCase()}`;
  const userKey = `user:${cleanId}:${featureName.toLowerCase()}`;
  const used = Math.max(demoFeatureUsesStore.get(ipKey) || 0, demoFeatureUsesStore.get(userKey) || 0);

  return {
    used,
    limit: DEMO_FEATURE_LIMIT,
    remaining: Math.max(0, DEMO_FEATURE_LIMIT - used)
  };
}

export async function checkAndConsumeAiCredits(
  userId: string,
  role: string = 'MEMBER',
  cost: number = 1,
  featureName?: string,
  clientIp?: string
): Promise<CreditLimitResult> {

  const cleanUserId = (userId || 'demo-user').trim().toLowerCase();

  // 1. If user has BYOK, credit limits are UNLIMITED
  const customKey = getCustomUserApiKey(cleanUserId);
  if (customKey) {
    return {
      success: true,
      creditsUsed: 0,
      creditLimit: 999999,
      remaining: 999999,
      resetAt: 'Unlimited BYOK Active',
      isByokActive: true
    };
  }

  // 2. If this is a demo session and a feature is specified, enforce the strict 2-use trial per IP address
  if (featureName && (cleanUserId.includes('demo') || cleanUserId.startsWith('test_token') || cleanUserId.startsWith('ip:'))) {
    const demoCheck = checkAndConsumeDemoFeature(cleanUserId, featureName, clientIp);
    if (!demoCheck.allowed) {
      return {
        success: false,
        creditsUsed: demoCheck.used,
        creditLimit: DEMO_FEATURE_LIMIT,
        remaining: 0,
        resetAt: 'Demo IP Quota Reached',
        isByokActive: false,
        featureRemaining: 0,
        error: demoCheck.error
      };
    }
  }

  // 3. Otherwise enforce standard daily credit quota
  const today = new Date().toISOString().slice(0, 10);
  const storeKey = `${cleanUserId}:${today}`;
  const creditLimit = ROLE_CREDIT_LIMITS[role.toUpperCase()] || 50;

  const currentUsed = dailyCreditStore.get(storeKey) || 0;

  if (currentUsed + cost > creditLimit) {
    return {
      success: false,
      creditsUsed: currentUsed,
      creditLimit,
      remaining: Math.max(0, creditLimit - currentUsed),
      resetAt: 'Midnight UTC',
      isByokActive: false,
      error: `Daily AI credit limit reached (${currentUsed}/${creditLimit} credits used today). Upgrade your plan or add your API key for unlimited access!`
    };
  }

  const newUsed = currentUsed + cost;
  dailyCreditStore.set(storeKey, newUsed);

  // Clean up store entries older than today
  for (const key of dailyCreditStore.keys()) {
    if (!key.endsWith(today)) {
      dailyCreditStore.delete(key);
    }
  }

  return {
    success: true,
    creditsUsed: newUsed,
    creditLimit,
    remaining: Math.max(0, creditLimit - newUsed),
    resetAt: 'Midnight UTC',
    isByokActive: false
  };
}

export function getUserDailyAiCredits(userId: string, role: string = 'MEMBER') {
  const cleanUserId = (userId || 'demo-user').trim().toLowerCase();
  const customKey = getCustomUserApiKey(cleanUserId);
  if (customKey) {
    return {
      creditsUsed: 0,
      creditLimit: 999999,
      remaining: 999999,
      resetAt: 'Unlimited BYOK Active',
      isByokActive: true
    };
  }

  const today = new Date().toISOString().slice(0, 10);
  const storeKey = `${cleanUserId}:${today}`;
  const creditLimit = ROLE_CREDIT_LIMITS[role.toUpperCase()] || 50;
  const creditsUsed = dailyCreditStore.get(storeKey) || 0;

  return {
    creditsUsed,
    creditLimit,
    remaining: Math.max(0, creditLimit - creditsUsed),
    resetAt: 'Midnight UTC',
    isByokActive: false
  };
}
