# Project: Causarix Desktop Application Rebuild

## Architecture
Causarix standalone desktop application is built with an Electron shell encapsulating a Next.js / React client, Node.js backend server with Prisma ORM, and real-time WebGL Three.js shaders.

### Core Architectural Layers:
1. **Desktop Shell (`electron/main.js`)**:
   - Manages single-instance lock (`requestSingleInstanceLock`).
   - Enables GPU hardware acceleration flags (`enable-webgl`, `ignore-gpu-blocklist`, `enable-gpu-rasterization`).
   - Spawns and manages internal Next.js dev/production server (`http://localhost:3000`).
   - Immediately presents a high-fidelity frameless/native splash window executing real-time Three.js chromatic/prismatic diagonal shader.
   - Monitors backend health via 400ms interval polling against `/api/offline/status`.
   - Transitions smoothly to `http://localhost:3000/login` upon backend readiness or immediate "Skip Intro →" user click.
2. **Splash Screen Engine**:
   - Inline HTML/WebGL container rendering Three.js custom `ShaderMaterial` on a full-viewport quad.
   - Chromatic dispersion mathematics simulating spectral refractive index separation (RGB splitting).
   - Glassmorphic glowing cyan logo badge (`#0D111A`, `border-radius: 28px`, cyan drop-shadow aura).
   - Typography: Bold `CAUSARIX` (weight 900, cyan text-shadow), `ADVANCED CAUSAL AI • TECHNOLOGIES` letter-spaced subtitle.
   - Multi-stage animated progress bar with diagnostic ticker.
   - Offline-resilient: embeds or packages local Three.js bundle and logo assets.
3. **Build & Distribution Pipeline (`scripts/`)**:
   - `scripts/build-desktop.js`: Prepares electron runtime staging area in `resources/app/`, copying `electron/`, assets, `public/`, and package descriptors.
   - `scripts/package-exe.js`: Bundles standalone distribution in `dist/Causarix-win32-x64/`, creates root `Causarix.exe`, and generates `Launch-Causarix.bat`.
   - Prisma ORM: Generates `prisma-client-js` artifacts.

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Stale Executable & Artifact Purge | Delete old Causarix.exe, dist/, dist-electron/, and ensure 0 file locks | M1 | ORIGINAL_REQUEST R1 |
| 2 | Diagonal Chromatic Prismatic Shader | Real-time WebGL Three.js shader with diagonal distortion and chromatic RGB aberration | M2 | ORIGINAL_REQUEST R2 |
| 3 | Glowing Cyan Logo Emblem Container | Rounded-square glassmorphic badge with cyan glow aura and official logo | M2 | ORIGINAL_REQUEST R2 |
| 4 | Brand Typography & Subtitle | 46px CAUSARIX (900 weight) + ADVANCED CAUSAL AI • TECHNOLOGIES subtitle | M2 | ORIGINAL_REQUEST R2 |
| 5 | Multi-stage Progress Bar & Status Ticker | Smooth progress bar with multi-stage causal graph verification status strings | M2 | ORIGINAL_REQUEST R2 |
| 6 | Responsive "Skip Intro →" Button | Glassmorphic button transitioning immediately to http://localhost:3000/login | M2 | ORIGINAL_REQUEST R2 |
| 7 | Offline / Air-Gapped Asset Resilience | Local Three.js & relative/data-uri logo paths avoiding network failure | M2 | Survey 2 & 3 |
| 8 | Prisma Client Generation | Execute `npx prisma generate` to produce fresh client bindings | M3 | ORIGINAL_REQUEST R3 |
| 9 | Resource Staging Pipeline | `scripts/build-desktop.js` syncing electron files, assets, and configs | M3 | ORIGINAL_REQUEST R3 |
| 10 | Standalone Distribution Packaging | `scripts/package-exe.js` creating `dist/Causarix-win32-x64/Causarix.exe` | M3 | ORIGINAL_REQUEST R3 |
| 11 | Root Executable & Launcher Generation | Fresh `D:\Synaps\Causarix.exe` and `Launch-Causarix.bat` | M3 | ORIGINAL_REQUEST R3 |
| 12 | Runtime Governance & Single Instance Lock | Single-instance lock, GPU acceleration switches, and error boundaries | M3 | ORIGINAL_REQUEST R3 |
| 13 | 60 FPS Performance & Transition Verification | Verify 60 FPS WebGL rendering without context crash, and seamless navigation | M4 | Acceptance Criteria |
| 14 | Forensic Integrity Verification | Audit code for authentic compilation without hardcoding or facades | M4 | Integrity Forensics |

---

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Stale Artifact Purge & State Reset | Delete Causarix.exe, dist/, dist-electron/, verify clean workspace | none | DONE |
| M2 | Chromatic Prismatic Splashscreen Hardening | Refine Three.js diagonal shader, glowing badge, typography, ticker, skip button, offline bundling | none | DONE |
| M3 | Clean Build Pipeline & Packaging | Prisma generate, TS verify, resource staging, standalone package creation, launcher generation | M1, M2 | DONE |
| M4 | E2E Verification & Forensic Integrity Audit | Opaque-box E2E validation, 60fps performance check, Challenger tests, Forensic Integrity Audit | M3 | DONE |

---

## Interface Contracts

### Desktop Shell ↔ Splashscreen Interface
- **Window Dimensions**: 1000 x 650 (or 960 x 580), frameless, transparent background, centered.
- **IPC Events**:
  - `splash-ready`: WebGL Three.js canvas initialized and animating.
  - `skip-intro`: Triggers immediate window redirection to `http://localhost:3000/login`.
- **Health Polling Protocol**:
  - GET `http://localhost:3000/api/offline/status` every 400ms.
  - Upon HTTP 200 OK -> transition splash to main dashboard view (`/login`).

### Packaging Pipeline Contract
- **Input Directory**: `D:\Synaps`
- **Resource Staging Destination**: `node_modules/electron/dist/resources/app/`
- **Output Executables**:
  - `D:\Synaps\dist\Causarix-win32-x64\Causarix.exe`
  - `D:\Synaps\Causarix.exe`
  - `D:\Synaps\Launch-Causarix.bat`
- **Exit Code Guarantee**: 0 on clean run.

---

## Code Layout
- `electron/main.js` — Main Electron process, splash HTML generation, window management, server process lifecycle.
- `scripts/build-desktop.js` — Resource synchronizer into Electron runtime.
- `scripts/package-exe.js` — Standalone distribution bundler and root launcher generator.
- `Launch-Causarix.bat` — Standalone root launcher script.
- `public/` — Static assets, logos (`causarix_logo.webp`, `synaps_logo.webp`).
- `src/` — Next.js application source code.
- `prisma/schema.prisma` — Database models and Prisma client definition.
