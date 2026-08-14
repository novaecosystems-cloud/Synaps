# SYNAPS Platform Requirements Specification

> **Document Type:** Software Requirements Specification (SRS)  
> **Standard:** IEEE 830 / ISO/IEC/IEEE 29148  
> **Status:** Approved / Production  

---

## 1. System Overview & Objectives

SYNAPS is an Enterprise Decision Intelligence Platform designed to eliminate corporate data fragmentation, accelerate contract/audit lifecycles by 80%+, and provide mathematically verified decisions through a 10-Agent Boardroom architecture.

---

## 2. Functional Requirements (FR)

### FR-01: Evidentiary Document Ingestion & Vectorization
* **FR-01.1:** The system MUST parse and ingest PDF, DOCX, XLSX, CSV, and TXT files up to 500MB per file.
* **FR-01.2:** Documents MUST be chunked using contextual token boundary splitting with preserved hierarchical section metadata.
* **FR-01.3:** The system MUST support dense embeddings vectorization with cosine similarity retrieval.

### FR-02: 10-Agent Executive Boardroom Simulation
* **FR-02.1:** The system MUST orchestrate parallel asynchronous deliberations across 10 specialized C-Suite personas (CEO, CFO, CTO, Legal, Risk, COO, CMO, CISO, Compliance, Chief of Staff).
* **FR-02.2:** Deliberations MUST produce an aggregated Consensus Score ($0 - 100\%$), list of dissenting opinions, and dialectic counter-arguments.
* **FR-02.3:** Every claim produced by an agent MUST contain verifiable citations pointing to specific document coordinates.

### FR-03: Prime RLM Process-Outcome Mathematical Verification
* **FR-03.1:** All numeric computations (e.g. burn rates, liability caps, Monte Carlo risk ratios, timeline velocities) MUST pass through the Prime RLM engine.
* **FR-03.2:** Computations MUST return step-by-step verifiable proof chains with an enforced minimum confidence score threshold of $99.4\%$.

### FR-04: Data-As-A-Moat (DAAM) Engine
* **FR-04.1 (Clause Benchmarking):** The system MUST strip all PII (names, phone numbers, email addresses, financial amounts) before hashing and storing clauses.
* **FR-04.2 (Decision Memory):** User actions (`ACCEPTED`, `REJECTED`, `MODIFIED`) MUST be recorded to tune tenant-specific Prime RLM agent prompts.
* **FR-04.3 (Audit Ledger):** The system MUST maintain a cryptographically linked SHA-256 event ledger where each record hashes its predecessor (`previousHash` ➔ `currentHash`).
* **FR-04.4 (Domain Moat Profile):** The system MUST maintain a logarithmic `MoatScore` ($0 - 100$) reflecting data depth, processed volume, and organizational decision history.

### FR-05: 3D Spatial Knowledge Palace & Memory Graph
* **FR-05.1:** The frontend MUST render interactive WebGL/Three.js force-directed knowledge graphs showing cross-document entity relationships.
* **FR-05.2:** Nodes MUST support camera orbit, entity filtering, semantic search highlighting, and node expansion.

### FR-06: Export & Compliance Reporting
* **FR-06.1:** The platform MUST support 1-click export of Certified Master Legal SLA Packets in PDF and structured CSV formats.
* **FR-06.2:** PDF exports MUST include cryptographic verification timestamps, SHA-256 checksums, and audit trail tables.

---

## 3. Non-Functional Requirements (NFR)

### NFR-01: Performance & Latency
* **NFR-01.1 (Query Response):** Standard document Q&A queries MUST return initial streaming chunks within $\le 1.8\text{ seconds}$.
* **NFR-01.2 (Boardroom Synthesis):** Full 10-agent boardroom parallel synthesis MUST complete within $\le 12.0\text{ seconds}$.
* **NFR-01.3 (3D Graph Rendering):** 3D Memory Graph MUST sustain $\ge 60\text{ FPS}$ on standard hardware for graphs with up to 5,000 active nodes.

### NFR-02: Scalability & Reliability
* **NFR-02.1 (Availability):** System target availability of $99.95\%$ uptime across serverless edge deployments.
* **NFR-02.2 (Connection Resilience):** Database ORM layer MUST implement global singleton connection reuse to avoid pool exhaustion under peak concurrent load.
* **NFR-02.3 (Storage Failover):** Dual-storage abstraction MUST support seamless fallback between Supabase S3 storage and encrypted blob repositories.

### NFR-03: Security & Data Governance
* **NFR-03.1 (Encryption):** All data at rest MUST be encrypted with AES-256; data in transit MUST be encrypted with TLS 1.3.
* **NFR-03.2 (Tenant Isolation):** Multi-tenant data MUST be partitioned at the database query level via strict `organizationId` foreign key filters.
* **NFR-03.3 (Regulatory Standards):** Compliance with DPDP Act 2023 (India), GDPR (EU), and SOC2 Type II.

---

## 4. Integration Requirements
* **AI Providers:** Google Gemini 1.5 API, Vercel AI Gateway (GLM-5.2), OpenAI API, Anthropic via OpenRouter.
* **Authentication:** Firebase Auth (JWT / Session Cookie verification).
* **Payment & Merchant:** Merchant of Record API (LemonSqueezy) with automated credit allocation webhooks.
