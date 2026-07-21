"use client";

import React from "react";
import { Bot, Plus, Puzzle, Workflow, BookText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AgentManagementPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Agents</h1>
          <p className="text-slate-500 mt-1">Deploy autonomous assistants powered by your workflows and knowledge base.</p>
        </div>
        <Button className="bg-indigo-600">
          <Plus className="w-4 h-4 mr-2" /> Create Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Agent Card */}
        <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-lg">Compliance Assistant</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm">Edit Config</Button>
          </div>
          
          <p className="text-sm text-slate-600 mb-6">
            Answers questions strictly based on the Corporate Knowledge Base, citing PDF sources.
          </p>

          <div className="mt-auto space-y-2 border-t pt-4">
            <div className="flex items-center text-xs text-slate-500 gap-2">
              <Puzzle className="w-4 h-4 text-slate-400" />
              <span>Model: <strong>GPT-4o (OpenAI)</strong></span>
            </div>
            <div className="flex items-center text-xs text-slate-500 gap-2">
              <BookText className="w-4 h-4 text-slate-400" />
              <span>Knowledge: <strong>Corporate Wiki & Manuals</strong></span>
            </div>
            <div className="flex items-center text-xs text-slate-500 gap-2">
              <Workflow className="w-4 h-4 text-slate-400" />
              <span>Workflow: <strong>Document Ingestion Pipeline</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
