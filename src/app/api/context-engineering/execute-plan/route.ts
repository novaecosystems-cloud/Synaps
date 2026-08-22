import { NextRequest, NextResponse } from "next/server";
import { executeContextPlan, ContextBlueprint } from "@/lib/context-engineering";
import {
  checkRateLimit,
  getRateLimitKey,
  rateLimitResponse,
  readBodyWithLimit,
  resolveAuthContext,
  safeErrorResponse,
} from "@/lib/security";

export async function POST(req: NextRequest) {
  // ── 1. Auth Guard ─────────────────────────────────────────────────────────
  const auth = await resolveAuthContext(req);

  // ── 2. Rate Limit: 10 plan executions per minute ──────────────────────────
  const ip = getRateLimitKey(req);
  if (!checkRateLimit(`exec-plan:${ip}`, 10, 60_000)) {
    return rateLimitResponse(60);
  }

  // ── 3. Read body with RUDY protection (64 KB max) ─────────────────────────
  const { body, error: bodyError } = await readBodyWithLimit(req, 64 * 1024);
  if (bodyError || !body) {
    return NextResponse.json({ success: false, error: bodyError || "Invalid request body." }, { status: 400 });
  }

  const { blueprint, attachedEvidence } = body;

  if (!blueprint || !blueprint.id || !Array.isArray(blueprint.steps)) {
    return NextResponse.json({ success: false, error: "A valid Context Blueprint is required." }, { status: 400 });
  }

  try {
    const report = await executeContextPlan(blueprint as ContextBlueprint, {
      attachedEvidence: Array.isArray(attachedEvidence) ? attachedEvidence : [],
    });

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (err: any) {
    console.error("[Context Plan Execution Error]:", err);
    return safeErrorResponse(err, "Failed to execute context plan.");
  }
}
