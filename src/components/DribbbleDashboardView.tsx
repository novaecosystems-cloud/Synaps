'use client';

import React, { useState } from 'react';
import { 
  Search, SlidersHorizontal, Sparkles, ShieldCheck, 
  BrainCircuit, ArrowUpRight, Filter, Sun, Moon, CheckCircle2,
  FileText, Activity, Layers, Globe, ShieldAlert, Cpu, Eye, ExternalLink, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import Link from 'next/link';

export interface SynapsCardItem {
  id: string;
  title: string;
  category: 'Legal Contract' | 'Financial Audit' | 'AI Boardroom' | 'Risk Engine' | '3D Graph' | 'Media Studio';
  author: string;
  authorBadge: 'PRO' | 'MAX' | 'VERIFIED' | 'PRIME RLM';
  authorAvatar: string;
  previewGradient: string;
  previewImage?: string;
  scoreMetric: string; // e.g. "99.4%" or "$50 ⚡" or "INR 50L"
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  citationsCount: number;
  description: string;
  linkHref: string;
  tags: string[];
}

const SAMPLE_SYNAPS_CARDS: SynapsCardItem[] = [
  {
    id: 'c1',
    title: 'Master Legal Vendor SLA & DPDP Compliance Audit',
    category: 'Legal Contract',
    author: 'Legal & Compliance Lead',
    authorBadge: 'VERIFIED',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    previewGradient: 'from-cyan-900/60 via-slate-900 to-blue-950',
    previewImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
    scoreMetric: '99.4% PRIME',
    riskLevel: 'LOW',
    citationsCount: 14,
    description: 'Cryptographic SHA-256 hash-chained legal packet covering ToS, Privacy, DPDP Act, and Security SLA.',
    linkHref: '/dashboard/audit',
    tags: ['Legal', 'DPDP Act', 'SOC 2', 'Audit Trail']
  },
  {
    id: 'c2',
    title: '10-Agent Autonomous Executive AI Boardroom Debate',
    category: 'AI Boardroom',
    author: 'CEO & Boardroom Suite',
    authorBadge: 'PRO',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    previewGradient: 'from-emerald-950 via-slate-900 to-teal-900/60',
    previewImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
    scoreMetric: 'INR 50L Tier',
    riskLevel: 'LOW',
    citationsCount: 28,
    description: 'Parallel multi-agent debate (CEO, CFO, CTO, Legal) on Q3 strategic expansion and capital runway.',
    linkHref: '/dashboard/boardroom',
    tags: ['Boardroom', '10-Agent', 'Consensus', 'Strategy']
  },
  {
    id: 'c3',
    title: '3D Spatial Knowledge Graph & Memory Palace',
    category: '3D Graph',
    author: 'Chief Architect Agent',
    authorBadge: 'MAX',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    previewGradient: 'from-purple-950 via-slate-900 to-indigo-950',
    previewImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    scoreMetric: '1M Tokens',
    riskLevel: 'LOW',
    citationsCount: 42,
    description: 'Interactive Three.js 3D memory node map linking corporate contracts, vendor entities, and risk triggers.',
    linkHref: '/dashboard/graph',
    tags: ['3D Graph', 'Memory Palace', 'GLM-5.2', 'Spatial']
  },
  {
    id: 'c4',
    title: 'Enterprise Risk Prediction & Monte Carlo Simulator',
    category: 'Risk Engine',
    author: 'Chief Risk Officer',
    authorBadge: 'PRIME RLM',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    previewGradient: 'from-amber-950 via-slate-900 to-rose-950',
    previewImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    scoreMetric: '99.4% Accuracy',
    riskLevel: 'MODERATE',
    citationsCount: 19,
    description: 'Process-outcome verified probability curve analyzing 1,000 simulated operational outage scenarios.',
    linkHref: '/dashboard/simulations',
    tags: ['Monte Carlo', 'Risk P90', 'PutnamBench', 'Predictive']
  },
  {
    id: 'c5',
    title: 'WebGL Diffusion Studio & Media Timeline Engine',
    category: 'Media Studio',
    author: 'Creative Studio Agent',
    authorBadge: 'PRO',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    previewGradient: 'from-blue-950 via-slate-900 to-cyan-950',
    previewImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
    scoreMetric: '60 FPS WebCodecs',
    riskLevel: 'LOW',
    citationsCount: 8,
    description: 'Hardware-accelerated non-linear video timeline editor with kinetic typography and Higgsfield MCP support.',
    linkHref: '/dashboard/mission-control',
    tags: ['WebCodecs', 'WebGL', 'Higgsfield MCP', 'Timeline']
  },
  {
    id: 'c6',
    title: 'Q3 Financial Forecast & Capital Runway Audit',
    category: 'Financial Audit',
    author: 'CFO Financial Lead',
    authorBadge: 'VERIFIED',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80',
    previewGradient: 'from-emerald-900/60 via-slate-900 to-green-950',
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    scoreMetric: 'INR 50L Budget',
    riskLevel: 'LOW',
    citationsCount: 31,
    description: 'Audited pre-seed allocation: ₹25L dev talent, ₹12L GPU/LLM infrastructure, ₹8L B2B marketing, ₹5L legal.',
    linkHref: '/dashboard/analytics',
    tags: ['Finance', 'INR 50L', 'Runway', 'Allocation']
  }
];

const CATEGORY_CHIPS = [
  'All Knowledge Cards',
  'Legal Contracts',
  'AI Boardroom',
  'Risk Engine',
  '3D Graph',
  'Financial Audit',
  'Media Studio',
  'High Risk (P90)'
];

export function DribbbleDashboardView() {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Knowledge Cards');
  const [quickVerifiedOnly, setQuickVerifiedOnly] = useState(false);

  // Filter Cards
  const filteredCards = SAMPLE_SYNAPS_CARDS.filter(card => {
    const matchesSearch = searchQuery === '' || 
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All Knowledge Cards' ||
      (selectedCategory === 'Legal Contracts' && card.category === 'Legal Contract') ||
      (selectedCategory === 'AI Boardroom' && card.category === 'AI Boardroom') ||
      (selectedCategory === 'Risk Engine' && card.category === 'Risk Engine') ||
      (selectedCategory === '3D Graph' && card.category === '3D Graph') ||
      (selectedCategory === 'Financial Audit' && card.category === 'Financial Audit') ||
      (selectedCategory === 'Media Studio' && card.category === 'Media Studio') ||
      (selectedCategory === 'High Risk (P90)' && card.riskLevel !== 'LOW');

    const matchesVerified = !quickVerifiedOnly || card.authorBadge === 'VERIFIED' || card.authorBadge === 'PRIME RLM';

    return matchesSearch && matchesCategory && matchesVerified;
  });

  return (
    <div className="w-full min-h-screen bg-background text-foreground transition-colors duration-300 p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* 🔍 DRIBBBLE STYLE TOP SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-card/60 backdrop-blur-xl border border-border p-3 rounded-3xl shadow-sm">
        
        {/* Search Input Box */}
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Synaps documents, 3D graphs, boardroom debates, or legal risk..."
            className="w-full pl-12 pr-24 py-3 bg-muted/30 dark:bg-muted/10 text-sm font-medium rounded-2xl border border-transparent focus:border-primary focus:bg-background outline-none transition-all"
          />
          <div className="absolute right-3 flex items-center gap-1">
            <span className="px-2 py-1 text-[10px] font-mono font-bold uppercase rounded-lg bg-background border border-border text-muted-foreground shadow-xs">
              ⌘K
            </span>
          </div>
        </div>

        {/* Action Controls & Theme Toggle */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Quick Verified Filter Toggle */}
          <button
            onClick={() => setQuickVerifiedOnly(!quickVerifiedOnly)}
            className={cn(
              "px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border",
              quickVerifiedOnly 
                ? "bg-primary text-primary-foreground border-primary shadow-md" 
                : "bg-muted/30 hover:bg-muted/60 text-muted-foreground border-border"
            )}
          >
            <Zap className={cn("h-3.5 w-3.5", quickVerifiedOnly ? "fill-current" : "")} />
            <span>Prime RLM Verified</span>
          </button>

          {/* Theme Toggle Button (Light/Dark Mode) */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-2xl bg-muted/30 hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-all flex items-center gap-2"
            title="Toggle Light / Dark Theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="text-xs font-bold uppercase hidden sm:inline">
              {theme === 'dark' ? 'Dark' : 'Light'}
            </span>
          </button>
        </div>
      </div>

      {/* 🏷️ DRIBBBLE STYLE CATEGORY TAG CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_CHIPS.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border shadow-2xs",
              selectedCategory === cat
                ? "bg-foreground text-background border-foreground font-bold shadow-sm"
                : "bg-card hover:bg-muted text-muted-foreground border-border"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 📊 RESULTS HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
          <span>Results for</span>
          <span className="text-primary capitalize">"{selectedCategory}"</span>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {filteredCards.length} Knowledge Cards
          </span>
        </h2>

        <div className="text-xs font-mono text-muted-foreground hidden sm:flex items-center gap-2">
          <span>Sort by:</span>
          <span className="font-bold text-foreground cursor-pointer hover:underline">Prime RLM Score ⚡</span>
        </div>
      </div>

      {/* 🎴 DRIBBBLE 4-COLUMN CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCards.map((card) => (
          <div 
            key={card.id}
            className="group bg-card hover:bg-card/90 border border-border hover:border-primary/50 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Card Visual Preview Box */}
            <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br p-4 flex flex-col justify-between">
              {/* Background Image / Overlay */}
              {card.previewImage ? (
                <img 
                  src={card.previewImage} 
                  alt={card.title} 
                  className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                />
              ) : null}
              <div className={cn("absolute inset-0 bg-gradient-to-t opacity-90", card.previewGradient)} />

              {/* Top Badges */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md text-white border border-white/20">
                  {card.category}
                </span>

                <span className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider shadow-md backdrop-blur-md",
                  card.authorBadge === 'PRIME RLM' ? "bg-amber-500 text-black border border-amber-300" :
                  card.authorBadge === 'MAX' ? "bg-cyan-600 text-white border border-cyan-400" :
                  card.authorBadge === 'PRO' ? "bg-cyan-600 text-white border border-cyan-400" :
                  "bg-emerald-600 text-white border border-emerald-400"
                )}>
                  {card.authorBadge}
                </span>
              </div>

              {/* Bottom Metric Score Pill */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-background/80 backdrop-blur-md text-foreground font-mono font-bold text-xs border border-border shadow-md flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  {card.scoreMetric}
                </span>

                <span className="text-[11px] font-mono text-white/80 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-xs">
                  {card.citationsCount} Proof Lines
                </span>
              </div>
            </div>

            {/* Card Content & Author Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <Link href={card.linkHref} className="group-hover:text-primary transition-colors">
                  <h3 className="font-bold text-base leading-snug line-clamp-2">
                    {card.title}
                  </h3>
                </Link>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {card.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {card.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-muted/40 text-[10px] font-medium text-muted-foreground border border-border/50">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Footer Author & Action Link */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src={card.authorAvatar} 
                    alt={card.author} 
                    className="h-6 w-6 rounded-full object-cover border border-border"
                  />
                  <span className="text-xs font-semibold text-muted-foreground truncate max-w-[110px]">
                    {card.author}
                  </span>
                </div>

                <Link 
                  href={card.linkHref}
                  className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 group/btn"
                >
                  <span>Inspect</span>
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
