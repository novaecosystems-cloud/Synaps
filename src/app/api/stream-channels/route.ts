import { NextRequest, NextResponse } from "next/server";

let inMemoryChannels: any[] = [
  {
    id: "p0-incidents",
    name: "p0-incidents",
    description: "Emergency operational blockers, database connection alerts & SLA risk triage.",
    isPrivate: false,
    memberCount: 12,
    unreadCount: 2,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: "general",
    name: "general",
    description: "Company-wide executive strategy and sovereign operations announcements.",
    isPrivate: false,
    memberCount: 18,
    unreadCount: 0,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
  },
  {
    id: "boardroom-deliberation",
    name: "boardroom-deliberation",
    description: "10-Agent dialectic deliberation arena under Delaware DGCL 141.",
    isPrivate: false,
    memberCount: 10,
    unreadCount: 1,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString()
  },
  {
    id: "financial-reviews",
    name: "financial-reviews",
    description: "CFO cash runway hedging, EBITDA modeling & 0.00% math drift verification.",
    isPrivate: false,
    memberCount: 6,
    unreadCount: 0,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: "legal-statutory",
    name: "legal-statutory",
    description: "General Counsel contract redlines, GPLv3 quarantine & Delaware safe-harbor proofs.",
    isPrivate: false,
    memberCount: 5,
    unreadCount: 0,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    channels: inMemoryChannels
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, isPrivate } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Channel name is required" }, { status: 400 });
    }

    const cleanName = name.toLowerCase().replace(/[^a-z0-9-_]/g, "-");
    const newChannel = {
      id: cleanName,
      name: cleanName,
      description: description || "Channel created via Causarix Stream.",
      isPrivate: !!isPrivate,
      memberCount: 1,
      unreadCount: 0,
      createdAt: new Date().toISOString()
    };

    inMemoryChannels.push(newChannel);
    return NextResponse.json({ success: true, channel: newChannel });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
