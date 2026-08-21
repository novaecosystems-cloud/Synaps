"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Sparkles, ShieldCheck, Scale, DollarSign, 
  Cpu, CheckCircle2, ArrowRight, ArrowLeft, Database,
  Terminal, Layers, X, Zap, Compass, LineChart, Users,
  Play, FileText, Check, Bot, Globe2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrgProfile } from "@/context/OrgProfileContext";
import { useRouter } from "next/navigation";

export function AdaptiveEnterpriseOnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const { profile } = useOrgProfile();
  const router = useRouter();

  useEffect(() => {
    const isCompleted = localStorage.getItem("causarix_dashboard_intro_completed_v2");
    if (!isCompleted) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = (redirectPath?: string) => {
    localStorage.setItem("causarix_dashboard_intro_completed_v2", "true");
    localStorage.setItem("causarix_onboarding_completed", "true");
    setIsOpen(false);
    if (redirectPath) {
      router.push(redirectPath);
    }
  };

  const slides = [
    // Slide 1: WHAT IT DOES
    {
      badge: "EXECUTIVE BRIEFING · 01",
      title: "Welcome to Causarix OS",
      subtitle: "The Sovereign Decision Intelligence Operating System",
      description: "Instead of guessing or drowning in unstructured contracts, financial spreadsheets, and siloed chats, Causarix builds a real-time living knowledge graph of your entire enterprise to model decisions before you sign or spend.",
      highlights: [
        { icon: ShieldCheck, title: "100% SHA-256 Grounded", desc: "Every insight is backed by exact line-level document citations. Zero hallucination." },
        { icon: DollarSign, title: "0.00% Arithmetic Drift", desc: "Deterministic Python SCM models balance sheet impacts and runway with mathematical precision." },
        { icon: Terminal, title: "Pearl Do-Calculus", desc: "Computes formal causal interventions P(Y | do(X=x)) over Directed Acyclic Graphs." }
      ]
    },
    // Slide 2: HOW IT HELPS YOU
    {
      badge: "CORE SUPERPOWERS · 02",
      title: "How Causarix Helps Your Team Win",
      subtitle: "3 Autonomous Engines Working for Your Leadership",
      description: "From boardroom strategy to operational risk mitigation, Causarix automates executive analysis so you make decisions 10x faster with complete fiduciary protection.",
      highlights: [
        { icon: Scale, title: "10-Agent Boardroom Deliberation", desc: "General Counsel, CFO, Red Team & C-Suite twins adversarial stress-test decisions under Delaware DGCL § 141." },
        { icon: Compass, title: "Causal Counterfactual Studio", desc: "Test high-stakes 'what-if' scenarios (M&A, tariff shocks, price wars, contract redlines) with live sliders." },
        { icon: Database, title: "3D Organizational Memory Graph", desc: "Transforms your PDFs, MSAs, and SOPs into an interconnected visual brain your whole team can reason over." }
      ]
    },
    // Slide 3: 3-STEP QUICK START
    {
      badge: "QUICK START · 03",
      title: "How to Get Started in 30 Seconds",
      subtitle: "Simple, Actionable, Ready for Production",
      description: "Your personalized executive workspace is ready for your team. Here are the 3 fastest ways to get immediate value:",
      steps: [
        { step: "01", title: "Ingest Your Documents", desc: "Drop contracts, financial reports, or SOPs in Document Vault to activate your memory graph.", actionLabel: "Go to Documents", path: "/dashboard/documents" },
        { step: "02", title: "Run a Causal Simulation", desc: "Simulate a strategic dilemma or budget shock in the Counterfactual SCM Studio.", actionLabel: "Open SCM Studio", path: "/dashboard/simulations" },
        { step: "03", title: "Consult Your Boardroom", desc: "Ask the 10-Agent executive boardroom to audit risk and synthesize consensus action roadmaps.", actionLabel: "Enter Boardroom", path: "/dashboard/boardroom" }
      ]
    }
  ];

  if (!isOpen) return null;

  const activeSlide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-gradient-to-b from-[#161514] via-[#11100F] to-[#0A0A0A] text-[#ECE9E3] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between"
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close / Skip Button */}
        <button
          onClick={() => handleComplete()}
          className="absolute top-5 right-5 p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors z-10"
          title="Skip Intro"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge & Pagination */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-[11px] font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>{activeSlide.badge}</span>
          </div>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide ? "w-6 bg-primary" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="py-6 space-y-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {activeSlide.title}
            </h2>
            <p className="text-xs sm:text-sm font-mono text-primary font-bold mt-1">
              {activeSlide.subtitle}
            </p>
            <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed">
              {activeSlide.description}
            </p>
          </div>

          {/* Slide 1 & 2: Feature Highlights */}
          {activeSlide.highlights && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {activeSlide.highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-primary/40 transition-colors space-y-2"
                  >
                    <div className="h-8 w-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug">{item.title}</h4>
                    <p className="text-[11px] text-white/60 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Slide 3: Action Steps */}
          {activeSlide.steps && (
            <div className="space-y-3 pt-1">
              {activeSlide.steps.map((stepItem, idx) => (
                <div
                  key={idx}
                  onClick={() => handleComplete(stepItem.path)}
                  className="group flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-primary/50 hover:bg-white/[0.07] cursor-pointer transition-all gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/20 px-2.5 py-1 rounded-xl border border-primary/30">
                      {stepItem.step}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                        {stepItem.title}
                      </h4>
                      <p className="text-[11px] text-white/60 leading-tight mt-0.5">
                        {stepItem.desc}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0">
                    {stepItem.actionLabel} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-3">
          <button
            onClick={() => handleComplete()}
            className="text-xs text-white/50 hover:text-white font-mono uppercase tracking-wider transition-colors px-2 py-1"
          >
            Skip Intro
          </button>

          <div className="flex items-center gap-2">
            {currentSlide > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentSlide((prev) => prev - 1)}
                className="rounded-xl border-white/20 hover:bg-white/10 text-xs font-mono gap-1 text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </Button>
            )}

            {currentSlide < slides.length - 1 ? (
              <Button
                size="sm"
                onClick={() => setCurrentSlide((prev) => prev + 1)}
                className="btn btn-primary btn-sm rounded-xl text-xs font-mono font-bold gap-1.5 shadow-md shadow-primary/20"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => handleComplete()}
                className="btn btn-primary btn-sm rounded-xl text-xs font-mono font-bold gap-1.5 shadow-lg shadow-primary/30"
              >
                <Zap className="w-3.5 h-3.5" /> Launch My Workspace
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AdaptiveEnterpriseOnboardingModal;
