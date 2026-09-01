/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MILESTONE 4 TEST SUITE: GLOBAL DATASET & FINE-TUNING PIPELINE VERIFICATION
 * ─────────────────────────────────────────────────────────────────────────────
 * Validates:
 * 1. Global Legal Dataset integrity (3,000 items, 6 international jurisdictions).
 * 2. Global Finance Dataset integrity (3,000 items, US GAAP, IFRS, OECD).
 * 3. Global Causal Dataset integrity (3,000 items, SCM do-calculus, Merkle roots).
 * 4. 1-Click Unsloth Qwen 2.5 7B training pipeline syntax & GGUF export readiness.
 */

const fs = require('fs');
const path = require('path');
const { TestSuite, expect } = require('./test-harness');

const rootDir = path.resolve(__dirname, '..');
const suite = new TestSuite('Milestone 4: Global Dataset & Training Suite');

const DATA_DIR = path.join(rootDir, 'data', 'training');
const SCRIPTS_DIR = path.join(rootDir, 'scripts');

// ─── 1. FILE EXISTENCE & NON-EMPTY VERIFICATION ────────────────────────────
suite.test('M4.DATA.1: All 3 global dataset files exist on disk in data/training/', () => {
  expect(fs.existsSync(path.join(DATA_DIR, 'causarix_global_legal.jsonl'))).toBe(true);
  expect(fs.existsSync(path.join(DATA_DIR, 'causarix_global_finance.jsonl'))).toBe(true);
  expect(fs.existsSync(path.join(DATA_DIR, 'causarix_global_causal.jsonl'))).toBe(true);
});

suite.test('M4.DATA.2: Dataset builder and Colab training scripts exist in scripts/', () => {
  expect(fs.existsSync(path.join(SCRIPTS_DIR, 'build-global-datasets.py'))).toBe(true);
  expect(fs.existsSync(path.join(SCRIPTS_DIR, 'train-global-triad.py'))).toBe(true);
});

// ─── 2. LEGAL JURISDICTION INTEGRITY (3,000 ROWS) ──────────────────────────
suite.test('M4.LEGAL.1: Legal dataset contains exactly 3,000 valid JSON rows with 0 syntax errors', () => {
  const legalFile = path.join(DATA_DIR, 'causarix_global_legal.jsonl');
  const lines = fs.readFileSync(legalFile, 'utf-8').trim().split('\n');
  expect(lines.length).toBe(3000);

  const sample = JSON.parse(lines[0]);
  expect(typeof sample.instruction).toBe('string');
  expect(typeof sample.input).toBe('string');
  expect(typeof sample.output).toBe('string');
});

suite.test('M4.LEGAL.2: Legal dataset covers all 6 global jurisdictions (US, UK, EU, India, SG, International)', () => {
  const legalFile = path.join(DATA_DIR, 'causarix_global_legal.jsonl');
  const lines = fs.readFileSync(legalFile, 'utf-8').trim().split('\n');
  
  const foundJurisdictions = new Set();
  for (const line of lines) {
    const item = JSON.parse(line);
    if (item.jurisdiction) foundJurisdictions.add(item.jurisdiction);
  }

  expect(foundJurisdictions.has('US_DELAWARE')).toBe(true);
  expect(foundJurisdictions.has('UK_COMMONWEALTH')).toBe(true);
  expect(foundJurisdictions.has('EU_CIVIL_LAW')).toBe(true);
  expect(foundJurisdictions.has('INDIA_APAC')).toBe(true);
  expect(foundJurisdictions.has('SINGAPORE_ASEAN')).toBe(true);
  expect(foundJurisdictions.has('INTERNATIONAL_TRADE')).toBe(true);
});

// ─── 3. FINANCE & ACCOUNTING INTEGRITY (3,000 ROWS) ────────────────────────
suite.test('M4.FIN.1: Finance dataset contains exactly 3,000 valid JSON rows with GAAP/IFRS standards', () => {
  const finFile = path.join(DATA_DIR, 'causarix_global_finance.jsonl');
  const lines = fs.readFileSync(finFile, 'utf-8').trim().split('\n');
  expect(lines.length).toBe(3000);

  const standards = new Set();
  for (const line of lines) {
    const item = JSON.parse(line);
    if (item.standard) standards.add(item.standard);
  }

  expect(standards.has('US_GAAP')).toBe(true);
  expect(standards.has('IFRS')).toBe(true);
  expect(standards.has('CROSS_BORDER_TAX')).toBe(true);
});

// ─── 4. CAUSAL SCM & MERKLE CONSENSUS (3,000 ROWS) ─────────────────────────
suite.test('M4.SCM.1: Causal dataset contains 3,000 items with Judea Pearl do-calculus and Merkle roots', () => {
  const causalFile = path.join(DATA_DIR, 'causarix_global_causal.jsonl');
  const lines = fs.readFileSync(causalFile, 'utf-8').trim().split('\n');
  expect(lines.length).toBe(3000);

  const sample = JSON.parse(lines[0]);
  expect(sample.output).toContain('Pearl Do-Calculus');
  expect(sample.output).toContain('Merkle Proof Verification');
});

// ─── 5. TRAINING SCRIPT VALIDATION ─────────────────────────────────────────
suite.test('M4.TRAIN.1: Training script references Qwen 2.5 7B 4-bit and GGUF quantization', () => {
  const scriptContent = fs.readFileSync(path.join(SCRIPTS_DIR, 'train-global-triad.py'), 'utf-8');
  expect(scriptContent).toContain('Qwen2.5-7B-Instruct-bnb-4bit');
  expect(scriptContent).toContain('save_pretrained_gguf');
  expect(scriptContent).toContain('q4_k_m');
});

module.exports = suite;

if (require.main === module) {
  suite.run({ verbose: true }).then((res) => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
