# 🧠 CAUSARIX™ — System Documentation & Engine Reference

> **Repository Location**: `D:\Synaps\`  
> **Production Deployment**: [causarix.vercel.app](https://causarix.vercel.app)  
> **Core Technology Stack**: Next.js 16 (App Router / Turbopack), TypeScript, Prisma ORM, PostgreSQL (NeonDB), Tailwind CSS, Three.js 3D WebGL, Google Gemini 2.5 Flash, Moonshot AI, Vexa Meeting Intelligence, Pyodide WASM.

---

## 🚀 Key Modules & System Architecture

```
                                  ┌────────────────────────────────────────┐
                                  │      CAUSARIX 3D MEMORY PALACE         │
                                  │   (PostgreSQL + 3D Knowledge Graph)    │
                                  └───────────────────┬────────────────────┘
                                                      │
         ┌────────────────────────────────────────────┼────────────────────────────────────────────┐
         ▼                                            ▼                                            ▼
┌──────────────────┐                         ┌──────────────────┐                         ┌──────────────────┐
│ 10-AGENT BOARD   │                         │ SCM CAUSAL STUDIO│                         │ HYBRID CONNECTORS│
│ CEO, CFO, Legal, │                         │ Pearl Do-Calculus│                         │ Google Drive,    │
│ Red Team Twins   │                         │ 0.00% Math Drift │                         │ Jira, Vexa Bot   │
└──────────────────┘                         └──────────────────┘                         └──────────────────┘
```

---

## 📁 Repository Directory Structure

```
D:\Synaps\
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── connectors/          <-- Google Drive, Jira, PMS, Vexa Meeting Scribe
│   │   │   ├── executive-board/     <-- 10-Agent Boardroom Deliberation API
│   │   │   ├── simulations/         <-- SCM Monte Carlo Causal Engine API
│   │   │   ├── graph/               <-- 3D Knowledge Graph API
│   │   │   ├── health/              <-- Enterprise Telemetry & Diagnostics API
│   │   │   └── og/                  <-- Dynamic OpenGraph (1200x630) Image API
│   │   ├── dashboard/
│   │   │   ├── boardroom/           <-- 10-Agent Boardroom & Vexa Dispatcher
│   │   │   ├── simulations/         <-- SCM Simulation Studio & Histogram
│   │   │   ├── graph/               <-- 3D Memory Palace
│   │   │   └── integrations/        <-- Enterprise Connectors Dashboard
│   │   ├── newsletter/              <-- Research Dispatches & Subscribe Portal
│   │   └── layout.tsx               <-- RootLayout with Preloaded Google Fonts & Cmd+K
│   ├── components/
│   │   ├── CommandPalette.tsx       <-- Executive Raycast/Linear Command Palette (Cmd+K)
│   │   ├── GlobalHotkeys.tsx        <-- Power-User Keyboard Shortcuts Listener
│   │   ├── ui/
│   │   │   ├── error-boundary.tsx   <-- IsolatedErrorBoundary with 1-Click Auto-Recover
│   │   │   └── skeleton.tsx         <-- Theme-Adaptive Boardroom & SCM Shimmer Skeletons
│   │   └── dashboard/
│   │       ├── VexaMeetingDispatchModal.tsx <-- Hybrid Privacy Meeting Bot Dispatcher
│   │       └── SampleScenarioTrigger.tsx    <-- 1-Click Executive Activation
│   └── lib/
│       ├── ai-firewall.ts           <-- AI-WAF Ingress/Egress Secret & PII Scrubber
│       ├── llm-router.ts            <-- Multi-Provider LLM Router with Circuit Breaker
│       ├── vexa-client.ts           <-- Vexa Bot Dispatch & Instant Remote Wipe
│       ├── dgcl-merkle.ts           <-- Delaware DGCL § 141 SHA-256 Merkle Proof Engine
│       ├── viewmodel-cache.ts       <-- 0ms Back-Navigation SWR/Memory Cache
│       ├── offline-sync-queue.ts    <-- Resilient Offline Action Queue & Auto-Replay
│       └── causal/
│           └── structural-causal-model.ts <-- SCM Engine with 0.00% Math Drift Assertion
├── .tasks/                          <-- Modular Subagent Task Prompts
├── public/                          <-- WebP Optimized Images & Static Assets
├── prisma/schema.prisma             <-- Multi-Tenant Database Schema
├── next.config.ts                   <-- Next.js Config with Security & Cache Headers
├── package.json                     <-- Scripts & Production Dependencies
└── README.md                        <-- System Overview & Quickstart Guide
```
