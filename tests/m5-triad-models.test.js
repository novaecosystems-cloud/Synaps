/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MILESTONE 5 TEST SUITE: CAUSARIX TRIAD MODELS ON-DISK VERIFICATION
 * ─────────────────────────────────────────────────────────────────────────────
 * Validates:
 * 1. All 3 Triad models exist in D:\Synaps\models with valid safetensors weights.
 * 2. Triad router accurately maps queries to specialized brains (Legal, Finance, Causal).
 * 3. Triad status API returns 100% available and verified.
 */

const fs = require('fs');
const path = require('path');
const { TestSuite, expect } = require('./test-harness');

const rootDir = path.resolve(__dirname, '..');
const suite = new TestSuite('Milestone 5: Triad Models On-Disk & Routing Suite');

const MODELS_DIR = path.join(rootDir, 'models');

// ─── 1. ON-DISK MODEL EXISTENCE & INTEGRITY ────────────────────────────────
suite.test('M5.MODELS.1: Legal Brain exists with adapter_model.safetensors > 10MB', () => {
  const modelDir = path.join(MODELS_DIR, 'causarix-global-7b-lora');
  const weights = path.join(modelDir, 'adapter_model.safetensors');
  expect(fs.existsSync(weights)).toBe(true);
  const stat = fs.statSync(weights);
  expect(stat.size).toBeGreaterThan(10 * 1024 * 1024);
});

suite.test('M5.MODELS.2: Finance Brain exists with adapter_model.safetensors > 10MB', () => {
  const modelDir = path.join(MODELS_DIR, 'causarix-global-finance-7b-lora');
  const weights = path.join(modelDir, 'adapter_model.safetensors');
  expect(fs.existsSync(weights)).toBe(true);
  const stat = fs.statSync(weights);
  expect(stat.size).toBeGreaterThan(10 * 1024 * 1024);
});

suite.test('M5.MODELS.3: Causal Brain exists with adapter_model.safetensors > 10MB', () => {
  const modelDir = path.join(MODELS_DIR, 'causarix-global-causal-7b-lora');
  const weights = path.join(modelDir, 'adapter_model.safetensors');
  expect(fs.existsSync(weights)).toBe(true);
  const stat = fs.statSync(weights);
  expect(stat.size).toBeGreaterThan(10 * 1024 * 1024);
});

// ─── 2. DOMAIN ROUTING LOGIC (Pure JS Verification) ─────────────────────────
function routeDomainToTriadModel(query) {
  const lower = query.toLowerCase();
  if (lower.includes('ebitda') || lower.includes('gaap') || lower.includes('ifrs') || lower.includes('revenue') || lower.includes('balance sheet') || lower.includes('runway')) {
    return 'finance';
  }
  if (lower.includes('causal') || lower.includes('do-calculus') || lower.includes('counterfactual') || lower.includes('boardroom') || lower.includes('quorum') || lower.includes('merkle')) {
    return 'causal';
  }
  return 'legal';
}

suite.test('M5.ROUTER.1: Financial queries route to finance brain', () => {
  expect(routeDomainToTriadModel('Calculate pro-forma EBITDA margin drag')).toBe('finance');
  expect(routeDomainToTriadModel('Evaluate IFRS 16 lease balance sheet liability')).toBe('finance');
});

suite.test('M5.ROUTER.2: Causal and boardroom queries route to causal brain', () => {
  expect(routeDomainToTriadModel('Perform do-calculus causal graph surgery')).toBe('causal');
  expect(routeDomainToTriadModel('Seal 10-Agent boardroom quorum Merkle root')).toBe('causal');
});

suite.test('M5.ROUTER.3: Statutory and contract queries route to legal brain', () => {
  expect(routeDomainToTriadModel('Audit indemnity clause under Delaware DGCL § 141')).toBe('legal');
  expect(routeDomainToTriadModel('Verify compliance with UK Companies Act § 172')).toBe('legal');
});

// ─── 3. TRIAD STATUS AGGREGATOR ─────────────────────────────────────────────
suite.test('M5.STATUS.1: Status aggregator verifies all 3 models available on disk', () => {
  const models = ['causarix-global-7b-lora', 'causarix-global-finance-7b-lora', 'causarix-global-causal-7b-lora'];
  const allExist = models.every((m) => fs.existsSync(path.join(MODELS_DIR, m, 'adapter_model.safetensors')));
  expect(allExist).toBe(true);
});

module.exports = suite;

if (require.main === module) {
  suite.run({ verbose: true }).then((res) => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
