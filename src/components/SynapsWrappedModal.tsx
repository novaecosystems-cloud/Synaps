'use client';

import React, { useState } from 'react';
import { 
  X, Sparkles, Trophy, ShieldCheck, Zap, BrainCircuit, Share2, 
  Download, ArrowRight, ChevronLeft, ChevronRight, Award, Flame, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SynapsWrappedModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats?: {
    documentsAudited?: number;
    hoursSaved?: number;
    boardroomDebates?: number;
    nodesDiscovered?: number;
    groundedRate?: number;
    executivePersona?: string;
  };
}

export default function SynapsWrappedModal({
  isOpen,
  onClose,
  userStats = {
    documentsAudited: 42,
    hoursSaved: 28.5,
    boardroomDebates: 18,
    nodesDiscovered: 348,
    groundedRate: 100,
    executivePersona: 'Grounded Risk Eliminator'
  }
}: SynapsWrappedModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const slides = [
    // Slide 1: Welcome / Hook
    {
      title: "YOUR EXECUTIVE WRAPPED",
      subtitle: "Weekly Intelligence & Impact Report",
      bgGradient: "from-purple-950 via-base-100 to-indigo-950",
      content: (
        <div className="text-center space-y-6 py-6 animate-in zoom-in-90 duration-300">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 via-primary to-purple-600 p-1 shadow-2xl aura-purple">
            <div className="w-full h-full bg-base-100 rounded-[22px] flex items-center justify-center">
              <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-extrabold text-xs uppercase tracking-widest">
              Executive Leaderboard Tier
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              You Operated at Top 1% Speed This Week 🚀
            </h2>
            <p className="text-xs text-base-content/70 max-w-sm mx-auto">
              Here is your personal executive breakdown powered by Synaps 3D Corporate Memory & 10-Agent AI Boardroom.
            </p>
          </div>
        </div>
      )
    },

    // Slide 2: Time & Efficiency Saved
    {
      title: "OPERATIONAL SPEED",
      subtitle: "Manual Hours Eliminated",
      bgGradient: "from-amber-950 via-base-100 to-yellow-950",
      content: (
        <div className="text-center space-y-6 py-6 animate-in slide-in-from-right-4 duration-300">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-xl">
            <Zap className="w-10 h-10 fill-amber-400" />
          </div>

          <div className="space-y-1">
            <span className="text-6xl font-black text-amber-400 tracking-tight block">
              {userStats.hoursSaved} hrs
            </span>
            <span className="text-sm font-extrabold uppercase tracking-wider text-base-content/80">
              Manual Document Auditing Saved
            </span>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl max-w-xs mx-auto text-xs text-amber-300 font-semibold">
            ⚡ You audited <strong>{userStats.documentsAudited} enterprise files</strong> at 98.4% faster speeds than traditional manual reading!
          </div>
        </div>
      )
    },

    // Slide 3: Boardroom Debates & 3D Memory Graph
    {
      title: "BOARDROOM CONSENSUS",
      subtitle: "10-Agent AI Executive Decisions",
      bgGradient: "from-indigo-950 via-base-100 to-purple-950",
      content: (
        <div className="text-center space-y-6 py-6 animate-in slide-in-from-right-4 duration-300">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/20 border border-primary/40 text-primary flex items-center justify-center shadow-xl">
            <BrainCircuit className="w-10 h-10" />
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-left">
            <div className="p-3 bg-base-200/80 border border-base-300 rounded-2xl">
              <span className="text-2xl font-black text-primary block">{userStats.boardroomDebates}</span>
              <span className="text-[10px] font-bold text-base-content/60 uppercase">Boardroom Debates</span>
            </div>

            <div className="p-3 bg-base-200/80 border border-base-300 rounded-2xl">
              <span className="text-2xl font-black text-purple-400 block">{userStats.nodesDiscovered}</span>
              <span className="text-[10px] font-bold text-base-content/60 uppercase">3D Nodes Linked</span>
            </div>
          </div>

          <div className="p-4 bg-primary/10 border border-primary/30 rounded-2xl max-w-xs mx-auto text-xs text-primary font-semibold">
            🧠 Your 10-Agent AI Boardroom reached consensus on 100% of high-risk strategic decisions this week.
          </div>
        </div>
      )
    },

    // Slide 4: Executive Persona & Grounded Badge
    {
      title: "YOUR EXECUTIVE PERSONA",
      subtitle: "Share Your Identity Card",
      bgGradient: "from-emerald-950 via-base-100 to-teal-950",
      content: (
        <div className="text-center space-y-5 py-4 animate-in zoom-in-95 duration-300">
          
          {/* Executive Identity Card */}
          <div className="p-6 bg-gradient-to-br from-base-200 via-base-100 to-base-200 border-2 border-emerald-500/40 rounded-3xl max-w-xs mx-auto shadow-2xl relative space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Executive
              </span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                SYNAPS WRAPPED
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-base-content/60 font-bold uppercase tracking-wider block">Identity Badge</span>
              <h3 className="text-xl font-black text-white">{userStats.executivePersona}</h3>
            </div>

            <div className="py-2 border-y border-base-300/80 flex justify-around text-center text-xs">
              <div>
                <span className="font-extrabold text-amber-400 block text-sm">{userStats.hoursSaved}h</span>
                <span className="text-[9px] text-base-content/50 uppercase">Time Saved</span>
              </div>
              <div className="border-r border-base-300" />
              <div>
                <span className="font-extrabold text-emerald-400 block text-sm">{userStats.groundedRate}%</span>
                <span className="text-[9px] text-base-content/50 uppercase">Grounded</span>
              </div>
              <div className="border-r border-base-300" />
              <div>
                <span className="font-extrabold text-primary block text-sm">{userStats.boardroomDebates}</span>
                <span className="text-[9px] text-base-content/50 uppercase">Votes</span>
              </div>
            </div>

            <div className="text-[9px] text-base-content/40 font-mono">
              synaps-one.vercel.app • Verified Grounded RAG
            </div>
          </div>

          <div className="flex gap-2 max-w-xs mx-auto">
            <button
              onClick={() => {
                const text = `I just saved ${userStats.hoursSaved} hours of manual document auditing this week using Synaps AI! 🚀 My Executive Persona: "${userStats.executivePersona}". Check out Synaps: https://synaps-one.vercel.app`;
                navigator.clipboard.writeText(text);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 3000);
              }}
              className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <Share2 className="w-4 h-4" /> {copiedLink ? 'Copied to Clipboard!' : 'Share to LinkedIn'}
            </button>
          </div>

        </div>
      )
    }
  ];

  const current = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
      
      <div className={cn(
        "border border-base-300 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden flex flex-col min-h-[520px] max-h-[90vh] bg-gradient-to-b transition-all duration-500",
        current.bgGradient
      )}>
        
        {/* Top Story Progress Bars */}
        <div className="p-4 flex gap-1.5 z-20">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className="h-1.5 flex-1 rounded-full bg-white/20 overflow-hidden cursor-pointer"
            >
              <div 
                className={cn(
                  "h-full bg-white transition-all duration-300",
                  idx < currentSlide ? "w-full" : idx === currentSlide ? "w-full animate-pulse" : "w-0"
                )}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="px-6 flex justify-between items-center z-20">
          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase block">{current.title}</span>
            <span className="text-xs text-white/70 font-medium">{current.subtitle}</span>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Slide Content */}
        <div className="flex-1 px-6 flex items-center justify-center z-20">
          {current.content}
        </div>

        {/* Navigation Buttons */}
        <div className="p-6 flex justify-between items-center border-t border-white/10 z-20">
          <button
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs text-white/50 font-bold font-mono">
            {currentSlide + 1} / {slides.length}
          </span>

          {currentSlide < slides.length - 1 ? (
            <button
              onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
              className="px-5 py-2.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg hover:scale-105 transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-emerald-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg hover:scale-105 transition-all"
            >
              Done <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
