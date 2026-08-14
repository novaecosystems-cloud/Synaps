# Contributing to SYNAPS

Thank you for contributing to SYNAPS. This document outlines our development workflows, code style guidelines, and quality standards.

---

## 1. Development Principles

1. **Evidentiary Rigor:** Every AI feature must support grounding with exact line-level source citations. No unverified probabilistic shortcuts.
2. **Zero-Hallucination Math:** All numeric calculations must be processed through the Prime RLM engine in [`src/lib/prime-rlm.ts`](file:///D:/Synaps/src/lib/prime-rlm.ts).
3. **Data-As-A-Moat (DAAM) Adherence:** Ensure all clause processing strips PII before hashing and logs events to the cryptographic audit ledger.
4. **Clean Code & Type Safety:** 100% strict TypeScript typing. No untyped `any` in production domain engines.

---

## 2. Local Setup & Workflow

### 2.1 Prerequisites
* **Node.js:** v18.18.0 or higher (v20+ recommended)
* **Package Manager:** npm or pnpm
* **PostgreSQL Database:** NeonDB or local PostgreSQL instance

### 2.2 Setup Instructions
```bash
# 1. Clone the repository
git clone https://github.com/novaecosystems-cloud/Synaps.git
cd Synaps

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Push database schema
npx prisma db push

# 5. Start dev server
npm run dev
```

---

## 3. Database Schema Changes

When modifying `prisma/schema.prisma`:
* Never run destructive migrations in production without backup.
* Use `npx prisma db push` for development synchronization.
* Ensure all new models include appropriate indexes on `organizationId` and foreign keys.

---

## 4. Verification & Testing

Before submitting a pull request:
```bash
# Run TypeScript compilation check
npx tsc --noEmit --skipLibCheck

# Run Next.js build verification
npm run build

# Run live DAAM engine tests
curl http://localhost:3000/api/test/daam
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
By contributing to SYNAPS, you agree that your contributions will be licensed under the project's [MIT License](file:///D:/Synaps/LICENSE).
