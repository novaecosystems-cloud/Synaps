import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getRateLimitKey,
  rateLimitResponse,
  readBodyWithLimit,
  safeErrorResponse,
} from "@/lib/security";
import { inspectPrompt, inspectResponse } from "@/lib/ai-firewall";

import { invokeLLMWithFallback } from "@/lib/llm-router";

// ── In-memory store — starts 100% EMPTY for all channels.
// ZERO hardcoded seed messages — users start with a clean, blank channel.
let inMemoryMessages: Record<string, any[]> = {};

// ── Content length guard: 4 KB max per message ───────────────────────────────
const MAX_MESSAGE_BYTES = 4 * 1024;

async function queryAgentReply(agentRole: string, userPrompt: string, channelName: string): Promise<string> {
  try {
    const systemPrompt = `You are the ${agentRole} in the Causarix Enterprise C-Suite Boardroom.
You are replying to a live team stream message in the #${channelName} channel.
Provide a sharp, direct, professional executive response grounded in real analysis. If the user asks to analyze documents and none are attached, inform them to upload documents to the Document Vault.`;

    const reply = await invokeLLMWithFallback([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]);

    return reply.trim();
  } catch (err: any) {
    return `${agentRole} received your inquiry: "${userPrompt.slice(0, 80)}". (AI Generation offline: ${err.message || 'LLM provider unreachable'}).`;
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

    // ── AI FIREWALL: INGRESS INSPECTION ────────────────────────────────────
    const ingressCheck = inspectPrompt(safeContent);
    if (!ingressCheck.isAllowed) {
      return NextResponse.json({
        success: false,
        error: `[Causarix AI Firewall]: Message rejected. Reason: ${ingressCheck.flaggedReasons.join('; ')}`,
        flaggedReasons: ingressCheck.flaggedReasons,
        riskLevel: ingressCheck.riskLevel
      }, { status: 400 });
    }

    const cleanContent = ingressCheck.sanitizedPrompt || safeContent;

    const userMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      channelId: cleanChannelId,
      authorName: (authorName || "Team Member").slice(0, 80),
      authorRole: (authorRole || "Member").slice(0, 80),
      authorType: authorType === "AI" ? "AI" : "HUMAN",
      avatar: "👤",
      content: cleanContent,
      citation: citation ? String(citation).slice(0, 200) : null,
      timestamp: new Date().toISOString()
    };

    inMemoryMessages[cleanChannelId].push(userMessage);

    // ── AI Agent @mentions OR Autonomous Macro-style Interventions ─────────────
    let aiResponse: any = null;
    const lowerContent = cleanContent.toLowerCase();

    let targetAgent: { role: string; name: string; icon: string; reason?: string } | null = null;

    // Explicit AI Agent @mentions
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

    if (targetAgent) {
      const generatedReply = await queryAgentReply(targetAgent.role, cleanContent, cleanChannelId);
      
      // Egress Inspection: Sanitize secrets & HTML before posting AI reply
      const egressCheck = inspectResponse(generatedReply);

      aiResponse = {
        id: `msg-ai-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        channelId: cleanChannelId,
        authorName: targetAgent.name,
        authorRole: targetAgent.role,
        authorType: "AI",
        avatar: targetAgent.icon,
        content: egressCheck.sanitizedOutput,
        citation: "Causarix Live LLM Deliberation",
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
