# CAUSARIX™ Security, Privacy & Compliance Architecture

> **Security Tier:** Institutional Enterprise Grade  
> **Compliance Standards:** Delaware DGCL § 141 · SOC 2 Type II · DPDP Act 2023 · GDPR · ISO/IEC 27001  

---

## 1. Zero-Trust & Zero-Knowledge Architecture

CAUSARIX™ is built on a defense-in-depth security model protecting executive board deliberations, proprietary contracts, and financial records:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       SECURITY & PRIVACY LAYERS                         │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. In-Transit Encryption: TLS 1.3 with Perfect Forward Secrecy          │
│ 2. At-Rest Encryption: AES-256 on PostgreSQL (NeonDB) and Object Vault  │
│ 3. In-Flight AI Firewall (AI-WAF): Secret & PII Scrubbing (inspectResponse)│
│ 4. Vexa Meeting Scribe: Zero-Retention Instant Remote Cloud Wipe        │
│ 5. Cryptographic Ledger: SHA-256 Merkle Trees & Delaware DGCL § 141     │
│ 6. Strict HTTP Headers: 2-Year HSTS Preload, CSP, X-Frame-Options: SAMEORIGIN │
│ 7. Tenant Isolation: Multi-Tenant Foreign-Key Partitioning (orgId)      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. In-Flight AI Application Firewall (AI-WAF)

Implemented in [`src/lib/ai-firewall.ts`](file:///D:/Synaps/src/lib/ai-firewall.ts), the AI Firewall protects both ingress and egress data streams:

1. **Ingress Protection (Prompt Firewall):**
   * Blocks prompt injection, jailbreaks (`DAN`, developer mode overrides), and persona hijacking.
   * Strips control tokens and probes attempting to extract system instructions or API keys.
2. **Egress Protection (Secret & PII Redaction):**
   * Automatically redacts API keys (OpenAI, Gemini, Resend, Twilio, Jira), database URLs, and private keys.
   * Redacts sensitive executive PII (credit cards, SSNs, phone numbers, email addresses) before database persistence.

---

## 3. Vexa Meeting Bot Hybrid Air-Gapped Privacy

When scribe bots join Google Meet, Zoom, or Teams:
1. Audio is transcribed in-flight.
2. Transcripts pass through `inspectResponse()` for PII and secret redaction.
3. Once vaulted in Causarix, an immediate `DELETE /v1/meetings/:id` call is dispatched to Vexa cloud servers to guarantee **zero third-party audio or transcript retention**.

---

## 4. Delaware DGCL § 141 Merkle Proof Integrity

Implemented in [`src/lib/dgcl-merkle.ts`](file:///D:/Synaps/src/lib/dgcl-merkle.ts):
* Computes deterministic SHA-256 Merkle root hashes for board meeting minutes, director votes, and counterfactual SCM simulations.
* Generates exportable, tamper-evident audit records establishing Delaware DGCL § 141(e) safe-harbor protections for corporate directors.

---

## 5. Security Contacts & Vulnerability Disclosure
* **Security & Compliance Office:** `novaecosystems@gmail.com`
* **Response SLA:** Within 24 hours for critical security inquiries.
