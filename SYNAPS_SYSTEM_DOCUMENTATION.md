# 🧠 SYNAPS — Autonomous AI COO & Enterprise Intelligence System

> **Repository Location**: `D:\Synaps\`  
> **Production Deployment**: [synaps-one.vercel.app](https://synaps-one.vercel.app)  
> **Technology Stack**: Next.js 15 (App Router), TypeScript, Prisma ORM, PostgreSQL (pgvector), Tailwind CSS, GSAP 3D WebGL Animations, Google Gemini 2.0/2.5 Flash, ReAct Multi-Agent Engine.

---

## 📌 Executive Summary

**SYNAPS** is an autonomous enterprise AI Chief Operating Officer (AI COO) and 3D Decision Intelligence Platform designed to ingest massive enterprise document vaults, model organizational digital twins, run real-time risk simulations, execute autonomous board-level decision-making, and perform hybrid web + document autonomous research.

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
│  Phase 1 Engine  │                        │  Phase 2 Engine  │                        │  Phase 3 Engine  │
│ Read Once+Remember│                        │ Agentic Doc Intel│                        │ Web+Doc Research │
└────────┬─────────┘                        └────────┬─────────┘                        └────────┬─────────┘
         │                                            │                                            │
 ┌───────┴───────┐                            ┌───────┴───────┐                            ┌───────┴───────┐
 │ • OCR/Parse   │                            │ • ReAct Loop  │                            │ • Web Agent   │
 │ • Page Chunks │                            │ • 11 Tools    │                            │ • Doc Agent   │
 │ • Mini-Map    │                            │ • Risk Detector│                           │ • Reasoning AI│
 │ • Highlights  │                            │ • Auto-Citation│                           │ • Dual-Citation│
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

Phase 2 equips SYNAPS with an autonomous **Document Agent** built on a ReAct (Reasoning + Acting) loop. Rather than blindly dumping massive documents into an LLM, the agent dynamically decides which granular retrieval tool to invoke.

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

---

## 🌐 Phase 3 — Web + Document + Autonomous Research

Phase 3 enables SYNAPS to leave internal document boundaries, research the outside world via the **Web Research Agent**, and combine internal vault contracts with external web findings via the **Cross-Domain Reasoning Agent**.

```
                 SYNAPS
                    │
           ┌────────┴────────┐
           ↓                 ↓
    DOCUMENT AGENT      WEB RESEARCH AGENT
   (Internal Vault)     (External Web/Cases)
           │                 │
           └────────┬────────┘
                    ↓
              REASONING AGENT
             (Synthesis Engine)
                    ↓
   Dual-Citations [Doc, p.N] + [Web Source](URL)
```

### Key Capabilities & Tools (`src/lib/agents/web-research-agent.ts` & `src/lib/agents/reasoning-agent.ts`):

1. **Web Research Agent Tools**:
   - `web_search(query)`: Live external web search for court judgments, company filings, news, and public benchmarks.
   - `fetch_web_article(url)`: HTML parsing and text extraction from external URLs.
   - `search_legal_precedents(caseName)`: Specialized legal precedent and case law lookup (e.g., "ABC v XYZ").
   - `research_company(companyName)`: Researches corporate background, litigation history, management risks, and SEC filings.
   - `find_clause_benchmarks(clauseType)`: Retrieves industry benchmark examples (standard, aggressive, defensive variants).

2. **Cross-Domain Reasoning Agent** (`runReasoningAgent`):
   - Synthesizes findings from **DocumentAgent** + **WebResearchAgent**.
   - Answers complex questions like:
     - *"Research ABC v XYZ and tell me what happened."* -> Builds case timeline, ruling, judgment, and authoritative web links.
     - *"Does that case affect this contract?"* -> Synthesizes uploaded contract text + court ruling, providing dual citations to both `[Uploaded Contract, p.14]` and `[Web Precedent: ABC v XYZ, URL]`.
     - *"Find similar cases / recent cases involving this issue."*
     - *"Compare our agreement against publicly available examples."*
     - *"Research this company and tell me whether anything should concern management."*

3. **API Endpoint & UI Routing**:
   - `POST /api/agent/research`: Dedicated multi-agent research endpoint.
   - `/api/chat`: Auto-detects research prompts and triggers `runReasoningAgent`.
   - Document Reader Sidebar (`/dashboard/documents/[id]`): Displays internal page citations + clickable external web source badges.

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
│   │   │   ├── agent/research/route.ts   <-- Phase 3 Web + Doc Research Endpoint
│   │   │   ├── agent/document/route.ts   <-- Phase 2 Document Agent Endpoint
│   │   │   ├── documents/[id]/
│   │   │   │   ├── search/route.ts        <-- Phase 1 Per-doc Search
│   │   │   │   ├── pages/route.ts         <-- Phase 1 Page Content Fetcher
│   │   │   │   └── entities/route.ts      <-- Phase 1 Entity Extractor
│   │   │   ├── documents/search-across/   <-- Phase 1 Cross-doc Search
│   │   │   ├── chat/route.ts              <-- Hybrid Multi-Agent Chat Assistant
│   │   │   └── public-apis/route.ts       <-- Public APIs Integration
│   │   └── dashboard/
│   │       ├── documents/
│   │       │   ├── page.tsx & client.tsx  <-- Document Vault with Cross-Search
│   │       │   └── [id]/
│   │       │       ├── page.tsx & client.tsx <-- Reader + Multi-Agent AI Drawer
│   │       └── integrations/              <-- Public APIs Hub
│   └── lib/
│       ├── agents/
│       │   ├── react-engine.ts            <-- ReAct Multi-Agent Engine
│       │   ├── document-agent.ts          <-- Phase 2 Document Agent & 11 Tools
│       │   ├── web-research-agent.ts      <-- Phase 3 Web Research Agent & Tools
│       │   └── reasoning-agent.ts         <-- Phase 3 Cross-Domain Reasoning Agent
│       ├── chunking.ts                    <-- Page-aware Text Chunker
│       ├── pdfWorker.js                   <-- Page-marker PDF Extractor
│       ├── llm-router.ts                  <-- Multi-LLM Provider Failover (Gemini 2.0/2.5)
│       └── demo-data.ts                   <-- Hotel Company Pre-loaded Demo Docs
├── scripts/
│   └── check-api-health.js                <-- Automated API Provider Health Audit
└── SYNAPS_SYSTEM_DOCUMENTATION.md         <-- Main Documentation File
```

---

*Documentation updated for Phase 3 — SYNAPS Enterprise Platform.*
