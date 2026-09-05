export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { runAutonomousExecutiveReasoning, RiskTolerance } from "@/lib/autonomous-executive-reasoner";
import { internalSyncMesh } from "@/lib/internal-sync-mesh";
import { resolveAuthContext } from "@/lib/security";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CAUSARIX AGI DELIBERATION API ROUTE
 * ─────────────────────────────────────────────────────────────────────────────
 * POST /api/agi/deliberate
 *
 * Payload:
 * {
 *   dilemma: string,
 *   organizationName?: string,
 *   riskTolerance?: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE',
 *   initialCashRunwayMonths?: number
 * }
 *
 * 1. Validates executive dilemma payload.
 * 2. Invokes runAutonomousExecutiveReasoning (MCTS Tree-of-Thought search,
 *    Qwen 2.5 Coder simulation synthesis, and Delaware Merkle tree sealing).
 * 3. Dispatches the winning decision to internalSyncMesh for bi-directional
 *    Jira Kanban task spawning and Slack #boardroom-alerts broadcast.
 * 4. Returns { success: true, data: MctsDeliberationResult }.
 */

export async function POST(req: NextRequest) {
  try {
    let defaultOrgName = "Causarix AI Enterprise";

    // Attempt optional authentication context resolution
    try {
      const auth = await resolveAuthContext(req);
      if (auth.orgId && auth.orgId !== "no_org_fallback") {
        defaultOrgName = auth.orgId;
      }
    } catch {
      // Fallback gracefully for guest / local trial mode
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload in request body." },
        { status: 400 }
      );
    }

    const {
      dilemma,
      organizationName = defaultOrgName,
      riskTolerance = "BALANCED",
      initialCashRunwayMonths = 18,
    } = body || {};

    if (!dilemma || typeof dilemma !== "string" || dilemma.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Dilemma is required and must be a non-empty string.",
        },
        { status: 400 }
      );
    }

    const validRiskTolerances: RiskTolerance[] = ["CONSERVATIVE", "BALANCED", "AGGRESSIVE"];
    const normalizedRisk: RiskTolerance = validRiskTolerances.includes(riskTolerance)
      ? riskTolerance
      : "BALANCED";

    const normalizedRunway = Number.isFinite(Number(initialCashRunwayMonths)) && Number(initialCashRunwayMonths) > 0
      ? Number(initialCashRunwayMonths)
      : 18;

    // 1. Invoke Autonomous Executive Reasoner (Tree-of-Thought MCTS + Qwen 2.5 Coder Simulation)
    const deliberationResult = await runAutonomousExecutiveReasoning({
      dilemma: dilemma.trim(),
      organizationName: (organizationName || defaultOrgName).trim(),
      riskTolerance: normalizedRisk,
      initialCashRunwayMonths: normalizedRunway,
    });

    // 2. Dispatch the winning decision to internalSyncMesh (Jira + Slack + Boardroom bus)
    try {
      await internalSyncMesh({
        origin: "BOARDROOM_QUORUM",
        eventType: "BOARDROOM_DECISION_SEALED",
        timestamp: new Date().toISOString(),
        data: {
          organizationId: deliberationResult.organizationName,
          dilemma: deliberationResult.dilemma,
          resolution: deliberationResult.winningPath.actionSummary,
          title: deliberationResult.executiveResolution.title,
          merkleRootHash: deliberationResult.executiveResolution.merkleRoot,
          state: "ACCEPTED",
          decisionId: deliberationResult.sessionId,
          actionItems: deliberationResult.executiveResolution.actionItems,
          fiduciaryConfidence: deliberationResult.executiveResolution.fiduciaryConfidence,
          quorumScore: "98% Fiduciary Consensus",
        },
      });
    } catch (meshErr) {
      console.warn("[AGI Deliberate API] Non-fatal internalSyncMesh warning:", meshErr);
    }

    // 3. Return canonical MctsDeliberationResult
    return NextResponse.json({
      success: true,
      data: deliberationResult,
    });
  } catch (error: any) {
    console.error("[AGI Deliberate API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error during AGI executive deliberation.",
      },
      { status: 500 }
    );
  }
}
