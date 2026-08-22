/**
 * Causarix Security Hardening Module
 * - Rate limiting (per-IP sliding window, in-memory)
 * - R.U.D.Y. (R-U-Dead-Yet) slow POST body attack mitigation
 * - URL allowlist validation for web scraper
 * - Source code size limits for sandbox execution
 * - Auth guard helper
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionCookie } from "@/lib/auth-server";
import prisma from "@/lib/prisma";

// ── IN-MEMORY RATE LIMITER ──────────────────────────────────────────────────
interface RateBucket {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateBucket>();

/**
 * Returns true if the request is ALLOWED, false if RATE LIMITED.
 * @param key       Usually IP address or sessionId
 * @param maxReqs   Max requests allowed in windowMs
 * @param windowMs  Window duration in ms
 */
export function checkRateLimit(key: string, maxReqs: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = rateLimitStore.get(key);

  if (!bucket || now - bucket.windowStart > windowMs) {
    rateLimitStore.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (bucket.count >= maxReqs) {
    return false; // RATE LIMITED
  }

  bucket.count++;
  return true;
}

export function getRateLimitKey(req: NextRequest): string {
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function rateLimitResponse(retryAfterSec = 60): NextResponse {
  return NextResponse.json(
    { success: false, error: "Too many requests. Please slow down." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSec),
        "X-RateLimit-Limit": "exceeded",
      },
    }
  );
}

// ── R.U.D.Y. (SLOW POST BODY) MITIGATION ────────────────────────────────────
/**
 * Reads the request body with a strict maximum byte limit and timeout.
 * Prevents R.U.D.Y. (R-U-Dead-Yet) attacks that slowly POST huge bodies.
 */
export async function readBodyWithLimit(
  req: NextRequest,
  maxBytes = 64 * 1024 // 64 KB default
): Promise<{ body: any | null; error: string | null }> {
  try {
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > maxBytes) {
      return { body: null, error: `Request body too large. Max ${maxBytes} bytes allowed.` };
    }

    // Read with timeout to prevent slow-body attacks
    const bodyText = await Promise.race([
      req.text(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Request body read timeout.")), 8000)
      ),
    ]) as string;

    if (bodyText.length > maxBytes) {
      return { body: null, error: `Request body too large. Max ${maxBytes} bytes allowed.` };
    }

    return { body: JSON.parse(bodyText), error: null };
  } catch (err: any) {
    return { body: null, error: err.message || "Failed to parse request body." };
  }
}

// ── URL SANITIZER (Web Scraper Protection) ────────────────────────────────────
const BLOCKED_URL_PATTERNS = [
  /^https?:\/\/localhost/i,
  /^https?:\/\/127\./,
  /^https?:\/\/0\.0\.0\.0/,
  /^https?:\/\/10\./,
  /^https?:\/\/192\.168\./,
  /^https?:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^https?:\/\/169\.254\./,   // Link-local / AWS metadata
  /^https?:\/\/metadata\.google/i,
  /file:\/\//i,
  /ftp:\/\//i,
  /javascript:/i,
];

/**
 * Validates that a scrape target URL is safe (no SSRF, no internal network, no file://)
 */
export function validateScrapeUrl(rawUrl: string): { valid: boolean; error?: string; cleanUrl?: string } {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { valid: false, error: "Invalid URL format." };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { valid: false, error: "Only http:// and https:// URLs are allowed." };
  }

  for (const pattern of BLOCKED_URL_PATTERNS) {
    if (pattern.test(parsed.href)) {
      return { valid: false, error: "Requests to internal, localhost, or metadata URLs are not allowed." };
    }
  }

  return { valid: true, cleanUrl: parsed.href };
}

// ── SOURCE CODE SIZE GUARD (Sandbox Protection) ──────────────────────────────
const MAX_SOURCE_BYTES = 16 * 1024; // 16 KB max code input

export function validateSandboxSource(source: string): { valid: boolean; error?: string } {
  if (!source || typeof source !== "string" || source.trim().length === 0) {
    return { valid: false, error: "Source code or command is required." };
  }
  if (Buffer.byteLength(source, "utf8") > MAX_SOURCE_BYTES) {
    return { valid: false, error: `Source code too large. Maximum ${MAX_SOURCE_BYTES / 1024}KB allowed.` };
  }
  // Block dangerous shell commands when shell backend selected
  const dangerous = /rm\s+-rf|mkfs|dd\s+if=|>\s*\/dev|curl\s+.*\|.*sh|wget\s+.*\|.*sh/i;
  if (dangerous.test(source)) {
    return { valid: false, error: "Dangerous shell command detected and blocked." };
  }
  return { valid: true };
}

// ── AUTH GUARD ───────────────────────────────────────────────────────────────
export interface AuthContext {
  userId: string;
  orgId: string;
  isDemo: boolean;
}

export async function resolveAuthContext(req: NextRequest): Promise<AuthContext> {
  const cookieStore = await cookies();
  const session = cookieStore.get("synaps-session")?.value;

  if (!session || session.startsWith("TEST_TOKEN_")) {
    return { userId: "demo-user", orgId: "no_org_fallback", isDemo: true };
  }

  const decoded = await verifySessionCookie(session);
  if (!decoded?.uid) {
    return { userId: "demo-user", orgId: "no_org_fallback", isDemo: true };
  }

  const u = await prisma.user.findUnique({ where: { id: decoded.uid } });
  return {
    userId: decoded.uid,
    orgId: u?.organizationId || "no_org_fallback",
    isDemo: false,
  };
}

// ── SAFE ERROR RESPONSE ───────────────────────────────────────────────────────
/**
 * Returns a sanitized error — no internal stack traces or DB errors exposed to client.
 */
export function safeErrorResponse(err: any, fallback = "An internal error occurred."): NextResponse {
  const isDev = process.env.NODE_ENV !== "production";
  const message = isDev ? (err?.message || fallback) : fallback;
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}
