"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Activity, CheckSquare, MessageSquare, ArrowRight, ArrowLeft, Check, X, Play } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CausarixGuidedTourModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      stepNumber: 1,
      badge: "STEP 1 · STRATEGIZE",
      title: "10-Agent Executive Boardroom",
      subtitle: "Your virtual C-suite debating your hardest business decisions.",
      icon: Building2,
      color: "from-purple-500 to-indigo-600",
      accentBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
      description: "When facing a high-stakes decision (e.g. pricing change, expansion, budget cut), 10 specialized AI executives (CEO, CFO, CTO, CMO, General Counsel, Red Team) independently analyze, debate, and reach a consensus score.",
      demoLink: "/dashboard/boardroom",
      demoActionText: "Open Boardroom →",
      highlights: [
        "Adversarial Red Team uncovers hidden blind spots",
        "Weighted consensus score with zero groupthink",
        "1-Click convert consensus into Kanban action tickets"
      ]
    },
    {
      stepNumber: 2,
      badge: "STEP 2 · SIMULATE",
      title: "Counterfactual SCM Simulation Lab",
      subtitle: "Test business decisions before execution with 0.00% math drift.",
      icon: Activity,
      color: "from-cyan-500 to-blue-600",
      accentBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
      description: "Instead of guessing outcomes, Causarix runs Judea Pearl Structural Causal Models and 10,000-iteration Monte Carlo simulations across 10 departments with verified Box-Muller sampling and VaR 95% downside bounds.",
      demoLink: "/dashboard/simulations",
      demoActionText: "Open Simulation Lab →",
      highlights: [
        "Models exact EBITDA and cash runway shifts",
        "10-Department cascading domino impact matrix",
        "Deterministic Python calculations with 0.00% arithmetic drift"
      ]
    },
    {
      stepNumber: 3,
      badge: "STEP 3 · EXECUTE",
      title: "Action Board (Built-in Jira)",
      subtitle: "Board directives auto-converted into prioritized Kanban tasks.",
      icon: CheckSquare,
      color: "from-emerald-500 to-teal-600",
      accentBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      description: "No more copying text out of chatbots. Boardroom consensus directives and simulation levers automatically become assigned P0/P1 Kanban tickets in a high-velocity 5-column action board.",
      demoLink: "/dashboard/projects",
      demoActionText: "Open Action Board →",
      highlights: [
        "P0 Blocker, In Progress, In Review & Done columns",
        "Autonomous assignment to AI Executive Twins or Human team",
        "SHA-256 evidence citations attached to every ticket"
      ]
    },
    {
      stepNumber: 4,
      badge: "STEP 4 · COMMUNICATE",
      title: "Team Stream (Built-in Slack)",
      subtitle: "Real-time incident channels with AI executives on standby.",
      icon: MessageSquare,
      color: "from-pink-500 to-rose-600",
      accentBg: "bg-pink-500/10 border-pink-500/30 text-pink-400",
      description: "A unified enterprise stream with channels (#general, #p0-incidents, #boardroom-debates). Mention @CFO, @CTO, or @RedTeam anytime to get instant executive guidance right in the conversation.",
      demoLink: "/dashboard/chat",
      demoActionText: "Open Team Stream →",
      highlights: [
        "Real-time broadcast for boardroom & simulation dispatches",
        "@mention any C-suite executive for immediate analysis",
        "Zero-context-loss team collaboration in one unified OS"
      ]
    }
  ];

  if (!isOpen) return null;

  const current = steps[currentStep];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#0D0F17] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Progress Indicators */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            {steps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === idx 
                    ? "w-8 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                    : idx < currentStep 
                    ? "w-4 bg-emerald-500" 
                    : "w-4 bg-slate-800 hover:bg-slate-700"
                }`}
                title={`Step ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {currentStep + 1} of {steps.length}
          </span>
        </div>

        {/* Hero Card for Current Step */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${current.color} text-white shadow-lg shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${current.accentBg}`}>
                {current.badge}
              </span>
              <h2 className="text-xl font-bold text-white mt-1 leading-tight">{current.title}</h2>
              <p className="text-xs text-slate-400">{current.subtitle}</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            {current.description}
          </p>

          {/* Key Value Highlights */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Key Capabilities:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {current.highlights.map((h, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-tight">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Navigation & Direct Test Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <Link
            href={current.demoLink}
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-cyan-800/40"
          >
            <Play className="w-3.5 h-3.5" /> {current.demoActionText}
          </Link>

          <div className="flex items-center gap-2 justify-end">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="rounded-xl border-slate-800 text-slate-300 hover:text-white text-xs gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </Button>
            )}

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider gap-1.5 shadow-md"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                onClick={onClose}
                className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider gap-1.5 shadow-md"
              >
                Start Using Causarix <Check className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default CausarixGuidedTourModal;
