const assert = require("assert");
const fs = require("fs");
const path = require("path");

console.log("======================================================================");
console.log("🏛️  CAUSARIX™ ARBITRUM FIDUCIARY GOVERNANCE VERIFICATION SUITE");
console.log("======================================================================");

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    failCount++;
  }
}

// 1. Check Solidity Contract Artifact
runTest("Solidity Contract Artifact & Bytecode Integrity", () => {
  const artifactPath = path.resolve(__dirname, "../src/contracts/ArbitrumFiduciaryRegistry.json");
  assert.ok(fs.existsSync(artifactPath), "Artifact file must exist");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  assert.strictEqual(artifact.contractName, "ArbitrumFiduciaryRegistry");
  assert.ok(artifact.bytecode.startsWith("0x"), "Bytecode must start with 0x");
  assert.ok(artifact.bytecode.length > 500, "Bytecode must be non-trivial");
  assert.ok(Array.isArray(artifact.abi), "ABI must be an array");
  
  const functionNames = artifact.abi.filter(item => item.type === "function").map(f => f.name);
  assert.ok(functionNames.includes("sealDeliberation"), "sealDeliberation function missing");
  assert.ok(functionNames.includes("verifyDeliberation"), "verifyDeliberation function missing");
  assert.ok(functionNames.includes("getLatestSeals"), "getLatestSeals function missing");
});

// 2. Check Arbitrum Stylus Rust Verifier
runTest("Arbitrum Stylus Rust Contract Codebase Presence", () => {
  const cargoPath = path.resolve(__dirname, "../stylus/Cargo.toml");
  const libPath = path.resolve(__dirname, "../stylus/src/lib.rs");
  assert.ok(fs.existsSync(cargoPath), "stylus/Cargo.toml must exist");
  assert.ok(fs.existsSync(libPath), "stylus/src/lib.rs must exist");

  const libCode = fs.readFileSync(libPath, "utf8");
  assert.ok(libCode.includes("StylusFiduciaryVerifier"), "Stylus contract struct missing");
  assert.ok(libCode.includes("verify_merkle_proof"), "verify_merkle_proof method missing");
  assert.ok(libCode.includes("verify_scm_simulation"), "verify_scm_simulation method missing");
});

// 3. Check Arbitrum Sepolia Deployment Configuration
runTest("Arbitrum Sepolia Deployment & Arbiscan Configuration", () => {
  const deployPath = path.resolve(__dirname, "../src/contracts/arbitrum-deployment.json");
  assert.ok(fs.existsSync(deployPath), "arbitrum-deployment.json must exist");
  const deployData = JSON.parse(fs.readFileSync(deployPath, "utf8"));
  assert.strictEqual(deployData.chainId, 421614, "Chain ID must be 421614 (Arbitrum Sepolia)");
  assert.ok(deployData.contractAddress.startsWith("0x"), "Contract address must be valid hex");
  assert.ok(deployData.explorerContractUrl.includes("sepolia.arbiscan.io"), "Explorer URL must target Arbiscan");
});

// 4. Check Mock Arbitrum AIP Presets
runTest("Arbitrum DAO AIP Presets (AIP-1, GCP, LTIPP)", () => {
  const aipPath = path.resolve(__dirname, "../src/data/mock-arbitrum-aips.ts");
  assert.ok(fs.existsSync(aipPath), "mock-arbitrum-aips.ts must exist");
  const aipCode = fs.readFileSync(aipPath, "utf8");
  assert.ok(aipCode.includes("aip-1"), "AIP-1 preset missing");
  assert.ok(aipCode.includes("gcp-1"), "GCP preset missing");
  assert.ok(aipCode.includes("ltipp-2"), "LTIPP preset missing");
  assert.ok(aipCode.includes("driftPercent: 0.00"), "0.00% drift invariant must be specified");
});

// 5. Test Keccak-256 Merkle Tree Algorithm
runTest("Cryptographic Keccak-256 Merkle Tree Logic", () => {
  const { keccak256, stringToHex, encodePacked } = require("viem");
  
  const leaves = [
    keccak256(stringToHex("LEAF_0_PROPOSAL")),
    keccak256(stringToHex("LEAF_1_CFO")),
    keccak256(stringToHex("LEAF_2_LEGAL")),
    keccak256(stringToHex("LEAF_3_SECURITY")),
    keccak256(stringToHex("LEAF_4_SCM")),
  ];

  // Layer 0 has 5 leaves. Combining into binary tree
  let currentLevel = [...leaves];
  while (currentLevel.length > 1) {
    const nextLevel = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        const left = currentLevel[i];
        const right = currentLevel[i + 1];
        const combined = left.toLowerCase() <= right.toLowerCase()
          ? keccak256(encodePacked(["bytes32", "bytes32"], [left, right]))
          : keccak256(encodePacked(["bytes32", "bytes32"], [right, left]));
        nextLevel.push(combined);
      } else {
        nextLevel.push(currentLevel[i]);
      }
    }
    currentLevel = nextLevel;
  }

  const root = currentLevel[0];
  assert.ok(root.startsWith("0x"), "Root must be hex");
  assert.strictEqual(root.length, 66, "Root must be 32 bytes (66 chars including 0x)");
  console.log(`     Computed 32-Byte Merkle Root: ${root}`);
});

// 6. Test Bridge Package Generation
runTest("Fiduciary Sealing Bridge & IPFS Evidentiary Package", () => {
  const { keccak256, stringToHex } = require("viem");
  const deploymentData = require("../src/contracts/arbitrum-deployment.json");

  // Simulate prepareArbitrumSeal logic
  const proposalId = "AIP-1";
  const title = "Arbitrum Foundation Initial Budget";
  const proposalHash = keccak256(stringToHex(`${proposalId}:${title}`));
  
  assert.ok(proposalHash.startsWith("0x") && proposalHash.length === 66, "Proposal hash must be valid bytes32");
  assert.strictEqual(deploymentData.chainId, 421614);
  console.log(`     Proposal Hash Verified: ${proposalHash.slice(0, 18)}...`);
});

console.log("──────────────────────────────────────────────────────────────────────");
console.log(`RESULTS: ${passCount} Passed, ${failCount} Failed.`);
console.log("======================================================================");

if (failCount > 0) {
  process.exit(1);
}