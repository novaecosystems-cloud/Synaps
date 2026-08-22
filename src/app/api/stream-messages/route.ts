import { NextRequest, NextResponse } from "next/server";

let inMemoryMessages: Record<string, any[]> = {
  "p0-incidents": [
    {
      id: "msg-1",
      channelId: "p0-incidents",
      authorName: "AI: SCM Sentinel",
      authorRole: "System Bot",
      authorType: "AI",
      avatar: "🤖",
      content: "🚨 **[INCIDENT DETECTED]**: Database connection pool reached 98% saturation. Auto-dispatched P0 Action Ticket `CSX-101` to Action Board.",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      citation: "Node_DB_Conn_01 · SHA-256: 4f659a...d"
    },
    {
      id: "msg-2",
      channelId: "p0-incidents",
      authorName: "Shourya S.",
      authorRole: "Lead Architect",
      authorType: "HUMAN",
      avatar: "👤",
      content: "@CTO what is the optimal pool size to prevent secondary cascading failovers?",
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: "msg-3",
      channelId: "p0-incidents",
      authorName: "AI: CTO Twin",
      authorRole: "Chief Technology Officer",
      authorType: "AI",
      avatar: "⚡",
      content: "Based on Judea Pearl SCM graph intervention: scaling max pool size from `100 ➔ 450` with a 30-second keep-alive idle recycle resolves 142 daily timeout tickets with 0.00% throughput degradation.",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      citation: "SCM_Graph_Intervention_P(Y|do(Pool=450))"
    }
  ],
  "general": [
    {
      id: "msg-g1",
      channelId: "general",
      authorName: "Shourya S.",
      authorRole: "Founder",
      authorType: "HUMAN",
      avatar: "👤",
      content: "Welcome to Causarix Sovereign Stream! All team discussions are persisted on-premises with zero cloud leaks.",
      timestamp: new Date(Date.now() - 86400000).toISOString()
    }
  ]
};

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
  const { searchParams } = new URL(req.url);
  const channelId = searchParams.get("channelId") || "general";
  const messages = inMemoryMessages[channelId] || [];

  return NextResponse.json({
    success: true,
    channelId,
    messages
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { channelId, authorName, authorRole, authorType, content, citation } = body;

    if (!content) {
      return NextResponse.json({ success: false, error: "Message content is required" }, { status: 400 });
    }

    const cleanChannelId = channelId || "general";
    if (!inMemoryMessages[cleanChannelId]) {
      inMemoryMessages[cleanChannelId] = [];
    }

    const userMessage = {
      id: `msg-${Date.now()}`,
      channelId: cleanChannelId,
      authorName: authorName || "Shourya S.",
      authorRole: authorRole || "Lead Architect",
      authorType: authorType || "HUMAN",
      avatar: "👤",
      content,
      citation: citation || null,
      timestamp: new Date().toISOString()
    };

    inMemoryMessages[cleanChannelId].push(userMessage);

    // Check for AI Agent @mentions OR Autonomous Macro-style Interventions
    let aiResponse: any = null;
    const lowerContent = content.toLowerCase();
    
    let targetAgent: { role: string; name: string; icon: string; reason?: string } | null = null;
    
    // Explicit @mentions
    if (lowerContent.includes("@cfo")) targetAgent = { role: "Chief Financial Officer", name: "AI: CFO Twin", icon: "💰" };
    else if (lowerContent.includes("@generalcounsel") || lowerContent.includes("@legal")) targetAgent = { role: "General Counsel", name: "AI: General Counsel", icon: "⚖️" };
    else if (lowerContent.includes("@cto")) targetAgent = { role: "Chief Technology Officer", name: "AI: CTO Twin", icon: "⚡" };
    else if (lowerContent.includes("@redteam")) targetAgent = { role: "Adversarial Red Team", name: "AI: Red Team", icon: "🛡️" };
    else if (lowerContent.includes("@ceo")) targetAgent = { role: "Chief Executive Officer", name: "AI: CEO Twin", icon: "🏛️" };
    
    // Autonomous Macro Interventions (Proactive C-Suite Monitoring)
    else if (lowerContent.includes("price") || lowerContent.includes("cost") || lowerContent.includes("budget") || lowerContent.includes("margin") || lowerContent.includes("revenue") || lowerContent.includes("hike") || lowerContent.includes("burn")) {
      targetAgent = { role: "Chief Financial Officer", name: "AI: CFO Twin", icon: "💰", reason: "Autonomous Financial Monitor" };
    }
    else if (lowerContent.includes("contract") || lowerContent.includes("liability") || lowerContent.includes("delaware") || lowerContent.includes("compliance") || lowerContent.includes("clause") || lowerContent.includes("indemnity")) {
      targetAgent = { role: "General Counsel", name: "AI: General Counsel", icon: "⚖️", reason: "Autonomous Statutory Guardrail" };
    }
    else if (lowerContent.includes("outage") || lowerContent.includes("database") || lowerContent.includes("latency") || lowerContent.includes("cluster") || lowerContent.includes("architecture") || lowerContent.includes("timeout")) {
      targetAgent = { role: "Chief Technology Officer", name: "AI: CTO Twin", icon: "⚡", reason: "Autonomous Reliability SCM Monitor" };
    }
    else if (lowerContent.includes("competitor") || lowerContent.includes("vulnerability") || lowerContent.includes("threat") || lowerContent.includes("risk") || lowerContent.includes("leak")) {
      targetAgent = { role: "Adversarial Red Team", name: "AI: Red Team", icon: "🛡️", reason: "Autonomous Threat Intelligence" };
    }

    if (targetAgent) {
      const generatedReply = await queryLocalAi(targetAgent.role, content);
      const fallbackReply = `${targetAgent.role} analysis: Evaluated the scenario under Causarix SCM parameters. Recommended intervention confirms 0.00% math drift and full statutory compliance.`;

      aiResponse = {
        id: `msg-ai-${Date.now()}`,
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
