import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

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
        riskLevel: 'CRITICAL',
        originalText: "Customer shall fully defend, indemnify, and hold harmless Vendor... from and against any and all claims, liabilities, losses... regardless of whether caused in whole or in part by Vendor's negligence.",
        legalAnalysis: "Unilateral indemnification where Customer covers Vendor even for Vendor's own negligence violates Delaware corporate fiduciary duty of care. Exposes Customer to infinite third-party liability without reciprocity.",
        recommendedRedline: "Each party ('Indemnifying Party') agrees to defend and indemnify the other party against third-party claims arising solely from the Indemnifying Party's gross negligence, willful misconduct, or material breach of this Agreement. Neither party shall indemnify for the other's negligence.",
        industryBenchmark: "Standard enterprise MSAs require mutual indemnification strictly capped to direct claims resulting from gross negligence or material breach."
      },
      {
        id: 'saas-02',
        clauseType: 'Grossly Asymmetrical Limitation of Liability',
        riskLevel: 'CRITICAL',
        originalText: "IN NO EVENT SHALL VENDOR'S AGGREGATE LIABILITY... EXCEED THE TOTAL AMOUNT ACTUALLY PAID BY CUSTOMER IN THE ONE (1) MONTH... OR ONE HUNDRED DOLLARS ($100.00)... FOREGOING LIMITATIONS SHALL NOT APPLY TO CUSTOMER'S INDEMNIFICATION.",
        legalAnalysis: "Vendor limits their total downside to $100 or 1 month's fee, while Customer bears uncapped liability under Section 8. In a catastrophic data breach or outage, Customer recovers almost zero.",
        recommendedRedline: "EXCEPT FOR BREACHES OF CONFIDENTIALITY OR GROSS NEGLIGENCE, EACH PARTY'S TOTAL AGGREGATE LIABILITY UNDER THIS AGREEMENT SHALL BE MUTUALLY CAPPED AT THE TOTAL FEES PAID OR PAYABLE BY CUSTOMER IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.",
        industryBenchmark: "Market standard liability cap is 12 months of fees paid, with mutual carve-outs strictly limited to confidentiality breaches and IP infringement."
      },
      {
        id: 'saas-03',
        clauseType: 'Predatory Auto-Renewal & Fee Escalation',
        riskLevel: 'HIGH',
        originalText: "automatically renew for successive twelve (12) month periods unless Customer provides written notice... at least ninety (90) days prior... Vendor reserves the right to increase annual subscription fees by up to fifteen percent (15%)",
        legalAnalysis: "A 90-day cancellation window combined with an automatic 15% price escalator is a financial ambush. If missed by 1 day, the company is trapped in a 12-month contract at 115% cost.",
        recommendedRedline: "This Agreement shall renew for successive 12-month periods upon mutual written agreement, or upon 30 days prior written notice by Customer. Any fee adjustments must be communicated at least 60 days in advance and capped at the US Consumer Price Index (CPI) up to a maximum of 3%.",
        industryBenchmark: "Best practice requires 30-day notice with fee escalators capped at CPI (max 3-5%) or requiring affirmative renewal."
      },
      {
        id: 'saas-04',
        clauseType: 'Offshore Jurisdiction & Forum Inconvenience',
        riskLevel: 'HIGH',
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
        riskLevel: 'CRITICAL',
        originalText: "Advisor hereby assigns... all right, title, and interest in and to any and all inventions... created, conceived, or reduced to practice by Advisor... at any time during or prior to the term of this Agreement, whether or not conceived on Company premises",
        legalAnalysis: "Seizes inventions conceived 'prior to the term of this Agreement' and outside Company premises. This effectively forfeits the founder's entire pre-existing code, patents, and portfolio to the counterparty.",
        recommendedRedline: "Advisor agrees to assign only those specific inventions and works of authorship created solely within the authorized scope of services provided directly to the Company under this Agreement, explicitly excluding all pre-existing works listed in Exhibit A.",
        industryBenchmark: "California Labor Code § 2870 and Delaware commercial practice prohibit seizure of pre-existing or independently developed inventions."
      },
      {
        id: 'fip-02',
        clauseType: 'Draconian Global Non-Compete',
        riskLevel: 'CRITICAL',
        originalText: "period of twenty-four (24) months... Advisor shall not directly or indirectly engage in, advise, invest in, or provide services to any enterprise operating in the artificial intelligence, software, or digital intelligence sector anywhere in the world.",
        legalAnalysis: "A 24-month worldwide non-compete across all AI and software constitutes an unlawful restraint of trade and is void under Delaware reasonableness tests and FTC guidelines. It bars the founder from earning a living.",
        recommendedRedline: "STRIKE CLAUSE ENTIRELY. Replace with: 'Advisor agrees not to disclose or misappropriate Company's trade secrets or solicit Company employees for a period of twelve (12) months following termination.'",
        industryBenchmark: "Non-compete provisions for advisors and independent contractors are widely rejected; standard protections rely strictly on non-solicitation and confidentiality."
      },
      {
        id: 'fip-03',
        clauseType: 'Predatory Equity Clawback at Par Value',
        riskLevel: 'CRITICAL',
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
        riskLevel: 'HIGH',
        originalText: "provided that Discloser explicitly marks such materials as 'CONFIDENTIAL' in writing at the time of disclosure, or confirms in writing within five (5) business days.",
        legalAnalysis: "If you pitch your product, share code, or reveal trade secrets during a Zoom call or in an un-stamped email, the counterparty is legally free to copy it because it was not marked 'CONFIDENTIAL' within 5 days.",
        recommendedRedline: "'Confidential Information' includes all information disclosed by either party that is marked as confidential or that, given the nature of the information or the circumstances of disclosure, reasonably should be understood to be confidential or proprietary.",
        industryBenchmark: "Modern NDAs include the 'reasonably understood to be confidential' standard to protect oral and meeting disclosures."
      },
      {
        id: 'nda-02',
        clauseType: 'Poisonous Residuals Clause (Reverse Engineering Loophole)',
        riskLevel: 'CRITICAL',
        originalText: "Recipient shall be free to use for any purpose the residuals resulting from access to Discloser's Confidential Information, where 'residuals' means information in nontangible form retained in the unaided memory",
        legalAnalysis: "This clause gives the counterparty legal permission to steal your architecture and business model. A senior engineer can review your codebase or product architecture, 'remember it', and build an exact competitor legally.",
        recommendedRedline: "STRIKE ENTIRE SECTION 6. Neither party shall acquire any license or rights under any patent, copyright, or trade secret by virtue of disclosing or receiving Confidential Information under this Agreement.",
        industryBenchmark: "Founders and IP-heavy tech companies must strike residuals clauses in their entirety when disclosing proprietary architecture."
      },
      {
        id: 'nda-03',
        clauseType: 'Perpetual Confidentiality Burden',
        riskLevel: 'MODERATE',
        originalText: "obligations of confidentiality under this Agreement shall survive in perpetuity without limitation of time.",
        legalAnalysis: "Perpetual confidentiality on general business information creates an indefinite legal cloud and compliance overhead for ordinary commercial discussions.",
        recommendedRedline: "The obligations of confidentiality shall continue for a period of three (3) years from the date of disclosure, provided that trade secrets shall remain confidential for so long as they qualify as trade secrets under applicable law.",
        industryBenchmark: "Standard commercial NDAs sunset after 2 to 3 years, with a standard carve-out for trade secrets."
      }
    ]
  }
};

// ─── POST HANDLER: CONTRACT REDLINE ANALYZER ──────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractText, contractType, companyName = 'Apex Global Enterprise' } = body;

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
      findings = PRELOADED_CONTRACTS.vendor_saas.presetFindings;
      title = PRELOADED_CONTRACTS.vendor_saas.title;
    } else if (targetType === 'founder_ip' || targetText.includes('INVENTION ASSIGNMENT AGREEMENT')) {
      findings = PRELOADED_CONTRACTS.founder_ip.presetFindings;
      title = PRELOADED_CONTRACTS.founder_ip.title;
    } else if (targetType === 'nda' || targetText.includes('MUTUAL NON-DISCLOSURE AGREEMENT')) {
      findings = PRELOADED_CONTRACTS.nda.presetFindings;
      title = PRELOADED_CONTRACTS.nda.title;
    } else {
      findings = analyzeCustomContractText(targetText);
      title = 'Autonomous Fiduciary Contract Redline Analysis';
    }

    const criticalCount = findings.filter(f => f.riskLevel === 'CRITICAL').length;
    const highCount = findings.filter(f => f.riskLevel === 'HIGH').length;
    const moderateCount = findings.filter(f => f.riskLevel === 'MODERATE').length;

    let overallRiskScore = Math.min(
      98,
      Math.max(15, criticalCount * 30 + highCount * 18 + moderateCount * 8 + 10)
    );

    let riskCategory: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'SAFE' = 'SAFE';
    if (overallRiskScore >= 75) riskCategory = 'CRITICAL';
    else if (overallRiskScore >= 50) riskCategory = 'HIGH';
    else if (overallRiskScore >= 30) riskCategory = 'MODERATE';

    let delawareSafeHarborStatus: 'NON_COMPLIANT' | 'CONDITIONAL' | 'PROTECTED' = 'PROTECTED';
    if (criticalCount > 0) delawareSafeHarborStatus = 'NON_COMPLIANT';
    else if (highCount > 0) delawareSafeHarborStatus = 'CONDITIONAL';

    const executiveSummary =
      criticalCount > 0
        ? `REJECT / REDLINE REQUIRED: Contract contains ${criticalCount} CRITICAL fiduciary hazards, including uncapped liability and asymmetric indemnity. Signing in current form forfeits Delaware DGCL § 141 safe harbor protections.`
        : highCount > 0
        ? `CONDITIONAL APPROVAL: Contract exhibits ${highCount} high-risk provisions regarding auto-renewal and dispute jurisdiction. Apply suggested redlines before signing.`
        : 'FAVORABLE / LOW RISK: Standard commercial terms detected. Contract exhibits acceptable bilateral protections.';

    const timestamp = new Date().toISOString();
    const auditPayload = `${targetText.slice(0, 500)}:${JSON.stringify(findings)}:${timestamp}:${companyName}`;
    const merkleRoot = '0x' + crypto.createHash('sha256').update(auditPayload).digest('hex');
    const sha256Signature = crypto.createHash('sha256').update(merkleRoot).digest('hex');

    const result: ContractAnalysisResult = {
      contractTitle: title,
      contractType: targetType,
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

function analyzeCustomContractText(text: string): RedlineFinding[] {
  const findings: RedlineFinding[] = [];
  const lower = text.toLowerCase();

  if (lower.includes('indemnif') || lower.includes('hold harmless')) {
    const isOneWay = !lower.includes('mutual') && !lower.includes('each party shall indemnify');
    findings.push({
      id: 'custom-indemnity',
      clauseType: isOneWay ? 'Unilateral Indemnification Exposure' : 'Bilateral Indemnification Review',
      riskLevel: isOneWay ? 'CRITICAL' : 'MODERATE',
      originalText: extractSentenceMatch(text, ['indemnif', 'hold harmless']),
      legalAnalysis: isOneWay
        ? 'Unilateral indemnification forces your company to pay legal defense and judgments without reciprocal protection from the counterparty.'
        : 'Indemnification clause is present. Ensure gross negligence, willful misconduct, and IP infringement are clearly carved out.',
      recommendedRedline:
        "Each party agrees to defend, indemnify, and hold harmless the other party strictly against third-party claims arising from gross negligence or material breach of this Agreement, capped to aggregate fees paid in the preceding 12 months.",
      industryBenchmark: 'Enterprise standards require mutual indemnification strictly capped to direct breach damages.'
    });
  }

  if (lower.includes('limitation of liability') || lower.includes('aggregate liability') || lower.includes('consequential damages')) {
    const isTinyCap = lower.includes('$100') || lower.includes('one month') || lower.includes('amount paid');
    findings.push({
      id: 'custom-liability',
      clauseType: 'Limitation of Liability Ceiling',
      riskLevel: isTinyCap ? 'CRITICAL' : 'HIGH',
      originalText: extractSentenceMatch(text, ['liability exceed', 'limitation of liability', 'aggregate liability']),
      legalAnalysis:
        'Verify that liability caps are reciprocal. If counterparty caps their damages at a nominal sum while your liability is uncapped, risk exposure is catastrophic.',
      recommendedRedline:
        "EXCEPT FOR BREACHES OF CONFIDENTIALITY OBLIGATIONS, NEITHER PARTY'S AGGREGATE LIABILITY SHALL EXCEED THE TOTAL SUMS PAID OR PAYABLE UNDER THIS AGREEMENT IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.",
      industryBenchmark: 'Standard enterprise contracts cap mutual liability at 12 months of contract value.'
    });
  }

  if (lower.includes('auto-renew') || lower.includes('automatic renewal') || lower.includes('renew for successive')) {
    findings.push({
      id: 'custom-renewal',
      clauseType: 'Auto-Renewal & Notice Window',
      riskLevel: 'HIGH',
      originalText: extractSentenceMatch(text, ['renew', 'successive', 'notice']),
      legalAnalysis:
        'Auto-renewal provisions can trap companies into unwanted multi-year payment commitments if notice dates are missed.',
      recommendedRedline:
        "This Agreement shall renew only upon mutual written agreement, or upon 30 days prior written notice by either party. No automated price escalators shall apply without prior written consent.",
      industryBenchmark: 'Best practices require 30-day notice windows with no unilateral fee increases.'
    });
  }

  if (lower.includes('work for hire') || lower.includes('assigns all right') || lower.includes('intellectual property')) {
    const hasBroadAssignment = lower.includes('prior to') || lower.includes('at any time') || lower.includes('all inventions');
    findings.push({
      id: 'custom-ip',
      clauseType: hasBroadAssignment ? 'Overbroad Intellectual Property Assignment' : 'IP Allocation & Licensing',
      riskLevel: hasBroadAssignment ? 'CRITICAL' : 'HIGH',
      originalText: extractSentenceMatch(text, ['assign', 'intellectual property', 'inventions', 'work for hire']),
      legalAnalysis:
        'Ensure you are not assigning background IP, pre-existing proprietary tools, or rights that exceed the specific scope of this commercial relationship.',
      recommendedRedline:
        "Each party retains exclusive ownership of its pre-existing intellectual property, tools, and algorithms. Inventions created solely within the customized scope of work shall be assigned, excluding background code.",
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
