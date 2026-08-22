import { NextRequest, NextResponse } from "next/server";
import { generateContextBlueprint } from "@/lib/context-engineering";
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

  // ── 2. Rate Limit: 20 plan generations per minute ─────────────────────────
  const ip = getRateLimitKey(req);
  if (!checkRateLimit(`gen-plan:${ip}`, 20, 60_000)) {
    return rateLimitResponse(60);
  }

  // ── 3. Read body with RUDY protection (32 KB max) ─────────────────────────
  const { body, error: bodyError } = await readBodyWithLimit(req, 32 * 1024);
  if (bodyError || !body) {
    return NextResponse.json({ success: false, error: bodyError || "Invalid request body." }, { status: 400 });
  }

  const { requirement, attachedEvidence, organizationName, focusArea } = body;

  if (!requirement || typeof requirement !== "string" || requirement.trim().length === 0) {
    return NextResponse.json({ success: false, error: "A business requirement is required." }, { status: 400 });
  }

  try {
    const blueprint = await generateContextBlueprint(requirement, {
      attachedEvidence: Array.isArray(attachedEvidence) ? attachedEvidence : [],
      organizationName: organizationName || (auth.isDemo ? "Demo Organization" : "Enterprise Organization"),
      focusArea,
    });

    return NextResponse.json({
      success: true,
      blueprint,
    });
  } catch (err: any) {
    console.error("[Context Engineering Error]:", err);
    return safeErrorResponse(err, "Failed to generate context blueprint.");
  }
}
