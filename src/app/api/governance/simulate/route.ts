export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prepareArbitrumSeal } from "@/lib/web3-arbitrum-bridge";
import { ARBITRUM_AIP_PRESETS } from "@/data/mock-arbitrum-aips";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { proposalId = "AIP-1", title, description } = body;

    // 1. Match against known AIP preset or build custom evaluation
    const matchingPreset = ARBITRUM_AIP_PRESETS.find(
      (p) => p.id.toLowerCase() === proposalId.toLowerCase() || p.aipNumber.toLowerCase() === proposalId.toLowerCase()
    );

    const activeTitle = title || matchingPreset?.title || "Custom Arbitrum Treasury Allocation";
    const activeDescription = description || matchingPreset?.summary || "Fiduciary stress-test under Delaware DGCL § 141(e)";
    
    // 2. Synthesize 3-Agent Risk Council Deliberations
    const cfoAnalysis = matchingPreset
      ? matchingPreset.cfoBaseline
      : `Capital runway stress-test indicates treasury drawdown risk under secondary market token sell-off. Requires dynamic release tranches.`;

    const legalAnalysis = matchingPreset
      ? matchingPreset.legalBaseline
      : `Discretionary grant approvals without milestone verification violate Delaware DGCL § 141(e) fiduciary duty of care standards.`;

    const securityAnalysis = matchingPreset
      ? matchingPreset.securityBaseline
      : `Protocol contract architecture requires multi-sig timelock escrow and emergency pause hooks to mitigate economic exploits.`;

    const ruinProbability = matchingPreset ? matchingPreset.defaultRuinProbability : 22;
    const consensusScore = matchingPreset ? matchingPreset.defaultConsensusScore : 81;

    // 3. 0.00% Math Drift SCM Parameters
    const scmParams = {
      iterations: 10000,
      driftPercent: 0.00,
      var95: matchingPreset ? matchingPreset.sampleScm.var95 : 24000000,
      cvar95: matchingPreset ? matchingPreset.sampleScm.cvar95 : 36000000,
      seed: `CAUSARIX_ARBITRUM_${Date.now()}`,
    };

    // 4. Compute On-Chain Sealing Package (Keccak-256 Merkle Root & Leaves)
    const sealingPackage = prepareArbitrumSeal({
      proposalId,
      title: activeTitle,
      description: activeDescription,
      cfoAnalysis,
      legalAnalysis,
      securityAnalysis,
      ruinProbability,
      consensusScore,
      scmParams,
    });

    return NextResponse.json({
      success: true,
      proposalId,
      title: activeTitle,
      description: activeDescription,
      council: {
        cfo: {
          agent: "Marcus Sterling (CFO)",
          domain: "Treasury & Capital Liquidity",
          verdict: cfoAnalysis,
        },
        legal: {
          agent: "Victoria Hayes (General Counsel)",
          domain: "DGCL § 141(e) Fiduciary Safe-Harbor",
          verdict: legalAnalysis,
        },
        security: {
          agent: "Elena Rostova (Smart Contract Auditor)",
          domain: "Protocol Security & Exploits",
          verdict: securityAnalysis,
        },
        consensusScore,
      },
      scm: scmParams,
      sealingPackage,
      chain: {
        name: "Arbitrum Sepolia",
        chainId: 421614,
        explorerUrl: sealingPackage.explorerUrl,
        contractAddress: sealingPackage.contractAddress,
        contractExplorerUrl: sealingPackage.contractExplorerUrl,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to simulate proposal" },
      { status: 500 }
    );
  }
}