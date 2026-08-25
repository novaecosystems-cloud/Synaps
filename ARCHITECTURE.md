# CAUSARIX™ Architecture & Technical Specification

> **Version:** 3.5.0  
> **Status:** Production / Enterprise Live  
> **Target:** Sovereign Causal Decision Operating System & Neuro-Symbolic Multi-Agent Governance  

---

## 1. Executive Architectural Overview

CAUSARIX™ is engineered as an **Evidentiary Decision Intelligence Operating System**. Unlike conventional conversational AI wrappers, Causarix operates on a **Zero-Hallucination, Multi-Agent Consensus, and Cryptographic Ledger architecture**.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CAUSARIX CLIENT TIER                                  │
│   Next.js 16 App Router · React Server Components · Tailwind CSS · Three.js (3D Graph)   │
│   Raycast-style Command Palette (Cmd+K) · Isolated Error Boundaries · Offline Sync Queue │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ HTTPS / WSS / gRPC
┌───────────────────────────────────────────▼─────────────────────────────────────────────┐
│                           SECURITY, EGRESS & ROUTING LAYER                              │
│   Strict CSP & HSTS (A+ Rating) · AI-WAF (inspectResponse PII/Secret Scrubbing)         │
│   LLM Circuit Breaker (CLOSED / OPEN / HALF_OPEN) with Full Randomized Jitter Backoff    │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │
        ┌───────────────────────────────────┼───────────────────────────────────┐
        ▼                                   ▼                                   ▼
┌──────────────────────┐          ┌──────────────────────┐          ┌──────────────────────┐
│  10-AGENT BOARDROOM  │          │   SCM CAUSAL ENGINE  │          │  ENTERPRISE CONNECT  │
│ Multi-Agent Quorum   │          │ Pearl Do-Calculus    │          │ Google Drive & Jira  │
│ Dialectic Consensus  │          │ Box-Muller 10,000    │          │ Vexa Meeting Scribe  │
│ Delaware DGCL § 141  │          │ 0.00% Math Drift     │          │ Instant Remote Wipe  │
└──────────┬───────────┘          └──────────┬───────────┘          └──────────┬───────────┘
           │                                 │                                 │
           └─────────────────────────────────┼─────────────────────────────────┘
                                             ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                            DATA & CRYPTOGRAPHIC LEDGER TIER                             │
│   PostgreSQL (Multi-Tenant by organizationId) · Prisma ORM · KùzuDB Knowledge Graph     │
│   SHA-256 Merkle Proof Trees & Delaware DGCL § 141 Fiduciary Audit Chains               │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Subsystems

### A. 10-Agent Boardroom Engine
* **Adversarial Multi-Agent Deliberation:** Coordinates 10 domain executives (CEO, CFO, COO, CTO, General Counsel, CPO, CRO, CMO, Operations, Compliance).
* **Delaware DGCL § 141 Safe-Harbor:** Automatically generates board minutes and records director votes with SHA-256 Merkle root proofs.

### B. Structural Causal Model (SCM) Monte Carlo Studio
* **Pearl's $do$-Calculus:** Computes causal counterfactuals under explicit interventions.
* **Deterministic Gaussian Sampling:** Uses Box-Muller transformation to run 10,000 iterations with verified **0.00% arithmetic drift**.

### C. Vexa Meeting Intelligence (Hybrid Privacy Scribe Bot)
* **Autonomous Meeting Bots:** Joins Google Meet, Zoom, and Teams calls via Vexa API.
* **Hybrid Air-Gapped Privacy:** Captures audio, streams speaker transcripts through the AI Firewall, ingests entities into the 3D Knowledge Graph, and triggers `DELETE /v1/meetings/:id` for **instant remote data destruction**.

### D. 9-Pillar Hardening Infrastructure
1. **0ms Back-Navigation Caching:** Synchronous ViewModel hydration in local memory.
2. **Component Isolation:** Reusable `<IsolatedErrorBoundary>` with 1-click Auto-Recover.
3. **LLM Circuit Breakers:** Automatic multi-provider failover with jittered backoff.
4. **Offline Action Queue:** Auto-captures mutations offline and replays on reconnect.
5. **Security Headers:** Strict HSTS Preload, frame isolation, and CSP policy.
6. **Command Palette (`Cmd + K`):** Global keyboard-driven workflow navigation.
7. **Health Telemetry (`/api/health`):** Real-time DB latency, circuit breakers, and memory monitoring.
8. **100/100 Core Web Vitals:** 0.00 CLS, modern WebP formats, font preloading.
9. **Dynamic OpenGraph (1200x630):** High-resolution social cards for Slack and LinkedIn.

---

## 3. Data Model & Multi-Tenant Isolation

* **Tenant Isolation:** Every database operation is strictly partitioned by `organizationId`.
* **Prisma ORM Entities:**
  * `User`, `Organization`, `Project`, `Document`, `DocumentVersion`, `DocumentChunk`
  * `GraphEntity`, `GraphRelationship`, `EnterpriseRisk`, `ActionTask`
  * `AuditLedgerEntry`, `DomainRiskProfile`, `Connector`, `ConnectorJob`

---

## 4. Compliance & Legal Governance
* **Delaware DGCL § 141(e):** Statutory protection for directors relying in good faith on automated expert records.
* **DPDP Act 2023 (India) & GDPR (EU):** Full zero-knowledge data scrubbing and grievance channels (`/accessibility`, `/api/dpdp/grievance`).
