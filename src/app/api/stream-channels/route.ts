import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getRateLimitKey,
  rateLimitResponse,
  readBodyWithLimit,
  safeErrorResponse,
} from "@/lib/security";

// ── Default channels — no fake memberCount or fabricated unreadCount ──────────
// memberCount/unreadCount start at 0; clients compute real values from DB if needed.
let inMemoryChannels: any[] = [
  {
    id: "general",
    name: "general",
    description: "Company-wide executive strategy and operations.",
    isPrivate: false,
    memberCount: 0,
    unreadCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p0-incidents",
    name: "p0-incidents",
    description: "Emergency operational blockers and SLA risk triage.",
    isPrivate: false,
    memberCount: 0,
    unreadCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "boardroom-deliberation",
    name: "boardroom-deliberation",
    description: "Dialectic deliberation arena for the Causarix AI board.",
    isPrivate: false,
    memberCount: 0,
    unreadCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "financial-reviews",
    name: "financial-reviews",
    description: "CFO cash runway hedging and EBITDA modeling.",
    isPrivate: false,
    memberCount: 0,
    unreadCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "legal-statutory",
    name: "legal-statutory",
    description: "General Counsel contract redlines and compliance.",
    isPrivate: false,
    memberCount: 0,
    unreadCount: 0,
    createdAt: new Date().toISOString(),
  },
];

// Prevent unbounded memory growth: max 200 channels
const MAX_CHANNELS = 200;

export async function GET(req: NextRequest) {
  // Rate limit: max 60 reads per IP per minute
  const ip = getRateLimitKey(req);
  if (!checkRateLimit(`channels-read:${ip}`, 60, 60_000)) {
    return rateLimitResponse(10);
  }

  return NextResponse.json({ success: true, channels: inMemoryChannels });
}

export async function POST(req: NextRequest) {
  // Rate limit: max 10 new channels per IP per hour
  const ip = getRateLimitKey(req);
  if (!checkRateLimit(`channels-create:${ip}`, 10, 3_600_000)) {
    return rateLimitResponse(3600);
  }

  // Memory guard
  if (inMemoryChannels.length >= MAX_CHANNELS) {
    return NextResponse.json(
      { success: false, error: "Maximum number of channels reached." },
      { status: 429 }
    );
  }

  // RUDY body protection (512 bytes max — just a name + description)
  const { body, error: bodyError } = await readBodyWithLimit(req, 512);
  if (bodyError || !body) {
    return NextResponse.json({ success: false, error: bodyError || "Invalid request body." }, { status: 400 });
  }

  try {
    const { name, description, isPrivate } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Channel name is required." }, { status: 400 });
    }

    // Sanitize: alphanumeric and dashes only, max 64 chars
    const cleanName = name.toLowerCase().replace(/[^a-z0-9-_]/g, "-").slice(0, 64);
    const cleanDescription = description
      ? String(description).replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, 200)
      : "Channel created via Causarix Stream.";

    // Deduplicate
    if (inMemoryChannels.find((c) => c.id === cleanName)) {
      return NextResponse.json({ success: false, error: "A channel with this name already exists." }, { status: 409 });
    }

    const newChannel = {
      id: cleanName,
      name: cleanName,
      description: cleanDescription,
      isPrivate: !!isPrivate,
      memberCount: 0,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
    };

    inMemoryChannels.push(newChannel);
    return NextResponse.json({ success: true, channel: newChannel });
  } catch (error: any) {
    console.error("[Stream Channels Error]:", error);
    return safeErrorResponse(error, "Failed to create channel.");
  }
}
