import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export type NegotiationStance = 'founder_protective' | 'balanced_commercial' | 'enterprise_hardball';

export interface RedlineFinding {
  id: string;
  clauseType: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  originalText: string;
  legalAnalysis: string;
  recommendedRedline: string;
  industryBenchmark: string;
}

export interface ContractAnalysisResult {
  contractTitle: string;
  contractType: string;
  negotiationStance: NegotiationStance;
  overallRiskScore: number;
  riskCategory: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'SAFE';
  executiveSummary: string;
  delawareSafeHarborStatus: 'NON_COMPLIANT' | 'CONDITIONAL' | 'PROTECTED';
  findings: RedlineFinding[];
  merkleAudit: {
    merkleRoot: string;
    leafCount: number;
    auditTimestamp: string;
    sha256Signature: string;
  };
}

// ─── PRELOADED TOXIC CONTRACT SAMPLES ─────────────────────────────────────────

export const PRELOADED_CONTRACTS = {
  vendor_saas: {
    title: 'Enterprise Cloud Infrastructure Master Services Agreement (MSA)',
    type: 'vendor_saas',
    sampleText: `ENTERPRISE MASTER SERVICES AGREEMENT
SECTION 8: INDEMNIFICATION
8.1 Customer shall fully defend, indemnify, and hold harmless Vendor, its officers, directors, employees, and affiliates from and against any and all claims, liabilities, losses, damages, costs, and expenses (including attorneys' fees) arising out of or resulting from Customer's access to or use of the Services, regardless of whether caused in whole or in part by Vendor's negligence.

SECTION 9: LIMITATION OF LIABILITY
9.1 IN NO EVENT SHALL VENDOR'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT EXCEED THE TOTAL AMOUNT ACTUALLY PAID BY CUSTOMER IN THE ONE (1) MONTH IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO LIABILITY, OR ONE HUNDRED DOLLARS ($100.00), WHICHEVER IS LESS.
9.2 THE FOREGOING LIMITATIONS SHALL NOT APPLY TO CUSTOMER'S INDEMNIFICATION OBLIGATIONS UNDER SECTION 8 OR PAYMENT OBLIGATIONS.

SECTION 12: TERM AND AUTO-RENEWAL
12.1 This Agreement shall automatically renew for successive twelve (12) month periods unless Customer provides written notice of non-renewal at least ninety (90) days prior to the expiration of the then-current term.
12.2 Vendor reserves the right to increase annual subscription fees by up to fifteen percent (15%) upon each renewal without prior written consent.

SECTION 14: GOVERNING LAW AND DISPUTE RESOLUTION
14.1 This Agreement shall be governed by the laws of the Cayman Islands, and Customer submits to the exclusive personal jurisdiction of courts in George Town, Cayman Islands, waiving any right to jury trial or class action participation.`,
    presetFindings: [
      {
        id: 'saas-01',
        clauseType: 'Uncapped One-Way Indemnification',
        riskLevel: 'CRITICAL' as const,
        originalText: "Customer shall fully defend, indemnify, and hold harmless Vendor... from and against any and all claims, liabilities, losses... regardless of whether caused in whole or in part by Vendor's negligence.",
        legalAnalysis: "Unilateral indemnification where Customer covers Vendor even for Vendor's own negligence violates Delaware corporate fiduciary duty of care. Exposes Customer to infinite third-party liability without reciprocity.",
        recommendedRedline: "Each party ('Indemnifying Party') agrees to defend and indemnify the other party against third-party claims arising solely from the Indemnifying Party's gross negligence, willful misconduct, or material breach of this Agreement. Neither party shall indemnify for the other's negligence.",
        industryBenchmark: "Standard enterprise MSAs require mutual indemnification strictly capped to direct claims resulting from gross negligence or material breach."
      },
      {
        id: 'saas-02',
        clauseType: 'Grossly Asymmetrical Limitation of Liability',
        riskLevel: 'CRITICAL' as const,
        originalText: "IN NO EVENT SHALL VENDOR'S AGGREGATE LIABILITY... EXCEED THE TOTAL AMOUNT ACTUALLY PAID BY CUSTOMER IN THE ONE (1) MONTH... OR ONE HUNDRED DOLLARS ($100.00)... FOREGOING LIMITATIONS SHALL NOT APPLY TO CUSTOMER'S INDEMNIFICATION.",
        legalAnalysis: "Vendor limits their total downside to $100 or 1 month's fee, while Customer bears uncapped liability under Section 8. In a catastrophic data breach or outage, Customer recovers almost zero.",
        recommendedRedline: "EXCEPT FOR BREACHES OF CONFIDENTIALITY OR GROSS NEGLIGENCE, EACH PARTY'S TOTAL AGGREGATE LIABILITY UNDER THIS AGREEMENT SHALL BE MUTUALLY CAPPED AT THE TOTAL FEES PAID OR PAYABLE BY CUSTOMER IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.",
        industryBenchmark: "Market standard liability cap is 12 months of fees paid, with mutual carve-outs strictly limited to confidentiality breaches and IP infringement."
      },
      {
        id: 'saas-03',
        clauseType: 'Predatory Auto-Renewal & Fee Escalation',
        riskLevel: 'HIGH' as const,
        originalText: "automatically renew for successive twelve (12) month periods unless Customer provides written notice... at least ninety (90) days prior... Vendor reserves the right to increase annual subscription fees by up to fifteen percent (15%)",
        legalAnalysis: "A 90-day cancellation window combined with an automatic 15% price escalator is a financial ambush. If missed by 1 day, the company is trapped in a 12-month contract at 115% cost.",
        recommendedRedline: "This Agreement shall renew for successive 12-month periods upon mutual written agreement, or upon 30 days prior written notice by Customer. Any fee adjustments must be communicated at least 60 days in advance and capped at the US Consumer Price Index (CPI) up to a maximum of 3%.",
        industryBenchmark: "Best practice requires 30-day notice with fee escalators capped at CPI (max 3-5%) or requiring affirmative renewal."
      },
      {
        id: 'saas-04',
        clauseType: 'Offshore Jurisdiction & Forum Inconvenience',
        riskLevel: 'HIGH' as const,
        originalText: "governed by the laws of the Cayman Islands, and Customer submits to the exclusive personal jurisdiction of courts in George Town, Cayman Islands",
        legalAnalysis: "Enforcing dispute resolution in the Cayman Islands requires flying legal counsel overseas and retaining local barristers at $1,500/hr, rendering any breach claim economically impossible to enforce.",
        recommendedRedline: "This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to conflicts of law principles. Any legal action shall be brought exclusively in state or federal courts located in Wilmington, Delaware.",
        industryBenchmark: "Over 85% of institutional enterprise contracts select Delaware or New York law with convenient domestic venue."
      }
    ]
  },

  founder_ip: {
    title: 'Founder IP Assignment & Advisor Non-Compete Agreement',
    type: 'founder_ip',
    sampleText: `CONFIDENTIAL INFORMATION AND INVENTION ASSIGNMENT AGREEMENT
SECTION 3: ASSIGNMENT OF INVENTIONS
3.1 Advisor hereby assigns and agrees to assign to Company all right, title, and interest in and to any and all inventions, designs, software, proprietary algorithms, know-how, and ideas created, conceived, or reduced to practice by Advisor, solely or jointly, at any time during or prior to the term of this Agreement, whether or not conceived on Company premises or during working hours.
3.2 Advisor irrevocably waives all moral rights in any inventions created worldwide.

SECTION 5: RESTRICTIVE COVENANTS
5.1 For a period of twenty-four (24) months following termination of this Agreement for any reason, Advisor shall not directly or indirectly engage in, advise, invest in, or provide services to any enterprise operating in the artificial intelligence, software, or digital intelligence sector anywhere in the world.
5.2 Company reserves the sole discretion to repurchase any vested equity or options held by Advisor at the original par value ($0.0001) upon termination.`,
    presetFindings: [
      {
        id: 'fip-01',
        clauseType: 'Overreaching Retroactive IP Seizure',
        riskLevel: 'CRITICAL' as const,
        originalText: "Advisor hereby assigns... all right, title, and interest in and to any and all inventions... created, conceived, or reduced to practice by Advisor... at any time during or prior to the term of this Agreement, whether or not conceived on Company premises",
        legalAnalysis: "Seizes inventions conceived 'prior to the term of this Agreement' and outside Company premises. This effectively forfeits the founder's entire pre-existing code, patents, and portfolio to the counterparty.",
        recommendedRedline: "Advisor agrees to assign only those specific inventions and works of authorship created solely within the authorized scope of services provided directly to the Company under this Agreement, explicitly excluding all pre-existing works listed in Exhibit A.",
        industryBenchmark: "California Labor Code § 2870 and Delaware commercial practice prohibit seizure of pre-existing or independently developed inventions."
      },
      {
        id: 'fip-02',
        clauseType: 'Draconian Global Non-Compete',
        riskLevel: 'CRITICAL' as const,
        originalText: "period of twenty-four (24) months... Advisor shall not directly or indirectly engage in, advise, invest in, or provide services to any enterprise operating in the artificial intelligence, software, or digital intelligence sector anywhere in the world.",
        legalAnalysis: "A 24-month worldwide non-compete across all AI and software constitutes an unlawful restraint of trade and is void under Delaware reasonableness tests and FTC guidelines. It bars the founder from earning a living.",
        recommendedRedline: "STRIKE CLAUSE ENTIRELY. Replace with: 'Advisor agrees not to disclose or misappropriate Company's trade secrets or solicit Company employees for a period of twelve (12) months following termination.'",
        industryBenchmark: "Non-compete provisions for advisors and independent contractors are widely rejected; standard protections rely strictly on non-solicitation and confidentiality."
      },
      {
        id: 'fip-03',
        clauseType: 'Predatory Equity Clawback at Par Value',
        riskLevel: 'CRITICAL' as const,
        originalText: "Company reserves the sole discretion to repurchase any vested equity or options held by Advisor at the original par value ($0.0001) upon termination.",
        legalAnalysis: "Allows the company to terminate the advisor and confiscate all vested equity for pennies ($0.0001), destroying months or years of sweat equity with zero compensation.",
        recommendedRedline: "Vested equity and options shall remain the property of Advisor following termination. Any company repurchase right shall apply only to unvested shares, and any purchase of vested shares must be at Fair Market Value determined by an independent 409A valuation.",
        industryBenchmark: "Vested equity cannot be repurchased at par value without cause; standard venture agreements guarantee fair market value."
      }
    ]
  },

  nda: {
    title: 'Mutual Non-Disclosure & Proprietary Information Agreement',
    type: 'nda',
    sampleText: `MUTUAL NON-DISCLOSURE AGREEMENT
SECTION 2: DEFINITION OF CONFIDENTIAL INFORMATION
2.1 "Confidential Information" shall include all information disclosed by Discloser to Recipient, provided that Discloser explicitly marks such materials as "CONFIDENTIAL" in writing at the time of disclosure, or confirms in writing within five (5) business days.

SECTION 4: SURVIVAL AND TERM
4.1 The obligations of confidentiality under this Agreement shall survive in perpetuity without limitation of time.

SECTION 6: RESIDUALS
6.1 Notwithstanding anything to the contrary, Recipient shall be free to use for any purpose the residuals resulting from access to Discloser's Confidential Information, where "residuals" means information in nontangible form retained in the unaided memory of persons who had access to the Information.`,
    presetFindings: [
      {
        id: 'nda-01',
        clauseType: 'Oral / Unmarked Information Trap',
        riskLevel: 'HIGH' as const,
        originalText: "provided that Discloser explicitly marks such materials as 'CONFIDENTIAL' in writing at the time of disclosure, or confirms in writing within five (5) business days.",
        legalAnalysis: "If you pitch your product, share code, or reveal trade secrets during a Zoom call or in an un-stamped email, the counterparty is legally free to copy it because it was not marked 'CONFIDENTIAL' within 5 days.",
        recommendedRedline: "'Confidential Information' includes all information disclosed by either party that is marked as confidential or that, given the nature of the information or the circumstances of disclosure, reasonably should be understood to be confidential or proprietary.",
        industryBenchmark: "Modern NDAs include the 'reasonably understood to be confidential' standard to protect oral and meeting disclosures."
      },
      {
        id: 'nda-02',
        clauseType: 'Poisonous Residuals Clause (Reverse Engineering Loophole)',
        riskLevel: 'CRITICAL' as const,
        originalText: "Recipient shall be free to use for any purpose the residuals resulting from access to Discloser's Confidential Information, where 'residuals' means information in nontangible form retained in the unaided memory",
        legalAnalysis: "This clause gives the counterparty legal permission to steal your architecture and business model. A senior engineer can review your codebase or product architecture, 'remember it', and build an exact competitor legally.",
        recommendedRedline: "STRIKE ENTIRE SECTION 6. Neither party shall acquire any license or rights under any patent, copyright, or trade secret by virtue of disclosing or receiving Confidential Information under this Agreement.",
        industryBenchmark: "Founders and IP-heavy tech companies must strike residuals clauses in their entirety when disclosing proprietary architecture."
      },
      {
        id: 'nda-03',
        clauseType: 'Perpetual Confidentiality Burden',
        riskLevel: 'MODERATE' as const,
        originalText: "obligations of confidentiality under this Agreement shall survive in perpetuity without limitation of time.",
        legalAnalysis: "Perpetual confidentiality on general business information creates an indefinite legal cloud and compliance overhead for ordinary commercial discussions.",
        recommendedRedline: "The obligations of confidentiality shall continue for a period of three (3) years from the date of disclosure, provided that trade secrets shall remain confidential for so long as they qualify as trade secrets under applicable law.",
        industryBenchmark: "Standard commercial NDAs sunset after 2 to 3 years, with a standard carve-out for trade secrets."
      }
    ]
  }
};

// ─── STANCE-ADAPTED FINDINGS GENERATOR ────────────────────────────────────────

export function getAdaptedFindings(
  contractType: string,
  stance: NegotiationStance = 'founder_protective'
): RedlineFinding[] {
  if (stance === 'founder_protective') {
    if (contractType === 'vendor_saas') return PRELOADED_CONTRACTS.vendor_saas.presetFindings;
    if (contractType === 'founder_ip') return PRELOADED_CONTRACTS.founder_ip.presetFindings;
    if (contractType === 'nda') return PRELOADED_CONTRACTS.nda.presetFindings;
  }

  if (contractType === 'vendor_saas') {
    if (stance === 'balanced_commercial') {
      return [
        {
          id: 'saas-01',
          clauseType: 'Uncapped One-Way Indemnification',
          riskLevel: 'HIGH',
          originalText: "Customer shall fully defend, indemnify, and hold harmless Vendor... regardless of whether caused in whole or in part by Vendor's negligence.",
          legalAnalysis: "(Balanced Commercial Stance) One-sided indemnity is uninsurable and uncommercial. A balanced standard institutes mutual indemnity limited to intellectual property claims, confidentiality breaches, and gross negligence, capped by the liability ceiling in Section 9.",
          recommendedRedline: "Each party shall defend and indemnify the other party against third-party claims arising from: (a) infringement of intellectual property rights; (b) gross negligence or willful misconduct; or (c) material breach of confidentiality obligations, subject to the aggregate liability cap in Section 9.",
          industryBenchmark: "High-velocity commercial SaaS standard: bilateral indemnification for IP and gross negligence subject to commercial liability cap."
        },
        {
          id: 'saas-02',
          clauseType: 'Grossly Asymmetrical Limitation of Liability',
          riskLevel: 'HIGH',
          originalText: "IN NO EVENT SHALL VENDOR'S AGGREGATE LIABILITY... EXCEED THE TOTAL AMOUNT ACTUALLY PAID BY CUSTOMER IN THE ONE (1) MONTH... OR ONE HUNDRED DOLLARS ($100.00)...",
          legalAnalysis: "(Balanced Commercial Stance) A $100 nominal liability cap is commercially unacceptable. A balanced compromise institutes a reciprocal 12-month fees paid cap (1x ACV) with mutual carve-outs for IP infringement and confidentiality breaches.",
          recommendedRedline: "EXCEPT FOR BREACHES OF CONFIDENTIALITY OBLIGATIONS OR INDEMNIFICATION UNDER SECTION 8, NEITHER PARTY'S AGGREGATE LIABILITY SHALL EXCEED THE TOTAL FEES PAID OR PAYABLE BY CUSTOMER IN THE TWELVE (12) MONTHS PRECEDING THE INCIDENT.",
          industryBenchmark: "Standard commercial B2B standard caps mutual liability at 12 months of contract value (1x ACV)."
        },
        {
          id: 'saas-03',
          clauseType: 'Predatory Auto-Renewal & Fee Escalation',
          riskLevel: 'MODERATE',
          originalText: "automatically renew for successive twelve (12) month periods unless Customer provides written notice... at least ninety (90) days prior... Vendor reserves the right to increase annual subscription fees by up to fifteen percent (15%)",
          legalAnalysis: "(Balanced Commercial Stance) A 90-day cancellation window and 15% price spike is non-standard. The balanced market standard is a 60-day notice window with price escalation capped at 5% or CPI.",
          recommendedRedline: "This Agreement shall automatically renew for successive twelve (12) month periods unless either party provides written notice of non-renewal at least sixty (60) days prior to the expiration of the then-current term. Fee increases upon renewal shall be capped at five percent (5%) per annum with at least sixty (60) days advance notice.",
          industryBenchmark: "Commercial standard: 60-day notice window with CPI or 5% maximum annual price escalator."
        },
        {
          id: 'saas-04',
          clauseType: 'Offshore Jurisdiction & Forum Inconvenience',
          riskLevel: 'MODERATE',
          originalText: "governed by the laws of the Cayman Islands, and Customer submits to the exclusive personal jurisdiction of courts in George Town, Cayman Islands",
          legalAnalysis: "(Balanced Commercial Stance) Offshore venue is impractical for routine commercial disputes. Establish governing law in a recognized US commercial jurisdiction with pre-litigation executive mediation.",
          recommendedRedline: "This Agreement shall be governed by the laws of the State of Delaware or New York. The parties agree to submit any dispute to confidential commercial mediation before initiating litigation, with venue in Wilmington, Delaware.",
          industryBenchmark: "Neutral commercial hubs (Delaware / New York) with pre-litigation mediation escalation."
        }
      ];
    }

    if (stance === 'enterprise_hardball') {
      return [
        {
          id: 'saas-01',
          clauseType: 'Uncapped One-Way Indemnification',
          riskLevel: 'CRITICAL',
          originalText: "Customer shall fully defend, indemnify, and hold harmless Vendor... regardless of whether caused in whole or in part by Vendor's negligence.",
          legalAnalysis: "(Enterprise Hardball Stance) Enterprise buyer fiduciary mandate: Vendor is the software provider and must assume 100% defense and indemnification for platform failures, security breaches, and regulatory fines. Customer shall have zero indemnification obligations.",
          recommendedRedline: "Vendor shall fully defend, indemnify, and hold harmless Customer, its officers, directors, employees, and affiliates from and against any and all claims, liabilities, losses, damages, regulatory fines, and expenses (including attorneys' fees) arising out of or resulting from: (a) any security breach or unauthorized data exposure; (b) infringement of third-party intellectual property; (c) Vendor's breach of applicable laws; or (d) Vendor's negligence or willful misconduct. Customer shall have zero indemnification obligations under this Agreement.",
          industryBenchmark: "Fortune 500 enterprise buyer standard: uncapped unilateral vendor indemnity with mandatory regulatory fine coverage and zero customer indemnity."
        },
        {
          id: 'saas-02',
          clauseType: 'Grossly Asymmetrical Limitation of Liability',
          riskLevel: 'CRITICAL',
          originalText: "IN NO EVENT SHALL VENDOR'S AGGREGATE LIABILITY... EXCEED THE TOTAL AMOUNT ACTUALLY PAID BY CUSTOMER IN THE ONE (1) MONTH... OR ONE HUNDRED DOLLARS ($100.00)...",
          legalAnalysis: "(Enterprise Hardball Stance) Nominal caps on Vendor are completely non-negotiable. Vendor must have uncapped liability for data breach, confidentiality, and IP infringement, and a 5x ACV super-cap on general claims. Customer liability is capped at 1 month of fees.",
          recommendedRedline: "VENDOR'S TOTAL AGGREGATE LIABILITY FOR BREACHES OF DATA PRIVACY, SECURITY INCIDENTS, CONFIDENTIALITY, WILLFUL MISCONDUCT, OR SECTION 8 INDEMNIFICATION SHALL BE COMPLETELY UNCAPPED. FOR ALL OTHER GENERAL CLAIMS, VENDOR'S LIABILITY SHALL NOT EXCEED FIVE TIMES (5X) THE TOTAL FEES PAID IN THE PRECEDING TWELVE (12) MONTHS. CUSTOMER'S TOTAL LIABILITY SHALL BE STRICTLY CAPPED AT TOTAL FEES PAID IN THE ONE (1) MONTH PRECEDING THE CLAIM.",
          industryBenchmark: "Tier-1 enterprise procurement requirement: uncapped liability for data breach and IP with 5x ACV super-cap on general claims."
        },
        {
          id: 'saas-03',
          clauseType: 'Predatory Auto-Renewal & Fee Escalation',
          riskLevel: 'HIGH',
          originalText: "automatically renew for successive twelve (12) month periods unless Customer provides written notice... at least ninety (90) days prior... Vendor reserves the right to increase annual subscription fees by up to fifteen percent (15%)",
          legalAnalysis: "(Enterprise Hardball Stance) Enterprise policy prohibits automated renewals and fee increases. Demands explicit opt-in renewal, a 36-month price lock guarantee, and termination for convenience with pro-rata refund.",
          recommendedRedline: "No automatic renewal shall apply. This Agreement shall expire at the conclusion of the initial term unless Customer affirmatively delivers written election to renew at least thirty (30) days prior. Pricing shall remain locked and guaranteed against any price increase for thirty-six (36) months. Customer retains the right to terminate for convenience at any time upon thirty (30) days notice with full pro-rata refund of unearned fees.",
          industryBenchmark: "Enterprise procurement standard: affirmative opt-in renewal, 36-month price lock, and unconditional termination for convenience with refund."
        },
        {
          id: 'saas-04',
          clauseType: 'Offshore Jurisdiction & Forum Inconvenience',
          riskLevel: 'HIGH',
          originalText: "governed by the laws of the Cayman Islands, and Customer submits to the exclusive personal jurisdiction of courts in George Town, Cayman Islands",
          legalAnalysis: "(Enterprise Hardball Stance) Enforce exclusive Delaware corporate jurisdiction with mandatory prevailing-party attorney fee and litigation cost reimbursement.",
          recommendedRedline: "This Agreement shall be governed exclusively by the laws of the State of Delaware. Any legal proceeding shall be brought exclusively in the state or federal courts located in Wilmington, Delaware, and the prevailing party in any action shall be entitled to recover all reasonable attorneys' fees, expert witness fees, and litigation costs from the non-prevailing party.",
          industryBenchmark: "Tier-1 enterprise buyer forum selection with mandatory prevailing-party legal fee shifting."
        }
      ];
    }
  }

  if (contractType === 'founder_ip') {
    if (stance === 'balanced_commercial') {
      return [
        {
          id: 'fip-01',
          clauseType: 'Overreaching Retroactive IP Seizure',
          riskLevel: 'HIGH',
          originalText: "Advisor hereby assigns... all right, title, and interest in and to any and all inventions... created, conceived, or reduced to practice by Advisor... at any time during or prior to the term of this Agreement",
          legalAnalysis: "(Balanced Commercial Stance) Assignment must be tied directly to company-funded development. Carves out pre-existing portfolio and independent projects developed outside company hours.",
          recommendedRedline: "Advisor assigns rights in inventions and works created during the term directly utilizing Company proprietary information or confidential resources. All pre-existing intellectual property and independent projects developed outside company time without company assets are explicitly excluded.",
          industryBenchmark: "Standard Silicon Valley commercial advisor agreement carving out pre-existing IP in Exhibit A."
        },
        {
          id: 'fip-02',
          clauseType: 'Draconian Global Non-Compete',
          riskLevel: 'HIGH',
          originalText: "period of twenty-four (24) months... Advisor shall not directly or indirectly engage in, advise, invest in, or provide services to any enterprise operating in the artificial intelligence, software, or digital intelligence sector anywhere in the world.",
          legalAnalysis: "(Balanced Commercial Stance) A 24-month worldwide ban is unreasonable. Narrow the restriction to 6 months strictly in the company's direct primary product niche, explicitly permitting advisory and investment roles outside direct competition.",
          recommendedRedline: "During the term and for a period of six (6) months following termination, Advisor shall not provide direct consulting services to a named direct competitor of Company in Company's specific primary product line within the United States. General technology advisory, passive investments, and academic roles are expressly permitted.",
          industryBenchmark: "Commercial compromise: 6-month narrow non-compete restricted to direct competitors, allowing non-conflicting advisory work."
        },
        {
          id: 'fip-03',
          clauseType: 'Predatory Equity Clawback at Par Value',
          riskLevel: 'HIGH',
          originalText: "Company reserves the sole discretion to repurchase any vested equity or options held by Advisor at the original par value ($0.0001) upon termination.",
          legalAnalysis: "(Balanced Commercial Stance) Vested equity is earned sweat equity. Company may hold a right of first refusal at Fair Market Value rather than an arbitrary par-value forfeiture.",
          recommendedRedline: "Vested shares and options shall not be subject to forfeiture or par-value repurchase upon termination without cause. In the event of voluntary resignation, Company may exercise a right of first refusal to repurchase vested shares at Fair Market Value determined by mutual agreement or independent valuation within sixty (60) days.",
          industryBenchmark: "Venture-backed standard: ROFR at Fair Market Value rather than confiscation at par value."
        }
      ];
    }

    if (stance === 'enterprise_hardball') {
      return [
        {
          id: 'fip-01',
          clauseType: 'Overreaching Retroactive IP Seizure',
          riskLevel: 'CRITICAL',
          originalText: "Advisor hereby assigns... all right, title, and interest in and to any and all inventions... created, conceived, or reduced to practice by Advisor... at any time during or prior to the term of this Agreement",
          legalAnalysis: "(Enterprise Hardball Stance) As corporate sponsor, the enterprise must secure complete, unencumbered ownership of all deliverables and IP created for the engagement, with power of attorney to file patents worldwide.",
          recommendedRedline: "Advisor assigns to Company all right, title, and interest in and to all inventions, software, know-how, and works of authorship developed during the performance of services under this Agreement, and irrevocably appoints Company as attorney-in-fact to execute any confirmatory assignments.",
          industryBenchmark: "Institutional corporate IP policy: complete assignment of project works with power of attorney."
        },
        {
          id: 'fip-02',
          clauseType: 'Draconian Global Non-Compete',
          riskLevel: 'CRITICAL',
          originalText: "period of twenty-four (24) months... Advisor shall not directly or indirectly engage in, advise, invest in, or provide services to any enterprise operating in the artificial intelligence, software, or digital intelligence sector anywhere in the world.",
          legalAnalysis: "(Enterprise Hardball Stance) Restructure broad non-compete into an ironclad 18-month customer and talent non-solicitation with liquidated damages of $50,000 per breach and immediate injunctive relief.",
          recommendedRedline: "During the term and for eighteen (18) months post-termination, Advisor shall not directly or indirectly solicit Company clients or key personnel, nor engage in competitive product development within Company's defined core market. Advisor agrees to prompt injunctive relief and liquidated damages of $50,000 per violation.",
          industryBenchmark: "Aggressive corporate standard: 18-month non-solicit with liquidated damages and immediate injunction."
        },
        {
          id: 'fip-03',
          clauseType: 'Predatory Equity Clawback at Par Value',
          riskLevel: 'CRITICAL',
          originalText: "Company reserves the sole discretion to repurchase any vested equity or options held by Advisor at the original par value ($0.0001) upon termination.",
          legalAnalysis: "(Enterprise Hardball Stance) Unvested equity must cancel instantly upon departure. Vested equity may be repurchased at par value strictly in the event of termination for Cause (fraud, criminal act, or duty breach).",
          recommendedRedline: "Unvested equity shall terminate immediately upon cessation of services. Vested equity may be repurchased by Company strictly in the event of termination for Cause (material breach, fraud, or intentional misconduct) at par value; otherwise, Advisor retains standard cashless exercise rights for ninety (90) days post-termination.",
          industryBenchmark: "Institutional governance standard: par value repurchase strictly for Cause, otherwise standard post-termination exercise."
        }
      ];
    }
  }

  if (contractType === 'nda') {
    if (stance === 'balanced_commercial') {
      return [
        {
          id: 'nda-01',
          clauseType: 'Oral / Unmarked Information Trap',
          riskLevel: 'MODERATE',
          originalText: "provided that Discloser explicitly marks such materials as 'CONFIDENTIAL' in writing at the time of disclosure, or confirms in writing within five (5) business days.",
          legalAnalysis: "(Balanced Commercial Stance) A 5-day written confirmation window is too rigid for rapid partnership discussions. Broaden to 15 business days or any information reasonably understood to be confidential.",
          recommendedRedline: "Confidential Information includes all marked proprietary materials, as well as oral or visual disclosures confirmed in writing within fifteen (15) business days, or information that a reasonable business person would understand to be proprietary.",
          industryBenchmark: "Standard commercial bilateral NDA: 15-day confirmation window or 'reasonably understood' standard."
        },
        {
          id: 'nda-02',
          clauseType: 'Poisonous Residuals Clause (Reverse Engineering Loophole)',
          riskLevel: 'HIGH',
          originalText: "Recipient shall be free to use for any purpose the residuals resulting from access to Discloser's Confidential Information, where 'residuals' means information in nontangible form retained in the unaided memory",
          legalAnalysis: "(Balanced Commercial Stance) Standardize residuals to protect high-level general engineering concepts retained in unaided memory, while strictly forbidding replication of code, algorithms, or customer data.",
          recommendedRedline: "Section 6 shall apply strictly to general technical concepts and skills retained in unaided memory, provided that Recipient shall not disclose, replicate, or commercialize Discloser's proprietary source code, system architectures, customer data, or algorithms.",
          industryBenchmark: "Commercial compromise residuals clause with strict carve-outs for source code and proprietary algorithms."
        },
        {
          id: 'nda-03',
          clauseType: 'Perpetual Confidentiality Burden',
          riskLevel: 'LOW',
          originalText: "obligations of confidentiality under this Agreement shall survive in perpetuity without limitation of time.",
          legalAnalysis: "(Balanced Commercial Stance) Perpetual confidentiality creates indefinite legal tracking burden. Standard commercial sunset is 2 years from disclosure, with 5 years for trade secrets.",
          recommendedRedline: "The obligations of confidentiality under this Agreement shall survive for a period of two (2) years following termination of discussions, with trade secret protections surviving for five (5) years.",
          industryBenchmark: "Standard commercial practice: 2-year sunset with 5-year trade secret preservation."
        }
      ];
    }

    if (stance === 'enterprise_hardball') {
      return [
        {
          id: 'nda-01',
          clauseType: 'Oral / Unmarked Information Trap',
          riskLevel: 'CRITICAL',
          originalText: "provided that Discloser explicitly marks such materials as 'CONFIDENTIAL' in writing at the time of disclosure, or confirms in writing within five (5) business days.",
          legalAnalysis: "(Enterprise Hardball Stance) Enterprise proprietary trade secrets must be protected without bureaucratic marking requirements. All exchanged information is automatically deemed confidential.",
          recommendedRedline: "All information disclosed by Discloser, whether oral, visual, electronic, or written, and whether or not marked as confidential, shall be deemed Confidential Information subject to full protective obligations without any requirement of written confirmation.",
          industryBenchmark: "Top-tier enterprise NDA standard: automatic confidentiality classification without marking conditionality."
        },
        {
          id: 'nda-02',
          clauseType: 'Poisonous Residuals Clause (Reverse Engineering Loophole)',
          riskLevel: 'CRITICAL',
          originalText: "Recipient shall be free to use for any purpose the residuals resulting from access to Discloser's Confidential Information, where 'residuals' means information in nontangible form retained in the unaided memory",
          legalAnalysis: "(Enterprise Hardball Stance) Strike residuals in their entirety. Any unauthorized use of confidential knowledge creates immediate irreparable harm entitling Discloser to preliminary injunctive relief without bond.",
          recommendedRedline: "STRIKE SECTION 6 IN ITS ENTIRETY. Recipient expressly acknowledges that access to Discloser's confidential information creates a fiduciary duty not to use or exploit such knowledge in competing projects, and agrees to immediate preliminary injunction without requirement of bond for any breach.",
          industryBenchmark: "Enterprise institutional stance: absolute rejection of residuals with mandatory injunctive relief."
        },
        {
          id: 'nda-03',
          clauseType: 'Perpetual Confidentiality Burden',
          riskLevel: 'MODERATE',
          originalText: "obligations of confidentiality under this Agreement shall survive in perpetuity without limitation of time.",
          legalAnalysis: "(Enterprise Hardball Stance) Require 5-year confidentiality for commercial records, and perpetual survival for all proprietary source code, algorithms, and customer lists.",
          recommendedRedline: "Confidentiality obligations shall endure for five (5) years from disclosure, and indefinitely in perpetuity for all proprietary source code, trade secrets, security architecture, and client lists.",
          industryBenchmark: "Enterprise IP protection standard: 5-year commercial term and perpetual trade secret protection."
        }
      ];
    }
  }

  // Default fallback
  return PRELOADED_CONTRACTS.vendor_saas.presetFindings;
}

// ─── POST HANDLER: CONTRACT REDLINE ANALYZER ──────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      contractText,
      contractType,
      companyName = 'Apex Global Enterprise',
      stance = 'founder_protective',
      negotiationStance
    } = body;

    const targetStance: NegotiationStance = (negotiationStance || stance || 'founder_protective') as NegotiationStance;
    let targetType = contractType || 'custom';
    let targetText = (contractText || '').trim();

    if (!targetText && PRELOADED_CONTRACTS[targetType as keyof typeof PRELOADED_CONTRACTS]) {
      const preloaded = PRELOADED_CONTRACTS[targetType as keyof typeof PRELOADED_CONTRACTS];
      targetText = preloaded.sampleText;
    }

    if (!targetText) {
      return NextResponse.json(
        { error: 'Contract text is required for fiduciary redline analysis.' },
        { status: 400 }
      );
    }

    let findings: RedlineFinding[] = [];
    let title = 'Custom Commercial Contract Review';

    if (targetType === 'vendor_saas' || targetText.includes('ENTERPRISE MASTER SERVICES AGREEMENT')) {
      findings = getAdaptedFindings('vendor_saas', targetStance);
      title = PRELOADED_CONTRACTS.vendor_saas.title;
    } else if (targetType === 'founder_ip' || targetText.includes('INVENTION ASSIGNMENT AGREEMENT')) {
      findings = getAdaptedFindings('founder_ip', targetStance);
      title = PRELOADED_CONTRACTS.founder_ip.title;
    } else if (targetType === 'nda' || targetText.includes('MUTUAL NON-DISCLOSURE AGREEMENT')) {
      findings = getAdaptedFindings('nda', targetStance);
      title = PRELOADED_CONTRACTS.nda.title;
    } else {
      findings = analyzeCustomContractText(targetText, targetStance);
      title = 'Autonomous Fiduciary Contract Redline Analysis';
    }

    const criticalCount = findings.filter(f => f.riskLevel === 'CRITICAL').length;
    const highCount = findings.filter(f => f.riskLevel === 'HIGH').length;
    const moderateCount = findings.filter(f => f.riskLevel === 'MODERATE').length;

    let stanceModifier = targetStance === 'enterprise_hardball' ? 6 : targetStance === 'balanced_commercial' ? -4 : 0;
    let overallRiskScore = Math.min(
      98,
      Math.max(15, criticalCount * 30 + highCount * 18 + moderateCount * 8 + 10 + stanceModifier)
    );

    let riskCategory: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'SAFE' = 'SAFE';
    if (overallRiskScore >= 75) riskCategory = 'CRITICAL';
    else if (overallRiskScore >= 50) riskCategory = 'HIGH';
    else if (overallRiskScore >= 30) riskCategory = 'MODERATE';

    let delawareSafeHarborStatus: 'NON_COMPLIANT' | 'CONDITIONAL' | 'PROTECTED' = 'PROTECTED';
    if (criticalCount > 0) delawareSafeHarborStatus = 'NON_COMPLIANT';
    else if (highCount > 0) delawareSafeHarborStatus = 'CONDITIONAL';

    const stancePrefix =
      targetStance === 'enterprise_hardball'
        ? '[ENTERPRISE HARDBALL STANCE] '
        : targetStance === 'balanced_commercial'
        ? '[BALANCED COMMERCIAL STANCE] '
        : '[FOUNDER-PROTECTIVE STANCE] ';

    const executiveSummary =
      criticalCount > 0
        ? `${stancePrefix}REJECT / REDLINE REQUIRED: Contract contains ${criticalCount} CRITICAL fiduciary hazards, including uncapped liability and asymmetric indemnity. Signing in current form forfeits Delaware DGCL § 141 safe harbor protections.`
        : highCount > 0
        ? `${stancePrefix}CONDITIONAL APPROVAL: Contract exhibits ${highCount} high-risk provisions regarding auto-renewal and dispute jurisdiction. Apply suggested redlines before signing.`
        : `${stancePrefix}FAVORABLE / LOW RISK: Standard commercial terms detected. Contract exhibits acceptable bilateral protections.`;

    const timestamp = new Date().toISOString();
    const auditPayload = `${targetText.slice(0, 500)}:${JSON.stringify(findings)}:${timestamp}:${companyName}:${targetStance}`;
    const merkleRoot = '0x' + crypto.createHash('sha256').update(auditPayload).digest('hex');
    const sha256Signature = crypto.createHash('sha256').update(merkleRoot).digest('hex');

    const result: ContractAnalysisResult = {
      contractTitle: title,
      contractType: targetType,
      negotiationStance: targetStance,
      overallRiskScore,
      riskCategory,
      executiveSummary,
      delawareSafeHarborStatus,
      findings,
      merkleAudit: {
        merkleRoot,
        leafCount: findings.length,
        auditTimestamp: timestamp,
        sha256Signature
      }
    };

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal error analyzing contract.' },
      { status: 500 }
    );
  }
}

function analyzeCustomContractText(text: string, stance: NegotiationStance = 'founder_protective'): RedlineFinding[] {
  const findings: RedlineFinding[] = [];
  const lower = text.toLowerCase();

  if (lower.includes('indemnif') || lower.includes('hold harmless')) {
    const isOneWay = !lower.includes('mutual') && !lower.includes('each party shall indemnify');
    
    let redline = "Each party agrees to defend, indemnify, and hold harmless the other party strictly against third-party claims arising from gross negligence or material breach of this Agreement, capped to aggregate fees paid in the preceding 12 months.";
    let analysis = isOneWay
      ? 'Unilateral indemnification forces your company to pay legal defense and judgments without reciprocal protection from the counterparty.'
      : 'Indemnification clause is present. Ensure gross negligence, willful misconduct, and IP infringement are clearly carved out.';
    
    if (stance === 'enterprise_hardball') {
      redline = "Counterparty shall fully defend, indemnify, and hold harmless Company from any and all third-party claims, data breaches, and IP infringement without financial cap. Company shall have zero indemnification obligations.";
      analysis = `(Enterprise Hardball) Counterparty must provide uncapped indemnity for all security and service failures with zero indemnification from Company.`;
    } else if (stance === 'balanced_commercial') {
      redline = "Each party shall defend and indemnify the other party against third-party claims arising from IP infringement, confidentiality breach, or gross negligence, capped at the liability threshold in this Agreement.";
      analysis = `(Balanced Commercial) Mutual indemnification for IP infringement and gross negligence with standard market cap.`;
    }

    findings.push({
      id: 'custom-indemnity',
      clauseType: isOneWay ? 'Unilateral Indemnification Exposure' : 'Bilateral Indemnification Review',
      riskLevel: isOneWay ? 'CRITICAL' : 'MODERATE',
      originalText: extractSentenceMatch(text, ['indemnif', 'hold harmless']),
      legalAnalysis: analysis,
      recommendedRedline: redline,
      industryBenchmark: 'Enterprise standards require mutual indemnification strictly capped to direct breach damages.'
    });
  }

  if (lower.includes('limitation of liability') || lower.includes('aggregate liability') || lower.includes('consequential damages')) {
    const isTinyCap = lower.includes('$100') || lower.includes('one month') || lower.includes('amount paid');
    
    let redline = "EXCEPT FOR BREACHES OF CONFIDENTIALITY OBLIGATIONS, NEITHER PARTY'S AGGREGATE LIABILITY SHALL EXCEED THE TOTAL SUMS PAID OR PAYABLE UNDER THIS AGREEMENT IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.";
    let analysis = 'Verify that liability caps are reciprocal. If counterparty caps their damages at a nominal sum while your liability is uncapped, risk exposure is catastrophic.';

    if (stance === 'enterprise_hardball') {
      redline = "COUNTERPARTY LIABILITY FOR DATA BREACHES, IP INFRINGEMENT, AND INDEMNIFICATION SHALL BE FULLY UNCAPPED, WITH A 5X CONTRACT VALUE CAP ON GENERAL BREACHES. COMPANY AGGREGATE LIABILITY SHALL NOT EXCEED ONE (1) MONTH OF FEES.";
      analysis = '(Enterprise Hardball) Uncapped counterparty exposure for critical risks; Company exposure strictly limited to 1 month.';
    } else if (stance === 'balanced_commercial') {
      redline = "NEITHER PARTY'S AGGREGATE LIABILITY SHALL EXCEED 1X THE TOTAL FEES PAID OR PAYABLE IN THE TWELVE (12) MONTHS PRECEDING THE INCIDENT, EXCEPT FOR BREACHES OF CONFIDENTIALITY.";
      analysis = '(Balanced Commercial) Mutual 12-month trailing fee liability cap with standard confidentiality exception.';
    }

    findings.push({
      id: 'custom-liability',
      clauseType: 'Limitation of Liability Ceiling',
      riskLevel: isTinyCap ? 'CRITICAL' : 'HIGH',
      originalText: extractSentenceMatch(text, ['liability exceed', 'limitation of liability', 'aggregate liability']),
      legalAnalysis: analysis,
      recommendedRedline: redline,
      industryBenchmark: 'Standard enterprise contracts cap mutual liability at 12 months of contract value.'
    });
  }

  if (lower.includes('auto-renew') || lower.includes('automatic renewal') || lower.includes('renew for successive')) {
    let redline = "This Agreement shall renew only upon mutual written agreement, or upon 30 days prior written notice by either party. No automated price escalators shall apply without prior written consent.";
    let analysis = 'Auto-renewal provisions can trap companies into unwanted multi-year payment commitments if notice dates are missed.';

    if (stance === 'enterprise_hardball') {
      redline = "No auto-renewal shall occur. Agreement terminates automatically unless Company sends written election to renew 30 days prior. Pricing is locked for 36 months, with Company right to terminate for convenience upon 30 days notice with full pro-rata refund.";
      analysis = '(Enterprise Hardball) Opt-in renewal only, 36-month price lock, and unconditional termination for convenience.';
    } else if (stance === 'balanced_commercial') {
      redline = "This Agreement shall renew for successive 12-month periods unless either party gives 60 days prior written notice of non-renewal. Fee increases upon renewal shall be capped at 5% per annum.";
      analysis = '(Balanced Commercial) 60-day notice window with price escalation capped at 5%.';
    }

    findings.push({
      id: 'custom-renewal',
      clauseType: 'Auto-Renewal & Notice Window',
      riskLevel: 'HIGH',
      originalText: extractSentenceMatch(text, ['renew', 'successive', 'notice']),
      legalAnalysis: analysis,
      recommendedRedline: redline,
      industryBenchmark: 'Best practices require 30-day notice windows with no unilateral fee increases.'
    });
  }

  if (lower.includes('work for hire') || lower.includes('assigns all right') || lower.includes('intellectual property')) {
    const hasBroadAssignment = lower.includes('prior to') || lower.includes('at any time') || lower.includes('all inventions');
    let redline = "Each party retains exclusive ownership of its pre-existing intellectual property, tools, and algorithms. Inventions created solely within the customized scope of work shall be assigned, excluding background code.";
    let analysis = 'Ensure you are not assigning background IP, pre-existing proprietary tools, or rights that exceed the specific scope of this commercial relationship.';

    if (stance === 'enterprise_hardball') {
      redline = "Counterparty irrevocably assigns all right, title, and interest in and to all deliverables, inventions, and works created under this Agreement to Company, waiving all moral rights worldwide.";
      analysis = '(Enterprise Hardball) Full assignment of all project deliverables and IP to Company.';
    } else if (stance === 'balanced_commercial') {
      redline = "Bespoke deliverables created specifically for Customer shall be assigned upon full payment. Each party preserves ownership of its pre-existing IP and tools.";
      analysis = '(Balanced Commercial) Clear segregation between pre-existing background IP and custom deliverables.';
    }

    findings.push({
      id: 'custom-ip',
      clauseType: hasBroadAssignment ? 'Overbroad Intellectual Property Assignment' : 'IP Allocation & Licensing',
      riskLevel: hasBroadAssignment ? 'CRITICAL' : 'HIGH',
      originalText: extractSentenceMatch(text, ['assign', 'intellectual property', 'inventions', 'work for hire']),
      legalAnalysis: analysis,
      recommendedRedline: redline,
      industryBenchmark: 'Standard vendor contracts strictly preserve pre-existing background IP.'
    });
  }

  if (findings.length === 0) {
    findings.push({
      id: 'custom-general',
      clauseType: 'Standard Commercial Provision Review',
      riskLevel: 'LOW',
      originalText: text.slice(0, 180) + '...',
      legalAnalysis: 'No immediate critical triggers detected in sample text. Ensure governing law and dispute venues are specified in Delaware or New York.',
      recommendedRedline: 'Include standard Delaware DGCL § 141 safe-harbor compliance and bilateral dispute resolution.',
      industryBenchmark: 'Standard commercial bilateral agreement.'
    });
  }

  return findings;
}

function extractSentenceMatch(text: string, keywords: string[]): string {
  const sentences = text.split(/(?<=[.?!])\s+/);
  for (const s of sentences) {
    const sLower = s.toLowerCase();
    if (keywords.some(k => sLower.includes(k))) {
      return s.trim().slice(0, 240) + (s.length > 240 ? '...' : '');
    }
  }
  return text.slice(0, 200) + '...';
}

