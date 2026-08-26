/**
 * Causarix Org-Adaptive Content Engine
 * Maps org.settings.sector → domain-specific agents, metrics, presets, simulation labels.
 * Zero fixation — every dashboard reads from this file, never hardcodes strings.
 */

export type Sector =
  | 'legal'
  | 'biotech'
  | 'saas'
  | 'fintech'
  | 'realestate'
  | 'supplychain'
  | 'healthcare'
  | 'manufacturing'
  | 'education'
  | 'media'
  | 'default';

export type OrgSize = 'solo' | '2-10' | '11-50' | '51-200' | '201-1000' | '1000+';

export type OrgPriority =
  | 'compliance'
  | 'fundraising'
  | 'ip-protection'
  | 'cost-reduction'
  | 'revenue-growth'
  | 'risk-management'
  | 'hiring'
  | 'international-expansion'
  | 'm-and-a'
  | 'digital-transformation';

export interface OrgProfile {
  sector: Sector;
  orgType: string;
  companyName: string;
  size: OrgSize;
  primaryRole: string;
  priorities: OrgPriority[];
  onboardingCompleted: boolean;
  customAgents?: string[];
  customMetrics?: string[];
}

export interface SectorContent {
  label: string;
  boardroomTitle: string;
  agents: string[];
  metrics: string[];
  simulationDecisionTypes: string[];
  simulationDepartments: string[];
  missionPresets: { title: string; description: string }[];
  chiefOfStaffChannels: string[];
  chiefOfStaffAlertTemplates: ((orgName: string) => string)[];
  boardroomQuestions: string[];
  invariantLabel: string;
  legalFramework: string;
  benchmarkMetricPrimary: string;
  benchmarkMetricSecondary: string;
}

const SECTOR_CONTENT: Record<Sector, SectorContent> = {
  legal: {
    label: 'Legal & Professional Services',
    boardroomTitle: 'PARTNERSHIP COMMITTEE',
    agents: ['Managing Partner', 'Conflicts Counsel', 'Head of Billing', 'Chief Risk Officer'],
    metrics: ['Realization Rate', 'Matter Margin', 'WIP Exposure', 'Partner Utilization'],
    simulationDecisionTypes: ['Expand Practice Area', 'Merge with Lateral Group', 'Introduce Fixed-Fee Billing', 'Open New Office', 'Hire Associates', 'Launch Client Portal'],
    simulationDepartments: ['Litigation', 'Corporate', 'Tax & Compliance', 'Client Development', 'Operations'],
    missionPresets: [
      { title: 'Conflict of Interest Audit — All Active Matters', description: 'Scan all active client matters for cross-client conflict exposure under Rule 1.7.' },
      { title: 'Partnership Compensation & Equity Realignment', description: 'Model 3-year lockstep vs. origination compensation scenarios for incoming partners.' },
      { title: 'Matter Profitability & Realization Deep Dive', description: 'Identify lowest-realization practice areas and generate billing reform recommendations.' },
      { title: 'Regulatory Compliance & Bar Ethics Review', description: 'Audit all engagement letters and retainer agreements for jurisdiction-specific ethics compliance.' },
    ],
    chiefOfStaffChannels: ['Client Email & Communications', 'Matter Management System', 'Document & Contract Vault', 'Partner Calendar & Deadlines', 'Billing & AR Pipeline', 'Compliance & Ethics Monitor', 'Court Filing Deadlines', 'Client Relationship CRM'],
    chiefOfStaffAlertTemplates: [
      (org) => `Statute of limitations deadline approaching on 3 open matters for ${org} — immediate partner review required.`,
      (org) => `${org} billing realization below 82% for second consecutive month — matter profitability review flagged.`,
      (_org) => `Potential conflict of interest detected: New matter intake shares adverse party with existing active client.`,
      (_org) => `Retainer replenishment notice: 4 client trust accounts below minimum threshold — billing action required.`,
    ],
    boardroomQuestions: [
      'Should we merge our corporate practice with a boutique M&A firm?',
      'How should we respond to a competing firm undercutting our rates by 25%?',
      'Should we transition high-volume matters to a fixed-fee model?',
      'Is our current lateral hiring pipeline meeting 5-year equity partner targets?',
    ],
    invariantLabel: 'Rule 1.7 Conflict Invariant',
    legalFramework: 'ABA Model Rules of Professional Conduct',
    benchmarkMetricPrimary: 'Realization Rate',
    benchmarkMetricSecondary: 'Matter Margin',
  },

  biotech: {
    label: 'Biotech & Life Sciences',
    boardroomTitle: 'SCIENTIFIC ADVISORY BOARD',
    agents: ['Chief Medical Officer', 'IP Counsel', 'Clinical CFO', 'Regulatory Affairs Director'],
    metrics: ['Clinical Trial Burn Rate', 'FDA Timeline Risk', 'IP Revenue Run', 'Trial Enrollment Rate'],
    simulationDecisionTypes: ['Accelerate Phase 2 Trial', 'License IP to Pharma Partner', 'Expand to EU Market', 'Acquire CRO Partner', 'Raise Series B Round', 'Out-license Non-Core Assets'],
    simulationDepartments: ['Clinical Operations', 'Regulatory Affairs', 'IP & Licensing', 'Finance & Treasury', 'Medical Affairs'],
    missionPresets: [
      { title: 'FDA IND Submission Audit — Phase 2 Readiness', description: 'Audit investigational new drug application documents for regulatory completeness.' },
      { title: 'IP Portfolio Valuation & Licensing Pipeline', description: 'Map all patent assets, expiry timelines, and inbound licensing term sheets.' },
      { title: 'Clinical Trial Burn Rate & Runway Projection', description: 'Model monthly burn against trial milestone calendar with sensitivity analysis.' },
      { title: 'EU MDR / HIPAA Cross-Jurisdiction Compliance Review', description: 'Identify cross-border clinical data compliance gaps across all trial sites.' },
    ],
    chiefOfStaffChannels: ['Clinical Trial Milestone Tracker', 'Regulatory Submission Calendar', 'IP & Patent Filing System', 'Investor Relations & Board', 'Vendor CRO Contracts', 'Finance & Grant Accounting', 'Lab Operations & Inventory', 'Medical Affairs Correspondence'],
    chiefOfStaffAlertTemplates: [
      (org) => `${org} Phase 2 trial enrollment is 18% below target — site activation review recommended within 72 hours.`,
      (org) => `FDA response window closes in 21 days — ${org} regulatory team has not submitted required supplemental data.`,
      (org) => `Key IP patent for ${org} expires in 90 days — licensing strategy review flagged as critical.`,
      (_org) => `CRO contract amendment deadline: 3 site agreements require renegotiation before Q3 close.`,
    ],
    boardroomQuestions: [
      'Should we license our lead compound to a major pharma partner or pursue independent Phase 3?',
      'How should we respond to a competing biosimilar entering our primary indication?',
      'Should we acquire a Phase 1 asset to expand our oncology pipeline?',
      'Is our current cash runway sufficient to reach Phase 2 readout without a bridge round?',
    ],
    invariantLabel: 'FDA 21 CFR Part 312 Invariant',
    legalFramework: 'FDA 21 CFR Part 312 & EU MDR',
    benchmarkMetricPrimary: 'Clinical Burn Rate',
    benchmarkMetricSecondary: 'Trial Enrollment Rate',
  },

  saas: {
    label: 'SaaS & Technology',
    boardroomTitle: 'EXECUTIVE BOARDROOM',
    agents: ['CEO Digital Twin', 'VP Engineering', 'CFO', 'Head of Growth', 'Chief Revenue Officer'],
    metrics: ['ARR', 'Net Revenue Retention', 'CAC Payback (months)', 'Gross Margin %', 'Churn Rate'],
    simulationDecisionTypes: ['Raise Prices', 'Expand to Enterprise Tier', 'Launch New Product', 'Enter EU Market', 'Reduce Headcount', 'Acquire Competitor Tool', 'Increase Sales Headcount'],
    simulationDepartments: ['Product & Engineering', 'Sales & Revenue', 'Customer Success', 'Marketing & Growth', 'Finance & Operations'],
    missionPresets: [
      { title: 'Q4 SLA Breach & Enterprise Churn Risk Assessment', description: 'Audit all enterprise customer SLA commitments against infrastructure uptime data.' },
      { title: 'Pricing Model Elasticity & ARR Impact Simulation', description: 'Model ARR impact of 10%, 20%, and 30% price increases across customer segments.' },
      { title: 'Product-Led Growth & Activation Funnel Audit', description: 'Identify activation bottlenecks reducing trial-to-paid conversion rate.' },
      { title: 'Enterprise Sales Velocity & Pipeline Health Review', description: 'Score pipeline health and forecast accuracy for each AE and sales segment.' },
    ],
    chiefOfStaffChannels: ['Product Roadmap & Sprint Board', 'Revenue & CRM Pipeline', 'Customer Success & Churn Alerts', 'SLA Compliance Monitor', 'Finance & MRR Dashboard', 'Engineering On-Call & Incidents', 'Marketing & Campaign Analytics', 'Investor Relations & Board'],
    chiefOfStaffAlertTemplates: [
      (org) => `${org} P99 API latency breached 99.9% SLA threshold — 3 enterprise customers flagged for credit issuance.`,
      (org) => `${org} net revenue retention dropped below 100% for second consecutive month — expansion revenue review required.`,
      (_org) => `Enterprise contract renewal: 2 accounts representing $840K ARR renewing in 30 days — CSM action required.`,
      (_org) => `Burn multiple exceeded 2.5x this quarter — cost structure review flagged by CFO digital twin.`,
    ],
    boardroomQuestions: [
      'Should we move upmarket to enterprise-only and sunset the self-serve tier?',
      'How should we respond to a competitor offering our core feature for free?',
      'Should we acquire a complementary analytics tool to expand our platform?',
      'Is our current headcount plan sustainable at current ARR growth rates?',
    ],
    invariantLabel: 'SLA Uptime Invariant',
    legalFramework: 'Delaware DGCL § 141 & SOC 2 Type II',
    benchmarkMetricPrimary: 'Net Revenue Retention',
    benchmarkMetricSecondary: 'CAC Payback',
  },

  fintech: {
    label: 'Fintech & Financial Services',
    boardroomTitle: 'RISK COMMITTEE',
    agents: ['CEO', 'Chief Risk Officer', 'Chief Compliance Officer', 'CFO', 'Head of Treasury'],
    metrics: ['Capital Adequacy Ratio', 'NPA Ratio', 'RoRWA', 'Liquidity Coverage Ratio', 'Cost-to-Income Ratio'],
    simulationDecisionTypes: ['Increase Credit Limits', 'Launch New Lending Product', 'Enter New Jurisdiction', 'Acquire Payments Company', 'Raise Debt Facility', 'Reduce Origination Targets'],
    simulationDepartments: ['Credit & Risk', 'Compliance & Legal', 'Treasury & Capital', 'Product & Engineering', 'Operations & Fraud'],
    missionPresets: [
      { title: 'Capital Adequacy & Basel III Stress Test Audit', description: 'Run deterministic stress scenarios against CET1 capital buffers and RWA exposure.' },
      { title: 'AML / KYC Regulatory Compliance Sweep', description: 'Audit transaction monitoring rules against FATF guidance and local jurisdiction requirements.' },
      { title: 'Debt Covenant Compliance & Facility Review', description: 'Scan all credit facility agreements for covenant breach triggers and headroom analysis.' },
      { title: 'NPA Portfolio Deep Dive & Provisioning Review', description: 'Identify high-risk loan cohorts and model expected credit loss provisioning impact.' },
    ],
    chiefOfStaffChannels: ['Regulatory Filing Calendar', 'Credit & NPA Monitor', 'Treasury & Liquidity Dashboard', 'Compliance & AML Alerts', 'Board & Investor Reporting', 'Vendor & Counterparty Risk', 'Product & Roadmap', 'Fraud & Operations'],
    chiefOfStaffAlertTemplates: [
      (org) => `${org} liquidity coverage ratio dropped to 118% — 10% below internal policy floor. Treasury action required.`,
      (org) => `RBI/FCA filing deadline in 7 days — ${org} compliance team has 2 outstanding data submissions.`,
      (_org) => `NPA ratio crossed 3.2% threshold in retail lending segment — provisioning review flagged.`,
      (_org) => `Debt covenant headroom narrowed to $4.2M against leverage covenant floor — CFO review required.`,
    ],
    boardroomQuestions: [
      'Should we pursue a full banking licence or maintain our current NBFC structure?',
      'How should we respond to a new entrant offering zero-fee transactions in our core market?',
      'Should we acquire a credit bureau data provider to improve our underwriting models?',
      'Is our current capital structure sufficient to sustain 3x loan book growth over 18 months?',
    ],
    invariantLabel: 'Basel III CET1 Invariant',
    legalFramework: 'Basel III / RBI / FCA Prudential Rules',
    benchmarkMetricPrimary: 'Capital Adequacy Ratio',
    benchmarkMetricSecondary: 'NPA Ratio',
  },

  realestate: {
    label: 'Real Estate & Fund Management',
    boardroomTitle: 'INVESTMENT COMMITTEE',
    agents: ['Fund Manager', 'Chief Acquisitions Officer', 'CFO', 'Head of Asset Management', 'Legal Counsel'],
    metrics: ['IRR', 'Cap Rate', 'DSCR', 'Occupancy Rate', 'Equity Multiple'],
    simulationDecisionTypes: ['Acquire New Asset', 'Dispose of Underperforming Asset', 'Refinance Existing Debt', 'Reposition Asset Class', 'Expand to New Market', 'Launch New Fund Vehicle'],
    simulationDepartments: ['Acquisitions', 'Asset Management', 'Finance & Debt', 'Leasing & Occupancy', 'Legal & Compliance'],
    missionPresets: [
      { title: 'Portfolio IRR & Equity Multiple Stress Test', description: 'Model IRR sensitivity across interest rate +200bps, vacancy +15%, and exit cap rate expansion scenarios.' },
      { title: 'Lease Expiry & Re-Leasing Risk Audit', description: 'Identify all leases expiring within 18 months and model occupancy risk impact on NOI.' },
      { title: 'Debt Covenant & DSCR Compliance Review', description: 'Audit all mortgage and mezzanine agreements for DSCR breach triggers.' },
      { title: 'New Market Entry Feasibility Analysis', description: 'Run causal analysis on target market demand, cap rate compression, and risk-adjusted returns.' },
    ],
    chiefOfStaffChannels: ['Portfolio Performance Dashboard', 'Lease Expiry & Re-Leasing Tracker', 'Debt & Covenant Monitor', 'Acquisition Pipeline', 'Investor Relations & Capital Calls', 'Asset Management & CapEx', 'Legal & Title', 'Market Intelligence'],
    chiefOfStaffAlertTemplates: [
      (org) => `${org} DSCR on 2 assets dropped below 1.20x covenant floor — lender waiver process must be initiated.`,
      (_org) => `Anchor tenant lease expiring in 45 days with no renewal signed — leasing team escalation required.`,
      (org) => `Interest rate exposure: 38% of ${org} portfolio is floating-rate — hedging strategy review recommended.`,
      (_org) => `Capital call deadline in 14 days — 3 LP investors have not confirmed funding commitment.`,
    ],
    boardroomQuestions: [
      'Should we dispose of our lowest-performing office assets and redeploy into logistics?',
      'How should we respond to rising interest rates compressing our acquisition return targets?',
      'Should we raise a new value-add fund or focus on core asset management?',
      'Is our current debt maturity profile creating refinancing risk over the next 24 months?',
    ],
    invariantLabel: 'DSCR Covenant Invariant',
    legalFramework: 'REIT Regulations & CMBS Covenants',
    benchmarkMetricPrimary: 'IRR',
    benchmarkMetricSecondary: 'DSCR',
  },

  supplychain: {
    label: 'Supply Chain & Logistics',
    boardroomTitle: 'OPERATIONS COMMITTEE',
    agents: ['COO Digital Twin', 'Chief Procurement Officer', 'CFO', 'Head of Logistics', 'General Counsel'],
    metrics: ['Inventory Turnover', 'On-Time Delivery %', 'Supplier Concentration Risk', 'Landed Cost per Unit', 'Order Fill Rate'],
    simulationDecisionTypes: ['Diversify Supplier Base', 'Nearshore Manufacturing', 'Absorb Tariff Impact', 'Expand Warehouse Capacity', 'Launch Direct-to-Consumer', 'Automate Fulfillment'],
    simulationDepartments: ['Procurement & Sourcing', 'Manufacturing & Production', 'Logistics & Distribution', 'Finance & COGS', 'Customer & Order Management'],
    missionPresets: [
      { title: 'Tariff Impact & Supplier Diversification Audit', description: 'Model landed cost impact of 25% tariff increase and identify alternative supplier pathways.' },
      { title: 'Inventory Optimization & Working Capital Review', description: 'Identify SKUs with excess inventory days and model working capital release scenarios.' },
      { title: 'Supplier Contract Risk & Force Majeure Review', description: 'Audit all tier-1 supplier agreements for concentration risk and force majeure exposure.' },
      { title: 'Last-Mile Delivery Performance & SLA Compliance', description: 'Analyze on-time delivery rates by region and identify root-cause delay patterns.' },
    ],
    chiefOfStaffChannels: ['Supplier Performance Monitor', 'Inventory & Warehouse Management', 'Logistics & Freight Tracker', 'Procurement & PO Pipeline', 'Customer Order Management', 'Finance & COGS Dashboard', 'Regulatory & Trade Compliance', 'Risk & Business Continuity'],
    chiefOfStaffAlertTemplates: [
      (org) => `${org} tier-1 supplier in Guangdong has halted shipments — 14-day stock coverage remains for 3 SKUs.`,
      (_org) => `On-time delivery rate dropped to 91.3% in East Coast region — carrier performance review required.`,
      (org) => `New tariff schedule effective next month adds estimated $2.1M to ${org} annual landed cost.`,
      (_org) => `Inventory days for 8 SKUs exceeded 90 days — working capital optimization review flagged.`,
    ],
    boardroomQuestions: [
      'Should we nearshore 40% of manufacturing to reduce tariff exposure and lead times?',
      'How should we respond to a key supplier requesting a 15% price increase?',
      'Should we acquire a last-mile logistics operator to improve delivery performance?',
      'Is our current inventory positioning creating unacceptable working capital risk?',
    ],
    invariantLabel: 'Supplier Concentration Invariant',
    legalFramework: 'UCC Article 2 & Incoterms 2020',
    benchmarkMetricPrimary: 'On-Time Delivery %',
    benchmarkMetricSecondary: 'Inventory Turnover',
  },

  healthcare: {
    label: 'Healthcare & Medical',
    boardroomTitle: 'CLINICAL GOVERNANCE BOARD',
    agents: ['Chief Medical Officer', 'Chief Compliance Officer', 'CFO', 'Head of Clinical Operations', 'Legal Counsel'],
    metrics: ['Patient Satisfaction Score', 'Length of Stay', 'Readmission Rate', 'Operating Margin', 'Bed Occupancy Rate'],
    simulationDecisionTypes: ['Expand Service Line', 'Hire Specialist Physicians', 'Open New Facility', 'Implement EHR System', 'Launch Telehealth', 'Acquire Practice Group'],
    simulationDepartments: ['Clinical Operations', 'Revenue Cycle', 'Compliance & Quality', 'Finance & Administration', 'Patient Experience'],
    missionPresets: [
      { title: 'HIPAA Compliance & PHI Access Audit', description: 'Audit all systems accessing protected health information for HIPAA compliance gaps.' },
      { title: 'Revenue Cycle Optimization & Denial Rate Review', description: 'Identify claim denial patterns and model revenue recovery from denial management improvements.' },
      { title: 'Clinical Quality & Readmission Rate Analysis', description: 'Analyze 30-day readmission drivers and model care pathway intervention impact.' },
      { title: 'Staffing Model & Physician Utilization Review', description: 'Optimize physician scheduling and identify understaffed service lines.' },
    ],
    chiefOfStaffChannels: ['Clinical Operations & Census', 'Revenue Cycle & Billing', 'Compliance & Quality Monitor', 'Physician Scheduling & HR', 'Patient Experience & NPS', 'Finance & Cost Management', 'Regulatory & Accreditation', 'Vendor & Supply Chain'],
    chiefOfStaffAlertTemplates: [
      (org) => `${org} ICU bed occupancy at 94% — capacity planning review required to avoid diversion risk.`,
      (_org) => `Claim denial rate increased to 8.2% — revenue cycle team should review payer-specific denial patterns.`,
      (_org) => `HIPAA audit window in 21 days — 3 PHI access logs have not been reviewed by compliance team.`,
      (_org) => `Physician contract renewal: 2 high-volume specialists contracts expire in 45 days.`,
    ],
    boardroomQuestions: [
      'Should we acquire a competing practice group to expand our specialist coverage area?',
      'How should we respond to a new telehealth entrant capturing our outpatient volume?',
      'Should we invest in a new surgical robot to attract higher-acuity cases?',
      'Is our current revenue cycle management delivering maximum reimbursement rates?',
    ],
    invariantLabel: 'HIPAA PHI Access Invariant',
    legalFramework: 'HIPAA / HITECH & Joint Commission Standards',
    benchmarkMetricPrimary: 'Operating Margin',
    benchmarkMetricSecondary: 'Readmission Rate',
  },

  manufacturing: {
    label: 'Manufacturing & Industrial',
    boardroomTitle: 'OPERATIONS BOARD',
    agents: ['CEO', 'COO Digital Twin', 'CFO', 'VP Manufacturing', 'Chief Quality Officer'],
    metrics: ['OEE (Overall Equipment Effectiveness)', 'Scrap Rate %', 'On-Time-In-Full Delivery', 'Gross Margin %', 'Working Capital Days'],
    simulationDecisionTypes: ['Automate Production Line', 'Expand Capacity', 'Enter New Vertical', 'Offshore Manufacturing', 'Launch Maintenance Contract', 'Reduce SKU Count'],
    simulationDepartments: ['Production & Operations', 'Quality & Engineering', 'Supply Chain & Procurement', 'Sales & Distribution', 'Finance & Costing'],
    missionPresets: [
      { title: 'OEE & Production Downtime Root-Cause Audit', description: 'Identify top-5 downtime causes across production lines and model OEE improvement scenarios.' },
      { title: 'COGS & Margin Compression Analysis', description: 'Audit material cost variance and labor efficiency to identify margin recovery opportunities.' },
      { title: 'Quality Defect & Customer Return Risk Review', description: 'Analyze defect rates by product line and model warranty liability exposure.' },
      { title: 'Capex Justification & ROI Modeling', description: 'Build causal ROI models for proposed capital expenditure against production output targets.' },
    ],
    chiefOfStaffChannels: ['Production Scheduling & MES', 'Quality & Defect Monitor', 'Supply Chain & Procurement', 'Sales & Order Pipeline', 'Maintenance & Asset Health', 'Finance & Cost Accounting', 'Customer & Warranty Claims', 'Safety & Compliance'],
    chiefOfStaffAlertTemplates: [
      (org) => `${org} Line 3 OEE dropped to 71% — root-cause analysis initiated, 4-hour downtime impact estimated.`,
      (_org) => `Scrap rate on Assembly Cell B exceeded 3.5% threshold — quality hold placed on outbound shipments.`,
      (_org) => `Key raw material lead time extended by 18 days — production schedule adjustment required.`,
      (org) => `${org} customer warranty claim volume up 22% — defect pattern review flagged as urgent.`,
    ],
    boardroomQuestions: [
      'Should we invest in robotic automation of our highest-labor-cost assembly lines?',
      'How should we respond to a raw material price increase of 18% from our primary supplier?',
      'Should we acquire a competing manufacturer to consolidate our market position?',
      'Is our current product mix optimized for maximum gross margin contribution?',
    ],
    invariantLabel: 'ISO 9001 Quality Invariant',
    legalFramework: 'ISO 9001:2015 & OSHA Standards',
    benchmarkMetricPrimary: 'OEE',
    benchmarkMetricSecondary: 'OTIF Delivery',
  },

  education: {
    label: 'Education & EdTech',
    boardroomTitle: 'ACADEMIC GOVERNANCE BOARD',
    agents: ['Vice Chancellor', 'Chief Academic Officer', 'CFO', 'Head of Student Success', 'Legal Counsel'],
    metrics: ['Student Retention Rate', 'Graduate Employment Rate', 'Revenue per Student', 'Faculty Utilization', 'Enrolment Growth'],
    simulationDecisionTypes: ['Launch New Program', 'Expand Online Delivery', 'Increase Tuition', 'Hire Faculty', 'Enter New Market', 'Acquire EdTech Platform'],
    simulationDepartments: ['Academic Programs', 'Student Services', 'Finance & Administration', 'Marketing & Enrolment', 'Technology & Innovation'],
    missionPresets: [
      { title: 'Accreditation & Regulatory Compliance Review', description: 'Audit all program offerings for accreditation compliance and renewal requirements.' },
      { title: 'Student Retention & Attrition Risk Analysis', description: 'Identify cohort-level attrition drivers and model intervention program impact.' },
      { title: 'Online Program Launch Feasibility & ROI Model', description: 'Build causal model for online program demand, margin, and student success outcomes.' },
      { title: 'Tuition Pricing Elasticity & Financial Aid Impact', description: 'Simulate enrolment impact of tuition changes across student income segments.' },
    ],
    chiefOfStaffChannels: ['Enrolment & Admissions Pipeline', 'Student Success & Retention', 'Academic Calendar & Timetabling', 'Finance & Tuition Revenue', 'Faculty & HR Management', 'Accreditation & Compliance', 'Technology & LMS', 'Alumni & Fundraising'],
    chiefOfStaffAlertTemplates: [
      (org) => `${org} first-year retention rate dropped to 81% — student success intervention program review required.`,
      (_org) => `Accreditation renewal submission due in 30 days — 2 program self-study reports are incomplete.`,
      (_org) => `Enrolment in STEM programs 14% below target — marketing and outreach strategy review required.`,
      (org) => `${org} faculty vacancy rate reached 12% — recruitment pipeline review flagged as critical.`,
    ],
    boardroomQuestions: [
      'Should we launch a fully online MBA program to expand our addressable market?',
      'How should we respond to declining domestic enrolment by targeting international students?',
      'Should we acquire an EdTech platform to enhance our digital learning capabilities?',
      'Is our current tuition structure sustainable against rising operating costs?',
    ],
    invariantLabel: 'Accreditation Standards Invariant',
    legalFramework: 'HEA Accreditation & FERPA Compliance',
    benchmarkMetricPrimary: 'Student Retention Rate',
    benchmarkMetricSecondary: 'Graduate Employment Rate',
  },

  media: {
    label: 'Media & Entertainment',
    boardroomTitle: 'CONTENT STRATEGY BOARD',
    agents: ['CEO', 'Chief Content Officer', 'CFO', 'Head of Monetization', 'General Counsel'],
    metrics: ['Monthly Active Users', 'ARPU', 'Content Production Cost per Hour', 'Subscriber Churn Rate', 'Ad Revenue CPM'],
    simulationDecisionTypes: ['Launch New Content Vertical', 'Enter Subscription Model', 'Acquire Production Studio', 'Expand Internationally', 'Launch Ad-Supported Tier', 'Partner with Streaming Platform'],
    simulationDepartments: ['Content & Production', 'Technology & Platform', 'Sales & Advertising', 'Finance & Operations', 'Marketing & Audience'],
    missionPresets: [
      { title: 'Content ROI & Audience Engagement Audit', description: 'Identify highest-ROI content formats and model investment reallocation scenarios.' },
      { title: 'Subscription Tier Pricing & Churn Analysis', description: 'Model subscriber churn sensitivity to price changes and feature differentiation.' },
      { title: 'IP Rights & Licensing Agreement Review', description: 'Audit all content licensing agreements for territory restrictions and renewal exposure.' },
      { title: 'Ad Revenue & CPM Trend Forecasting', description: 'Analyze advertiser concentration risk and model CPM trajectory under market scenarios.' },
    ],
    chiefOfStaffChannels: ['Content Production Pipeline', 'Audience Analytics & MAU', 'Subscription & Revenue Dashboard', 'Ad Sales & Campaign Management', 'Rights & Licensing Tracker', 'Technology & Platform Health', 'Legal & IP Management', 'Talent & Creator Relations'],
    chiefOfStaffAlertTemplates: [
      (org) => `${org} subscriber churn rate increased to 4.2% this month — retention campaign review required.`,
      (_org) => `Content licensing agreement for flagship series expires in 60 days — renewal negotiation not yet initiated.`,
      (_org) => `Ad revenue CPM declined 18% — top advertiser paused spend pending brand safety review.`,
      (_org) => `Platform uptime dropped to 99.2% during peak viewing window — engineering escalation flagged.`,
    ],
    boardroomQuestions: [
      'Should we launch a free ad-supported tier to accelerate user acquisition?',
      'How should we respond to a major streaming platform acquiring our top content creator?',
      'Should we produce original premium content or focus on licensing third-party IP?',
      'Is our current subscription pricing model maximizing long-term subscriber value?',
    ],
    invariantLabel: 'Content Rights Invariant',
    legalFramework: 'Copyright Act & GDPR / CCPA Privacy',
    benchmarkMetricPrimary: 'Subscriber Churn Rate',
    benchmarkMetricSecondary: 'ARPU',
  },

  default: {
    label: 'Enterprise Organization',
    boardroomTitle: 'EXECUTIVE BOARDROOM',
    agents: ['CEO Digital Twin', 'CFO', 'General Counsel', 'CTO', 'Chief Risk Officer'],
    metrics: ['Revenue', 'EBITDA', 'Cash Runway', 'Headcount', 'Operating Margin'],
    simulationDecisionTypes: ['Increase Prices', 'Hire Employees', 'Expand Internationally', 'Reduce Staff', 'Launch Products', 'Open Offices', 'Acquire Companies'],
    simulationDepartments: ['Revenue & Sales', 'Operations', 'Finance & Treasury', 'Technology & Engineering', 'People & Culture'],
    missionPresets: [
      { title: 'Enterprise Operational Risk & Audit Report', description: 'Comprehensive review of operational risks, compliance gaps, and strategic exposures.' },
      { title: 'Q4 Regulatory & Governance Compliance Audit', description: 'Audit board-level governance, regulatory filings, and compliance posture.' },
      { title: 'Growth Strategy & Revenue Scaling Plan', description: 'Model revenue growth scenarios and identify highest-leverage strategic initiatives.' },
      { title: 'Cost Structure & Efficiency Optimization Review', description: 'Identify cost reduction opportunities and model EBITDA improvement scenarios.' },
    ],
    chiefOfStaffChannels: ['Email & Executive Communications', 'Calendar & Scheduling', 'Active Projects & Initiatives', 'Document & Contract Vault', 'CRM & Customer Pipeline', 'Finance & Reporting', 'Technology & Systems', 'HR & People Operations'],
    chiefOfStaffAlertTemplates: [
      (org) => `${org} has 2 vendor contracts expiring within 30 days — procurement review action required.`,
      (_org) => `Board meeting preparation: 3 board pack sections are outstanding — executive team deadline in 48 hours.`,
      (org) => `${org} quarterly compliance filing due in 14 days — legal team has not submitted required documents.`,
      (_org) => `Budget variance alert: Q3 operating expenditure tracking 8.4% above plan — CFO review requested.`,
    ],
    boardroomQuestions: [
      'Should we expand our core product line into adjacent market segments?',
      'How should we respond to a 20% price cut by our primary competitor?',
      'Should we acquire a complementary business or build capabilities in-house?',
      'Is our current infrastructure ready to support 5x growth over the next 18 months?',
    ],
    invariantLabel: 'Delaware DGCL § 141 Invariant',
    legalFramework: 'Delaware DGCL § 141',
    benchmarkMetricPrimary: 'Revenue Growth',
    benchmarkMetricSecondary: 'EBITDA Margin',
  },
};

/**
 * Get all content for a given sector.
 * Falls back to 'default' if the sector is unrecognized.
 */
export function getSectorContent(sector: string | undefined | null): SectorContent {
  const key = (sector as Sector) || 'default';
  return SECTOR_CONTENT[key] ?? SECTOR_CONTENT.default;
}

/**
 * Get sector-specific monitoring channels for Chief of Staff.
 */
export function getAdaptiveChannels(sector: string | undefined): string[] {
  return getSectorContent(sector).chiefOfStaffChannels;
}

/**
 * Get sector-specific alert messages populated with the org name.
 */
export function getAdaptiveAlerts(sector: string | undefined, companyName: string): string[] {
  return getSectorContent(sector).chiefOfStaffAlertTemplates.map((fn) => fn(companyName));
}

/**
 * Get sector-specific boardroom agents.
 */
export function getAdaptiveAgents(sector: string | undefined, customAgents?: string[]): string[] {
  if (customAgents && customAgents.length > 0) return customAgents;
  return getSectorContent(sector).agents;
}

/**
 * Get sector-specific metrics.
 */
export function getAdaptiveMetrics(sector: string | undefined, customMetrics?: string[]): string[] {
  if (customMetrics && customMetrics.length > 0) return customMetrics;
  return getSectorContent(sector).metrics;
}

/**
 * Get sector-specific simulation departments.
 */
export function getAdaptiveDepartments(sector: string | undefined): string[] {
  return getSectorContent(sector).simulationDepartments;
}

/**
 * Get sector-specific mission presets.
 */
export function getAdaptiveMissionPresets(sector: string | undefined) {
  return getSectorContent(sector).missionPresets;
}

/**
 * Get sector-specific boardroom questions.
 */
export function getAdaptiveBoardroomQuestions(sector: string | undefined): string[] {
  return getSectorContent(sector).boardroomQuestions;
}

/**
 * List of all available sectors for the onboarding form.
 */
export const ALL_SECTORS: { value: Sector; label: string }[] = Object.entries(SECTOR_CONTENT).map(
  ([key, val]) => ({ value: key as Sector, label: val.label })
);

/**
 * Available org sizes for the onboarding form.
 */
export const ORG_SIZES: { value: OrgSize; label: string }[] = [
  { value: 'solo', label: 'Just me' },
  { value: '2-10', label: '2–10 people' },
  { value: '11-50', label: '11–50 people' },
  { value: '51-200', label: '51–200 people' },
  { value: '201-1000', label: '201–1,000 people' },
  { value: '1000+', label: '1,000+ people' },
];

/**
 * Priority options mapped per sector.
 */
export const PRIORITY_OPTIONS: { value: OrgPriority; label: string }[] = [
  { value: 'compliance', label: 'Regulatory & Legal Compliance' },
  { value: 'fundraising', label: 'Fundraising & Capital Raising' },
  { value: 'ip-protection', label: 'IP & Contract Protection' },
  { value: 'cost-reduction', label: 'Cost Reduction & Efficiency' },
  { value: 'revenue-growth', label: 'Revenue Growth & Expansion' },
  { value: 'risk-management', label: 'Risk Management & Scenario Planning' },
  { value: 'hiring', label: 'Hiring & Talent Strategy' },
  { value: 'international-expansion', label: 'International Expansion' },
  { value: 'm-and-a', label: 'M&A & Partnerships' },
  { value: 'digital-transformation', label: 'Digital Transformation' },
];

// ── ADAPTIVE BUILDER FUNCTIONS ───────────────────────────────────────────────

/**
 * Builds the default ExecutiveBriefData demo object using the org's sector and company name.
 * Zero hardcoded company names, departments, or region names.
 */
export function buildAdaptiveDemoData(
  sector: string | undefined,
  companyName: string,
  departments: string[],
  _agents: string[]
) {
  const sc = getSectorContent(sector);
  const primaryMetric = sc.metrics[0] || 'Performance Score';
  const secondaryMetric = sc.metrics[1] || 'Operational Health';
  const docSuffix = companyName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);

  return {
    executiveBrief: `Operational health across all monitored nodes for ${companyName} is stable at 96.4%. ${sc.boardroomTitle} agents report strong alignment on current strategic initiatives with zero critical risk vulnerabilities detected.`,
    healthScore: 96,
    knowledgeCoverage: 99,
    riskLevel: 'LOW' as const,
    decisionConfidence: 98,
    executiveAnswers: [
      {
        id: '1',
        question: `What is our current ${primaryMetric} risk exposure?`,
        answer: `${primaryMetric} risk is minimal (2.1%). Compliance matrices are 100% verified across all operational nodes under the current ${sc.legalFramework} framework.`,
        status: 'HEALTHY' as const,
        citations: [{ documentName: `${docSuffix}_Strategic_Plan.pdf`, snippet: `${primaryMetric} target: achieved. Regulatory approval cleared.` }],
      },
      {
        id: '2',
        question: 'Are there any unexecuted agreements outstanding?',
        answer: 'Zero unsigned agreements. All vendor contracts and SLAs have been fully executed with counter-party signatures verified.',
        status: 'HEALTHY' as const,
        citations: [{ documentName: `${docSuffix}_Contract_Register.xlsx`, snippet: 'All contracts executed with digital signatures.' }],
      },
    ],
    departmentHealth: departments.slice(0, 3).map((dept, i) => ({
      department: dept,
      healthScore: [98, 99, 95][i] || 97,
      riskLevel: 'LOW' as const,
      summary: [
        `All ${dept.toLowerCase()} workstreams operating within baseline thresholds.`,
        `100% compliance; 0 open disputes in ${dept.toLowerCase()}.`,
        `${secondaryMetric} KPI on track; no escalations pending.`,
      ][i] || 'Operating normally.',
      activeIssuesCount: 0,
      citations: [],
    })),
    aiRecommendations: [
      {
        id: 'r1',
        priority: 'HIGH' as const,
        title: `Automate ${sc.benchmarkMetricPrimary} Stress Testing`,
        recommendation: `Run quarterly automated Digital Twin stress simulations focused on ${sc.benchmarkMetricPrimary} thresholds.`,
        rationale: `Preemptively mitigates bottlenecks during peak operational periods for ${companyName}.`,
        citations: [{ documentName: `${docSuffix}_SOP.pdf`, snippet: 'Quarterly stress testing recommended.' }],
      },
    ],
    recentEvents: [
      { date: 'Today, 09:30 AM', title: `${sc.boardroomTitle} Unanimous Resolution`, category: 'Strategy', description: `All ${sc.boardroomTitle.toLowerCase()} agents voted in favour of the current strategic initiative for ${companyName}.` },
      { date: 'Yesterday, 04:15 PM', title: 'Digital Twin Simulation Passed', category: 'Operations', description: 'Stress-tested all operational nodes against simulated disruption with zero data loss.' },
    ],
    timelineHighlights: [
      { date: 'Q3 2026', milestone: `${companyName} — Causarix OS Integration`, impact: 'Completed' },
      { date: 'Q4 2026', milestone: `${sc.simulationDecisionTypes[0] || 'Strategic Initiative'} Execution`, impact: 'In Progress' },
    ],
  };
}

/**
 * Builds adaptive AHA scenario showcase objects from the org's sector profile.
 * No hardcoded company names, dollar amounts, or file names.
 */
export function buildAdaptiveAhaScenarios(
  sector: string | undefined,
  companyName: string,
  agents: string[]
) {
  const sc = getSectorContent(sector);
  const docPrefix = companyName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
  const agent0 = agents[0] || 'CEO Digital Twin';
  const agent1 = agents[1] || 'CFO Digital Twin';
  const agent2 = agents[2] || 'Legal Counsel';

  return {
    mna: {
      id: 'mna',
      tag: 'M&A DUE DILIGENCE',
      title: `${companyName} — Strategic Acquisition Risk Detected`,
      timeSaved: `${sc.label} Audit Accelerated by 18 Days`,
      riskScore: `94% CRITICAL RISK`,
      vulnerability: {
        title: `Material ${sc.invariantLabel} Violation Detected in Acquisition Target`,
        source: `Target Documents: ${docPrefix}_Acquisition_Due_Diligence.pdf`,
        detail: `The acquisition target has a material ${sc.invariantLabel} compliance gap that creates significant post-closing liability exposure. Under ${sc.legalFramework}, this requires immediate contractual remediation before closing.`,
      },
      financialDrag: {
        cleanRoomCost: 'Estimated Remediation Cost',
        ebitdaCompression: 'EBITDA Impact: Material',
        runwayImpact: 'Runway Impact: -4 Months',
        recommendation: `Reduce acquisition valuation and add ${sc.invariantLabel} indemnity escrow prior to execution.`,
      },
      delawareRedline: {
        statutoryStandard: sc.legalFramework,
        originalClause: `Seller represents that all operations are free of material ${sc.invariantLabel} defects with liability capped at nominal amounts.`,
        redlinedClause: `Seller warrants zero ${sc.invariantLabel} compliance violations. Breach triggers immediate special indemnity escrow release under ${sc.legalFramework}.`,
      },
      boardroomQuorum: [
        { role: agent0, vote: 'PASS WITH COUNTER-OFFER', rationale: 'Core strategic asset remains attractive at reduced price point with escrow.' },
        { role: agent1, vote: 'VETO OVERPRICED BID', rationale: 'Remediation cost exceeds risk-adjusted returns. Escrow holdback mandatory.' },
        { role: agent2, vote: 'RENEGOTIATE WARRANTY', rationale: `${sc.legalFramework} liability exposure if closed without compliance carve-out.` },
      ],
    },
    sla: {
      id: 'sla',
      tag: `${sc.invariantLabel.toUpperCase()} INVARIANT`,
      title: `${companyName} — ${sc.benchmarkMetricPrimary} Commitment vs Operational Ceiling`,
      timeSaved: 'Instant Contract Redline',
      riskScore: `${sc.benchmarkMetricSecondary} EXPOSURE`,
      vulnerability: {
        title: `Committed ${sc.benchmarkMetricPrimary} Target Exceeds Operational Capacity`,
        source: `Client Agreement: ${docPrefix}_Master_Service_Agreement.pdf`,
        detail: `A ${sc.benchmarkMetricPrimary} commitment was made that exceeds the organisation's actual operational capacity. This creates a structural ${sc.invariantLabel} gap that must be resolved to protect ${companyName} from penalty clawbacks.`,
      },
      financialDrag: {
        cleanRoomCost: 'Potential Clawback Exposure',
        ebitdaCompression: 'Margin Compression Risk',
        runwayImpact: `Violates Minimum Reserve Policy`,
        recommendation: `Apply standard ${sc.legalFramework} maintenance carve-outs and cap damages at 1-month period fee.`,
      },
      delawareRedline: {
        statutoryStandard: sc.legalFramework,
        originalClause: `Provider warrants ${sc.benchmarkMetricPrimary} with no exclusions. Failures incur 25% fee credits.`,
        redlinedClause: `Provider commits to ${sc.benchmarkMetricPrimary} target, excluding scheduled maintenance and third-party dependency outages, under ${sc.legalFramework}.`,
      },
      boardroomQuorum: [
        { role: agent0, vote: 'VETO UNCOMMITTED TERMS', rationale: `Current operational capacity cannot deliver the committed ${sc.benchmarkMetricPrimary} target.` },
        { role: agent1, vote: 'VETO UNRESERVED RISK', rationale: 'Clawback liability violates board-approved reserve policy.' },
        { role: agent2, vote: 'SUBMIT AUTO-REDLINE', rationale: `Replaced with standard ${sc.legalFramework} carve-out clause.` },
      ],
    },
    boardroom: {
      id: 'boardroom',
      tag: `${sc.boardroomTitle} QUORUM`,
      title: `${companyName} ${sc.boardroomTitle} — Strategic Capital Allocation Deadlock`,
      timeSaved: '4-Hour Debate Resolved in 15s',
      riskScore: 'UNANIMOUS QUORUM',
      vulnerability: {
        title: 'Conflicting Directives on Expansion vs Capital Preservation',
        source: `${sc.boardroomTitle} Simulation: ${docPrefix}_Strategy_Model.pdf`,
        detail: `${agent0} proposed a strategic growth sprint while ${agent1} identified a cash runway threshold under current macro conditions. Causarix resolved the deadlock using structured quorum simulation in real time.`,
      },
      financialDrag: {
        cleanRoomCost: 'Zero Capital Waste',
        ebitdaCompression: `Preserves ${sc.benchmarkMetricPrimary}`,
        runwayImpact: 'Maintains 22+ Month Buffer',
        recommendation: `Staged milestone-gated release tied to verified ${sc.benchmarkMetricPrimary} achievement.`,
      },
      delawareRedline: {
        statutoryStandard: sc.legalFramework,
        originalClause: `Authorise management to draw full capital for ${sc.simulationDecisionTypes[0] || 'expansion'} initiative.`,
        redlinedClause: `Resolved: Authorise conditional Tranche 1 release tied to milestone verification and monthly audit under ${sc.legalFramework}.`,
      },
      boardroomQuorum: [
        { role: agent0, vote: 'CONCUR WITH TRANCHES', rationale: 'Staged funding allows strategic progress while protecting balance sheet.' },
        { role: agent1, vote: 'APPROVE TRANCHE 1', rationale: 'Maintains 22-month cash buffer under pessimistic macro conditions.' },
        { role: agent2, vote: 'FILE BOARD MINUTES', rationale: `Meets Business Judgment Rule under ${sc.legalFramework}.` },
      ],
    },
  };
}
