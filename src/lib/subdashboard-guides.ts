export interface SubdashboardGuide {
  routeKey: string;
  badge: string;
  title: string;
  tagline: string;
  whatItDoes: string;
  howItHelps: string[];
  proTip: string;
  primaryActionLabel: string;
}

export const SUBDASHBOARD_GUIDES: Record<string, SubdashboardGuide> = {
  '/dashboard': {
    routeKey: 'dashboard_overview',
    badge: 'MISSION CONTROL',
    title: 'Executive Mission Control',
    tagline: 'Your command center for company health, daily priorities, and executive AI briefing.',
    whatItDoes: 'Provides real-time visibility over organizational health, critical risk alerts, active simulations, and daily AI COO executive briefings.',
    howItHelps: [
      'Gives founders and C-suite leaders instant cross-silo status without reading dozens of reports.',
      'Flags unhedged legal liabilities, runway shifts, and SLA vulnerabilities before they escalate.',
      'Tracks daily strategic priorities with zero arithmetic drift and 100% grounded citations.'
    ],
    proTip: 'Check the Daily Briefing card every morning for synthesized P0 action items.',
    primaryActionLabel: 'Explore Mission Control'
  },
  '/dashboard/boardroom': {
    routeKey: 'boardroom',
    badge: '10-AGENT ADVERSARIAL ARENA',
    title: 'Executive Boardroom',
    tagline: 'Your virtual C-suite. 10 specialized AI executives debate your hardest business decisions.',
    whatItDoes: 'Simulates a full 10-Agent C-suite boardroom (General Counsel, CFO, CTO, Red Team, etc.) to debate and stress-test high-stakes decisions.',
    howItHelps: [
      'Shields directors under Delaware DGCL § 141 with formal fiduciary evidentiary records.',
      'Exposes hidden contractual blind spots, balance sheet friction, and tech debt risks.',
      'Reaches unanimous quorum consensus with structured executive action roadmaps.'
    ],
    proTip: 'Type any acquisition, budget change, or contract proposal to trigger instant adversarial debate.',
    primaryActionLabel: 'Start Boardroom Debate'
  },
  '/dashboard/simulations': {
    routeKey: 'simulations',
    badge: 'PEARL DO-CALCULUS SCM',
    title: 'Counterfactual SCM Studio',
    tagline: 'Test business decisions before execution with 0.00% math drift and 10,000 Monte Carlo runs.',
    whatItDoes: 'Computes formal Judea Pearl structural causal models P(Y | do(X=x)) over Directed Acyclic Graphs with zero arithmetic drift.',
    howItHelps: [
      'Models exact EBITDA compression and cash runway impact of price wars, tariffs, and outages.',
      'Lets you add custom corporate scenarios and dynamically generates tailored parametric sliders.',
      'Dispatches 1-click counterfactual mitigation tickets directly into Jira and enterprise ERP.'
    ],
    proTip: 'Click "+ Add Custom Scenario" to model any unique business shock or expansion dilemma.',
    primaryActionLabel: 'Run Causal Simulation'
  },
  '/dashboard/documents': {
    routeKey: 'documents',
    badge: 'EVIDENTIARY VAULT',
    title: 'Document Vault & Memory Ingestion',
    tagline: 'Upload contracts and reports. All AI reasoning is grounded in line-level document citations.',
    whatItDoes: 'Securely ingests, classifies, and indexes your contracts, MSAs, financial models, and SOPs into your living organizational graph.',
    howItHelps: [
      'Eliminates hallucinations by grounding all AI reasoning in exact line-level page citations.',
      'Automatically extracts entities, clauses, obligations, and renewal deadlines across files.',
      'Maintains complete multi-tenant tenant isolation and AES-256 zero-retention privacy.'
    ],
    proTip: 'Drag and drop PDFs or DOCX files here to immediately power up your boardroom and chat assistants.',
    primaryActionLabel: 'Open Document Vault'
  },
  '/dashboard/digital-twin': {
    routeKey: 'digital_twin',
    badge: 'COGNITIVE REPLICAS',
    title: 'C-Suite Digital Twins',
    tagline: 'Digital replicas of your CEO, CFO, and leadership team aligned to your risk tolerance.',
    whatItDoes: 'Maintains personalized AI replicas of your CEO, CFO, General Counsel, and team leaders trained on your firm\'s governance policies and risk tolerance.',
    howItHelps: [
      'Delegates routine contract reviews and financial sanity checks to your digital counterparts.',
      'Ensures consistent strategic alignment across distributed teams even when executives are offline.',
      'Provides instant sounding boards reflecting the exact reasoning styles of your leadership.'
    ],
    proTip: 'Configure your primary executive twin\'s risk appetite in settings to tune deliberation style.',
    primaryActionLabel: 'Configure Digital Twins'
  },
  '/dashboard/graph': {
    routeKey: 'graph',
    badge: '3D MEMORY GRAPH',
    title: 'Organizational Memory Graph',
    tagline: 'A visual 3D map connecting contracts, suppliers, and operational dependencies.',
    whatItDoes: 'Renders an interactive 3D knowledge graph connecting companies, legal entities, contracts, covenants, and operational dependencies.',
    howItHelps: [
      'Reveals hidden cross-silo dependency chains invisible in flat folder structures.',
      'Traces ripple effects: see how a supplier price increase impacts downstream customer SLAs.',
      'Allows visual querying and subgraph extraction for board presentations and M&A audits.'
    ],
    proTip: 'Click any node in the 3D space to inspect underlying document citations and relationship weights.',
    primaryActionLabel: 'Explore 3D Graph'
  },
  '/dashboard/risk-center': {
    routeKey: 'risk_center',
    badge: 'EARLY WARNING RADAR',
    title: 'Enterprise Risk Center',
    tagline: 'Continuous Radar for Legal, Operational & Cash Liabilities',
    whatItDoes: 'Continuously monitors all ingested documents and metrics to detect contract contradictions, uncapped indemnities, and single-point failure hazards.',
    howItHelps: [
      'Stops catastrophic breach penalties by tracking strict SLA commitments and notification windows.',
      'Ranks enterprise risks by financial severity and likelihood with mitigation playbooks.',
      'Provides automated compliance scoring for SOC2, GDPR, CCPA, and DPDP Act 2023.'
    ],
    proTip: 'Review "Critical Risk Alerts" to remediate redlined indemnity exposures before signing.',
    primaryActionLabel: 'Review Risk Radar'
  },
  '/dashboard/strategy': {
    routeKey: 'strategy',
    badge: 'STRATEGIC WAR-ROOM',
    title: 'Strategy & Scenario Studio',
    tagline: 'Long-Term Strategic Roadmaps & Competitive Modeling',
    whatItDoes: 'Formulates multi-quarter corporate roadmaps, market expansion models, and competitive war-gaming based on verified internal data.',
    howItHelps: [
      'Transforms ambitious strategic goals into measurable operational milestones with clear OKRs.',
      'Stress-tests capital allocation decisions against multiple macroeconomic futures.',
      'Aligns executive leadership around vetted execution timelines.'
    ],
    proTip: 'Use the Strategic Bets builder to decompose high-level goals into tactical workstreams.',
    primaryActionLabel: 'Launch Strategy Studio'
  },
  '/dashboard/chief-of-staff': {
    routeKey: 'chief_of_staff',
    badge: 'EXECUTIVE OPERATOR',
    title: 'Autonomous Chief of Staff',
    tagline: 'Proactive Daily Operator for Executive Teams',
    whatItDoes: 'Acts as your 24/7 AI Chief of Staff, synthesizing cross-department progress, drafting executive memos, and monitoring strategic OKRs.',
    howItHelps: [
      'Frees up 15+ hours weekly by automating administrative synthesis and status checks.',
      'Proactively alerts you to stalled initiatives and misaligned cross-functional tasks.',
      'Generates ready-to-present executive briefings with 1-click export.'
    ],
    proTip: 'Ask the Chief of Staff for a "Weekly Executive Wrap" to get a comprehensive summary for your board.',
    primaryActionLabel: 'Open Chief of Staff'
  },
  '/dashboard/assistant': {
    routeKey: 'assistant',
    badge: 'GROUNDED COPILOT',
    title: 'Executive Assistant & Copilot',
    tagline: 'Grounded Corporate Intelligence with Line-Level Evidence',
    whatItDoes: 'A sovereign AI copilot that answers complex business questions strictly grounded in your company\'s files, spreadsheets, and meeting logs.',
    howItHelps: [
      'Answers questions with exact paragraph citations so you never have to guess or manually hunt for clauses.',
      'Summarizes 100-page vendor contracts, financial reports, or board packets in seconds.',
      'Extracts structured data, compliance matrices, and action items directly into spreadsheets.'
    ],
    proTip: 'Ask specific questions like "What are our indemnification obligations in the 2026 Acme contract?"',
    primaryActionLabel: 'Ask Executive Assistant'
  },
  '/dashboard/workspace': {
    routeKey: 'workspace',
    badge: 'DEAL & PROPOSAL STUDIO',
    title: 'AI Proposal & Deal Room',
    tagline: 'Rapid RFP Gap Analysis & Proposal Generation',
    whatItDoes: 'Parses incoming client RFPs, identifies compliance gaps against your past proposals, and auto-drafts 15-page winning bids.',
    howItHelps: [
      'Accelerates enterprise RFP turnaround from 3 weeks to under 30 minutes.',
      'Guarantees 100% clause-by-clause compliance with customer requirements.',
      'Integrates historical win-rate data from past proposals to maximize scoring.'
    ],
    proTip: 'Upload an RFP and select your capability documents to instantly generate a compliance matrix.',
    primaryActionLabel: 'Enter Deal Room'
  },
  '/dashboard/projects': {
    routeKey: 'projects',
    badge: 'PIPELINE TRACKER',
    title: 'Projects & Pipeline Management',
    tagline: 'Centralized Hub for Strategic Initiatives & RFP Bids',
    whatItDoes: 'Manages enterprise proposals, compliance audits, and strategic projects across your organization.',
    howItHelps: [
      'Tracks pipeline stages, win probabilities, and assigned team owners in one dashboard.',
      'Connects documents and AI reasoning workspaces directly to their parent projects.',
      'Prevents dropped deliverables and ensures deadline accountability.'
    ],
    proTip: 'Create a new project for every client RFP or major corporate initiative.',
    primaryActionLabel: 'Manage Projects'
  },
  '/dashboard/meetings': {
    routeKey: 'meetings',
    badge: 'TRANSCRIPT INTELLIGENCE',
    title: 'Meetings & Audio Intelligence',
    tagline: 'Zero Dropped Action Items from Leadership Calls',
    whatItDoes: 'Ingests meeting recordings, transcripts, and board discussions to automatically extract decisions, owners, and follow-ups.',
    howItHelps: [
      'Maintains an immutable searchable ledger of every strategic commitment made on calls.',
      'Automatically drafts follow-up emails and creates Jira action tickets for team members.',
      'Feeds meeting consensus directly into your 3D organizational memory graph.'
    ],
    proTip: 'Upload your zoom or audio transcripts here to auto-generate meeting minutes in seconds.',
    primaryActionLabel: 'View Meeting Intelligence'
  },
  '/dashboard/notebooks': {
    routeKey: 'notebooks',
    badge: 'AUDIO BRIEFINGS',
    title: 'Matter Studio & Notebooks',
    tagline: 'Interactive 2-Host Audio Briefings & Study Dossiers',
    whatItDoes: 'Generates deep-dive study dossiers and 2-host audio podcast briefings (e.g., Morgan & Alex) from any uploaded document package.',
    howItHelps: [
      'Listen to high-bandwidth executive briefings on your commute instead of reading 60-page decks.',
      'Isolate specific matters and cross-examine evidence with an interactive notebook assistant.',
      'Share audio briefings with board members for rapid pre-meeting prep.'
    ],
    proTip: 'Click "Generate Audio Briefing" on any notebook to create an instant 5-minute podcast episode.',
    primaryActionLabel: 'Open Notebook Studio'
  },
  '/dashboard/analytics': {
    routeKey: 'analytics',
    badge: 'DECISION VELOCITY',
    title: 'Analytics & Decision Telemetry',
    tagline: 'High-Resolution Operational & AI Usage Metrics',
    whatItDoes: 'Tracks organizational throughput, decision velocity, AI inference audit logs, and ROI on intelligence workflows.',
    howItHelps: [
      'Demonstrates time saved and risk mitigated across legal, finance, and product teams.',
      'Monitors token utilization and API throughput across all C-suite digital twins.',
      'Identifies operational bottlenecks in decision-making cycles.'
    ],
    proTip: 'Use these metrics in board decks to demonstrate concrete productivity and risk mitigation ROI.',
    primaryActionLabel: 'View Analytics'
  },
  '/dashboard/audit': {
    routeKey: 'audit',
    badge: 'GOVERNANCE LEDGER',
    title: 'Immutable Audit Trail',
    tagline: 'Cryptographic Provenance & Compliance Verification',
    whatItDoes: 'Provides an immutable, tamper-evident log recording every AI recommendation, citation hash, and user decision.',
    howItHelps: [
      'Guarantees full audit compliance for SOC2, GDPR, CCPA, and Indian DPDP Act 2023.',
      'Maintains verifiable chain-of-custody for evidentiary citations used in boardroom votes.',
      'Enables external auditors and regulators to verify decisions without exposing raw company secrets.'
    ],
    proTip: 'Export audit logs before regulatory inspections or annual board governance reviews.',
    primaryActionLabel: 'Inspect Audit Logs'
  },
  '/dashboard/integrations': {
    routeKey: 'integrations',
    badge: 'ENTERPRISE CONNECTORS',
    title: 'Integrations & API Gateways',
    tagline: '1-Click Connectors for Jira, Slack, GitHub & Cloud',
    whatItDoes: 'Connects Causarix OS directly with your existing enterprise toolchain including Jira Cloud, Slack, GitHub, and cloud ERP.',
    howItHelps: [
      'Enables 1-click autonomous action dispatch: create Jira mitigation tickets directly from simulations.',
      'Syncs external codebase licenses and documentation into your memory graph.',
      'Sends instant critical risk alerts to dedicated executive Slack channels.'
    ],
    proTip: 'Connect Jira Cloud to enable the "Hold to Execute SCM Mitigation" feature in simulations.',
    primaryActionLabel: 'Manage Connectors'
  },
  '/dashboard/settings': {
    routeKey: 'settings',
    badge: 'MULTI-TENANT RBAC',
    title: 'Workspace Settings & Access Control',
    tagline: 'Enterprise Governance, Invite Codes & Role Management',
    whatItDoes: 'Manage your organization\'s brand settings, invite codes (CSX-XXXXXX), multi-tenant isolation, and member permissions.',
    howItHelps: [
      'Enforces strict role-based access control (OWNER, LEADER, ADMIN, MEMBER, GUEST).',
      'Share working invite codes for instant, seamless team onboarding without approval bottlenecks.',
      'Configures enterprise AI credit pools and organization-wide security policies.'
    ],
    proTip: 'Copy your CSX invite code to bring your executive team into this isolated workspace.',
    primaryActionLabel: 'Configure Workspace'
  },
  '/dashboard/cowork': {
    routeKey: 'cowork',
    badge: 'WAR-ROOM HUB',
    title: 'Cowork & Cross-Silo Deal Room',
    tagline: 'Real-Time Multi-Agent Collaboration Hub',
    whatItDoes: 'A unified live workspace where human teams and AI digital twins collaborate concurrently on complex M&A deals and crisis response.',
    howItHelps: [
      'Breaks down cross-department silos between legal, technical, and financial teams.',
      'Provides live shared document scratchpads with automatic adversarial redlining.',
      'Accelerates cross-functional approvals from weeks to minutes.'
    ],
    proTip: 'Launch a Deal Room for high-velocity cross-functional initiatives like M&A due diligence.',
    primaryActionLabel: 'Enter Cowork Hub'
  }
};
