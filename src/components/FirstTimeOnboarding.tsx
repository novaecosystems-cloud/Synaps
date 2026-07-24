'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, Sparkles, ShieldCheck, Activity, Users, Globe, 
  Layers, Compass, FileText, ArrowRight, CheckCircle2, X, Play,
  HelpCircle, ChevronRight, ChevronLeft, Rocket, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface OnboardingStep {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge: string;
  description: string;
  highlights: string[];
  actionLabel?: string;
  actionHref?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: "Welcome to Synaps Org Workspace",
    subtitle: "Enterprise Multi-Tenant Security & Organization Governance",
    icon: Building2,
    color: "from-primary to-accent",
    badge: "STEP 1 OF 6",
    description: "Every organization operates in a 100% isolated, secure tenant workspace. Users from other companies can NEVER access your files, members, or decisions.",
    highlights: [
      "Instant YouTube-style Organization Search with auto-complete & logo previews.",
      "Join Request Workflow — New members require Leader/Admin approval before entry.",
      "Role Governance: Owner, Leader, Admin, Manager, Member, Guest."
    ]
  },
  {
    title: "Executive Overview & AI COO Briefing",
    subtitle: "Real-Time Operational Command Center",
    icon: Activity,
    color: "from-blue-500 to-indigo-600",
    badge: "STEP 2 OF 6",
    description: "Your executive command center continuously aggregates corporate data, tracking active projects, system health, and strategic milestones.",
    highlights: [
      "AI COO Briefing: Automated daily executive summaries & action items.",
      "Live Operational Metrics: Active projects, decision memory logs, and risks.",
      "Multi-tenant data scoping across all analytics views."
    ]
  },
  {
    title: "AI Intelligence Suite",
    subtitle: "Multi-Agent Executive Boardroom & Digital Twin OS",
    icon: Sparkles,
    color: "from-purple-500 to-pink-600",
    badge: "STEP 3 OF 6",
    description: "Convene 10 AI Executive Agents (CEO, CFO, CTO, Legal, HR, Sales, etc.) to debate strategic business questions and run company disruption simulations.",
    highlights: [
      "AI Boardroom: 10 domain executives independently evaluate risks & consensus.",
      "Digital Twin OS: Stress-test 15 company system nodes against operational shocks.",
      "Strategy Studio: Formulate 11-stage enterprise strategy blueprints & SWOT matrix."
    ]
  },
  {
    title: "Governance, Risk & Decision Memory",
    subtitle: "Risk Prediction Center & 3D Memory Graph",
    icon: ShieldCheck,
    color: "from-emerald-500 to-teal-600",
    badge: "STEP 4 OF 6",
    description: "Automatically detect unsigned contracts, policy conflicts, and financial risks while maintaining a permanent corporate memory log.",
    highlights: [
      "AI Risk Center: Scans 8 vulnerability categories (Missing signatures, SOP conflicts).",
      "Decision Memory: Searchable historical record of executive recommendations & outcomes.",
      "Memory Graph: Visualize relationships between documents, departments, and decisions."
    ]
  },
  {
    title: "Document Vault & Knowledge Ingestion",
    subtitle: "Enterprise RAG & Grounded AI Intelligence",
    icon: FileText,
    color: "from-cyan-500 to-blue-600",
    badge: "STEP 5 OF 6",
    description: "Upload contracts, SOPs, RFPs, and financial spreadsheets. The AI engine extracts text chunks and grounds all AI analysis directly in your real data.",
    highlights: [
      "Real Data Grounding: No fake metrics — AI extracts facts from your actual files.",
      "Folder Structure & Tags: Organize uploaded knowledge assets securely.",
      "Strict Tenant Scoping: Files are accessible only according to role permissions."
    ]
  },
  {
    title: "You are All Set!",
    subtitle: "Start Executing with Synaps Enterprise Intelligence",
    icon: Rocket,
    color: "from-emerald-400 to-cyan-500",
    badge: "FINAL STEP",
    description: "Your workspace is fully synchronized and ready. You can reopen this interactive guide anytime from the top sidebar.",
    highlights: [
      "Use Global Search (Cmd + K) to search anything across your workspace.",
      "Check the Notification Bell on top right for real-time join request updates.",
      "Upload your first document to unlock deep AI Digital Twin analysis!"
    ],
    actionLabel: "Enter Synaps Workspace 🚀"
  }
];

export default function FirstTimeOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/demo')) {
      return;
    }
    // Check if first-time user
    const hasCompleted = localStorage.getItem('synaps_onboarding_completed_v1');
    if (!hasCompleted) {
      // Small delay for initial page render
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem('synaps_onboarding_completed_v1', 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!isOpen) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="card w-full max-w-2xl bg-base-100 shadow-2xl border border-base-300 rounded-3xl overflow-hidden flex flex-col relative"
      >
        {/* Header / Progress Bar */}
        <div className="p-6 border-b border-base-300 bg-base-200/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-tr", step.color)}>
              <StepIcon className="h-6 w-6" />
            </div>
            <div>
              <span className="badge badge-primary badge-outline text-[10px] font-bold tracking-wider">{step.badge}</span>
              <h2 className="text-lg font-bold text-base-content leading-tight mt-0.5">{step.title}</h2>
            </div>
          </div>

          <button onClick={handleComplete} className="btn btn-ghost btn-circle btn-sm text-base-content/50 hover:text-base-content">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="w-full bg-base-300/40 h-1.5 flex">
          {ONBOARDING_STEPS.map((_, idx) => (
            <div 
              key={idx} 
              className={cn(
                "h-full flex-1 transition-all duration-300",
                idx <= currentStep ? "bg-primary" : "bg-transparent"
              )}
            />
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6 flex-1">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">{step.subtitle}</span>
            <p className="text-sm text-base-content/80 leading-relaxed font-medium">
              {step.description}
            </p>
          </div>

          <div className="card bg-base-200/60 border border-base-300 p-4 rounded-2xl space-y-2.5">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider block">Key Capabilities:</span>
            {step.highlights.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-base-content/90 font-medium">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="p-6 border-t border-base-300 bg-base-200/40 flex items-center justify-between">
          <button 
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="btn btn-ghost btn-sm rounded-xl gap-1 text-xs text-base-content/70 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleComplete} 
              className="btn btn-ghost btn-sm rounded-xl text-xs text-base-content/60 hover:text-base-content"
            >
              Skip Tour
            </button>
            <button 
              onClick={handleNext}
              className="btn btn-primary btn-sm rounded-xl gap-1 text-xs font-bold px-5 shadow-md shadow-primary/20"
            >
              {currentStep === ONBOARDING_STEPS.length - 1 ? (step.actionLabel || "Get Started") : "Next"} <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
