'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Radio, Sparkles, ShieldCheck, ArrowRight, Layers, Users, Zap, 
  Cpu, FileText, ChevronRight, CheckCircle2, Lock, Eye, Activity,
  Volume2, VolumeX, Shield, Crosshair, Award, Terminal, RefreshCw,
  ChevronLeft, Maximize2, X, Cookie, Filter, ExternalLink, Play, Pause
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Slide {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  badge: string;
  metrics: { label: string; value: string }[];
}

const SHOWCASE_SLIDES: Slide[] = [
  {
    id: 'executive-briefing',
    title: 'Executive Operational Briefing',
    category: 'COMMAND CENTER',
    description: 'Real-time executive briefings, compliance gap analysis, and grounded organization health scores across company documents.',
    image: '/showcase/executive_overview.png',
    badge: 'HEALTH SCORE 60/100',
    metrics: [
      { label: 'Ingestion Coverage', value: '40%' },
      { label: 'Risk Level', value: 'NORMAL' },
      { label: 'Confidence Score', value: '99.4%' }
    ]
  },
  {
    id: 'mission-control',
    title: 'Multi-Agent Flight Control System',
    category: 'AIR TRAFFIC CENTER',
    description: 'Watch 10 specialized AI agents (Research, Finance, Legal, Engineering, Marketing, Security, HR, Digital Twin) collaborate through structured memory.',
    image: '/showcase/mission_control.png',
    badge: '10 ACTIVE AGENTS',
    metrics: [
      { label: 'Execution Mode', value: 'PARALLEL' },
      { label: 'Memory Storage', value: 'STRUCTURED' },
      { label: 'Flight Control', value: 'LIVE RADAR' }
    ]
  },
  {
    id: 'digital-twins',
    title: 'Executive Digital Twins & Boardroom Simulation',
    category: 'DECISION ENGINE',
    description: 'Simulate strategic enterprise scenarios across 8 C-suite personas (CEO, CFO, CTO, COO, Legal, Sales, Security, HR) with zero hallucination.',
    image: '/showcase/digital_twins.png',
    badge: '8 C-SUITE TWINS',
    metrics: [
      { label: 'Risk Tolerance', value: 'ADAPTIVE' },
      { label: 'Consensus Rate', value: '98.5%' },
      { label: 'Hallucination', value: '0.0%' }
    ]
  },
  {
    id: 'ai-strategy',
    title: 'AI Strategy Studio & Roadmap Generator',
    category: 'STRATEGY',
    description: 'Formulate 11-stage enterprise strategy documents, Red-Team AI challenges, SWOT analysis, and execution milestones.',
    image: '/showcase/ai_strategy.png',
    badge: '11-STAGE ROADMAP',
    metrics: [
      { label: 'Loaded Docs', value: '10 FILES' },
      { label: 'SWOT Matrix', value: 'AUTO GENERATED' },
      { label: 'AI Red-Team', value: 'ACTIVE' }
    ]
  },
  {
    id: 'decision-memory',
    title: 'Enterprise Decision Memory Engine',
    category: 'PRECEDENT SEARCH',
    description: 'Natural language search across historical corporate decisions. Evaluates precedents, wrong assumptions, and lessons learned.',
    image: '/showcase/decision_memory.png',
    badge: 'PRECEDENT GRAPH',
    metrics: [
      { label: 'Memory Retention', value: 'PERPETUAL' },
      { label: 'Similarity Matching', value: 'VECTOR GRAPH' },
      { label: 'Decision Audit', value: 'VERIFIED' }
    ]
  }
];

export default function MadeWithGSAPSynapsLanding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
  const [showCookieModal, setShowCookieModal] = useState(false);

  // Check localStorage for cookie consent
  useEffect(() => {
    const consent = localStorage.getItem('synaps_cookie_consent');
    if (consent !== null) {
      setCookieConsent(consent === 'true');
    } else {
      setCookieConsent(false);
    }
  }, []);

  // Automatic slideshow timer (5 seconds)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleAcceptCookies = () => {
    localStorage.setItem('synaps_cookie_consent', 'true');
    setCookieConsent(true);
  };

  const handleDeclineCookies = () => {
    localStorage.setItem('synaps_cookie_consent', 'false');
    setCookieConsent(true);
  };

  const filteredSlides = selectedFilter === 'ALL' 
    ? SHOWCASE_SLIDES 
    : SHOWCASE_SLIDES.filter(s => s.category.includes(selectedFilter));

  const activeSlide = SHOWCASE_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-emerald-400 selection:text-black overflow-x-hidden relative">
      
      {/* ── AMBIENT CYBER GLOW ────────────────────────────────────────── */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* ── TOP MADE WITH GSAP STYLE HEADER ──────────────────────────── */}
      <header className="relative z-50 flex justify-between items-center px-8 py-5 border-b border-emerald-500/15 backdrop-blur-xl bg-[#07090e]/90">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            MADE WITH SYNAPS
          </div>

          <div className="h-4 w-px bg-emerald-500/20" />

          <span className="font-black text-xl tracking-tighter text-white font-mono">
            SYNAPS<span className="text-emerald-400">.AI</span>
          </span>
        </div>

        {/* Navigation Categories */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-mono tracking-widest uppercase text-slate-400">
          <a href="#slideshow" className="hover:text-emerald-400 transition-colors">01 // AUTOMATIC SHOWCASE</a>
          <a href="#modules" className="hover:text-emerald-400 transition-colors">02 // APP MODULES</a>
          <a href="#architecture" className="hover:text-emerald-400 transition-colors">03 // ARCHITECTURE</a>
          <a href="#privacy" className="hover:text-emerald-400 transition-colors">04 // PRIVACY & COOKIES</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            href="/login"
            className="text-xs font-mono font-bold uppercase tracking-widest px-6 py-2.5 rounded-full border border-emerald-400/40 hover:border-emerald-400 text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105"
          >
            ENTER SYNAPS OS →
          </Link>
        </div>
      </header>

      {/* ── HERO BANNER SECTION ──────────────────────────────────────── */}
      <section className="relative z-10 pt-12 pb-8 px-8 max-w-7xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-emerald-400" /> Grounded Decision Intelligence Showcase
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-white font-sans uppercase leading-none">
          MADE WITH <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-200">SYNAPS</span>
        </h1>

        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Explore our automatic high-resolution showcase featuring live application modules: Executive Operational Briefings, Multi-Agent Flight Control, Executive Digital Twins, AI Strategy Studio, and Decision Memory.
        </p>
      </section>

      {/* ── AUTOMATIC HIGH-RES SHOWCASE SLIDESHOW (GSAP STYLE CAROUSEL) ── */}
      <section id="slideshow" className="relative z-20 px-8 py-8 max-w-7xl mx-auto space-y-6">
        
        {/* Slideshow Control Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 border border-emerald-500/20 rounded-2xl p-4 backdrop-blur-md">
          
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-emerald-400">
              0{currentSlide + 1} / 0{SHOWCASE_SLIDES.length}
            </span>
            <div className="h-4 w-px bg-emerald-500/20" />
            <span className="font-mono text-xs text-white uppercase font-bold tracking-wider">
              {activeSlide.title}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {activeSlide.badge}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono flex items-center gap-2 transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
              {isPlaying ? 'PAUSE AUTOPLAY' : 'PLAY AUTOPLAY'}
            </button>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentSlide(prev => (prev - 1 + SHOWCASE_SLIDES.length) % SHOWCASE_SLIDES.length)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white transition-all border border-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setCurrentSlide(prev => (prev + 1) % SHOWCASE_SLIDES.length)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white transition-all border border-slate-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setLightboxImage(activeSlide.image)}
                className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 transition-all border border-emerald-500/30"
                title="Open High-Res 4K Lightbox"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* MAIN SLIDE SCREENSHOT FRAME */}
        <div className="relative rounded-3xl border border-emerald-500/30 bg-slate-950 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.15)] group">
          
          {/* Progress Bar for Autoplay */}
          {isPlaying && (
            <div 
              key={currentSlide}
              className="h-1 bg-gradient-to-r from-emerald-400 to-teal-300 w-full animate-progress-bar origin-left z-30 relative"
            />
          )}

          {/* High-Resolution Screenshot */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
            <Image 
              src={activeSlide.image}
              alt={activeSlide.title}
              fill
              quality={100}
              priority
              className="object-cover object-top transition-transform duration-700 group-hover:scale-102 filter contrast-[1.05] brightness-[1.02] sharp"
            />

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

            {/* Click to Zoom Overlay Button */}
            <button
              onClick={() => setLightboxImage(activeSlide.image)}
              className="absolute top-6 right-6 px-4 py-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
            >
              <Maximize2 className="w-3.5 h-3.5" /> CLICK FOR FULLSCREEN 4K VIEW
            </button>

            {/* Slide Information Panel */}
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-slate-950/90 backdrop-blur-xl border border-emerald-500/30 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                    MODULE // {activeSlide.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
                    {activeSlide.title}
                  </h3>
                </div>

                <div className="flex items-center gap-4">
                  {activeSlide.metrics.map((m, idx) => (
                    <div key={idx} className="text-right hidden md:block">
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">{m.label}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-3xl">
                {activeSlide.description}
              </p>
            </div>
          </div>
        </div>

        {/* SLIDE THUMBNAIL SELECTOR STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          {SHOWCASE_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              onClick={() => {
                setCurrentSlide(idx);
                setIsPlaying(false);
              }}
              className={cn(
                "p-3 rounded-2xl border cursor-pointer transition-all space-y-2 relative overflow-hidden group",
                currentSlide === idx 
                  ? "bg-slate-900 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-102" 
                  : "bg-slate-950/60 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/40"
              )}
            >
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-900">
                <Image 
                  src={slide.image} 
                  alt={slide.title} 
                  fill 
                  className="object-cover object-top filter contrast-[1.02]"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-emerald-400 font-bold block">0{idx + 1} // {slide.category}</span>
                <h4 className="text-xs font-bold text-white truncate font-sans">{slide.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHOWCASE CARDS GRID (MADE WITH GSAP STYLE) ────────────────── */}
      <section id="modules" className="relative z-20 px-8 py-12 max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-emerald-500/15 pb-4">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block">02 // DISCOVER ALL MODULES</span>
            <h2 className="text-3xl font-black text-white uppercase font-sans">SYNAPS Application Suite</h2>
          </div>

          {/* Filter Category Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {['ALL', 'COMMAND', 'AIR TRAFFIC', 'DECISION', 'STRATEGY', 'PRECEDENT'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all border",
                  selectedFilter === cat
                    ? "bg-emerald-400 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:border-emerald-500/40 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSlides.map((item, idx) => (
            <div 
              key={item.id}
              onClick={() => setLightboxImage(item.image)}
              className="p-5 bg-slate-900/60 border border-emerald-500/20 hover:border-emerald-400 rounded-3xl transition-all hover:scale-[1.02] cursor-pointer space-y-4 shadow-lg group"
            >
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 border border-emerald-500/10">
                <Image 
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                  {item.badge}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-emerald-400/80 uppercase font-bold tracking-widest block">
                  {item.category}
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors font-sans">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 text-xs font-mono text-emerald-400">
                <span>INSPECT MODULE →</span>
                <Maximize2 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIGHTBOX 4K FULLSCREEN ZOOM MODAL ────────────────────────── */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col justify-between p-6 animate-fade-in">
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                HIGH RESOLUTION 4K INSPECTOR
              </span>
              <span className="text-xs font-mono text-slate-400">SYNAPS APPLICATION RECORD</span>
            </div>

            <button
              onClick={() => setLightboxImage(null)}
              className="p-3 rounded-full bg-slate-800 hover:bg-rose-600 text-white transition-all border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative flex-1 w-full my-4 rounded-2xl overflow-hidden bg-slate-900 border border-emerald-500/30 shadow-2xl">
            <Image 
              src={lightboxImage}
              alt="4K High Resolution Showcase"
              fill
              quality={100}
              className="object-contain filter contrast-[1.05]"
            />
          </div>

          <div className="text-center font-mono text-xs text-slate-400">
            Press <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-emerald-400">ESC</kbd> or click X to close inspector
          </div>
        </div>
      )}

      {/* ── COOKIES PERMISSION BOX (EXACT MADE WITH GSAP COPY) ───────── */}
      {cookieConsent === false && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-50 p-6 bg-[#0c1017]/95 border border-emerald-500/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(16,185,129,0.2)] backdrop-blur-2xl space-y-4 animate-slide-up">
          
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
              <Cookie className="w-6 h-6 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-white font-sans flex items-center gap-2">
                We value your Privacy & Grounded Security
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                We use cookies and local memory storage to personalize your decision intelligence session, analyze site performance, and securely cache precedent graphs. No third-party data tracking.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-emerald-500/15">
            <button
              onClick={handleAcceptCookies}
              className="w-full sm:w-auto flex-1 px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
            >
              ACCEPT ALL COOKIES
            </button>

            <button
              onClick={handleDeclineCookies}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-all border border-slate-700"
            >
              DECLINE
            </button>
          </div>
        </div>
      )}

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="relative z-20 border-t border-emerald-500/15 py-8 px-8 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
        <div>
          SYNAPS DECISION INTELLIGENCE OPERATING SYSTEM © 2026
        </div>
        <div className="flex items-center gap-6">
          <a href="#privacy" onClick={() => setCookieConsent(false)} className="hover:text-emerald-400 transition-colors">COOKIES SETTINGS</a>
          <Link href="/login" className="hover:text-emerald-400 transition-colors">LOGIN TO OS</Link>
        </div>
      </footer>

    </div>
  );
}
