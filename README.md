# SYNAPS — Enterprise Decision Intelligence OS & Evidence Engine

[![Production Live](https://img.shields.io/badge/Production-Live_v2.4-blue.svg)](https://synaps-one.vercel.app)
[![Zero-Login Demo](https://img.shields.io/badge/Demo-Zero_Login_Mode-success.svg)](https://synaps-one.vercel.app/demo)
[![Next.js 15](https://img.shields.io/badge/Framework-Next.js_ App_Router-black.svg)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/novaecosystems-cloud/Synaps/blob/main/LICENSE)

**SYNAPS** is an enterprise-grade Decision Intelligence Operating System that transforms scattered contracts, financial ledgers, operational SOPs, and compliance records into clear, verifiable decisions backed by 100% line-level source citations.

---

## 🌐 Live Production Links

* **Production Application**: [https://synaps-one.vercel.app](https://synaps-one.vercel.app)
* **Anthropic-Style Overview**: [https://synaps-one.vercel.app/overview](https://synaps-one.vercel.app/overview)
* **Zero-Login Interactive Demo**: [https://synaps-one.vercel.app/demo](https://synaps-one.vercel.app/demo)
* **Billing & Pre-Applied 30% Offer**: [https://synaps-one.vercel.app/dashboard/settings/billing](https://synaps-one.vercel.app/dashboard/settings/billing) *(Code: `LAUNCH100`)*

---

## ✨ Key Platform Capabilities

### 1. Evidentiary Grounding Engine (Zero-Hallucination)
Every AI summary, decision recommendation, and contract delta report is mathematically anchored to exact line-level source citations (`[Page X, Line Y]`) in original uploaded files. If an answer cannot be proven by your documents, SYNAPS explicitly flags it.

### 2. Anthropic Research Lab Aesthetic
Redesigned with Anthropic's editorial typography (`Instrument Serif` paired with `Plus Jakarta Sans`), warm ivory paper tones (`#FBF9F5`), zero "vibecoded" fluff, crisp hairline borders, and an authentic Cookie Consent preferences banner.

### 3. 10-Agent AI Boardroom
Simulates executive C-Suite consensus with specialized AI agents:
* **CEO Agent**: Strategic vision & business alignment
* **CFO Agent**: Cost overruns, cash flow, & price escalation risk auditing
* **CTO Agent**: Technical scaling & infrastructure feasibility
* **Legal Counsel Agent**: Regulatory compliance & contract liability
* **Risk Director Agent**: Operational risk mitigation & Monte Carlo forecasting

### 4. 3D Corporate Memory Graph
Visualizes complex document libraries (PDFs, DOCX, CSVs, XLSX) into an interactive 3D Knowledge Graph powered by WebGL/Three.js, revealing hidden dependencies and entity connections.

### 5. Production Billing & Launch Offer (`LAUNCH100`)
Integrated Merchant of Record checkout with pre-applied **30% OFF Launch Discount** (`LAUNCH100`), automated webhook verification, and 1-click refund management.

---

## 🛠️ Tech Stack

* **Core Framework**: Next.js (App Router, Server Components, SSR)
* **Styling & Motion**: TailwindCSS, GSAP (ScrollTrigger & useGSAP), Framer Motion
* **Typography**: Google Fonts (`Instrument Serif`, `Plus Jakarta Sans`, `JetBrains Mono`)
* **3D Visualizations**: Three.js / WebGL
* **Database & ORM**: Neon PostgreSQL, Prisma ORM
* **Storage**: Supabase Dual Storage Layer
* **Authentication**: Firebase Authentication with server-side cookie verification
* **AI Intelligence**: Google Gemini API & Groq Llama3
* **Monetization**: Gumroad MoR & LemonSqueezy Webhook Engine

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
GROQ_API_KEY="your-groq-api-key"
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
