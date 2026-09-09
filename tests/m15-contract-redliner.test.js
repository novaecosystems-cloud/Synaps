/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MILESTONE 15 TEST SUITE: AUTONOMOUS CONTRACT FIDUCIARY REDLINER
 * ─────────────────────────────────────────────────────────────────────────────
 * Comprehensive automated verification for Causarix:
 *
 * Tier 1: Preloaded Toxic Contract Templates (MSA, Founder IP, Mutual NDA)
 * Tier 2: Statutory Delaware DGCL § 141 Risk Scoring & Fiduciary Classifications
 * Tier 3: Strike-and-Replace Recommended Redlines & Benchmark Citations
 * Tier 4: Cryptographic SHA-256 Merkle DAG Root Proofs & Audit Signatures
 * Tier 5: Dynamic Custom Contract Parsing & Executive Dashboard Integration
 */

const path = require('path');
const fs = require('fs');
const createJiti = require('jiti');
const { TestSuite, expect } = require('./test-harness');

const jiti = createJiti(path.resolve(__filename), {
  alias: { '@': path.resolve(__dirname, '../src') },
});

const { PRELOADED_CONTRACTS, POST } = jiti(path.resolve(__dirname, '../src/app/api/legal/redline/route.ts'));

const suite = new TestSuite('M15: Autonomous Contract Fiduciary Redliner');

// ═══════════════════════════════════════════════════════════════════════════
// Tier 1: Preloaded Toxic Contract Templates
// ═══════════════════════════════════════════════════════════════════════════
suite.test('M15.TEMPLATES.1: Exposes 3 distinct toxic contract templates with substantial legal text', () => {
  expect(PRELOADED_CONTRACTS).toBeDefined();
  expect(PRELOADED_CONTRACTS.vendor_saas).toBeDefined();
  expect(PRELOADED_CONTRACTS.founder_ip).toBeDefined();
  expect(PRELOADED_CONTRACTS.nda).toBeDefined();

  expect(PRELOADED_CONTRACTS.vendor_saas.sampleText.length).toBeGreaterThan(200);
  expect(PRELOADED_CONTRACTS.founder_ip.sampleText.length).toBeGreaterThan(200);
  expect(PRELOADED_CONTRACTS.nda.sampleText.length).toBeGreaterThan(200);
});

suite.test('M15.TEMPLATES.2: Vendor SaaS contract contains uncapped indemnity and $100 liability cap', () => {
  const findings = PRELOADED_CONTRACTS.vendor_saas.presetFindings;
  expect(Array.isArray(findings)).toBe(true);
  expect(findings.length).toBeGreaterThanOrEqual(3);

  const indemnity = findings.find((f) => f.clauseType.includes('Indemnification'));
  expect(indemnity).toBeDefined();
  expect(indemnity.riskLevel).toBe('CRITICAL');
  expect(indemnity.recommendedRedline.toLowerCase()).toContain('gross negligence');

  const liability = findings.find((f) => f.clauseType.includes('Liability'));
  expect(liability).toBeDefined();
  expect(liability.riskLevel).toBe('CRITICAL');
});

suite.test('M15.TEMPLATES.3: Founder IP agreement catches 24-month worldwide non-compete & par-value clawback', () => {
  const findings = PRELOADED_CONTRACTS.founder_ip.presetFindings;
  const nonCompete = findings.find((f) => f.clauseType.includes('Non-Compete'));
  expect(nonCompete).toBeDefined();
  expect(nonCompete.riskLevel).toBe('CRITICAL');
  expect(nonCompete.recommendedRedline).toContain('STRIKE CLAUSE ENTIRELY');

  const clawback = findings.find((f) => f.clauseType.includes('Clawback'));
  expect(clawback).toBeDefined();
  expect(clawback.riskLevel).toBe('CRITICAL');
});

suite.test('M15.TEMPLATES.4: NDA template flags poisonous residuals clause and oral disclosure trap', () => {
  const findings = PRELOADED_CONTRACTS.nda.presetFindings;
  const residuals = findings.find((f) => f.clauseType.includes('Residuals'));
  expect(residuals).toBeDefined();
  expect(residuals.riskLevel).toBe('CRITICAL');
  expect(residuals.recommendedRedline).toContain('STRIKE ENTIRE SECTION');
});

// ═══════════════════════════════════════════════════════════════════════════
// Tier 2: Statutory Delaware DGCL § 141 Risk Scoring & API Response
// ═══════════════════════════════════════════════════════════════════════════
suite.test('M15.API.1: POST /api/legal/redline executes analysis on vendor_saas template', async () => {
  const mockReq = {
    json: async () => ({
      contractType: 'vendor_saas',
      companyName: 'Apex Defense Technologies'
    })
  };

  const res = await POST(mockReq);
  expect(res.status).toBe(200);
  const data = await res.json();

  expect(data.contractType).toBe('vendor_saas');
  expect(data.overallRiskScore).toBeGreaterThanOrEqual(75);
  expect(data.riskCategory).toBe('CRITICAL');
  expect(data.delawareSafeHarborStatus).toBe('NON_COMPLIANT');
  expect(data.findings.length).toBeGreaterThanOrEqual(4);
});

suite.test('M15.API.2: Cryptographic SHA-256 Merkle root is generated and sealed', async () => {
  const mockReq = {
    json: async () => ({
      contractType: 'founder_ip',
      companyName: 'Starlight Autonomous'
    })
  };

  const res = await POST(mockReq);
  expect(res.status).toBe(200);
  const data = await res.json();

  expect(data.merkleAudit).toBeDefined();
  expect(data.merkleAudit.merkleRoot.startsWith('0x')).toBe(true);
  expect(data.merkleAudit.merkleRoot.length).toBe(66);
  expect(data.merkleAudit.sha256Signature.length).toBe(64);
  expect(data.merkleAudit.leafCount).toBe(data.findings.length);
});

suite.test('M15.API.3: Rejects empty contract text with 400 status', async () => {
  const mockReq = {
    json: async () => ({
      contractText: '   ',
      contractType: 'custom'
    })
  };

  const res = await POST(mockReq);
  expect(res.status).toBe(400);
  const data = await res.json();
  expect(data.error).toContain('Contract text is required');
});

// ═══════════════════════════════════════════════════════════════════════════
// Tier 3: Custom Text Dynamic Heuristic Analysis
// ═══════════════════════════════════════════════════════════════════════════
suite.test('M15.HEURISTIC.1: Parses custom contract text and flags unilateral indemnification', async () => {
  const customText = `
    AGREEMENT FOR SERVICES:
    Customer shall indemnify, defend, and hold harmless Provider against any and all losses, claims, and liabilities.
    In no event shall Provider aggregate liability exceed $100.00.
    This Agreement shall automatically renew for successive 12-month terms unless written notice is received 90 days prior.
  `;

  const mockReq = {
    json: async () => ({
      contractText: customText,
      contractType: 'custom',
      companyName: 'Apex Space Logistics'
    })
  };

  const res = await POST(mockReq);
  expect(res.status).toBe(200);
  const data = await res.json();

  expect(data.overallRiskScore).toBeGreaterThanOrEqual(50);
  expect(data.findings.some((f) => f.clauseType.includes('Indemnification'))).toBe(true);
  expect(data.findings.some((f) => f.clauseType.includes('Liability'))).toBe(true);
  expect(data.findings.some((f) => f.clauseType.includes('Auto-Renewal'))).toBe(true);
});

// ═══════════════════════════════════════════════════════════════════════════
// Tier 4: Dashboard Integration & Preservation Verification
// ═══════════════════════════════════════════════════════════════════════════
suite.test('M15.INTEGRATION.1: ExecutiveDashboardClient integrates ContractRedlineStudio as primary view', () => {
  const clientPath = path.resolve(__dirname, '../src/app/dashboard/ExecutiveDashboardClient.tsx');
  const clientCode = fs.readFileSync(clientPath, 'utf-8');

  expect(clientCode).toContain("import { ContractRedlineStudio } from '@/components/legal/ContractRedlineStudio'");
  expect(clientCode).toContain("dashboardView, setDashboardView] = useState<'contract_redliner' | 'boardroom'>('contract_redliner')");
  expect(clientCode).toContain('<ContractRedlineStudio companyName={companyName} />');
  expect(clientCode).toContain('PRIMARY VIEW TOGGLE');
});

suite.test('M15.INTEGRATION.2: 10-Agent Boardroom and simulation models remain 100% preserved in secondary view', () => {
  const clientPath = path.resolve(__dirname, '../src/app/dashboard/ExecutiveDashboardClient.tsx');
  const clientCode = fs.readFileSync(clientPath, 'utf-8');

  expect(clientCode).toContain('10-Agent Boardroom');
  expect(clientCode).toContain('handleDeliberate');
  expect(clientCode).toContain('deliberationResult');
  expect(clientCode).toContain('Python SCM Model');
  expect(clientCode).toContain('Fiduciary Audit');
});

module.exports = suite;

if (require.main === module) {
  suite.run({ verbose: true }).then((res) => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
