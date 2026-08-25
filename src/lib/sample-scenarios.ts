/**
 * Synaps Sample Scenarios Engine
 * High-fidelity, instant 1-click executive scenarios for Boardroom, Simulations, and Executive Briefs.
 * Reduces Time-to-Value (TTV) to under 3 seconds with zero empty-state paralysis.
 */

export interface SampleExecutiveAnalysis {
  roleId: 'CEO' | 'CFO' | 'COO' | 'CTO' | 'LEGAL' | 'HR' | 'SALES' | 'MARKETING' | 'OPS' | 'COMPLIANCE';
  roleTitle: string;
  name: string;
  avatarColor: string;
  verdict: 'SUPPORT' | 'OPPOSE' | 'CONDITIONAL';
  reasoning: string;
  keyConcerns: string[];
  confidenceScore: number;
  dataEvidence: string[];
}

export interface SampleBoardSynthesis {
  consensus: string[];
  disagreements: string[];
  risks: string[];
  opportunities: string[];
  overallConfidence: number;
  finalRecommendation: string;
}

export interface SampleBoardMeetingResult {
  query: string;
  scenarioId: 'scenario-a' | 'scenario-b';
  scenarioTitle: string;
  executives: SampleExecutiveAnalysis[];
  synthesis: SampleBoardSynthesis;
  timestamp: string;
}

export interface SampleScmScenario {
  id: string;
  title: string;
  description: string;
  category: string;
  factualBaseline: number;
  counterfactualValue: number;
  causalDelta: number;
  percentChange: number;
  targetNode: string;
  interventionNode: string;
  backdoorSet: string[];
  confidenceInterval: [number, number];
  formalEquation: string;
  baseEbitda: number;
  baseRunway: number;
  sliders: Array<{
    id: string;
    name: string;
    unit: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    minLabel: string;
    midLabel: string;
    maxLabel: string;
    ebitdaMultiplier: number;
    runwayMultiplier: number;
  }>;
  deliberation: {
    legal: { agent: string; framework: string; opinion: string; citation: string };
    cfo: { agent: string; metricProof: string; opinion: string };
    redTeam: { agent: string; attackVector: string; opinion: string };
    ceo: { agent: string; consensusVerdict: string; actionRoadmap: string[]; jiraDispatchSummary: string };
  };
  simulationResult: {
    decisionType: string;
    decisionDetails: string;
    scenarios: {
      expected: {
        title: string;
        probability: number;
        description: string;
        netProfitabilityDelta: number;
        departmentImpacts: Array<{ department: string; deltaPercent: number; analysis: string }>;
      };
      optimistic: {
        title: string;
        probability: number;
        description: string;
        netProfitabilityDelta: number;
        departmentImpacts: Array<{ department: string; deltaPercent: number; analysis: string }>;
      };
      worstCase: {
        title: string;
        probability: number;
        description: string;
        netProfitabilityDelta: number;
        departmentImpacts: Array<{ department: string; deltaPercent: number; analysis: string }>;
      };
    };
    cascadingChain: Array<{ step: number; fromDepartment: string; toDepartment: string; effectDescription: string }>;
    assumptionsUsed: Array<{ assumption: string; groundedSource: string }>;
    uncertaintyRange: { minEstimate: string; maxEstimate: string; confidenceBounds: string };
    monteCarloMath: {
      totalIterations: number;
      p10WorstCase: number;
      p50Expected: number;
      p90Optimistic: number;
      var95: number;
      distributionHistogram: Array<{ binStart: number; binEnd: number; count: number; frequency: number }>;
      mathematicalFormulasUsed: Array<{ name: string; formula: string; description: string }>;
    };
  };
}

export interface SampleExecutiveBrief {
  executiveBrief: string;
  healthScore: number;
  knowledgeCoverage: number;
  riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
  decisionConfidence: number;
  executiveAnswers: Array<{
    id: string;
    question: string;
    answer: string;
    status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'INFO';
    citations: Array<{ documentName: string; snippet: string }>;
  }>;
  departmentHealth: Array<{
    department: string;
    healthScore: number;
    riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
    summary: string;
    activeIssuesCount: number;
    citations: Array<{ documentName: string; snippet: string }>;
  }>;
  aiRecommendations: Array<{
    id: string;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    title: string;
    recommendation: string;
    rationale: string;
    citations: Array<{ documentName: string; snippet: string }>;
  }>;
  recentEvents: Array<{ date: string; title: string; category: string; description: string; docName?: string }>;
  timelineHighlights: Array<{ date: string; milestone: string; impact: string }>;
}

export interface SampleScenarioDefinition {
  id: 'scenario-a' | 'scenario-b';
  key: string;
  title: string;
  subtitle: string;
  badge: string;
  iconType: 'shield' | 'trending';
  strategicQuestion: string;
  tags: string[];
  boardroomResult: SampleBoardMeetingResult;
  scmScenario: SampleScmScenario;
  executiveBrief: SampleExecutiveBrief;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENARIO A: Supplier Supply Chain Shock & M&A Due Diligence
// ─────────────────────────────────────────────────────────────────────────────
export const SAMPLE_SCENARIO_A: SampleScenarioDefinition = {
  id: 'scenario-a',
  key: 'supply-chain-mna',
  title: 'Supplier Supply Chain Shock & M&A Due Diligence',
  subtitle: 'Audit a $200M enterprise acquisition under sudden Tier-1 chip foundry export bans and indemnity caps.',
  badge: 'M&A Due Diligence & Supply Shock',
  iconType: 'shield',
  strategicQuestion: 'Supplier Supply Chain Shock & M&A Due Diligence: How should the Board address Tier-1 chip foundry export bans, inventory buffers, and target company indemnification caps?',
  tags: ['M&A Due Diligence', 'Supply Chain Shock', 'Delaware DGCL § 141', 'EAR / ITAR Compliance', '10-Agent Deliberation'],
  
  boardroomResult: {
    query: 'Supplier Supply Chain Shock & M&A Due Diligence: How should the Board address Tier-1 chip foundry export bans, inventory buffers, and target company indemnification caps?',
    scenarioId: 'scenario-a',
    scenarioTitle: 'Supplier Supply Chain Shock & M&A Due Diligence',
    timestamp: new Date().toISOString(),
    synthesis: {
      overallConfidence: 94,
      finalRecommendation: 'Proceed with the $200M M&A transaction subject to an immediate $15M working capital escrow holdback, mandatory Delaware DGCL § 141 liability caps, and dual-sourcing diversification for Tier-1 supply chains within 90 days.',
      consensus: [
        'Enforce a strict 1x enterprise fee holdback on non-standard indemnity commitments to shield board directors under Delaware DGCL § 141 safe-harbor.',
        'Establish a 90-day dual-sourcing transition pipeline to mitigate single-foundry export control bottlenecks.',
        'Working capital reserves of $15M buffer cashflow runway to 14.2 months post-integration under high stress.',
        'Consolidate procurement across target and parent company to extract $6.4M in annualized supply chain synergies.'
      ],
      disagreements: [
        'COO and VP of Sales advocate for an immediate 45-day emergency buffer stock purchase, while CFO recommends phased inventory deployment to preserve treasury liquidity.',
        'General Counsel requests unilateral termination rights on export ban escalations, while CEO favors a structured re-negotiation trigger.'
      ],
      risks: [
        'Potential geopolitical trade export sanctions on critical silicon components (Tier-1 foundry lead times extending from 6 to 18 weeks).',
        'Integration and contract harmonization delays exceeding the target 120-day transition window.',
        'Uncapped IP indemnification clauses in target company\'s historical legacy contracts.'
      ],
      opportunities: [
        'Immediate consolidation of market share in enterprise high-reliability hardware.',
        'Cross-selling software subscriptions to target company\'s 340+ enterprise client base.',
        'Supply chain resilience certification creating competitive moat against peers.'
      ]
    },
    executives: [
      {
        roleId: 'CEO',
        roleTitle: 'Chief Executive Officer',
        name: 'Eleanor Vance',
        avatarColor: '#fc4778',
        verdict: 'CONDITIONAL',
        confidenceScore: 94,
        reasoning: 'The $200M acquisition expands our addressable enterprise market by 42% and delivers essential hardware patents. However, execution must be conditioned upon a structured escrow holdback to absorb near-term supply chain volatility.',
        keyConcerns: [
          'Preserving shareholder value while absorbing post-merger integration costs.',
          'Ensuring executive alignment across acquired leadership within 100 days.'
        ],
        dataEvidence: [
          'Target Entity M&A Information Memorandum § 3.1',
          'Enterprise TAM & Hardware Patent Portfolio Audit 2026'
        ]
      },
      {
        roleId: 'CFO',
        roleTitle: 'Chief Financial Officer',
        name: 'Marcus Sterling',
        avatarColor: '#10b981',
        verdict: 'SUPPORT',
        confidenceScore: 95,
        reasoning: 'Pro-forma financial modeling confirms positive EBITDA contribution of $28.5M in Year 1. Structuring a $15M working capital holdback protects debt covenants and maintains an 18-month cash runway even under extreme tariff scenarios.',
        keyConcerns: [
          'Managing cash conversion cycle during dual-sourcing supplier transition.',
          'Maintaining debt covenant headroom above 3.5x leverage ratio.'
        ],
        dataEvidence: [
          'Pro-Forma M&A Cashflow Model v4.2',
          'Working Capital Sensitivity Matrix (Pyodide SCM)'
        ]
      },
      {
        roleId: 'COO',
        roleTitle: 'Chief Operating Officer',
        name: 'Sarah Chen',
        avatarColor: '#3b82f6',
        verdict: 'CONDITIONAL',
        confidenceScore: 91,
        reasoning: 'Tier-1 chip foundry lead times have expanded from 6 to 18 weeks due to regional export constraints. We must immediately contract secondary foundries in North America and Europe to avoid assembly line stoppages.',
        keyConcerns: [
          'Single Point of Failure (SPOF) in primary foundry wafer fabrication.',
          'Warehouse staging capacity for 90-day safety buffer stock.'
        ],
        dataEvidence: [
          'Global Semiconductor Foundry Lead-Time Index Q3 2026',
          'Target Supplier Master Service Agreement Section 8.4'
        ]
      },
      {
        roleId: 'CTO',
        roleTitle: 'Chief Technology Officer',
        name: 'Dr. Aris Thorne',
        avatarColor: '#06b6d4',
        verdict: 'SUPPORT',
        confidenceScore: 94,
        reasoning: 'Our hardware architecture team has verified ASIC drop-in compatibility with secondary foundry packages. Firmware re-spin will require 6 weeks of engineering effort with zero regression in performance metrics.',
        keyConcerns: [
          'Firmware validation cycles across multi-source silicon revisions.',
          'Integrating target company telemetry into our central observability stack.'
        ],
        dataEvidence: [
          'Silicon Firmware Architecture Specification v3.0',
          'ASIC Compatibility & Benchmarking Report'
        ]
      },
      {
        roleId: 'LEGAL',
        roleTitle: 'General Counsel',
        name: 'Victoria Hayes',
        avatarColor: '#f59e0b',
        verdict: 'SUPPORT',
        confidenceScore: 96,
        reasoning: 'Delaware DGCL § 141 safe-harbor audit confirms full fiduciary protection for board directors. We must redline Section 11.2 of the merger agreement to insert a 1x aggregate liability cap and carve out export sanctions under Material Adverse Effect (MAE).',
        keyConcerns: [
          'Uncapped indemnities in 14 legacy enterprise customer contracts.',
          'Export Administration Regulations (EAR) dual-use compliance filings.'
        ],
        dataEvidence: [
          'Delaware General Corporation Law (DGCL) § 141(e) Audit Protocol',
          'Target M&A Agreement Draft Section 11.2 (Liability & Indemnity)'
        ]
      },
      {
        roleId: 'HR',
        roleTitle: 'Chief People Officer',
        name: 'David Miller',
        avatarColor: '#ec4899',
        verdict: 'SUPPORT',
        confidenceScore: 89,
        reasoning: 'Target engineering talent retention is secured via a $4.5M 2-year vesting pool for key silicon designers. Cultural integration plan includes unified leveling framework and retention bonuses for 42 core engineers.',
        keyConcerns: [
          'Flight risk of principal hardware architects during integration.',
          'Harmonizing compensation bands between hardware and software divisions.'
        ],
        dataEvidence: [
          'Key Personnel Retention Agreement & Vesting Schedule',
          'Radford Technology Compensation Benchmark Survey 2026'
        ]
      },
      {
        roleId: 'SALES',
        roleTitle: 'VP of Global Sales',
        name: 'Rachel Ross',
        avatarColor: '#ef4444',
        verdict: 'CONDITIONAL',
        confidenceScore: 92,
        reasoning: 'Hardware delivery delays could expose $38M in annual enterprise deal pipeline. Sales must introduce flexible delivery window clauses and offer temporary cloud emulator credits to buffer customer closing friction.',
        keyConcerns: [
          'Enterprise customer SLA penalty clauses on delayed hardware shipments.',
          'Sales enablement for cross-selling combined product portfolio.'
        ],
        dataEvidence: [
          'Q3 Enterprise Sales Pipeline Report ($84M ACV)',
          'Top 20 Customer Master Terms & SLA Penalty Review'
        ]
      },
      {
        roleId: 'MARKETING',
        roleTitle: 'Chief Marketing Officer',
        name: 'Julian Mercer',
        avatarColor: '#eab308',
        verdict: 'SUPPORT',
        confidenceScore: 90,
        reasoning: 'Positioning this acquisition as a strategic supply-chain resilience milestone creates high enterprise buyer confidence. Joint press launch and customer webinar series will reinforce market leadership.',
        keyConcerns: [
          'Competitor FUD campaigns capitalizing on supply chain rumors.',
          'Brand architecture transition from target brand to Synaps ecosystem.'
        ],
        dataEvidence: [
          'Enterprise Buyer Sentiment & Brand Perception Audit',
          'Industry Analyst M&A Coverage Brief (Gartner & Forrester)'
        ]
      },
      {
        roleId: 'OPS',
        roleTitle: 'Director of Operations',
        name: 'Kevin Durant',
        avatarColor: '#6366f1',
        verdict: 'SUPPORT',
        confidenceScore: 95,
        reasoning: 'Critical path freight re-routing via air-cargo partnerships guarantees 72-hour component transit. 90-day safety stock buffer protects manufacturing throughput from geopolitical customs delays.',
        keyConcerns: [
          'Air freight cost premium impacting gross margin by 1.2% in Q3.',
          'Customs clearance throughput at European bonded warehouses.'
        ],
        dataEvidence: [
          'Global Logistics Telemetry & Air Freight Index 2026',
          'Factory Throughput & SOP Capacity Audit (ISO 9001)'
        ]
      },
      {
        roleId: 'COMPLIANCE',
        roleTitle: 'Chief Compliance Officer',
        name: 'Elena Rostova',
        avatarColor: '#14b8a6',
        verdict: 'SUPPORT',
        confidenceScore: 97,
        reasoning: 'Full EAR/ITAR compliance audit of target supply chain shows zero violations. All secondary foundry partners have completed BIS Entity List screening and automated trade compliance checks.',
        keyConcerns: [
          'Quarterly re-verification of Tier-2 and Tier-3 component origins.',
          'GDPR & DPDP cross-border data transfer compliance for telemetry.'
        ],
        dataEvidence: [
          'Bureau of Industry and Security (BIS) Entity List Verification Log',
          'DPDP Act 2023 & GDPR Section 44 Cross-Border Audit'
        ]
      }
    ]
  },

  scmScenario: {
    id: 'scm-supply-chain-mna',
    title: '$200M Strategic M&A Supply Chain Counterfactual',
    description: 'Stress-test enterprise acquisition runway and EBITDA under export tariffs, interest rate spikes, and foundry lead-time shocks.',
    category: 'M&A & Supply Chain SCM',
    factualBaseline: 8.4,
    counterfactualValue: 14.2,
    causalDelta: 5.8,
    percentChange: 69.0,
    targetNode: 'WorkingCapitalMonths',
    interventionNode: 'do(DualSourcing=True, BufferDays=90, Holdback=$15M)',
    backdoorSet: ['MacroInterestRateBps', 'ExportTariffPct', 'FoundryLeadTimeWeeks'],
    confidenceInterval: [12.8, 15.6],
    formalEquation: 'P(WorkingCapitalMonths_{do(DualSource=1, Holdback=15M)} | \\mathbf{e}) = \\sum_{z} P(WorkingCapital | do(DualSource, Holdback), z) P(z | MacroRates, Tariffs)',
    baseEbitda: 28.5,
    baseRunway: 24.0,
    sliders: [
      {
        id: 'lever_tariff',
        name: 'Silicon & Raw Material Export Tariffs',
        unit: '%',
        min: 0,
        max: 50,
        step: 5,
        defaultValue: 15,
        minLabel: '0% (Free Trade)',
        midLabel: '25%',
        maxLabel: '50% (Trade War)',
        ebitdaMultiplier: 0.82,
        runwayMultiplier: 0.28
      },
      {
        id: 'lever_interest',
        name: 'Macro Benchmark Rate Shift',
        unit: 'bps',
        min: 0,
        max: 500,
        step: 25,
        defaultValue: 125,
        minLabel: '0 bps (Neutral)',
        midLabel: '+250 bps',
        maxLabel: '+500 bps (Shock)',
        ebitdaMultiplier: 0.035,
        runwayMultiplier: 0.012
      },
      {
        id: 'lever_outage',
        name: 'Foundry Lead-Time Delay',
        unit: 'Weeks',
        min: 0,
        max: 24,
        step: 2,
        defaultValue: 12,
        minLabel: '0w (Normal)',
        midLabel: '12w (Delay)',
        maxLabel: '24w (Gridlock)',
        ebitdaMultiplier: 0.65,
        runwayMultiplier: 0.32
      }
    ],
    deliberation: {
      legal: {
        agent: 'GENERAL COUNSEL (LEGAL TWIN)',
        framework: 'DELAWARE DGCL § 141 & EAR / ITAR',
        opinion: 'Fiduciary safe harbor established under Delaware DGCL § 141(e). Requiring a 1x indemnity liability cap and MAE trade carve-out protects board directors from personal liability.',
        citation: 'Target Merger Agreement § 11.2 · Delaware DGCL § 141(e) · SHA-256: 4f8a...c021'
      },
      cfo: {
        agent: 'CFO DIGITAL TWIN (PYTHON SCM)',
        metricProof: '0.00% ARITHMETIC DRIFT · 10,000 MONTE CARLO ITERATIONS',
        opinion: 'Structural causal modeling proves $15M holdback increases small component survival runway from 8.4 to 14.2 months with 95% confidence interval.'
      },
      redTeam: {
        agent: 'ADVERSARIAL RED TEAM TWIN',
        attackVector: 'SUPPLY CHAIN SINGLE-POINT-OF-FAILURE',
        opinion: 'Adversarial simulation across 40 nodes confirms single-foundry dependence leads to 100% assembly line shutdown if lead times exceed 16 weeks without secondary qualification.'
      },
      ceo: {
        agent: 'CEO TWIN (SYNTHESIZED ACTION DOSSIER)',
        consensusVerdict: 'Quorum Recommendation: Execute M&A agreement with $15M escrow holdback, dual-source silicon foundries within 90 days, and dispatch Jira mitigation tasks across procurement and legal.',
        actionRoadmap: [
          '1. Execute Delaware DGCL § 141 liability cap redline on M&A agreement',
          '2. Fund $15M working capital escrow holdback buffer',
          '3. Dispatch P0 secondary foundry qualification tickets across Jira and ERP'
        ],
        jiraDispatchSummary: '[Causarix M&A SCM Dispatch] $200M Acquisition & Supply Chain Shock Mitigation'
      }
    },
    simulationResult: {
      decisionType: 'Supplier Supply Chain Shock & M&A Due Diligence',
      decisionDetails: 'Acquire target enterprise hardware entity for $200M, hedge against Tier-1 foundry export bans with $15M escrow holdback and 90-day dual-sourcing qualification.',
      scenarios: {
        expected: {
          title: 'Expected Baseline Impact',
          probability: 68,
          description: 'Dual-sourcing qualification completes in 75 days; $15M holdback offsets initial freight premiums; Year 1 EBITDA expands by $28.5M.',
          netProfitabilityDelta: 14.8,
          departmentImpacts: [
            { department: 'Revenue', deltaPercent: 18.2, analysis: 'Enterprise ACV growth driven by consolidated product offerings.' },
            { department: 'Cashflow', deltaPercent: 14.0, analysis: 'Positive net working capital velocity supported by $15M escrow buffer.' },
            { department: 'Operations', deltaPercent: 12.5, analysis: 'Dual-sourcing establishes permanent manufacturing resilience.' },
            { department: 'Compliance', deltaPercent: 8.0, analysis: 'Zero trade export violations verified under automated BIS screening.' },
            { department: 'Employees', deltaPercent: 5.0, analysis: '42 principal hardware engineers retained under vesting incentives.' }
          ]
        },
        optimistic: {
          title: 'Optimistic Upside Scenario',
          probability: 22,
          description: 'Secondary foundries ramp ahead of schedule with 12% lower unit cost; enterprise hardware demand accelerates across international markets.',
          netProfitabilityDelta: 26.5,
          departmentImpacts: [
            { department: 'Revenue', deltaPercent: 32.0, analysis: 'Rapid enterprise adoption and multi-year subscription expansion.' },
            { department: 'Cashflow', deltaPercent: 28.5, analysis: 'High upfront annual contract collections.' },
            { department: 'Operations', deltaPercent: 20.0, analysis: 'Automated assembly yield reaches 99.4%.' }
          ]
        },
        worstCase: {
          title: 'Downside Risk Scenario',
          probability: 10,
          description: 'Secondary foundry qualification delayed to 150 days amid intensified export restrictions; air freight premiums compress margin temporarily.',
          netProfitabilityDelta: -3.8,
          departmentImpacts: [
            { department: 'Revenue', deltaPercent: -4.0, analysis: 'Deferred hardware shipments push $12M revenue recognition into Q4.' },
            { department: 'Cashflow', deltaPercent: -6.5, analysis: 'Higher safety stock carrying costs.' },
            { department: 'Operations', deltaPercent: -5.0, analysis: 'Overtime manufacturing required to clear assembly backlog.' }
          ]
        }
      },
      cascadingChain: [
        { step: 1, fromDepartment: 'Procurement', toDepartment: 'Manufacturing Ops', effectDescription: 'Secondary foundry contracts provide alternate silicon wafers within 60 days.' },
        { step: 2, fromDepartment: 'Manufacturing Ops', toDepartment: 'Sales & Delivery', effectDescription: 'Assembly throughput stabilized, protecting $38M enterprise deal delivery commitments.' },
        { step: 3, fromDepartment: 'Sales & Delivery', toDepartment: 'Finance & Treasury', effectDescription: 'Customer SLA compliance eliminates penalty exposure and drives predictable ARR cashflow.' }
      ],
      assumptionsUsed: [
        { assumption: 'Secondary foundry yields meet 98.5% minimum tolerance standard.', groundedSource: 'Foundry Engineering Datasheet' },
        { assumption: 'Escrow holdback of $15M is legally enforceable under Delaware law.', groundedSource: 'M&A Merger Agreement Section 11.2' }
      ],
      uncertaintyRange: {
        minEstimate: '-3.8% Margin',
        maxEstimate: '+26.5% Margin',
        confidenceBounds: '95% Confidence Interval based on 10,000 Monte Carlo trajectories'
      },
      monteCarloMath: {
        totalIterations: 10000,
        p10WorstCase: 18200000,
        p50Expected: 28500000,
        p90Optimistic: 39400000,
        var95: 14800000,
        distributionHistogram: [
          { binStart: 12000000, binEnd: 15000000, count: 420, frequency: 4.2 },
          { binStart: 15000001, binEnd: 18000000, count: 850, frequency: 8.5 },
          { binStart: 18000001, binEnd: 21000000, count: 1430, frequency: 14.3 },
          { binStart: 21000001, binEnd: 24000000, count: 2150, frequency: 21.5 },
          { binStart: 24000001, binEnd: 27000000, count: 2480, frequency: 24.8 },
          { binStart: 27000001, binEnd: 30000000, count: 1520, frequency: 15.2 },
          { binStart: 30000001, binEnd: 33000000, count: 740, frequency: 7.4 },
          { binStart: 33000001, binEnd: 36000000, count: 290, frequency: 2.9 },
          { binStart: 36000001, binEnd: 40000000, count: 120, frequency: 1.2 }
        ],
        mathematicalFormulasUsed: [
          { name: 'Geometric Brownian Motion SDE', formula: 'dY_t = \\mu Y_t dt + \\sigma Y_t dW_t', description: 'Models asset value and supply-chain drift under stochastic geopolitical shocks.' },
          { name: 'Pearl Backdoor Formula', formula: 'P(Y | do(X=x)) = \\sum_z P(Y | X=x, Z=z) P(Z=z)', description: 'Eliminates confounding between macro interest rates and working capital runway.' }
        ]
      }
    }
  },

  executiveBrief: {
    executiveBrief: 'Supply chain and M&A audit active: $200M enterprise acquisition evaluated across Tier-1 chip foundry export bans. SCM counterfactual analysis confirms a $15M working capital holdback and 90-day dual-sourcing qualification restores post-merger cash runway to 14.2 months with 94% board quorum consensus under Delaware DGCL § 141 safe-harbor.',
    healthScore: 92,
    knowledgeCoverage: 98,
    riskLevel: 'LOW',
    decisionConfidence: 94,
    executiveAnswers: [
      {
        id: 'mna_ans_1',
        question: 'What is the fiduciary safe-harbor exposure for the Board under Delaware DGCL § 141?',
        answer: 'The Board is fully shielded under DGCL § 141(e) Business Judgment Rule by relying on documented expert financial models and legal indemnity caps (1x fee holdback). Material Adverse Effect clauses have been updated to carve out general export sanctions.',
        status: 'HEALTHY',
        citations: [
          { documentName: 'Delaware DGCL § 141 Fiduciary Audit Memo.pdf', snippet: 'Directors acting in good faith reliance on records and expert digital twin analyses are shielded from liability under § 141(e).' },
          { documentName: 'M&A Merger Agreement Draft v4.2.docx', snippet: 'Section 11.2: Aggregate liability capped at 1.0x total transaction consideration.' }
        ]
      },
      {
        id: 'mna_ans_2',
        question: 'How do Tier-1 foundry export bans impact our hardware shipping schedule and revenue pipeline?',
        answer: 'Primary foundry lead times expanded from 6 to 18 weeks. Qualifying secondary North American foundries within 90 days prevents assembly line halts and protects $38M in enterprise ARR contracts.',
        status: 'WARNING',
        citations: [
          { documentName: 'Semiconductor Foundry Lead Time Report Q3.pdf', snippet: 'Lead times for 14nm wafer production increased by 200% due to regional export permit backlogs.' },
          { documentName: 'Enterprise Sales Pipeline Report Q3.xlsx', snippet: '$38.2M ACV committed against hardware delivery dates in Q3 and Q4.' }
        ]
      },
      {
        id: 'mna_ans_3',
        question: 'What is the post-merger cash runway impact of the $15M working capital escrow holdback?',
        answer: 'Structural causal modeling (Pyodide SCM) demonstrates that injecting a $15M reserve holdback extends runway from 8.4 to 14.2 months, even under high tariff shock scenarios.',
        status: 'HEALTHY',
        citations: [
          { documentName: 'Pro-Forma Cashflow & Working Capital Model.xlsx', snippet: '$15M escrow holdback preserves debt covenants and maintains 14.2 months runway under 25% tariff shock.' }
        ]
      }
    ],
    departmentHealth: [
      { department: 'Finance & Treasury', healthScore: 94, riskLevel: 'LOW', summary: 'Strong balance sheet with $15M escrow buffer protecting debt covenants.', activeIssuesCount: 0, citations: [{ documentName: 'Pro-Forma Cashflow & Working Capital Model.xlsx', snippet: 'Debt coverage ratio remains at 4.1x.' }] },
      { department: 'Supply Chain & Ops', healthScore: 86, riskLevel: 'MODERATE', summary: 'Dual-sourcing secondary foundry qualification underway (75-day target).', activeIssuesCount: 1, citations: [{ documentName: 'Semiconductor Foundry Lead Time Report Q3.pdf', snippet: 'Secondary qualification active.' }] },
      { department: 'Legal & Fiduciary', healthScore: 98, riskLevel: 'LOW', summary: 'Delaware DGCL § 141 safe-harbor audit passed with 1x liability cap.', activeIssuesCount: 0, citations: [{ documentName: 'Delaware DGCL § 141 Fiduciary Audit Memo.pdf', snippet: 'DGCL § 141(e) compliant.' }] },
      { department: 'Sales & Revenue', healthScore: 90, riskLevel: 'LOW', summary: '$84M ACV pipeline secured with updated delivery clauses.', activeIssuesCount: 0, citations: [{ documentName: 'Enterprise Sales Pipeline Report Q3.xlsx', snippet: 'Enterprise pipeline healthy.' }] },
      { department: 'Compliance', healthScore: 99, riskLevel: 'LOW', summary: '100% BIS entity list clearance and EAR/ITAR trade compliance verified.', activeIssuesCount: 0, citations: [{ documentName: 'BIS Trade Screening Audit Log.pdf', snippet: 'Zero entity list violations.' }] }
    ],
    aiRecommendations: [
      { id: 'rec_mna_1', priority: 'CRITICAL', title: 'Execute Section 11.2 Indemnity Redline', recommendation: 'Insert mandatory 1.0x liability cap and Delaware DGCL § 141 safe-harbor language in M&A definitive agreement before board signing.', rationale: 'Eliminates personal director exposure to historical target patent liabilities.', citations: [{ documentName: 'M&A Merger Agreement Draft v4.2.docx', snippet: 'Section 11.2 redline pending.' }] },
      { id: 'rec_mna_2', priority: 'HIGH', title: 'Lock 90-Day Dual-Sourcing Agreements', recommendation: 'Formalize secondary wafer foundry reservation contracts in North America to buffer Tier-1 export restrictions.', rationale: 'Prevents $38M in enterprise hardware shipment delays.', citations: [{ documentName: 'Semiconductor Foundry Lead Time Report Q3.pdf', snippet: 'Lead time buffer required.' }] }
    ],
    recentEvents: [
      { date: 'Today', title: '10-Agent Boardroom Quorum Completed', category: 'Governance', description: '94% Consensus reached to proceed with $200M M&A under $15M holdback.', docName: 'Boardroom-Consensus-Report.pdf' },
      { date: 'Yesterday', title: 'Delaware DGCL § 141 Audit Verified', category: 'Legal', description: 'Cryptographic SHA-256 validation completed for director fiduciary safe-harbor.', docName: 'DGCL-141-SafeHarbor-Cert.pdf' }
    ],
    timelineHighlights: [
      { date: 'Day 1', milestone: 'Definitive Agreement Signing', impact: '1x Indemnity Cap Enforced' },
      { date: 'Day 45', milestone: 'Secondary Foundry Silicon Samples', impact: 'Dual-Sourcing Validated' },
      { date: 'Day 90', milestone: 'M&A Closing & Escrow Release Gate', impact: '$28.5M EBITDA Synergies Unlocked' }
    ]
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SCENARIO B: Q3 Margin Compression & Delaware DGCL § 141 Safe-Harbor Audit
// ─────────────────────────────────────────────────────────────────────────────
export const SAMPLE_SCENARIO_B: SampleScenarioDefinition = {
  id: 'scenario-b',
  key: 'margin-dgcl141',
  title: 'Q3 Margin Compression & Delaware DGCL § 141 Safe-Harbor Audit',
  subtitle: 'Restructure cloud infrastructure and vendor contracts to protect operating margins without triggering director fiduciary liability.',
  badge: 'Margin Optimization & Delaware DGCL § 141',
  iconType: 'trending',
  strategicQuestion: 'Q3 Margin Compression & Delaware DGCL § 141 Safe-Harbor Audit: Can we restructure cloud infrastructure and vendor contracts to protect operating margins without triggering director fiduciary liability?',
  tags: ['Margin Optimization', 'Delaware DGCL § 141(e)', 'Cloud Cost SCM', 'Vendor Rationalization', '10-Agent Deliberation'],

  boardroomResult: {
    query: 'Q3 Margin Compression & Delaware DGCL § 141 Safe-Harbor Audit: Can we restructure cloud infrastructure and vendor contracts to protect operating margins without triggering director fiduciary liability?',
    scenarioId: 'scenario-b',
    scenarioTitle: 'Q3 Margin Compression & Delaware DGCL § 141 Safe-Harbor Audit',
    timestamp: new Date().toISOString(),
    synthesis: {
      overallConfidence: 96,
      finalRecommendation: 'Execute the Q3 Margin Optimization Initiative: enforce Delaware DGCL § 141(e) safe-harbor protections, consolidate SaaS vendors for $4.2M annualized savings, and deploy algorithmic compute cost controls to elevate operating margin to 29.4%.',
      consensus: [
        'Delaware DGCL § 141(e) provides complete board shielding when relying in good faith on algorithmic financial twins and certified general counsel audits.',
        'Cloud infrastructure optimization (spot instances, GPU auto-scaling, caching) directly restores operating margins to 29.4% within 60 days.',
        'SaaS vendor rationalization eliminates 18 redundant tooling subscriptions saving $4.2M annualized with zero operational friction.',
        'Transitioning enterprise accounts to upfront annual billing accelerates net cash collection by 2.4x.'
      ],
      disagreements: [
        'Chief Marketing Officer proposes maintaining higher top-of-funnel ad spend to capture distressed competitor accounts, whereas CFO insists on strict sub-12-month CAC payback discipline.',
        'Director of Operations requests a 30-day grace period for legacy vendor decommissioning to prevent data migration downtime.'
      ],
      risks: [
        'Vendor early termination fees if 30-day notice windows are missed on legacy enterprise software contracts.',
        'Potential compute latency spikes during aggressive GPU spot-instance autoscaling transitions.'
      ],
      opportunities: [
        'Structural expansion of EBITDA margin from 18.2% to 29.4%, establishing top-quartile Rule-of-40 efficiency.',
        'Fiduciary audit documentation setting standard for future institutional financing and board governance.'
      ]
    },
    executives: [
      {
        roleId: 'CEO',
        roleTitle: 'Chief Executive Officer',
        name: 'Eleanor Vance',
        avatarColor: '#fc4778',
        verdict: 'SUPPORT',
        confidenceScore: 96,
        reasoning: 'Protecting operating margin while maintaining 40%+ ARR growth is our primary strategic mandate. This initiative establishes permanent operational discipline and positions us for premium valuation multiples.',
        keyConcerns: [
          'Ensuring customer satisfaction and SLA standards remain uncompromised during cost restructuring.',
          'Aligning departmental OKRs with new gross margin targets.'
        ],
        dataEvidence: [
          'Corporate Strategic Plan 2026-2028',
          'SaaS Rule-of-40 Benchmark & Valuation Multiples Report'
        ]
      },
      {
        roleId: 'CFO',
        roleTitle: 'Chief Financial Officer',
        name: 'Marcus Sterling',
        avatarColor: '#10b981',
        verdict: 'SUPPORT',
        confidenceScore: 98,
        reasoning: 'Re-negotiating 3-year cloud reserve commitments and consolidating 18 redundant SaaS tools yields $4.2M in immediate cash savings. EBITDA margin jumps from 18.2% to 29.4%, expanding quarterly free cashflow by $3.8M.',
        keyConcerns: [
          'Tracking vendor contract termination deadlines to avoid auto-renewals.',
          'Maintaining working capital reserves during Q3 billing transition.'
        ],
        dataEvidence: [
          'Q3 Departmental Cost Accounting & SaaS Spend Matrix',
          'Cloud Reserve Instance & Savings Plan ROI Model'
        ]
      },
      {
        roleId: 'COO',
        roleTitle: 'Chief Operating Officer',
        name: 'Sarah Chen',
        avatarColor: '#3b82f6',
        verdict: 'SUPPORT',
        confidenceScore: 94,
        reasoning: 'Operational audit identified 45 overlapping SaaS licenses across marketing, sales, and engineering. Unified tooling under our enterprise hub reduces software bloat and eliminates administrative friction.',
        keyConcerns: [
          'Change management and staff retraining on consolidated software stack.',
          'Exporting and archiving historical vendor telemetry.'
        ],
        dataEvidence: [
          'Enterprise Software License Utilization Audit 2026',
          'SOP Consolidation & Workflow Automation Plan'
        ]
      },
      {
        roleId: 'CTO',
        roleTitle: 'Chief Technology Officer',
        name: 'Dr. Aris Thorne',
        avatarColor: '#06b6d4',
        verdict: 'SUPPORT',
        confidenceScore: 97,
        reasoning: 'Autonomous spot-instance scheduling, GPU cluster right-sizing, and distributed caching reduce cloud compute costs by 34% with zero impact on 99.99% API SLA uptime.',
        keyConcerns: [
          'Maintaining GPU availability during model fine-tuning peak hours.',
          'Automated fallback to on-demand instances during spot interruptions.'
        ],
        dataEvidence: [
          'Cloud Compute Telemetry & Instance Utilization Logs',
          'Kubernetes Cluster Cost Optimization Benchmark'
        ]
      },
      {
        roleId: 'LEGAL',
        roleTitle: 'General Counsel',
        name: 'Victoria Hayes',
        avatarColor: '#f59e0b',
        verdict: 'SUPPORT',
        confidenceScore: 99,
        reasoning: 'Delaware DGCL § 141(e) safe-harbor review is completely verified. Directors acting upon fully documented mathematical twins and certified cost models are immune from shareholder breach-of-fiduciary duty claims.',
        keyConcerns: [
          'Enforcing proper 30-day non-renewal notices to prevent auto-renewal disputes.',
          'Reviewing data retention obligations in terminated vendor contracts.'
        ],
        dataEvidence: [
          'Delaware General Corporation Law § 141(e) Statutory Fiduciary Memo',
          'Master Vendor Agreement Termination & Notice Tracker'
        ]
      },
      {
        roleId: 'HR',
        roleTitle: 'Chief People Officer',
        name: 'David Miller',
        avatarColor: '#ec4899',
        verdict: 'SUPPORT',
        confidenceScore: 91,
        reasoning: 'Cost restructuring is achieved through software and compute efficiency with zero headcount reduction. Team morale remains high with performance bonuses tied to departmental efficiency metrics.',
        keyConcerns: [
          'Clear executive communication that margin optimization does not mean layoffs.',
          'Providing continuous access to essential engineering developer tools.'
        ],
        dataEvidence: [
          'Employee Engagement & Sentiment Index Q3',
          'Departmental Productivity & Tool Satisfaction Survey'
        ]
      },
      {
        roleId: 'SALES',
        roleTitle: 'VP of Global Sales',
        name: 'Rachel Ross',
        avatarColor: '#ef4444',
        verdict: 'SUPPORT',
        confidenceScore: 93,
        reasoning: 'Offering enterprise customers an 8% discount for upfront annual billing accelerates cash conversion cycle and eliminates monthly collection overhead, generating $6.1M in upfront cashflow.',
        keyConcerns: [
          'Sales rep compensation alignment on annual upfront contracts.',
          'Maintaining deal velocity across mid-market accounts.'
        ],
        dataEvidence: [
          'Annual vs Monthly Billing Conversion Rate Analysis',
          'Enterprise Customer Cash Collection Cycle Report'
        ]
      },
      {
        roleId: 'MARKETING',
        roleTitle: 'Chief Marketing Officer',
        name: 'Julian Mercer',
        avatarColor: '#eab308',
        verdict: 'SUPPORT',
        confidenceScore: 90,
        reasoning: 'Reallocating advertising budget to high-intent enterprise search and account-based marketing (ABM) reduces blended CAC by 22% while increasing enterprise MQL conversion rates.',
        keyConcerns: [
          'Maintaining brand awareness while reducing low-intent programmatic ad spend.',
          'Optimizing content marketing ROI and SEO pipeline.'
        ],
        dataEvidence: [
          'CAC by Marketing Channel & LTV Cohort Model',
          'Enterprise Lead Attribution Telemetry'
        ]
      },
      {
        roleId: 'OPS',
        roleTitle: 'Director of Operations',
        name: 'Kevin Durant',
        avatarColor: '#6366f1',
        verdict: 'SUPPORT',
        confidenceScore: 95,
        reasoning: 'Vendor decommissioning workflow scheduled in 3 phased batches with automated data backup. Tier-1 enterprise SLAs remain fully protected with 24/7 dedicated support routing.',
        keyConcerns: [
          'Ensuring zero downtime during database connection migration.',
          'Validating single-sign-on (SSO) cutover across remaining tools.'
        ],
        dataEvidence: [
          'Operations Service Level Agreement (SLA) Matrix',
          'Infrastructure Migration Runbook v2.4'
        ]
      },
      {
        roleId: 'COMPLIANCE',
        roleTitle: 'Chief Compliance Officer',
        name: 'Elena Rostova',
        avatarColor: '#14b8a6',
        verdict: 'SUPPORT',
        confidenceScore: 96,
        reasoning: 'All vendor termination protocols comply with SOC 2 Type II, ISO 27001, and GDPR data disposal requirements. Vendor deletion certificates will be archived in the compliance vault.',
        keyConcerns: [
          'Receiving certified data destruction notices from decommissioned SaaS vendors.',
          'Maintaining continuous audit trail for annual compliance recertification.'
        ],
        dataEvidence: [
          'SOC 2 Type II Vendor Offboarding Control Standard',
          'GDPR Article 28 Data Processing & Erasure Audit Log'
        ]
      }
    ]
  },

  scmScenario: {
    id: 'scm-margin-dgcl141',
    title: 'Q3 Margin Compression & Delaware DGCL § 141 SCM',
    description: 'Model causal impact of cloud compute right-sizing, SaaS consolidation, and upfront billing on EBITDA margin and director fiduciary safe-harbor.',
    category: 'Margin & Fiduciary SCM',
    factualBaseline: 18.2,
    counterfactualValue: 29.4,
    causalDelta: 11.2,
    percentChange: 61.5,
    targetNode: 'OperatingMarginPct',
    interventionNode: 'do(CloudCostReduction=34%, SaaSConsolidation=$4.2M, UpfrontBilling=0.65)',
    backdoorSet: ['CloudPricingIndex', 'CustomerChurnRate', 'WorkingCapitalDrag'],
    confidenceInterval: [27.8, 31.0],
    formalEquation: 'P(MarginPct_{do(Cloud=-34%, SaaS=-4.2M, Upfront=65%)} | \\mathbf{e}) = \\sum_{z} P(Margin | do(\\cdot), z) P(z | Churn, PricingIndex)',
    baseEbitda: 24.5,
    baseRunway: 28.0,
    sliders: [
      {
        id: 'lever_compute',
        name: 'Cloud & GPU Compute Optimization',
        unit: '%',
        min: 0,
        max: 50,
        step: 5,
        defaultValue: 35,
        minLabel: '0% (Standard)',
        midLabel: '25%',
        maxLabel: '50% (Spot Autoscaling)',
        ebitdaMultiplier: 0.95,
        runwayMultiplier: 0.35
      },
      {
        id: 'lever_saas',
        name: 'SaaS Tooling Consolidation',
        unit: '$M/yr',
        min: 0,
        max: 8,
        step: 0.5,
        defaultValue: 4.2,
        minLabel: '$0M (No change)',
        midLabel: '$4M',
        maxLabel: '$8M (Deep prune)',
        ebitdaMultiplier: 0.88,
        runwayMultiplier: 0.42
      },
      {
        id: 'lever_upfront',
        name: 'Annual Upfront Billing Mix',
        unit: '%',
        min: 0,
        max: 100,
        step: 10,
        defaultValue: 65,
        minLabel: '20% (Monthly dominant)',
        midLabel: '50%',
        maxLabel: '100% (All Annual)',
        ebitdaMultiplier: 0.45,
        runwayMultiplier: 0.65
      }
    ],
    deliberation: {
      legal: {
        agent: 'GENERAL COUNSEL (LEGAL TWIN)',
        framework: 'DELAWARE DGCL § 141(e) SAFE-HARBOR',
        opinion: 'Delaware General Corporation Law § 141(e) explicitly protects directors when relying in good faith upon expert reports and verifiable computational data. Restructuring without layoffs creates absolute fiduciary defense against derivative suits.',
        citation: 'Delaware General Corporation Law § 141(e) · SHA-256: 9e4f...b82a'
      },
      cfo: {
        agent: 'CFO DIGITAL TWIN (PYTHON SCM)',
        metricProof: '0.00% ARITHMETIC DRIFT · ZERO RUNWAY LOSS',
        opinion: 'Structural causal intervention directly expands net EBITDA margin from 18.2% to 29.4%, boosting annual free cash flow by $15.2M with zero debt dilution.'
      },
      redTeam: {
        agent: 'ADVERSARIAL RED TEAM TWIN',
        attackVector: 'VENDOR DISRUPTION STRESS-TEST',
        opinion: 'Tested 50 simulated vendor cutovers. Zero critical dependencies failed when notice windows were staggered by 14 days with automated database backups.'
      },
      ceo: {
        agent: 'CEO TWIN (SYNTHESIZED ACTION DOSSIER)',
        consensusVerdict: 'Quorum Recommendation: Ratify Delaware DGCL § 141 safe-harbor audit, authorize cloud compute right-sizing, terminate 18 redundant SaaS subscriptions, and push annual upfront contract terms.',
        actionRoadmap: [
          '1. Archive Delaware DGCL § 141(e) safe-harbor fiduciary audit certificate',
          '2. Deploy Kubernetes spot-instance autoscaler reducing cloud compute by 34%',
          '3. Issue 30-day non-renewal notices to 18 redundant SaaS vendors saving $4.2M'
        ],
        jiraDispatchSummary: '[Causarix Margin SCM Dispatch] Q3 EBITDA Expansion & DGCL § 141 Fiduciary Audit'
      }
    },
    simulationResult: {
      decisionType: 'Q3 Margin Compression & Delaware DGCL § 141 Safe-Harbor Audit',
      decisionDetails: 'Restructure cloud infrastructure, right-size GPU compute, consolidate redundant SaaS tools for $4.2M savings, and enforce Delaware DGCL § 141(e) director protection.',
      scenarios: {
        expected: {
          title: 'Expected Baseline Impact',
          probability: 72,
          description: 'Cloud compute cost drops by 34%; $4.2M in redundant SaaS eliminated; Operating EBITDA margin reaches 29.4% within 60 days.',
          netProfitabilityDelta: 18.4,
          departmentImpacts: [
            { department: 'Finance & Treasury', deltaPercent: 22.0, analysis: 'Immediate $3.8M quarterly cash flow expansion.' },
            { department: 'Technology & Cloud', deltaPercent: 19.5, analysis: '34% reduction in compute bills with zero SLA latency impact.' },
            { department: 'Operations', deltaPercent: 14.0, analysis: 'Simplified single-hub software tooling eliminates workflow friction.' },
            { department: 'Legal & Fiduciary', deltaPercent: 12.0, analysis: '100% Delaware DGCL § 141(e) safe-harbor protection verified.' },
            { department: 'Sales & Revenue', deltaPercent: 10.5, analysis: 'Upfront billing adoption reaches 65% with 8% discount incentive.' }
          ]
        },
        optimistic: {
          title: 'Optimistic Upside Scenario',
          probability: 20,
          description: 'SaaS consolidation unlocks $5.8M in enterprise vendor credits; upfront annual contract adoption hits 82%; operating margin exceeds 33.5%.',
          netProfitabilityDelta: 31.2,
          departmentImpacts: [
            { department: 'Finance & Treasury', deltaPercent: 36.0, analysis: 'Record quarterly free cash flow generation.' },
            { department: 'Technology & Cloud', deltaPercent: 28.0, analysis: 'Dynamic GPU instance auction yields 44% cost reduction.' }
          ]
        },
        worstCase: {
          title: 'Downside Risk Scenario',
          probability: 8,
          description: 'Early termination fees on 2 vendor contracts reduce Year 1 savings by $400k; margin still expands to 24.1%.',
          netProfitabilityDelta: 4.5,
          departmentImpacts: [
            { department: 'Finance & Treasury', deltaPercent: 6.0, analysis: 'Positive cash savings despite minor contract termination penalties.' },
            { department: 'Technology & Cloud', deltaPercent: 8.0, analysis: 'Spot instance provisioning adapts with minor tuning.' }
          ]
        }
      },
      cascadingChain: [
        { step: 1, fromDepartment: 'Engineering & Cloud Ops', toDepartment: 'Finance & Cost Accounting', effectDescription: 'Spot-instance autoscaling immediately drops monthly cloud invoice by 34%.' },
        { step: 2, fromDepartment: 'Procurement', toDepartment: 'IT & Security', effectDescription: 'Decommissioning 18 redundant tools simplifies SOC 2 compliance and removes $4.2M spend.' },
        { step: 3, fromDepartment: 'Finance & Treasury', toDepartment: 'Executive Board', effectDescription: 'Higher operating margin delivers top-tier Rule-of-40 performance with full DGCL § 141 shielding.' }
      ],
      assumptionsUsed: [
        { assumption: 'Cloud provider spot-instance interruption rate remains below 2.5%.', groundedSource: 'Cloud Compute Reliability SLA' },
        { assumption: 'Delaware Chancery Court precedents uphold algorithmic twin reliance under DGCL § 141(e).', groundedSource: 'Delaware Corporate Governance Compendium 2026' }
      ],
      uncertaintyRange: {
        minEstimate: '+4.5% Margin',
        maxEstimate: '+31.2% Margin',
        confidenceBounds: '95% Confidence Interval based on 10,000 Monte Carlo iterations'
      },
      monteCarloMath: {
        totalIterations: 10000,
        p10WorstCase: 24100000,
        p50Expected: 29400000,
        p90Optimistic: 33500000,
        var95: 22800000,
        distributionHistogram: [
          { binStart: 18000000, binEnd: 20000000, count: 210, frequency: 2.1 },
          { binStart: 20000001, binEnd: 22000000, count: 580, frequency: 5.8 },
          { binStart: 22000001, binEnd: 24000000, count: 1250, frequency: 12.5 },
          { binStart: 24000001, binEnd: 26000000, count: 2120, frequency: 21.2 },
          { binStart: 26000001, binEnd: 28000000, count: 2850, frequency: 28.5 },
          { binStart: 28000001, binEnd: 30000000, count: 1840, frequency: 18.4 },
          { binStart: 30000001, binEnd: 32000000, count: 820, frequency: 8.2 },
          { binStart: 32000001, binEnd: 34000000, count: 260, frequency: 2.6 },
          { binStart: 34000001, binEnd: 36000000, count: 70, frequency: 0.7 }
        ],
        mathematicalFormulasUsed: [
          { name: 'Operating Margin Equation', formula: '\\text{Operating Margin} = \\frac{\\text{Revenue} - \\text{COGS} - \\text{OPEX}}{\\text{Revenue}} \\times 100\\%', description: 'Computes EBITDA margin improvement post-cloud and SaaS optimization.' },
          { name: 'Delaware § 141 Fiduciary Safe-Harbor Proof', formula: '\\text{Liability Shield} = \\mathbb{I}(\\text{Good Faith} \\land \\text{Expert Record Reliance} \\land \\text{Due Care}) = 1.0', description: 'Formal verification of director immunity under Delaware General Corporation Law.' }
        ]
      }
    }
  },

  executiveBrief: {
    executiveBrief: 'Q3 Margin Optimization and Delaware DGCL § 141 Safe-Harbor active: Operating margin modeled to expand from 18.2% to 29.4% through $4.2M SaaS consolidation and 34% cloud compute right-sizing. Complete 10-Agent quorum consensus reached with 96% confidence and zero director fiduciary liability under DGCL § 141(e).',
    healthScore: 96,
    knowledgeCoverage: 99,
    riskLevel: 'LOW',
    decisionConfidence: 96,
    executiveAnswers: [
      {
        id: 'margin_ans_1',
        question: 'Does Delaware DGCL § 141(e) protect board members during aggressive operational restructuring?',
        answer: 'Yes. Under DGCL § 141(e), directors are fully protected from liability when relying in good faith upon expert corporate records, financial models, and specialized AI digital twins.',
        status: 'HEALTHY',
        citations: [
          { documentName: 'Delaware DGCL § 141 Fiduciary Audit Certificate.pdf', snippet: 'Directors relying upon authenticated expert data records receive full safe-harbor immunity under Delaware DGCL § 141(e).' }
        ]
      },
      {
        id: 'margin_ans_2',
        question: 'How much annualized cost savings is achieved through SaaS and cloud infrastructure right-sizing?',
        answer: 'SaaS consolidation eliminates 18 redundant tools generating $4.2M in annual savings. Cloud spot-instance autoscaling reduces compute bills by 34% ($2.9M annual run rate).',
        status: 'HEALTHY',
        citations: [
          { documentName: 'Q3 SaaS Spend & Vendor License Audit.xlsx', snippet: '18 overlapping tool subscriptions identified totaling $4.21M annual spend.' },
          { documentName: 'Cloud Infrastructure Compute Efficiency Memo.pdf', snippet: 'Spot-instance autoscaler reduces monthly cloud compute expense by 34.2%.' }
        ]
      },
      {
        id: 'margin_ans_3',
        question: 'What is the cashflow impact of shifting enterprise customers to upfront annual billing?',
        answer: 'Offering an 8% discount for upfront annual billing accelerates net cash collection by 2.4x, providing an immediate $6.1M working capital liquidity buffer.',
        status: 'HEALTHY',
        citations: [
          { documentName: 'Enterprise Billing & Cash Conversion Analysis.xlsx', snippet: 'Annual upfront contract adoption increases cash conversion velocity by 240%.' }
        ]
      }
    ],
    departmentHealth: [
      { department: 'Finance & Treasury', healthScore: 98, riskLevel: 'LOW', summary: 'EBITDA margin up 11.2% with $3.8M quarterly free cashflow growth.', activeIssuesCount: 0, citations: [{ documentName: 'Q3 SaaS Spend & Vendor License Audit.xlsx', snippet: 'Free cashflow expanded.' }] },
      { department: 'Technology & Cloud', healthScore: 96, riskLevel: 'LOW', summary: '34% compute bill reduction running seamlessly on spot instances.', activeIssuesCount: 0, citations: [{ documentName: 'Cloud Infrastructure Compute Efficiency Memo.pdf', snippet: 'Cloud spend optimized.' }] },
      { department: 'Legal & Fiduciary', healthScore: 100, riskLevel: 'LOW', summary: 'Delaware DGCL § 141(e) safe-harbor immunity certified by General Counsel.', activeIssuesCount: 0, citations: [{ documentName: 'Delaware DGCL § 141 Fiduciary Audit Certificate.pdf', snippet: 'Fiduciary shield active.' }] },
      { department: 'Sales & Revenue', healthScore: 92, riskLevel: 'LOW', summary: 'Annual upfront billing adoption driving rapid cash collection.', activeIssuesCount: 0, citations: [{ documentName: 'Enterprise Billing & Cash Conversion Analysis.xlsx', snippet: 'High upfront adoption.' }] },
      { department: 'People & HR', healthScore: 95, riskLevel: 'LOW', summary: 'Zero layoffs; performance bonuses aligned with efficiency OKRs.', activeIssuesCount: 0, citations: [{ documentName: 'Corporate Strategic Plan 2026-2028', snippet: 'Headcount preserved.' }] }
    ],
    aiRecommendations: [
      { id: 'rec_margin_1', priority: 'CRITICAL', title: 'Issue 30-Day SaaS Non-Renewal Notices', recommendation: 'Dispatch automated non-renewal notices to the 18 identified redundant SaaS vendors to lock in $4.2M in annual savings before auto-renewals trigger.', rationale: 'Prevents automatic 12-month lock-in on unused software licenses.', citations: [{ documentName: 'Q3 SaaS Spend & Vendor License Audit.xlsx', snippet: 'Auto-renewal dates approaching.' }] },
      { id: 'rec_margin_2', priority: 'HIGH', title: 'Deploy Spot-Instance Kubernetes Scheduler', recommendation: 'Enable automated spot-instance scheduling across non-critical data processing and batch inference workloads.', rationale: 'Immediately cuts daily cloud compute expenses by 34%.', citations: [{ documentName: 'Cloud Infrastructure Compute Efficiency Memo.pdf', snippet: 'Spot autoscaling verified.' }] }
    ],
    recentEvents: [
      { date: 'Today', title: 'Delaware DGCL § 141 Fiduciary Shield Certified', category: 'Governance', description: 'Board quorum verified with 96% confidence; safe-harbor immunity formally recorded.', docName: 'DGCL-141-SafeHarbor-Certificate.pdf' },
      { date: 'Today', title: '10-Agent Boardroom Deliberation Completed', category: 'Executive Board', description: 'Consensus reached to execute Q3 Margin Optimization Initiative.', docName: 'Boardroom-Margin-Consensus.pdf' }
    ],
    timelineHighlights: [
      { date: 'Day 1', milestone: 'Fiduciary Safe-Harbor Ratification', impact: 'DGCL § 141(e) Shielded' },
      { date: 'Day 15', milestone: 'SaaS 30-Day Notices Dispatched', impact: '$4.2M Annual Savings Locked' },
      { date: 'Day 60', milestone: 'Full Cloud Spot-Instance Cutover', impact: '29.4% EBITDA Margin Achieved' }
    ]
  }
};

export const ALL_SAMPLE_SCENARIOS: Record<string, SampleScenarioDefinition> = {
  'scenario-a': SAMPLE_SCENARIO_A,
  'scenario-b': SAMPLE_SCENARIO_B,
  'supply-chain-mna': SAMPLE_SCENARIO_A,
  'margin-dgcl141': SAMPLE_SCENARIO_B,
  'mna': SAMPLE_SCENARIO_A,
  'margin': SAMPLE_SCENARIO_B
};

export function getSampleScenario(idOrKey: string): SampleScenarioDefinition {
  const normalized = idOrKey?.toLowerCase().trim() || 'scenario-a';
  return ALL_SAMPLE_SCENARIOS[normalized] || SAMPLE_SCENARIO_A;
}
