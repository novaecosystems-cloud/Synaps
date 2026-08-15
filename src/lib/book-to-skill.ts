/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SYNAPS BOOK & PLAYBOOK-TO-SKILL CONVERSION ENGINE (24X-51X TOKEN COMPRESSION)
 * ─────────────────────────────────────────────────────────────────────────────
 * Converts long-form PDFs, legal playbooks, and company handbooks into
 * deterministic, modular Agent Skills conforming to the AgentSkills standard.
 */

export interface SkillDecisionRule {
  id: string;
  ruleTitle: string;
  condition: string;
  actionRequired: string;
  riskIfIgnored: string;
}

export interface SkillAntiPattern {
  id: string;
  trap: string;
  whyItFails: string;
  correctApproach: string;
}

export interface SkillChapter {
  id: string;
  chapterNumber: number;
  title: string;
  summary: string;
  content: string;
  tokenCount: number;
}

export interface AgentSkillPackage {
  id: string;
  name: string; // e.g. "mna-liability-playbook"
  displayName: string; // e.g. "M&A Cross-Border Liability Playbook"
  version: string;
  category: 'LEGAL' | 'COMPLIANCE' | 'FINANCE' | 'OPERATIONS' | 'TECH';
  description: string;
  author: string;
  createdAt: string;
  sourceDocTitle: string;
  sourceTokensRaw: number;
  distilledTokens: number;
  compressionRatio: string; // e.g. "34.2x"
  skillMdContent: string;
  decisionRules: SkillDecisionRule[];
  antiPatterns: SkillAntiPattern[];
  chapters: SkillChapter[];
}

export const PRESET_SKILLS: AgentSkillPackage[] = [
  {
    id: 'skill_mna_diligence',
    name: 'mna-cross-border-playbook',
    displayName: 'Cross-Border M&A Diligence & Liability Playbook',
    version: '1.2.0',
    category: 'LEGAL',
    description: 'Deterministic legal rules and liability boundaries for evaluating $10M–$500M acquisition targets.',
    author: 'Synaps Legal Intelligence',
    createdAt: new Date().toISOString(),
    sourceDocTitle: 'Comprehensive M&A Diligence Manual (184 Pages).pdf',
    sourceTokensRaw: 74200,
    distilledTokens: 1850,
    compressionRatio: '40.1x',
    skillMdContent: `---
name: mna-cross-border-playbook
version: 1.2.0
description: "Deterministic legal diligence rules for evaluating acquisition targets, indemnification caps, and representation warranties."
tags: ["M&A", "Legal", "Liability", "Contracts"]
tokensBudget: 1850
---

# M&A Cross-Border Liability Skill

## Core Operating Principles
1. Never agree to uncapped indemnification. Maximum market standard is 10%–15% of enterprise purchase consideration.
2. Reps & Warranties survival window must be bounded between 12 to 18 months post-closing.
3. Fundamental representations (Title, Authorization, Capitalization) may survive for the statutory limitation period (3–5 years).

## Quick Invocation
- Query specific clauses with: \`/mna-cross-border-playbook [topic]\`
- Check liability thresholds with: \`/mna-cross-border-playbook liability-cap\`
`,
    decisionRules: [
      {
        id: 'rule_1',
        ruleTitle: 'Indemnification Cap Constraint',
        condition: 'Indemnity exposure is requested above 15% of transaction equity value.',
        actionRequired: 'Reject counter-term. Counter-propose strict 12.5% cap with a 0.5% basket/deductible.',
        riskIfIgnored: 'Exposes buyer to catastrophic post-close seller warranty breaches.',
      },
      {
        id: 'rule_2',
        ruleTitle: 'GPL Copyleft Software Contamination Audit',
        condition: 'Target software incorporates GPL v2/v3 or AGPL licensed libraries in core runtime.',
        actionRequired: 'Demand full code remediation and indemnity holdback escrow (minimum $2.5M) prior to closing.',
        riskIfIgnored: 'Forces open-sourcing of proprietary intellectual property under copyleft viral clauses.',
      },
      {
        id: 'rule_3',
        ruleTitle: 'Material Adverse Effect (MAE) Carve-outs',
        condition: 'Drafting closing conditions regarding economic or industry-wide market shifts.',
        actionRequired: 'Include standard carve-outs for general geopolitical, pandemic, and macroeconomic fluctuations unless disproportionately affecting target.',
        riskIfIgnored: 'Enables buyer walkaway risk during standard closing waiting periods.',
      },
    ],
    antiPatterns: [
      {
        id: 'anti_1',
        trap: 'Agreeing to joint-and-several liability across multiple minority shareholders.',
        whyItFails: 'Creates contentious post-close collection roadblocks and litigation stalemates.',
        correctApproach: 'Enforce pro-rata liability according to equity percentage ownership at closing.',
      },
      {
        id: 'anti_2',
        trap: 'Vague "Best Efforts" regulatory covenants instead of "Commercially Reasonable Efforts".',
        whyItFails: 'Can legally compel a party to divest core assets or spend unlimited capital to obtain antitrust clearance.',
        correctApproach: 'Use "Reasonable Best Efforts" paired with a clear "Hell-or-High-Water" cap.',
      },
    ],
    chapters: [
      {
        id: 'ch_1',
        chapterNumber: 1,
        title: 'Valuation & Price Adjustment Mechanisms',
        summary: 'Working capital pegs, lockbox mechanisms, and EBITDA earn-out structures.',
        content: 'Lockbox structures fix the economic purchase price at an audited locked-box date. Value leakage between locked-box date and closing must be indemnified euro-for-euro / dollar-for-dollar.',
        tokenCount: 420,
      },
      {
        id: 'ch_2',
        chapterNumber: 2,
        title: 'Indemnity, Escrow & Reps & Warranties Insurance (RWI)',
        summary: 'Escrow holdbacks, RWI policy exclusions, and de minimis claim thresholds.',
        content: 'De minimis threshold is set at 0.1% of purchase price. Claims below this threshold cannot be aggregated towards the tipping basket.',
        tokenCount: 580,
      },
    ],
  },
  {
    id: 'skill_dpdp_statutory',
    name: 'dpdp-statutory-compliance',
    displayName: 'DPDP Act 2023 Statutory Compliance Rulebook',
    version: '2.0.0',
    category: 'COMPLIANCE',
    description: 'MeitY statutory rules, 72-hour breach protocols, Section 12 user rights, and Data Protection Officer workflows.',
    author: 'Synaps Compliance OS',
    createdAt: new Date().toISOString(),
    sourceDocTitle: 'Digital Personal Data Protection Act Rules & Guidelines (94 Pages).pdf',
    sourceTokensRaw: 48900,
    distilledTokens: 1420,
    compressionRatio: '34.4x',
    skillMdContent: `---
name: dpdp-statutory-compliance
version: 2.0.0
description: "MeitY DPDP Act 2023 statutory mandates, consent records, and grievance escalation trees."
tags: ["DPDP", "Privacy", "Compliance", "India", "MeitY"]
tokensBudget: 1420
---

# DPDP Statutory Compliance Skill

## Mandates Summary
- Consent notices must be provided in English and 22 languages specified in the 8th Schedule of the Constitution.
- Data breaches must be reported to the Data Protection Board (DPB) and affected individuals within 72 hours.
- Maximum statutory financial penalty: ₹250 Crores per violation.
`,
    decisionRules: [
      {
        id: 'dpdp_rule_1',
        ruleTitle: 'Granular Notice & Purpose Limitation',
        condition: 'Collecting user personal data for onboarding, analytics, or transaction processing.',
        actionRequired: 'Present clear, standalone notice specifying exact purpose before requesting opt-in consent.',
        riskIfIgnored: 'Invalidates consent, triggering Section 33 financial penalty up to ₹250 Cr.',
      },
      {
        id: 'dpdp_rule_2',
        ruleTitle: 'Section 12 Right to Erasure Enforcement',
        condition: 'Data Principal submits verifiable deletion or withdrawal request.',
        actionRequired: 'Purge data from active databases within 30 days and cascade deletion notices to all verified sub-processors.',
        riskIfIgnored: 'Non-compliance finding by Data Protection Board of India.',
      },
    ],
    antiPatterns: [
      {
        id: 'dpdp_anti_1',
        trap: 'Pre-ticked consent checkboxes or bundled terms of service acceptance.',
        whyItFails: 'Deemed invalid under Section 6; consent must be free, specific, informed, and unambiguous.',
        correctApproach: 'Provide explicit, un-ticked affirmative checkboxes for each separate processing purpose.',
      },
    ],
    chapters: [
      {
        id: 'dpdp_ch_1',
        chapterNumber: 1,
        title: 'Consent Architecture & Consent Manager Integration',
        summary: 'Interoperable consent records, tokenization, and audit logs.',
        content: 'Consent artifacts must be stored as cryptographically signed JSON records with immutable timestamps and purpose IDs.',
        tokenCount: 450,
      },
    ],
  },
  {
    id: 'skill_google_cloud_waf',
    name: 'google-cloud-waf-security',
    displayName: 'Google Cloud Well-Architected Security & Reliability',
    version: '3.1.0',
    category: 'TECH',
    description: 'Official Google Cloud WAF Security pillar: Zero-Trust IAM, KMS envelope encryption, multi-region failover, and DDoS mitigation.',
    author: 'Google Agent Skills Standard',
    createdAt: new Date().toISOString(),
    sourceDocTitle: 'Google Cloud Architecture Framework: Security & Reliability (142 Pages).pdf',
    sourceTokensRaw: 62400,
    distilledTokens: 1650,
    compressionRatio: '37.8x',
    skillMdContent: `---
name: google-cloud-waf-security
version: 3.1.0
description: "Google Cloud Well-Architected Framework: Security, Reliability, and Zero-Trust architecture standards."
tags: ["GoogleCloud", "Security", "WAF", "ZeroTrust", "KMS"]
tokensBudget: 1650
---

# Google Cloud Well-Architected Security Skill

## Core Mandates
1. Principle of Least Privilege: Never assign primitive Owner/Editor roles in production. Use granular predefined IAM roles with Workload Identity Federation.
2. Encryption Everywhere: Enforce customer-managed encryption keys (CMEK) with Cloud KMS envelope encryption.
3. Resilience & Multi-Region: Production workloads must maintain active-passive or active-active failover with < 15 min RTO.
`,
    decisionRules: [
      {
        id: 'gcp_rule_1',
        ruleTitle: 'Zero-Trust IAM Privilege Boundary',
        condition: 'Configuring service accounts or user permissions in enterprise production projects.',
        actionRequired: 'Enforce Workload Identity Federation with short-lived OAuth tokens. Eliminate long-lived downloadable service account JSON keys.',
        riskIfIgnored: 'Hardcoded key leaks causing unauthorized data exfiltration.',
      },
      {
        id: 'gcp_rule_2',
        ruleTitle: 'CMEK Envelope Encryption at Rest',
        condition: 'Storing enterprise customer PII, corporate memory graphs, or financial ledger data.',
        actionRequired: 'Encrypt database storage and GCS buckets using Cloud KMS Customer-Managed Encryption Keys with 90-day automatic key rotation.',
        riskIfIgnored: 'Failure of SOC2 Type II and ISO 27001 regulatory compliance audits.',
      },
    ],
    antiPatterns: [
      {
        id: 'gcp_anti_1',
        trap: 'Using single-zone compute or database instances for mission-critical enterprise production.',
        whyItFails: 'Zonal maintenance or unexpected regional outages cause immediate application downtime.',
        correctApproach: 'Deploy regional high-availability clusters with automated multi-zone failovers.',
      },
    ],
    chapters: [
      {
        id: 'gcp_ch_1',
        chapterNumber: 1,
        title: 'Zero-Trust Security & Network Segmentation',
        summary: 'VPC Service Controls, Cloud Armor DDoS policies, and Identity-Aware Proxy.',
        content: 'VPC Service Controls create cryptographic perimeters around Google Cloud resources, preventing data exfiltration even if IAM credentials are compromised.',
        tokenCount: 480,
      },
    ],
  },
  {
    id: 'skill_google_analytics_api',
    name: 'google-analytics-data-api',
    displayName: 'Google Analytics 4 & Performance Telemetry',
    version: '2.4.0',
    category: 'OPERATIONS',
    description: 'Automated executive KPI tracking, conversion rate funnel analytics, and multi-channel attribution query generation.',
    author: 'Google Agent Skills Standard',
    createdAt: new Date().toISOString(),
    sourceDocTitle: 'Google Analytics Data API (GA4) Architecture & Reporting Guide.pdf',
    sourceTokensRaw: 38200,
    distilledTokens: 1100,
    compressionRatio: '34.7x',
    skillMdContent: `---
name: google-analytics-data-api
version: 2.4.0
description: "GA4 Data API dimensions, metrics, and automated executive cohort retention query generator."
tags: ["GoogleAnalytics", "GA4", "Telemetry", "Growth", "Marketing"]
tokensBudget: 1100
---

# Google Analytics 4 Performance Skill

## Executive Reporting Standards
- Always pair User Acquisition Cost (CAC) with 30-day and 90-day LTV Cohort Retention.
- Conversion events must be registered with exact transaction value currency parameters.
`,
    decisionRules: [
      {
        id: 'ga4_rule_1',
        ruleTitle: 'Event-Driven Conversion Attribution',
        condition: 'Measuring marketing pipeline ROI and subscription upgrades.',
        actionRequired: 'Query GA4 Data API using session-scoped and user-scoped dimension combinations to avoid double-counting.',
        riskIfIgnored: 'Distorted conversion attribution leading to misallocated marketing capital.',
      },
    ],
    antiPatterns: [
      {
        id: 'ga4_anti_1',
        trap: 'Aggregating distinct user counts across date ranges using simple addition.',
        whyItFails: 'Double counts returning users across day boundaries; overstates unique active users.',
        correctApproach: 'Query the distinct activeUsers metric across the full composite date range directly.',
      },
    ],
    chapters: [
      {
        id: 'ga4_ch_1',
        chapterNumber: 1,
        title: 'Executive Funnel Telemetry & Real-Time Monitoring',
        summary: 'Real-time telemetry, session engagement durations, and churn alerts.',
        content: 'Realtime reporting queries allow Chief of Staff to monitor spike anomalies and API latency degradation within 60 seconds of deployment.',
        tokenCount: 390,
      },
    ],
  },
];
