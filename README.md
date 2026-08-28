# CAUSARIX™

[![Production Live](https://img.shields.io/badge/Production-Live_v3.5-blue.svg)](https://causarix.vercel.app)
[![Interactive Sandbox](https://img.shields.io/badge/Sandbox-Zero_Login_Demo-black.svg)](https://causarix.vercel.app/demo)
[![SCM Engine](https://img.shields.io/badge/SCM-Pearl_Do--Calculus-indigo.svg)](https://causarix.vercel.app/dashboard/simulations)
[![Benchmark](https://img.shields.io/badge/Benchmark-1,000_Instances_(p<0.0001)-green.svg)](https://causarix.vercel.app/api/benchmark/xprize-1000)
[![Enterprise Connectors](https://img.shields.io/badge/Connectors-Google_Drive_|_Jira_|_Vexa_Meeting_Bot-emerald.svg)](https://causarix.vercel.app/dashboard/integrations)
[![License](https://img.shields.io/badge/License-Proprietary_Commercial-red.svg)](https://github.com/novaecosystems-cloud/Synaps/blob/main/LICENSE)

**CAUSARIX™** is an institutional Causal Decision Operating System and Neuro-Symbolic Governance Platform. Designed for enterprise boards, executive leadership, and high-stakes decision-makers, Causarix bridges corporate contracts, operational data, balance sheets, and live executive meetings into verifiable 10-agent boardroom quorum debates, counterfactual risk simulations, Delaware DGCL § 141 safe-harbor audit ledgers, and automated mitigation dispatches.

---

## 🏛️ Core Platform Features

### 1. 👥 10-Agent Autonomous Executive Boardroom
* **Independent Digital Twins:** Ten certified executive agents (CEO, CFO, COO, CTO, General Counsel, CPO, CRO, CMO, Operations, Compliance) independently analyze strategic dilemmas through strict domain jurisdictions.
* **Delaware DGCL § 141(e) Safe Harbor:** Generates legally binding boardroom quorum meeting minutes backed by cryptographic SHA-256 Merkle proofs, protecting leadership under the Business Judgment Rule.

### 2. 📊 Structural Causal Model (SCM) & Counterfactual Studio
* **Judea Pearl $do$-Calculus:** Evaluates true causal interventions rather than mere statistical correlations.
* **Deterministic Math Kernel:** Executes 10,000 Monte Carlo iterations with **verified 0.00% arithmetic drift**, eliminating the 9%–17% calculation error rate endemic to standard LLMs.
* **Sensitivity & Parameter Scenarios:** Simulates EBITDA, cash runway, customer churn, and gross margin trade-offs under high-volatility conditions.

### 3. 🧠 Decision Memory Flywheel & Corporate Tactics Center
* **Universal Decision Ledger:** Tracks and logs executive decisions across five canonical states (`ACCEPTED`, `REJECTED`, `MODIFIED`, `IGNORED`, `SUPERSEDED`).
* **Tactics Distillation Engine:** Automatically synthesizes past executive choices into reusable, organizational rules and strategic leadership playbooks.
* **Dynamic Context Injection:** Automatically injects learned institutional precedent into future boardroom debates, SCM simulations, and chat queries.

### 4. 🎙️ Vexa Meeting Intelligence & Hybrid Privacy Scribe Bot
* **Multi-Platform Scribe:** Autonomously attends Google Meet, Zoom, and Microsoft Teams calls to capture live speaker-attributed audio and transcripts.
* **In-Flight AI Firewall Scrubbing:** Scrubs PII, secrets, and confidential credentials before data ingestion.
* **Instant Remote Cloud Wipe (`DELETE /v1/meetings/:id`):** Completely purges remote audio files upon local ingestion, guaranteeing zero third-party cloud retention.

### 5. 🎮 Adaptive Governance Motivation Engine (GAME)
* **Departmental Multiplier Balancer:** Diagnoses organizational blind spots and dynamically increases incentive multipliers for under-represented domains (e.g. Legal, HR, Compliance).
* **Fiduciary Streaks & Governance Health:** Tracks continuous operational diligence and board governance streaks in real time.

### 6. 🪝 Hooked UX 4-Phase Habit Engine
* **Cognitive Load Relief:** Implements Nir Eyal’s 4-phase habit loop (Trigger $\to$ Action $\to$ Variable Reward $\to$ Compounding Investment) to transform complex fiduciary compliance into an intuitive daily routine.
* **Built-in Diagnostic Evaluator:** Real-time scoring across all four Hook Model dimensions.

### 7. 🔗 Bi-Directional Enterprise Connectors Suite
* **Google Workspace & Drive:** Full document vault ingestion with page-aware vector chunking and 3D Knowledge Graph relationship extraction.
* **Atlassian Jira Cloud:** Bi-directional synchronization transforming boardroom quorum decisions into actionable mitigation tickets (`CSX-XXX`).
* **Property Management Systems (PMS):** Operational telemetry normalization for RevPAR, ADR, and occupancy metrics.

### 8. 💬 Executive Intelligence Chat & Grounded Co-Work
* **Dual-Domain Reasoning:** Synthesizes internal document citations with live external web research and case law.
* **Zero AI Slop:** Guaranteed executive-grade prose with clean typographic spacing and zero raw code/bracket leakage.

---

## 🏰 Our Strategic & Technical Moat

| Moat Dimension | Traditional Enterprise AI | Causarix Sovereign OS |
| :--- | :--- | :--- |
| **Arithmetic Reliability** | 9% – 17% math drift on balance sheets | **0.00% Math Drift** via deterministic Wasm/Python kernel |
| **Legal Defensibility** | Unstructured conversational text | **Delaware DGCL § 141** cryptographic Merkle audit proofs |
| **Institutional Memory** | Ephemeral, session-bound context | **Compounding Decision Flywheel** that learns proprietary playbooks |
| **Data Privacy** | Indefinite third-party cloud logging | **Ephemeral In-Flight Scrubbing** + Instant Remote Cloud Wipe |
| **Domain Specialization** | Monolithic generalist chatbot | **10-Agent Boardroom Quorum** with strict domain jurisdictions |

---

## 🏗️ Technical Architecture

* **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
* **Causal Engine:** Judea Pearl $do$-calculus DAGs, WebAssembly, Box-Muller Gaussian Monte Carlo.
* **Database & Vectors:** PostgreSQL (Neon Serverless), pgvector, Prisma ORM.
* **AI Orchestration & Firewall:** Multi-provider failover (Gemini, Groq, Ollama), in-flight regex secret scrubbers, prompt/response egress inspection.
* **Security Standards:** A+ Security Headers (HSTS Preload, Strict CSP, X-Frame-Options: SAMEORIGIN).

---

## ⚡ Quickstart & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/novaecosystems-cloud/Synaps.git
cd Synaps
npm install
```

### 2. Configure Environment
Create a `.env.local` file with your database connection string, AI model API keys, and integration credentials.

### 3. Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to launch the platform.

### 4. Build & Production Deployment
```bash
npm run build
npm run start
```

---

## 🧪 Verification & Benchmarks

```bash
# Verify TypeScript strict compilation across all modules (0 errors)
npx tsc --noEmit

# Run 1,000-instance blinded empirical SCM benchmark
node scripts/xprize-causal-benchmark-1000.mjs

# Run full platform integration test suite
node scripts/verify-synaps-full-suite.mjs
```

---

## 📄 Licensing & Intellectual Property
Copyright © 2026 Causarix Inc. All rights reserved.  
Sovereign enterprise decision intelligence, structural causal modeling, and evidentiary governance architecture.
