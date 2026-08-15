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
];
