import React from "react";
import Link from "next/link";
import { Bot, Network, Workflow, Settings2, Activity, Database } from "lucide-react";

export default function AIWorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* AI Workspace Sidebar */}
      <aside className="w-64 border-r bg-white flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            AI Orchestration
          </h2>
          <p className="text-xs text-slate-500 mt-1">Dify-Inspired Abstraction</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard/ai/agents" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors">
            <Bot className="w-4 h-4" /> Agents
          </Link>
          <Link href="/dashboard/ai/prompts" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors">
            <Settings2 className="w-4 h-4" /> Prompt Engineering
          </Link>
          <Link href="/dashboard/ai/workflows" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors">
            <Workflow className="w-4 h-4" /> Workflow Builder
          </Link>
          <Link href="/dashboard/ai/monitor" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors">
            <Activity className="w-4 h-4" /> LLMOps Monitoring
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
