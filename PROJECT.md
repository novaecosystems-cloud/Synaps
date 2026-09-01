# Project: Causarix Enterprise Production Scaling

## Architecture
Causarix is an enterprise sovereign decision OS built with Next.js, TypeScript, PostgreSQL (Prisma ORM), Structural Causal Model (SCM) simulation kernels, and a 10-agent executive digital twin boardroom.

### Core Architectural Subsystems:
1. **Boardroom & Real-Time Streaming Subsystem (`src/app/api/boardroom/stream/`, `src/lib/executive-board.ts`)**:
   - Real-time Server-Sent Events (SSE) route at `/api/boardroom/stream` delivering incremental agent thoughts, token deltas, and board synthesis.
   - High-throughput parallel/batched execution (Phase 1 analytical twins, Phase 2 strategic twins) eliminating serverless execution timeouts (>15s).
   - 3000ms heartbeat keepalive pings (`: ping\n\n` / `event: heartbeat`) preventing edge gateway and reverse proxy disconnects.
   - Durable background queue session manager supporting reconnection by `sessionId`/`jobId`.

2. **Multi-Tenant & Row-Level Security (RLS) Subsystem (`prisma/`, `src/lib/prisma.ts`, `src/lib/db-rls.ts`)**:
   - Engine-level multi-tenant isolation enforcing `organizationId` across all Prisma models (`Document`, `DecisionRecord`, `SimulationResult`, `Connector`, `DocumentChunk`, `Project`, etc.).
   - PostgreSQL RLS policy migration definitions with tenant isolation security guarantees.
   - Parent entity resolution and foreign key integrity safeguards preventing P2003 runtime exceptions.

3. **Domain Executive Twins & Strict Zod Schema Subsystem (`src/lib/executive-board.ts`, `src/lib/schemas/boardroom-schema.ts`)**:
   - 10 canonical domain executive twins: CEO (Eleanor Vance), CFO (Marcus Sterling), CTO (Dr. Aris Thorne), General Counsel / LEGAL (Victoria Hayes), CMO (Julian Mercer), CRO (Rachel Ross), CPO (Sarah Chen), CHRO (David Miller), CIO (Kevin Durant), CISO (Elena Rostova).
   - Strict Zod schemas (`ExecutiveAgentAnalysisSchema`, `BoardSynthesisSchema`, `BoardMeetingResultSchema`) validating structured outputs.
   - Multi-stage deterministic JSON repair loop: markdown stripping, syntax fixing, AST infill, and deterministic 1-shot repair.

4. **Layout-Aware Evidentiary PDF Ingestion Subsystem (`src/lib/pdf-parser.ts`, `src/lib/chunking.ts`)**:
   - Unified `src/lib/pdf-parser.ts` extracting text, layout matrices, token maps, and bounding box coordinates (`x`, `y`, `width`, `height`, `page`).
   - Evidentiary chunker in `src/lib/chunking.ts` tracking `pageNumber`, `chunkIndex`, `tokenCount`, `paragraphIndex`, `startCharIndex`, and `endCharIndex` for pinpoint courtroom citations.

5. **AI Application Firewall & Zero-Drift SCM Kernel Subsystem (`src/lib/ai-firewall.ts`, `src/lib/causal/structural-causal-model.ts`, `src/lib/monte-carlo-engine.ts`, `src/lib/dgcl-merkle.ts`)**:
   - Bi-directional AI Application Firewall: Ingress prompt injection defense, egress secret & PII scrubbing (SSN, credit cards, phone numbers, API keys), and streaming chunk redaction.
   - SCM kernel with Pearl's 3-step do-calculus, seeded PRNG (Mulberry32), and deterministic Box-Muller Gaussian sampling achieving verified 0.00% cross-run drift.
   - Delaware DGCL § 141 cryptographic Merkle tree root hash verification.

6. **Automated 5-Tier Testing & Verification Infrastructure (`tests/run-all-tests.js`, `tests/`)**:
   - Comprehensive test suite covering Tiers 1–5 for all enterprise scaling features R1–R5.
   - Strict `npx tsc --noEmit` zero-error compilation across the entire codebase.

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Boardroom SSE Stream Route | `/api/boardroom/stream` endpoint delivering live agent deliberations & token deltas | M1 | ORIGINAL_REQUEST R1 |
| 2 | Durable Deliberation Queue & Timeout Defense | Batched twin execution and SSE heartbeat keepalive eliminating >15s timeouts | M1 | ORIGINAL_REQUEST R1 |
| 3 | 10 Canonical Domain Executive Twins | CEO, CFO, CTO, General Counsel, CMO, CRO, CPO, CHRO, CIO, CISO personas & prompts | M1 | ORIGINAL_REQUEST R3 |
| 4 | Strict Zod Schema Enforcement | Runtime schema validation for executive analyses and boardroom synthesis | M1 | ORIGINAL_REQUEST R3 |
| 5 | Multi-Stage JSON Repair Loop | Markdown stripper, syntax cleaner, AST default infill, and deterministic 1-shot repair | M1 | ORIGINAL_REQUEST R3 |
| 6 | PostgreSQL Row-Level Security (RLS) | SQL migrations and policies enforcing tenant isolation per organizationId | M2 | ORIGINAL_REQUEST R2 |
| 7 | Multi-Tenant Prisma Query Hardening | Strict organizationId filtering on all Document, DecisionRecord, SimulationResult, Connector queries | M2 | ORIGINAL_REQUEST R2 |
| 8 | Parent Entity Resolution & FK Safety | Safe organizationId resolution and fallback handling preventing P2003 FK violations | M2 | ORIGINAL_REQUEST R2 |
| 9 | Delaware DGCL § 141 Merkle Verification | Pure JS SHA-256 Merkle tree root computation and cryptographic boardroom verification | M2 | ORIGINAL_REQUEST R2 / DGCL |
| 10 | Layout-Aware PDF Parser Module | `src/lib/pdf-parser.ts` extracting text, layout matrices, token maps, and bounding boxes | M3 | ORIGINAL_REQUEST R4 |
| 11 | Evidentiary Vector Chunking | `src/lib/chunking.ts` with pageNumber, chunkIndex, tokenCount, paragraph & character offsets | M3 | ORIGINAL_REQUEST R4 |
| 12 | Bi-Directional AI Firewall & PII Redactor | Ingress injection defense, egress secret/PII redaction, streaming buffer sanitizer | M3 | ORIGINAL_REQUEST R5 |
| 13 | Zero-Drift SCM Box-Muller Kernel | Seeded PRNG + Box-Muller Gaussian sampling with verified 0.00% arithmetic drift | M3 | ORIGINAL_REQUEST R5 |
| 14 | 5-Tier Automated Test Suite Expansion | Full coverage across Tiers 1-5 in `tests/run-all-tests.js` for R1-R5 | M4 | Acceptance Criteria |
| 15 | TypeScript Zero-Error Guarantee | `npx tsc --noEmit` clean compilation across all modules | M4 | Acceptance Criteria |
| 16 | Forensic Integrity Audit | Systematic checks ensuring zero mock facades or bypassed logic | M5 | Integrity Forensics |

---

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Boardroom Streaming & Zod Executive Twins | `/api/boardroom/stream`, 10 twin personas, Zod schemas, JSON repair loop, heartbeat | none | DONE |
| M2 | Multi-Tenant PostgreSQL RLS & DGCL 141 Merkle Engine | Prisma schema/query hardening, RLS SQL policies, FK safety, Merkle tree verification | none | DONE |
| M3 | Layout-Aware PDF Ingestion, AI Firewall & Zero-Drift SCM | `src/lib/pdf-parser.ts`, `src/lib/chunking.ts`, PII/secret firewall, seeded Box-Muller SCM | none | IN_PROGRESS |
| M4 | 5-Tier Automated Test Suite & Integration | Comprehensive Tier 1-5 tests in `tests/`, `tests/run-all-tests.js`, `npx tsc --noEmit` | M1, M2, M3 | PLANNED |
| M5 | Adversarial Hardening & Forensic Integrity Audit | Challenger stress tests, Forensic Auditor clean verdict, Final Sign-Off | M4 | PLANNED |

---

## Interface Contracts

### Boardroom SSE Streaming Contract (`/api/boardroom/stream`)
- **Protocol**: Server-Sent Events (`text/event-stream; charset=utf-8`)
- **Headers**: `Cache-Control: no-cache, no-transform`, `Connection: keep-alive`, `X-Accel-Buffering: no`
- **Events**: `session_init`, `heartbeat`, `agent_start`, `agent_delta`, `agent_complete`, `synthesis_start`, `synthesis_complete`, `dgcl_seal`, `done`, `error`

### Zod Schema Contract (`src/lib/schemas/boardroom-schema.ts`)
- `ExecutiveRoleSchema`: 10 canonical roles + legacy aliases (`normalizeExecutiveRole()`)
- `ExecutiveAgentAnalysisSchema`, `BoardSynthesisSchema`, `BoardMeetingResultSchema`
- 4-Stage JSON repair: `repairAndValidateJson(rawContent, schema, options)`

### Layout-Aware PDF & Chunking Contract
- `ParsedPdfLayout`: `{ text: string, pages: Array<{ pageNumber: number, text: string, items: Array<{ str: string, x: number, y: number, width: number, height: number }> }> }`
- `EvidentiaryChunk`: `{ text: string, pageNumber: number, chunkIndex: number, tokenCount: number, paragraphIndex: number, startCharIndex: number, endCharIndex: number, boundingBox?: { x: number, y: number, width: number, height: number } }`

### Multi-Tenant RLS & Query Contract
- All operations on `Document`, `DecisionRecord`, `SimulationResult`, `Connector`, `DocumentChunk` must include `where: { organizationId }` filter.
- Safe parent entity resolution: `ensureTenantHierarchy(organizationId, userId)` provisioning valid parent entities.

### AI Firewall Contract
- `inspectPrompt(prompt: string)`: `{ isAllowed: boolean, riskLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', flaggedReasons: string[], sanitizedPrompt: string }`
- `inspectResponse(output: string)`: `{ isSafe: boolean, sanitizedOutput: string, redactedCount: number, flaggedReasons: string[] }`
- Redacts: API keys (12 families) and PII (SSN, Credit Cards, Phone numbers).

### SCM Kernel Contract
- Deterministic PRNG: Mulberry32 initialized with integer/string seed.
- Box-Muller Transform: $Z = \sqrt{-2\ln(U_1)}\cos(2\pi U_2)$.
- Arithmetic drift: $\le 10^{-7}$ (0.00% drift across repeated identical seed evaluations).

---

## Code Layout
- `src/app/api/boardroom/stream/route.ts` — SSE Boardroom streaming endpoint
- `src/lib/executive-board.ts` — 10 executive twin personas, deliberation runner, batched execution, Zod validation, JSON repair
- `src/lib/schemas/boardroom-schema.ts` — Strict Zod schemas for boardroom deliberations
- `src/lib/prisma.ts` — Prisma client wrapper with tenant scoping and safe helpers
- `src/lib/db-rls.ts` — Transactional PostgreSQL RLS runner
- `src/lib/pdf-parser.ts` — Layout-aware PDF parser with coordinate extraction
- `src/lib/chunking.ts` — Evidentiary chunker with page, paragraph, offset, and bounding box metadata
- `src/lib/ai-firewall.ts` — Bi-directional AI Application Firewall (Prompt Injection, Secret & PII Redactor)
- `src/lib/causal/structural-causal-model.ts` — Structural Causal Model with Pearl's do-calculus
- `src/lib/monte-carlo-engine.ts` — Seeded PRNG & Box-Muller Monte Carlo simulation engine
- `src/lib/dgcl-merkle.ts` — Delaware DGCL § 141 Merkle tree cryptographic proof engine
- `src/app/api/compliance/dgcl-141/route.ts` — DGCL § 141 compliance route
- `prisma/schema.prisma` — PostgreSQL schema definitions
- `tests/run-all-tests.js` — Master 5-tier test runner
- `tests/` — Automated test suites for Tiers 1-5
