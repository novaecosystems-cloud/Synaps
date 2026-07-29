'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Radio, Sparkles, ShieldCheck, ArrowRight, Layers, Users, Zap, 
  Cpu, FileText, ChevronRight, CheckCircle2, Lock, Eye, Activity,
  Volume2, VolumeX, Shield, Crosshair, Award, Terminal, RefreshCw,
  ChevronLeft, Maximize2, X, Cookie, Filter, ExternalLink, Play, Pause,
  Search, Heart, Share2, Info, Code2, Database, Compass, ArrowUpRight,
  TrendingUp, Check, BookOpen, MessageSquare, SlidersHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShowcaseModule {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  fullDetails: string;
  image: string;
  badge: string;
  author: string;
  date: string;
  likes: number;
  views: string;
  techStack: string[];
  features: string[];
  metrics: { label: string; value: string }[];
}

const SHOWCASE_MODULES: ShowcaseModule[] = [
  {
    id: 'executive-briefing',
    title: 'Executive Operational Briefing',
    category: 'COMMAND CENTER',
    tagline: 'Grounded C-Suite intelligence & automated compliance gap analysis.',
    description: 'Provides top-level executive briefings, real-time org health scoring (60/100), and compliance tracking across legal, financial, and regulatory documents.',
    fullDetails: 'The Executive Operational Briefing synthesizes thousands of ingested corporate documents into high-level executive summaries tailored for C-suite decision makers. It automatically flags compliance gaps (e.g. FSSAI licenses, regulatory filings) and projects operational risks before contract signing.',
    image: '/showcase/executive_overview.png',
    badge: 'HEALTH SCORE 60/100',
    author: 'AI COO Engine',
    date: 'Updated Live',
    likes: 1420,
    views: '18.4k',
    techStack: ['Next.js 15', 'Prisma ORM', 'Decision Engine', 'VLM Vision'],
    features: [
      'Automated Org Health Score Calculation',
      'Compliance & Regulatory Gap Scanning',
      'Executive Briefing Summary Generation',
      'Multi-Tenant Organization Isolation'
    ],
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
    tagline: '10 specialized AI agents collaborating in parallel flight paths.',
    description: 'Air traffic control dashboard for watching 10 autonomous agents (Research, Finance, Legal, Engineering, Marketing, Security, HR, Twin) collaborate via structured memory.',
    fullDetails: 'Inspired by aerospace flight control towers, Mission Control organizes complex enterprise workflows into missions. Agents communicate via structured state objects rather than raw text prompts, featuring live radar visualization, pause/resume controls, and step-by-step explainability inspection.',
    image: '/showcase/mission_control.png',
    badge: '10 ACTIVE AGENTS',
    author: 'Flight Control Core',
    date: 'v2026.4',
    likes: 2180,
    views: '32.1k',
    techStack: ['Structured Memory', 'WebSockets', 'Parallel Agents', 'Radar Grid'],
    features: [
      '10 Specialized AI Agent Personas',
      'Parallel Task Execution Engine',
      'Structured Shared Memory Protocol',
      'Live Radar Grid & Mission Control UI',
      'Pause, Resume, Cancel & Retry Flight Controls'
    ],
    metrics: [
      { label: 'Execution Mode', value: 'PARALLEL' },
      { label: 'Memory Protocol', value: 'STRUCTURED' },
      { label: 'Flight Control', value: 'LIVE RADAR' }
    ]
  },
  {
    id: 'digital-twins',
    title: 'Executive Digital Twins & Boardroom Simulator',
    category: 'DECISION ENGINE',
    tagline: 'Simulate strategic decisions across 8 C-suite executive personas.',
    description: 'Simulates boardroom debates across CEO, CFO, CTO, COO, Legal Counsel, Sales, Security, and HR personas with zero hallucination.',
    fullDetails: 'Executive Digital Twins act as synthetic advisors trained on historical decision memory and organizational policy. Users can input any enterprise scenario (e.g. "Should we acquire Competitor X?") and receive side-by-side perspectives, risk tolerances, and consensus breakdown.',
    image: '/showcase/digital_twins.png',
    badge: '8 C-SUITE TWINS',
    author: 'Boardroom Engine',
    date: 'v2026.4',
    likes: 1890,
    views: '24.7k',
    techStack: ['Twin Memory', 'Risk Tolerances', 'Boardroom Sim', 'Grounded AI'],
    features: [
      '8 C-Suite Executive Personas',
      'Side-by-Side Perspective Comparison',
      'Risk Tolerance Alignment Engine',
      'Grounded Company Memory Ingestion',
      'Boardroom Consensus Breakdown'
    ],
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
    tagline: '11-stage enterprise strategy document & SWOT matrix generator.',
    description: 'Generates end-to-end strategic business roadmaps, AI Red-Team challenges, SWOT matrices, and execution timelines from ingested knowledge bases.',
    fullDetails: 'The AI Strategy Studio translates strategic enterprise objectives into 11-stage executable blueprints. It ingests active knowledge base scope files, subjects proposals to AI Red-Teaming, and identifies dependencies before execution.',
    image: '/showcase/ai_strategy.png',
    badge: '11-STAGE ROADMAP',
    author: 'Strategy Studio',
    date: 'v2026.4',
    likes: 1340,
    views: '16.2k',
    techStack: ['SWOT Generator', 'Red-Team AI', 'Knowledge Scope', 'Prisma'],
    features: [
      '11-Stage Enterprise Strategy Blueprints',
      'Automated SWOT Matrix Generation',
      'AI Red-Teaming Challenge Engine',
      'Active Knowledge Base Selector',
      'Milestone & Execution Roadmap'
    ],
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
    tagline: 'Perpetual corporate memory & natural language precedent search.',
    description: 'Remembers every past decision, wrong assumption, and lesson learned. Asks "Have we done this before?" with vector similarity scoring.',
    fullDetails: 'Decision Memory prevents companies from repeating expensive past mistakes. By indexing historical proposals, board minutes, and decision records into a 3D memory graph, users can query precedents with natural language and inspect exact similarity scores.',
    image: '/showcase/decision_memory.png',
    badge: 'PRECEDENT GRAPH',
    author: 'Decision Memory Core',
    date: 'v2026.4',
    likes: 2950,
    views: '41.8k',
    techStack: ['Precedent Graph', 'Similarity Math', 'Lesson Audit', 'Memory Bank'],
    features: [
      'Natural Language Precedent Querying',
      'Historical Decision Audit Graph',
      'Wrong Assumption & Risk Tracking',
      'Precedent Similarity Score (%)',
      'Executive Timeline & Analytics'
    ],
    metrics: [
      { label: 'Memory Retention', value: 'PERPETUAL' },
      { label: 'Similarity Math', value: 'COSINE GRAPH' },
      { label: 'Decision Audit', value: 'VERIFIED' }
    ]
  }
];

export default function MadeWithGSAPSynapsLanding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedModule, setSelectedModule] = useState<ShowcaseModule | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);

  // Check localStorage for cookie consent
  useEffect(() => {
    const consent = localStorage.getItem('synaps_cookie_consent');
    if (consent !== null) {
      setCookieConsent(consent === 'true');
    } else {
      setCookieConsent(false);
    }
  }, []);

  // Cmd + K shortcut for search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Automatic slideshow timer (5 seconds)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SHOWCASE_MODULES.length);
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

  const filteredModules = SHOWCASE_MODULES.filter(m => {
    const matchesFilter = selectedFilter === 'ALL' || m.category.includes(selectedFilter);
    const matchesSearch = searchQuery === '' || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeSlide = SHOWCASE_MODULES[currentSlide];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-emerald-400 selection:text-black overflow-x-hidden relative">
      
      {/* ── AMBIENT GLOW & CYBER GRID ───────────────────────────────────── */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(16,185,129,0.09),transparent_70%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* ── TOP MADE WITH GSAP STYLE HEADER ──────────────────────────── */}
      <header className="relative z-50 flex justify-between items-center px-8 py-5 border-b border-emerald-500/15 backdrop-blur-xl bg-[#07090e]/90">
        <div className="flex items-center gap-4">
          <div className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            MADE WITH SYNAPS
          </div>

          <div className="h-4 w-px bg-emerald-500/20 hidden sm:block" />

          <span className="font-black text-xl tracking-tighter text-white font-mono hidden sm:inline">
            SYNAPS<span className="text-emerald-400">.AI</span>
          </span>
        </div>

        {/* Search Bar Input (MadeWithGSAP Style) */}
        <div className="flex-1 max-w-md mx-6 hidden md:block relative">
          <div 
            onClick={() => setIsSearchOpen(true)}
            className="w-full px-4 py-2 rounded-full bg-slate-900/80 border border-emerald-500/20 hover:border-emerald-400/50 text-slate-400 text-xs font-mono flex justify-between items-center cursor-pointer transition-all shadow-inner"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              Search modules, agents, twin personas...
            </span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">⌘K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/login"
            className="text-xs font-mono font-bold uppercase tracking-widest px-6 py-2.5 rounded-full border border-emerald-400/40 hover:border-emerald-400 text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105"
          >
            LAUNCH OS →
          </Link>
        </div>
      </header>

      {/* ── HERO BANNER WITH STAT COUNTERS ────────────────────────────── */}
      <section className="relative z-10 pt-12 pb-8 px-8 max-w-7xl mx-auto text-center space-y-6">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-emerald-400" /> OFFICIAL ENTERPRISE SHOWCASE
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-white font-sans uppercase leading-none max-w-5xl mx-auto">
          CURATED SHOWCASE OF ENTERPRISE APPLICATIONS <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-200">MADE WITH SYNAPS</span>
        </h1>

        <p className="text-sm text-slate-300 max-w-3xl mx-auto leading-relaxed font-sans font-normal">
          Explore production-ready decision intelligence modules. Unify CRM, legal contracts, spreadsheets, and emails into a Grounded 3D Memory Graph, 10-Agent Flight Control, and C-Suite Executive Digital Twins.
        </p>

        {/* LIVE METRIC COUNTERS (MADE WITH GSAP STYLE STAT STRIP) */}
        <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
          <div className="px-5 py-2.5 rounded-full bg-slate-900/80 border border-emerald-500/20 text-xs font-mono flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-bold">100+ DOCS</span> INGESTED
          </div>

          <div className="px-5 py-2.5 rounded-full bg-slate-900/80 border border-emerald-500/20 text-xs font-mono flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-white font-bold">10 AI AGENTS</span> FLIGHT CONTROL
          </div>

          <div className="px-5 py-2.5 rounded-full bg-slate-900/80 border border-emerald-500/20 text-xs font-mono flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-300" />
            <span className="text-white font-bold">8 C-SUITE TWINS</span> BOARDROOM SIM
          </div>

          <div className="px-5 py-2.5 rounded-full bg-slate-900/80 border border-emerald-500/20 text-xs font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-bold">99.4% MATH</span> CONFIDENCE
          </div>
        </div>
      </section>

      {/* ── AUTOMATIC SHOWCASE SLIDESHOW (HERO FEATURED CAROUSEL) ─────── */}
      <section id="slideshow" className="relative z-20 px-8 py-6 max-w-7xl mx-auto space-y-6">
        
        {/* Carousel Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/70 border border-emerald-500/25 rounded-2xl p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-emerald-400">
              0{currentSlide + 1} / 0{SHOWCASE_MODULES.length}
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
                onClick={() => setCurrentSlide(prev => (prev - 1 + SHOWCASE_MODULES.length) % SHOWCASE_MODULES.length)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white transition-all border border-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setCurrentSlide(prev => (prev + 1) % SHOWCASE_MODULES.length)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white transition-all border border-slate-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setLightboxImage(activeSlide.image)}
                className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 transition-all border border-emerald-500/30"
                title="Open 4K High-Res Lightbox"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* SCREENSHOT FRAME WITH AUTOPLAY PROGRESS BAR */}
        <div className="relative rounded-3xl border border-emerald-500/30 bg-slate-950 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(16,185,129,0.15)] group">
          
          {isPlaying && (
            <div 
              key={currentSlide}
              className="h-1 bg-gradient-to-r from-emerald-400 to-teal-300 w-full animate-progress-bar origin-left z-30 relative"
            />
          )}

          <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
            <Image 
              src={activeSlide.image}
              alt={activeSlide.title}
              fill
              quality={100}
              priority
              className="object-cover object-top transition-transform duration-700 group-hover:scale-102 filter contrast-[1.05] brightness-[1.02]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85" />

            <button
              onClick={() => setLightboxImage(activeSlide.image)}
              className="absolute top-6 right-6 px-4 py-2 rounded-full bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl"
            >
              <Maximize2 className="w-3.5 h-3.5" /> CLICK FOR 4K LIGHTBOX ZOOM
            </button>

            {/* Slide Information Bar */}
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

                  <button
                    onClick={() => setSelectedModule(activeSlide)}
                    className="px-4 py-2 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    <Info className="w-3.5 h-3.5" /> Full App Details
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-3xl">
                {activeSlide.description}
              </p>
            </div>
          </div>
        </div>

        {/* THUMBNAIL SELECTOR STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          {SHOWCASE_MODULES.map((slide, idx) => (
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

      {/* ── SHOWCASE GRID & FILTER BAR (EXACT MADE WITH GSAP CARDS) ───── */}
      <section id="modules" className="relative z-20 px-8 py-12 max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-emerald-500/15 pb-4">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block">02 // EXPLORE ALL MODULES</span>
            <h2 className="text-3xl font-black text-white uppercase font-sans">SYNAPS Application Suite</h2>
          </div>

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

        {/* Modules Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((item) => (
            <div 
              key={item.id}
              className="p-5 bg-slate-900/60 border border-emerald-500/20 hover:border-emerald-400 rounded-3xl transition-all hover:scale-[1.02] flex flex-col justify-between space-y-4 shadow-lg group"
            >
              <div className="space-y-4">
                <div 
                  onClick={() => setLightboxImage(item.image)}
                  className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 border border-emerald-500/10 cursor-pointer"
                >
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
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span className="text-emerald-400 font-bold uppercase tracking-wider">{item.category}</span>
                    <span>{item.views} views</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors font-sans">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.techStack.map((tech, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center">
                <button
                  onClick={() => setSelectedModule(item)}
                  className="text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5" /> READ APP SPECS & DETAILS
                </button>

                <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>{item.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT SYNAPS / WHY MADE WITH SYNAPS FEATURE GRID ──────────── */}
      <section id="architecture" className="relative z-20 px-8 py-12 max-w-7xl mx-auto space-y-8 border-t border-emerald-500/15">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block">03 // ARCHITECTURE INNOVATION</span>
          <h2 className="text-4xl font-black text-white uppercase font-sans">Why Build With SYNAPS?</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Engineered for high-volume enterprise documents with 0 cloud GPU reliance, perpetual memory, and mathematical confidence verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-emerald-500/20 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white font-sans">Local VLM Vision Engine</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              128-token sliding-window decoder maintaining constant &lt;4GB RAM usage even on 1,000+ page PDF documents inspired by Baidu Unlimited-OCR.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-emerald-500/20 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <h4 className="text-base font-bold text-white font-sans">10-Agent Flight Radar</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Air traffic control flight system running 10 specialized AI agents in parallel through structured shared memory instead of unstructured text prompts.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-emerald-500/20 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white font-sans">Executive Digital Twins</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              8 C-suite synthetic personas (CEO, CFO, CTO, COO, Legal, Sales, Security, HR) offering side-by-side scenario perspectives and risk tolerance alignment.
            </p>
          </div>

        </div>
      </section>

      {/* ── EXPANDABLE APP MODULE DETAILS MODAL (MADE WITH GSAP STYLE) ───── */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
          <div className="w-full max-w-4xl bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative">
            
            <button
              onClick={() => setSelectedModule(null)}
              className="absolute top-6 right-6 p-2.5 rounded-full bg-slate-800 hover:bg-rose-600 text-white transition-all border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                {selectedModule.badge}
              </span>
              <span className="text-xs font-mono text-slate-400">{selectedModule.author} // {selectedModule.date}</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white font-sans">{selectedModule.title}</h2>
              <p className="text-sm font-mono text-emerald-400">{selectedModule.tagline}</p>
            </div>

            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-emerald-500/20">
              <Image 
                src={selectedModule.image}
                alt={selectedModule.title}
                fill
                quality={100}
                className="object-cover object-top"
              />
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Detailed System Architecture</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedModule.fullDetails}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Key Capabilities & Features</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedModule.features.map((feat, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/60 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedModule(null)}
                className="px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold"
              >
                CLOSE DETAILS
              </button>

              <Link
                href="/login"
                className="px-6 py-2.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2"
              >
                LAUNCH MODULE IN OS →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── LIGHTBOX 4K FULLSCREEN ZOOM MODAL ────────────────────────── */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col justify-between p-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
              HIGH RESOLUTION 4K INSPECTOR
            </span>
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
        </div>
      )}

      {/* ── SPOTLIGHT SEARCH MODAL (CMD + K) ────────────────────────── */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-start justify-center pt-20 p-6 animate-fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-emerald-500/20 pb-4">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-emerald-400" />
                <input 
                  type="text"
                  placeholder="Search modules, features, or architecture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-white font-mono text-sm focus:outline-none placeholder:text-slate-500"
                />
              </div>
              <button onClick={() => setIsSearchOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredModules.map(mod => (
                <div 
                  key={mod.id}
                  onClick={() => {
                    setSelectedModule(mod);
                    setIsSearchOpen(false);
                  }}
                  className="p-3 rounded-2xl bg-slate-950/60 hover:bg-emerald-950/40 border border-emerald-500/10 hover:border-emerald-500/40 cursor-pointer flex justify-between items-center transition-all"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white font-sans">{mod.title}</h4>
                    <p className="text-[10px] font-mono text-emerald-400">{mod.category} // {mod.badge}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── COOKIES PERMISSION BOX (EXACT MADE WITH GSAP COPY) ───────── */}
      {cookieConsent === false && (
        <div id="privacy" className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-50 p-6 bg-[#0c1017]/95 border border-emerald-500/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(16,185,129,0.2)] backdrop-blur-2xl space-y-4 animate-slide-up">
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
