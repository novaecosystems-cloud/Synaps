/**
 * OFFICIAL GEMINI XPRIZE TRACKS & GRAND CHALLENGE CAUSAL MODELS
 * 
 * Formal Structural Causal Models (SCMs) tailored to the 5 official XPRIZE competition tracks:
 * 1. Small Business Services & Entrepreneurship Solvency
 * 2. Professional Services Access & Legal Democratization
 * 3. Money & Financial Access (Micro-Capital Counterfactuals)
 * 4. Global Supply Chain & Critical Infrastructure Resilience
 * 5. Workforce Upskilling & Alternative Credentialing
 */

import { StructuralCausalModel } from './structural-causal-model';

/**
 * XPRIZE TRACK 1: Small Business Services & Entrepreneurship Solvency
 * Models local merchant cash flow vulnerability, commercial lease overhang, and revenue resilience under macro shifts.
 */
export function createSmallBusinessSolvencySCM(): StructuralCausalModel {
  const scm = new StructuralCausalModel(
    'Small Business & Entrepreneurship Solvency SCM',
    'Evaluates small business runway preservation, micro-capital deployment, and lease negotiations.'
  );

  scm
    .addNode({ id: 'MacroInterestRateBps', name: 'Macro Benchmark Rate Shift (bps)', domain: 'macro', baselineValue: 50, minVal: 0, maxVal: 500, unit: 'bps' })
    .addNode({ id: 'MicroCapitalAccessUsd', name: 'Micro-Working Capital Reserve ($k)', domain: 'finance', baselineValue: 25.0, minVal: 0, maxVal: 150, unit: '$k' })
    .addNode({ id: 'LocalCustomerFootfall', name: 'Local Footfall & Customer Demand Index', domain: 'finance', baselineValue: 100.0, minVal: 20, maxVal: 200, unit: 'pts' })
    .addNode({ id: 'CommercialLeaseOverhang', name: 'Commercial Lease Monthly Burden ($k)', domain: 'legal', baselineValue: 8.5, minVal: 2, maxVal: 30, unit: '$k/mo' })
    .addNode({ id: 'MonthlyGrossRevenueUsd', name: 'Monthly Gross Revenue ($k)', domain: 'finance', baselineValue: 42.0, minVal: 5, maxVal: 200, unit: '$k/mo' })
    .addNode({ id: 'WorkingCapitalMonths', name: 'Working Capital Cash Runway (Months)', domain: 'finance', baselineValue: 8.4, minVal: 0.5, maxVal: 36, unit: 'months' })
    .addNode({ id: 'BusinessDefaultRiskPct', name: '12-Month Involuntary Default Risk (%)', domain: 'finance', baselineValue: 14.2, minVal: 0, maxVal: 95, unit: '%' });

  // Directed Causal Edges
  scm
    .addEdge({ from: 'MacroInterestRateBps', to: 'MicroCapitalAccessUsd', weight: -0.35, mechanismType: 'elastic', description: 'Rate hikes reduce affordable micro-loan availability.' })
    .addEdge({ from: 'LocalCustomerFootfall', to: 'MonthlyGrossRevenueUsd', weight: 0.78, mechanismType: 'linear', description: 'Footfall directly drives top-line merchant sales.' })
    .addEdge({ from: 'MonthlyGrossRevenueUsd', to: 'WorkingCapitalMonths', weight: 0.65, mechanismType: 'linear', description: 'Operating cash inflows extend merchant survival runway.' })
    .addEdge({ from: 'CommercialLeaseOverhang', to: 'WorkingCapitalMonths', weight: -0.55, mechanismType: 'linear', description: 'Fixed commercial rent drains reserves.' })
    .addEdge({ from: 'MicroCapitalAccessUsd', to: 'WorkingCapitalMonths', weight: 0.45, mechanismType: 'linear', description: 'Injected working capital directly extends runway.' })
    .addEdge({ from: 'WorkingCapitalMonths', to: 'BusinessDefaultRiskPct', weight: -1.25, mechanismType: 'elastic', description: 'Runway expansion nonlinearly collapses default probability.' });

  return scm;
}

/**
 * XPRIZE TRACK 2: Professional Services Access & Legal Democratization
 * Models equalizing elite $1,200/hr legal/compliance audits for everyday founders and preventing predatory contract traps.
 */
export function createProfessionalServicesAccessSCM(): StructuralCausalModel {
  const scm = new StructuralCausalModel(
    'Professional Legal Services Democratization SCM',
    'Models the elimination of unvetted contractual liability traps for non-lawyer founders.'
  );

  scm
    .addNode({ id: 'LawyerHourlyRateUsd', name: 'Traditional Outside Counsel Rate ($/hr)', domain: 'legal', baselineValue: 1200, minVal: 300, maxVal: 2500, unit: '$/hr' })
    .addNode({ id: 'ContractClauseAggressiveness', name: 'Vendor Predatory Clause Index', domain: 'legal', baselineValue: 65, minVal: 10, maxVal: 100, unit: 'pts' })
    .addNode({ id: 'DelawareFiduciaryShieldActive', name: 'Automated Delaware DGCL § 141 Redlines (0 or 1)', domain: 'legal', baselineValue: 1, minVal: 0, maxVal: 1, unit: 'binary' })
    .addNode({ id: 'UncappedIndemnityExposureUsd', name: 'Uncapped Indemnification Exposure ($k)', domain: 'legal', baselineValue: 450, minVal: 0, maxVal: 5000, unit: '$k' })
    .addNode({ id: 'LitigationDisputeProbabilityPct', name: 'Contractual Dispute Probability (%)', domain: 'legal', baselineValue: 24.5, minVal: 0.5, maxVal: 85, unit: '%' })
    .addNode({ id: 'FounderLegalCostBurdenUsd', name: 'Total Legal & Diligence Cost ($k)', domain: 'finance', baselineValue: 18.5, minVal: 0.5, maxVal: 120, unit: '$k' });

  scm
    .addEdge({ from: 'ContractClauseAggressiveness', to: 'UncappedIndemnityExposureUsd', weight: 0.85, mechanismType: 'linear', description: 'Aggressive vendor clauses inject hidden liability overhang.' })
    .addEdge({ from: 'DelawareFiduciaryShieldActive', to: 'UncappedIndemnityExposureUsd', weight: -0.92, mechanismType: 'linear', description: 'Automated Delaware redlines cap indemnity to standard 1x fee holdbacks.' })
    .addEdge({ from: 'UncappedIndemnityExposureUsd', to: 'LitigationDisputeProbabilityPct', weight: 0.72, mechanismType: 'elastic', description: 'Uncapped liability dramatically amplifies counter-party litigation odds.' })
    .addEdge({ from: 'DelawareFiduciaryShieldActive', to: 'FounderLegalCostBurdenUsd', weight: -0.88, mechanismType: 'linear', description: 'Autonomous redlines reduce lawyer billable hours by 88%.' });

  return scm;
}

/**
 * XPRIZE TRACK 3: Global Semiconductor & Critical Infrastructure Shock
 * Macro-scale counterfactual model across raw materials, foundry bottlenecks, energy constraints, and lead times.
 */
export function createGlobalSupplyChainResilienceSCM(): StructuralCausalModel {
  const scm = new StructuralCausalModel(
    'Global Semiconductor & Infrastructure Resilience SCM',
    'Evaluates multi-tier supplier dependencies, raw silicon tariffs, and grid reliability.'
  );

  scm
    .addNode({ id: 'RawSiliconExportTariffPct', name: 'Raw Silicon / Mineral Export Tariff (%)', domain: 'macro', baselineValue: 15.0, minVal: 0, maxVal: 60, unit: '%' })
    .addNode({ id: 'FoundryUtilizationPct', name: 'Advanced Fab / Foundry Capacity (%)', domain: 'infrastructure', baselineValue: 88.0, minVal: 40, maxVal: 100, unit: '%' })
    .addNode({ id: 'RegionalGridOutageHours', name: 'Regional Energy Grid Downtime (hrs/qtr)', domain: 'infrastructure', baselineValue: 3.5, minVal: 0, maxVal: 48, unit: 'hours' })
    .addNode({ id: 'ComponentUnitCostUsd', name: 'Semiconductor Component Unit Cost ($)', domain: 'finance', baselineValue: 48.0, minVal: 15, maxVal: 250, unit: '$' })
    .addNode({ id: 'GlobalLeadTimeWeeks', name: 'Procurement & Delivery Lead Time (Weeks)', domain: 'infrastructure', baselineValue: 18.0, minVal: 4, maxVal: 60, unit: 'weeks' })
    .addNode({ id: 'EnterpriseMarginCompressionPct', name: 'Hardware Manufacturer Margin Compression (%)', domain: 'finance', baselineValue: 12.4, minVal: 0, maxVal: 50, unit: '%' });

  scm
    .addEdge({ from: 'RawSiliconExportTariffPct', to: 'ComponentUnitCostUsd', weight: 0.45, mechanismType: 'linear', description: 'Tariffs directly elevate silicon wafer procurement costs.' })
    .addEdge({ from: 'RegionalGridOutageHours', to: 'FoundryUtilizationPct', weight: -0.38, mechanismType: 'elastic', description: 'Power grid disruptions halt clean-room lithography runs.' })
    .addEdge({ from: 'FoundryUtilizationPct', to: 'GlobalLeadTimeWeeks', weight: -0.65, mechanismType: 'elastic', description: 'Fab bottlenecks cascade across global delivery timelines.' })
    .addEdge({ from: 'ComponentUnitCostUsd', to: 'EnterpriseMarginCompressionPct', weight: 0.58, mechanismType: 'linear', description: 'Higher BOM component costs crush manufacturing margins.' });

  return scm;
}

/**
 * XPRIZE TRACK 4: Workforce Upskilling & Alternative Credentialing
 * Models causal returns on targeted skill acquisition, obsolescence velocity, and upward economic mobility.
 */
export function createWorkforceUpskillingSCM(): StructuralCausalModel {
  const scm = new StructuralCausalModel(
    'Workforce Upskilling & Alternative Credentialing SCM',
    'Models the deterministic causal return on personalized AI skill learning.'
  );

  scm
    .addNode({ id: 'MonthlyUpskillingHours', name: 'Monthly Hands-On Learning (Hours)', domain: 'workforce', baselineValue: 12.0, minVal: 0, maxVal: 60, unit: 'hrs/mo' })
    .addNode({ id: 'AlternativeCredentialScore', name: 'Verified Skill Competency Score (0–100)', domain: 'workforce', baselineValue: 62.0, minVal: 10, maxVal: 100, unit: 'pts' })
    .addNode({ id: 'TechObsolescenceRiskPct', name: 'Role Automation / Obsolescence Risk (%)', domain: 'tech', baselineValue: 48.0, minVal: 5, maxVal: 90, unit: '%' })
    .addNode({ id: 'AnnualWageGrowthPct', name: 'Annualized Real Wage Growth (%)', domain: 'finance', baselineValue: 4.5, minVal: -10, maxVal: 40, unit: '%' })
    .addNode({ id: 'UpwardCareerMobilityIndex', name: 'Upward Economic Mobility Index (0–100)', domain: 'workforce', baselineValue: 54.0, minVal: 10, maxVal: 100, unit: 'pts' });

  scm
    .addEdge({ from: 'MonthlyUpskillingHours', to: 'AlternativeCredentialScore', weight: 0.82, mechanismType: 'linear', description: 'Direct study hours drive mastery of new tech frameworks.' })
    .addEdge({ from: 'AlternativeCredentialScore', to: 'TechObsolescenceRiskPct', weight: -0.75, mechanismType: 'elastic', description: 'Verified modern skills protect workers against automation displacement.' })
    .addEdge({ from: 'AlternativeCredentialScore', to: 'AnnualWageGrowthPct', weight: 0.68, mechanismType: 'linear', description: 'High-demand skills command premium compensation.' })
    .addEdge({ from: 'AnnualWageGrowthPct', to: 'UpwardCareerMobilityIndex', weight: 0.55, mechanismType: 'linear', description: 'Wage increases compound into long-term financial security.' });

  return scm;
}
