import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Simple in-memory fallback for environments without Upstash Redis
const memoryStore = new Map<string, number[]>();

class MemoryRateLimiter {
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number, windowSeconds: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowSeconds * 1000;
  }

  async limit(identifier: string) {
    const now = Date.now();
    let timestamps = memoryStore.get(identifier) || [];
    
    // Clean up old timestamps
    timestamps = timestamps.filter(ts => now - ts < this.windowMs);
    
    const isRateLimited = timestamps.length >= this.maxRequests;
    const remaining = Math.max(0, this.maxRequests - timestamps.length - 1);
    const reset = now + this.windowMs;

    if (!isRateLimited) {
      timestamps.push(now);
      memoryStore.set(identifier, timestamps);
    }

    return {
      success: !isRateLimited,
      limit: this.maxRequests,
      remaining,
      reset,
    };
  }
}

let ratelimit: any;
let signupRatelimit: any;
let authRatelimit: any;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = Redis.fromEnv();
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '10 s'), // 20 requests per 10 seconds
    analytics: true,
    prefix: 'ratelimit:api',
  });
  signupRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '600 s'), // 5 sign-ups per 10 minutes (Bot Protection)
    analytics: true,
    prefix: 'ratelimit:signup',
  });
  authRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '60 s'), // 10 auth attempts per minute
    analytics: true,
    prefix: 'ratelimit:auth',
  });
} else {
  // Fallback to memory stores
  ratelimit = new MemoryRateLimiter(20, 10);
  signupRatelimit = new MemoryRateLimiter(5, 600); // 5 per 10 mins
  authRatelimit = new MemoryRateLimiter(10, 60);   // 10 per 1 min
}

export { ratelimit, signupRatelimit, authRatelimit };
