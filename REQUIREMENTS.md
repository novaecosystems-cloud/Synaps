# CAUSARIX™ Enterprise System Requirements & Invariants

> **System Target:** Institutional Multi-Agent Governance & Causal Decision OS  
> **Environment:** Next.js 16 (App Router / Turbopack), TypeScript 5, PostgreSQL / Prisma  

---

## 1. Non-Negotiable System Invariants

1. **Multi-Tenant Isolation:**
   * Every database query, document ingestion, graph extraction, and connector synchronization must strictly enforce `where: { organizationId }`.
   * No data from one tenant may ever leak into another organization's context.

2. **Zero-Fixation & Grounding Invariant:**
   * No static placeholder mock strings or synthetic counters in production interfaces.
   * If a connector or document list is empty, render a clean empty state.

3. **0.00% Math Drift Guarantee:**
   * All Structural Causal Model (SCM) equations and Box-Muller Gaussian sampling iterations must enforce double-precision arithmetic with machine-epsilon assertions ($Factual + CausalDelta = Counterfactual$).

4. **In-Flight AI Application Firewall (AI-WAF):**
   * All external AI prompts, webhooks, and outgoing payloads must pass through `inspectResponse()` in [`src/lib/ai-firewall.ts`](file:///D:/Synaps/src/lib/ai-firewall.ts).

5. **Hybrid Air-Gapped Privacy for Meeting Bots:**
   * The millisecond meeting speech transcripts are ingested into the database vault, an immediate `DELETE /v1/meetings/:id` command is dispatched to Vexa cloud servers to ensure zero third-party data retention.

6. **Delaware DGCL § 141 Cryptographic Audit Trail:**
   * All exported boardroom deliberation records and SCM simulations must carry a cryptographic SHA-256 Merkle root seal computed by [`src/lib/dgcl-merkle.ts`](file:///D:/Synaps/src/lib/dgcl-merkle.ts).

---

## 2. Infrastructure & Environment Checklist

| Requirement | Specification | Status |
| :--- | :--- | :--- |
| **Node.js Runtime** | Node.js v18.x / v20.x+ | ✅ Compatible |
| **TypeScript Strictness** | Strict typechecking with `npx tsc --noEmit` | ✅ 0 Errors |
| **Database Engine** | PostgreSQL (NeonDB) with pgvector / Prisma | ✅ Active |
| **Security Headers** | 2-year HSTS, CSP, X-Frame-Options: SAMEORIGIN | ✅ Active in middleware.ts |
| **Observability** | `/api/health` Telemetry Endpoint (DB latency, circuit breakers) | ✅ Active |
