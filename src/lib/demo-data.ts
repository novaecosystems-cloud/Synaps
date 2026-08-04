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
  name: "Apex Global Hospitality & Hotel Operations Pvt Ltd",
  industry: "Luxury Hospitality, Hotel Management & F&B Operations (3 Hotel Properties in India)",
  tier: "Enterprise Max",
  healthScore: 94,
  activeProjects: 14,
  totalDocuments: 850,
  decisionsLogged: 218,
  aiCreditsRemaining: 10000
};

export const NOVA_DEMO_DOCUMENTS = [
  { name: "Apex_Hotels_India_Q3_Operations_SOP.pdf", category: "Hotel Operations & SOPs", size: "4.8 MB", status: "Analyzed", riskScore: "Clean" },
  { name: "F&B_Vendor_Supply_Contracts_2026.pdf", category: "Vendor & Procurement Contracts", size: "3.9 MB", status: "Analyzed", riskScore: "74/100 (Auto-Renewal Risk)" },
  { name: "ISO_27001_Guest_Data_Security_Audit.pdf", category: "Security & Compliance", size: "5.2 MB", status: "Analyzed", riskScore: "Clean" },
  { name: "Financial_Summary_3_Hotels_India_Q2.xlsx", category: "Financial Audits", size: "6.1 MB", status: "Analyzed", riskScore: "Clean" },
  { name: "APAC_Hospitality_Expansion_Risk_Matrix.pdf", category: "Strategic Risk Assessment", size: "4.2 MB", status: "Analyzed", riskScore: "Action Needed" },
  { name: "Staff_Housekeeping_Shift_Compliance_2026.pdf", category: "HR & Staff Compliance", size: "3.1 MB", status: "Analyzed", riskScore: "Clean" },
  { name: "Fire_Safety_&_Disaster_Management_Permits.pdf", category: "Legal & Government Permits", size: "2.9 MB", status: "Analyzed", riskScore: "Clean" },
  { name: "Guest_Experience_&_TripAdvisor_Reviews_Q3.pdf", category: "Guest Experience Intelligence", size: "3.6 MB", status: "Analyzed", riskScore: "Clean" }
];

export const NOVA_CROSS_DOCUMENT_ANALYSIS = {
  userQuery: "Analyze operational risks, food supplier contracts, and financial margins across our 3 hotel properties in India.",
  synapsReasoningSummary: "Cross-document AI reasoning executed across 8 Apex Global Hospitality company documents. Synaps identified a ₹38.4 Lakh quarterly revenue leakage caused by an un-indexed 14% price escalation clause in F&B Vendor Contract #APX-FB-2026-92 with Royal Agri Supplies, along with a 45-day auto-renewal deadline on October 15, 2026.",
  recommendedAction: "Execute Contract Amendment #2 with Royal Agri Supplies before Oct 15, 2026 to lock in fixed bulk pricing and re-allocate ₹18.5 Lakh to Jaipur Property HVAC modernization.",
  connectedDocuments: [
    { doc: "F&B_Vendor_Supply_Contracts_2026.pdf", finding: "Section 8.4 contains an automatic 14% annual cost escalation clause triggering on Nov 1 unless written notice is served 45 days prior (Oct 15)." },
    { doc: "Financial_Summary_3_Hotels_India_Q2.xlsx", finding: "F&B cost of goods sold (COGS) increased from 28.2% to 34.6% at Mumbai & Delhi properties, impacting net profit margins by 4.2%." },
    { doc: "Apex_Hotels_India_Q3_Operations_SOP.pdf", finding: "Jaipur property HVAC operational efficiency fell below standard (SOP #104), increasing monthly utility overhead by ₹4.2 Lakh." },
    { doc: "ISO_27001_Guest_Data_Security_Audit.pdf", finding: "PMS Guest Booking Database compliance rating verified at 99.4% (SOC 2 Type II & GDPR compliant)." }
  ]
};
