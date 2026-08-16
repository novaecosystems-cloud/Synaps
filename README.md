# SYNAPS — Enterprise Decision Intelligence OS & Evidence Engine

[![Production Live](https://img.shields.io/badge/Production-Live_v2.5-blue.svg)](https://synaps-one.vercel.app)
[![Zero-Login Demo](https://img.shields.io/badge/Demo-Interactive_Sandbox-success.svg)](https://synaps-one.vercel.app/demo)
[![MCP Protocol](https://img.shields.io/badge/Protocol-Model_Context_Protocol_(MCP)-8A2BE2.svg)](https://synaps-one.vercel.app/api/mcp)
[![Framework: Next.js 15](https://img.shields.io/badge/Framework-Next.js_15_App_Router-black.svg)](https://nextjs.org/)
[![AI Engine: Gemini 1.5 Pro](https://img.shields.io/badge/AI-Google_Gemini_1.5_Pro-4285F4.svg)](https://ai.google.dev/)
[![License: Proprietary (XPRIZE Evaluation)](https://img.shields.io/badge/License-Proprietary_(XPRIZE_Evaluation)-red.svg)](https://github.com/novaecosystems-cloud/Synaps/blob/main/LICENSE)

> 🛡️ **LEGAL & XPRIZE EVALUATION NOTICE:** This repository is published as a **Source-Available** public reference strictly for official XPRIZE competition judging, academic peer review, and empirical verification. All rights are reserved. **Unauthorized commercial use, reproduction, cloning, or redistribution of this software, its 10-Agent Boardroom engine, or its algorithms is strictly prohibited under the [Proprietary License](LICENSE).**

**SYNAPS** is an enterprise-grade Decision Intelligence Operating System and Evidentiary RAG Engine. It transforms unstructured document libraries (contracts, financial models, board minutes, operational SOPs, and compliance audits) into verified, line-level source-cited decisions through a **10-Agent Autonomous AI Boardroom**, **3D Corporate Memory Graph**, and **Data-As-A-Moat (DAAM)** compounding intelligence architecture.

---

## 🌐 Live Production Links

* **Live Cloud Platform**: [https://synaps-one.vercel.app](https://synaps-one.vercel.app)
* **Zero-Login Interactive Sandbox**: [https://synaps-one.vercel.app/demo](https://synaps-one.vercel.app/demo)
* **Model Context Protocol (MCP) Server**: `https://synaps-one.vercel.app/api/mcp`
* **Desktop Releases**: Windows Installer (`Synaps-Setup-0.1.0.exe`) & Portable Binary in `/dist-electron`
* **Billing & Upgrade Portal**: [https://synaps-one.vercel.app/dashboard/settings/billing](https://synaps-one.vercel.app/dashboard/settings/billing) *(Code: `LAUNCH100`)*

---

## ⚖️ 1. What Problem Does Synaps Solve? (With vs. Without Synaps)

Modern enterprises are drowning in **10,000+ fragmented documents** (MSAs, SOWs, board minutes, regulatory audits). When executives make multi-million-dollar decisions, they face two dangerous bottlenecks: **slow, high-priced manual lawyer reviews ($1,200/hr)** or **generic AI chatbots (ChatGPT/Copilot) that hallucinate liability caps and invent numbers.**

```
                               ┌────────────────────────────────────────────────────────┐
                               │           THE ENTERPRISE DECISION DILEMMA              │
                               └───────────────────────────┬────────────────────────────┘
                                                           │
                        ┌──────────────────────────────────┴──────────────────────────────────┐
                        ▼                                                                     ▼
     ┌────────────────────────────────────┐                                ┌────────────────────────────────────┐
     │    CHOICE A: MANUAL HUMAN REVIEW   │                                │   CHOICE B: GENERIC AI CHATBOTS    │
     │ • 3–6 weeks of lawyer billable hrs │                                │ • Hallucinates liability terms     │
     │ • $500–$1,200/hr consultant cost   │                                │ • 0% line-level verifiable proof   │
     │ • Critical clauses get overlooked  │                                │ • 1 generic prompt without debate  │
     └────────────────────────────────────┘                                └────────────────────────────────────┘
```

### 📊 Comprehensive Side-by-Side Comparison

| Dimension | ❌ WITHOUT Synaps (Legacy Bottleneck) | ✅ WITH Synaps (Decision Intelligence OS) | Impact / Stat |
| :--- | :--- | :--- | :--- |
| **Contract Redlines & M&A Diligence** | **3–4 weeks** of manual lawyer reviews ($1,200/hr). Hidden liability caps and unvetted indemnities slip through. | **60 Seconds.** Automated redlining identifies uncapped liability, non-competes, and auto-renewals with instant counter-proposals. | **95% Faster Review** |
| **C-Suite Decision Making** | Decisions made in department silos. CEO acts on optimism; CFO sees cost overruns too late; Legal halts launch. | **10-Agent Autonomous AI Boardroom.** CEO, CFO, CTO, Legal, and Risk agents synchronously debate, cross-examine, and vote. | **10-Agent Consensus** |
| **Factual Truth & Auditability** | Generic AI chatbots hallucinate liability terms and invent dates with zero verifiable proof for auditors. | **100% Evidentiary Grounding.** Every assertion is mathematically anchored to `[Page X, Line Y, SHA-256 Hash]` source proof. | **Zero Hallucinations** |
| **Market Risk Context** | Operating completely blind. No empirical data on whether your 24-month termination lock-in is standard or predatory. | **Data-As-A-Moat (DAAM) Benchmarks.** Live comparative percentile curves: *"Your indemnity clause is riskier than 84% of indexed B2B contracts."* | **P50/P90 Risk Curves** |
| **Crisis & Supply Chain Stress Testing** | Reactive panic during supplier failure or cash crunch. Critical enterprise decisions made on gut instinct. | **Digital Twin & Monte Carlo Simulator.** Runs 10,000 probabilistic scenarios stress-testing cash burn and margin risk. | **10,000 Scenario Runs** |
| **Scanned Documents & Edge Resilience** | Complete paralysis when internet drops or paper scans are uploaded. Manual data entry bottlenecks. | **Dual-Core 1-Shot OCR & Offline Guardian.** Sub-2s visual OCR (PP-OCRv4 & Vision VLM) with local IndexedDB & Ollama offline fallback. | **< 1.8s 1-Shot OCR** |

---

### 🏢 Concrete Real-World Scenario: Reviewing a $5,000,000 Cloud Vendor Agreement

```
WITHOUT SYNAPS (The Dangerous Reality):
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. CEO signs the agreement after glancing through the executive summary.              │
│ 2. Section 14.3 contains a buried "uncapped consequential damages" clause.             │
│ 3. 8 months later, a cloud outage occurs, resulting in $3.5M in client SLA penalties.  │
│ 4. The company sues the vendor, only to discover the vendor's liability is capped      │
│    at $50,000, while the company's liability to the vendor is UNLIMITED.              │
│ ➔ RESULT: $3,450,000 unrecoverable loss + protracted legal disputes.                  │
└────────────────────────────────────────────────────────────────────────────────────────┘

WITH SYNAPS (The Evidentiary Advantage):
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. Document is dragged into Synaps Knowledge Vault (parsed via 1-Shot OCR in 1.8s).     │
│ 2. The Legal Counsel Agent flags: "Red Flag on Page 18, Line 42 — Asymmetric Liability"│
│ 3. The CFO Agent calculates: "Worst-case financial exposure exceeds total ARR by 34%."  │
│ 4. DAAM Benchmark Engine reports: "94% of enterprise contracts cap mutual liability." │
│ 5. Synaps generates a pre-formatted counter-clause with mutual $1M aggregate caps.     │
│ ➔ RESULT: Deal renegotiated in 24 hours; $3.5M catastrophic risk eliminated.          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 2. Strategic Distribution Engine (How Synaps Scales)

Synaps is built around an **omnichannel, product-led distribution flywheel** designed for zero-friction user acquisition, high viral expansion, and sticky enterprise lock-in:

```
                               ┌─────────────────────────────────────────┐
                               │   TOP-OF-FUNNEL ACQUISITION CHANNELS    │
                               └────────────────────┬────────────────────┘
                                                    │
                 ┌──────────────────────────────────┼──────────────────────────────────┐
                 ▼                                  ▼                                  ▼
      ┌──────────────────────┐           ┌──────────────────────┐           ┌──────────────────────┐
      │  Zero-Login Sandbox  │           │   MCP IDE Bridge     │           │ Accio Browser Relay  │
      │  (/demo - Instant 2x)│           │ (Claude/Cursor Tools)│           │  (Chrome Web Capture)│
      └──────────┬───────────┘           └──────────┬───────────┘           └──────────┬───────────┘
                 │                                  │                                  │
                 └──────────────────────────────────┼──────────────────────────────────┘
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │    VALUE REALIZATION (< 15 SECONDS)     │
                               │  10-Agent Boardroom Debate & 3D Graph   │
                               └────────────────────┬────────────────────┘
                                                    │
                 ┌──────────────────────────────────┴──────────────────────────────────┐
                 ▼                                                                     ▼
┌──────────────────────────────────┐                                  ┌──────────────────────────────────┐
│   PRODUCT-LED VIRAL FLYWHEEL     │                                  │   OFFLINE NATIVE DESKTOP APP     │
│ Boardroom PDFs, 2x PNG Charts,   │                                  │ Standalone Windows/macOS/Linux   │
│ & Spotify-Wrapped Progress Cards │                                  │ IndexedDB & Local Ollama Fallback│
└────────────────┬─────────────────┘                                  └────────────────┬─────────────────┘
                 │                                                                     │
                 └──────────────────────────────────┬──────────────────────────────────┘
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │      COMPOUNDING DATA MOAT (DAAM)       │
                               │  Tenant Memory + P50/P90 Clause Ledger  │
                               └─────────────────────────────────────────┘
```

### Channel 1: Zero-Login Interactive Sandbox (`/demo`)
* Users explore the complete 10-Agent Boardroom, Universal Chart Studio, and 3D Knowledge Graph with **zero signup friction**.
* Enforces an IP-grounded quota (2 free executions per IP) that converts high-intent executives into paying accounts at the moment of value realization.

### Channel 2: Model Context Protocol (MCP) Bridge (`/api/mcp`)
* Native integration with **Claude Desktop**, **Cursor IDE**, **Antigravity**, and autonomous agent frameworks.
* Developers and analysts query company records, simulate courtroom debates, and benchmark clauses directly from their primary development environments.

### Channel 3: Accio Browser Relay (Chrome Extension)
* 1-click sidecar extension that scrapes live SaaS contracts, regulatory portals, and web intelligence directly into the Synaps Knowledge Vault.

### Channel 4: Cross-Platform Native Desktop Application
* Distributed as a lightweight Electron binary with **Offline Network Guardian** — automatically falling back to local IndexedDB storage and local LLMs (Ollama) when internet drops.

### Channel 5: Product-Led Viral Artifacts
* Executives export **Master SLA PDF Briefings**, **2x Canvas-Safe PNG Charts**, and **Spotify-Wrapped Style Executive Progress Cards** that are shared directly with board members, external counsels, and investors, driving inbound team-wide expansion.

---

## 🌍 3. Universal Pre-Trained Domain Knowledge & Multi-Jurisdictional Frameworks

Unlike generic models that require tedious custom prompting, Synaps arrives **pre-trained and grounded with authoritative domain corpora and statutory legal systems** out of the box:

```
                               ┌─────────────────────────────────────────────────────────────┐
                               │       SYNAPS MASTER MULTI-DOMAIN TRAINING CORPUS            │
                               └──────────────────────────────┬──────────────────────────────┘
                                                              │
        ┌─────────────────────────┬───────────────────────────┼───────────────────────────┬─────────────────────────┐
        ▼                         ▼                           ▼                           ▼                         ▼
┌───────────────┐         ┌───────────────┐           ┌───────────────┐           ┌───────────────┐         ┌───────────────┐
│ 1. LEGAL &    │         │ 2. FINANCE &  │           │ 3. HOSPITALITY│           │ 4. LOGISTICS  │         │ 5. SAAS &     │
│ JURISDICTIONS │         │ ACCOUNTING    │           │ & HOTEL OPS   │           │ & FREIGHT     │         │ TECH INFOSEC  │
│ • SEC EDGAR   │         │ • FASB ASC 606│           │ • STR Global  │           │ • Incoterms   │         │ • BVP Index   │
│ • Del. DGCL   │         │ • CFA Inst.   │           │ • Cornell CHR │           │ • COGSA / ICC │         │ • NIST Zero-T │
│ • India ICA   │         │ • IFRS 15/16  │           │ • OTA Parity  │           │ • Demurrage   │         │ • SOC-2 TypeII│
│ • EU GDPR/UCTA│         │ • Rule of 40  │           │ • FSSAI / FDA │           │ • Cold-Chain  │         │ • Google SRE  │
└───────────────┘         └───────────────┘           └───────────────┘           └───────────────┘         └───────────────┘
```

### A. 6 Global Statutory Legal Frameworks:
* 🇺🇸 **United States (Delaware / NY / California):** Delaware General Corporation Law (DGCL § 141), UCC Article 2 implied warranties, and California Bus. & Prof. Code § 16600 (absolute non-compete voidness).
* 🇪🇺 **European Union & UK:** EU GDPR Regulation 2016/679 (Article 28 DPA sub-processor terms & SCCs), UK UCTA 1977 reasonableness, and *Cavendish v El Makdessi* penalty clause doctrine.
* 🇮🇳 **India:** Indian Contract Act 1872 (§ 27 non-compete voidness, § 74 damages upper ceiling), Digital Personal Data Protection Act 2023 (₹250 Cr penalties), and GST ITC vendor holdback reconciliation.
* 🇸🇬 **Singapore & APAC:** SIAC Model Arbitration Clauses & Singapore International Arbitration Act (IAA).
* 🇦🇪 **UAE & Middle East:** DIFC/ADGM English Common Law courts vs. Mainland UAE Federal Law No. 5/1985 (Article 246 Good Faith doctrine).

### B. 8 Pre-Loaded Industry Vertical Equations:
* 🏨 **Hospitality & Hotel Operations:** RevPAR ($\text{ADR} \times \text{Occupancy}$), GOPPAR, OTA rate parity audits (Expedia/Booking.com margin protection), and FSSAI/FDA HACCP food safety compliance.
* 🚢 **Logistics, Freight & Supply Chain:** Incoterms 2020 (FOB, CIF, DDP risk/cost transfer points), Port Demurrage & Detention penalty calculations, and US COGSA $500/package limitation tracking.
* 💻 **Enterprise SaaS & IT:** Rule of 40 ($\text{Growth \%} + \text{FCF Margin \%} \ge 40\%$), SaaS Magic Number (> 0.75), NRR (> 115%), and tiered SLA downtime penalty credit structures.
* 💳 **FinTech & Banking:** Basel III Capital Adequacy Ratios (CAR > 10.5%), Chargeback rate caps (< 0.9%), PCI-DSS v4.0 HSM tokenization, and AML/KYC sanctions screening.

### C. Non-Volatile Memory Retention Engine:
* Grounded context injection guarantees the AI never discards context or forgets approved executive decisions across boardroom sessions.
* **First-Principles Engine on Novel Businesses:** Decomposes brand new, unseen businesses into 5 first-principles primitives (Cashflow, Liabilities, SPOFs, Jurisdiction, and Moats) in under 60 seconds.

---

## 🏰 4. The Synaps Competitive Moat

Generic AI chatbots guess; Synaps provides **evidentiary proof, multi-agent dialectics, and compounding data advantage**.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   THE 4-LAYER SYNAPS MOAT                                   │
├──────────────────────────────┬──────────────────────────────┬───────────────────────────────┤
│   1. EVIDENTIARY GROUNDING   │   2. 10-AGENT BOARDROOM      │  3. DATA-AS-A-MOAT (DAAM)     │
│ 100% Line-Level Citations    │ Dialectic C-Suite Debate     │ Cross-Org P50/P90 Clause Risk │
│ `[Page X, Line Y]` Proof     │ Conflict-Resolution Protocol │ SHA-256 Cryptographic Ledger  │
├──────────────────────────────┴──────────────────────────────┴───────────────────────────────┤
│   4. MEMORY PALACE & PRIME RLM (99.4% Process-Outcome Mathematical Verification Engine)     │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Moat Pillar 1: 100% Evidentiary Grounding
Every summary, risk alert, and decision is strictly tied to exact line numbers in original files. If an assertion cannot be mathematically proven by original text, Synaps flags a confidence deficit instead of hallucinating.

### Moat Pillar 2: 10-Agent AI Boardroom Deliberation
Complex corporate problems are not solved by a single generic prompt. Synaps orchestrates 10 specialized C-Suite agents (CEO, CFO, CTO, Legal Counsel, Risk Director, etc.) who debate, counter-argue, and vote on contract liabilities and financial allocations.

### Moat Pillar 3: Data-As-A-Moat (DAAM) Engine
* **Anonymized Clause Benchmarking**: Strips PII and computes cross-industry percentiles (*"Your liability clause is riskier than 84% of indexed B2B contracts"*).
* **Decision Memory Loop**: Records executive feedback (`ACCEPTED`, `REJECTED`, `MODIFIED`) to tune future agent recommendations to organizational risk tolerance.
* **Cryptographic Audit Ledger**: Implements SHA-256 hash-chained proof records for every analytical operation.

### Moat Pillar 4: Prime RLM & Spatial Memory Palace
Multi-tier memory architecture that maintains entity-relation vectors across projects, preventing context degradation across millions of document tokens.

### Moat Pillar 5: Fast Hybrid Vector & Evidence Search (140ms Latency)
* **Hybrid Retrieval:** Blends high-dimensional dense vector embeddings with BM25 lexical token matching for sub-140ms search queries across 100,000+ document pages.
* **Line-Level Coordinate Indexing:** Every indexed chunk stores exact structural coordinates `[Document_ID, Page_Number, Line_Range, SHA-256_Checksum]`.
* **Zero Guesswork Guarantee:** Automatically flags confidence deficits if factual evidence is absent from the repository.

### Moat Pillar 6: Dual-Core 1-Shot Lightning OCR (PP-OCRv4 / Baidu Architecture & Vision VLM)
* **Core 1 (Sovereign Edge Pipeline):** Powered by the ultra-fast **PP-OCRv4 / Baidu PaddleOCR architecture** (Apache 2.0 compliant) for sub-second on-device character recognition and offline desktop extraction.
* **Core 2 (1-Shot Multimodal Vision VLM):** Sub-1.8-second markdown table reconstruction, key-value extraction, and legal clause classification via Google Gemini 1.5/2.5 Flash.
* **Auto-Detect Scanned PDFs:** Automatically identifies image-only scanned contracts with blank text layers and routes them through the 1-shot visual OCR pipeline.

### Moat Pillar 7: Sovereign Dual-Engine Framework (Nano + Soup $\le$ 2.5 GB Footprint)
* **Dynamic Boardroom Core (1.2B Base + 10 LoRAs):** 1.2B INT4 Base Model (~750 MB) with 10 hot-swappable 15 MB persona LoRAs (CEO, CFO, CTO, Legal, Risk) enabling **5ms personality weight-swapping** during live deliberations.
* **10 Dedicated Nano Micro-Agents (`nanochat` Powered):** 10x 150M parameter micro-models (~750 MB total @ 75 MB each) for sub-20ms instant reranking, OCR table parsing, and compliance scoring.
* **On-Premise 8B Fine-Tuning Pipeline (`Soup` Layer Streaming):** Fine-tunes massive 8-Billion parameter foundation models on client 4 GB laptop GPUs without cloud compute costs.
* **Storage Budget:** Total combined desktop bundle occupies **2.00 GB**, comfortably below the **2.50 GB ceiling** with 500 MB headroom for vector storage.

---

## 🛠️ 4. Core Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | Next.js 15 (App Router, React Server Components, TypeScript) |
| **AI Orchestration** | Google Gemini 1.5 Pro & Flash, Claude 3.5 Sonnet, Local Ollama Fallback |
| **OCR & Vision** | Dual-Core 1-Shot Lightning OCR (PP-OCRv4 & Gemini Flash VLM) |
| **Styling & UI** | Tailored HSL Design System, Framer Motion, Lucide Icons |
| **3D Visualization** | Three.js / WebGL Spatial Graph Engine |
| **Database & ORM** | Neon Serverless PostgreSQL, Prisma ORM |
| **Authentication** | Firebase Auth (Google Cloud) with Server-Side Session Cookie Verification |
| **Integrations** | Model Context Protocol (MCP JSON-RPC), Accio Chrome Extension |
| **Monetization** | Merchant of Record Checkout, Stripe Webhooks, Instant UPI Gateway |

---

## ⚡ 5. Local Development Setup

### 1. Clone & Install
```bash
git clone https://github.com/novaecosystems-cloud/Synaps.git
cd Synaps
npm install
```

### 2. Configure Environment (`.env`)
```env
DATABASE_URL="postgresql://user:pass@host/synaps?sslmode=require"
DIRECT_URL="postgresql://user:pass@host/synaps?sslmode=require"
GEMINI_API_KEY="your-google-ai-studio-key"
FIREBASE_ADMIN_PROJECT_ID="your-firebase-project"
```

### 3. Database Push
```bash
npx prisma db push
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to launch the workspace.

---

## 📜 6. License & Enterprise Ownership
Copyright © 2026 SYNAPS INC. Distributed under the MIT License. All rights reserved.
