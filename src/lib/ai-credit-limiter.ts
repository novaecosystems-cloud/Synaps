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
}

// In-memory daily credit tracking: Map<"userId:YYYY-MM-DD", count>
const dailyCreditStore = new Map<string, number>();

// In-memory BYOK (Bring Your Own Key) cache: Map<userId, encryptedKey>
const userCustomKeysStore = new Map<string, string>();

export const ROLE_CREDIT_LIMITS: Record<string, number> = {
  OWNER: 200,
  LEADER: 200,
  ADMIN: 200,
  MANAGER: 100,
  MEMBER: 50,
  GUEST: 10
};

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

export async function checkAndConsumeAiCredits(
  userId: string,
  role: string = 'MEMBER',
  cost: number = 1
): Promise<CreditLimitResult> {

  // 1. If user has supplied their own custom API key (BYOK), daily credit limits are UNLIMITED!
  const customKey = getCustomUserApiKey(userId);
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

  // 2. Otherwise enforce system daily credit quota
  const today = new Date().toISOString().slice(0, 10);
  const storeKey = `${userId}:${today}`;
  const creditLimit = ROLE_CREDIT_LIMITS[role.toUpperCase()] || 50;

  const currentUsed = dailyCreditStore.get(storeKey) || 0;

  if (currentUsed + cost > creditLimit) {
    return {
      success: false,
      creditsUsed: currentUsed,
      creditLimit,
      remaining: 0,
      resetAt: 'Midnight UTC',
      isByokActive: false,
      error: `Daily AI credit limit reached (${currentUsed}/${creditLimit} credits used today). Add your own API key in Settings → Developer API for unlimited credits or upgrade your plan!`
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
    remaining: creditLimit - newUsed,
    resetAt: 'Midnight UTC',
    isByokActive: false
  };
}

export function getUserDailyAiCredits(userId: string, role: string = 'MEMBER') {
  const customKey = getCustomUserApiKey(userId);
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
  const storeKey = `${userId}:${today}`;
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
