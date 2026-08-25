# Contributing to CAUSARIX™

Thank you for contributing to CAUSARIX™ (powered by the Synaps Causal Intelligence Core). This document outlines development workflows, architectural invariants, code style guidelines, and verification standards.

---

## 1. Core Development Invariants

1. **Evidentiary Rigor & Line-Level Citations:** Every AI feature must support grounding with exact line-level source coordinates `[Page X, Line Y, SHA-256 Checksum]`. No ungrounded probabilistic assertions.
2. **Deterministic 0.00% Math Drift:** All numerical computations, sensitivity curves, and Monte Carlo Value-at-Risk simulations must run through the deterministic SCM / Box-Muller engine in [`src/lib/monte-carlo-engine.ts`](file:///D:/Synaps/src/lib/monte-carlo-engine.ts) with seeded Mulberry32 PRNG.
3. **Delaware DGCL § 141 Safe-Harbor Ledger:** All board decisions and simulations must produce canonical SHA-256 Merkle proofs via [`src/lib/dgcl-merkle.ts`](file:///D:/Synaps/src/lib/dgcl-merkle.ts).
4. **Data-As-A-Moat (DAAM) Adherence:** Ensure all clause processing strips PII before hashing and logs transactions to the cryptographic audit ledger.
5. **Strict Multi-Tenant Scoping:** Every database query must enforce `where: { organizationId }` scoping.
6. **AI Application Firewall (AI-WAF):** All model inputs and outputs must pass through `inspectPrompt()` and `inspectResponse()` in [`src/lib/ai-firewall.ts`](file:///D:/Synaps/src/lib/ai-firewall.ts).

---

## 2. Local Setup & Workflow

### 2.1 Prerequisites
* **Node.js:** v18.18.0 or higher (v20+ recommended)
* **Package Manager:** npm or pnpm
* **PostgreSQL Database:** NeonDB or local PostgreSQL with `pgvector` extension

### 2.2 Setup Instructions
```bash
# 1. Clone the repository
git clone https://github.com/novaecosystems-cloud/Synaps.git
cd Synaps

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local

# 4. Push database schema
npx prisma db push

# 5. Start dev server
npm run dev
```

---

## 3. Database Schema Changes

When modifying `prisma/schema.prisma`:
* Never execute destructive migrations in production without backup.
* Use `npx prisma db push` for local development synchronization.
* Ensure all new models include appropriate indexes on `organizationId` and foreign keys.

---

## 4. Verification & Testing Suites

Before submitting a pull request:
```bash
# 1. Verify strict TypeScript compilation
npx tsc --noEmit

# 2. Run Next.js build verification
npm run build

# 3. Execute 1,000-instance blinded empirical benchmark
node scripts/xprize-causal-benchmark-1000.mjs

# 4. Run full platform verification suite
node scripts/verify-synaps-full-suite.mjs
```

---

## 5. Commit Message Conventions

We follow Conventional Commits:
* `feat:` A new feature or capability
* `fix:` A bug fix or patch
* `docs:` Documentation updates
* `style:` Formatting, styling, and design polish
* `refactor:` Code refactoring without behavioral changes
* `perf:` Performance improvements
* `test:` Adding or updating tests

---

## 6. License
By contributing to CAUSARIX™, you agree that your contributions will be licensed under the project's [Commercial Proprietary License](file:///D:/Synaps/LICENSE).
