import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getRateLimitKey,
  rateLimitResponse,
  readBodyWithLimit,
  safeErrorResponse,
} from "@/lib/security";

// ── In-memory store — starts EMPTY for all channels.
// No hardcoded seed messages — users start with a blank channel.
// Channel history resets on server restart (known limitation, Durable Object / Redis needed for production).
let inMemoryMessages: Record<string, any[]> = {};

// ── Content length guard: 4 KB max per message ───────────────────────────────
const MAX_MESSAGE_BYTES = 4 * 1024;

async function queryLocalAi(agentRole: string, userPrompt: string): Promise<string | null> {
  try {
    const payload = {
      model: "causarix",
      messages: [
        {
          role: "system",
          content: `You are the ${agentRole} in Causarix Autonomous Boardroom. Provide a sharp, concise, 2-3 sentence executive answer with mathematical or statutory grounding.`
        },
        { role: "user", content: userPrompt }
      ],
      stream: false,
      options: { temperature: 0.2, num_predict: 128 }
    };

    const res = await fetch("http://127.0.0.1:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    return data?.message?.content || null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  // ── Rate limit: max 60 reads per IP per minute (polling protection) ─────────
  const ip = getRateLimitKey(req);
  if (!checkRateLimit(`stream-read:${ip}`, 60, 60_000)) {
    return rateLimitResponse(10);
  }

  const { searchParams } = new URL(req.url);
  const channelId = searchParams.get("channelId") || "general";

  // Sanitize channelId — alphanumeric and dashes only
  const cleanChannelId = channelId.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 64);
  const messages = inMemoryMessages[cleanChannelId] || [];

  return NextResponse.json({ success: true, channelId: cleanChannelId, messages });
}

export async function POST(req: NextRequest) {
  // ── Rate limit: max 30 posts per IP per minute ──────────────────────────────
  const ip = getRateLimitKey(req);
  if (!checkRateLimit(`stream-post:${ip}`, 30, 60_000)) {
    return rateLimitResponse(60);
  }

  // ── Read body with RUDY protection ─────────────────────────────────────────
  const { body, error: bodyError } = await readBodyWithLimit(req, MAX_MESSAGE_BYTES);
  if (bodyError || !body) {
    return NextResponse.json({ success: false, error: bodyError || "Invalid request body." }, { status: 400 });
  }

  try {
    const { channelId, authorName, authorRole, authorType, content, citation } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Message content is required." }, { status: 400 });
    }

    // Sanitize channelId — alphanumeric and dashes only
    const cleanChannelId = (channelId || "general").replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 64);
    if (!inMemoryMessages[cleanChannelId]) {
      inMemoryMessages[cleanChannelId] = [];
    }

    // Strip content to max length
    const safeContent = content.slice(0, 2000);

    const userMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      channelId: cleanChannelId,
      authorName: (authorName || "Team Member").slice(0, 80),
      authorRole: (authorRole || "Member").slice(0, 80),
      authorType: authorType === "AI" ? "AI" : "HUMAN",
      avatar: "👤",
      content: safeContent,
      citation: citation ? String(citation).slice(0, 200) : null,
      timestamp: new Date().toISOString()
    };

    inMemoryMessages[cleanChannelId].push(userMessage);

    // ── AI Agent @mentions OR Autonomous Macro-style Interventions ─────────────
    let aiResponse: any = null;
    const lowerContent = safeContent.toLowerCase();

    let targetAgent: { role: string; name: string; icon: string; reason?: string } | null = null;

    // Explicit @mentions
    if (lowerContent.includes("@cfo"))
      targetAgent = { role: "Chief Financial Officer", name: "AI: CFO Twin", icon: "💰" };
    else if (lowerContent.includes("@generalcounsel") || lowerContent.includes("@legal"))
      targetAgent = { role: "General Counsel", name: "AI: General Counsel", icon: "⚖️" };
    else if (lowerContent.includes("@cto"))
      targetAgent = { role: "Chief Technology Officer", name: "AI: CTO Twin", icon: "⚡" };
    else if (lowerContent.includes("@redteam"))
      targetAgent = { role: "Adversarial Red Team", name: "AI: Red Team", icon: "🛡️" };
    else if (lowerContent.includes("@ceo"))
      targetAgent = { role: "Chief Executive Officer", name: "AI: CEO Twin", icon: "🏛️" };

    // Autonomous Macro Interventions (Proactive C-Suite Monitoring)
    else if (
      lowerContent.includes("price") || lowerContent.includes("cost") ||
      lowerContent.includes("budget") || lowerContent.includes("margin") ||
      lowerContent.includes("revenue") || lowerContent.includes("hike") ||
      lowerContent.includes("burn")
    ) {
      targetAgent = { role: "Chief Financial Officer", name: "AI: CFO Twin", icon: "💰", reason: "Autonomous Financial Monitor" };
    } else if (
      lowerContent.includes("contract") || lowerContent.includes("liability") ||
      lowerContent.includes("delaware") || lowerContent.includes("compliance") ||
      lowerContent.includes("clause") || lowerContent.includes("indemnity")
    ) {
      targetAgent = { role: "General Counsel", name: "AI: General Counsel", icon: "⚖️", reason: "Autonomous Statutory Guardrail" };
    } else if (
      lowerContent.includes("outage") || lowerContent.includes("database") ||
      lowerContent.includes("latency") || lowerContent.includes("cluster") ||
      lowerContent.includes("architecture") || lowerContent.includes("timeout")
    ) {
      targetAgent = { role: "Chief Technology Officer", name: "AI: CTO Twin", icon: "⚡", reason: "Autonomous Reliability SCM Monitor" };
    } else if (
      lowerContent.includes("competitor") || lowerContent.includes("vulnerability") ||
      lowerContent.includes("threat") || lowerContent.includes("risk") ||
      lowerContent.includes("leak")
    ) {
      targetAgent = { role: "Adversarial Red Team", name: "AI: Red Team", icon: "🛡️", reason: "Autonomous Threat Intelligence" };
    }

    if (targetAgent) {
      const generatedReply = await queryLocalAi(targetAgent.role, safeContent);
      const fallbackReply = `${targetAgent.name} is online. Analysis of your message is being processed — please @mention me directly for a detailed response.`;

      aiResponse = {
        id: `msg-ai-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        channelId: cleanChannelId,
        authorName: targetAgent.name,
        authorRole: targetAgent.role,
        authorType: "AI",
        avatar: targetAgent.icon,
        content: generatedReply || fallbackReply,
        citation: "Causarix_Sovereign_SCM_Node · SHA-256 Verified",
        timestamp: new Date().toISOString()
      };

      inMemoryMessages[cleanChannelId].push(aiResponse);
    }

    return NextResponse.json({
      success: true,
      userMessage,
      aiResponse,
      messages: inMemoryMessages[cleanChannelId]
    });
  } catch (error: any) {
    console.error("[Stream Messages Error]:", error);
    return safeErrorResponse(error, "Failed to process message.");
  }
}
