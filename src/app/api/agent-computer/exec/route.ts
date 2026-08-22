import { NextRequest, NextResponse } from "next/server";
import { executeInAgentSandbox } from "@/lib/agent-sandbox-computer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { source, backend } = body;

    if (!source || typeof source !== "string") {
      return NextResponse.json({ success: false, error: "Source code or command is required." }, { status: 400 });
    }

    const validBackends = ["isolate_js", "scm_python", "isolate_shell"];
    const chosenBackend = validBackends.includes(backend) ? backend : "isolate_js";

    const result = await executeInAgentSandbox(source, chosenBackend);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error("Agent Computer Execution Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Execution failed." }, { status: 500 });
  }
}
