"use client";

import React from "react";
import { Activity, Clock, Zap, MessageCircle } from "lucide-react";

export default function LLMOpsMonitorPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">LLMOps Monitoring</h1>
        <p className="text-slate-500 mt-1">Track token usage, cost, latency, and conversation logs across all your AI applications.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Total Tokens (Today)</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">145k</div>
          <div className="text-xs text-emerald-600 mt-1">+12% from yesterday</div>
        </div>

        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Avg Latency</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">850ms</div>
          <div className="text-xs text-emerald-600 mt-1">-50ms from yesterday</div>
        </div>

        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Conversations</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">1,204</div>
        </div>

        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">Est. Cost</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">$4.35</div>
        </div>
      </div>

      {/* Log Table Mock */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50">
          <h3 className="font-semibold text-slate-800">Recent Executions</h3>
        </div>
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3">Timestamp</th>
              <th className="px-6 py-3">Agent / Workflow</th>
              <th className="px-6 py-3">Tokens</th>
              <th className="px-6 py-3">Latency</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b hover:bg-slate-50">
              <td className="px-6 py-4 font-mono text-xs">2026-07-20 10:45:12</td>
              <td className="px-6 py-4 font-medium text-slate-900">Compliance Assistant</td>
              <td className="px-6 py-4">4,520</td>
              <td className="px-6 py-4">1.2s</td>
              <td className="px-6 py-4"><span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-semibold">SUCCESS</span></td>
            </tr>
            <tr className="bg-white border-b hover:bg-slate-50">
              <td className="px-6 py-4 font-mono text-xs">2026-07-20 10:41:05</td>
              <td className="px-6 py-4 font-medium text-slate-900">Document Ingestion Pipeline</td>
              <td className="px-6 py-4">12,100</td>
              <td className="px-6 py-4">4.5s</td>
              <td className="px-6 py-4"><span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-semibold">SUCCESS</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
