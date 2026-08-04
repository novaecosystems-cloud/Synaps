# 🧠 SYNAPS — Autonomous AI COO & Enterprise Intelligence System

> **Repository Location**: `D:\Synaps\`  
> **Production Deployment**: [synaps-one.vercel.app](https://synaps-one.vercel.app)  
> **Technology Stack**: Next.js 15 (App Router), TypeScript, Prisma ORM, PostgreSQL (pgvector), Tailwind CSS, GSAP 3D WebGL Animations, Google Gemini 2.0/2.5 Flash, ReAct Multi-Agent Engine.

---

## 📌 Executive Summary

**SYNAPS** is an autonomous enterprise AI Chief Operating Officer (AI COO) and 3D Decision Intelligence Platform designed to ingest massive enterprise document vaults, model organizational digital twins, run real-time risk simulations, and execute autonomous board-level decision-making.

---

## 🚀 Key Modules & System Architecture

```
                                  ┌────────────────────────────────────────┐
                                  │      SYNAPS 3D MEMORY LATTICE          │
                                  │  (pgvector + 3D Enterprise Memory Graph)│
                                  └───────────────────┬────────────────────┘
                                                      │
         ┌────────────────────────────────────────────┼────────────────────────────────────────────┐
         ▼                                            ▼                                            ▼
┌──────────────────┐                        ┌──────────────────┐                        ┌──────────────────┐
│  Phase 1 Engine  │                        │  Phase 2 Engine  │                        │ 10-Agent Board   │
│ Read Once+Remember│                        │ Agentic Doc Intel│                        │ Autonomous COO   │
└────────┬─────────┘                        └────────┬─────────┘                        └────────┬─────────┘
         │                                            │                                            │
 ┌───────┴───────┐                            ┌───────┴───────┐                            ┌───────┴───────┐
 │ • OCR/Parse   │                            │ • ReAct Loop  │                            │ • Chief of Stf│
 │ • Page Chunks │                            │ • 11 Tools    │                            │ • Risk Director│
 │ • Mini-Map    │                            │ • Risk Detector│                           │ • CFO/Legal AI│
 │ • Highlights  │                            │ • Auto-Citation│                           │ • Public APIs │
 └───────────────┘                            └───────────────┘                            └───────────────┘
```

---

## 📑 Phase 1 — Read Once + Remember (Foundational Ingestion & Viewer)

Phase 1 provides complete deep document parsing and instant page-level text search across multi-page contracts, spreadsheets, and legal documents.

### Key Capabilities:
- **One-Shot Ingestion**: PDF, DOCX, XLSX, and PPTX document parsing with page boundary markers (`[[PAGE_N]]`).
- **Page-Level Chunking**: Recursive character chunking maintaining page numbers, headings, and token counts.
- **Per-Document Deep Search** (`/api/documents/[id]/search`):
  - **Keyword Mode**: Exact term matches.
  - **Fuzzy Mode**: Trigram similarity for near-matches and typos.
  - **✦ AI Semantic Mode**: Cosine vector similarity via `pgvector` embeddings.
- **Page-Level Citations & Mini-Map**: Search results display exact page hits. Clicking a hit immediately navigates to that page with text highlighted in amber.
- **Multi-Document Search** (`/api/documents/search-across`): Searches across all documents in the organization, grouping hits by document with clickable page chips.
- **Entity Extraction** (`/api/documents/[id]/entities`): Extracts People, Organizations, Monetary Values, Dates, Emails, Key Legal Terms, and Table of Contents headings.

---

## 🤖 Phase 2 — Agentic Document Intelligence (ReAct Tool Router)

Phase 2 equips SYNAPS with a autonomous **Document Agent** built on a ReAct (Reasoning + Acting) loop. Rather than blindly dumping massive documents into an LLM, the agent dynamically decides which granular retrieval tool to invoke.

### Document Agent Tool Set (`src/lib/agents/document-agent.ts`):

| Tool | Functionality |
| :--- | :--- |
| `search_exact(query, docId?)` | Finds exact string occurrences in a document or organization vault with page numbers. |
| `search_fuzzy(query, docId?)` | Performs trigram fuzzy matching for misspelled terms or alternative naming. |
| `search_semantic(query, docId?)` | Searches conceptually using vector embeddings. |
| `search_page(docId, pageNumber)` | Retrieves text, sections, and metadata from page $N$. |
| `open_page(docId, pageNumber)` | Opens and formats page $N$ with evidence citation metadata. |
| `find_entity(query, docId?)` | Discovers specific executives, dates, monetary figures, or companies. |
| `find_all_occurrences(query)` | Searches every vault document for all occurrences of a term/company. |
| `extract_clause(clauseType, docId?)` | Extracts termination, indemnification, liability, warranty, SLA, or IP clauses. |
| `extract_table(docId, pageNumber?)` | Extracts tabular financial/numerical data structures. |
| `compare_documents(doc1Id, doc2Id)` | Performs side-by-side contract analysis comparing risks, clauses, and differences. |
| `cite_source(docId, pageN, snippet)` | Generates standardized evidence citations `[Document Name, p.63]`. |

### Advanced Reasoning Capabilities:
1. **Contract Risk Detection**: Identifies indemnification traps, uncapped liabilities, missing SLAs, auto-renewal traps, and jurisdiction hazards with severity levels (`HIGH`, `MEDIUM`, `LOW`).
2. **Timeline & Milestone Extraction**: Extracts dates, effective dates, cure periods, and deadlines into chronological timelines.
3. **Evidence-Backed Answers**: Every answer generated includes automatic citations `[Doc Name, p.63]` that deep-link to the exact page.
4. **Cross-Document Reasoning**: Evaluates relationships and contract differences across legacy vs new versions.

---

## 🏛️ Autonomous 10-Agent Boardroom & Executive Engine

SYNAPS includes a multi-agent executive boardroom representing corporate functions:

1. **Chief Executive Officer (CEO)** — High-level strategic alignment and final decision authority.
2. **Chief Operating Officer (COO)** — Operational efficiency, project velocity, and resource allocation.
3. **Chief Financial Officer (CFO)** — Financial burn rate, budget oversight, and revenue modeling.
4. **Chief Technology Officer (CTO)** — Technical stack architecture, infrastructure, and technical debt.
5. **Chief Risk Officer (CRO)** — Compliance, legal exposure, DPDP Act 2023 compliance, and vulnerability matrices.
6. **Chief Marketing Officer (CMO)** — Market positioning, growth analytics, and branding.
7. **Chief People Officer (CPO)** — Headcount allocation, team performance, and leadership health.
8. **General Counsel / Legal AI** — Contract review, non-competes, NDAs, and liability limits.
9. **Head of Product / Strategy** — Product roadmap, feature prioritization, and user requirements.
10. **Public APIs & Connectors Hub** — Real-time data connectors to external public APIs (via `public-apis` directory).

---

## 🌐 Public APIs Intelligence Hub

Integrated directory allowing the AI COO to query public APIs for real-time external data (weather, economics, market data, sports, transport, etc.) via `/dashboard/integrations`.

---

## 🔐 Security, Compliance & Multi-Tenant Isolation

- **DPDP Act 2023 Compliance**: Logging of data input timestamps, purpose tags, and consent tracking (`src/lib/dpdp-compliance.ts`).
- **Strict Multi-Tenant Isolation**: Database queries enforce `organizationId` matching on all documents, chunks, and decisions.
- **Auth & Keyring Security**: Server-side Firebase session verification with secure cookie encryption and rate-limiting (`src/lib/ratelimit.ts`).

---

## 📁 Key File Map

```
D:\Synaps\
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── agent/document/route.ts   <-- Phase 2 Document Agent Endpoint
│   │   │   ├── documents/[id]/
│   │   │   │   ├── search/route.ts        <-- Phase 1 Per-doc Search
│   │   │   │   ├── pages/route.ts         <-- Phase 1 Page Content Fetcher
│   │   │   │   └── entities/route.ts      <-- Phase 1 Entity Extractor
│   │   │   ├── documents/search-across/   <-- Phase 1 Cross-doc Search
│   │   │   ├── chat/route.ts              <-- Agentic Chat Assistant
│   │   │   └── public-apis/route.ts       <-- Public APIs Integration
│   │   └── dashboard/
│   │       ├── documents/
│   │       │   ├── page.tsx & client.tsx  <-- Document Vault with Cross-Search
│   │       │   └── [id]/
│   │       │       ├── page.tsx & client.tsx <-- Phase 1 Reader + Phase 2 AI Agent Drawer
│   │       └── integrations/              <-- Public APIs Hub
│   └── lib/
│       ├── agents/
│       │   ├── react-engine.ts            <-- ReAct Multi-Agent Engine
│       │   └── document-agent.ts          <-- Phase 2 Document Agent & 11 Tools
│       ├── chunking.ts                    <-- Page-aware Text Chunker
│       ├── pdfWorker.js                   <-- Page-marker PDF Extractor
│       ├── llm-router.ts                  <-- Multi-LLM Provider Failover (Gemini 2.0/2.5)
│       └── demo-data.ts                   <-- Hotel Company Pre-loaded Demo Docs
├── scripts/
│   └── check-api-health.js                <-- Automated API Provider Health Audit
└── SYNAPS_SYSTEM_DOCUMENTATION.md         <-- Main Documentation File
```

---

*Documentation generated for Synaps Enterprise Platform.*
