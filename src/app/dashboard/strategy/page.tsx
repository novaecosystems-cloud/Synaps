'use client';

import React, { useState } from 'react';
import { 
  Compass, Sparkles, Loader2, Globe, Rocket, Briefcase, 
  CheckCircle2, ShieldAlert, AlertTriangle, Users, DollarSign, 
  Scale, FileText, ArrowRight, ChevronRight, Layers, Flame, 
  Award, TrendingUp, Calendar, Zap, RefreshCw, SlidersHorizontal, Search, Check, HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ActiveKnowledgeSelector } from '@/components/ActiveKnowledgeSelector';

export interface PlaybookOption {
  id: string;
  optionNum: string;
  name: string;
  subtitle: string;
  forWho: string;
  icon: any;
  color: string;
  steps: string[];
  outcome: string;
  fitSignals: string[];
  resourcesRequired: string[];
  monetizationLogic: string[];
  successOutcome: string;
  idealProfile: {
    traits: string[];
    runway: string;
    coreRisk: string;
    keyAdvantage: string;
  };
}

const PLAYBOOKS: PlaybookOption[] = [
  {
    id: 'waitlist',
    optionNum: 'Option 1',
    name: 'Waitlist Strategy',
    subtitle: 'Manufacture early demand through edgy content & controlled scarcity',
    forWho: 'For: Content creators & community builders',
    icon: Flame,
    color: 'emerald',
    steps: [
      'Create edgy sales content & hook',
      'Build email waitlist landing page',
      'Launch beta cohort with lifetime discount',
      'Iterate with 50+ customer feedback calls',
      'Relaunch cohort at higher pricing'
    ],
    outcome: 'Full public launch',
    fitSignals: [
      'Strong visual or video marketing capability',
      'Underserved community or fan base',
      'Novel product concept needing social validation'
    ],
    resourcesRequired: [
      'Landing page builder & email automation',
      '3-6 month runway',
      'Direct customer interview setup'
    ],
    monetizationLogic: [
      'Convert early hype into early paid beta slots',
      'Increase price with each cohort launch',
      'Build long-term community LTV'
    ],
    successOutcome: 'High-Converting Waitlist & Loyal Beta Cohort',
    idealProfile: {
      traits: ['Content Creator', 'Email Marketing Skills'],
      runway: '3-6 Month Runway',
      coreRisk: 'Waitlist fatigue if launch delays exceed 90 days',
      keyAdvantage: '50+ calls provide deep product-market fit insights'
    }
  },
  {
    id: 'wave_surfer',
    optionNum: 'Option 2',
    name: 'Wave Surfer Strategy',
    subtitle: 'Capitalize on viral moments by shipping fast and monetizing attention',
    forWho: 'For: Fast builders & trend spotters',
    icon: Zap,
    color: 'amber',
    steps: [
      'Find trending viral topic or tech wave',
      'Ship functional tool within 48 hours',
      'Build built-in shareability into product',
      'Monetize with ads or immediate micro-transactions',
      'Create scarcity in ad spots or premium tiers'
    ],
    outcome: 'Trend-driven launch live',
    fitSignals: [
      'High-velocity 48-hour development capability',
      'Ability to spot breaking internet & tech trends',
      'Viral organic distribution advantage'
    ],
    resourcesRequired: [
      'Rapid prototype stack (Next.js/Vite)',
      '48-hour focus window',
      'Ad/Payment gateway ready'
    ],
    monetizationLogic: [
      'Instant monetization on peak traffic spike',
      'Sponsor ad placements & micro-upsells',
      'Reinvest traffic into secondary SaaS'
    ],
    successOutcome: 'Viral Traffic Spike & Rapid Early Revenue',
    idealProfile: {
      traits: ['Fast Builder', 'Trend Awareness'],
      runway: '48-Hour Availability',
      coreRisk: 'Trend dies before monetization kicks in',
      keyAdvantage: 'Near-zero CAC through organic viral momentum'
    }
  },
  {
    id: 'language_arbitrage',
    optionNum: 'Option 3',
    name: 'Language Arbitrage',
    subtitle: 'Replicate proven SaaS products in underserved language markets with local SEO dominance',
    forWho: 'For: Multilingual entrepreneurs',
    icon: Globe,
    color: 'blue',
    steps: [
      'Copy proven SaaS concept to new language market',
      'Lean heavily into local cultural identity & support',
      'Execute localized SEO in target language',
      'Target low-difficulty, high-intent local keywords',
      'Establish dominant local market share'
    ],
    outcome: 'Localized growth engine',
    fitSignals: [
      'Bilingual or native non-English speaker',
      'Proven English SaaS with zero local competitors',
      'Local payment method integration required'
    ],
    resourcesRequired: [
      'Native translation & localized copywriting',
      'SEO tools & local domain registration',
      '6-12 month horizon'
    ],
    monetizationLogic: [
      'First-mover local SaaS pricing',
      'Capture non-English enterprise buyers',
      'High retention due to local support'
    ],
    successOutcome: 'Localized Monopoly & High Organic Retention',
    idealProfile: {
      traits: ['Bilingual / Native Speaker', 'SEO Knowledge'],
      runway: '6-12 Month Horizon',
      coreRisk: 'Original English product enters market before scale',
      keyAdvantage: 'Proven concept + low-competition keywords = fast ranking'
    }
  },
  {
    id: 'ai_search',
    optionNum: 'Option 4',
    name: 'AI Search Strategy',
    subtitle: 'Dominate AI-powered search results with strategic comparison content & high-intent positioning',
    forWho: 'For: SEO experts, B2B SaaS & content marketers',
    icon: Sparkles,
    color: 'purple',
    steps: [
      'Find OP marketing channel & high-intent search terms',
      'Build vs/alternative comparison & feature pages',
      'Optimize content for AI search engines (Perplexity, SearchGPT, Gemini)',
      'Focus on bottom-of-funnel conversion content',
      'Achieve compounding organic conversion'
    ],
    outcome: 'AI search engine running',
    fitSignals: [
      'B2B SaaS or tool-based product',
      'Competitors with established market presence',
      'Clear, defensible product differentiation'
    ],
    resourcesRequired: [
      'Part-time SEO/content writer',
      '$500-2K/month content budget',
      '3-6 months runway & analytics setup'
    ],
    monetizationLogic: [
      'Capture high-intent comparison shoppers',
      'Convert users searching for competitor alternatives',
      'Lower CAC through organic search compounding'
    ],
    successOutcome: 'Consistent High-Intent Organic Traffic & Auto-Conversions',
    idealProfile: {
      traits: ['SEO & AI Content Specialist', 'Analytical Marketer'],
      runway: '3-6 Month Runway',
      coreRisk: 'Search engine algorithm updates',
      keyAdvantage: 'Captures ready-to-buy users actively comparing solutions'
    }
  },
  {
    id: 'signal_search',
    optionNum: 'Option 5',
    name: 'Signal Search Strategy',
    subtitle: 'Validate demand through scarcity, then scale with premium pricing & enterprise sales',
    forWho: 'For: Video creators & B2B founders',
    icon: TrendingUp,
    color: 'rose',
    steps: [
      'Ship one core feature fast',
      'Distribute across YouTube + X + email newsletter',
      'Cap early user access to enforce demand scarcity',
      'Raise pricing 4x for next tier',
      'Test high-ticket enterprise custom packages',
      'Focus sales on high-converting YouTube demos'
    ],
    outcome: 'Demand validated & scaled',
    fitSignals: [
      'B2B founder with strong video or demo capability',
      'Product solving painful business workflow',
      'High willingness-to-pay from enterprise buyers'
    ],
    resourcesRequired: [
      'High-quality product video demo setup',
      'Outbound email + X distribution',
      'Custom pricing & invoice system'
    ],
    monetizationLogic: [
      'Aggressive pricing raises (4x multiplier)',
      'High-ticket enterprise packages',
      'Maximize Revenue-per-Customer over volume'
    ],
    successOutcome: 'High ACV (Annual Contract Value) & Scaled Enterprise Revenue',
    idealProfile: {
      traits: ['Video Creator', 'B2B Founder'],
      runway: '1-3 Month Runway',
      coreRisk: 'Failing to communicate premium enterprise value',
      keyAdvantage: 'High-ticket pricing allows profitability on low volume'
    }
  },
  {
    id: 'high_ticket_ad',
    optionNum: 'Option 6',
    name: 'High-Ticket Ad Strategy',
    subtitle: 'Scale paid acquisition for high-value offers using proven ad frameworks & direct sales teams',
    forWho: 'For: Premium service providers & $1K+ ACV SaaS',
    icon: Award,
    color: 'cyan',
    steps: [
      'Create high-converting VSSL (Video Short Sales Letter)',
      'Run targeted Meta & LinkedIn ads',
      'Utilize AIDA (Attention, Interest, Desire, Action) framework',
      'Test 5-10 ads to hit target CPA goal',
      'Budget $10K to achieve initial profitability',
      'Scale acquisition with dedicated sales closers'
    ],
    outcome: 'Paid acquisition engine running',
    fitSignals: [
      'Offer price point > $1,000 or high LTV',
      'Established sales call closing process',
      'Available ad testing budget ($2K-$10K)'
    ],
    resourcesRequired: [
      'Professional VSSL video producer',
      'Ad manager (Meta / LinkedIn)',
      'Closing sales team'
    ],
    monetizationLogic: [
      'Direct ROAS (Return on Ad Spend) positive scaling',
      'High margin upfront sales close',
      'Predictable revenue pipeline'
    ],
    successOutcome: 'Predictable Paid Customer Acquisition Engine',
    idealProfile: {
      traits: ['Paid Ads Specialist', 'Sales Team Leader'],
      runway: '$10K+ Capital Budget',
      coreRisk: 'High CPA if offer positioning is weak',
      keyAdvantage: 'Instant, predictable scaling unconstrained by organic algorithms'
    }
  }
];

export default function StrategyPage() {
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>('ai_search');
  
  // Interactive Assessment Form State
  const [budget, setBudget] = useState('1000');
  const [speed, setSpeed] = useState('48h');
  const [audience, setAudience] = useState('none');
  const [contentSkill, setContentSkill] = useState('limited');
  const [complexity, setComplexity] = useState('simple');
  const [language, setLanguage] = useState('english');
  const [distribution, setDistribution] = useState('zero');
  const [isHighTicket, setIsHighTicket] = useState(false);

  const [recommendedId, setRecommendedId] = useState<string | null>('ai_search');
  const [evaluating, setEvaluating] = useState(false);

  const handleCalculateRecommendation = () => {
    setEvaluating(true);

    setTimeout(() => {
      let rec = 'ai_search';

      if (speed === '48h' && budget === '1000') {
        rec = 'wave_surfer';
      } else if (language === 'multilingual') {
        rec = 'language_arbitrage';
      } else if (isHighTicket || budget === '10000') {
        rec = 'high_ticket_ad';
      } else if (audience === 'established' || contentSkill === 'video') {
        rec = 'signal_search';
      } else if (contentSkill === 'writing' || audience === 'small') {
        rec = 'waitlist';
      } else {
        rec = 'ai_search';
      }

      setRecommendedId(rec);
      setSelectedPlaybookId(rec);
      setEvaluating(false);
    }, 400);
  };

  const selectedPlaybook = PLAYBOOKS.find(p => p.id === selectedPlaybookId) || PLAYBOOKS[3];

  return (
    <div className="w-full space-y-8 font-sans pb-20 text-base-content">
      
      {/* Header Banner */}
      <div className="p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 text-white rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
            <Rocket className="w-3.5 h-3.5 text-indigo-400" /> Decision Framework for Product Launches
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Choose the Right Launch Playbook for Your Product
          </h1>
          <p className="text-xs text-indigo-200/70 leading-relaxed">
            Not every product launch follows the same path. Our framework maps six distinct strategies—each tailored to your skills, resources, offer type, speed requirements, and distribution advantages. Stop guessing and start executing with clarity.
          </p>
        </div>

        <div className="p-4 bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl text-xs space-y-2 z-10 shrink-0 text-right">
          <span className="font-bold uppercase tracking-wider text-indigo-300 block text-[10px]">Your Journey</span>
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold">
            <span>Select Strategy</span> ➔ <span>Execute Steps</span> ➔ <span>Iterate & Scale</span>
          </div>
        </div>
      </div>

      {/* Active Knowledge Selector Bar */}
      <ActiveKnowledgeSelector />

      {/* ── SECTION 1: INTERACTIVE QUICK ASSESSMENT TOOL ────────────── */}
      <div className="p-6 bg-base-100 border border-base-300 rounded-3xl shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-base-200 pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-base-content flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-indigo-500" /> Find Your Perfect Launch Strategy
            </h2>
            <p className="text-xs text-base-content/60 mt-0.5">Answer a few questions about your resources, skills, and goals to discover which playbook aligns best with your situation.</p>
          </div>
          <span className="badge badge-primary badge-sm font-mono text-[10px]">Quick Assessment</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Budget */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-base-content/70">Available Budget</label>
            <select value={budget} onChange={e => setBudget(e.target.value)} className="select select-sm w-full bg-base-200 border-base-300 rounded-xl text-xs">
              <option value="1000">Under $1,000</option>
              <option value="5000">$1,000 - $5,000</option>
              <option value="25000">$5,000 - $25,000</option>
              <option value="10000">$25,000+</option>
            </select>
          </div>

          {/* Speed */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-base-content/70">Speed Priority</label>
            <select value={speed} onChange={e => setSpeed(e.target.value)} className="select select-sm w-full bg-base-200 border-base-300 rounded-xl text-xs">
              <option value="48h">Launch within 48 hours</option>
              <option value="2w">1 - 2 weeks</option>
              <option value="1m">1 month</option>
              <option value="3m">3+ months</option>
            </select>
          </div>

          {/* Existing Audience */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-base-content/70">Existing Audience</label>
            <select value={audience} onChange={e => setAudience(e.target.value)} className="select select-sm w-full bg-base-200 border-base-300 rounded-xl text-xs">
              <option value="none">No audience yet</option>
              <option value="small">Small audience (&lt;1k)</option>
              <option value="established">Established (&gt;10k)</option>
            </select>
          </div>

          {/* Content Creation Ability */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-base-content/70">Content Creation Ability</label>
            <select value={contentSkill} onChange={e => setContentSkill(e.target.value)} className="select select-sm w-full bg-base-200 border-base-300 rounded-xl text-xs">
              <option value="limited">Limited - prefer minimal content</option>
              <option value="video">High video capability (YouTube/TikTok)</option>
              <option value="writing">Deep writing capability (SEO/Blogs)</option>
            </select>
          </div>

          {/* Product Complexity */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-base-content/70">Product Complexity</label>
            <select value={complexity} onChange={e => setComplexity(e.target.value)} className="select select-sm w-full bg-base-200 border-base-300 rounded-xl text-xs">
              <option value="simple">Simple tool/feature</option>
              <option value="saas">Mid-level B2B SaaS</option>
              <option value="enterprise">Enterprise platform</option>
            </select>
          </div>

          {/* Language Advantage */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-base-content/70">Language Advantage</label>
            <select value={language} onChange={e => setLanguage(e.target.value)} className="select select-sm w-full bg-base-200 border-base-300 rounded-xl text-xs">
              <option value="english">English only</option>
              <option value="multilingual">Multilingual (Bilingual/Native non-English)</option>
            </select>
          </div>

          {/* Distribution Strength */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-base-content/70">Distribution Strength</label>
            <select value={distribution} onChange={e => setDistribution(e.target.value)} className="select select-sm w-full bg-base-200 border-base-300 rounded-xl text-xs">
              <option value="zero">Starting from zero</option>
              <option value="seo">Existing SEO domain</option>
              <option value="viral">Viral social network</option>
            </select>
          </div>

          {/* High Ticket Offer */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-base-content/70">High-Ticket Offer ($1K+)?</label>
            <div className="flex items-center gap-4 pt-1 text-xs font-semibold">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="highticket" checked={isHighTicket} onChange={() => setIsHighTicket(true)} className="radio radio-xs radio-primary" />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="highticket" checked={!isHighTicket} onChange={() => setIsHighTicket(false)} className="radio radio-xs radio-primary" />
                <span>No</span>
              </label>
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <Button onClick={handleCalculateRecommendation} disabled={evaluating} className="rounded-2xl gap-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
            {evaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {evaluating ? 'Evaluating Playbooks...' : 'Get My Recommendation'}
          </Button>

          {recommendedId && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs flex items-center gap-3 animate-in fade-in duration-300">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <span className="font-extrabold text-emerald-400 uppercase tracking-wider text-[10px] block">Recommended Playbook</span>
                <strong className="text-sm font-bold text-base-content">
                  {PLAYBOOKS.find(p => p.id === recommendedId)?.name}
                </strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION 2: COMPLETE PLAYBOOK FRAMEWORK (6 CARDS) ─────────── */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight text-base-content flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" /> Complete Playbook Framework
          </h2>
          <span className="text-xs text-base-content/60">Click any playbook to view detailed execution blueprint</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLAYBOOKS.map((playbook) => {
            const Icon = playbook.icon;
            const isSelected = selectedPlaybookId === playbook.id;
            const isRecommended = recommendedId === playbook.id;

            return (
              <div
                key={playbook.id}
                onClick={() => setSelectedPlaybookId(playbook.id)}
                className={cn(
                  "p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between relative shadow-sm hover:shadow-md",
                  isSelected 
                    ? "bg-base-100 border-indigo-500 ring-2 ring-indigo-500/30" 
                    : "bg-base-100 border-base-300 hover:border-indigo-500/40"
                )}
              >
                {isRecommended && (
                  <span className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-[9px] uppercase tracking-wider shadow">
                    Best Match
                  </span>
                )}

                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                      {playbook.optionNum}
                    </span>
                    <Icon className="w-5 h-5 text-indigo-500" />
                  </div>

                  <h3 className="text-lg font-extrabold text-base-content mb-1">{playbook.name}</h3>
                  <span className="text-[11px] text-base-content/60 font-medium block mb-4">{playbook.forWho}</span>

                  <p className="text-xs text-base-content/80 mb-5 leading-relaxed">{playbook.subtitle}</p>

                  <div className="space-y-2 mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 block">Execution Flow</span>
                    {playbook.steps.slice(0, 4).map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-base-content/80 font-medium">
                        <span className="w-4 h-4 rounded-full bg-base-200 text-indigo-500 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="truncate">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-base-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {playbook.outcome}
                  </span>
                  <span className="text-indigo-500 font-bold hover:underline flex items-center gap-0.5">
                    View Blueprint <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 3: PLAYBOOK DEEP-DIVE BLUEPRINT INSPECTOR ───────── */}
      {selectedPlaybook && (
        <div className="p-8 bg-base-100 border border-indigo-500/30 rounded-3xl shadow-xl space-y-6 animate-in fade-in duration-300">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-base-200 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
                <selectedPlaybook.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">{selectedPlaybook.optionNum}</span>
                  <h3 className="text-2xl font-extrabold tracking-tight text-base-content">{selectedPlaybook.name} Blueprint</h3>
                </div>
                <p className="text-xs text-base-content/60 mt-0.5">{selectedPlaybook.subtitle}</p>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Goal: {selectedPlaybook.successOutcome}
            </div>
          </div>

          {/* Grid Blueprint Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Fit Signals */}
            <div className="p-5 bg-base-200/50 border border-base-300 rounded-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Fit Signals
              </span>
              <ul className="space-y-2 text-xs text-base-content/80 font-medium">
                {selectedPlaybook.fitSignals.map((sig, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{sig}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Required */}
            <div className="p-5 bg-base-200/50 border border-base-300 rounded-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" /> Resources Required
              </span>
              <ul className="space-y-2 text-xs text-base-content/80 font-medium">
                {selectedPlaybook.resourcesRequired.map((res, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Monetization Logic */}
            <div className="p-5 bg-base-200/50 border border-base-300 rounded-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" /> Monetization Logic
              </span>
              <ul className="space-y-2 text-xs text-base-content/80 font-medium">
                {selectedPlaybook.monetizationLogic.map((mon, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{mon}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Ideal Profile Risk & Advantage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs space-y-1">
              <strong className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Core Risk:
              </strong>
              <p className="text-base-content/80">{selectedPlaybook.idealProfile.coreRisk}</p>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs space-y-1">
              <strong className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Key Advantage:
              </strong>
              <p className="text-base-content/80">{selectedPlaybook.idealProfile.keyAdvantage}</p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
