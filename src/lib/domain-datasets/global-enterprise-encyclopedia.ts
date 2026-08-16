/**
 * SYNAPS GLOBAL ENTERPRISE & MULTI-JURISDICTIONAL TRAINING ENCYCLOPEDIA
 * Comprehensive domain datasets across 8 industry verticals and 6 global legal jurisdictions.
 * Integrated with the Non-Volatile Memory Retention Engine for continuous learning.
 */

export interface JurisdictionLegalSystem {
  country: string;
  governingLawName: string;
  keyStatutes: string[];
  mandatoryContractRules: string[];
  enforceabilityThresholds: Record<string, string>;
  prohibitedClauses: string[];
}

export interface IndustryVerticalDomain {
  industry: string;
  keyMetricsAndFormulas: Record<string, string>;
  standardOperatingProcedures: string[];
  commonRiskTraps: string[];
  regulatoryComplianceStandards: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. GLOBAL MULTI-JURISDICTION LEGAL SYSTEMS
// ─────────────────────────────────────────────────────────────────────────────
export const GLOBAL_JURISDICTIONS: Record<string, JurisdictionLegalSystem> = {
  UNITED_STATES: {
    country: 'United States (Delaware / New York / California)',
    governingLawName: 'US Common Law & Uniform Commercial Code (UCC)',
    keyStatutes: [
      'Delaware General Corporation Law (DGCL) § 141 (Board Business Judgment Rule)',
      'Uniform Commercial Code (UCC Article 2 - Sale of Goods & Implied Warranties)',
      'Defend Trade Secrets Act (DTSA 18 U.S.C. § 1836)',
      'California Consumer Privacy Act / CPRA (Cal. Civ. Code § 1798.100+)'
    ],
    mandatoryContractRules: [
      'Indemnity vs Liability Cap: General liability caps must expressly state whether they include or exclude third-party indemnification claims.',
      'Consequential Damages: Explicitly waive lost profits and indirect damages with a mutual exclusion clause.',
      'Governing Law & Venue: Exclusive jurisdiction in Delaware Chancery Court or Southern District of New York (SDNY).'
    ],
    enforceabilityThresholds: {
      'Non-Compete Enforceability': 'Strictly unenforceable in California (Bus. & Prof. Code § 16600); enforceable in Delaware only with reasonable geography and duration (< 12 months)',
      'Liquidated Damages': 'Must represent a reasonable pre-estimate of damages, not a punitive forfeiture',
      'Statute of Limitations': 'Delaware contract claims expire in 3 years; UCC sales in 4 years'
    },
    prohibitedClauses: [
      'Post-termination non-solicitation of California employees',
      'Unreasonable punitive damage multipliers without statutory authorization',
      'Unilateral dispute resolution provisions giving only one party court access'
    ]
  },

  EUROPEAN_UNION_UK: {
    country: 'European Union & United Kingdom',
    governingLawName: 'English Common Law & EU Civil Codes / Regulations',
    keyStatutes: [
      'EU General Data Protection Regulation (GDPR) Regulation (EU) 2016/679 (Articles 28, 44-50)',
      'UK Contracts (Rights of Third Parties) Act 1999',
      'UK Unfair Contract Terms Act 1977 (UCTA - Reasonableness Test)',
      'EU Artificial Intelligence Act (Regulation 2024/1689 Risk Classifications)'
    ],
    mandatoryContractRules: [
      'Article 28 GDPR Data Processing Agreement (DPA): Mandatory clauses specifying sub-processor authorization, audit rights, and deletion upon contract end.',
      'UCTA Reasonableness: Limitation of liability for death, personal injury, or fraud cannot be capped under English law.',
      'Penalty Doctrine (Cavendish v El Makdessi): Liquidated damages must protect a legitimate commercial interest and not be extravagant or unconscionable.'
    ],
    enforceabilityThresholds: {
      'GDPR Breach Fines': 'Up to €20M or 4% of total worldwide annual turnover',
      'Standard Contractual Clauses (SCCs)': 'Mandatory for data transfers outside the EEA',
      'UK Late Payment Interest': 'Bank of England Base Rate + 8% statutory interest on commercial debts'
    },
    prohibitedClauses: [
      'Clauses attempting to cap liability for gross negligence or fraudulent misrepresentation',
      'Transfer of EU personal data to third countries without Adequacy Decision or SCCs',
      'Disproportionate lock-in auto-renewals violating consumer and small business fairness laws'
    ]
  },

  INDIA: {
    country: 'India',
    governingLawName: 'Indian Contract Act 1872 & Corporate Regulatory Framework',
    keyStatutes: [
      'Indian Contract Act 1872 (§ 73-74 Damages, § 27 Restraint of Trade, § 28 Restraint of Legal Proceedings)',
      'Digital Personal Data Protection Act 2023 (DPDP Act)',
      'Companies Act 2013 (§ 166 Fiduciary Duties of Directors)',
      'Arbitration and Conciliation Act 1996 (Amended 2015/2019)'
    ],
    mandatoryContractRules: [
      'Section 27 Absolute Ban on Post-Employment Non-Competes: Negative covenants extending post-employment termination are VOID ab initio under Indian law.',
      'Section 74 Reasonable Compensation: Liquidated damages specified in a contract serve as an upper ceiling; courts only award actual proven loss.',
      'Stamp Duty Adjudication: Commercial agreements, power of attorney, and arbitration clauses must be adequately stamped under State Stamp Acts to be admissible in evidence.',
      'GST Input Tax Credit (ITC) Reconciliation: Vendor contracts must mandate timely filing of GSTR-1 and GSTR-3B before releasing invoice holdbacks.'
    ],
    enforceabilityThresholds: {
      'DPDP Act 2023 Penalties': 'Up to ₹250 Crores per significant data security breach',
      'Arbitration Seat': 'Must explicitly define Seat of Arbitration (e.g. New Delhi/Mumbai) vs Venue to fix supervisory court jurisdiction',
      'Limitation Period': '3 years for debt and breach of contract recovery from the date of default'
    },
    prohibitedClauses: [
      'Post-employment non-compete restrictions (§ 27 ICA)',
      'Unilateral arbitration appointment clauses where only one party selects the sole arbitrator (TRF Ltd & Perkins Eastman precedents)',
      'Total waiver of the statutory 3-year limitation period (§ 28 ICA)'
    ]
  },

  SINGAPORE_APAC: {
    country: 'Singapore & APAC',
    governingLawName: 'Singapore Common Law & SIAC Arbitration Rules',
    keyStatutes: [
      'Singapore International Arbitration Act (IAA Cap. 143A)',
      'Personal Data Protection Act 2012 (PDPA)',
      'Contracts (Rights of Third Parties) Act (Cap. 53B)',
      'Electronic Transactions Act (Cap. 88)'
    ],
    mandatoryContractRules: [
      'SIAC Arbitration Clause: Standard Model Clause specifying Singapore seat, SIAC rules, and expedited procedure if dispute < SGD 6M.',
      'PDPA Data Transfer Requirements: Standard contractual clauses or Binding Corporate Rules (BCRs) required for outbound data transfers.',
      'Entire Agreement Clause: Must explicitly exclude prior representations and warranties to prevent parol evidence disputes.'
    ],
    enforceabilityThresholds: {
      'SIAC Expedited Proceedings': 'Disputes under SGD 6M resolved within 6 months by a sole arbitrator',
      'PDPA Maximum Penalty': 'Up to 10% of annual turnover in Singapore or SGD 1M'
    },
    prohibitedClauses: [
      'Agreements ousting the supervisory jurisdiction of the Singapore High Court under the IAA',
      'Clauses penalizing whistleblowers under the Singapore Companies Act'
    ]
  },

  MIDDLE_EAST_UAE: {
    country: 'United Arab Emirates (DIFC / ADGM / Mainland)',
    governingLawName: 'DIFC/ADGM Common Law & UAE Civil Transactions Law (Federal Law No. 5/1985)',
    keyStatutes: [
      'DIFC Contract Law (DIFC Law No. 6/2004)',
      'ADGM Commercial Regulations 2015',
      'UAE Federal Decree-Law No. 45/2021 on Personal Data Protection',
      'UAE Commercial Companies Law (Federal Decree-Law No. 32/2021)'
    ],
    mandatoryContractRules: [
      'Dual Jurisdiction Choice: Explicitly designate DIFC Courts or ADGM Courts (English common law system) vs Mainland UAE Courts (Arabic civil law).',
      'Good Faith Requirement: Mandatory general principle of good faith (Article 246 UAE Civil Code) supersedes strict literal contract terms in Mainland disputes.',
      'Liquidated Damages Adjustment: Mainland UAE judges have statutory discretion to adjust agreed liquidated damages to reflect actual harm.'
    ],
    enforceabilityThresholds: {
      'DIFC Court Enforcement': 'Direct reciprocal enforcement with English and Commonwealth commercial courts',
      'UAE Data Protection Fine': 'Fines up to AED 10M for unauthorized international personal data transfer'
    },
    prohibitedClauses: [
      'Contracts executed without Arabic dual translation if submitted to Mainland UAE courts',
      'Agreements containing interest (Riba) clauses exceeding the UAE Central Bank maximum commercial lending rate'
    ]
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. INDUSTRY VERTICALS & DOMAIN DATASETS
// ─────────────────────────────────────────────────────────────────────────────
export const INDUSTRY_DOMAINS: Record<string, IndustryVerticalDomain> = {
  HOSPITALITY_HOTEL_OPS: {
    industry: 'Hospitality, Hotel Chains & Asset Management',
    keyMetricsAndFormulas: {
      'RevPAR (Revenue Per Available Room)': 'Total Room Revenue / Total Available Rooms = ADR × Occupancy Rate',
      'GOPPAR (Gross Operating Profit Per Available Room)': 'Gross Operating Profit (GOP) / Total Available Rooms',
      'ADR (Average Daily Rate)': 'Total Room Revenue / Total Rooms Sold',
      'OTA Commission Margin': 'Total OTA Payout / Gross OTA Bookings (Target: < 15%)',
      'Direct Booking Share': 'Direct Bookings Revenue / Total Room Revenue (Target: > 45%)'
    },
    standardOperatingProcedures: [
      'OTA Parity Reconciliation: Audit OTA rate parity daily to prevent algorithmic rank penalties from Expedia/Booking.com.',
      'Food & Beverage (F&B) Yield Management: Audit banquets, food waste percentages, and weekly inventory reconciliations.',
      'Vendor SLA & Maintenance Audit: 24/7 HVAC, elevator, and fire suppression compliance inspection logs.'
    ],
    commonRiskTraps: [
      'OTA Commission Overcharges: Undetected booking fee commission creep (18% - 25% without volume rebates).',
      'Food Safety & Compliance Violations (HACCP/FSSAI): Expired refrigeration log audits risking operating license revocation.',
      'Unreconciled Banquet Billing: Disputed guest billing for extra event hours without signed banquet event orders (BEO).'
    ],
    regulatoryComplianceStandards: [
      'FSSAI / FDA Food Safety Standards',
      'PCI-DSS Level 1 for Hotel Credit Card POS Systems',
      'Fire & Life Safety (NFPA 101) Compliance'
    ]
  },

  LOGISTICS_SUPPLY_CHAIN: {
    industry: 'Freight, Logistics, Warehousing & Global Trade',
    keyMetricsAndFormulas: {
      'OTIF (On-Time In-Full Delivery)': '(On-Time Deliveries ∩ In-Full Deliveries) / Total Orders (Target: > 98%)',
      'Inventory Turnover Ratio': 'Cost of Goods Sold (COGS) / Average Inventory Value (Target: 6x to 12x)',
      'Demurrage & Detention Cost Exposure': 'Total Days Exceeding Free Time × Daily Demurrage Rate',
      'Operating Ratio (Transport)': 'Total Operating Expenses / Gross Freight Revenue (Target: < 88%)'
    },
    standardOperatingProcedures: [
      'Incoterms 2020 Allocation: Explicitly assign freight cost, insurance, and risk transfer point (EXW, FOB, CIF, DDP).',
      'Bill of Lading & Carrier Lien Audit: Ensure clean bill of lading before releasing supplier letter of credit payments.',
      'Cold Chain Temperature Telemetry: Continuous IoT sensor validation for perishable and pharmaceutical cargo.'
    ],
    commonRiskTraps: [
      'Demurrage Cost Spirals: Port congestion holding containers past 7 free days triggering $300/day penalties.',
      'Fuel Surcharge Formula Drift: Carrier indexing fuel surcharges to arbitrary private benchmark rates.',
      'Carrier Liability Caps (Carriage of Goods by Sea Act / COGSA): Statutory recovery capped at $500 per package without declared value insurance.'
    ],
    regulatoryComplianceStandards: [
      'Incoterms 2020 Rules (ICC Publication No. 723)',
      'Customs-Trade Partnership Against Terrorism (C-TPAT)',
      'HAZMAT / ADR Dangerous Goods Transport Regulations'
    ]
  },

  SAAS_SOFTWARE_TECH: {
    industry: 'Enterprise SaaS, Cloud Software & IT Infrastructure',
    keyMetricsAndFormulas: {
      'Magic Number': '(Current Quarter ARR - Prior Quarter ARR) × 4 / Prior Quarter S&M Spend (Target: > 0.75)',
      'Net Revenue Retention (NRR)': '(Starting ARR + Expansion - Contraction - Churn) / Starting ARR (Target: > 115%)',
      'LTV / CAC Ratio': 'Customer Lifetime Value / Customer Acquisition Cost (Target: > 3.5x)',
      'Quick Ratio (SaaS)': '(New ARR + Expansion ARR) / (Churn ARR + Contraction ARR) (Target: > 4.0)'
    },
    standardOperatingProcedures: [
      'SOC-2 Type II Annual Audit: Review access control, key rotation, and vendor sub-processor risk logs.',
      'SLA Downtime Credit Structure: 99.9% uptime target with tiered service credit structures (10% credit for < 99.9%, 25% for < 99.0%).',
      'Source Code Escrow Management: Deposit software binaries in automated escrow for mission-critical enterprise contracts.'
    ],
    commonRiskTraps: [
      'Uncapped Security Breach Indemnities: Accepting open-ended liability for customer data loss caused by upstream cloud outages.',
      'Perpetual IP Assignment: Accidentally transferring background core platform algorithms in custom statement of work (SOW) deliverables.',
      'Auto-Renewal Notice Trap: 15-day renewal windows locking enterprise clients into price increases.'
    ],
    regulatoryComplianceStandards: [
      'SOC-2 Type II & ISO 27001:2022',
      'FedRAMP Moderate / High (US Government SaaS)',
      'GDPR Article 28 / HIPAA BAA Requirements'
    ]
  },

  FINTECH_BANKING: {
    industry: 'FinTech, Payments, Banking & Lending',
    keyMetricsAndFormulas: {
      'Net Interest Margin (NIM)': '(Interest Income - Interest Expense) / Average Earning Assets',
      'Chargeback Rate': 'Total Chargebacks / Total Successful Transactions (Must be < 0.9% to avoid Visa/Mastercard fines)',
      'Capital Adequacy Ratio (CAR)': '(Tier 1 Capital + Tier 2 Capital) / Risk-Weighted Assets (Basel III > 10.5%)',
      'Default Loss Given Default (LGD)': '(Total Outstanding Debt - Recovered Capital) / Total Outstanding Debt'
    },
    standardOperatingProcedures: [
      'AML / KYC Sanctions Screening: Screen all transactions against OFAC, PEP, and international sanctions lists in real-time.',
      'PCI-DSS Tokenization: Never store raw Primary Account Numbers (PAN); mandate hardware security module (HSM) tokenization.',
      'Liquidity Buffer Stress-Testing: Model 30-day liquidity coverage ratios (LCR) under sudden run-off scenarios.'
    ],
    commonRiskTraps: [
      'Payment Gateway Reserve Traps: Acquirers holding 10% rolling reserve for 180 days due to chargeback spikes.',
      'Regulatory Non-Compliance with FinCEN / RBI / MAS: Failure to file Suspicious Activity Reports (SAR) within 30 days.'
    ],
    regulatoryComplianceStandards: [
      'PCI-DSS v4.0',
      'Basel III Banking Accord',
      'FinCEN / BSA Anti-Money Laundering Controls'
    ]
  },

  HEALTHCARE_PHARMA: {
    industry: 'Healthcare, Life Sciences & Pharmaceuticals',
    keyMetricsAndFormulas: {
      'Clinical Trial Phase Success Rate': 'Completed Endpoints / Total Enrolled Trial Cohort',
      'Average Cost Per Acquired Patient (CAC Healthcare)': 'Total Marketing & Referral Spend / Admitted Patients',
      'Days in Accounts Receivable (A/R Healthcare)': '(Total A/R / Gross Revenue) × 365 (Target: < 45 days)'
    },
    standardOperatingProcedures: [
      'HIPAA Business Associate Agreement (BAA): Enforce strict data segregation and encryption for Protected Health Information (PHI).',
      'FDA 21 CFR Part 11 Electronic Records: Secure audit trails for electronic signatures in clinical development systems.',
      'Good Clinical Practice (GCP) Audit: Complete patient informed consent verification before trial initiation.'
    ],
    commonRiskTraps: [
      'PHI Data Leaks via Analytics Scripts: Unchecked client tracking pixels transmitting patient health identifiers to ad networks.',
      'Clinical Trial Indemnity Gaps: Failing to require sponsor indemnification for subject injury during experimental drug administration.'
    ],
    regulatoryComplianceStandards: [
      'HIPAA / HITECH Act',
      'FDA 21 CFR Part 11 & Part 312 (IND Regulations)',
      'EU Medical Device Regulation (MDR 2017/745)'
    ]
  },

  REAL_ESTATE_CONSTRUCTION: {
    industry: 'Commercial Real Estate, Construction & Property Management',
    keyMetricsAndFormulas: {
      'Cap Rate (Capitalization Rate)': 'Net Operating Income (NOI) / Current Market Property Value',
      'Triple Net (NNN) Recoverable Ratio': 'Tenant Reimbursed Expenses / Total Operating Expenses (Target: > 92%)',
      'DSCR (Debt Service Coverage Ratio)': 'Net Operating Income / Annual Total Debt Payments (Target: > 1.25x)'
    },
    standardOperatingProcedures: [
      'AIA Contract Standard Administration (AIA A201 General Conditions): Monthly progress payment retainage audits (10%).',
      'Lien Waiver Execution: Mandate unconditional final lien waivers from all subcontractors before final milestone signoff.',
      'Tenant CAM (Common Area Maintenance) True-Up: Annual audit and reconciliation of actual building operating costs vs estimates.'
    ],
    commonRiskTraps: [
      'Mechanic’s Liens: Subcontractors placing encumbrances on property title due to general contractor payment diversion.',
      'Liquidated Damages for Delay: Contractual $10,000/day delay penalties triggered by unrecorded weather delays.'
    ],
    regulatoryComplianceStandards: [
      'American Institute of Architects (AIA) Document Family',
      'OSHA Construction Safety Standards (29 CFR 1926)',
      'ADA Accessibility Guidelines (ADAAG)'
    ]
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. PERSISTENT NON-VOLATILE MEMORY RETENTION ENGINE
// ─────────────────────────────────────────────────────────────────────────────
export class SynapsPersistentKnowledgeEngine {
  /**
   * Retrieves full synthesized domain intelligence matching any industry, jurisdiction, or prompt
   */
  public static getMasterTrainingDataset(query: string, userJurisdiction: string = 'UNITED_STATES'): string {
    const q = (query || '').toUpperCase();

    // 1. Detect Jurisdiction
    let jurisdictionKey = 'UNITED_STATES';
    if (q.includes('INDIA') || q.includes('DELHI') || q.includes('MUMBAI') || q.includes('DPDP') || q.includes('GST') || userJurisdiction === 'INDIA') {
      jurisdictionKey = 'INDIA';
    } else if (q.includes('EUROPE') || q.includes('GDPR') || q.includes('UK') || q.includes('LONDON') || q.includes('GERMANY')) {
      jurisdictionKey = 'EUROPEAN_UNION_UK';
    } else if (q.includes('SINGAPORE') || q.includes('SIAC') || q.includes('APAC')) {
      jurisdictionKey = 'SINGAPORE_APAC';
    } else if (q.includes('DUBAI') || q.includes('UAE') || q.includes('DIFC') || q.includes('MIDDLE EAST')) {
      jurisdictionKey = 'MIDDLE_EAST_UAE';
    }

    const jurisdiction = GLOBAL_JURISDICTIONS[jurisdictionKey] || GLOBAL_JURISDICTIONS.UNITED_STATES;

    // 2. Detect Industry Vertical
    let matchedIndustries: IndustryVerticalDomain[] = [];
    if (q.includes('HOTEL') || q.includes('ROOM') || q.includes('REVPAR') || q.includes('HOSPITALITY') || q.includes('OTA')) {
      matchedIndustries.push(INDUSTRY_DOMAINS.HOSPITALITY_HOTEL_OPS);
    }
    if (q.includes('FREIGHT') || q.includes('LOGISTICS') || q.includes('SHIPPING') || q.includes('INCOTERMS') || q.includes('SUPPLY CHAIN') || q.includes('WAREHOUSE')) {
      matchedIndustries.push(INDUSTRY_DOMAINS.LOGISTICS_SUPPLY_CHAIN);
    }
    if (q.includes('SAAS') || q.includes('SOFTWARE') || q.includes('API') || q.includes('UPTIME') || q.includes('CLOUD') || q.includes('TECH')) {
      matchedIndustries.push(INDUSTRY_DOMAINS.SAAS_SOFTWARE_TECH);
    }
    if (q.includes('BANK') || q.includes('FINTECH') || q.includes('PAYMENT') || q.includes('LOAN') || q.includes('LENDING') || q.includes('CHARGEBACK')) {
      matchedIndustries.push(INDUSTRY_DOMAINS.FINTECH_BANKING);
    }
    if (q.includes('HEALTH') || q.includes('CLINICAL') || q.includes('PATIENT') || q.includes('HIPAA') || q.includes('PHARMA')) {
      matchedIndustries.push(INDUSTRY_DOMAINS.HEALTHCARE_PHARMA);
    }
    if (q.includes('PROPERTY') || q.includes('REAL ESTATE') || q.includes('LEASE') || q.includes('CONSTRUCTION') || q.includes('TENANT')) {
      matchedIndustries.push(INDUSTRY_DOMAINS.REAL_ESTATE_CONSTRUCTION);
    }

    // Default fallback to SaaS + Logistics + Hospitality if no specific industry is detected
    if (matchedIndustries.length === 0) {
      matchedIndustries = [
        INDUSTRY_DOMAINS.SAAS_SOFTWARE_TECH,
        INDUSTRY_DOMAINS.LOGISTICS_SUPPLY_CHAIN,
        INDUSTRY_DOMAINS.HOSPITALITY_HOTEL_OPS
      ];
    }

    // 3. Format Master Knowledge Block for System Prompts
    let masterTraining = `\n╔════════════════════════════════════════════════════════════════════════════════════╗\n`;
    masterTraining += `║       SYNAPS GLOBAL ENTERPRISE INTELLIGENCE & MULTI-JURISDICTIONAL TRAINING       ║\n`;
    masterTraining += `╚════════════════════════════════════════════════════════════════════════════════════╝\n\n`;

    masterTraining += `[🌍 GOVERNING JURISDICTION: ${jurisdiction.country.toUpperCase()}]\n`;
    masterTraining += `• Governing Law: ${jurisdiction.governingLawName}\n`;
    masterTraining += `• Key Statutory Precedents: ${jurisdiction.keyStatutes.join(' | ')}\n`;
    masterTraining += `• Mandatory Contractual Rules:\n  - ${jurisdiction.mandatoryContractRules.join('\n  - ')}\n`;
    masterTraining += `• Enforceability Thresholds:\n`;
    for (const [k, v] of Object.entries(jurisdiction.enforceabilityThresholds)) {
      masterTraining += `  - ${k}: ${v}\n`;
    }
    masterTraining += `• Prohibited Clauses (Auto-Reject):\n  - ${jurisdiction.prohibitedClauses.join('\n  - ')}\n\n`;

    for (const ind of matchedIndustries) {
      masterTraining += `[🏭 INDUSTRY VERTICAL: ${ind.industry.toUpperCase()}]\n`;
      masterTraining += `• Key Financial & Operational Equations:\n`;
      for (const [metric, formula] of Object.entries(ind.keyMetricsAndFormulas)) {
        masterTraining += `  - ${metric}: ${formula}\n`;
      }
      masterTraining += `• Standard Operating Procedures (SOPs):\n  - ${ind.standardOperatingProcedures.join('\n  - ')}\n`;
      masterTraining += `• High-Risk Operational Traps to Flag:\n  - ${ind.commonRiskTraps.join('\n  - ')}\n`;
      masterTraining += `• Compliance Frameworks: ${ind.regulatoryComplianceStandards.join(' | ')}\n\n`;
    }

    masterTraining += `[🧠 NON-VOLATILE LEARNING DIRECTIVE]\n`;
    masterTraining += `You must apply these exact legal statutes, mathematical formulas, and risk boundaries to your evaluation. Never output vague or generic advice. Ground every finding in specific statutory and operational reality.\n`;
    masterTraining += `════════════════════════════════════════════════════════════════════════════════════\n`;

    return masterTraining;
  }
}
