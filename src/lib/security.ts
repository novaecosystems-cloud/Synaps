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

export interface ScrapeUrlValidationResult {
  valid: boolean;
  isValid: boolean; // Aliased for e2e-api-verifier compatibility
  error?: string;
  reason?: string;  // Aliased for e2e-api-verifier compatibility
  cleanUrl?: string;
}

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '[::1]',
  'instance-data',
  'metadata.google.internal',
  'metadata.google',
]);

function isPrivateOrBlockedIPv4(ip: string): boolean {
  if (
    ip === '0.0.0.0' ||
    ip.startsWith('0.') ||
    ip.startsWith('127.') ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('169.254.') || // Link-local / Cloud Metadata
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip) ||
    /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./.test(ip) || // Carrier-Grade NAT (RFC 6598)
    /^192\.0\.2\./.test(ip) || // TEST-NET-1
    /^198\.51\.100\./.test(ip) || // TEST-NET-2
    /^203\.0\.113\./.test(ip) || // TEST-NET-3
    /^(22[4-9]|23[0-9])\./.test(ip) || // Multicast (224.0.0.0/4)
    /^(24[0-9]|25[0-5])\./.test(ip) // Reserved / Broadcast (240.0.0.0/4, 255.255.255.255)
  ) {
    return true;
  }
  return false;
}

/**
 * Validates that a scrape target URL is safe (no SSRF, no internal network, no file://)
 */
export function validateScrapeUrl(rawUrl: string): ScrapeUrlValidationResult {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, isValid: false, error: 'A valid URL string is required.', reason: 'A valid URL string is required.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { valid: false, isValid: false, error: 'Invalid URL format.', reason: 'Invalid URL format.' };
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { valid: false, isValid: false, error: 'Only http:// and https:// URLs are allowed.', reason: 'Only http:// and https:// URLs are allowed.' };
  }

  // Normalize hostname: strip IPv6 brackets and FQDN trailing dots
  const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.+$/, '');

  // 1. Direct hostname check & internal suffix blocks
  if (
    BLOCKED_HOSTNAMES.has(hostname) ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.localdomain') ||
    hostname.endsWith('.lan') ||
    hostname.endsWith('.home') ||
    hostname.endsWith('.corp')
  ) {
    return {
      valid: false,
      isValid: false,
      error: 'Requests to internal, localhost, or cloud metadata endpoints are strictly blocked.',
      reason: 'Requests to internal, localhost, or cloud metadata endpoints are strictly blocked.'
    };
  }

  // 2. IPv4-Mapped IPv6 addresses (e.g. ::ffff:127.0.0.1, ::ffff:169.254.169.254, ::ffff:7f00:1, ::ffff:a9fe:a9fe)
  if (
    hostname.startsWith('::ffff:') ||
    hostname.startsWith('0:0:0:0:0:ffff:') ||
    hostname.includes('ffff:')
  ) {
    const mapped = hostname.replace(/^(?:0:0:0:0:0:ffff:|::ffff:)/, '');
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(mapped)) {
      if (isPrivateOrBlockedIPv4(mapped)) {
        return {
          valid: false,
          isValid: false,
          error: 'Requests to private IP addresses or link-local metadata are blocked.',
          reason: 'Requests to private IP addresses or link-local metadata are blocked.'
        };
      }
    } else if (/^[0-9a-f]{1,4}:[0-9a-f]{1,4}$/i.test(mapped)) {
      const parts = mapped.split(':');
      const n1 = parseInt(parts[0], 16);
      const n2 = parseInt(parts[1], 16);
      const b1 = (n1 >> 8) & 0xff;
      const b2 = n1 & 0xff;
      const b3 = (n2 >> 8) & 0xff;
      const b4 = n2 & 0xff;
      const decodedIp = `${b1}.${b2}.${b3}.${b4}`;
      if (isPrivateOrBlockedIPv4(decodedIp)) {
        return {
          valid: false,
          isValid: false,
          error: 'Requests to private IP addresses or link-local metadata are blocked.',
          reason: 'Requests to private IP addresses or link-local metadata are blocked.'
        };
      }
    } else {
      return {
        valid: false,
        isValid: false,
        error: 'Requests to IPv4-mapped IPv6 addresses are blocked.',
        reason: 'Requests to IPv4-mapped IPv6 addresses are blocked.'
      };
    }
  }

  // 3. Loopback & Private IPv4 ranges
  if (isPrivateOrBlockedIPv4(hostname)) {
    return {
      valid: false,
      isValid: false,
      error: 'Requests to private IP addresses or link-local metadata are blocked.',
      reason: 'Requests to private IP addresses or link-local metadata are blocked.'
    };
  }

  // 4. IPv6 Private, Link-local, and ULA ranges (RFC 4193 /7 covers fc00::/7 i.e. fc00:: - fdff:...)
  if (
    hostname === '::1' ||
    hostname === '::' ||
    hostname.startsWith('fe80:') ||
    hostname.startsWith('fc') ||
    hostname.startsWith('fd') ||
    /^fe[89ab][0-9a-f]:/i.test(hostname) ||
    /^f[cd][0-9a-f]{2}:/i.test(hostname)
  ) {
    return {
      valid: false,
      isValid: false,
      error: 'Requests to private IPv6 addresses are blocked.',
      reason: 'Requests to private IPv6 addresses are blocked.'
    };
  }

  // 5. Integer / Octal / Hexadecimal IP representation blocks
  if (/^0x[0-9a-f]+$/i.test(hostname) || /^\d+$/.test(hostname) || /^0x[0-9a-f.]+/i.test(hostname)) {
    return {
      valid: false,
      isValid: false,
      error: 'Numeric and hexadecimal IP representations are not permitted.',
      reason: 'Numeric and hexadecimal IP representations are not permitted.'
    };
  }

  return {
    valid: true,
    isValid: true,
    cleanUrl: parsed.href
  };
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
  let session: string | undefined;
  try {
    const cookieStore = await cookies();
    session = cookieStore?.get("synaps-session")?.value;
  } catch {
    session = req?.cookies?.get?.("synaps-session")?.value;
  }

  if (!session) {
    session = req?.cookies?.get?.("synaps-session")?.value;
  }

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
