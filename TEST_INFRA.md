# E2E Test Infra: Causarix Desktop Application

## Test Philosophy
- Opaque-box, requirement-driven testing. Derived from `ORIGINAL_REQUEST.md`.
- Verifies clean state purging, offline resilience, real-time WebGL shader rendering, visual fidelity, build exit codes, standalone executable creation, and navigation transitions.
- Methodology: 4-Tier Testing Model + Tier 5 Adversarial & Forensic Integrity Verification.

---

## Feature Inventory & Test Mapping
| # | Feature | Requirement | Tier 1 (Unit/Feature) | Tier 2 (Boundary/Corner) | Tier 3 (Cross-Feature) | Tier 4 (E2E Scenario) |
|---|---------|-------------|:---------------------:|:------------------------:|:----------------------:|:---------------------:|
| 1 | Stale Executable & Artifact Purge | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ | ✓ |
| 2 | Diagonal Chromatic Prismatic Shader | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| 3 | Glowing Cyan Logo Badge | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| 4 | Brand Typography & Subtitle | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| 5 | Multi-stage Progress & Status Ticker | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| 6 | Responsive "Skip Intro →" Button | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| 7 | Offline & Air-gapped Resilience | Survey Findings | 5 | 5 | ✓ | ✓ |
| 8 | Prisma Client Generation | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ | ✓ |
| 9 | Resource Staging Pipeline | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ | ✓ |
| 10 | Standalone Distribution Packaging | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ | ✓ |
| 11 | Root Executable & Batch Launcher | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ | ✓ |
| 12 | Runtime Governance & Single Instance Lock | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ | ✓ |

---

## Test Architecture
- **E2E Test Runner**: `node tests/e2e-runner.js` / test suite scripts.
- **Pass / Fail Semantics**: Zero exit code on full pass; non-zero on failure.
- **Assertions**:
  - File existence & non-zero byte size for `Causarix.exe`, `dist/Causarix-win32-x64/Causarix.exe`, `Launch-Causarix.bat`.
  - Shader structure: WebGL GLSL vertex & fragment shaders contain valid chromatic dispersion math and time uniform.
  - UI layout: HTML/CSS includes `#0D111A` container, `border-radius: 28px`, cyan glow, `CAUSARIX` 900 weight, status ticker messages.
  - Build pipeline: `scripts/build-desktop.js` and `scripts/package-exe.js` execute with exit code 0.
  - Navigation: verify URL transition to `http://localhost:3000/login` upon health check or skip button click.

---

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Target |
|---|----------|--------------------|--------|
| 1 | Cold Start with Stale Build Removal | F1, F8, F9, F10, F11 | Fresh clean build from purged state |
| 2 | Offline Desktop Launch | F2, F3, F4, F5, F7, F12 | Splashscreen renders WebGL without network |
| 3 | User Immediate Skip Intro Flow | F2, F6, F12 | Skip button click transitions immediately |
| 4 | Server Boot & Auto-Redirection Flow | F2, F5, F12 | Health poll transitions to login on HTTP 200 |
| 5 | Secondary Instance Launch Prevention | F12 | Single instance lock focuses primary window |

---

## Coverage Thresholds
- Tier 1: ≥5 per feature (Total: 60 tests)
- Tier 2: ≥5 boundary/edge tests per feature (Total: 60 tests)
- Tier 3: Pairwise cross-feature interactions (Total: 12 tests)
- Tier 4: ≥5 full lifecycle application scenarios
- Tier 5: Adversarial stress testing & Forensic Integrity Audit
