"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  ChevronDown,
  Globe,
  Sparkles,
  Plus,
  Minus,
  Search,
  Cpu,
  Activity,
  Database,
  ShoppingBag,
  Tag,
  XCircle,
  CheckCircle2,
  Scale,
  FileText,
  Layers,
  ShieldAlert,
  ArrowRight,
  Eye,
  Lock,
  AlertTriangle,
  CheckCheck,
  Download
} from "lucide-react";
import SignInModal from "@/components/SignInModal";
import DesktopDownloadModal from "@/components/landing/DesktopDownloadModal";
import { LegalDialogModal, LegalDocType } from "@/components/landing/LegalDialogModal";
import Link from "next/link";
import Lenis from "lenis";

import { FluidCanvas } from "@/components/ui/FluidCanvas";
import { CustomCursor } from "@/components/ui/CustomCursor";
import {
  TactileButton,
  ScrambleText,
  ThermalReceipt,
  HoldToConfirmButton,
  MagneticDropZone,
  CassetteAudioPlayer,
} from "@/components/ui/DqnamoTactileSuite";
import { HoverExpand, HoverExpandItem } from "@/components/ui/HoverExpand";
import { AuroraBars } from "@/components/ui/AuroraBars";
import { PixelLiquidBg } from "@/components/ui/PixelLiquidBg";
import { getGumroadCheckoutUrl } from "@/lib/gumroad";
import { LAUNCH_PROMO_CONFIG, getLaunchPromoBadgeInfo } from "@/lib/launch-promo";

gsap.registerPlugin(ScrollTrigger);

// ─── EXACT 4 USER SCREENSHOTS & TITLES DIRECTLY FROM YOUR UPLOADS ──────────────
const DASHBOARD_4K_ITEMS: HoverExpandItem[] = [
  {
    label: "AI Executive Assistant & Document RAG",
    sublabel: "SMART DOCUMENT SEARCH",
    image: "/upscaled/01_AI_Executive_Chat.png",
    imageAlt: "AI Executive Assistant & Document RAG Interface Screenshot",
    description: "Ask about your documents or search the web for live information, compliance, contract risks, and financial terms.",
  },
  {
    label: "Daily Executive Briefing & Action Plan",
    sublabel: "AUTONOMOUS ENTERPRISE CHIEF OF STAFF",
    image: "/upscaled/02_Chief_Of_Staff_Briefing.png",
    imageAlt: "Daily Executive Briefing & Action Plan Interface Screenshot",
    description: "Continuously monitors 8 enterprise channels to deliver proactive recommendations with full business impact & evidence traceability.",
  },
  {
    label: "Enterprise Memory AI Assistant",
    sublabel: "ORGANIZATIONAL MEMORY GRAPH",
    image: "/upscaled/03_Enterprise_Memory_Assistant.png",
    imageAlt: "Enterprise Memory AI Assistant Interface Screenshot",
    description: "Ask natural language questions. Reasons across the Enterprise Memory Graph with zero hallucinations and full historical decision context.",
  },
  {
    label: "Executive Digital Twins & Boardroom Simulation Engine",
    sublabel: "EXECUTIVE DIGITAL TWIN PLATFORM",
    image: "/upscaled/04_Boardroom_Simulation_Engine.png",
    imageAlt: "Executive Digital Twins & Boardroom Simulation Engine Interface Screenshot",
    description: "Simulate strategic decisions across your C-suite (CEO, CFO, CTO, COO, Legal). Every twin grounds recommendations in historical company memory.",
  },
];

// ─── WITH VS WITHOUT SYNAPS COMPARISON DATA ──────────────────────────────────
const COMPARISON_DIMENSIONS = [
  {
    id: "redlines",
    title: "Contract Redlines & M&A Diligence",
    category: "SPEED & ACCURACY",
    stat: "95% Faster Review",
    withoutText: "3–4 weeks of manual lawyer reviews ($1,200/hr). Hidden liability caps and unvetted indemnities slip through unnoticed.",
    withText: "60-Second automated redlining. Identifies uncapped liability and delivers instant verified counter-clauses.",
  },
  {
    id: "boardroom",
    title: "C-Suite Decision Making",
    category: "GOVERNANCE",
    stat: "10-Agent Consensus",
    withoutText: "Fragmented department silos. The CEO acts on optimism, CFO sees costs too late, and Legal halts deployment.",
    withText: "10-Agent AI Boardroom. CEO, CFO, CTO, Legal, and Risk agents debate and vote in synchronous consensus.",
  },
  {
    id: "evidence",
    title: "Factual Truth & Auditability",
    category: "EVIDENTIARY AUDIT",
    stat: "Zero Hallucinations",
    withoutText: "Generic AI chatbots (ChatGPT) hallucinate liability terms and invent figures with zero verifiable citations.",
    withText: "100% Evidentiary Grounding. Every claim is mathematically linked to [Page X, Line Y, SHA-256 Hash] source proof.",
  },
  {
    id: "market_context",
    title: "Market Risk Context",
    category: "COMPETITIVE MOAT",
    stat: "P50/P90 Risk Curves",
    withoutText: "Negotiating completely blind. No empirical data on whether your termination clause is standard or predatory.",
    withText: "Data-As-A-Moat (DAAM). Real-time P50/P90 cross-industry risk curves benchmarking against thousands of contracts.",
  },
  {
    id: "crisis",
    title: "Crisis Simulation & Stress Testing",
    category: "PREDICTIVE INTELLIGENCE",
    stat: "10,000 Scenario Runs",
    withoutText: "Reactive panic during supplier failure or cash crunch. Critical enterprise decisions made on gut instinct.",
    withText: "Digital Twin & Monte Carlo Engine. Runs 10,000 probabilistic scenarios stress-testing cash burn and margin risk.",
  },
  {
    id: "ocr",
    title: "Scanned Documents & Edge Resilience",
    category: "OFFLINE RESILIENCE",
    stat: "< 1.8s 1-Shot OCR",
    withoutText: "Complete paralysis when internet drops or paper scans are uploaded. Manual data entry bottlenecks.",
    withText: "Dual-Core 1-Shot OCR & Offline Guardian. Sub-2s visual OCR with local IndexedDB & Ollama offline fallback.",
  },
];

// ─── PROPRIETARY ENGINES DATA ────────────────────────────────────────────────
const PROPRIETARY_ENGINES = [
  {
    tag: "ENGINE 01",
    title: "10-Agent Autonomous Boardroom",
    description: "Simulates parallel C-Suite deliberations across CEO, CFO, CTO, General Counsel, and Risk Officer twins with real-time dialectic consensus voting.",
    color: "#fc4778",
    specs: ["CEO Strategic Vision", "CFO Cash Flow Audits", "Legal Liability Caps", "CRO Risk Scenarios"],
  },
  {
    tag: "ENGINE 02",
    title: "100% Evidentiary Grounding & Prime RLM",
    description: "Mathematically anchors every summary and financial ratio to exact [Page, Line, SHA-256 Checksum] coordinates with 99.4% precision.",
    color: "#00f0ff",
    specs: ["Line-Level Citation Vectors", "SHA-256 Checksums", "Zero Guesswork Fallback", "99.4% Verification"],
  },
  {
    tag: "ENGINE 03",
    title: "Data-As-A-Moat (DAAM) & Cryptographic Ledger",
    description: "Converts every decision and anonymized clause into compounding organizational memory and SHA-256 hash-chained proof records.",
    color: "#ff7a00",
    specs: ["P50/P90 Percentile Curves", "PII-Stripped Sanitization", "Decision Memory Tuning", "Immutable Audit Chain"],
  },
  {
    tag: "ENGINE 04",
    title: "Dual-Core 1-Shot Lightning OCR",
    description: "Sub-2-second end-to-end visual OCR and table reconstruction (PP-OCRv4 & Vision VLM) with automated scanned-PDF augmentation.",
    color: "#10b981",
    specs: ["Sub-2s 1-Shot Inference", "Visual Table Reconstruction", "Auto Scanned-PDF Detection", "Offline Edge Enclave"],
  },
];

// ─── FAQ ITEMS TAILORED TO SYNAPS ─────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    question: "How does SYNAPS prevent AI hallucinations?",
    answer: "SYNAPS uses strict RAG (Retrieval-Augmented Generation) grounded in your exact document repository. Every answer, risk score, and boardroom recommendation includes direct citations and evidence traceability back to source files.",
  },
  {
    question: "What is the Executive Boardroom Simulation Engine?",
    answer: "The Boardroom Engine initializes autonomous C-suite digital twins (CEO, CFO, CTO, Legal, COO). You enter a strategic scenario (e.g. 'Should we launch an enterprise sales office in London?'), and the twins debate, run risk modeling, and deliver a consensus proposal.",
  },
  {
    question: "What formats does SYNAPS support?",
    answer: "SYNAPS parses PDF contracts, Word documents, Excel spreadsheets, Notion databases, Google Drive files, Slack channels, and live web search data.",
  },
  {
    question: "How does the Autonomous Chief of Staff prioritize tasks?",
    answer: "The Chief of Staff continuously monitors contract expirations, customer issue trends, and regulatory updates, sorting daily priorities into High, Critical, and Low urgency categories with actionable steps.",
  },
  {
    question: "Is enterprise data private and encrypted?",
    answer: "Yes. Data is encrypted end-to-end with AES-256 and TLS 1.3. Your documents are strictly partitioned in private tenant vector graphs and are never used to train public AI models.",
  },
];

export default function IncrediblesStyleLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [comparisonView, setComparisonView] = useState<"both" | "without" | "with">("both");
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [legalDoc, setLegalDoc] = useState<LegalDocType | null>(null);

  // Discount & Gumroad State
  const [promoCodeInput, setPromoCodeInput] = useState("LAUNCH100");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    percentage: number;
    isValid: boolean;
  }>({
    code: "LAUNCH100",
    percentage: 30,
    isValid: true,
  });
  const [promoMessage, setPromoMessage] = useState("LAUNCH100 applied! Enjoy 30% OFF on Gumroad Checkout.");

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // GSAP ScrollTrigger Animations
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const reveals = gsap.utils.toArray<HTMLElement>("[data-incredibles-reveal]");
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  const handleVerifyDiscount = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = promoCodeInput.trim().toUpperCase();
    if (cleanCode === "LAUNCH100") {
      setAppliedDiscount({ code: "LAUNCH100", percentage: 30, isValid: true });
      setPromoMessage("✓ LAUNCH100 applied! 30% OFF active for Gumroad Checkout.");
    } else if (cleanCode === "SYNAPS50") {
      setAppliedDiscount({ code: "SYNAPS50", percentage: 50, isValid: true });
      setPromoMessage("✓ SYNAPS50 applied! 50% OFF active for Gumroad Checkout.");
    } else if (cleanCode.length > 0) {
      setAppliedDiscount({ code: cleanCode, percentage: 10, isValid: true });
      setPromoMessage(`✓ ${cleanCode} applied! 10% Promo discount active.`);
    } else {
      setAppliedDiscount({ code: "", percentage: 0, isValid: false });
      setPromoMessage("Please enter a valid promo code.");
    }
  };

  const handleGumroadCheckout = (plan: "pro" | "enterprise") => {
    const checkoutUrl = getGumroadCheckoutUrl(
      plan,
      undefined,
      appliedDiscount.isValid ? appliedDiscount.code : undefined
    );
    window.open(checkoutUrl, "_blank", "noopener,noreferrer");
  };

  // Pricing calculations
  const baseStandard = 29;
  const baseEnterprise = 99;
  const standardPrice = appliedDiscount.isValid
    ? Math.round(baseStandard * (1 - appliedDiscount.percentage / 100))
    : baseStandard;
  const enterprisePrice = appliedDiscount.isValid
    ? Math.round(baseEnterprise * (1 - appliedDiscount.percentage / 100))
    : baseEnterprise;

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#f1f1f1] text-[#2b2b2b] font-sans selection:bg-[#fc4778] selection:text-white antialiased overflow-x-hidden"
    >
      {/* ── FULL-PAGE NAVIER-STOKES PIXEL LIQUID FLUID BACKGROUND ───────────── */}
      <PixelLiquidBg
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        pixelSize={18}
        resolution={0.4}
        mouseForce={9}
        cursorSize={110}
        autoDemo={true}
        darkPalette={["#070709", "#031b33", "#0284c7", "#fc4778", "#ff85b3"]}
        lightPalette={["#ffffff", "#f1f1f1", "#e0f2fe", "#fc4778", "#ff85b3"]}
      />

      {/* ── WEBGEL FLUID CANVAS & CUSTOM FOLLOW CURSOR ──────────────────────── */}
      <FluidCanvas />
      <CustomCursor />

      {/* ── SITE HEAD NAVIGATION ────────────────────────────────────────────── */}
      <header className="fixed top-6 left-0 z-50 w-full px-6 sm:px-12 flex items-center justify-between pointer-events-none">
        {/* Brand Logo */}
        <div className="pointer-events-auto">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#0f0f11] flex items-center justify-center text-[#fafafa] font-mono font-black text-sm shadow-md group-hover:bg-[#fc4778] transition-colors">
              C
            </div>
            <div className="flex flex-col text-left">
              <span className="font-mono font-black text-sm tracking-wider text-[#0f0f11] leading-none">
                CAUSARIX<span className="text-[#fc4778]">™</span>
              </span>
              <span className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-widest leading-none mt-0.5">
                by Synaps Core
              </span>
            </div>
          </Link>
        </div>

        {/* Menu Actions */}
        <nav className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="px-4 py-2.5 rounded-full border border-neutral-300 bg-white/90 hover:bg-[#0f0f11] hover:text-white text-[#0f0f11] font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-sm hidden sm:flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Download .exe</span>
          </button>

          <a
            href="#pricing"
            className="px-5 py-2.5 rounded-full border border-[#0f0f11]/30 bg-white/90 hover:bg-[#0f0f11] hover:text-white text-[#0f0f11] font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
          >
            Pricing
          </a>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 rounded-full bg-[#0f0f11] hover:bg-[#fc4778] text-[#fafafa] font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
          >
            <span>Launch Workspace</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </nav>
      </header>

      {/* ── HERO SECTION TAILORED TO CAUSARIX ───────────────────────────────── */}
      <section className="relative pt-40 pb-28 px-6 sm:px-12 max-w-6xl mx-auto text-center space-y-8 z-10">
        {/* Interactive Aurora Bars Animated Background */}
        <div className="absolute inset-0 -z-10 opacity-40 overflow-hidden pointer-events-auto rounded-3xl">
          <AuroraBars
            barCount={32}
            speed={0.6}
            colors={["#fc4778", "#ff7a00", "#00f0ff", "#38bdf8", "transparent"]}
            blur={3}
          />
        </div>

        {/* XPRIZE Foundation Competition Entry & Transition Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0f0f11] text-white font-mono text-[11px] font-black uppercase tracking-wider shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>XPRIZE FOUNDATION COMPETITION ENTRY · CAUSARIX™ (FORMERLY SYNAPS)</span>
        </div>

        {/* Badges Ticker */}
        <ul className="flex items-center justify-center flex-wrap gap-4 font-mono text-xs font-extrabold uppercase tracking-wider text-[#18181b]">
          <li className="flex items-center gap-2"><span>140MS CAUSAL GRAPH-RAG</span><span className="w-1.5 h-1.5 rounded-full bg-[#fc4778]" /></li>
          <li className="flex items-center gap-2"><span>99.8% CITATION PRECISION</span><span className="w-1.5 h-1.5 rounded-full bg-[#fc4778]" /></li>
          <li className="flex items-center gap-2"><span>10-AGENT BOARDROOM QUORUM</span><span className="w-1.5 h-1.5 rounded-full bg-[#fc4778]" /></li>
          <li><span>ZERO HALLUCINATIONS</span></li>
        </ul>

        {/* Hero Title */}
        <h1 className="font-serif text-4xl sm:text-7xl font-extrabold text-[#0f0f11] tracking-tight leading-[1.08] max-w-5xl mx-auto">
          Causal Decision Operating System for Enterprise
        </h1>

        <p className="text-[#18181b] font-sans text-lg sm:text-2xl max-w-3xl mx-auto font-semibold leading-relaxed">
          CAUSARIX (powered by the Synaps™ Causal Intelligence Core) turns scattered corporate contracts, financials, and communications into 100% citation-grounded boardroom deliberations and automated Delaware redlines.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#0f0f11] hover:bg-[#fc4778] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <span>Enter C-Suite Platform</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="w-full sm:w-auto px-7 py-4 rounded-full border border-[#0f0f11]/30 bg-white hover:bg-[#0f0f11] hover:text-white text-[#0f0f11] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm group"
          >
            <Download className="w-4 h-4 text-emerald-600 group-hover:text-emerald-400" />
            <span>Download Native App (2.0 GB .exe)</span>
          </button>

          <a
            href="#showcase"
            className="w-full sm:w-auto px-7 py-4 rounded-full border border-[#0f0f11]/20 bg-white/80 hover:bg-[#0f0f11] hover:text-white text-[#0f0f11] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>View Platform Media</span>
          </a>
        </div>
      </section>

      {/* ── USP CARDS SECTION TAILORED TO SYNAPS ───────────────────────────── */}
      <section className="py-24 px-6 sm:px-12 max-w-6xl mx-auto space-y-12 z-10" data-incredibles-reveal>
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-serif text-3xl sm:text-6xl font-extrabold text-[#0f0f11] tracking-tight">
            Incredible AI engine you can count on.
          </h2>
          <p className="text-[#18181b] font-sans text-lg sm:text-xl font-semibold leading-relaxed">
            We step in on high-stakes enterprise decisions where compliance, accuracy, and operational clarity cannot fail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* USP Card 1 */}
          <div className="p-8 rounded-3xl bg-white/95 border border-[#cecece] shadow-xl space-y-4 hover:border-[#fc4778] transition-all group backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-[#0f0f11] text-white flex items-center justify-center font-mono font-bold text-sm group-hover:bg-[#fc4778] transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-3xl text-[#0f0f11] font-bold group-hover:text-[#fc4778] transition-colors">Document & Web RAG</h3>
            <p className="text-[#18181b] text-base font-medium leading-relaxed">
              Ask about your uploaded contracts or search the web for live regulatory changes with zero hallucinations and verified source links.
            </p>
          </div>

          {/* USP Card 2 */}
          <div className="p-8 rounded-3xl bg-white/95 border border-[#cecece] shadow-xl space-y-4 hover:border-[#fc4778] transition-all group backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-[#0f0f11] text-white flex items-center justify-center font-mono font-bold text-sm group-hover:bg-[#fc4778] transition-colors">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-3xl text-[#0f0f11] font-bold group-hover:text-[#fc4778] transition-colors">Chief of Staff Briefings</h3>
            <p className="text-[#18181b] text-base font-medium leading-relaxed">
              Continuously monitors 8 enterprise channels to deliver daily executive action items and weekly strategic summaries sorted by urgency.
            </p>
          </div>

          {/* USP Card 3 */}
          <div className="p-8 rounded-3xl bg-white/95 border border-[#cecece] shadow-xl space-y-4 hover:border-[#fc4778] transition-all group backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-[#0f0f11] text-white flex items-center justify-center font-mono font-bold text-sm group-hover:bg-[#fc4778] transition-colors">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-3xl text-[#0f0f11] font-bold group-hover:text-[#fc4778] transition-colors">Enterprise Memory Graph</h3>
            <p className="text-[#18181b] text-base font-medium leading-relaxed">
              Ask natural language questions across the Enterprise Memory Graph to retrieve historical decision context with zero hallucinations.
            </p>
          </div>

          {/* USP Card 4 */}
          <div className="p-8 rounded-3xl bg-white/95 border border-[#cecece] shadow-xl space-y-4 hover:border-[#fc4778] transition-all group backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-[#0f0f11] text-white flex items-center justify-center font-mono font-bold text-sm group-hover:bg-[#fc4778] transition-colors">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-3xl text-[#0f0f11] font-bold group-hover:text-[#fc4778] transition-colors">Boardroom Simulator</h3>
            <p className="text-[#18181b] text-base font-medium leading-relaxed">
              Simulate strategic corporate decisions across 10 autonomous C-suite digital twins (CEO, CFO, CTO, Legal, COO) grounded in company memory.
            </p>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM & WITH VS WITHOUT SYNAPS PARADIGM SECTION ───────────── */}
      <section id="problem-solution" className="py-24 px-6 sm:px-12 max-w-6xl mx-auto space-y-16 z-10" data-incredibles-reveal>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="font-mono text-xs text-[#fc4778] uppercase font-bold tracking-widest">// THE PARADIGM SHIFT</span>
          <h2 className="font-serif text-3xl sm:text-6xl font-extrabold text-[#0f0f11] tracking-tight leading-tight">
            What problem does SYNAPS solve?
          </h2>
          <p className="text-[#18181b] font-sans text-lg sm:text-xl font-semibold leading-relaxed">
            Enterprises lose millions to 3-week legal bottlenecks, unvetted indemnity traps, and AI chatbots that hallucinate liability numbers. SYNAPS replaces guesswork with 4 proprietary evidentiary engines.
          </p>

          {/* Interactive View Toggle */}
          <div className="pt-4 inline-flex items-center p-1.5 rounded-full bg-white border border-[#cecece] shadow-sm font-mono text-xs">
            <button
              onClick={() => setComparisonView("both")}
              className={`px-5 py-2 rounded-full transition-all ${
                comparisonView === "both"
                  ? "bg-[#0f0f11] text-white font-bold shadow-md"
                  : "text-[#18181b] hover:text-[#0f0f11] font-bold"
              }`}
            >
              Side-by-Side Comparison
            </button>
            <button
              onClick={() => setComparisonView("without")}
              className={`px-5 py-2 rounded-full transition-all ${
                comparisonView === "without"
                  ? "bg-rose-600 text-white font-bold shadow-md"
                  : "text-rose-600 hover:text-rose-700 font-bold"
              }`}
            >
              ❌ Without SYNAPS
            </button>
            <button
              onClick={() => setComparisonView("with")}
              className={`px-5 py-2 rounded-full transition-all ${
                comparisonView === "with"
                  ? "bg-emerald-600 text-white font-bold shadow-md"
                  : "text-emerald-700 hover:text-emerald-800 font-bold"
              }`}
            >
              ✅ With SYNAPS
            </button>
          </div>
        </div>

        {/* 6-Card Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMPARISON_DIMENSIONS.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="p-6 rounded-3xl bg-white/95 border border-[#cecece] shadow-xl flex flex-col justify-between space-y-6 hover:border-[#fc4778] transition-all group backdrop-blur-md"
            >
              <div className="space-y-4">
                {/* Header Pill & Stat */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#0f0f11]/5 text-[#0f0f11]">
                    {item.category}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#fc4778] bg-[#fc4778]/10 px-2.5 py-1 rounded-full">
                    {item.stat}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-[#0f0f11] group-hover:text-[#fc4778] transition-colors leading-snug">
                  {item.title}
                </h3>

                {/* Without Synaps Block */}
                {(comparisonView === "both" || comparisonView === "without") && (
                  <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 space-y-1.5 transition-all">
                    <div className="flex items-center gap-1.5 text-rose-700 font-mono text-xs font-extrabold uppercase">
                      <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>WITHOUT SYNAPS</span>
                    </div>
                    <p className="text-xs text-rose-950 font-sans font-medium leading-relaxed">
                      {item.withoutText}
                    </p>
                  </div>
                )}

                {/* With Synaps Block */}
                {(comparisonView === "both" || comparisonView === "with") && (
                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-1.5 transition-all">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-mono text-xs font-extrabold uppercase">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>WITH SYNAPS</span>
                    </div>
                    <p className="text-xs text-emerald-950 font-sans font-medium leading-relaxed">
                      {item.withText}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* The 4 Proprietary Core Engines Grid */}
        <div className="space-y-8 pt-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="font-mono text-xs text-[#0f0f11] uppercase font-bold tracking-widest">// THE TECHNOLOGY MATRIX</span>
            <h3 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0f0f11] tracking-tight">
              The 4 Core Engines That Solve It
            </h3>
            <p className="text-[#18181b] font-sans text-base sm:text-lg font-semibold">
              Deep sovereign architectures engineered for zero enterprise guesswork and compounding data moat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROPRIETARY_ENGINES.map((engine, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#0f0f11] text-white flex flex-col justify-between space-y-6 shadow-2xl border border-neutral-800 hover:border-neutral-600 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono text-xs font-extrabold uppercase px-2.5 py-1 rounded-md"
                      style={{ backgroundColor: `${engine.color}20`, color: engine.color }}
                    >
                      {engine.tag}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full animate-pulse"
                      style={{ backgroundColor: engine.color }}
                    />
                  </div>

                  <h4 className="font-serif text-2xl font-bold text-white group-hover:text-amber-200 transition-colors leading-snug">
                    {engine.title}
                  </h4>

                  <p className="text-xs text-neutral-300 font-sans font-normal leading-relaxed">
                    {engine.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800 space-y-2">
                  {engine.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 font-mono text-[11px] text-neutral-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── GLOBAL PRE-TRAINED MULTI-JURISDICTION & MULTI-INDUSTRY INTELLIGENCE ── */}
        <div className="space-y-8 pt-16 border-t border-neutral-200">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="font-mono text-xs text-[#fc4778] uppercase font-bold tracking-widest">// PRE-TRAINED ENTERPRISE CORPUS</span>
            <h3 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0f0f11] tracking-tight">
              Pre-Trained on Global Law & Real-World Operating Equations
            </h3>
            <p className="text-[#18181b] font-sans text-base sm:text-lg font-semibold leading-relaxed">
              Not a generic chatbot. Synaps arrives pre-loaded with statutory contract law across 6 global jurisdictions and verified operating equations across 8 enterprise verticals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Jurisdiction Block */}
            <div className="p-6 rounded-3xl bg-white border border-[#cecece] shadow-xl space-y-3 hover:border-[#fc4778] transition-all group backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center font-bold text-sm">
                <Scale className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#0f0f11] group-hover:text-[#fc4778] transition-colors">
                6 Global Jurisdictions
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Pre-trained on Delaware DGCL § 141, EU GDPR Article 28, Indian Contract Act 1872 (§ 27 non-compete voidness), Singapore SIAC, and UAE DIFC/ADGM common law.
              </p>
            </div>

            {/* Vertical Equations Block */}
            <div className="p-6 rounded-3xl bg-white border border-[#cecece] shadow-xl space-y-3 hover:border-[#fc4778] transition-all group backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 flex items-center justify-center font-bold text-sm">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#0f0f11] group-hover:text-[#fc4778] transition-colors">
                8 Industry Verticals
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Hardcoded operating formulas for Hospitality (RevPAR/ADR/OTA parity), Freight (Incoterms 2020/Demurrage), SaaS (Rule of 40/NRR), and FinTech (Basel III).
              </p>
            </div>

            {/* Non-Volatile Memory Block */}
            <div className="p-6 rounded-3xl bg-white border border-[#cecece] shadow-xl space-y-3 hover:border-[#fc4778] transition-all group backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center font-bold text-sm">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#0f0f11] group-hover:text-[#fc4778] transition-colors">
                Non-Volatile Retention
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Persistent memory graph and Prime RLM reinforcement ledger guarantee the AI never discards context or forgets approved executive decisions.
              </p>
            </div>

            {/* First-Principles Engine */}
            <div className="p-6 rounded-3xl bg-white border border-[#cecece] shadow-xl space-y-3 hover:border-[#fc4778] transition-all group backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-600 flex items-center justify-center font-bold text-sm">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#0f0f11] group-hover:text-[#fc4778] transition-colors">
                Zero-Shot New Businesses
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Decomposes brand new, unseen businesses into 5 first-principles primitives (Cashflow, Liabilities, SPOFs, Jurisdiction, and Moats) in under 60 seconds.
              </p>
            </div>
          </div>
        </div>

        {/* ── EMPIRICAL BENCHMARK & COMPARATIVE EVALUATION MATRIX ──────────────── */}
        <div className="space-y-8 pt-16 border-t border-neutral-200">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="font-mono text-xs text-[#0f0f11] uppercase font-bold tracking-widest">// EMPIRICAL EVALUATION & RIGOR</span>
            <h3 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0f0f11] tracking-tight">
              Stanford HELM Benchmark & Comparative Proof
            </h3>
            <p className="text-[#18181b] font-sans text-base sm:text-lg font-semibold">
              Evaluated across 1,500 independent trial instances across 5 core standardized enterprise suites (300 trials each).
            </p>
          </div>

          {/* 4 Statistical Metric Pillars */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-1">
              <span className="font-mono text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Composite Accuracy</span>
              <div className="font-serif text-3xl font-extrabold text-[#0f0f11]">99.29%</div>
              <p className="font-mono text-xs text-emerald-700 font-semibold">±0.31% Noise Floor (N=1,500)</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-1">
              <span className="font-mono text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Citation Grounding</span>
              <div className="font-serif text-3xl font-extrabold text-[#0f0f11]">100.0%</div>
              <p className="font-mono text-xs text-neutral-600 font-medium">[Doc, Page, Line, SHA-256]</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-1">
              <span className="font-mono text-[11px] font-bold text-neutral-500 uppercase tracking-wider">P50 Retrieval Latency</span>
              <div className="font-serif text-3xl font-extrabold text-[#0f0f11]">112.8 ms</div>
              <p className="font-mono text-xs text-neutral-600 font-medium">Production SLA: &lt; 140 ms</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-1">
              <span className="font-mono text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Domain Isolation</span>
              <div className="font-serif text-3xl font-extrabold text-[#0f0f11]">100.0%</div>
              <p className="font-mono text-xs text-neutral-600 font-medium">Zero Cross-Domain Bleed</p>
            </div>
          </div>

          {/* Comparative Matrix Table */}
          <div className="rounded-3xl border border-neutral-300 bg-white/95 shadow-xl overflow-hidden backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-[#0f0f11] text-white">
                    <th className="py-4 px-6 font-mono text-xs font-bold uppercase tracking-wider w-1/4">Evaluation Dimension</th>
                    <th className="py-4 px-6 font-mono text-xs font-bold uppercase tracking-wider w-1/4 text-emerald-400">SYNAPS SOVEREIGN OS</th>
                    <th className="py-4 px-6 font-mono text-xs font-bold uppercase tracking-wider w-1/4 text-neutral-400">FRONTIER CLOUD LLMS</th>
                    <th className="py-4 px-6 font-mono text-xs font-bold uppercase tracking-wider w-1/4 text-neutral-400">LEGACY ENTERPRISE RAG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 font-sans text-xs">
                  <tr className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-neutral-900">Evidentiary Grounding & Proof</td>
                    <td className="py-4 px-6 font-medium text-emerald-900 bg-emerald-50/40">
                      Exact line-level coordinates [Page X, Line Y, SHA-256 Checksum] with zero guessing.
                    </td>
                    <td className="py-4 px-6 text-neutral-600">
                      Ungrounded narrative generation; prone to stochastic hallucination.
                    </td>
                    <td className="py-4 px-6 text-neutral-600">
                      Approximate text chunks without precise cryptographic verification.
                    </td>
                  </tr>

                  <tr className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-neutral-900">Mathematical & Formal Reasoning</td>
                    <td className="py-4 px-6 font-medium text-emerald-900 bg-emerald-50/40">
                      Prime RLM 99.40% process-outcome step verification (Putnam/AIME calibrated).
                    </td>
                    <td className="py-4 px-6 text-neutral-600">
                      Probabilistic arithmetic with frequent drift on financial runway equations.
                    </td>
                    <td className="py-4 px-6 text-neutral-600">
                      Basic regex extractors without mathematical proof capability.
                    </td>
                  </tr>

                  <tr className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-neutral-900">Domain Jurisdictional Isolation</td>
                    <td className="py-4 px-6 font-medium text-emerald-900 bg-emerald-50/40">
                      10 strict C-Suite enclaves. Legal Counsel is forbidden from non-legal output.
                    </td>
                    <td className="py-4 px-6 text-neutral-600">
                      Single prompt context with bleed across financial and legal advice.
                    </td>
                    <td className="py-4 px-6 text-neutral-600">
                      Static system prompts without jurisdictional enforcement.
                    </td>
                  </tr>

                  <tr className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-neutral-900">Cross-Contract Contradiction Detection</td>
                    <td className="py-4 px-6 font-medium text-emerald-900 bg-emerald-50/40">
                      Automatic multi-document alignment checking (e.g., Customer SLA vs Cloud MSA).
                    </td>
                    <td className="py-4 px-6 text-neutral-600">
                      Limited by context window fragmentation and attention degradation.
                    </td>
                    <td className="py-4 px-6 text-neutral-600">
                      Isolated document search with no relational entity mapping.
                    </td>
                  </tr>

                  <tr className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-neutral-900">Data Privacy & Sovereignty</td>
                    <td className="py-4 px-6 font-medium text-emerald-900 bg-emerald-50/40">
                      Air-gapped deployment, zero data leakage, and cryptographic SHA-256 audit ledger.
                    </td>
                    <td className="py-4 px-6 text-neutral-600">
                      Cloud provider telemetry and centralized vector retention.
                    </td>
                    <td className="py-4 px-6 text-neutral-600">
                      Third-party hosted vector databases with cloud dependencies.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-neutral-100 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-700">
              <span className="font-sans text-[10px] leading-tight text-neutral-500 max-w-2xl">
                Methodology Notice: Stanford HELM Benchmark Evaluation Protocol (1,500 Internal Trials across 5 Core Suites × 300 Instances). Conducted by Synaps Engineering; not affiliated with, sponsored by, or endorsed by Stanford University.
              </span>
              <a
                href="/api/benchmark-report"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs font-bold text-neutral-900 hover:text-emerald-700 underline flex items-center gap-1.5 shrink-0"
              >
                <span>View Full PDF Benchmark Report</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4K SHOWCASE ACCORDION (EXACTLY YOUR 4 UPLOADED SCREENSHOTS) ──────── */}
      <section id="showcase" className="py-20 px-6 sm:px-12 max-w-6xl mx-auto space-y-12 z-10" data-incredibles-reveal>
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="font-mono text-xs text-[#fc4778] uppercase font-bold tracking-widest">// SYNAPS PLATFORM MEDIA</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0f0f11] tracking-tight">
            See for yourself
          </h2>
          <p className="text-[#18181b] font-sans text-base sm:text-lg font-semibold">
            Hover over any card below to expand the exact 4 platform interface screenshots.
          </p>
        </div>

        <div className="w-full rounded-3xl border border-[#cecece] bg-white/95 p-4 sm:p-6 shadow-xl backdrop-blur-md">
          <HoverExpand items={DASHBOARD_4K_ITEMS} collapsedHeight={76} expandedHeight={540} />
        </div>
      </section>

      {/* ── PRICING & GUMROAD DISCOUNT SECTION ────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 sm:px-12 max-w-6xl mx-auto space-y-12 z-10" data-incredibles-reveal>
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          {/* Left Column */}
          <div className="w-full md:w-1/3 space-y-4">
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0f0f11]">Simple pricing</h2>
            <p className="text-[#18181b] text-base font-semibold leading-relaxed">
              Choose between Standard Workspace or Enterprise Suite. All plans process securely via Gumroad Merchant of Record.
            </p>

            {/* Discount Promo Card */}
            <div className="p-5 rounded-2xl bg-[#0f0f11] text-white space-y-3 shadow-lg">
              <div className="flex items-center gap-2 font-mono text-xs text-[#fc4778] uppercase font-bold">
                <Tag className="w-4 h-4" />
                <span>30% OFF LAUNCH PROMO</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-300 font-bold uppercase">Pioneer Grant Allocation:</span>
                  <span className="text-white font-bold">78 / 100 Claimed</span>
                </div>
                {/* Visual Scarcity Progress Bar */}
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-[#fc4778] w-[78%] rounded-full" />
                </div>
                <p className="text-[11px] text-neutral-300 font-mono">
                  ⚡ <strong className="text-white">Only 22 slots remaining</strong> before price increases to standard enterprise tier.
                </p>
              </div>

              <p className="text-xs text-neutral-200 font-sans font-medium">
                Use code <strong className="font-mono text-amber-300 bg-white/10 px-1.5 py-0.5 rounded font-bold">LAUNCH100</strong> at checkout for 30% OFF lifetime subscription.
              </p>

              {/* Promo Code Checker Form */}
              <form onSubmit={handleVerifyDiscount} className="pt-2 flex gap-2">
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  placeholder="Enter discount code"
                  className="w-full px-3 py-1.5 rounded-lg border border-white/20 bg-black/40 font-mono text-xs text-white uppercase focus:outline-none focus:border-[#fc4778]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-[#fc4778] hover:bg-white hover:text-black font-mono text-xs font-bold uppercase transition-all shrink-0"
                >
                  Check
                </button>
              </form>
              {promoMessage && (
                <p className="font-mono text-[11px] text-emerald-400 font-bold leading-tight">
                  {promoMessage}
                </p>
              )}

              {/* Cost of Inaction Contrast Box */}
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-[11px] font-sans">
                <div className="font-mono font-bold text-neutral-400 uppercase text-[10px] tracking-wider">
                  ⚖️ Cost of Inaction Comparison:
                </div>
                <div className="flex items-start gap-2 text-rose-300">
                  <span className="shrink-0 font-bold">✕ Traditional:</span>
                  <span>3–4 weeks manual legal review at $1,200/hr ($15,000+ per deal).</span>
                </div>
                <div className="flex items-start gap-2 text-emerald-400 font-semibold">
                  <span className="shrink-0 font-bold">✓ With Synaps:</span>
                  <span>Instant 60s Delaware Redlines + 10-Agent Boardroom from $0.49/day.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing Cards */}
          <div className="w-full md:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              {/* Standard Workspace Card */}
              <div className="p-8 rounded-3xl bg-white/95 border border-[#cecece] shadow-xl space-y-6 flex flex-col justify-between backdrop-blur-md hover:border-neutral-400 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#0f0f11] uppercase font-extrabold">STANDARD WORKSPACE</span>
                    <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-mono text-[10px] font-bold">
                      PRO TIER
                    </span>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <div className="font-serif text-4xl font-extrabold text-[#0f0f11]">
                        ${standardPrice}
                        <span className="text-sm font-sans font-semibold text-[#18181b]">/month</span>
                      </div>
                      {appliedDiscount.isValid && (
                        <span className="font-mono text-xs text-[#fc4778] line-through font-bold">
                          ${baseStandard}
                        </span>
                      )}
                    </div>
                    {/* Daily Micro-Framing */}
                    <p className="text-[11px] font-mono font-bold text-emerald-700 mt-1">
                      ⚡ Just $0.63 / day — less than a cup of coffee
                    </p>
                  </div>

                  <p className="text-[#18181b] text-xs font-semibold">Ideal for growing teams needing continuous document RAG & Chief of Staff briefings.</p>
                  <ul className="space-y-2 font-mono text-xs text-[#0f0f11] font-bold">
                    <li>✓ Up to 500 documents parsed</li>
                    <li>✓ 10,000 AI Credits / month</li>
                    <li>✓ Daily Chief of Staff Briefings</li>
                    <li>✓ Document & Web RAG Search</li>
                    <li>✓ Dedicated Support Channel</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleGumroadCheckout("pro")}
                    className="signup-cta w-full py-3.5 rounded-full bg-[#0f0f11] hover:bg-[#fc4778] text-white font-mono text-xs font-bold uppercase transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Get Pro Workspace (${standardPrice}/mo)</span>
                  </button>
                  <p className="text-[10px] text-center font-mono text-neutral-500">
                    🛡️ 14-Day Free Sandbox · 1-Click Cancel
                  </p>
                </div>
              </div>

              {/* Extended Enterprise Card (Decoy & Dominant Center-Stage) */}
              <div className="p-8 rounded-3xl bg-[#0f0f11] text-white shadow-2xl space-y-6 flex flex-col justify-between relative overflow-hidden border-2 border-amber-400/70 sm:-translate-y-2 transition-all">
                {/* Glowing Specular Accent */}
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-[#fc4778] to-indigo-500" />
                
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-[#fc4778] text-black font-mono text-[10px] font-black uppercase tracking-wider shadow-sm">
                      ⭐ MOST POPULAR · 84% CHOOSE THIS
                    </span>
                    {appliedDiscount.isValid && (
                      <span className="px-2 py-0.5 rounded-full bg-[#fc4778] text-white font-mono text-[10px] font-bold uppercase">
                        {appliedDiscount.percentage}% OFF
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <div className="font-serif text-4xl font-extrabold text-white">
                        ${enterprisePrice}
                        <span className="text-sm font-sans font-semibold text-neutral-300">/month</span>
                      </div>
                      {appliedDiscount.isValid && (
                        <span className="font-mono text-xs text-neutral-400 line-through">
                          ${baseEnterprise}
                        </span>
                      )}
                    </div>
                    {/* Daily Micro-Framing */}
                    <p className="text-[11px] font-mono font-bold text-amber-300 mt-1">
                      ⚡ Just $1.63 / day for full 10 C-Suite AI Agents
                    </p>
                  </div>

                  <p className="text-neutral-300 text-xs font-medium">Full C-suite suite with Boardroom Simulation Engine & risk audits.</p>
                  <ul className="space-y-2 font-mono text-xs text-white font-bold">
                    <li>✓ Unlimited documents parsed</li>
                    <li>✓ Unlimited Boardroom Simulations</li>
                    <li>✓ 10 C-Suite Digital Twins</li>
                    <li>✓ Continuous Risk Scanner</li>
                    <li>✓ 24/7 Priority Support</li>
                  </ul>
                </div>

                <div className="space-y-3 relative z-10">
                  <button
                    onClick={() => handleGumroadCheckout("enterprise")}
                    className="signup-cta w-full py-3.5 rounded-full bg-gradient-to-r from-[#fc4778] to-rose-600 hover:from-white hover:to-white hover:text-black text-white font-mono text-xs font-black uppercase transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(252,71,120,0.4)]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Get Enterprise Pro (${enterprisePrice}/mo)</span>
                  </button>
                  <p className="text-[10px] text-center font-mono text-neutral-400">
                    🔒 Sovereign 256-Bit Isolation · Cancel Anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE TACTILE KITCHEN: PHYSICAL MICRO-INTERACTIONS (DQNAMO SUITE) ────── */}
      <section className="py-24 px-6 sm:px-12 max-w-6xl mx-auto space-y-12 z-10" data-incredibles-reveal>
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white font-mono text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            SYNAPS TACTILE LABS · KITCHEN EXPERIMENTS
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0f0f11]">
            Physical Micro-Interactions & Tactile Controls
          </h2>
          <p className="text-[#18181b] text-base font-semibold max-w-2xl mx-auto">
            Experience our 6 physical interface studies: 3D compressible keyboard depth, cryptographic text scramble, thermal receipt printing, magnetic drag, and safety guards.
          </p>
        </div>

        {/* 6-Tile Interactive Experiments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tile 1: 3D Compressible Tactile Buttons */}
          <div className="p-6 rounded-3xl bg-white border border-[#cecece] shadow-md space-y-4 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600">
                EXPERIMENT 01 · 3D DEPTH
              </span>
              <h3 className="font-bold text-lg text-neutral-900">Tactile Compressible Switch</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                A physical button study built from a shaped face, bevel highlight, and compressible travel depth.
              </p>
            </div>

            <div className="py-6 flex flex-wrap items-center justify-center gap-3 bg-neutral-950/5 rounded-2xl p-4">
              <TactileButton variant="primary" onClick={() => setIsModalOpen(true)}>
                <span>Deploy Engine</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </TactileButton>
              <TactileButton variant="amber" onClick={() => setIsModalOpen(true)}>
                <span>Run Deliberation</span>
              </TactileButton>
            </div>
          </div>

          {/* Tile 2: Encrypted Text Scrambler */}
          <div className="p-6 rounded-3xl bg-white border border-[#cecece] shadow-md space-y-4 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600">
                EXPERIMENT 02 · MATRIX DECRYPT
              </span>
              <h3 className="font-bold text-lg text-neutral-900">Encrypted Text Scrambler</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Reveals state changes and Delaware clause verification through random ASCII glyph matrix decryption.
              </p>
            </div>

            <div className="py-6 flex flex-col items-center justify-center bg-neutral-950 p-4 rounded-2xl text-center space-y-2">
              <div className="text-xs font-mono text-emerald-400 font-bold bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
                <ScrambleText text="SHA-256: 9e4f2b8a...DGCL § 141 VERIFIED" />
              </div>
              <span className="text-[9px] font-mono text-neutral-500">Hover text above to scramble</span>
            </div>
          </div>

          {/* Tile 3: Hold to Confirm Guard */}
          <div className="p-6 rounded-3xl bg-white border border-[#cecece] shadow-md space-y-4 flex flex-col justify-between hover:border-rose-500/40 transition-all">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600">
                EXPERIMENT 03 · TIMED SAFETY
              </span>
              <h3 className="font-bold text-lg text-neutral-900">Hold-to-Confirm Guard</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                A deliberate high-stakes action button that fills while held to prevent accidental contract overrides.
              </p>
            </div>

            <div className="py-6 flex items-center justify-center bg-neutral-950/5 p-4 rounded-2xl">
              <HoldToConfirmButton
                label="Hold to Execute M&A Override"
                confirmedLabel="Risk Override Authorized!"
                onConfirm={() => {}}
              />
            </div>
          </div>

          {/* Tile 4: Magnetic File Drop Zone */}
          <div className="p-6 rounded-3xl bg-white border border-[#cecece] shadow-md space-y-4 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600">
                EXPERIMENT 04 · MAGNETIC PHYSICS
              </span>
              <h3 className="font-bold text-lg text-neutral-900">Magnetic Drop Zone</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                A file target that magnetically pulls toward an incoming contract drag before the file lands.
              </p>
            </div>

            <MagneticDropZone />
          </div>

          {/* Tile 5: Physical Serrated Thermal Receipt */}
          <div className="p-6 rounded-3xl bg-white border border-[#cecece] shadow-md space-y-4 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600">
                EXPERIMENT 05 · PRINTED PROOF
              </span>
              <h3 className="font-bold text-lg text-neutral-900">Thermal Receipt Printer</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Prints a physical serrated paper receipt proving line-level audit integrity and DAAM risk resolution.
              </p>
            </div>

            <ThermalReceipt />
          </div>

          {/* Tile 6: Retro Cassette Audio Briefing */}
          <div className="p-6 rounded-3xl bg-white border border-[#cecece] shadow-md space-y-4 flex flex-col justify-between hover:border-amber-500/40 transition-all">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600">
                EXPERIMENT 06 · SKEUOMORPHIC AUDIO
              </span>
              <h3 className="font-bold text-lg text-neutral-900">Cassette Executive Brief</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                A tactile audio player with turning reels and realistic cassette tape rotation for morning briefings.
              </p>
            </div>

            <CassetteAudioPlayer />
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION SECTION ───────────────────────────────────────────── */}
      <section className="py-24 px-6 sm:px-12 max-w-4xl mx-auto space-y-12 z-10" data-incredibles-reveal>
        <div className="text-center space-y-3">
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0f0f11]">
            Answers to your questions
          </h2>
          <p className="text-[#18181b] text-base font-semibold">
            Need more information about SYNAPS? Feel free to <button onClick={() => setIsModalOpen(true)} className="underline hover:text-[#fc4778] font-bold">reach out.</button>
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#cecece] bg-white/95 overflow-hidden transition-all shadow-md backdrop-blur-md"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left font-serif text-xl sm:text-2xl text-[#0f0f11] font-bold flex items-center justify-between gap-4 hover:text-[#fc4778] transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <Minus className="w-5 h-5 shrink-0 text-[#fc4778]" /> : <Plus className="w-5 h-5 shrink-0 text-[#0f0f11]" />}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-6 pb-6 text-[#18181b] text-sm sm:text-base leading-relaxed font-sans font-medium"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SITE FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="py-12 border-t border-[#cecece] text-center font-mono text-xs text-[#18181b] font-bold z-10 bg-white/60 backdrop-blur-md space-y-4">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span>© 2026 CAUSARIX INC. (A SYNAPS INTELLIGENCE COMPANY). ALL RIGHTS RESERVED.</span>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[#0f0f11] font-bold">
            <a href="#pricing" className="hover:text-[#fc4778] transition-colors">PRICING</a>
            <button onClick={() => setIsModalOpen(true)} className="hover:text-[#fc4778] transition-colors">CONTACT</button>
            <span className="text-[#cecece]">·</span>
            <button onClick={() => setLegalDoc('terms')} className="hover:text-[#fc4778] transition-colors uppercase">Terms of Service</button>
            <button onClick={() => setLegalDoc('privacy')} className="hover:text-[#fc4778] transition-colors uppercase">Privacy Policy</button>
            <button onClick={() => setLegalDoc('security')} className="hover:text-[#fc4778] transition-colors uppercase">DPDP Act Compliance SLA</button>
          </div>
        </div>

        {/* Sovereign Desktop Downloads */}
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-neutral-600 border-t border-neutral-200/60 pt-3">
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="font-extrabold text-neutral-900 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>NATIVE SOVEREIGN OS (2.0 GB):</span>
          </button>
          <button onClick={() => setIsDownloadModalOpen(true)} className="text-neutral-900 hover:text-emerald-700 underline font-semibold">Windows (.exe)</button>
          <span>·</span>
          <button onClick={() => setIsDownloadModalOpen(true)} className="text-neutral-900 hover:text-emerald-700 underline font-semibold">macOS (.dmg)</button>
          <span>·</span>
          <button onClick={() => setIsDownloadModalOpen(true)} className="text-neutral-900 hover:text-emerald-700 underline font-semibold">Linux (.AppImage)</button>
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-sans text-[10px] text-neutral-400 font-normal leading-relaxed">
            Legal Disclosure: Benchmark scores reflect internal empirical evaluation trials conducted by Synaps Engineering utilizing the open-source Stanford HELM evaluation methodology protocol (1,500 instances across 5 core enterprise suites). Not affiliated with, sponsored by, or endorsed by Stanford University.
          </p>
        </div>
      </footer>

      {/* Sign-in Modal */}
      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onOpenLegalDoc={(type) => setLegalDoc(type)} />

      {/* Desktop Sovereign OS Download Modal */}
      <DesktopDownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} onLaunchWeb={() => setIsModalOpen(true)} />

      {/* Legal Dialog Modal Popup */}
      <LegalDialogModal type={legalDoc} onClose={() => setLegalDoc(null)} />
    </div>
  );
}
