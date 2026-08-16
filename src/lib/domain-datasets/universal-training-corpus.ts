/**
 * SYNAPS UNIVERSAL PRE-TRAINED DOMAIN CORPUS
 * Rigorous real-world training datasets across Corporate Law, Finance, Tech Architecture, and Enterprise Strategy.
 * Embedded directly into Synaps AI Agent reasoning chains for out-of-the-box domain mastery.
 */

export interface DomainCorpus {
  domain: string;
  sourcePrecedents: string[];
  mandatoryRules: string[];
  antiPatterns: string[];
  benchmarks: Record<string, string>;
}

export const UNIVERSAL_DOMAIN_CORPUS: Record<string, DomainCorpus> = {
  LEGAL: {
    domain: 'Corporate Law, Contracts & Compliance',
    sourcePrecedents: [
      'American Bar Association (ABA) Model Commercial Agreements',
      'Delaware General Corporation Law (DGCL) § 102(b)(7) & § 141 Fiduciary Standards',
      'SEC EDGAR Material Contract Disclosures (Item 601)',
      'SOC-2 Type II Trust Services Criteria & ISO/IEC 27001:2022 Controls'
    ],
    mandatoryRules: [
      'Indemnification Must Be Bilateral & Capped: Never accept unilateral third-party indemnity without an aggregate liability cap equal to 12 months fees paid.',
      'Auto-Renewal Lock-Ins: Require minimum 60-day written notice prior to automatic renewal terms exceeding 12 months.',
      'Intellectual Property Ownership: Explicitly preserve background IP; customer data and customized deliverables must vest exclusively in the enterprise.',
      'Governing Law & Dispute Forum: Insist on Delaware or New York jurisdiction with mandatory mediation prior to litigation.',
      'Audit & Termination Rights: Enforce 30-day notice for material breach with right to immediate termination for data privacy violations.'
    ],
    antiPatterns: [
      'Uncapped consequential, punitive, or indirect damages clauses.',
      'Unilateral price escalation rights without 90-day prior written consent.',
      'Indefinite non-compete clauses that restrict standard hiring practices.',
      'Vague force majeure clauses that excuse SLA non-performance for cloud hosting.'
    ],
    benchmarks: {
      'Standard Mutual Liability Cap': '1x to 2x Annual Contract Value (ACV)',
      'Standard Notice for Termination': '30 to 60 Days Written Notice',
      'SLA Downtime Penalty Threshold': '99.9% Uptime (> 43.8m downtime triggers 10% credit)'
    }
  },

  FINANCE: {
    domain: 'Corporate Finance, Valuation & Capital Allocation',
    sourcePrecedents: [
      'Financial Accounting Standards Board (FASB) ASC 606 Revenue Recognition',
      'CFA Institute Capital Budgeting & Valuation Principles',
      'Goldman Sachs & Morgan Stanley Technology Equity Research Metrics',
      'IFRS 16 Lease Accounting & Working Capital Management Standards'
    ],
    mandatoryRules: [
      'CAC Payback Horizon: Customer Acquisition Cost (CAC) payback must amortize within 12 months for enterprise accounts.',
      'Unit Economics Ratio: Lifetime Value (LTV) to CAC ratio must exceed 3.5x to justify accelerated sales investment.',
      'Net Revenue Retention (NRR): Enterprise SaaS accounts must maintain > 115% NRR to demonstrate product expansion moat.',
      'Rule of 40: Combined Annual Revenue Growth Rate + Free Cash Flow Margin must exceed 40%.',
      'Cash Runway Buffer: Maintain minimum 18 months of operational runway under conservative stress-test conditions.'
    ],
    antiPatterns: [
      'Front-loading recognized revenue on multi-year contracts prior to delivery (ASC 606 violation).',
      'Capitalizing operational software expenses without clear long-term utility.',
      'Over-relying on single-customer revenue (> 15% ARR concentration risk).'
    ],
    benchmarks: {
      'Enterprise SaaS Gross Margin': '75% to 85%',
      'Magic Number (Sales Efficiency)': '> 0.75 (Net New ARR / Prior Quarter S&M Spend)',
      'Operating Cashflow Conversion': '> 80% of EBITDA'
    }
  },

  TECH: {
    domain: 'Systems Architecture, Cybersecurity & High-Throughput Engineering',
    sourcePrecedents: [
      'NIST SP 800-207 Zero Trust Architecture Guidelines',
      'Google Site Reliability Engineering (SRE) Error Budget Protocols',
      'Cloud Native Computing Foundation (CNCF) High-Availability Patterns',
      'OWASP Top 10 Enterprise API Security Standards'
    ],
    mandatoryRules: [
      'Zero Cloud Data Leakage: All PII and confidential enterprise text must be processed in SOC-2 compliant ephemeral memory without external model training.',
      'Availability SLA: Production endpoints must guarantee 99.95% uptime with automated multi-region failover.',
      'Sub-200ms Latency Bounds: Edge caching and vector retrieval must complete within 150ms P99 latency.',
      'Cryptographic Integrity: All audit logs, documents, and redlines must maintain SHA-256 checksum audit trails.'
    ],
    antiPatterns: [
      'Hardcoding API keys or secrets in source code or client bundles.',
      'Unindexed SQL foreign keys causing N+1 query table locks.',
      'Single points of failure (SPOF) in upstream cloud providers.'
    ],
    benchmarks: {
      'Vector Search Latency (pgvector)': '< 45ms P95',
      'API Error Rate Threshold': '< 0.01% of requests',
      'Mean Time to Recovery (MTTR)': '< 15 minutes'
    }
  },

  STRATEGY: {
    domain: 'Enterprise Strategy, Moats & C-Suite Governance',
    sourcePrecedents: [
      'Harvard Business School & Stanford GSB Competitive Strategy Cases',
      'Hamilton Helmer "7 Powers: The Foundations of Business Strategy"',
      'Michael Porter "Competitive Advantage & Value Chain Analysis"',
      'McKinsey & Bain Post-Merger Integration (PMI) Playbooks'
    ],
    mandatoryRules: [
      'Defensive Moat Identification: Must verify at least 2 structural moats (Network Effects, Switching Costs, Counter-Positioning, Scale Economies).',
      'Data-As-A-Moat (DAAM): Proprietary user data must compound to make future model recommendations strictly superior to generic competitors.',
      'Pricing Power: Core value proposition must enable minimum 5-10% annual price escalations without churn.',
      'Dialectic Stress-Testing: Major M&A and capital allocations must survive a 10-Agent Boardroom vote before approval.'
    ],
    antiPatterns: [
      'Competing purely on price against well-capitalized incumbents.',
      'Expanding into adjacent markets without securing core retention.',
      'Undertaking acquisitions without a 100-day unified tech stack integration plan.'
    ],
    benchmarks: {
      'Customer Logo Churn Target': '< 5% Annually',
      'Pricing Power Retention': '> 95% Renewal Rate after 10% price lift',
      'Organic Expansion Revenue': '> 20% of New ARR from existing accounts'
    }
  }
};

import { SynapsPersistentKnowledgeEngine } from './global-enterprise-encyclopedia';

/**
 * Returns formatted training context for a specific executive role, enriched with global multi-jurisdiction & industry knowledge
 */
export function getDomainTrainingContext(role: string, queryContext: string = '', userJurisdiction: string = 'UNITED_STATES'): string {
  const r = (role || '').toUpperCase();

  let corpusKeys = ['STRATEGY'];
  if (r.includes('LEGAL') || r.includes('RISK') || r.includes('COUNSEL')) {
    corpusKeys = ['LEGAL', 'STRATEGY'];
  } else if (r.includes('CFO') || r.includes('FINANCE') || r.includes('ACCOUNTING')) {
    corpusKeys = ['FINANCE', 'STRATEGY'];
  } else if (r.includes('CTO') || r.includes('CISO') || r.includes('TECH') || r.includes('SECURITY')) {
    corpusKeys = ['TECH', 'LEGAL'];
  } else if (r.includes('CEO') || r.includes('COO') || r.includes('PRESIDENT')) {
    corpusKeys = ['STRATEGY', 'FINANCE', 'LEGAL'];
  }

  const corpora = corpusKeys.map(k => UNIVERSAL_DOMAIN_CORPUS[k]).filter(Boolean);

  let formatted = `\n═══════════════════════════════════════════════════════════════════════\nPRE-TRAINED ENTERPRISE DOMAIN KNOWLEDGE (GOLDEN INDUSTRY CORPUS):\n`;

  for (const c of corpora) {
    formatted += `\n[DOMAIN: ${c.domain.toUpperCase()}]\n`;
    formatted += `• Golden Precedents: ${c.sourcePrecedents.join(' | ')}\n`;
    formatted += `• Mandatory Decision Rules:\n  - ${c.mandatoryRules.join('\n  - ')}\n`;
    formatted += `• Anti-Patterns to Reject:\n  - ${c.antiPatterns.join('\n  - ')}\n`;
    formatted += `• Key Industry Benchmarks:\n`;
    for (const [k, v] of Object.entries(c.benchmarks)) {
      formatted += `  - ${k}: ${v}\n`;
    }
  }
  formatted += `═══════════════════════════════════════════════════════════════════════\n`;

  // Attach dynamic multi-jurisdictional & industry vertical intelligence
  formatted += SynapsPersistentKnowledgeEngine.getMasterTrainingDataset(queryContext || role, userJurisdiction);

  return formatted;
}

