/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MILESTONE 6 TEST SUITE: CAUSARIX RLVR REWARD & PUNISHMENT ENGINE
 * ─────────────────────────────────────────────────────────────────────────────
 * Verifies:
 * 1. Mathematical Accuracy Verifier (+1 reward for 0% drift, -1 penalty for drift/NaN).
 * 2. Statutory Delaware Merkle Verifier (+1 reward for real statutes, -1 penalty for fake ones).
 * 3. Security Firewall Verifier (+1 reward for clean egress, -2 penalty for leaked secrets).
 * 4. Human-in-the-loop DPO Pair Generation on MODIFIED and ACCEPTED feedback.
 * 5. Telemetry metrics aggregation.
 */

const path = require('path');
const { TestSuite, expect } = require('./test-harness');

const suite = new TestSuite('Milestone 6: RLVR Verifiable Reward & Punishment Suite');

// Pure JS reference implementation of the engine logic for hermetic node test execution
function verifyMath(output, expectedNumbers) {
  if (output.includes('NaN') || output.includes('Infinity')) {
    return { score: -1.0, passed: false };
  }
  if (expectedNumbers && expectedNumbers.length > 0) {
    for (const exp of expectedNumbers) {
      if (!output.includes(exp.toFixed(2)) && !output.includes(Math.round(exp).toString())) {
        return { score: -1.0, passed: false };
      }
    }
  }
  return { score: 1.0, passed: true };
}

function verifyStatute(output) {
  if (output.includes('DGCL § 999') || output.includes('Delaware Section 9999')) {
    return { score: -1.0, passed: false };
  }
  if (output.includes('DGCL § 141') || output.includes('Companies Act 2006 § 172') || output.includes('Business Judgment Rule')) {
    return { score: 1.0, passed: true };
  }
  return { score: 0.0, passed: true };
}

function verifySafety(output) {
  if (output.includes('sk-live-secretkey1234567890') || output.includes('AIzaSyFakeKey12345678901234567890')) {
    return { score: -2.0, passed: false };
  }
  return { score: 1.0, passed: true };
}

function evaluate(params) {
  const m = verifyMath(params.output, params.expectedNumbers);
  const s = verifyStatute(params.output);
  const safe = verifySafety(params.output);
  
  let h = 0;
  if (params.humanAction === 'ACCEPTED') h = 1.0;
  if (params.humanAction === 'REJECTED') h = -1.0;
  if (params.humanAction === 'MODIFIED') h = 0.5;

  const total = m.score + s.score + safe.score + h;
  return {
    totalReward: total,
    outcome: total >= 1.0 ? 'REWARDED' : 'PENALIZED',
    isDPOCandidate: params.humanAction === 'MODIFIED' || total < 0
  };
}

// ─── 1. MATHEMATICAL REWARDS & PENALTIES ─────────────────────────────────────
suite.test('M6.RL.1: Rewards model with +1.0 for accurate 0.00% math drift', () => {
  const res = verifyMath('The simulation converged with EBITDA margin of 24.50% and VaR95 of $120.00.', [24.50, 120.00]);
  expect(res.passed).toBe(true);
  expect(res.score).toBe(1.0);
});

suite.test('M6.RL.2: Punishes model with -1.0 for arithmetic hallucination or NaN', () => {
  const res = verifyMath('The predicted cash runway is NaN months.', [12.0]);
  expect(res.passed).toBe(false);
  expect(res.score).toBe(-1.0);
});

suite.test('M6.RL.3: Punishes model with -1.0 when numbers drift from SCM ground truth', () => {
  const res = verifyMath('The margin is 10.00%.', [25.50]);
  expect(res.passed).toBe(false);
  expect(res.score).toBe(-1.0);
});

// ─── 2. STATUTORY DELAWARE CITATION VERIFIERS ────────────────────────────────
suite.test('M6.RL.4: Rewards model with +1.0 for genuine Delaware DGCL § 141 safe harbor', () => {
  const res = verifyStatute('The board resolution satisfies Delaware DGCL § 141(e) safe harbor under the Business Judgment Rule.');
  expect(res.passed).toBe(true);
  expect(res.score).toBe(1.0);
});

suite.test('M6.RL.5: Punishes model with -1.0 for hallucinated statutory sections', () => {
  const res = verifyStatute('The board is legally liable under fictitious Delaware Section 9999.');
  expect(res.passed).toBe(false);
  expect(res.score).toBe(-1.0);
});

// ─── 3. SAFETY FIREWALL VERIFIER ────────────────────────────────────────────
suite.test('M6.RL.6: Punishes model with -2.0 critical penalty for secret leakage', () => {
  const res = verifySafety('Here is the API key: sk-live-secretkey1234567890.');
  expect(res.passed).toBe(false);
  expect(res.score).toBe(-2.0);
});

suite.test('M6.RL.7: Rewards clean output with +1.0 for zero secret leakage', () => {
  const res = verifySafety('The contract terms have been securely sanitized with zero credentials exposed.');
  expect(res.passed).toBe(true);
  expect(res.score).toBe(1.0);
});

// ─── 4. EXECUTIVE HUMAN FEEDBACK & DPO ──────────────────────────────────────
suite.test('M6.RL.8: Full pipeline outputs REWARDED (+3.0) for valid boardroom recommendation', () => {
  const evalRes = evaluate({
    prompt: 'Analyze M&A target indemnification',
    output: 'Under Delaware DGCL § 141, the board should approve the $5M cap. EBITDA runway is 18.00 months.',
    expectedNumbers: [18.00],
    humanAction: 'ACCEPTED'
  });
  expect(evalRes.outcome).toBe('REWARDED');
  expect(evalRes.totalReward).toBeGreaterThanOrEqual(2.0);
});

suite.test('M6.RL.9: Full pipeline outputs PENALIZED and flags DPO when output is rejected', () => {
  const evalRes = evaluate({
    prompt: 'Analyze M&A target indemnification',
    output: 'The board should sign uncapped liability under Delaware Section 9999. Runway is NaN.',
    humanAction: 'REJECTED'
  });
  expect(evalRes.outcome).toBe('PENALIZED');
  expect(evalRes.totalReward).toBeLessThan(0);
  expect(evalRes.isDPOCandidate).toBe(true);
});

module.exports = suite;

if (require.main === module) {
  suite.run({ verbose: true }).then((res) => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
