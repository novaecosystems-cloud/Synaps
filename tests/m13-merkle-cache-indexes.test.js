/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MILESTONE 13 TEST SUITE: SYSTEM SCALING, MERKLE CACHING & PRISMA COMPOSITE INDEXES
 * ─────────────────────────────────────────────────────────────────────────────
 * Comprehensive automated verification for Causarix Milestone 13:
 *
 * Tier 1: Prisma Schema Composite Indexes Validation
 *   - Decision composite indexes: [organizationId, status, createdAt] and [organizationId, createdAt]
 *   - AuditLog composite indexes: [organizationId, createdAt(sort: Desc)] and [organizationId, action, createdAt]
 *   - Project composite index: [organizationId, status, createdAt]
 *   - ProjectTask composite index: [organizationId, status, createdAt]
 *
 * Tier 2: Cache Key Determinism with Cryptographic SHA-256
 *   - Deterministic cache key formatting: causarix:deliberate:v1:<64-char-hex>
 *   - Invariance under whitespace and casing normalization
 *   - Cryptographic avalanche effect: slight variation produces distinct SHA-256 keys
 *   - Sensitivity across risk tolerances and runway months
 *
 * Tier 3: Cache Set/Get Performance & TTL Expiration
 *   - Sub-12ms in-memory L1 cache set & retrieval latency benchmark
 *   - TTL expiration: expired entries are pruned and return null
 *   - Cache flushing: clearDeliberationCache cleanses cache state
 *   - LRU capacity enforcement: bounded cache size
 *   - High concurrency: 100 concurrent get/set calls without exceptions
 *
 * Tier 4: Delaware DGCL § 141 Merkle Root Preservation on Cache Hit
 *   - Merkle root integrity: 66-character 0x[0-9a-f]{64} cryptographic seal preserved on cache hit
 *   - Complete payload preservation: fiduciaryConfidence, actionItems, winningPath, simulationModel
 *   - Full API route caching: POST /api/agi/deliberate returns HTTP 200, X-Causarix-Cache: HIT, and identical Merkle root
 *
 * Tier 5: Client Bundle Isolation
 *   - src/app/dashboard/agi-studio/page.tsx contains 'use client' directive
 *   - Strict 0-reference check for server modules: firebase-admin, @google-cloud/storage, autonomous-executive-reasoner
 *   - Safe type sharing: verifies page imports from @/lib/autonomous-executive-types without bundling server code
 */

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const createJiti = require('jiti');
const { TestSuite, expect } = require('./test-harness');

// Initialize runtime TypeScript module resolver with @/ path alias
const jiti = createJiti(path.resolve(__filename), {
  alias: { '@': path.resolve(__dirname, '../src') },
});

// Load cache module, reasoner, and deliberate route
const {
  getDeliberationCacheKey,
  getCachedDeliberation,
  setCachedDeliberation,
  clearDeliberationCache,
} = jiti(path.resolve(__dirname, '../src/lib/autonomous-executive-cache.ts'));

const {
  buildDynamicParametricDeliberation,
} = jiti(path.resolve(__dirname, '../src/lib/autonomous-executive-reasoner.ts'));

const deliberateRoute = jiti(path.resolve(__dirname, '../src/app/api/agi/deliberate/route.ts'));

const suite = new TestSuite('Milestone 13: System Scaling, Merkle Caching & Prisma Composite Indexes');

// Helper to create synthetic MctsDeliberationResult
function createMockDeliberation(dilemma, org, risk, runway) {
  return buildDynamicParametricDeliberation(
    'M13 Executive Deliberation',
    dilemma,
    org,
    risk,
    runway,
    2000
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TIER 1: PRISMA SCHEMA COMPOSITE INDEXES VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

suite.test('M13.IDX.1: Decision model contains composite indexes for organizationId + status + createdAt', () => {
  const schemaPath = path.resolve(__dirname, '../prisma/schema.prisma');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');

  // Verify Decision model composite indexes
  const decisionModelMatch = schemaContent.match(/model Decision \{([\s\S]*?)\n\}/);
  expect(decisionModelMatch).toBeTruthy('model Decision must exist in schema.prisma');
  const decisionBody = decisionModelMatch[1];

  expect(decisionBody.includes('@@index([organizationId, status, createdAt])')).toBe(
    true,
    'Decision model must include @@index([organizationId, status, createdAt])'
  );
  expect(decisionBody.includes('@@index([organizationId, createdAt])')).toBe(
    true,
    'Decision model must include @@index([organizationId, createdAt])'
  );
});

suite.test('M13.IDX.2: AuditLog model contains composite indexes with sort order and action filtering', () => {
  const schemaPath = path.resolve(__dirname, '../prisma/schema.prisma');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');

  const auditLogModelMatch = schemaContent.match(/model AuditLog \{([\s\S]*?)\n\}/);
  expect(auditLogModelMatch).toBeTruthy('model AuditLog must exist in schema.prisma');
  const auditLogBody = auditLogModelMatch[1];

  expect(auditLogBody.includes('@@index([organizationId, createdAt(sort: Desc)])')).toBe(
    true,
    'AuditLog model must include @@index([organizationId, createdAt(sort: Desc)])'
  );
  expect(auditLogBody.includes('@@index([organizationId, action, createdAt])')).toBe(
    true,
    'AuditLog model must include @@index([organizationId, action, createdAt])'
  );
});

suite.test('M13.IDX.3: Project and ProjectTask models contain composite indexes for org-scoped status filtering', () => {
  const schemaPath = path.resolve(__dirname, '../prisma/schema.prisma');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');

  const projectModelMatch = schemaContent.match(/model Project \{([\s\S]*?)\n\}/);
  expect(projectModelMatch).toBeTruthy('model Project must exist in schema.prisma');
  expect(projectModelMatch[1].includes('@@index([organizationId, status, createdAt])')).toBe(
    true,
    'Project model must include @@index([organizationId, status, createdAt])'
  );

  const taskModelMatch = schemaContent.match(/model ProjectTask \{([\s\S]*?)\n\}/);
  expect(taskModelMatch).toBeTruthy('model ProjectTask must exist in schema.prisma');
  expect(taskModelMatch[1].includes('@@index([organizationId, status, createdAt])')).toBe(
    true,
    'ProjectTask model must include @@index([organizationId, status, createdAt])'
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// TIER 2: CACHE KEY DETERMINISM WITH CRYPTOGRAPHIC SHA-256
// ─────────────────────────────────────────────────────────────────────────────

suite.test('M13.CACHE.1: Cache key generates deterministic SHA-256 hash with versioned prefix', () => {
  const dilemma = 'Rapid scale-up of AI inference compute cluster';
  const org = 'Sovereign Corp';
  const risk = 'BALANCED';
  const runway = 18;

  const key1 = getDeliberationCacheKey(dilemma, org, risk, runway);
  const key2 = getDeliberationCacheKey(dilemma, org, risk, runway);

  expect(key1).toBe(key2, 'Identical arguments must yield identical cache keys');
  expect(key1.startsWith('causarix:deliberate:v1:')).toBe(true, 'Cache key must have versioned prefix');

  const hashPart = key1.replace('causarix:deliberate:v1:', '');
  expect(/^[0-9a-f]{64}$/.test(hashPart)).toBe(true, 'Hash portion must be 64-character lowercase hex');
});

suite.test('M13.CACHE.2: Normalizes whitespace and casing for robust cache hits', () => {
  const baseKey = getDeliberationCacheKey(
    'Hostile takeover defense against offshore PE firm',
    'Causarix AI Enterprise',
    'BALANCED',
    18
  );

  // Varied casing and redundant whitespace
  const paddedKey = getDeliberationCacheKey(
    '  HOSTILE   takeover defense   against offshore PE FIRM  ',
    '  causarix ai enterprise  ',
    'BALANCED',
    18
  );

  expect(paddedKey).toBe(baseKey, 'Cache key must be invariant under casing and redundant whitespace normalization');
});

suite.test('M13.CACHE.3: Cryptographic avalanche effect produces distinct keys on single-byte changes', () => {
  const keyA = getDeliberationCacheKey('Regulatory inquiry by SEC into insider trading', 'Omni Corp', 'BALANCED', 12);
  const keyB = getDeliberationCacheKey('Regulatory inquiry by DOJ into insider trading', 'Omni Corp', 'BALANCED', 12);

  expect(keyA !== keyB).toBe(true, 'Single word change must generate distinct cache key');

  // Parameter sensitivity
  const keyRisk = getDeliberationCacheKey('Regulatory inquiry by SEC into insider trading', 'Omni Corp', 'AGGRESSIVE', 12);
  expect(keyA !== keyRisk).toBe(true, 'Risk tolerance change must generate distinct cache key');

  const keyRunway = getDeliberationCacheKey('Regulatory inquiry by SEC into insider trading', 'Omni Corp', 'BALANCED', 24);
  expect(keyA !== keyRunway).toBe(true, 'Runway months change must generate distinct cache key');
});

// ─────────────────────────────────────────────────────────────────────────────
// TIER 3: CACHE SET/GET PERFORMANCE & TTL LIFECYCLE
// ─────────────────────────────────────────────────────────────────────────────

suite.test('M13.PERF.1: Cache set and get completes in sub-12ms latency benchmark', async () => {
  clearDeliberationCache();

  const dilemma = 'Sub-12ms benchmark simulation dilemma';
  const org = 'Benchmark Enterprise';
  const mockResult = createMockDeliberation(dilemma, org, 'BALANCED', 18);
  const cacheKey = getDeliberationCacheKey(dilemma, org, 'BALANCED', 18);

  const tStartSet = Date.now();
  await setCachedDeliberation(cacheKey, mockResult, 60);
  const setDuration = Date.now() - tStartSet;

  const tStartGet = Date.now();
  const retrieved = await getCachedDeliberation(cacheKey);
  const getDuration = Date.now() - tStartGet;

  expect(retrieved).toBeDefined();
  expect(retrieved.dilemma).toBe(dilemma);
  expect(setDuration).toBeLessThanOrEqual(12, `Set latency (${setDuration}ms) must be <= 12ms`);
  expect(getDuration).toBeLessThanOrEqual(12, `Get latency (${getDuration}ms) must be <= 12ms`);
});

suite.test('M13.PERF.2: Clear cache wipes all entries cleanly', async () => {
  const key = getDeliberationCacheKey('Temporary dilemma', 'Temp Org', 'CONSERVATIVE', 6);
  const mock = createMockDeliberation('Temporary dilemma', 'Temp Org', 'CONSERVATIVE', 6);

  await setCachedDeliberation(key, mock, 300);
  expect(await getCachedDeliberation(key)).toBeDefined();

  clearDeliberationCache();
  expect(await getCachedDeliberation(key)).toBeNull();
});

suite.test('M13.PERF.3: TTL expiration prunes stale entries and returns null', async () => {
  clearDeliberationCache();

  const key = getDeliberationCacheKey('Short lived dilemma', 'TTL Org', 'BALANCED', 12);
  const mock = createMockDeliberation('Short lived dilemma', 'TTL Org', 'BALANCED', 12);

  // Set with negative TTL (already expired)
  await setCachedDeliberation(key, mock, -1);
  const result = await getCachedDeliberation(key);
  expect(result).toBeNull('Expired entry must return null on retrieval');
});

suite.test('M13.PERF.4: Bounded LRU cache evicts oldest entry when reaching capacity limit', async () => {
  clearDeliberationCache();

  // Insert 501 unique entries to trigger LRU eviction on first entry
  const firstKey = getDeliberationCacheKey('Initial Dilemma 0', 'LRU Corp', 'BALANCED', 12);
  const mock = createMockDeliberation('Initial Dilemma 0', 'LRU Corp', 'BALANCED', 12);
  await setCachedDeliberation(firstKey, mock, 3600);

  for (let i = 1; i <= 501; i++) {
    const k = getDeliberationCacheKey(`Sequential Dilemma ${i}`, 'LRU Corp', 'BALANCED', 12);
    await setCachedDeliberation(k, mock, 3600);
  }

  // First entry should have been evicted due to bounded 500 limit
  const evicted = await getCachedDeliberation(firstKey);
  expect(evicted).toBeNull('Oldest entry must be evicted when LRU capacity exceeded');
});

suite.test('M13.PERF.5: High-concurrency operations complete without exceptions or race conditions', async () => {
  clearDeliberationCache();

  const mock = createMockDeliberation('Concurrent Dilemma', 'Concurrency Corp', 'BALANCED', 18);
  const ops = [];

  for (let i = 0; i < 100; i++) {
    const k = getDeliberationCacheKey(`Parallel Task ${i % 10}`, 'Concurrency Corp', 'BALANCED', 18);
    ops.push(setCachedDeliberation(k, mock, 3600));
    ops.push(getCachedDeliberation(k));
  }

  const results = await Promise.all(ops);
  expect(results.length).toBe(200);
});

// ─────────────────────────────────────────────────────────────────────────────
// TIER 4: DELAWARE DGCL § 141 MERKLE ROOT PRESERVATION ON CACHE HIT
// ─────────────────────────────────────────────────────────────────────────────

suite.test('M13.MERKLE.1: Preserves exact 66-char Delaware DGCL § 141 Merkle root on cache hit', async () => {
  clearDeliberationCache();

  const dilemma = 'Strategic capital reallocation: $50M credit facility expansion';
  const org = 'Delaware Holdings LLC';
  const original = createMockDeliberation(dilemma, org, 'CONSERVATIVE', 24);

  const root = original.executiveResolution.merkleRoot;
  expect(/^0x[0-9a-fA-F]{64}$/.test(root)).toBe(true, 'Root must match 66-char hex format');

  const key = getDeliberationCacheKey(dilemma, org, 'CONSERVATIVE', 24);
  await setCachedDeliberation(key, original, 3600);

  const retrieved = await getCachedDeliberation(key);
  expect(retrieved).toBeDefined();
  expect(retrieved.executiveResolution.merkleRoot).toBe(root, 'Merkle root must match bit-for-bit');
});

suite.test('M13.MERKLE.2: Preserves complete fiduciary payload, actionItems, and simulationModel', async () => {
  const dilemma = 'Product liability defense and warranty reserve adjustment';
  const org = 'Manufacturing Giant';
  const original = createMockDeliberation(dilemma, org, 'BALANCED', 18);

  const key = getDeliberationCacheKey(dilemma, org, 'BALANCED', 18);
  await setCachedDeliberation(key, original, 3600);

  const retrieved = await getCachedDeliberation(key);
  expect(retrieved.winningPath.actionSummary).toBe(original.winningPath.actionSummary);
  expect(retrieved.executiveResolution.fiduciaryConfidence).toBe(original.executiveResolution.fiduciaryConfidence);
  expect(retrieved.executiveResolution.actionItems.length).toBe(original.executiveResolution.actionItems.length);
  expect(retrieved.simulationModel.formulae.length).toBe(original.simulationModel.formulae.length);
  expect(retrieved.simulationModel.code).toBe(original.simulationModel.code);
  expect(retrieved.branchesEvaluated.length).toBe(original.branchesEvaluated.length);
});

suite.test('M13.MERKLE.3: API Route POST returns X-Causarix-Cache: HIT and identical Merkle root on repeat call', async () => {
  clearDeliberationCache();

  const dilemma = 'M13 API Cache Test: High-growth expansion vs dividend distribution';
  const org = 'Sovereign Board Corp';

  const req1 = new Request('http://localhost/api/agi/deliberate', {
    method: 'POST',
    body: JSON.stringify({ dilemma, organizationName: org }),
    headers: { 'Content-Type': 'application/json' },
  });

  const res1 = await deliberateRoute.POST(req1);
  expect(res1.status).toBe(200);
  const data1 = await res1.json();
  expect(data1.success).toBe(true);
  expect(data1.cached).toBeFalsy();
  const originalRoot = data1.data.executiveResolution.merkleRoot;
  expect(originalRoot.length).toBe(66);

  // Second request: Should be a cache HIT in sub-12ms
  const req2 = new Request('http://localhost/api/agi/deliberate', {
    method: 'POST',
    body: JSON.stringify({ dilemma, organizationName: org }),
    headers: { 'Content-Type': 'application/json' },
  });

  const tStartHit = Date.now();
  const res2 = await deliberateRoute.POST(req2);
  const hitDuration = Date.now() - tStartHit;

  expect(res2.status).toBe(200);
  expect(res2.headers.get('x-causarix-cache')).toBe('HIT');
  expect(hitDuration).toBeLessThanOrEqual(50, `Cache hit round-trip (${hitDuration}ms) must be fast`);

  const data2 = await res2.json();
  expect(data2.success).toBe(true);
  expect(data2.cached).toBe(true);
  expect(data2.data.executiveResolution.merkleRoot).toBe(
    originalRoot,
    'Cached response must preserve exact Merkle root of original deliberation'
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// TIER 5: CLIENT BUNDLE ISOLATION
// ─────────────────────────────────────────────────────────────────────────────

suite.test('M13.BUNDLE.1: AGI Studio page defines use-client directive', () => {
  const pagePath = path.resolve(__dirname, '../src/app/dashboard/agi-studio/page.tsx');
  const content = fs.readFileSync(pagePath, 'utf8');

  expect(content.startsWith("'use client'") || content.startsWith('"use client"')).toBe(
    true,
    'src/app/dashboard/agi-studio/page.tsx must begin with use client directive'
  );
});

suite.test('M13.BUNDLE.2: AGI Studio page has 0 references to firebase-admin', () => {
  const pagePath = path.resolve(__dirname, '../src/app/dashboard/agi-studio/page.tsx');
  const content = fs.readFileSync(pagePath, 'utf8');

  expect(content.includes('firebase-admin')).toBe(
    false,
    'src/app/dashboard/agi-studio/page.tsx must NOT reference firebase-admin'
  );
});

suite.test('M13.BUNDLE.3: AGI Studio page has 0 references to @google-cloud/storage', () => {
  const pagePath = path.resolve(__dirname, '../src/app/dashboard/agi-studio/page.tsx');
  const content = fs.readFileSync(pagePath, 'utf8');

  expect(content.includes('@google-cloud/storage')).toBe(
    false,
    'src/app/dashboard/agi-studio/page.tsx must NOT reference @google-cloud/storage'
  );
});

suite.test('M13.BUNDLE.4: AGI Studio page has 0 references to autonomous-executive-reasoner', () => {
  const pagePath = path.resolve(__dirname, '../src/app/dashboard/agi-studio/page.tsx');
  const content = fs.readFileSync(pagePath, 'utf8');

  expect(content.includes('autonomous-executive-reasoner')).toBe(
    false,
    'src/app/dashboard/agi-studio/page.tsx must NOT reference autonomous-executive-reasoner directly'
  );
});

suite.test('M13.BUNDLE.5: AGI Studio page imports purely from @/lib/autonomous-executive-types', () => {
  const pagePath = path.resolve(__dirname, '../src/app/dashboard/agi-studio/page.tsx');
  const content = fs.readFileSync(pagePath, 'utf8');

  expect(content.includes('@/lib/autonomous-executive-types')).toBe(
    true,
    'src/app/dashboard/agi-studio/page.tsx must import types from @/lib/autonomous-executive-types'
  );
  expect(content.includes('buildClientFallbackDeliberation')).toBe(
    true,
    'src/app/dashboard/agi-studio/page.tsx must use client-safe fallback function'
  );
});

module.exports = suite;

if (require.main === module) {
  suite.run({ verbose: true }).then((res) => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
