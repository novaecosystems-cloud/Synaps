/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SYNAPS API SECURITY GUARD — requireAuth() & requireOwner()
 * ─────────────────────────────────────────────────────────────────────────────
 * Drop-in auth guard helper used by all API routes.
 * Patches:
 *  1. Unauthenticated route access (42 routes missing auth)
 *  2. IDOR via client-supplied userId/orgId query params
 *  3. Admin-only route enforcement (requireOwner)
 *
 * Usage in any route:
 *   const authResult = await requireAuth(request);
 *   if (authResult instanceof NextResponse) return authResult; // 401 short-circuit
 *   const { user, sessionUser } = authResult;
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/auth-server';
import prisma from '@/lib/prisma';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'novaecosystems@gmail.com';

// ─── Rate limit tracking (in-memory, per-process) ────────────────────────────
// For production, swap this with Upstash Redis KV
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMITS: Record<string, { maxRequests: number; windowMs: number }> = {
  default:          { maxRequests: 60,  windowMs: 60_000  }, // 60 req/min
  llm_generation:   { maxRequests: 5,   windowMs: 60_000  }, // 5 LLM calls/min
  data_export:      { maxRequests: 10,  windowMs: 60_000  }, // 10 exports/min
  admin_broadcast:  { maxRequests: 2,   windowMs: 3_600_000 }, // 2 broadcasts/hr
};

function checkRateLimit(
  key: string,
  tier: keyof typeof RATE_LIMITS = 'default'
): { allowed: boolean; remaining: number; resetAt: number } {
  const limit = RATE_LIMITS[tier] ?? RATE_LIMITS.default;
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + limit.windowMs });
    return { allowed: true, remaining: limit.maxRequests - 1, resetAt: now + limit.windowMs };
  }

  if (entry.count >= limit.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: limit.maxRequests - entry.count, resetAt: entry.resetAt };
}

// ─── Main Auth Guard ──────────────────────────────────────────────────────────

export interface AuthResult {
  sessionUser: any;
  userId: string;
  organizationId: string | null;
  role: string;
  email: string;
}

export async function requireAuth(
  req: NextRequest,
  rateLimitTier: keyof typeof RATE_LIMITS = 'default'
): Promise<AuthResult | NextResponse> {
  // 1. Extract session cookie
  let cookieStore;
  try {
    cookieStore = await cookies();
  } catch {
    cookieStore = null;
  }

  const sessionCookie =
    cookieStore?.get('synaps-session')?.value ??
    req.cookies.get('synaps-session')?.value;

  if (!sessionCookie) {
    return NextResponse.json(
      { error: 'Authentication required. Please sign in to continue.', code: 'UNAUTHENTICATED' },
      { status: 401 }
    );
  }

  // 2. Verify session with Firebase Admin
  const sessionUser = await verifySessionCookie(sessionCookie);
  if (!sessionUser) {
    return NextResponse.json(
      { error: 'Session expired or invalid. Please sign in again.', code: 'INVALID_SESSION' },
      { status: 401 }
    );
  }

  const uid: string = sessionUser.uid || sessionUser.sub || '';

  // 3. Rate limiting per user
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  const rateLimitKey = `${uid || ip}:${req.nextUrl.pathname}`;
  const rateCheck = checkRateLimit(rateLimitKey, rateLimitTier);

  if (!rateCheck.allowed) {
    const headers = new Headers({
      'X-RateLimit-Limit': String(RATE_LIMITS[rateLimitTier]?.maxRequests ?? 60),
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': String(Math.ceil(rateCheck.resetAt / 1000)),
      'Retry-After': String(Math.ceil((rateCheck.resetAt - Date.now()) / 1000)),
    });
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.', code: 'RATE_LIMITED' },
      { status: 429, headers }
    );
  }

  // 4. Load user record from DB to get organizationId and role
  let userId = uid;
  let organizationId: string | null = null;
  let role = 'MEMBER';
  let email = sessionUser.email || '';

  try {
    const dbUser = await prisma.user.findFirst({
      where: { OR: [{ id: uid }, { email: sessionUser.email }] },
      select: { id: true, organizationId: true, role: true, email: true },
    });
    if (dbUser) {
      userId = dbUser.id;
      organizationId = dbUser.organizationId ?? null;
      role = dbUser.role ?? 'MEMBER';
      email = dbUser.email ?? email;
    }
  } catch {
    // Non-fatal: proceed with session claims
  }

  return { sessionUser, userId, organizationId, role, email };
}

// ─── Admin-Only Guard ─────────────────────────────────────────────────────────

export async function requireOwner(
  req: NextRequest
): Promise<AuthResult | NextResponse> {
  const authResult = await requireAuth(req, 'admin_broadcast');
  if (authResult instanceof NextResponse) return authResult;

  const { email, role } = authResult;
  if (email !== ADMIN_EMAIL && role !== 'OWNER') {
    return NextResponse.json(
      { error: 'Forbidden. Owner-level access required.', code: 'FORBIDDEN' },
      { status: 403 }
    );
  }
  return authResult;
}

// ─── LLM Generation Guard (Strict rate limiting) ─────────────────────────────

export async function requireAuthForLLM(
  req: NextRequest
): Promise<AuthResult | NextResponse> {
  return requireAuth(req, 'llm_generation');
}

// ─── Tenant Isolation: Verify a resource belongs to the caller's org ─────────

export function assertOrgAccess(
  callerOrgId: string | null,
  resourceOrgId: string | undefined | null
): NextResponse | null {
  if (!callerOrgId || !resourceOrgId) return null; // Skip for unaffiliated resources
  if (callerOrgId !== resourceOrgId) {
    return NextResponse.json(
      { error: 'Access denied. This resource belongs to a different organization.', code: 'ORG_MISMATCH' },
      { status: 403 }
    );
  }
  return null;
}
