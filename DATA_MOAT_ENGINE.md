# DATA-AS-A-MOAT (DAAM) & 3D Knowledge Graph Specification

> **Engine Modules:** [`src/lib/data-moat-engine.ts`](file:///D:/Synaps/src/lib/data-moat-engine.ts), [`src/lib/memory-graph.ts`](file:///D:/Synaps/src/lib/memory-graph.ts)  
> **API Base Routes:** `/api/daam/*`, `/api/graph/*`, `/api/analytics/benchmarks`  

---

## 1. Executive Summary

**Data-As-A-Moat (DAAM)** is Causarix's compounding intelligence architecture. Unlike generic stateless AI wrappers, Causarix converts every uploaded contract, meeting transcript, and executive decision into an **accumulating, tenant-tuned organizational asset** visualized in an interactive 3D Spatial Knowledge Graph.

```
                        ┌────────────────────────────────────────┐
                        │   TENANT DOCUMENT / MEETING TRANSCRIPT │
                        └───────────────────┬────────────────────┘
                                            │
                ┌───────────────────────────┼───────────────────────────┐
                ▼                           ▼                           ▼
    ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
    │       PILLAR 1        │   │       PILLAR 2        │   │       PILLAR 3        │
    │ Anonymized Clause     │   │ Decision Memory &     │   │ 3D Spatial Knowledge  │
    │ Intelligence          │   │ Multi-Agent Feedback  │   │ Graph Lattice         │
    └───────────────────────┘   └───────────────────────┘   └───────────────────────┘
```

---

## 2. The 4 Compounding Pillars

### Pillar 1: Anonymized Clause Intelligence
* Ingests contract clauses and strips all PII (names, entities, monetary amounts).
* Computes real-time P50/P90 benchmarks against industry standard terms (liability caps, indemnities, payment milestones).

### Pillar 2: Decision Memory & C-Suite Tuning
* When executive directors accept, reject, or modify boardroom recommendations, their feedback is indexed into `DecisionMemoryEntry`.
* Future boardroom simulations adapt automatically to the organization's historic risk tolerance.

### Pillar 3: 3D Spatial Knowledge Graph
* Extracts entities (Suppliers, Covenants, Products, Legal Obligations) and directional dependencies into `GraphEntity` and `GraphRelationship`.
* Renders in an interactive Three.js 3D Memory Palace canvas with real-time force-directed clustering.

### Pillar 4: Immutable Delaware DGCL § 141 Ledger
* Maintains a mathematical proof chain of every analytical step taken on corporate data.
* Instant Merkle root verification ensures tamper-proof audit trails.

---

## 3. MoatScore Formula & Levels

$$\text{MoatScore} = \min\left(40, 20 \cdot \log_{10}(\text{Clauses} + 1)\right) + \min\left(40, 20 \cdot \log_{10}(\text{Decisions} + 1)\right) + \min\left(20, 5 \cdot \text{ComplianceFlags}\right)$$

* $\text{Score} \ge 70$: **FORTRESS** (Compounding institutional moat)
* $\text{Score} \ge 40$: **STRONG**
* $\text{Score} \ge 20$: **BUILDING**
* $\text{Score} < 20$: **EARLY_STAGE**
