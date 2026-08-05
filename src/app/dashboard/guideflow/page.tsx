'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus, Play, Eye, Share2, Sparkles, Upload, Monitor, Apple,
  FileCode, ChevronRight, CheckCircle2, ArrowRight, Settings, Users,
  BarChart3, Code, Copy, Check, MousePointer, HelpCircle, Layers, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function GuideflowStudioPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'preview' | 'analytics' | 'leads' | 'visitors'>('create');
  
  // Steps State
  const [steps, setSteps] = useState([
    {
      id: 'step_1',
      title: '1. Ingest Master Services Agreement',
      description: 'Upload PDF contract file to the Zero-Trust memory vault.',
      hotspot: { x: 45, y: 38, label: 'Upload PDF' }
    },
    {
      id: 'step_2',
      title: '2. Perform Evidenced Clause Search',
      description: 'Query "Find every mention of termination notice window".',
      hotspot: { x: 28, y: 55, label: 'Run Clause Query' }
    },
    {
      id: 'step_3',
      title: '3. Review Evidenced Decision Brief',
      description: 'Inspect line citations on Page 8 Section 8.4 and export report.',
      hotspot: { x: 68, y: 48, label: 'Export Decision Brief' }
    }
  ]);

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [newHotspotLabel, setNewHotspotLabel] = useState('');

  // Add new step
  const handleAddStep = () => {
    const newStep = {
      id: `step_${steps.length + 1}`,
      title: `${steps.length + 1}. New Interactive Action Step`,
      description: 'Click anywhere on the preview frame to set a step hotspot tag.',
      hotspot: { x: 50, y: 50, label: 'Interactive Hotspot' }
    };
    setSteps([...steps, newStep]);
    setActiveStepIndex(steps.length);
  };

  // Click on canvas to reposition hotspot
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const updated = [...steps];
    updated[activeStepIndex].hotspot = {
      x,
      y,
      label: updated[activeStepIndex].hotspot.label || 'Click Here'
    };
    setSteps(updated);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(`<iframe src="https://synaps-one.vercel.app/embed/guideflow/gf_001" width="100%" height="600" frameborder="0"></iframe>`);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#202124] flex flex-col antialiased selection:bg-[#1A73E8] selection:text-white">
      
      {/* ── TOP HEADER TOOLBAR (GUIDEFLOW NAVIGATION) ── */}
      <header className="bg-white border-b border-[#DADCE0] px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-[#1A73E8] flex items-center justify-center text-white font-bold text-sm">
            G
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-[#202124]">SYNAPS Executive Guideflow Builder</h1>
            <span className="text-[10px] font-mono text-[#5F6368]">Interactive Product Walkthrough Studio</span>
          </div>
        </div>

        {/* Center Mode Tabs */}
        <div className="flex items-center gap-1 bg-[#F1F3F4] p-1 rounded-xl">
          {[
            { id: 'create', label: 'Create' },
            { id: 'preview', label: 'Preview' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'leads', label: 'Leads (184)' },
            { id: 'visitors', label: 'Visitors' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                activeTab === tab.id
                  ? "bg-white text-[#1A73E8] shadow-sm"
                  : "text-[#5F6368] hover:text-[#202124]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E8F0FE] text-[#1A73E8] text-xs font-bold hover:bg-[#D2E3FC] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Improve with AI
          </button>
          <button
            onClick={handleCopyEmbed}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-bold transition-all shadow-md shadow-[#1A73E8]/20"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copiedEmbed ? 'Copied Embed!' : 'Share Guideflow'}
          </button>
        </div>
      </header>

      {/* ── MAIN STUDIO BODY ── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR: STEPS LIST */}
        <aside className="w-72 bg-white border-r border-[#DADCE0] p-4 flex flex-col gap-4">
          <button
            onClick={handleAddStep}
            className="w-full py-2.5 rounded-xl border border-dashed border-[#1A73E8] text-[#1A73E8] hover:bg-[#E8F0FE] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add step
          </button>

          <div className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider px-1">
            Walkthrough Sequence ({steps.length} Steps)
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className={cn(
                  "p-3 rounded-xl border transition-all cursor-pointer text-left space-y-1.5",
                  activeStepIndex === idx
                    ? "bg-[#E8F0FE]/50 border-[#1A73E8] shadow-sm"
                    : "bg-[#F8F9FA] border-[#DADCE0] hover:bg-white"
                )}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#202124]">
                  <span className="truncate">{step.title}</span>
                  <span className="text-[10px] font-mono text-[#1A73E8] bg-white px-1.5 py-0.5 rounded border border-[#D2E3FC]">
                    #{idx + 1}
                  </span>
                </div>
                <p className="text-[11px] text-[#5F6368] line-clamp-2 leading-relaxed">
                  {step.description}
                </p>
                <div className="text-[10px] font-mono text-[#34A853] font-bold flex items-center gap-1 pt-1">
                  <MousePointer className="w-3 h-3" />
                  Hotspot: ({step.hotspot.x}%, {step.hotspot.y}%)
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* CENTER WORKSPACE / CANVAS */}
        <main className="flex-1 bg-[#F1F3F4] p-8 overflow-y-auto flex flex-col items-center justify-center relative">
          
          {/* TAB 1: CREATE BUILDER */}
          {activeTab === 'create' && (
            <div className="w-full max-w-4xl space-y-6 text-center">
              
              {/* Interactive Frame Stage */}
              <div className="bg-white rounded-2xl border border-[#DADCE0] shadow-xl overflow-hidden text-left relative">
                
                {/* Simulated Browser Bar */}
                <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-[#DADCE0] flex items-center justify-between text-xs text-[#5F6368]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="text-xs font-mono font-bold text-[#202124] ml-2">My Guideflow — {steps[activeStepIndex].title}</span>
                  </div>
                  <span className="text-[10px] font-mono bg-[#E8F0FE] text-[#1A73E8] px-2 py-0.5 rounded font-bold">
                    STEP {activeStepIndex + 1} OF {steps.length}
                  </span>
                </div>

                {/* Interactive Clickable Canvas */}
                <div
                  onClick={handleCanvasClick}
                  className="relative min-h-[420px] bg-[#FAF9F6] p-8 cursor-crosshair flex flex-col items-center justify-center text-center space-y-6 select-none"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8] mx-auto shadow-sm">
                    <Plus className="w-8 h-8" />
                  </div>

                  <div className="max-w-md space-y-2">
                    <h3 className="text-xl font-extrabold text-[#202124]">
                      Add an actionable step
                    </h3>
                    <p className="text-xs text-[#5F6368]">
                      Click anywhere on this canvas to position the interactive step callout hotspot.
                    </p>
                  </div>

                  {/* Hotspot Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsCapturing(true); }}
                      className="px-5 py-2.5 rounded-xl bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-bold flex items-center gap-2 shadow-md"
                    >
                      <MousePointer className="w-4 h-4" />
                      Capture new flow
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); }}
                      className="px-4 py-2.5 rounded-xl bg-white border border-[#DADCE0] hover:bg-[#F8F9FA] text-xs font-bold text-[#202124] flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4 text-[#5F6368]" />
                      Upload new media
                    </button>
                    <button className="px-3.5 py-2.5 rounded-xl bg-white border border-[#DADCE0] text-xs font-bold text-[#5F6368] flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5" /> Windows App
                    </button>
                    <button className="px-3.5 py-2.5 rounded-xl bg-white border border-[#DADCE0] text-xs font-bold text-[#5F6368] flex items-center gap-1.5">
                      <Apple className="w-3.5 h-3.5" /> MacOS App
                    </button>
                    <button className="px-3.5 py-2.5 rounded-xl bg-white border border-[#DADCE0] text-xs font-bold text-[#5F6368] flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5" /> Figma Plugin
                    </button>
                  </div>

                  {/* Rendered Interactive Hotspot Tag on Canvas */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${steps[activeStepIndex].hotspot.x}%`,
                      top: `${steps[activeStepIndex].hotspot.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A73E8] text-white text-xs font-bold shadow-2xl animate-bounce"
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    {steps[activeStepIndex].hotspot.label || 'Click Here'}
                  </div>
                </div>
              </div>

              {/* Step Editor Inputs */}
              <div className="bg-white rounded-2xl border border-[#DADCE0] p-6 text-left space-y-4 shadow-sm">
                <h4 className="text-xs font-bold text-[#5F6368] uppercase tracking-wider">Step Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202124]">Step Title</label>
                    <input
                      type="text"
                      value={steps[activeStepIndex].title}
                      onChange={(e) => {
                        const updated = [...steps];
                        updated[activeStepIndex].title = e.target.value;
                        setSteps(updated);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F8F9FA] border border-[#DADCE0] text-xs text-[#202124] font-medium focus:outline-none focus:border-[#1A73E8]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202124]">Hotspot Callout Label</label>
                    <input
                      type="text"
                      value={steps[activeStepIndex].hotspot.label}
                      onChange={(e) => {
                        const updated = [...steps];
                        updated[activeStepIndex].hotspot.label = e.target.value;
                        setSteps(updated);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F8F9FA] border border-[#DADCE0] text-xs text-[#202124] font-medium focus:outline-none focus:border-[#1A73E8]"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PREVIEW MODE */}
          {activeTab === 'preview' && (
            <div className="w-full max-w-3xl bg-white rounded-3xl border border-[#DADCE0] p-8 shadow-2xl space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-[#F1F3F4] pb-4">
                <span className="text-xs font-bold text-[#1A73E8] uppercase tracking-wider">INTERACTIVE DEMO PREVIEW</span>
                <span className="text-xs text-[#5F6368] font-mono">Step {activeStepIndex + 1} of {steps.length}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#202124]">{steps[activeStepIndex].title}</h2>
              <p className="text-sm text-[#5F6368] leading-relaxed">{steps[activeStepIndex].description}</p>
              
              <div className="p-6 rounded-2xl bg-[#E8F0FE] border border-[#D2E3FC] flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A73E8]">Click the hotspot on the demo to proceed</span>
                <button
                  onClick={() => setActiveStepIndex((activeStepIndex + 1) % steps.length)}
                  className="px-5 py-2 rounded-xl bg-[#1A73E8] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  Next Step <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="w-full max-w-4xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="p-6 rounded-2xl bg-white border border-[#DADCE0] space-y-1 shadow-sm">
                  <span className="text-xs font-bold text-[#5F6368]">Total Walkthrough Views</span>
                  <div className="text-3xl font-extrabold text-[#1A73E8]">1,420</div>
                  <span className="text-[10px] text-[#34A853] font-bold">▲ +24% this week</span>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-[#DADCE0] space-y-1 shadow-sm">
                  <span className="text-xs font-bold text-[#5F6368]">Leads Captured</span>
                  <div className="text-3xl font-extrabold text-[#34A853]">184</div>
                  <span className="text-[10px] text-[#5F6368] font-medium">13.0% Conversion Rate</span>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-[#DADCE0] space-y-1 shadow-sm">
                  <span className="text-xs font-bold text-[#5F6368]">Average Completion Rate</span>
                  <div className="text-3xl font-extrabold text-[#202124]">78.4%</div>
                  <span className="text-[10px] text-[#1A73E8] font-bold">High Engagement</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEADS */}
          {activeTab === 'leads' && (
            <div className="w-full max-w-4xl bg-white rounded-2xl border border-[#DADCE0] overflow-hidden text-left shadow-sm">
              <div className="p-4 border-b border-[#DADCE0] bg-[#F8F9FA] text-xs font-bold text-[#202124]">
                Captured Demo Leads (184 Submissions)
              </div>
              <div className="divide-y divide-[#F1F3F4] text-xs text-[#202124]">
                {[
                  { name: 'Sarah Jenkins', email: 'sarah@apexhotels.com', company: 'Apex Hotels Group', date: '10 mins ago' },
                  { name: 'David Miller', email: 'dmiller@vertexcorp.io', company: 'Vertex Systems', date: '1 hour ago' },
                  { name: 'Anita Rao', email: 'anita.rao@fortishealth.in', company: 'Fortis Healthcare', date: '3 hours ago' }
                ].map((lead, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-[#F8F9FA]">
                    <div>
                      <span className="font-bold block">{lead.name}</span>
                      <span className="text-[#5F6368]">{lead.email} · {lead.company}</span>
                    </div>
                    <span className="text-xs text-[#5F6368] font-mono">{lead.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* AI ASSISTANT MODAL */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#DADCE0] p-6 max-w-md w-full space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1A73E8] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#1A73E8]" /> AI Walkthrough Optimization
              </span>
              <button onClick={() => setShowAIModal(false)} className="text-[#5F6368] hover:text-[#202124]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#5F6368] leading-relaxed">
              SYNAPS AI analyzed your walkthrough sequence and suggests adding a Lead Capture Gate right after Step 2 to boost conversions by +32%.
            </p>
            <button
              onClick={() => setShowAIModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#1A73E8] text-white text-xs font-bold shadow-md"
            >
              Apply AI Optimization
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
