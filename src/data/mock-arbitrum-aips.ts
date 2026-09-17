export interface ArbitrumAipPreset {
  id: string;
  aipNumber: string;
  title: string;
  category: "TREASURY" | "GRANTS" | "DEFI_LIQUIDITY" | "ORBIT_CHAIN";
  amountArb: string;
  summary: string;
  proposer: string;
  status: "ACTIVE_DELIBERATION" | "PASSED" | "HIGH_RISK_FLAGGED";
  cfoBaseline: string;
  legalBaseline: string;
  securityBaseline: string;
  defaultRuinProbability: number;
  defaultConsensusScore: number;
  sampleScm: {
    var95: number;
    cvar95: number;
    solvencyMonths: number;
    driftPercent: number;
  };
}

export const ARBITRUM_AIP_PRESETS: ArbitrumAipPreset[] = [
  {
    id: "aip-1",
    aipNumber: "AIP-1",
    title: "Arbitrum Foundation Initial Governance & Special Grant Fund",
    category: "TREASURY",
    amountArb: "750,000,000 ARB (~$825M)",
    summary: "Allocate 750M ARB tokens to the Arbitrum Foundation Administrative Budget and Special Grants Program with multisig discretionary deployment authority.",
    proposer: "Arbitrum Foundation Core",
    status: "HIGH_RISK_FLAGGED",
    cfoBaseline: "Allocating 7.5% of total supply into a single discretionary vehicle without milestone vesting schedules creates acute token dilution and treasury drawdown risks if secondary market liquidity contracts.",
    legalBaseline: "Discretionary ratification votes violate Delaware DGCL § 141(e) fiduciary duty of care standards. Directors and delegates voting in favor without milestone oversight face potential breach-of-fiduciary duty lawsuits under US and common law.",
    securityBaseline: "Multisig custody of 750M ARB creates a concentrated single point of economic failure. Requires time-locked smart contracts with multi-tiered timelock cancel mechanisms rather than raw EOA threshold signers.",
    defaultRuinProbability: 38,
    defaultConsensusScore: 42,
    sampleScm: {
      var95: 142000000,
      cvar95: 218000000,
      solvencyMonths: 14.2,
      driftPercent: 0.00,
    },
  },
  {
    id: "gcp-1",
    aipNumber: "AIP-GCP",
    title: "Gaming Catalyst Program (GCP) 2-Year Studio Grants",
    category: "GRANTS",
    amountArb: "225,000,000 ARB (~$190M)",
    summary: "Establish a dedicated 2-year program to fund game studios, publishers, and infrastructure builders deploying on Arbitrum One, Nova, and custom Orbit chains.",
    proposer: "Arbitrum Gaming Working Group",
    status: "ACTIVE_DELIBERATION",
    cfoBaseline: "Structured tranches with KPI milestone releases protect treasury runway. Capital lockup yields modest downside risk with high potential multiplier on Arbitrum Nova gas velocity and sequencer fees.",
    legalBaseline: "Grant agreements must include explicit clawback covenants and intellectual property warrants. Structured oversight committee satisfies DGCL § 141 prudent business judgment rule.",
    securityBaseline: "Disbursements must be programmatic through smart escrow contracts linked to Orbit chain testnet/mainnet launch telemetry to prevent ghost studio capital extraction.",
    defaultRuinProbability: 14,
    defaultConsensusScore: 88,
    sampleScm: {
      var95: 32000000,
      cvar95: 48000000,
      solvencyMonths: 36.8,
      driftPercent: 0.00,
    },
  },
  {
    id: "ltipp-2",
    aipNumber: "AIP-LTIPP",
    title: "Long-Term Incentive Program for Arbitrum DEX Liquidity",
    category: "DEFI_LIQUIDITY",
    amountArb: "45,000,000 ARB (~$40M)",
    summary: "Inject 45M ARB liquidity incentives across Arbitrum decentralized exchanges (Camelot, Uniswap v3, GMX) to preserve sub-cent slippage and deep market depth.",
    proposer: "DeFi Research Consortium",
    status: "ACTIVE_DELIBERATION",
    cfoBaseline: "High-velocity liquidity incentives suffer from 60-70% mercenary capital leakage upon incentive expiration. Requires dynamic yield decay and LP lock-up bonuses.",
    legalBaseline: "Distribution models are compliant with regulatory safe harbors for protocol decentralization. No direct yield promissory commitments detected.",
    securityBaseline: "Pool contracts and gauge controllers must undergo formal verification to eliminate sandwich attacks and flash-loan reward drain exploits.",
    defaultRuinProbability: 24,
    defaultConsensusScore: 76,
    sampleScm: {
      var95: 18500000,
      cvar95: 29000000,
      solvencyMonths: 28.4,
      driftPercent: 0.00,
    },
  },
];