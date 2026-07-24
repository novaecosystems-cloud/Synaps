export interface DemoOrganization {
  name: string;
  industry: string;
  tier: string;
  healthScore: number;
  activeProjects: number;
  totalDocuments: number;
  decisionsLogged: number;
  aiCreditsRemaining: number;
}

export const APEX_DEMO_ORG: DemoOrganization = {
  name: "Apex Global Technologies",
  industry: "Enterprise AI & Cloud Infrastructure",
  tier: "Enterprise Max",
  healthScore: 96,
  activeProjects: 24,
  totalDocuments: 1420,
  decisionsLogged: 384,
  aiCreditsRemaining: 10000
};

export const DEMO_EXECUTIVE_BRIEF = {
  executiveBrief: "Apex Global Technologies is operating at peak efficiency across all 15 core enterprise nodes. System stability is 96.4%. AI Boardroom agents achieved unanimous consensus on Q3 APAC expansion and APAC cloud node migration. Zero critical security or contract compliance risks detected.",
  healthScore: 96,
  knowledgeCoverage: 99,
  riskLevel: 'LOW' as const,
  decisionConfidence: 98,
  executiveAnswers: [
    {
      id: 'ans-1',
      question: 'What is our Q3 APAC Cloud Expansion risk exposure?',
      answer: 'APAC Cloud Expansion risk is minimal (2.1%). Financial reserves are allocated at $4.2M, and compliance matrices for ISO 27001 & SOC 2 Type II are 100% verified across all regional nodes.',
      status: 'HEALTHY' as const,
      citations: [
        { documentName: 'Q3_APAC_Cloud_Expansion_Plan.pdf', snippet: 'Budget allocated: $4.2M. Regulatory approval cleared.' },
        { documentName: 'ISO27001_Compliance_Audit_2026.docx', snippet: 'Audit score: 100% compliance across all data centers.' }
      ]
    },
    {
      id: 'ans-2',
      question: 'Are there any unexecuted vendor agreements for H2?',
      answer: 'Zero unsigned agreements. All 28 vendor contracts and SLAs for H2 2026 have been fully executed with counter-party signatures verified.',
      status: 'HEALTHY' as const,
      citations: [
        { documentName: 'H2_Vendor_Contract_Register.xlsx', snippet: '28/28 contracts executed with digital signatures.' }
      ]
    },
    {
      id: 'ans-3',
      question: 'What is the projected ROI on the Digital Twin OS rollout?',
      answer: 'Projected 340% ROI within 12 months, driven by automated risk detection and reduction in unexpected system downtime from 4.2 hours to 0.1 hours/month.',
      status: 'HEALTHY' as const,
      citations: [
        { documentName: 'Digital_Twin_ROI_Analysis.pdf', snippet: 'Estimated savings: $1.8M annually in operational overhead.' }
      ]
    }
  ],
  departmentHealth: [
    { department: 'Engineering & AI Labs', healthScore: 98, riskLevel: 'LOW' as const, summary: '18 microservices deployed; latency < 12ms', activeIssuesCount: 0, citations: [] },
    { department: 'Legal & Governance', healthScore: 99, riskLevel: 'LOW' as const, summary: '100% contract compliance; 0 open disputes', activeIssuesCount: 0, citations: [] },
    { department: 'Finance & Capital Strategy', healthScore: 95, riskLevel: 'LOW' as const, summary: 'Q2 revenue +28% YoY; $14.2M ARR', activeIssuesCount: 0, citations: [] },
    { department: 'Global Operations & Security', healthScore: 94, riskLevel: 'LOW' as const, summary: 'Zero security breaches; SOC2 certified', activeIssuesCount: 0, citations: [] }
  ],
  aiRecommendations: [
    {
      id: 'rec-1',
      priority: 'HIGH' as const,
      title: 'Automate Disruption Testing in APAC Cloud Region',
      recommendation: 'Run quarterly automated Digital Twin stress simulations on regional node latency.',
      rationale: 'Preemptively mitigates potential bandwidth bottlenecks during peak Q4 sales volume.',
      citations: [{ documentName: 'APAC_Load_Testing_SOP.pdf', snippet: 'Quarterly stress testing recommended.' }]
    },
    {
      id: 'rec-2',
      priority: 'MEDIUM' as const,
      title: 'Extend Auto-Renewal Clauses on Core Cloud Subscriptions',
      recommendation: 'Lock in 3-year enterprise rates with tier 1 cloud infrastructure providers.',
      rationale: 'Secures an estimated 18% cost discount on server compute overhead.',
      citations: [{ documentName: 'Infrastructure_Cost_Optimization.pdf', snippet: '3-year lock-in yields 18% savings.' }]
    }
  ],
  recentEvents: [
    { date: 'Today, 09:30 AM', title: 'AI Boardroom Unanimous Vote', category: 'Strategy', description: 'All 10 AI Executive Agents voted in favor of Q3 APAC expansion.' },
    { date: 'Yesterday, 04:15 PM', title: 'Digital Twin Simulation Passed', category: 'Operations', description: 'Stress-tested 15 core nodes against 50% simulated server outage with zero data loss.' },
    { date: 'Jul 22, 2026', title: 'SOC 2 Type II Audit Completed', category: 'Compliance', description: 'Independent auditor verified 100% compliance across all data centers.' }
  ],
  timelineHighlights: [
    { date: 'Q3 2026', milestone: 'Synaps AI OS v4.2 Upgrade', impact: 'Completed' },
    { date: 'Q4 2026', milestone: 'Global Multi-Region Node Expansion', impact: 'In Progress' },
    { date: 'Q1 2027', milestone: 'Autonomous Enterprise AI Boardroom v5', impact: 'Scheduled' }
  ]
};
