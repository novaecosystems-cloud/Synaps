# SYNAPS — Enterprise Decision Intelligence OS & Evidence Engine

[![Production Live](https://img.shields.io/badge/Production-Live_v2.5-blue.svg)](https://synaps-one.vercel.app)
[![Zero-Login Demo](https://img.shields.io/badge/Demo-Zero_Login_Mode-success.svg)](https://synaps-one.vercel.app/demo)
[![Powered by Google Gemini](https://img.shields.io/badge/AI-Google_Gemini_API-4285F4.svg)](https://ai.google.dev/)
[![Next.js 15](https://img.shields.io/badge/Framework-Next.js_App_Router-black.svg)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/novaecosystems-cloud/Synaps/blob/main/LICENSE)

**SYNAPS** is an enterprise-grade Decision Intelligence Operating System that transforms scattered contracts, financial ledgers, operational SOPs, and compliance records into clear, verifiable decisions backed by 100% line-level source citations.

---

## 🌐 Live Production Links

* **GitHub Repository**: [https://github.com/novaecosystems-cloud/Synaps](https://github.com/novaecosystems-cloud/Synaps)
* **Production Application**: [https://synaps-one.vercel.app](https://synaps-one.vercel.app)
* **Instant Guest / Demo Access**: [https://synaps-one.vercel.app/demo](https://synaps-one.vercel.app/demo) *(Unlocks Enterprise MAX Tier - 10,000 Credits/Day)*
* **Billing & Pre-Applied 30% Offer**: [https://synaps-one.vercel.app/dashboard/settings/billing](https://synaps-one.vercel.app/dashboard/settings/billing) *(Code: `LAUNCH100`)*

---

## ✨ Key Platform Capabilities

### 1. Evidentiary Grounding Engine (Powered by Google Gemini 1.5 Pro)
Every AI summary, decision recommendation, and contract delta report is mathematically anchored to exact line-level source citations (`[Page X, Line Y]`) in original uploaded files. If an answer cannot be proven by your documents, SYNAPS explicitly flags it.

### 2. 10-Agent AI Boardroom
Simulates executive C-Suite consensus with specialized AI agents powered by Gemini:
* **CEO Agent**: Strategic vision & business alignment
* **CFO Agent**: Cost overruns, cash flow, & price escalation risk auditing
* **CTO Agent**: Technical scaling & infrastructure feasibility
* **Legal Counsel Agent**: Regulatory compliance & contract liability
* **Risk Director Agent**: Operational risk mitigation & Monte Carlo forecasting

### 3. Digital Twin Risk Simulator & Monte Carlo Engine
Executes 10,000 probabilistic scenario runs for supply chain bottlenecks, cash-flow variance predictions, and capacity stress testing.

### 4. 3D Corporate Memory Graph
Visualizes complex document libraries (PDFs, DOCX, CSVs, XLSX) into an interactive 3D Knowledge Graph powered by WebGL/Three.js, revealing hidden dependencies and entity connections.

### 5. Instant Guest / Judge Unlocked Access
Clicking **`⚡ Instant Guest / Demo Sign In`** on `/login` or `/demo` instantly provisions an **Enterprise MAX Tier** session (10,000 Daily Credits) with 100% unlocked access to all Pro & MAX features for judges and reviewers.

---

## 🛠️ Tech Stack & AI Architecture

* **AI Intelligence**: Google Gemini 1.5 Pro & Gemini 1.5 Flash API (Google AI Studio)
* **Core Framework**: Next.js 15 (App Router, Server Components, SSR)
* **Design & Styling**: Anthropic Research Lab Design System (`Instrument Serif` & `Plus Jakarta Sans`), TailwindCSS, Framer Motion
* **3D Visualizations**: Three.js / WebGL
* **Database & ORM**: Neon PostgreSQL, Prisma ORM
* **Authentication**: Firebase Authentication (Google Cloud) with server-side cookie verification
* **Monetization**: Merchant of Record Integration with pre-applied 30% discount (`LAUNCH100`)

---

## ⚡ Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/novaecosystems-cloud/Synaps.git
cd Synaps
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration (`.env`)
Create a `.env` file in the root directory:
```env
DATABASE_URL="your-postgresql-database-url"
DIRECT_URL="your-direct-postgresql-url"
GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Run Database Migrations
```bash
npx prisma db push
```

### 5. Launch Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License & Ownership
Copyright © 2026 SYNAPS INC. Distributed under the MIT License.
