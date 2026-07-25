# Synaps AI — Grounded 3D Corporate Memory & 10-Agent C-Suite Platform

[![Production Live](https://img.shields.io/badge/Production-Live_v1.0-blue.svg)](https://synaps-one.vercel.app)
[![Zero-Login Demo](https://img.shields.io/badge/Demo-Zero_Login_Mode-success.svg)](https://synaps-one.vercel.app/demo)
[![Next.js 14](https://img.shields.io/badge/Framework-Next.js_14-black.svg)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Synaps AI is an enterprise-grade Grounded Corporate Memory and 10-Agent C-Suite Platform designed to transform complex document libraries into interactive 3D Knowledge Graphs and real-time executive consensus.

---

## Live Links
- **Production Web Application**: [https://synaps-one.vercel.app](https://synaps-one.vercel.app)
- **Zero-Login Interactive Demo**: [https://synaps-one.vercel.app/demo](https://synaps-one.vercel.app/demo)
- **Billing & Merchant Settings**: [https://synaps-one.vercel.app/dashboard/settings/billing](https://synaps-one.vercel.app/dashboard/settings/billing)

---

## Inspiration & Problem Statement
Synaps AI was inspired by the real-world operational challenges of managing a three-hotel hospitality business in India. Managing hospitality operations in emerging markets involves processing thousands of daily vendor invoices, local compliance filings, inventory logs, and guest reports. Manual document analysis consumes critical executive time.

Synaps evolved through three key phases:
1. **Data Connector Prototype**: Centralizing fragmented business records.
2. **Machine Learning Intelligence**: Integrating predictive occupancy and inventory forecasting models.
3. **Generative AI & Autonomous Agents**: Coupling an interactive 3D Knowledge Graph with a 10-Agent AI C-Suite Boardroom.

---

## Key Features

### 1. 3D Corporate Memory Graph
Visualizes complex document libraries (PDFs, DOCX, CSVs) into an interactive 3D Knowledge Graph powered by Three.js/WebGL, revealing hidden dependencies and entity connections.

### 2. 10-Agent AI C-Suite Boardroom
Simulates executive board consensus with specialized AI agents:
- CEO Agent: Strategic vision & business alignment
- CFO Agent: Cost overruns, cash flow, & financial risk analysis
- CTO Agent: Infrastructure scaling & technical feasibility
- Legal Counsel Agent: Regulatory compliance & contract liability
- HR Director Agent: Personnel impact & organizational change

### 3. Grounded Zero-Hallucination Engine
Every AI recommendation and summary is mathematically anchored to exact line-level source citations (`[Page X, Line Y]`) in original uploaded files.

### 4. Digital Twin Risk Simulator
Stress-tests operational bottlenecks, supplier delays, and financial risks before major decisions are finalized.

### 5. Production Monetization Infrastructure
Built-in LemonSqueezy Merchant of Record integration featuring HMAC SHA256 webhook signature verification for automated tier upgrades and 1-click real-money refunds.

---

## Tech Stack
- **Frontend**: Next.js 14 App Router, TypeScript, TailwindCSS, Three.js / WebGL
- **Database & ORM**: Neon PostgreSQL, Prisma ORM
- **Storage**: Supabase Dual Storage Abstraction Layer
- **Authentication**: Firebase Authentication with server-side cookie verification
- **AI Reasoning**: Google Gemini API & Groq Llama3
- **Monetization**: LemonSqueezy Merchant API with automated Webhook engine

---

## Local Development Setup

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/novaecosystems-cloud/Synaps.git
cd Synaps
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (`.env`):
```env
DATABASE_URL="your-postgresql-database-url"
DIRECT_URL="your-direct-postgresql-url"
GEMINI_API_KEY="your-gemini-api-key"
GROQ_API_KEY="your-groq-api-key"
LEMONSQUEEZY_API_KEY="your-lemonsqueezy-api-key"
LEMONSQUEEZY_STORE_ID="438754"
```

4. Run database migrations:
```bash
npx prisma db push
```

5. Start local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Timeline
- **Development Duration**: 12 Days (from initial architectural prototype to full production deployment & merchant monetization).

---

## License
MIT License. Built for the Hackathon.
