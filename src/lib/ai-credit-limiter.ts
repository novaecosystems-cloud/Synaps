import prisma from '@/lib/prisma';

interface CreditLimitResult {
  success: boolean;
  creditsUsed: number;
  creditLimit: number;
  remaining: number;
  resetAt: string;
  error?: string;
}

// In-memory daily credit tracking: Map<"userId:YYYY-MM-DD", count>
const dailyCreditStore = new Map<string, number>();

export const ROLE_CREDIT_LIMITS: Record<string, number> = {
  OWNER: 200,
  LEADER: 200,
  ADMIN: 200,
  MANAGER: 100,
  MEMBER: 50,
  GUEST: 10
};

export async function checkAndConsumeAiCredits(
  userId: string,
  role: string = 'MEMBER',
  cost: number = 1
): Promise<CreditLimitResult> {
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
      error: `Daily AI credit limit reached (${currentUsed}/${creditLimit} credits used today for ${role} role). Limits reset at midnight UTC.`
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
    resetAt: 'Midnight UTC'
  };
}

export function getUserDailyAiCredits(userId: string, role: string = 'MEMBER') {
  const today = new Date().toISOString().slice(0, 10);
  const storeKey = `${userId}:${today}`;
  const creditLimit = ROLE_CREDIT_LIMITS[role.toUpperCase()] || 50;
  const creditsUsed = dailyCreditStore.get(storeKey) || 0;

  return {
    creditsUsed,
    creditLimit,
    remaining: Math.max(0, creditLimit - creditsUsed),
    resetAt: 'Midnight UTC'
  };
}
