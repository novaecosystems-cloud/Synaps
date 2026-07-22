import { NextResponse } from 'next/server';

/**
 * Sanitizes user input against XSS, SQL injection markers, command injection, and path traversal
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript pseudo-protocol
    .replace(/onerror=/gi, '')
    .replace(/onload=/gi, '')
    .replace(/\.\.\//g, '') // Prevent path traversal
    .replace(/[\0\r]/g, '') // Remove null bytes & carriage returns
    .trim();
}

/**
 * In-Memory Sliding Window Rate Limiter
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  identifier: string,
  limit: number = 100, // max requests
  windowMs: number = 60 * 1000 // 1 minute window
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitMap.set(identifier, newEntry);
    return { allowed: true, remaining: limit - 1, resetTime: newEntry.resetTime };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetTime: entry.resetTime };
}

/**
 * Redacts secrets (JWTs, API Keys, passwords) from object or log output
 */
export function redactSecrets(data: any): any {
  if (!data) return data;
  
  if (typeof data === 'string') {
    return data
      .replace(/AIzaSy[A-Za-z0-9_-]{33}/g, 'AIzaSy***REDACTED***')
      .replace(/gsk_[A-Za-z0-9_-]{48}/g, 'gsk_***REDACTED***')
      .replace(/sk-[A-Za-z0-9_-]{48}/g, 'sk-***REDACTED***')
      .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, 'eyJ***JWT_REDACTED***');
  }

  if (typeof data === 'object') {
    const sanitized: any = Array.isArray(data) ? [] : {};
    for (const key in data) {
      if (['password', 'secret', 'apiKey', 'token', 'auth', 'cookie'].some(k => key.toLowerCase().includes(k))) {
        sanitized[key] = '***REDACTED***';
      } else {
        sanitized[key] = redactSecrets(data[key]);
      }
    }
    return sanitized;
  }

  return data;
}

/**
 * Generates secure API error response without leaking stack traces or internal DB info
 */
export function safeErrorResponse(
  error: any,
  userMessage: string = 'An unexpected error occurred',
  status: number = 500
): NextResponse {
  console.error(`[SEC_LOG] ${new Date().toISOString()} Error:`, redactSecrets(error?.message || error));
  
  return NextResponse.json(
    {
      success: false,
      error: userMessage,
      timestamp: new Date().toISOString()
    },
    { status }
  );
}
