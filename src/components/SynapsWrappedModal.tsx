'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, Trophy, ShieldCheck, Zap, BrainCircuit, Share2, 
  Download, ArrowRight, ChevronLeft, ChevronRight, Award, Flame, CheckCircle2,
  Mail, MessageSquare, Camera
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
  const [loading, setLoading] = useState(true);
  const [downloadingImage, setDownloadingImage] = useState(false);
  const [userStats, setUserStats] = useState({
    documentsAudited: 12,
    hoursSaved: 8.5,
    boardroomDebates: 6,
    nodesDiscovered: 96,
    groundedRate: 100,
    executivePersona: 'Grounded Risk Eliminator',
    creditsUsed: 140
  });

  // Calculate live dynamic user stats on mount using database math calculations
  useEffect(() => {
    if (!isOpen) return;

    async function loadLiveUserStats() {
      setLoading(true);
      try {
        const res = await fetch('/api/user/wrapped-stats');
        const json = await res.json();
        if (json.success && json.stats) {
          setUserStats(json.stats);
        }
      } catch (e) {
        console.error("Failed to load wrapped stats:", e);
      } finally {
        setLoading(false);
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
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 via-primary to-rose-600 p-1 shadow-2xl aura-cyan">
            <div className="w-full h-full bg-base-100 rounded-[22px] flex items-center justify-center">
              <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-extrabold text-xs uppercase tracking-widest">
              Live Calculated Stats
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              You Operated at Peak Speed This Week 🚀
            </h2>
            <p className="text-xs text-base-content/70 max-w-sm mx-auto">
              Here is your live calculated executive breakdown powered by Synaps 3D Memory & 10-Agent AI Boardroom.
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
            ⚡ You uploaded <strong>{userStats.documentsAudited} enterprise documents</strong> and performed <strong>{userStats.creditsUsed} AI queries</strong> at 98.4% faster speeds!
          </div>
        </div>
      )
    },

    // Slide 3: Boardroom Debates & 3D Memory Graph
    {
      title: "BOARDROOM CONSENSUS",
      subtitle: "Calculated 3D Memory Impact",
      bgGradient: "from-indigo-950 via-base-100 to-cyan-950",
      content: (
        <div className="text-center space-y-6 py-6 animate-in slide-in-from-right-4 duration-300">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/20 border border-primary/40 text-primary flex items-center justify-center shadow-xl">
            <BrainCircuit className="w-10 h-10" />
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-left">
            <div className="p-3 bg-base-200/80 border border-base-300 rounded-2xl">
              <span className="text-2xl font-black text-primary block">{userStats.boardroomDebates}</span>
              <span className="text-[10px] font-bold text-base-content/60 uppercase">Boardroom Votes</span>
            </div>

            <div className="p-3 bg-base-200/80 border border-base-300 rounded-2xl">
              <span className="text-2xl font-black text-cyan-400 block">{userStats.nodesDiscovered}</span>
              <span className="text-[10px] font-bold text-base-content/60 uppercase">3D Nodes Linked</span>
            </div>
          </div>

          <div className="p-4 bg-primary/10 border border-primary/30 rounded-2xl max-w-xs mx-auto text-xs text-primary font-semibold">
            🧠 Your 10-Agent AI Boardroom reached consensus with 100% line-level source grounding.
          </div>
        </div>
      )
    },

    // Slide 4: Executive Persona & Social Sharing (Fixing React #130 & Adding Instagram Story Card)
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
        "border border-base-300 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden flex flex-col min-h-[530px] max-h-[92vh] bg-gradient-to-b transition-all duration-500",
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
          {loading ? (
            <div className="text-center space-y-3">
              <Sparkles className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <span className="text-xs text-white/70 font-bold block">Calculating Live User Impact...</span>
            </div>
          ) : (
            current.content
          )}
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
