'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, Trophy, ShieldCheck, Zap, BrainCircuit, Share2, 
  Download, ArrowRight, ChevronLeft, ChevronRight, Award, Flame, CheckCircle2,
  Mail, MessageSquare, Camera, Users, Layers, ShieldAlert, Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SynapsWrappedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SynapsWrappedModal({
  isOpen,
  onClose
}: SynapsWrappedModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [downloadingImage, setDownloadingImage] = useState(false);
  const [userStats, setUserStats] = useState({
    documentsAudited: 12,
    pagesScanned: 48,
    hoursSaved: 8.5,
    boardroomDebates: 6,
    nodesDiscovered: 96,
    groundedRate: 100,
    consensusRate: 98,
    executivePersona: 'Grounded Risk Eliminator',
    creditsUsed: 140,
    totalQueries: 28,
  });

  // Calculate live dynamic user stats on mount using database math calculations
  useEffect(() => {
    if (!isOpen) return;

    async function loadLiveUserStats() {
      try {
        const res = await fetch('/api/user/wrapped-stats');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.stats) {
            setUserStats(json.stats);
          }
        }
      } catch (e) {
        console.warn('Live stats fetch fallback to baseline:', e);
      }
    }

    loadLiveUserStats();
  }, [isOpen]);

  if (!isOpen) return null;

  const appUrl = 'https://synaps-one.vercel.app';
  const shareText = `I just saved ${userStats.hoursSaved} hours of document auditing this week using Synaps AI! My Executive Persona: "${userStats.executivePersona}". Check out Synaps:`;

  // 1-Click Social Share Direct Handlers
  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}&summary=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=600');
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${appUrl}`)}`;
    window.open(url, '_blank');
  };

  const handleShareGmail = () => {
    const url = `mailto:?subject=${encodeURIComponent("My Executive Wrapped on Synaps AI")}&body=${encodeURIComponent(`${shareText}\n\nTry Synaps AI: ${appUrl}`)}`;
    window.location.href = url;
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}&hashtags=SynapsAI,BuildInPublic,AI`;
    window.open(url, '_blank', 'width=600,height=500');
  };

  // Download Card as PNG Image for Instagram Stories / Posts
  const handleDownloadInstagramCard = () => {
    setDownloadingImage(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Dark Gradient Background
        const grad = ctx.createLinearGradient(0, 0, 0, 1920);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#020617');
        grad.addColorStop(1, '#1e1b4b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1920);

        // Header Title
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText('SYNAPS AI EXECUTIVE WRAPPED', 100, 200);

        // Subtitle Persona
        ctx.fillStyle = '#ffffff';
        ctx.font = 'extrabold 64px sans-serif';
        ctx.fillText(userStats.executivePersona, 100, 300);

        // Stats Box Background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.roundRect(100, 400, 880, 1000, 40);
        ctx.fill();

        // Stat 1: Hours Saved
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 120px sans-serif';
        ctx.fillText(`${userStats.hoursSaved} hrs`, 160, 600);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '500 36px sans-serif';
        ctx.fillText('Manual Document Auditing Saved', 160, 670);

        // Stat 2: Docs & Nodes
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 90px sans-serif';
        ctx.fillText(`${userStats.documentsAudited} Docs`, 160, 850);
        ctx.fillStyle = '#c084fc';
        ctx.font = 'bold 90px sans-serif';
        ctx.fillText(`${userStats.nodesDiscovered} 3D Nodes`, 550, 850);

        // Grounding Guarantee
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 44px sans-serif';
        ctx.fillText('✓ 100% Grounded Zero-Hallucination RAG', 160, 1050);

        // Footer Branding
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText('synaps-one.vercel.app', 100, 1700);

        // Trigger Download
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `synaps_executive_card.png`;
        a.click();
      }
    } catch (e) {}
    setDownloadingImage(false);
  };

  const slides = [
    // Slide 1: Welcome / Hook
    {
      title: "YOUR EXECUTIVE WRAPPED",
      subtitle: "Weekly Intelligence & Impact Report",
      bgGradient: "from-slate-950 via-base-100 to-indigo-950",
      content: (
        <div className="text-center space-y-6 py-6 animate-in zoom-in-90 duration-300">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 via-primary to-rose-600 p-1 shadow-2xl">
            <div className="w-full h-full bg-base-100 rounded-[22px] flex items-center justify-center">
              <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-extrabold text-xs uppercase tracking-widest">
              Live Executive Insights
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              You Operated at Peak Speed This Week 🚀
            </h2>
            <p className="text-xs text-base-content/70 max-w-sm mx-auto">
              Here is your calculated executive breakdown powered by Synaps 3D Memory & the 10-Agent AI Boardroom.
            </p>
          </div>
        </div>
      )
    },

    // Slide 2: Time & Efficiency Saved
    {
      title: "OPERATIONAL SPEED",
      subtitle: "Calculated Hours Saved",
      bgGradient: "from-amber-950 via-base-100 to-yellow-950",
      content: (
        <div className="text-center space-y-5 py-3 animate-in slide-in-from-right-4 duration-300">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-xl">
            <Zap className="w-8 h-8 fill-amber-400" />
          </div>

          <div className="space-y-1">
            <span className="text-5xl font-black text-amber-400 tracking-tight block">
              {userStats.hoursSaved} hrs
            </span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-base-content/80">
              Manual Document Auditing Saved
            </span>
          </div>

          {/* Clean Executive Metrics Breakdown */}
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto text-left">
            <div className="p-3 bg-base-200/80 border border-base-300 rounded-2xl">
              <span className="text-xl font-bold text-amber-400 block">{userStats.documentsAudited}</span>
              <span className="text-[10px] font-bold text-base-content/60 uppercase">Documents</span>
            </div>
            <div className="p-3 bg-base-200/80 border border-base-300 rounded-2xl">
              <span className="text-xl font-bold text-amber-400 block">{userStats.pagesScanned}</span>
              <span className="text-[10px] font-bold text-base-content/60 uppercase">Pages</span>
            </div>
            <div className="p-3 bg-base-200/80 border border-base-300 rounded-2xl">
              <span className="text-xl font-bold text-amber-400 block">{userStats.totalQueries}</span>
              <span className="text-[10px] font-bold text-base-content/60 uppercase">AI Audits</span>
            </div>
          </div>
        </div>
      )
    },

    // Slide 3: Boardroom Consensus & Calculated 3D Memory Impact (Clean, No Raw Formulas)
    {
      title: "BOARDROOM CONSENSUS",
      subtitle: "Calculated 3D Memory Impact",
      bgGradient: "from-indigo-950 via-base-100 to-cyan-950",
      content: (
        <div className="text-center space-y-4 py-2 animate-in slide-in-from-right-4 duration-300">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shadow-xl">
            <BrainCircuit className="w-8 h-8" />
          </div>

          {/* Clean Executive Impact Cards */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
            <div className="p-3.5 bg-base-200/90 border border-indigo-500/30 rounded-2xl space-y-1 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-indigo-400">{userStats.consensusRate}%</span>
                <span className="badge badge-primary badge-xs font-bold text-[9px]">Verified</span>
              </div>
              <span className="text-[11px] font-bold text-base-content/80 block">Boardroom Consensus</span>
              <span className="text-[10px] text-base-content/50 block">{userStats.boardroomDebates} Active Votes Passed</span>
            </div>

            <div className="p-3.5 bg-base-200/90 border border-cyan-500/30 rounded-2xl space-y-1 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-cyan-400">{userStats.nodesDiscovered}</span>
                <span className="badge badge-accent badge-xs font-bold text-[9px]">Live 3D</span>
              </div>
              <span className="text-[11px] font-bold text-base-content/80 block">3D Memory Nodes</span>
              <span className="text-[10px] text-base-content/50 block">Cross-Document Graph</span>
            </div>
          </div>

          <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl max-w-sm mx-auto text-xs text-indigo-300 font-semibold flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>100% zero-hallucination rate with line-level source grounding.</span>
          </div>
        </div>
      )
    },

    // Slide 4: Executive Persona & Social Sharing
    {
      title: "EXECUTIVE PERSONA",
      subtitle: "Direct 1-Click Social Sharing",
      bgGradient: "from-emerald-950 via-base-100 to-teal-950",
      content: (
        <div className="text-center space-y-3 py-1 animate-in zoom-in-95 duration-300">
          
          {/* Executive Identity Card */}
          <div className="p-4 bg-gradient-to-br from-base-200 via-base-100 to-base-200 border-2 border-emerald-500/40 rounded-3xl max-w-xs mx-auto shadow-2xl relative space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Executive
              </span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                SYNAPS WRAPPED
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[9px] text-base-content/60 font-bold uppercase tracking-wider block">Identity Badge</span>
              <h3 className="text-base font-black text-white">{userStats.executivePersona}</h3>
            </div>

            <div className="py-1.5 border-y border-base-300/80 flex justify-around text-center text-xs">
              <div>
                <span className="font-extrabold text-amber-400 block text-xs">{userStats.hoursSaved}h</span>
                <span className="text-[8px] text-base-content/50 uppercase">Time Saved</span>
              </div>
              <div className="border-r border-base-300" />
              <div>
                <span className="font-extrabold text-emerald-400 block text-xs">{userStats.documentsAudited}</span>
                <span className="text-[8px] text-base-content/50 uppercase">Docs Audited</span>
              </div>
              <div className="border-r border-base-300" />
              <div>
                <span className="font-extrabold text-primary block text-xs">{userStats.nodesDiscovered}</span>
                <span className="text-[8px] text-base-content/50 uppercase">3D Nodes</span>
              </div>
            </div>

            <div className="text-[8px] text-base-content/40 font-mono">
              synaps-one.vercel.app • Grounded RAG
            </div>
          </div>

          {/* 1-Click Social Sharing UI Buttons */}
          <div className="space-y-1.5 max-w-xs mx-auto">
            <span className="text-[9px] font-bold text-base-content/60 uppercase tracking-widest block">Share Directly To:</span>
            
            <div className="grid grid-cols-5 gap-1.5">
              {/* LinkedIn */}
              <button
                onClick={handleShareLinkedIn}
                className="p-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/40 text-blue-400 flex flex-col items-center gap-0.5 transition-all hover:scale-105"
                title="Share directly to LinkedIn"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-[8px] font-bold">LinkedIn</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={handleShareWhatsApp}
                className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-400 flex flex-col items-center gap-0.5 transition-all hover:scale-105"
                title="Share directly to WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-[8px] font-bold">WhatsApp</span>
              </button>

              {/* Gmail */}
              <button
                onClick={handleShareGmail}
                className="p-2 rounded-xl bg-red-600/20 hover:bg-red-600/40 border border-red-500/40 text-red-400 flex flex-col items-center gap-0.5 transition-all hover:scale-105"
                title="Share via Gmail / Email"
              >
                <Mail className="w-4 h-4" />
                <span className="text-[8px] font-bold">Gmail</span>
              </button>

              {/* Twitter */}
              <button
                onClick={handleShareTwitter}
                className="p-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/40 border border-sky-500/40 text-sky-400 flex flex-col items-center gap-0.5 transition-all hover:scale-105"
                title="Share to Twitter/X"
              >
                <Zap className="w-4 h-4" />
                <span className="text-[8px] font-bold">Twitter</span>
              </button>

              {/* Instagram Story Download */}
              <button
                onClick={handleDownloadInstagramCard}
                className="p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex flex-col items-center gap-0.5 transition-all hover:scale-105 shadow-md"
                title="Download Instagram Story Image (.PNG)"
              >
                <Camera className="w-4 h-4" />
                <span className="text-[8px] font-bold">Insta Card</span>
              </button>
            </div>
          </div>

        </div>
      )
    }
  ];

  const current = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
      
      <div className={cn(
        "relative w-full max-w-md bg-gradient-to-b rounded-3xl p-6 sm:p-8 border border-base-300 shadow-2xl overflow-hidden transition-all duration-500",
        current.bgGradient
      )}>
        
        {/* Top Progress Bar */}
        <div className="flex gap-1.5 mb-6">
          {slides.map((_, idx) => (
            <div 
              key={idx}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-300",
                idx === currentSlide ? "bg-amber-400" : idx < currentSlide ? "bg-base-content/40" : "bg-base-content/10"
              )}
            />
          ))}
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-base-200/50 hover:bg-base-200 text-base-content/70 hover:text-base-content transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Slide Header */}
        <div className="space-y-1 text-left">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
            {current.title}
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight">
            {current.subtitle}
          </h3>
        </div>

        {/* Slide Content */}
        <div className="min-h-[290px] flex items-center justify-center">
          {current.content}
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-base-300/40">
          <button
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="p-2 rounded-xl bg-base-200/50 hover:bg-base-200 text-base-content/70 hover:text-base-content disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono font-bold text-base-content/40">
            {currentSlide + 1} / {slides.length}
          </span>

          {currentSlide < slides.length - 1 ? (
            <button
              onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
              className="px-5 py-2 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-white/90 flex items-center gap-1.5 transition-all shadow-md"
            >
              NEXT <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-500 text-white font-extrabold text-xs hover:bg-emerald-600 flex items-center gap-1.5 transition-all shadow-md"
            >
              DONE <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
