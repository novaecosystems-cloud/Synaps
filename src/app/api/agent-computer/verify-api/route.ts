import { NextRequest, NextResponse } from "next/server";
import { verifyBackendEndpoint, runApiBenchmarkSuite } from "@/lib/e2e-api-verifier";
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
  await resolveAuthContext(req);

  // ── 2. Rate Limit: 30 API verification probes per minute ──────────────────
  const ip = getRateLimitKey(req);
  if (!checkRateLimit(`api-probe:${ip}`, 30, 60_000)) {
    return rateLimitResponse(60);
  }

  // ── 3. Read body with RUDY protection (32 KB max) ─────────────────────────
  const { body, error: bodyError } = await readBodyWithLimit(req, 32 * 1024);
  if (bodyError || !body) {
    return NextResponse.json({ success: false, error: bodyError || "Invalid request body." }, { status: 400 });
  }

  const originUrl = req.nextUrl.origin || "http://localhost:3000";

  try {
    if (Array.isArray(body.probes)) {
      // Batch benchmark mode
      const report = await runApiBenchmarkSuite(
        body.suiteName || "Causarix E2E Backend Verification Suite",
        body.probes,
        originUrl
      );
      return NextResponse.json({ success: true, report });
    } else if (body.endpoint) {
      // Single endpoint probe mode
      const result = await verifyBackendEndpoint(body, originUrl);
      return NextResponse.json({ success: true, result });
    } else {
      return NextResponse.json({
        success: false,
        error: "Provide an 'endpoint' object or 'probes' array to verify."
      }, { status: 400 });
    }
  } catch (err: any) {
    console.error("[E2E Verifier API Error]:", err);
    return safeErrorResponse(err, "Failed to execute backend API verification probe.");
  }
}
