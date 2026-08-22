import { NextRequest, NextResponse } from "next/server";
import { listVirtualFiles, getVirtualFile, writeVirtualFile, deleteVirtualFile } from "@/lib/agent-sandbox-computer";
import {
  checkRateLimit,
  getRateLimitKey,
  rateLimitResponse,
  readBodyWithLimit,
  resolveAuthContext,
  safeErrorResponse,
} from "@/lib/security";

/** Sanitize virtual FS path — only alphanumeric, dots, underscores, dashes, single forward slash */
function sanitizePath(raw: string): string | null {
  if (!raw || typeof raw !== "string") return null;
  const cleaned = raw.trim().replace(/\\/g, "/");
  // No '..' segments, no leading slash required, max 128 chars
  if (cleaned.includes("..") || cleaned.length > 128) return null;
  // Only safe characters
  if (!/^[a-zA-Z0-9._\-/]+$/.test(cleaned)) return null;
  return cleaned;
}

export async function GET(req: NextRequest) {
  // ── Auth guard ──────────────────────────────────────────────────────────────
  const auth = await resolveAuthContext(req);
  if (auth.isDemo) {
    return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
  }

  // ── Rate limit ──────────────────────────────────────────────────────────────
  const ip = getRateLimitKey(req);
  if (!checkRateLimit(`files-read:${ip}`, 60, 60_000)) {
    return rateLimitResponse(30);
  }

  try {
    const { searchParams } = new URL(req.url);
    const rawPath = searchParams.get("path");

    if (rawPath) {
      const path = sanitizePath(rawPath);
      if (!path) {
        return NextResponse.json({ success: false, error: "Invalid file path." }, { status: 400 });
      }
      const file = getVirtualFile(path);
      if (!file) {
        return NextResponse.json({ success: false, error: "File not found." }, { status: 404 });
      }
      return NextResponse.json({ success: true, file });
    }

    const files = listVirtualFiles();
    return NextResponse.json({ success: true, files });
  } catch (err: any) {
    return safeErrorResponse(err, "Failed to read files.");
  }
}

export async function POST(req: NextRequest) {
  // ── Auth guard ──────────────────────────────────────────────────────────────
  const auth = await resolveAuthContext(req);
  if (auth.isDemo) {
    return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
  }

  // ── Rate limit ──────────────────────────────────────────────────────────────
  const ip = getRateLimitKey(req);
  if (!checkRateLimit(`files-write:${ip}`, 30, 60_000)) {
    return rateLimitResponse(60);
  }

  // ── RUDY + size protection (64 KB max) ─────────────────────────────────────
  const { body, error: bodyError } = await readBodyWithLimit(req, 64 * 1024);
  if (bodyError || !body) {
    return NextResponse.json({ success: false, error: bodyError || "Invalid request body." }, { status: 400 });
  }

  try {
    const { path: rawPath, content, author } = body;

    const path = sanitizePath(rawPath);
    if (!path) {
      return NextResponse.json({ success: false, error: "Invalid file path." }, { status: 400 });
    }
    if (content === undefined) {
      return NextResponse.json({ success: false, error: "Content is required." }, { status: 400 });
    }

    const file = writeVirtualFile(path, content, author || "@User");
    return NextResponse.json({ success: true, file });
  } catch (err: any) {
    return safeErrorResponse(err, "Failed to write file.");
  }
}

export async function DELETE(req: NextRequest) {
  // ── Auth guard ──────────────────────────────────────────────────────────────
  const auth = await resolveAuthContext(req);
  if (auth.isDemo) {
    return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
  }

  // ── Rate limit ──────────────────────────────────────────────────────────────
  const ip = getRateLimitKey(req);
  if (!checkRateLimit(`files-delete:${ip}`, 20, 60_000)) {
    return rateLimitResponse(60);
  }

  try {
    const { searchParams } = new URL(req.url);
    const rawPath = searchParams.get("path");

    const path = sanitizePath(rawPath || "");
    if (!path) {
      return NextResponse.json({ success: false, error: "Invalid file path." }, { status: 400 });
    }

    const deleted = deleteVirtualFile(path);
    return NextResponse.json({ success: true, deleted });
  } catch (err: any) {
    return safeErrorResponse(err, "Failed to delete file.");
  }
}
