# 🤖 CAUSARIX™ Multi-Agent Digital Twins & Governance Invariants

This file documents the multi-agent digital twin architecture and execution rules for CAUSARIX™ (`D:\Synaps`).

---

## 1. The 10 Domain Executive Digital Twins

In the 10-Agent Boardroom, each digital twin independently evaluates strategic dilemmas from its specialized fiduciary lens:

| Agent Role | Title | Core Fiduciary & Strategic Mandate | Avatar Accent |
| :--- | :--- | :--- | :--- |
| **CEO** | Chief Executive Officer | Multi-year vision, capital allocation, shareholder value, and strategic roadmap. | `#fc4778` (Rose) |
| **CFO** | Chief Financial Officer | Cash-flow runway, EBITDA margin impact, debt covenant headroom, and valuation. | `#10b981` (Emerald) |
| **COO** | Chief Operating Officer | Supply chain continuity, vendor SLAs, cross-departmental handoffs, and fulfillment. | `#3b82f6` (Blue) |
| **CTO** | Chief Technology Officer | System architecture, 99.99% uptime, scalability, cybersecurity, and tech debt. | `#06b6d4` (Cyan) |
| **LEGAL** | General Counsel | Delaware DGCL § 141 safe-harbor compliance, liability caps, and indemnification. | `#f59e0b` (Amber) |
| **HR** | Chief People Officer | Headcount planning, executive retention, organizational culture, and compensation. | `#ec4899` (Pink) |
| **SALES** | VP of Global Sales | Enterprise pipeline velocity, CAC efficiency, churn risk, and quota realization. | `#ef4444` (Red) |
| **MARKETING** | Chief Marketing Officer | Brand positioning, enterprise cohort acquisition, PR narrative, and competitive moat. | `#eab308` (Yellow) |
| **OPS** | Director of Operations | Critical path execution, facility logistics, inventory buffers, and daily bottlenecks. | `#6366f1` (Indigo) |
| **COMPLIANCE** | Chief Compliance Officer | DPDP Act, GDPR, SOC 2, cross-border regulatory filings, and fiduciary oversight. | `#14b8a6` (Teal) |

---

## 2. Multi-Agent Dialectic Debate & Consensus Protocol

1. **Independent Evaluation:** Each executive twin receives the strategic query, retrieved document chunks from the vault, and SCM counterfactual distributions.
2. **Adversarial Dialectic:** Agents cross-examine opposing viewpoints (e.g. Sales velocity vs Legal liability vs CFO cash buffers).
3. **Consensus Synthesis:** The engine computes weighted consensus, key friction points, and actionable directives.
4. **Delaware DGCL § 141 Seal:** Director votes and rationales are committed to an immutable SHA-256 Merkle root.
5. **Action Task Dispatch:** Decisions automatically create mitigation tickets on Atlassian Jira Cloud (`CSX-XXX`).

---

## 3. Subagent Development Invariants

1. **Workspace & Branch Isolation:** Concurrent subagents operate in isolated workspaces (`Workspace: 'branch'`).
2. **File Scope Partitioning:** Subagents must strictly respect their assigned domain boundaries.
3. **Zero-Fixation & Grounding Invariant:** No synthetic mock strings or hardcoded answers. All outputs must be derived dynamically from organization documents or live inputs.
4. **Security & Redaction:** All outbound agent streams must pass through `inspectResponse()` in [`src/lib/ai-firewall.ts`](file:///D:/Synaps/src/lib/ai-firewall.ts).

---

## 4. Production Scaling Invariants (Vibecode-to-Enterprise Standard)

When implementing new features or refactoring, subagents must follow these five production rules:
1. **Durable Asynchronous Queues:** Long-running multi-agent loops (>15s) must not block synchronous serverless routes; dispatch via background jobs and stream updates via SSE/WebSockets.
2. **PostgreSQL RLS & Foreign Key Integrity:** Always enforce `organizationId` and verify parent user entities prior to document/task writes.
3. **Structured Zod Contracts:** All digital twin outputs must conform to validated Zod schemas (`response_format: { type: "json_schema" }`).
4. **Layout-Aware PDF Ingestion:** Ensure document chunking retains paragraph and page coordinate metadata for pinpoint citations.
5. **Air-Gapped Local Model Parity:** Ensure all features function seamlessly with local Ollama endpoints and within the Electron standalone executable.

---

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
