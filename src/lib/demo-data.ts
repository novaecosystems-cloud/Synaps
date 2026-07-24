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

export const NOVA_DEMO_ORG: DemoOrganization = {
  name: "Nova Industries Inc.",
  industry: "Global Technology Manufacturing & Enterprise Solutions",
  tier: "Enterprise Max",
  healthScore: 94,
  activeProjects: 28,
  totalDocuments: 1420,
  decisionsLogged: 412,
  aiCreditsRemaining: 10000
};

export const NOVA_DEMO_DOCUMENTS = [
  { name: "Q3 Supply Chain Risk Report.pdf", category: "Supply Chain", size: "4.4 KB", status: "Analyzed", riskScore: "78/100 (HIGH)" },
  { name: "Q3-Q4 Financial Forecast.pdf", category: "Finance", size: "3.8 KB", status: "Analyzed", riskScore: "Clean" },
  { name: "Vendor Contract Analysis.pdf", category: "Legal", size: "3.8 KB", status: "Analyzed", riskScore: "Vulnerability Found" },
  { name: "Employee Handbook and HR Policy.pdf", category: "HR & Compliance", size: "3.4 KB", status: "Analyzed", riskScore: "Clean" },
  { name: "Product Roadmap 2026.pdf", category: "Product & Engineering", size: "3.4 KB", status: "Analyzed", riskScore: "Clean" },
  { name: "Market Intelligence Report.pdf", category: "Market Analysis", size: "3.5 KB", status: "Analyzed", riskScore: "Clean" },
  { name: "Board Meeting Minutes Q3 2026.pdf", category: "Governance", size: "3.6 KB", status: "Analyzed", riskScore: "Action Needed" },
  { name: "Incident Report - Supply Chain Disruption.pdf", category: "Operations", size: "3.6 KB", status: "Analyzed", riskScore: "Resolved" },
  { name: "Customer Feedback Analysis.pdf", category: "Customer Success", size: "3.5 KB", status: "Analyzed", riskScore: "Clean" },
  { name: "Company Knowledge Base.pdf", category: "Operations", size: "3.6 KB", status: "Analyzed", riskScore: "Clean" }
];

export const NOVA_CROSS_DOCUMENT_ANALYSIS = {
  userQuery: "Analyze our Q3 supply chain risk and recommend the best business decision.",
  synapsReasoningSummary: "Cross-document intelligence executed across 10 Nova Industries documents (Q3 Supply Chain Risk Report, Vendor Contract Analysis, Financial Forecast, and Board Minutes). Synaps identified a $14.2M Q4 revenue exposure caused by a 68% single-source MCU microcontroller dependency on Apex Microelectronics (Taiwan) and a $50K liability cap loophole in GlobalFreight MSA-2026-884.",
  recommendedAction: "Execute Quantum Semi (Germany) dual-sourcing agreement ($12.5M capital budget authorized in Board Resolution RES-2026-41) and sign GlobalFreight Contract Amendment #3 immediately.",
  connectedDocuments: [
    { doc: "Q3 Supply Chain Risk Report.pdf", finding: "68% MCU dependency on Apex Microelectronics in Taiwan; 42% shipping lane delay spike." },
    { doc: "Vendor Contract Analysis.pdf", finding: "MSA-2026-884 caps GlobalFreight delay liability at $50,000 against a $1.2M/day plant stoppage loss." },
    { doc: "Q3-Q4 Financial Forecast.pdf", finding: "$4.8M COGS overrun from ocean freight surcharges and air freight expediting." },
    { doc: "Board Meeting Minutes Q3 2026.pdf", finding: "Board Resolution RES-2026-41 approved $12.5M budget for Quantum Semi European dual-sourcing." },
    { doc: "Incident Report - Supply Chain Disruption.pdf", finding: "Incident INC-2026-0742 caused 6-day assembly stoppage at Plant #4 Austin, costing $1.74M." }
  ]
};
