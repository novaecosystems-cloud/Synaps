/**
 * Master Automated Test Runner for Causarix Desktop Application
 * Executes all test tiers (Tier 1 to Tier 5), aggregates results, prints summary report,
 * and exits with code 0 on complete pass or code 1 on failure.
 *
 * Usage:
 *   node tests/run-all-tests.js
 *   node tests/run-all-tests.js --bail
 *   node tests/run-all-tests.js --tier=3,4
 *   node tests/e2e-runner.js
 */

const { colors } = require('./test-harness');

const tier1Suite = require('./tier1-features.test');
const tier2Suite = require('./tier2-boundary.test');
const tier3Suite = require('./tier3-cross-feature.test');
const tier4Suite = require('./tier4-scenarios.test');
const tier5Suite = require('./tier5-adversarial-integrity.test');

const m1Suite = require('./m1-boardroom-zod.test');
const m1RepairSuite = require('./m1-challenger-repair.test');
const m1StreamSuite = require('./m1-challenger-stream.test');
const m2RlsSuite = require('./m2-multitenant-rls.test');
const m2TenantSuite = require('./m2-challenger-tenant.test');
const m2MerkleSuite = require('./m2-challenger-merkle.test');
const m3Suite = require('./m3-pdf-firewall-scm.test');
const m4Suite = require('./m4-global-dataset-train.test');
const m5Suite = require('./m5-triad-models.test');

function parseArgs(args = []) {
  const options = {
    bail: false,
    verbose: true,
    tiers: null,
  };

  for (const arg of args) {
    if (arg === '--bail' || arg === '-b') {
      options.bail = true;
    } else if (arg === '--quiet' || arg === '-q') {
      options.verbose = false;
    } else if (arg.startsWith('--tier=')) {
      const val = arg.split('=')[1];
      options.tiers = val.split(',').map((t) => parseInt(t.trim(), 10)).filter(Boolean);
    }
  }

  return options;
}

async function main(cliArgs = process.argv.slice(2)) {
  const options = parseArgs(cliArgs);
  const overallStart = Date.now();

  console.log(`\n${colors.cyan}${colors.bright}======================================================================`);
  console.log(`🧪 CAUSARIX ENTERPRISE COMPREHENSIVE TEST SUITE (TIERS 1-5 + M1-M5)`);
  console.log(`======================================================================${colors.reset}\n`);

  const allSuites = [
    { tier: 1, name: 'Tier 1: Feature Verification', suite: tier1Suite, targetCount: 60 },
    { tier: 2, name: 'Tier 2: Boundary & Corner Cases', suite: tier2Suite, targetCount: 60 },
    { tier: 3, name: 'Tier 3: Cross-Feature Interactions', suite: tier3Suite, targetCount: 12 },
    { tier: 4, name: 'Tier 4: Real-World Scenarios', suite: tier4Suite, targetCount: 5 },
    { tier: 5, name: 'Tier 5: Adversarial & Forensic Integrity', suite: tier5Suite, targetCount: 5 },
    { tier: 6, name: 'Milestone 1: Zod Schemas & Boardroom', suite: m1Suite, targetCount: 30 },
    { tier: 7, name: 'Milestone 1: JSON Repair & Fuzzing', suite: m1RepairSuite, targetCount: 42 },
    { tier: 8, name: 'Milestone 1: SSE Streaming & Reconnect', suite: m1StreamSuite, targetCount: 35 },
    { tier: 9, name: 'Milestone 2: PostgreSQL Multi-Tenant RLS', suite: m2RlsSuite, targetCount: 20 },
    { tier: 10, name: 'Milestone 2: Adversarial Tenant Isolation', suite: m2TenantSuite, targetCount: 30 },
    { tier: 11, name: 'Milestone 2: DGCL 141 Merkle Proof Integrity', suite: m2MerkleSuite, targetCount: 53 },
    { tier: 12, name: 'Milestone 3: Layout PDF, AI-WAF & SCM', suite: m3Suite, targetCount: 31 },
    { tier: 13, name: 'Milestone 4: Global Datasets & Training', suite: m4Suite, targetCount: 7 },
    { tier: 14, name: 'Milestone 5: Triad Models On-Disk', suite: m5Suite, targetCount: 7 },
  ];

  const suitesToRun = options.tiers
    ? allSuites.filter((s) => options.tiers.includes(s.tier))
    : allSuites;

  const summary = [];
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  for (const item of suitesToRun) {
    const res = await item.suite.run({ verbose: options.verbose, bail: options.bail });
    totalTests += res.total;
    totalPassed += res.passed;
    totalFailed += res.failed;
    totalSkipped += res.skipped;

    summary.push({
      name: item.name,
      total: res.total,
      passed: res.passed,
      failed: res.failed,
      durationMs: res.durationMs,
      status: res.failed === 0 ? 'PASS' : 'FAIL',
    });

    if (options.bail && res.failed > 0) {
      break;
    }
  }

  const overallDuration = Date.now() - overallStart;

  // ─── SUMMARY TABLE REPORT ──────────────────────────────────────────────────
  console.log(`\n${colors.bright}======================================================================`);
  console.log(`📊 TEST EXECUTION SUMMARY REPORT`);
  console.log(`======================================================================${colors.reset}`);
  console.log(
    `${'Suite / Tier'.padEnd(45)} | ${'Total'.padStart(6)} | ${'Pass'.padStart(6)} | ${'Fail'.padStart(6)} | ${'Time'.padStart(8)} | Status`
  );
  console.log('─'.repeat(85));

  for (const s of summary) {
    const statusStr = s.status === 'PASS'
      ? `${colors.green}${colors.bright}PASS${colors.reset}`
      : `${colors.red}${colors.bright}FAIL${colors.reset}`;
    console.log(
      `${s.name.padEnd(45)} | ${String(s.total).padStart(6)} | ${String(s.passed).padStart(6)} | ${String(s.failed).padStart(6)} | ${(s.durationMs + 'ms').padStart(8)} | ${statusStr}`
    );
  }

  console.log('─'.repeat(85));
  console.log(
    `${'GRAND TOTAL'.padEnd(45)} | ${String(totalTests).padStart(6)} | ${String(totalPassed).padStart(6)} | ${String(totalFailed).padStart(6)} | ${(overallDuration + 'ms').padStart(8)} | ${
      totalFailed === 0 ? colors.green + colors.bright + 'ALL PASS' + colors.reset : colors.red + colors.bright + 'FAILED' + colors.reset
    }`
  );
  console.log(`======================================================================\n`);

  const exitCode = totalFailed > 0 ? 1 : 0;

  if (totalFailed > 0) {
    console.log(`${colors.bgRed}${colors.bright} ✖ TEST RUN FAILED: ${totalFailed} test(s) failed. ${colors.reset}\n`);
  } else {
    console.log(`${colors.bgGreen}${colors.bright} ✔ ALL ${totalTests} TESTS PASSED PERFECTLY (Tiers 1-5). ${colors.reset}\n`);
  }

  if (require.main === module) {
    process.exit(exitCode);
  }

  return exitCode;
}

if (require.main === module) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(`\n${colors.red}Fatal test runner error: ${err.message}${colors.reset}\n`, err.stack);
    process.exit(1);
  });
}

module.exports = { main };
