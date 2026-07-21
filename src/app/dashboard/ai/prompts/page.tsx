"use client";

import React, { useState } from "react";
import { Save, Variable, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function PromptManagementPage() {
  const [prompt, setPrompt] = useState(
    "You are an expert compliance auditor.\nReview the following extracted document chunk:\n\n{{context}}\n\nIdentify any regulatory gaps."
  );

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="h-14 border-b flex items-center justify-between px-6 shrink-0">
        <h1 className="font-semibold text-slate-800">Prompt Engineering</h1>
        <Button size="sm" className="bg-indigo-600">
          <Save className="w-4 h-4 mr-2" /> Save Template
        </Button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Prompt Editor */}
        <div className="flex-1 border-r p-6 flex flex-col space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              System Prompt
            </h2>
            <p className="text-xs text-slate-500 mb-2">Use {'{{variable_name}}'} to define dynamic inputs.</p>
          </div>
          
          <Textarea 
            className="flex-1 font-mono text-sm leading-relaxed p-4 bg-slate-50 border-slate-200 resize-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        {/* Right: Variable Configuration & Testing */}
        <div className="w-80 bg-slate-50 p-6 flex flex-col">
          <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Variable className="w-4 h-4 text-indigo-500" />
            Detected Variables
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="bg-white p-3 rounded border border-slate-200">
              <label className="text-xs font-semibold text-slate-600 block mb-1">context</label>
              <Textarea 
                placeholder="Enter test value..." 
                className="text-xs min-h-[100px]"
                defaultValue="[TEST] The company handles PII but does not encrypt databases at rest."
              />
            </div>
          </div>

          <Button variant="outline" className="w-full mt-auto bg-white">
            <Play className="w-4 h-4 mr-2 text-emerald-600" /> Run Debug Test
          </Button>
        </div>
      </div>
    </div>
  );
}
