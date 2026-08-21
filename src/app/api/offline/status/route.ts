import { NextResponse } from "next/server";

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch("http://127.0.0.1:11434/api/tags", {
      signal: controller.signal,
      headers: { "Content-Type": "application/json" }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        success: true,
        online: true,
        models: data.models || [],
        hardware: "Intel Core i3-1315U · D:\\OllamaModels"
      });
    }

    return NextResponse.json({ success: true, online: false, reason: "Ollama not responding" });
  } catch (error: any) {
    return NextResponse.json({ success: true, online: false, reason: error.message });
  }
}
