# CAUSARIX™ (formerly Synaps) — Comprehensive Project State & Context Handoff
Last Updated: 2026-09-05
Repository: https://github.com/novaecosystems-cloud/Synaps.git (Branch: main, Commit: d857510)
Production Live URL: https://causarix.vercel.app
Desktop Binary: D:\Synaps\Causarix.exe & Launch-Causarix.bat

## 1. Executive Status & Test Metrics
- Automated Tests: **442 / 442 PASSING** across 19 test suites (Tiers 1-5 + Milestones 1-10). Command: `node tests/run-all-tests.js`
- Security & AI-WAF Probes: **145 / 145 PASSING** with 100.00% pass rate (`npx tsx tests/security-adversarial.ts`).
- Challenger Invariant Stress: **26 / 26 PASSING** with 100% precision (`node tests/adversarial-stress.test.js`).
- TypeScript Compilation: **0 errors** (`npx tsc --noEmit`).
- Subagents: 0 running (clean state).
- Desktop: Packaged standalone Windows executable (180MB) verified at `D:\Synaps\Causarix.exe` and `dist\Causarix-win32-x64\Causarix.exe`.

## 2. Model & Reasoning Architecture
- **Triad Models on Disk** (`D:\Synaps\models\`):
  * `causarix-global-7b-lora` (Legal Brain, Qwen 2.5 7B LoRA, HF: Causarix/causarix-global-7b-lora)
  * `causarix-global-finance-7b-lora` (Finance Brain, US GAAP ASC 606/842 & IFRS 15/16)
  * `causarix-global-causal-7b-lora` (Causal SCM & Boardroom Quorum Brain)
- **Model Routing**: `src/lib/triad-models.ts` & `/api/models/triad/status`.
- **OmniRoute AI Gateway**: `src/lib/llm-router.ts` & `/api/settings/omniroute`
  * Prioritizes free gateway pool (1.51B tokens across 42 provider pools: Groq, Gemini, OpenRouter, Mistral).
  * High-speed text and chat completion routing.
- **RLVR Verifiable Reward Engine**: `src/lib/rlvr-reward-engine.ts` & `/api/rl/reward`
  * Deterministic verifiers (+1.0 math drift 0.00%, +1.0 Delaware DGCL § 141, -2.0 secret leak).
  * Auto-generates DPO pairs to `data/training/causarix_rlvr_dpo.jsonl` on human edits.

## 3. Milestone 10: Causarix Enterprise AGI Engine
- **Engine Core**: `src/lib/autonomous-executive-reasoner.ts`
  * Monte Carlo Tree Search (MCTS) & Tree-of-Thought (ToT) with PUCT exploration-exploitation.
  * Quantitative code synthesis contract (Qwen 2.5 Coder 32B-Instruct).
  * Fiduciary Safe Harbor: Strict pruning of any branch with > 5.00% insolvency risk.
  * Delaware DGCL § 141(e) Merkle Root cryptographic sealing (66-char SHA-256 root).
- **Live Mathematical Execution**:
  * Directly calls `runMathMonteCarloSimulation` from `src/lib/monte-carlo-engine.ts`.
  * Executes 15,000 live stochastic draws (5,000 per branch) on CPU with Mulberry32 PRNG and Box-Muller normal sampling.
  * Verified 0.00% arithmetic drift across identical seeds (|Delta| <= 1e-7).
- **Interactive AGI Studio**: `src/app/dashboard/agi-studio/page.tsx`
  * Visual MCTS Tree viewer with Selected vs Pruned branches, Delaware Chancery exposure gauges, and 1-click PDF defense export.
- **AGI API Route**: `src/app/api/agi/deliberate/route.ts` connects to internal reactive sync mesh.

## 4. Video & Media Generation Architecture
- **Higgsfield MCP Engine**: `src/lib/services/higgsfield-mcp.ts` & `/api/higgsfield/generate`
  * Bridges Causarix AI Agents and Diffusion Studio to external MCP video generation servers.
  * Model support: Soul, Cinema Studio, Kling (Kling 1.5), Minimax Hailuo (Video-01), Google Veo 2.
  * Parameters: Aspect ratio (16:9, 9:16, 1:1), duration (5-15s), camera motion (zoom, pan, orbit, dolly).
- **Clarification on Omni vs Video Generation**:
  * **OmniRoute** in Causarix routes text/chat completions across free provider pools, NOT video diffusion.
  * **GPT-4o (Omni)** is a multimodal text/voice/vision understanding model, not video generation (OpenAI uses Sora for video).
  * **Qwen-Omni / Qwen2.5-VL** are vision-language reasoning models. Alibaba's dedicated video generation model is **Wan 2.1** (Wanx diffusion video).
  * For live video synthesis in Causarix, the active integration path is via `HiggsfieldMCPEngine` / Higgsfield MCP tool calling.

## 5. Real-Time Reactive Synchronization Mesh (Milestone 7)
- **Connected Systems**:
  * Causarix Native Jira (Action Tasks / Kanban): `/dashboard/projects`
  * Causarix Native Slack (Team Stream Chat): `/dashboard/chat`
  * Causarix Executive Boardroom: `/dashboard/boardroom`
- **Engine**: `src/lib/internal-sync-mesh.ts` with 3-tier loop breaker.
- Cross-system triggers:
  * Moving task to DONE in Jira auto-posts formatted resolution card to Slack `#boardroom-alerts`.
  * Commands in Slack auto-update Kanban tasks in Prisma DB.
  * Boardroom quorum consensus auto-spawns Kanban task and Slack announcement card.

## 6. Distribution, Watermarking & VC Portals (Milestones 8 & 9)
- **Free Tier QR Watermark**: `src/components/FreeTierPrintWatermark.tsx` & `src/lib/export-helpers.ts` (embeds stylized QR pointing to `causarix.vercel.app` on free PDF exports).
- **VC Asymmetric Distribution**:
  * `/vc-perks`: Dedicated investor portfolio perks landing page.
  * `/deal-audit`: Interactive diligence audit portal with pre-loaded M&A scenarios.
  * Leads & Campaigns: `data/causarix_vc_platform_leads.csv` & `data/causarix_vc_diligence_leads.csv`.

## 7. Critical Commitments & Invariants
- **Strict Anonymity**: Absolute omission of all XPrize / competition mentions across all files, commits, and UI.
- **Math Invariant**: 0.00% arithmetic drift on all SCM computations.
- **Fiduciary Invariant**: Strict statutory pruning of insolvency risk > 5.00%.

## 8. High-Visibility Feature Icon System (Koboyo-Inspired)
- **Component Suite**: `src/components/icons/CausarixFeatureIcons.tsx` & `src/components/icons/index.ts`
  * 32+ custom handcrafted SVG vector icons tailored to all platform features.
  * Enhanced multi-layer cyber-fiduciary styling with dual-tone depth and high-contrast color coding (emerald, violet, cyan, amber, rose).
  * Dynamic key dispatcher `<CausarixFeatureIcon name="..." />` for scalable integration across command palettes, sidebars, and dashboard cards.
  * Interactive modal viewer: `src/components/icons/CausarixIconShowcaseModal.tsx`.

## 9. Codebase Security Hardening & Cryptographic Integrity (Skylos Audit)
- **Static Analysis & Security Audit**: Audited 624 source files using Skylos 4.35.0 static analyzer.
- **Timing-Attack Resistance**:
  * Added universal constant-time `timingSafeEqual()` in `src/lib/dgcl-merkle.ts`.
  * Hardened Delaware DGCL § 141 Merkle proof validation (`verifyProof`), hash chain linkage checks (`verifyChain`), and Data Moat ledger chain verification (`DataMoatLedger.verifyChain`).
- **Cryptographic Digest Upgrades**:
  * Upgraded all legacy MD5 hashing in timeline commit events, meeting intelligence, and decision intelligence to FIPS-compliant SHA-256 (`crypto.createHash('sha256')`).
- **PRNG & Entropy Hardening**:
  * Replaced `Math.random()` with `crypto.randomUUID()` in `src/lib/memory/team-agent-memory-hub.ts`.
- **UTF-8 Encoding Sanitization**:
  * Cleaned UTF-8 Byte Order Marks (`\ufeff`) across all 10 Python pipeline and data harvesting scripts in `scripts/`.
- **Verification**: Zero TypeScript errors (`npx tsc --noEmit`) and 442/442 test suite green (`node tests/run-all-tests.js`).

