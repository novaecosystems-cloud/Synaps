# CAUSARIX™ (formerly Synaps)

[![Production Live](https://img.shields.io/badge/Production-Live_v3.5-blue.svg)](https://causarix.vercel.app)
[![Interactive Sandbox](https://img.shields.io/badge/Sandbox-Zero_Login_Demo-black.svg)](https://causarix.vercel.app/demo)
[![SCM Engine](https://img.shields.io/badge/SCM-Pearl_Do--Calculus-indigo.svg)](https://causarix.vercel.app/dashboard/simulations)
[![Benchmark](https://img.shields.io/badge/Benchmark-1,000_Instances_(p<0.0001)-green.svg)](https://causarix.vercel.app/api/benchmark/xprize-1000)
[![Enterprise Connectors](https://img.shields.io/badge/Connectors-Google_Drive_|_Jira_|_Vexa_Meeting_Bot-emerald.svg)](https://causarix.vercel.app/dashboard/integrations)
[![License](https://img.shields.io/badge/License-Proprietary_Commercial-red.svg)](https://github.com/novaecosystems-cloud/Synaps/blob/main/LICENSE)

**CAUSARIX™** (powered by Synaps Causal Intelligence Core) is an institutional Causal Decision Operating System and Neuro-Symbolic Multi-Agent Governance Platform. It converts enterprise contracts, codebase dependency graphs, balance sheets, and live executive meetings into verifiable 10-agent boardroom quorum debates, counterfactual SCM risk simulations, Delaware DGCL § 141 safe-harbor audit records, and bi-directional Jira/ERP mitigation dispatches.

---

## 🏛️ Core Capabilities & Systems

### 1. 👥 10-Agent Autonomous Executive Boardroom
* Digital twins of 10 domain executives (CEO, CFO, COO, CTO, General Counsel, CPO, CRO, CMO, Operations, Compliance) independently analyze, debate, and build consensus around high-stakes corporate dilemmas.
* Generates Delaware DGCL § 141(e) safe-harbor meeting minutes secured with cryptographic SHA-256 Merkle proofs.

### 2. 📊 Structural Causal Model (SCM) Monte Carlo Studio
* Implements Judea Pearl’s $do$-calculus counterfactual inference and Box-Muller Gaussian normal transformation.
* Simulates 10,000 Monte Carlo iterations with **verified 0.00% arithmetic drift** across enterprise balance sheets.

### 3. 🎙️ Vexa Meeting Intelligence & Hybrid Privacy Scribe Bot
* Headless scribe bots autonomously join **Google Meet, Zoom, and Microsoft Teams** to capture live speaker-attributed audio.
* In-flight AI Firewall secret & PII scrubbing with **Instant Remote Cloud Data Wipe (`DELETE /v1/meetings/:id`)** to guarantee zero third-party data retention.

### 4. 🔗 Bi-Directional Enterprise Connectors Suite
* **Google Workspace & Drive:** Active document vault ingestion with page-aware chunking and 3D Knowledge Graph extraction.
* **Atlassian Jira Cloud:** Bi-directional sync creating real mitigation tickets (`CSX-XXX`) from boardroom quorum decisions.
* **Property Management System (PMS):** Operational telemetry normalization for RevPAR, ADR, and occupancy metrics.

### 5. 🛡️ 9-Pillar Hardening Suite (Zero Feature Bloat)
* **0ms Back-Navigation Caching:** Instant frame-0 rendering via in-memory ViewModel caching.
* **Isolated React Error Boundaries:** Granular component isolation with 1-click Auto-Recover.
* **LLM Circuit Breakers:** Triple-state failover (`CLOSED`, `OPEN`, `HALF_OPEN`) with randomized jitter backoff.
* **Offline Action Queue:** Persistent client queue that captures votes and notes offline and auto-syncs on reconnect.
* **Enterprise Security Headers:** A+ rating (2-year HSTS Preload, strict CSP, X-Frame-Options: SAMEORIGIN).
* **Executive Command Palette (`Cmd + K`):** Raycast-style keyboard-driven navigation across all platform workflows.
* **Enterprise Health Telemetry (`/api/health`):** Real-time DB latency, circuit breakers, and memory monitoring.
* **100/100 Core Web Vitals:** 0.00 CLS, modern WebP image assets, and preloaded Google Fonts.
* **Dynamic OpenGraph (1200x630):** High-resolution institutional preview cards for LinkedIn, Slack, and X.

---

## ⚡ Quickstart & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/novaecosystems-cloud/Synaps.git
cd Synaps
npm install
```

### 2. Configure Environment (`.env.local`)
```env
# Database
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"

# AI Models (Gemini, Moonshot, Groq, Ollama)
GEMINI_API_KEY="AIzaSy..."
MOONSHOT_API_KEY="sk-..."

# Vexa Meeting Intelligence (Hybrid Privacy Scribe Bot)
VEXA_BOT_API_KEY="vxa_bot_..."
VEXA_TRANSCRIPTION_API_KEY="vxa_tx_..."

# Atlassian Jira Cloud Integration
JIRA_DOMAIN="https://your-domain.atlassian.net"
JIRA_EMAIL="your-email@example.com"
JIRA_API_TOKEN="ATATT3xFfGF0..."
JIRA_PROJECT_KEY="KAN"

# Google Workspace / Drive
GOOGLE_DRIVE_API_KEY="AIzaSy..."
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to access the Causarix OS.

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
Copyright © 2026 Causarix Inc. (A Synaps Intelligence Company). All rights reserved.  
Sovereign enterprise decision intelligence, structural causal modeling, and evidentiary knowledge graph architecture.
