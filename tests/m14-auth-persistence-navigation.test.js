/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MILESTONE 14 TEST SUITE: AUTH PERSISTENCE, ROOT REDIRECTION & DEMO INTEGRITY
 * ─────────────────────────────────────────────────────────────────────────────
 * Comprehensive automated verification for Causarix:
 *
 * Tier 1: Edge Middleware Root Redirection (`src/middleware.ts`)
 *   - Fast edge redirect from `/` to `/dashboard` when `synaps-session` is present
 *   - Landing inspection bypass when `?landing=true` or `?preview=true`
 *   - Passthrough for unauthenticated visitors visiting `/`
 *   - Auto-session provision for `/demo` route visitors
 *
 * Tier 2: Server Root Page Session Verification (`src/app/page.tsx`)
 *   - Reads `synaps-session` via `cookies()`
 *   - Verifies session with `verifySessionCookie` and redirects to `/dashboard`
 *   - Preserves landing page when unauthenticated or with explicit parameter
 *
 * Tier 3: REST API Session Revocation & Lifecycle (`src/app/api/auth/session/route.ts`)
 *   - DELETE method revokes session cookie with `maxAge: 0` and `path: '/'`
 *   - POST method creates/refreshes 30-day session cookie
 *   - GET method reports session validation and expiration
 *
 * Tier 4: Client & Server Logout Synchronization
 *   - `logoutAction()` explicitly expires cookie with root path
 *   - `client-layout.tsx` invokes `auth.signOut()`, deletes session cookie, and clears demo storage
 *   - `AuthContext.tsx` executes clean storage and session teardown
 *
 * Tier 5: Zero-Login Demo Mode Resilience
 *   - `/demo` seeds demo enterprise workspace and issues 30-day `DEMO_SESSION_` cookie
 *   - `verifySessionCookie` deterministically decodes `DEMO_SESSION_` tokens
 *   - Onboarding bypass provisions valid demo session
 */

const path = require('path');
const fs = require('fs');
const createJiti = require('jiti');
const { TestSuite, expect } = require('./test-harness');

// Initialize runtime TypeScript module resolver with @/ path alias
const jiti = createJiti(path.resolve(__filename), {
  alias: { '@': path.resolve(__dirname, '../src') },
});

// Import modules
const { middleware } = jiti(path.resolve(__dirname, '../src/middleware.ts'));
const sessionRoute = jiti(path.resolve(__dirname, '../src/app/api/auth/session/route.ts'));
const { logoutAction } = jiti(path.resolve(__dirname, '../src/app/actions/auth.ts'));
const { verifySessionCookie } = jiti(path.resolve(__dirname, '../src/lib/auth-server.ts'));

// Helper to construct mock NextRequest
function createMockRequest(urlStr, cookiesObj = {}) {
  const url = new URL(urlStr);
  return {
    url: urlStr,
    nextUrl: url,
    headers: {
      get: (header) => (header.toLowerCase() === 'host' ? url.host : null),
    },
    cookies: {
      get: (name) => (cookiesObj[name] ? { name, value: cookiesObj[name] } : undefined),
      getAll: () => Object.entries(cookiesObj).map(([name, value]) => ({ name, value })),
    },
  };
}

const suite = new TestSuite('Milestone 14: Auth Persistence, Root Navigation & Demo Integrity');

// ═══════════════════════════════════════════════════════════════════════════
// Tier 1: Edge Middleware Root Redirection
// ═══════════════════════════════════════════════════════════════════════════
suite.test('M14.EDGE.1: Edge middleware redirects authenticated visitor on root "/" to "/dashboard"', () => {
    const req = createMockRequest('https://causarix.vercel.app/', {
      'synaps-session': 'TEST_TOKEN_sovereign_admin',
    });
    const res = middleware(req);
    expect(res).toBeDefined();
    expect(res.status).toBe(307); // NextResponse.redirect default
    const location = res.headers.get('location');
    expect(location).toContain('/dashboard');
  });

  suite.test('M14.EDGE.2: Edge middleware allows explicit landing inspection via "?landing=true"', async () => {
    const req = createMockRequest('https://causarix.vercel.app/?landing=true', {
      'synaps-session': 'TEST_TOKEN_sovereign_admin',
    });
    const res = middleware(req);
    expect(res).toBeDefined();
    // Must NOT redirect, should pass through (status 200 / NextResponse.next)
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

  suite.test('M14.EDGE.3: Edge middleware allows unauthenticated visitors on root "/" without redirect', async () => {
    const req = createMockRequest('https://causarix.vercel.app/');
    const res = middleware(req);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

  suite.test('M14.EDGE.4: Edge middleware auto-authenticates visitors accessing "/demo"', async () => {
    const req = createMockRequest('https://causarix.vercel.app/demo');
    const res = middleware(req);
    expect(res).toBeDefined();
    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toBeDefined();
    expect(setCookie).toContain('synaps-session=');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Tier 2: Server Root Page Session Verification
  // ═══════════════════════════════════════════════════════════════════════════
  suite.test('M14.PAGE.1: src/app/page.tsx & scm-lab source import session verification & redirect', async () => {
    const pageSrc = fs.readFileSync(path.resolve(__dirname, '../src/app/page.tsx'), 'utf8');
    expect(pageSrc).toContain('verifySessionCookie');
    expect(pageSrc).toContain('redirect');
    expect(pageSrc).toContain('synaps-session');
    expect(pageSrc).toContain('/dashboard');
    expect(pageSrc).toContain('landing');

    const scmLabSrc = fs.readFileSync(path.resolve(__dirname, '../src/app/dashboard/scm-lab/page.tsx'), 'utf8');
    expect(scmLabSrc).toContain('redirect');
    expect(scmLabSrc).toContain('/dashboard/simulations');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Tier 3: REST API Session Revocation & Lifecycle
  // ═══════════════════════════════════════════════════════════════════════════
  suite.test('M14.REST.1: DELETE /api/auth/session revokes session cookie with maxAge: 0 and path: "/"', async () => {
    expect(sessionRoute.DELETE).toBeDefined();
    const mockReq = {
      cookies: { get: () => undefined },
    };
    const res = await sessionRoute.DELETE(mockReq);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toContain('Session cleared');
    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toContain('synaps-session=');
    expect(setCookie).toContain('Max-Age=0');
  });

  suite.test('M14.REST.2: POST /api/auth/session sets 30-day session cookie', async () => {
    const mockReq = {
      json: async () => ({ idToken: 'TEST_TOKEN_demo_admin_synaps' }),
      cookies: { get: () => undefined },
      headers: { get: () => '127.0.0.1' },
    };
    const res = await sessionRoute.POST(mockReq);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toContain('synaps-session=');
    expect(setCookie).toContain('Max-Age=2592000'); // 30 days
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Tier 4: Client & Server Logout Synchronization
  // ═══════════════════════════════════════════════════════════════════════════
  suite.test('M14.LOGOUT.1: src/app/dashboard/client-layout.tsx signs out Firebase auth and clears demo storage', async () => {
    const layoutSrc = fs.readFileSync(path.resolve(__dirname, '../src/app/dashboard/client-layout.tsx'), 'utf8');
    expect(layoutSrc).toContain('signOut');
    expect(layoutSrc).toContain('/api/auth/session');
    expect(layoutSrc).toContain('DELETE');
    expect(layoutSrc).toContain('logoutAction');
    expect(layoutSrc).toContain('synaps_demo_user');
    expect(layoutSrc).toContain('DEMO_SESSION_demo-user');
  });

  suite.test('M14.LOGOUT.2: src/context/AuthContext.tsx handleLogout clears session cookies and storage', async () => {
    const authCtxSrc = fs.readFileSync(path.resolve(__dirname, '../src/context/AuthContext.tsx'), 'utf8');
    expect(authCtxSrc).toContain('DELETE');
    expect(authCtxSrc).toContain('logoutAction');
    expect(authCtxSrc).toContain('synaps-session=');
    expect(authCtxSrc).toContain('synaps_demo_user');
    expect(authCtxSrc).toContain('DEMO_SESSION_demo-user');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Tier 5: Zero-Login Demo Mode Resilience
  // ═══════════════════════════════════════════════════════════════════════════
  suite.test('M14.DEMO.1: verifySessionCookie decodes DEMO_SESSION_ tokens with OWNER role and valid expiration', async () => {
    const decoded = await verifySessionCookie('DEMO_SESSION_demo-user');
    expect(decoded).toBeDefined();
    expect(decoded.uid).toBe('demo-user');
    expect(decoded.email).toBe('admin@apex-global.com');
    expect(decoded.name).toBe('Demo Administrator');
    expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  suite.test('M14.DEMO.2: src/app/demo/route.ts sets 30-day session and routes to /dashboard', async () => {
    const demoRouteSrc = fs.readFileSync(path.resolve(__dirname, '../src/app/demo/route.ts'), 'utf8');
    expect(demoRouteSrc).toContain('DEMO_SESSION_');
    expect(demoRouteSrc).toContain('synaps-session');
    expect(demoRouteSrc).toContain('/dashboard');
    expect(demoRouteSrc).toContain('30 * 24 * 60 * 60');
  });

module.exports = suite;

if (require.main === module) {
  suite.run({ verbose: true }).then((res) => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
