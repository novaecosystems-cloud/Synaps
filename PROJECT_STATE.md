# CAUSARIX™ (formerly Synaps) — Comprehensive Project State & Context Handoff
Last Updated: 2026-09-03
Repository: https://github.com/novaecosystems-cloud/Synaps.git (Branch: main, Commit: a2b243a)
Production Live URL: https://causarix.vercel.app
Desktop Binary: D:\Synaps\Causarix.exe & Launch-Causarix.bat

## 1. Executive Status & Test Metrics
- Automated Tests: 427 / 427 PASSING across 16 test suites (Tiers 1-5 + M1-M7). Command: `node tests/run-all-tests.js`
- TypeScript Compilation: 0 errors (`npx tsc --noEmit`).
- Subagents: 0 running (clean state).
- Desktop: Packaged standalone Windows executable (180MB).

## 2. Model & Reasoning Architecture
- Triad Models on Disk (D:\Synaps\models\):
  * causarix-global-7b-lora (Legal Brain, Qwen 2.5 7B LoRA, HF: Causarix/causarix-global-7b-lora)
  * causarix-global-finance-7b-lora (Finance Brain, US GAAP ASC 606/842 & IFRS 15/16)
  * causarix-global-causal-7b-lora (Causal SCM & Boardroom Quorum Brain)
- Model Routing: src/lib/triad-models.ts & /api/models/triad/status.
- Hugging Face Cloud Provider: Added to src/lib/llm-router.ts. Requires HF_TOKEN in Vercel to serve live website.
- RLVR Verifiable Reward Engine: src/lib/rlvr-reward-engine.ts & /api/rl/reward.
  * Deterministic verifiers (+1.0 math drift 0.00%, +1.0 Delaware DGCL § 141, -2.0 secret leak).
  * Auto-generates DPO pairs to data/training/causarix_rlvr_dpo.jsonl on human edits.

## 3. Real-Time Reactive Synchronization Mesh
- Connected Systems:
  * Causarix Native Jira (Action Tasks / Kanban): /dashboard/projects
  * Causarix Native Slack (Team Stream Chat): /dashboard/chat
  * Causarix Executive Boardroom: /dashboard/boardroom
- Engine: src/lib/internal-sync-mesh.ts with 3-tier loop breaker.
- Cross-system triggers:
  * Moving task to DONE in Jira auto-posts formatted resolution card to Slack #boardroom-alerts.
  * Typing "create task: ..." or "resolve CSX-XXX" in Slack auto-updates Kanban tasks in Prisma DB.
  * Boardroom quorum consensus auto-spawns Kanban task and Slack announcement card.

## 4. Distribution & Outbound Campaigns
- Lead Harvesters: scripts/lead-harvester-smb.py, lead-harvester-legal.py, lead-harvester.py.
- Active Campaign Datasets:
  * data/causarix_b2b_email_campaign.csv
  * data/causarix_legal_email_campaign.csv
  * data/causarix_smb_email_campaign.csv (SMB founders in India & US)
- Outbound Strategy: Ultra-short (<75 words), advice-seeking consultative angle.

## 5. Public Positioning & AEO/GEO
- GitHub README updated with plain-English C-Suite, Legal, and SMB solutions.
- Explicit comparison matrix against Anaplan, Diligent, and Ironclad.
- Critical Invariant: Strict omission of all XPrize / competition mentions in GitHub / public docs.
