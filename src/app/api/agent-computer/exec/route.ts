import { NextRequest, NextResponse } from "next/server";
import { executeInAgentSandbox } from "@/lib/agent-sandbox-computer";
import {
  checkRateLimit,
  getRateLimitKey,
  rateLimitResponse,
  readBodyWithLimit,
  resolveAuthContext,
  safeErrorResponse,
  validateSandboxSource,
} from "@/lib/security";

export async function POST(req: NextRequest) {
  // ── Auth Guard ────────────────────────────────────────────────────────────
  const auth = await resolveAuthContext(req);
  if (auth.isDemo) {
    return NextResponse.json(
      { success: false, error: "Agent Computer Sandbox requires authentication. Please sign in." },
      { status: 401 }
    );
  }

  // ── Rate Limit: max 20 executions per IP per minute ───────────────────────
  const ip = getRateLimitKey(req);
  if (!checkRateLimit(`exec:${ip}`, 20, 60_000)) {
    return rateLimitResponse(60);
  }

  // ── Read body with RUDY/size protection (16 KB max) ───────────────────────
  const { body, error: bodyError } = await readBodyWithLimit(req, 16 * 1024);
  if (bodyError || !body) {
    return NextResponse.json({ success: false, error: bodyError || "Invalid request body." }, { status: 400 });
  }

  const { source, backend } = body;

  // ── Source code validation ────────────────────────────────────────────────
  const sourceCheck = validateSandboxSource(source);
  if (!sourceCheck.valid) {
    return NextResponse.json({ success: false, error: sourceCheck.error }, { status: 400 });
  }

  const validBackends = ["isolate_js", "scm_python", "isolate_shell"];
  const chosenBackend = validBackends.includes(backend) ? backend : "isolate_js";

  try {
    const result = await executeInAgentSandbox(source, chosenBackend);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error("Agent Computer Execution Error:", err);
    return safeErrorResponse(err, "Sandbox execution failed.");
  }
}
