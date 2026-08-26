import { sha256Sync, MerkleTree } from '@/lib/dgcl-merkle';

export type TacticDomain = 'LEGAL' | 'FINANCE' | 'STRATEGY' | 'OPERATIONS' | 'TECH' | 'GOVERNANCE';
export type TacticStatus = 'ACTIVE' | 'UNDER_REVIEW' | 'LOCKED' | 'ARCHIVED';
export type DecisionAction = 'ACCEPTED' | 'REJECTED' | 'MODIFIED' | 'IGNORED';

export interface CorporateTactic {
  id: string;
  title: string;
  domain: TacticDomain;
  rule: string;
  triggerCondition: string;
  policyDirective: string;
  confidenceScore: number; // 0 - 100
  supportingDecisionsCount: number;
  status: TacticStatus;
  lastAlignedAt: string;
  alignedBy: string;
  merkleProofHash: string;
  notes?: string;
  precedents: { id: string; title: string; action: DecisionAction }[];
}

export interface DecisionLedgerItem {
  id: string;
  title: string;
  source: 'BOARDROOM' | 'SCM_SIMULATION' | 'DOCUMENT_REVIEW' | 'EXECUTIVE_PROPOSAL';
  domain: TacticDomain;
  action: DecisionAction;
  recommendation: string;
  problem: string;
  overrideReason?: string;
  quickTags?: string[];
  modifiedDirectives?: string;
  confidence: number;
  timestamp: string;
  actor: string;
  merkleRoot: string;
  leafHash: string;
  dgclCompliant: boolean;
  participants?: { name: string; role: string; verdict?: string }[];
  learnedTacticExtracted?: string;
  auditBlockIndex?: number;
}

// Initial canonical enterprise tactics
const INITIAL_TACTICS: CorporateTactic[] = [
  {
    id: 'tac-1',
    title: 'Liability Risk Policy: Strictly Capped',
    domain: 'LEGAL',
    rule: 'Indemnification & liability must be capped at 1.0x annual contract value (ACV)',
    triggerCondition: 'Contract negotiations containing uncapped or multi-multiple liability exposure clauses',
    policyDirective: 'Mandate strict Delaware DGCL § 141(e) safe-harbor liability carve-outs and 1x ACV aggregate cap.',
    confidenceScore: 98,
    supportingDecisionsCount: 47,
    status: 'LOCKED',
    lastAlignedAt: '2026-08-20T10:30:00Z',
    alignedBy: 'General Counsel & Board Quorum',
    merkleProofHash: sha256Sync('tac-1:Liability Risk Policy: Strictly Capped:98'),
    notes: 'Approved under DGCL § 141 Statutory Anchor. Modifications require 2/3 board quorum.',
    precedents: [
      { id: 'dec-101', title: 'Global Cloud Enterprise Vendor Agreement', action: 'ACCEPTED' },
      { id: 'dec-104', title: 'Tier-1 SaaS Procurement Master Terms', action: 'MODIFIED' },
      { id: 'dec-107', title: 'Uncapped Liability Vendor Proposal', action: 'REJECTED' }
    ]
  },
  {
    id: 'tac-2',
    title: 'Payment Terms Preference: Net-30 Days',
    domain: 'FINANCE',
    rule: 'Standard customer & vendor invoicing terms fixed to Net-30 with 2% 10-day early settlement discount',
    triggerCondition: 'Vendor or client requesting Net-60 or Net-90 commercial credit windows',
    policyDirective: 'Preserve working capital liquidity. Net-60 acceptable only with 3.5% pricing surcharge buffer.',
    confidenceScore: 94,
    supportingDecisionsCount: 38,
    status: 'ACTIVE',
    lastAlignedAt: '2026-08-22T14:15:00Z',
    alignedBy: 'Chief Financial Officer',
    merkleProofHash: sha256Sync('tac-2:Payment Terms Preference: Net-30 Days:94'),
    notes: 'Maintains optimal cash-conversion cycle across high-inflation quarters.',
    precedents: [
      { id: 'dec-102', title: 'APAC Logistics Expansion Contract', action: 'ACCEPTED' },
      { id: 'dec-108', title: 'Extended 90-Day Credit Request', action: 'REJECTED' }
    ]
  },
  {
    id: 'tac-3',
    title: 'Expansion Strategy: Conservative Margin-First',
    domain: 'STRATEGY',
    rule: 'International or product line expansion requires minimum >35% baseline gross margin floor',
    triggerCondition: 'Monte Carlo simulation or boardroom proposal projecting <30% margin during first 4 quarters',
    policyDirective: 'Reject growth-at-all-costs initiatives. Favor unit economics and positive free cash flow contribution.',
    confidenceScore: 92,
    supportingDecisionsCount: 29,
    status: 'ACTIVE',
    lastAlignedAt: '2026-08-23T09:45:00Z',
    alignedBy: 'Chief Executive Officer',
    merkleProofHash: sha256Sync('tac-3:Expansion Strategy: Conservative Margin-First:92'),
    notes: 'Synthesized from 12 historical Monte Carlo parametric risk tests.',
    precedents: [
      { id: 'dec-103', title: 'European Regional Data Center Buildout', action: 'MODIFIED' },
      { id: 'dec-105', title: 'Low-Margin High-Volume Reseller Deal', action: 'REJECTED' }
    ]
  },
  {
    id: 'tac-4',
    title: 'Vendor SLA Threshold: 99.9% Minimum Uptime',
    domain: 'OPERATIONS',
    rule: 'Mission-critical suppliers & cloud infra must commit to 99.9% SLA with liquidated damages rebate',
    triggerCondition: 'Infrastructure vendor proposing <99.9% availability without service credit penalties',
    policyDirective: 'Enforce multi-cloud failover redundancy clause and automated tier-1 credit escalation.',
    confidenceScore: 96,
    supportingDecisionsCount: 31,
    status: 'LOCKED',
    lastAlignedAt: '2026-08-24T16:00:00Z',
    alignedBy: 'Chief Technology Officer',
    merkleProofHash: sha256Sync('tac-4:Vendor SLA Threshold: 99.9% Minimum Uptime:96'),
    notes: 'Zero downtime tolerance for transactional core payment & ledger pipelines.',
    precedents: [
      { id: 'dec-101', title: 'Global Cloud Enterprise Vendor Agreement', action: 'ACCEPTED' },
      { id: 'dec-106', title: 'Single-Zone Database Hosting RFP', action: 'REJECTED' }
    ]
  },
  {
    id: 'tac-5',
    title: 'Cloud Sovereign Boundary: Isolated Regional Enclaves',
    domain: 'TECH',
    rule: 'Customer PII and confidential enterprise knowledge graphs must reside in sovereign geographic enclaves',
    triggerCondition: 'Cross-border data replication or AI model training on multi-tenant unpartitioned clusters',
    policyDirective: 'Mandate AES-256-GCM zero-knowledge encryption and regional data residency compliance (GDPR/DPDP).',
    confidenceScore: 97,
    supportingDecisionsCount: 42,
    status: 'ACTIVE',
    lastAlignedAt: '2026-08-25T11:20:00Z',
    alignedBy: 'Chief Information Security Officer',
    merkleProofHash: sha256Sync('tac-5:Cloud Sovereign Boundary: Isolated Regional Enclaves:97'),
    notes: 'Compliant with US Federal, EU GDPR Article 44, and Indian DPDP Act 2023.',
    precedents: [
      { id: 'dec-109', title: 'Third-Party LLM Knowledge Indexing Policy', action: 'ACCEPTED' },
      { id: 'dec-110', title: 'Unpartitioned Analytics Pipeline Migration', action: 'REJECTED' }
    ]
  },
  {
    id: 'tac-6',
    title: 'IP Clean-Room Rule: Zero Viral Copyleft Dependencies',
    domain: 'TECH',
    rule: 'Strict prohibition on AGPLv3/GPLv3 binaries or static links inside proprietary core microservices',
    triggerCondition: 'Dependency audit detecting viral copyleft licenses touching proprietary backend algorithms',
    policyDirective: 'Enforce clean-room boundary or substitute with permissive MIT/Apache 2.0 alternative libraries.',
    confidenceScore: 95,
    supportingDecisionsCount: 26,
    status: 'ACTIVE',
    lastAlignedAt: '2026-08-25T15:00:00Z',
    alignedBy: 'VP of Engineering & Legal Counsel',
    merkleProofHash: sha256Sync('tac-6:IP Clean-Room Rule: Zero Viral Copyleft Dependencies:95'),
    notes: 'Preserves enterprise commercial valuation and pristine IP hygiene for M&A.',
    precedents: [
      { id: 'dec-111', title: 'Open-Source Graph Library Ingestion', action: 'MODIFIED' },
      { id: 'dec-112', title: 'Direct AGPL Backend Driver Linking', action: 'REJECTED' }
    ]
  }
];

// Initial canonical universal decision ledger records
const INITIAL_LEDGER: DecisionLedgerItem[] = [
  {
    id: 'dec-101',
    title: 'Global Cloud Enterprise Infrastructure Master SLA',
    source: 'BOARDROOM',
    domain: 'TECH',
    action: 'ACCEPTED',
    recommendation: 'Execute multi-region cloud contract with 99.99% availability and 1x ACV liability cap.',
    problem: 'Evaluating 3-year cloud compute commitment vs on-premise infrastructure renewal.',
    confidence: 96,
    timestamp: '2026-08-25T14:30:00Z',
    actor: 'Board Quorum (8-2 Consensus)',
    merkleRoot: sha256Sync('ROOT_DEC_101_DGCL_141_DELAWARE'),
    leafHash: sha256Sync('LEAF_DEC_101_CLOUD_INFRA_2026'),
    dgclCompliant: true,
    auditBlockIndex: 104,
    learnedTacticExtracted: 'Vendor SLA Threshold: 99.9% Minimum Uptime',
    participants: [
      { name: 'Dr. Evelyn Vance', role: 'Chief Executive Officer', verdict: 'SUPPORT' },
      { name: 'Marcus Sterling', role: 'Chief Financial Officer', verdict: 'SUPPORT' },
      { name: 'Sarah Chen', role: 'Chief Technology Officer', verdict: 'SUPPORT' },
      { name: 'Elena Rostova', role: 'General Counsel', verdict: 'SUPPORT' }
    ]
  },
  {
    id: 'dec-102',
    title: 'APAC Regional Tier-1 Logistics Hub Expansion',
    source: 'SCM_SIMULATION',
    domain: 'OPERATIONS',
    action: 'ACCEPTED',
    recommendation: 'Proceed with Singapore hub lease under Net-30 payment structure to diversify shipping corridors.',
    problem: 'Port congestion causing 14-day supply chain lead time delays in Southeast Asia.',
    confidence: 94,
    timestamp: '2026-08-24T18:15:00Z',
    actor: 'SCM Risk Committee',
    merkleRoot: sha256Sync('ROOT_DEC_102_DGCL_141_DELAWARE'),
    leafHash: sha256Sync('LEAF_DEC_102_APAC_LOGISTICS_2026'),
    dgclCompliant: true,
    auditBlockIndex: 103,
    learnedTacticExtracted: 'Payment Terms Preference: Net-30 Days',
    participants: [
      { name: 'Elena Vance', role: 'COO', verdict: 'SUPPORT' },
      { name: 'Marcus Sterling', role: 'CFO', verdict: 'SUPPORT' }
    ]
  },
  {
    id: 'dec-103',
    title: 'European Sovereign Cloud Co-Location Buildout',
    source: 'BOARDROOM',
    domain: 'STRATEGY',
    action: 'MODIFIED',
    recommendation: 'Phase buildout in two 6-month milestones to safeguard gross margin floor at >35%.',
    problem: 'High initial CapEx of $1.8M would compress Q3-Q4 operating margins to 24%.',
    overrideReason: 'Phased investment schedule adopted to preserve quarterly margin targets.',
    quickTags: ['Violates Margin Goal', 'High Capital Expenditure'],
    modifiedDirectives: 'Stagger server deployment: 40% initial capacity, scaling only upon 70% tenant pre-commitments.',
    confidence: 91,
    timestamp: '2026-08-23T11:40:00Z',
    actor: 'Executive Committee',
    merkleRoot: sha256Sync('ROOT_DEC_103_DGCL_141_DELAWARE'),
    leafHash: sha256Sync('LEAF_DEC_103_EURO_CLOUD_2026'),
    dgclCompliant: true,
    auditBlockIndex: 102,
    learnedTacticExtracted: 'Expansion Strategy: Conservative Margin-First',
    participants: [
      { name: 'Marcus Sterling', role: 'CFO', verdict: 'CONDITIONAL' },
      { name: 'Sarah Chen', role: 'CTO', verdict: 'SUPPORT' }
    ]
  },
  {
    id: 'dec-104',
    title: 'Enterprise CRM Vendor Multi-Year Procurement',
    source: 'DOCUMENT_REVIEW',
    domain: 'LEGAL',
    action: 'MODIFIED',
    recommendation: 'Approve vendor contract only after redlining auto-renewal and uncapped indemnity clauses.',
    problem: 'Vendor included 15-day cancellation notice window and uncapped third-party IP indemnity.',
    overrideReason: 'Legal redlines applied: 60-day notice window & 1x ACV aggregate liability cap.',
    quickTags: ['Legal Conflict', 'Strictly Capped'],
    modifiedDirectives: 'Require standard Delaware DGCL § 141 safe-harbor terms before signature execution.',
    confidence: 97,
    timestamp: '2026-08-22T16:20:00Z',
    actor: 'General Counsel Review',
    merkleRoot: sha256Sync('ROOT_DEC_104_DGCL_141_DELAWARE'),
    leafHash: sha256Sync('LEAF_DEC_104_CRM_PROCURE_2026'),
    dgclCompliant: true,
    auditBlockIndex: 101,
    learnedTacticExtracted: 'Liability Risk Policy: Strictly Capped'
  },
  {
    id: 'dec-105',
    title: 'Low-Margin Hardware Reseller Partnership Deal',
    source: 'BOARDROOM',
    domain: 'FINANCE',
    action: 'REJECTED',
    recommendation: 'Reject proposal due to sub-18% gross margin and heavy inventory holding risks.',
    problem: 'Proposed reseller agreement offers large volume but compresses blended margins below strategic target.',
    overrideReason: 'Violates corporate margin floor rule (>35%). Low margin volume poses working capital drain.',
    quickTags: ['Violates Margin Goal', 'Too Risky'],
    confidence: 95,
    timestamp: '2026-08-21T09:30:00Z',
    actor: 'CFO & Board Review',
    merkleRoot: sha256Sync('ROOT_DEC_105_DGCL_141_DELAWARE'),
    leafHash: sha256Sync('LEAF_DEC_105_RESELLER_DEAL_2026'),
    dgclCompliant: true,
    auditBlockIndex: 100,
    learnedTacticExtracted: 'Expansion Strategy: Conservative Margin-First',
    participants: [
      { name: 'Marcus Sterling', role: 'CFO', verdict: 'OPPOSE' },
      { name: 'Dr. Evelyn Vance', role: 'CEO', verdict: 'OPPOSE' }
    ]
  },
  {
    id: 'dec-106',
    title: 'Single-Zone Primary Database Provider RFP',
    source: 'SCM_SIMULATION',
    domain: 'TECH',
    action: 'REJECTED',
    recommendation: 'Reject single-zone provider RFP due to lack of multi-region disaster recovery SLA.',
    problem: 'Vendor offers 25% cost discount but lacks secondary failover cluster.',
    overrideReason: 'Fails 99.9% availability threshold. Single point of failure unacceptable for production.',
    quickTags: ['Too Risky', 'SLA Breach Risk'],
    confidence: 98,
    timestamp: '2026-08-20T15:00:00Z',
    actor: 'Architecture Review Board',
    merkleRoot: sha256Sync('ROOT_DEC_106_DGCL_141_DELAWARE'),
    leafHash: sha256Sync('LEAF_DEC_106_SINGLE_ZONE_RFP_2026'),
    dgclCompliant: true,
    auditBlockIndex: 99,
    learnedTacticExtracted: 'Vendor SLA Threshold: 99.9% Minimum Uptime'
  },
  {
    id: 'dec-107',
    title: 'Ad-Tech Partner Uncapped Liability Agreement',
    source: 'DOCUMENT_REVIEW',
    domain: 'LEGAL',
    action: 'REJECTED',
    recommendation: 'Reject ad-tech partnership contract due to uncapped data breach indemnification clause.',
    problem: 'Contract placed unbounded data liability on our organization for third-party cookie sync.',
    overrideReason: 'Violates fundamental Delaware corporate safe-harbor risk policy.',
    quickTags: ['Legal Conflict', 'Breaches Compliance', 'Too Risky'],
    confidence: 99,
    timestamp: '2026-08-19T13:10:00Z',
    actor: 'General Counsel',
    merkleRoot: sha256Sync('ROOT_DEC_107_DGCL_141_DELAWARE'),
    leafHash: sha256Sync('LEAF_DEC_107_ADTECH_LIABILITY_2026'),
    dgclCompliant: true,
    auditBlockIndex: 98,
    learnedTacticExtracted: 'Liability Risk Policy: Strictly Capped'
  },
  {
    id: 'dec-108',
    title: 'Secondary Supplier 90-Day Extended Credit Request',
    source: 'SCM_SIMULATION',
    domain: 'FINANCE',
    action: 'IGNORED',
    recommendation: 'Deferred review pending Q3 cash flow statement publication.',
    problem: 'Supplier requested 90-day terms during raw material cost volatility.',
    overrideReason: 'No immediate action taken. Deferred to quarterly treasury committee meeting.',
    quickTags: ['Custom Note'],
    confidence: 88,
    timestamp: '2026-08-18T10:00:00Z',
    actor: 'Treasury Officer',
    merkleRoot: sha256Sync('ROOT_DEC_108_DGCL_141_DELAWARE'),
    leafHash: sha256Sync('LEAF_DEC_108_SUPPLIER_CREDIT_2026'),
    dgclCompliant: true,
    auditBlockIndex: 97,
    learnedTacticExtracted: 'Payment Terms Preference: Net-30 Days'
  }
];

// In-Memory Storage maps per organization
const tacticsStore = new Map<string, CorporateTactic[]>();
const ledgerStore = new Map<string, DecisionLedgerItem[]>();

export class CorporateTacticsEngine {
  /**
   * Get all learned corporate tactics for an organization
   */
  public static getTactics(orgId: string = 'default_org'): CorporateTactic[] {
    if (!tacticsStore.has(orgId)) {
      tacticsStore.set(orgId, JSON.parse(JSON.stringify(INITIAL_TACTICS)));
    }
    return tacticsStore.get(orgId)!;
  }

  /**
   * Get all decision ledger entries for an organization
   */
  public static getLedger(orgId: string = 'default_org'): DecisionLedgerItem[] {
    if (!ledgerStore.has(orgId)) {
      ledgerStore.set(orgId, JSON.parse(JSON.stringify(INITIAL_LEDGER)));
    }
    return ledgerStore.get(orgId)!;
  }

  /**
   * Align or edit a corporate tactic (1-Click executive refinement)
   */
  public static updateTactic(
    orgId: string,
    tacticId: string,
    updates: Partial<CorporateTactic>,
    actorName: string = 'Executive Review'
  ): CorporateTactic {
    const list = this.getTactics(orgId);
    const index = list.findIndex(t => t.id === tacticId);
    if (index === -1) {
      throw new Error(`Tactic with ID ${tacticId} not found`);
    }

    const current = list[index];
    const updated: CorporateTactic = {
      ...current,
      ...updates,
      lastAlignedAt: new Date().toISOString(),
      alignedBy: actorName,
      merkleProofHash: sha256Sync(`${current.id}:${updates.title || current.title}:${updates.confidenceScore || current.confidenceScore}:${Date.now()}`)
    };

    list[index] = updated;
    tacticsStore.set(orgId, list);
    return updated;
  }

  /**
   * Add a new custom corporate tactic
   */
  public static addTactic(
    orgId: string,
    tactic: Omit<CorporateTactic, 'id' | 'lastAlignedAt' | 'merkleProofHash'>,
    actorName: string = 'Executive Committee'
  ): CorporateTactic {
    const list = this.getTactics(orgId);
    const newId = `tac-${Date.now().toString(36)}`;
    const newTactic: CorporateTactic = {
      ...tactic,
      id: newId,
      lastAlignedAt: new Date().toISOString(),
      alignedBy: actorName,
      merkleProofHash: sha256Sync(`${newId}:${tactic.title}:${tactic.confidenceScore}:${Date.now()}`)
    };

    list.unshift(newTactic);
    tacticsStore.set(orgId, list);
    return newTactic;
  }

  /**
   * Record an executive decision feedback action ("Accept", "Reject with Reason", "Modify & Accept")
   */
  public static recordDecisionFeedback(
    orgId: string,
    decisionData: {
      title: string;
      source: 'BOARDROOM' | 'SCM_SIMULATION' | 'DOCUMENT_REVIEW' | 'EXECUTIVE_PROPOSAL';
      domain?: TacticDomain;
      action: DecisionAction;
      recommendation: string;
      problem?: string;
      overrideReason?: string;
      quickTags?: string[];
      modifiedDirectives?: string;
      confidence?: number;
      actor?: string;
      participants?: { name: string; role: string; verdict?: string }[];
    }
  ): { ledgerEntry: DecisionLedgerItem; updatedTactics: CorporateTactic[]; merkleProof: string } {
    const ledger = this.getLedger(orgId);
    const tactics = this.getTactics(orgId);

    const id = `dec-${Date.now().toString(36)}`;
    const timestamp = new Date().toISOString();
    const domain: TacticDomain = decisionData.domain || 'STRATEGY';
    const confidence = decisionData.confidence || 95;

    // Cryptographic Merkle Hash generation compliant with Delaware DGCL § 141(e)
    const leafContent = `${id}:${decisionData.title}:${decisionData.action}:${decisionData.recommendation}:${timestamp}`;
    const leafHash = sha256Sync(leafContent);
    const merkleTree = new MerkleTree([leafHash, ...ledger.slice(0, 7).map(l => l.leafHash)]);
    const merkleRoot = merkleTree.getRoot();

    // Determine relevant tactic or synthesize a rule update
    let matchedTactic = tactics.find(t => t.domain === domain || decisionData.title.toLowerCase().includes(t.domain.toLowerCase()));
    if (!matchedTactic && tactics.length > 0) {
      matchedTactic = tactics[0];
    }

    if (matchedTactic) {
      matchedTactic.supportingDecisionsCount += 1;
      matchedTactic.precedents.unshift({
        id,
        title: decisionData.title,
        action: decisionData.action
      });
      if (decisionData.action === 'ACCEPTED') {
        matchedTactic.confidenceScore = Math.min(99, matchedTactic.confidenceScore + 1);
      } else if (decisionData.action === 'REJECTED') {
        // Adjust confidence slightly or flag for alignment
        matchedTactic.confidenceScore = Math.max(75, matchedTactic.confidenceScore - 1);
      }
      matchedTactic.lastAlignedAt = timestamp;
      matchedTactic.merkleProofHash = sha256Sync(`${matchedTactic.id}:${matchedTactic.title}:${matchedTactic.confidenceScore}:${timestamp}`);
    }

    const newLedgerItem: DecisionLedgerItem = {
      id,
      title: decisionData.title,
      source: decisionData.source,
      domain,
      action: decisionData.action,
      recommendation: decisionData.recommendation,
      problem: decisionData.problem || 'Strategic executive deliberation and policy review',
      overrideReason: decisionData.overrideReason,
      quickTags: decisionData.quickTags,
      modifiedDirectives: decisionData.modifiedDirectives,
      confidence,
      timestamp,
      actor: decisionData.actor || 'Executive Leader',
      merkleRoot,
      leafHash,
      dgclCompliant: true,
      auditBlockIndex: ledger.length + 100,
      participants: decisionData.participants,
      learnedTacticExtracted: matchedTactic ? matchedTactic.title : undefined
    };

    ledger.unshift(newLedgerItem);
    ledgerStore.set(orgId, ledger);
    tacticsStore.set(orgId, tactics);

    return {
      ledgerEntry: newLedgerItem,
      updatedTactics: tactics,
      merkleProof: merkleRoot
    };
  }
}
