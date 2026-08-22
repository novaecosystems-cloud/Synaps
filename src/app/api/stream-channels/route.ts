import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getRateLimitKey,
  rateLimitResponse,
  readBodyWithLimit,
  safeErrorResponse,
} from "@/lib/security";

// ── Default channels — starts with only #general. No hardcoded mock channels.
let inMemoryChannels: any[] = [
  {
    id: "general",
    name: "general",
    description: "General workspace discussion and AI executive collaboration.",
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
