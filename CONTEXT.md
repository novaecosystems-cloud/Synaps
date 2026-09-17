# Project Context: Synaps (Arbitrum Open House Singapore Buildathon)

## 1. Hackathon Objective & Scope
- **Event**: Arbitrum Open House Singapore Online Buildathon (Hosted by Arbitrum Foundation & HackQuest)
- **Timeline**: Submissions open until October 4, 2026 | Winners: October 12, 2026 | In-Person Founder House: October 23–25, 2026
- **Total Prize Pool**: $115,000+ USDC (Overall: $70k + Singapore Founder House invite; Promising Products: $15k; Milestone Grants: $30k; Stylus / Robinhood Chain reserved incentives).
- **Core Requirement**: Mandatory live deployment on an Arbitrum network (Arbitrum One, Arbitrum Sepolia, or Arbitrum Orbit/Stylus).

---

## 2. Strategic Pivot: From Web2 Enterprise OS to Arbitrum DAO Risk & Fiduciary Oracle
- **Existing Base (`D:\Synaps`)**: 10-Agent Boardroom deliberation engine, 0.00% math drift SCM simulation kernel (Pearl do-calculus, Box-Muller Gaussian sampling), layout-aware PDF parser, and pure JS Delaware DGCL § 141 Merkle tree verification.
- **The Core Problem in Web3**: Arbitrum DAO and DeFi treasuries manage billions in assets. Delegates vote on multi-million dollar AIPs based on hype and forum threads with zero quantitative stress-testing, exposing delegates to personal fiduciary liability under corporate law.
- **The Solution (Synaps)**: An autonomous AI risk council + 0.00% math drift Monte Carlo SCM kernel that stress-tests governance proposals, computes insolvency/liquidation ruin probabilities, and anchors cryptographic Delaware DGCL § 141 proof of due diligence directly on Arbitrum (Solidity + Stylus WASM).

---

## 3. Scope Pruning: What We Cut vs. What We Keep

### Features to Cut (Removed to eliminate Web2 bloat and maximize hackathon judging score)
- ❌ **Vexa Meeting Scribe Bot (Zoom/Google Meet)**: Irrelevant to Web3 judges, adds audio transcription failure points.
- ❌ **Jira, Slack, & WhatsApp Mesh**: Dilutes focus away from on-chain governance and Web3 native workflows.
- ❌ **Air-Gapped Desktop Shell (`Causarix.exe`)**: Judges want a 1-click browser dApp with MetaMask/Rabby.
- ❌ **3D Spatial Memory Palace (Three.js Graph)**: High GPU overhead and visual distraction from quantitative risk proofs.
- ❌ **Global statutory compliance sprawl (DPDP India, UK Act)**: Replaced with tight focus on Delaware DGCL § 141 Safe-Harbor and DAO fiduciary protection.

### Features to Keep & Double Down On
- ✅ **Lean 3-Agent Risk Council**: Fast, adversarial debate between CFO (Capital), General Counsel (Legal/Fiduciary), and Protocol Security Auditor (Exploit/Liquidation).
- ✅ **0.00% Math Drift SCM Monte Carlo Engine**: 10,000-iteration stress-test calculating Value-at-Risk (VaR95/CVaR95) and ruin probability for treasury allocations.
- ✅ **Arbitrum Smart Contract Settlement (`FiduciaryRegistry.sol` + Stylus Rust)**: Hashes deliberation and SCM parameters into a Merkle root, emits on-chain proof of due diligence, and records live on Arbiscan.
- ✅ **Web3 Wallet Connection (RainbowKit / Wagmi / Viem)**: Instant delegate authentication.
- ✅ **Arbitrum DAO AIP Quick-Selector**: One-click demo loading real Arbitrum DAO proposals (e.g. AIP-1, Gaming Catalyst Program).

---

## 4. Architectural Target
1. **Contracts**:
   - `contracts/ArbitrumFiduciaryRegistry.sol` (Arbitrum Sepolia): Registry for proposal hashes, Merkle roots, risk scores, and IPFS report hashes.
   - `stylus/src/lib.rs` (Arbitrum Stylus in Rust): High-performance on-chain Merkle proof and SCM variance verifier in WASM.
2. **Frontend (`src/app/`)**:
   - Simplified `/dashboard/governance` or `/` landing page with Web3 wallet connection, proposal selector, live agent deliberation stream, SCM ruin chart, and "Seal to Arbitrum" transaction trigger.
3. **Evidence & Verification**:
   - Live Arbiscan transaction badge linking to testnet explorer.
