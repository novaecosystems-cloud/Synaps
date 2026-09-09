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
// Tier 4: Negotiation Stance Selector (Feature B) Verification
// ═══════════════════════════════════════════════════════════════════════════
suite.test('M15.STANCE.1: Defaults to founder_protective stance with downside defense', async () => {
  const mockReq = {
    json: async () => ({
      contractType: 'vendor_saas',
      companyName: 'Apex Defense Tech'
    })
  };

  const res = await POST(mockReq);
  expect(res.status).toBe(200);
  const data = await res.json();

  expect(data.negotiationStance).toBe('founder_protective');
  expect(data.executiveSummary).toContain('[FOUNDER-PROTECTIVE STANCE]');
  const indemnity = data.findings.find((f) => f.clauseType.includes('Indemnification'));
  expect(indemnity.recommendedRedline.toLowerCase()).toContain('gross negligence');
});

suite.test('M15.STANCE.2: Supports balanced_commercial stance with bilateral standards', async () => {
  const mockReq = {
    json: async () => ({
      contractType: 'vendor_saas',
      stance: 'balanced_commercial',
      companyName: 'Apex Commercial AI'
    })
  };

  const res = await POST(mockReq);
  expect(res.status).toBe(200);
  const data = await res.json();

  expect(data.negotiationStance).toBe('balanced_commercial');
  expect(data.executiveSummary).toContain('[BALANCED COMMERCIAL STANCE]');
  const indemnity = data.findings.find((f) => f.clauseType.includes('Indemnification'));
  expect(indemnity.legalAnalysis).toContain('Balanced Commercial Stance');
  expect(indemnity.recommendedRedline).toContain('infringement of intellectual property rights');
});

suite.test('M15.STANCE.3: Supports enterprise_hardball stance with aggressive buyer leverage', async () => {
  const mockReq = {
    json: async () => ({
      contractType: 'vendor_saas',
      stance: 'enterprise_hardball',
      companyName: 'Apex Enterprise Global'
    })
  };

  const res = await POST(mockReq);
  expect(res.status).toBe(200);
  const data = await res.json();

  expect(data.negotiationStance).toBe('enterprise_hardball');
  expect(data.executiveSummary).toContain('[ENTERPRISE HARDBALL STANCE]');
  const indemnity = data.findings.find((f) => f.clauseType.includes('Indemnification'));
  expect(indemnity.legalAnalysis).toContain('Enterprise Hardball Stance');
  expect(indemnity.recommendedRedline).toContain('Customer shall have zero indemnification obligations');
});

suite.test('M15.STANCE.4: Dynamically adapts redlines across all 3 stances for the same agreement', async () => {
  const stances = ['founder_protective', 'balanced_commercial', 'enterprise_hardball'];
  const redlines = [];

  for (const s of stances) {
    const res = await POST({
      json: async () => ({ contractType: 'vendor_saas', stance: s })
    });
    const data = await res.json();
    const indemnity = data.findings.find((f) => f.clauseType.includes('Indemnification'));
    redlines.push(indemnity.recommendedRedline);
  }

  // Ensure all 3 redlines are distinct
  expect(redlines[0] !== redlines[1]).toBe(true);
  expect(redlines[1] !== redlines[2]).toBe(true);
  expect(redlines[0] !== redlines[2]).toBe(true);
});

// ═══════════════════════════════════════════════════════════════════════════
// Tier 5: Native Word (.docx) Track Changes Exporter (Feature A)
// ═══════════════════════════════════════════════════════════════════════════
suite.test('M15.DOCX.1: POST /api/legal/export-docx generates native Word (.docx) file with HTTP 200', async () => {
  const { POST: exportDocxPOST } = jiti(path.resolve(__dirname, '../src/app/api/legal/export-docx/route.ts'));

  const mockReq = {
    json: async () => ({
      contractTitle: 'Enterprise Cloud Infrastructure Master Services Agreement (MSA)',
      contractType: 'vendor_saas',
      negotiationStance: 'enterprise_hardball',
      overallRiskScore: 94,
      riskCategory: 'CRITICAL',
      executiveSummary: '[ENTERPRISE HARDBALL STANCE] REJECT / REDLINE REQUIRED.',
      delawareSafeHarborStatus: 'NON_COMPLIANT',
      findings: [
        {
          id: 'saas-01',
          clauseType: 'Uncapped One-Way Indemnification',
          riskLevel: 'CRITICAL',
          originalText: 'Customer shall fully defend, indemnify, and hold harmless Vendor...',
          legalAnalysis: 'Unilateral indemnification violates Delaware fiduciary duty of care.',
          recommendedRedline: 'Vendor shall fully defend and indemnify Customer...',
          industryBenchmark: 'Enterprise standards require mutual indemnification.'
        }
      ],
      merkleAudit: {
        merkleRoot: '0x9e4f2b8a7c1d3e5f608192a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
        leafCount: 1,
        auditTimestamp: new Date().toISOString(),
        sha256Signature: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      },
      companyName: 'Apex Space Logistics'
    })
  };

  const res = await exportDocxPOST(mockReq);
  expect(res.status).toBe(200);

  const contentType = res.headers.get('Content-Type');
  expect(contentType).toContain('application/vnd.openxmlformats-officedocument.wordprocessingml.document');

  const contentDisposition = res.headers.get('Content-Disposition');
  expect(contentDisposition).toContain('attachment');
  expect(contentDisposition).toContain('.docx');

  const buffer = await res.arrayBuffer();
  expect(buffer.byteLength).toBeGreaterThan(5000);
});

// ═══════════════════════════════════════════════════════════════════════════
// Tier 6: Dashboard Integration & Hidden Boardroom Verification
// ═══════════════════════════════════════════════════════════════════════════
suite.test('M15.INTEGRATION.1: ExecutiveDashboardClient integrates ContractRedlineStudio as primary view', () => {
  const clientPath = path.resolve(__dirname, '../src/app/dashboard/ExecutiveDashboardClient.tsx');
  const clientCode = fs.readFileSync(clientPath, 'utf-8');

  expect(clientCode).toContain("import { ContractRedlineStudio } from '@/components/legal/ContractRedlineStudio'");
  expect(clientCode).toContain("dashboardView, setDashboardView] = useState<'contract_redliner' | 'boardroom'>('contract_redliner')");
  expect(clientCode).toContain('<ContractRedlineStudio companyName={companyName} />');
  expect(clientCode).toContain('PRIMARY VIEW TOGGLE');
});

suite.test('M15.INTEGRATION.2: 10-Agent Boardroom remains 100% preserved in secondary view', () => {
  const clientPath = path.resolve(__dirname, '../src/app/dashboard/ExecutiveDashboardClient.tsx');
  const clientCode = fs.readFileSync(clientPath, 'utf-8');

  expect(clientCode).toContain('10-Agent Boardroom');
  expect(clientCode).toContain('handleDeliberate');
  expect(clientCode).toContain('deliberationResult');
  expect(clientCode).toContain('Python SCM Model');
  expect(clientCode).toContain('Fiduciary Audit');
});

suite.test('M15.INTEGRATION.3: Preserves 10-Agent Boardroom access via discreet Advanced Simulation Vault link', () => {
  const clientPath = path.resolve(__dirname, '../src/app/dashboard/ExecutiveDashboardClient.tsx');
  const clientCode = fs.readFileSync(clientPath, 'utf-8');

  expect(clientCode).toContain('Advanced Simulation Vault');
  expect(clientCode).toContain('Autonomous Contract Redliner');
});

suite.test('M15.STUDIO.1: ContractRedlineStudio integrates Stance Selector, Docx export & 1-Page Scorecard', () => {
  const studioPath = path.resolve(__dirname, '../src/components/legal/ContractRedlineStudio.tsx');
  const studioCode = fs.readFileSync(studioPath, 'utf-8');

  expect(studioCode).toContain('founder_protective');
  expect(studioCode).toContain('balanced_commercial');
  expect(studioCode).toContain('enterprise_hardball');
  expect(studioCode).toContain('handleDownloadDocx');
  expect(studioCode).toContain('Download Redlined Word Doc (.docx)');
  expect(studioCode).toContain('1-Page Fiduciary Scorecard');
  expect(studioCode).toContain('fiduciary-printable-scorecard');
});

module.exports = suite;

if (require.main === module) {
  suite.run({ verbose: true }).then((res) => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
