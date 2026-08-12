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
  Tag
} from "lucide-react";
import SignInModal from "@/components/SignInModal";
import Link from "next/link";
import Lenis from "lenis";

import { FluidCanvas } from "@/components/ui/FluidCanvas";
import { CustomCursor } from "@/components/ui/CustomCursor";
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
  const [pricingTab, setPricingTab] = useState<"single" | "recurring">("recurring");
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

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

  // Calculator State
  const [projectType, setProjectType] = useState("workspace");
  const [projectCreativity, setProjectCreativity] = useState("enhanced");

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
  const baseStandard = 7;
  const baseEnterprise = 20;
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
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#0f0f11] flex items-center justify-center text-[#fafafa] font-mono font-bold text-sm shadow-md group-hover:bg-[#fc4778] transition-colors">
              S
            </div>
            <span className="font-mono font-extrabold text-sm tracking-wider text-[#0f0f11]">
              SYNAPS
            </span>
          </Link>
        </div>

        {/* Menu Actions */}
        <nav className="flex items-center gap-3 pointer-events-auto">
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

      {/* ── HERO SECTION TAILORED TO SYNAPS ─────────────────────────────────── */}
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
        {/* Badges Ticker */}
        <ul className="flex items-center justify-center flex-wrap gap-4 font-mono text-xs font-extrabold uppercase tracking-wider text-[#18181b]">
          <li className="flex items-center gap-2"><span>140MS QUERY SPEED</span><span className="w-1.5 h-1.5 rounded-full bg-[#fc4778]" /></li>
          <li className="flex items-center gap-2"><span>99.8% PRECISION RAG</span><span className="w-1.5 h-1.5 rounded-full bg-[#fc4778]" /></li>
          <li className="flex items-center gap-2"><span>10 DIGITAL TWINS</span><span className="w-1.5 h-1.5 rounded-full bg-[#fc4778]" /></li>
          <li><span>ZERO HALLUCINATIONS</span></li>
        </ul>

        {/* Hero Title */}
        <h1 className="font-serif text-4xl sm:text-7xl font-extrabold text-[#0f0f11] tracking-tight leading-[1.08] max-w-5xl mx-auto">
          AI Executive Intelligence Suite for Enterprise Decisions
        </h1>

        <p className="text-[#18181b] font-sans text-lg sm:text-2xl max-w-3xl mx-auto font-semibold leading-relaxed">
          SYNAPS turns your company's scattered documents, contracts, and web data into evidence-grounded answers, boardroom simulations, and daily chief of staff action plans.
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

          <a
            href="#showcase"
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-[#0f0f11]/30 bg-white hover:bg-[#0f0f11] hover:text-white text-[#0f0f11] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>View Platform Media (4 Screenshots)</span>
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
              Choose between monthly engagement or single workspace compliance audits. All plans process securely via Gumroad Merchant of Record.
            </p>

            {/* Discount Promo Card */}
            <div className="p-5 rounded-2xl bg-[#0f0f11] text-white space-y-3 shadow-lg">
              <div className="flex items-center gap-2 font-mono text-xs text-[#fc4778] uppercase font-bold">
                <Tag className="w-4 h-4" />
                <span>30% OFF LAUNCH PROMO</span>
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
            </div>
          </div>

          {/* Right Column: Pricing Switcher & Cards */}
          <div className="w-full md:w-2/3 space-y-8">
            {/* Tab Toggle */}
            <div className="inline-flex items-center p-1.5 rounded-full bg-white border border-[#cecece] shadow-sm font-mono text-xs">
              <button
                onClick={() => setPricingTab("recurring")}
                className={`px-6 py-2.5 rounded-full transition-all ${
                  pricingTab === "recurring"
                    ? "bg-[#0f0f11] text-white font-bold shadow-md"
                    : "text-[#18181b] hover:text-[#0f0f11] font-bold"
                }`}
              >
                Monthly Engagement
              </button>
              <button
                onClick={() => setPricingTab("single")}
                className={`px-6 py-2.5 rounded-full transition-all ${
                  pricingTab === "single"
                    ? "bg-[#0f0f11] text-white font-bold shadow-md"
                    : "text-[#18181b] hover:text-[#0f0f11] font-bold"
                }`}
              >
                Single Audit Project
              </button>
            </div>

            {/* Recurring Cards */}
            {pricingTab === "recurring" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Standard Card */}
                <div className="p-8 rounded-3xl bg-white/95 border border-[#cecece] shadow-xl space-y-6 flex flex-col justify-between backdrop-blur-md">
                  <div className="space-y-4">
                    <span className="font-mono text-xs text-[#fc4778] uppercase font-extrabold">STANDARD WORKSPACE</span>
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
                    <p className="text-[#18181b] text-xs font-semibold">Ideal for growing teams needing continuous document RAG & Chief of Staff briefings.</p>
                    <ul className="space-y-2 font-mono text-xs text-[#0f0f11] font-bold">
                      <li>✓ Up to 500 documents parsed</li>
                      <li>✓ 10,000 AI Credits / month</li>
                      <li>✓ Daily Chief of Staff Briefings</li>
                      <li>✓ Document & Web RAG Search</li>
                      <li>✓ Dedicated Support Channel</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => handleGumroadCheckout("pro")}
                    className="w-full py-3.5 rounded-full bg-[#0f0f11] hover:bg-[#fc4778] text-white font-mono text-xs font-bold uppercase transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Pay with Gumroad (${standardPrice})</span>
                  </button>
                </div>

                {/* Extended Enterprise Card */}
                <div className="p-8 rounded-3xl bg-[#0f0f11] text-white shadow-xl space-y-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[#fc4778] uppercase font-extrabold">ENTERPRISE PRO</span>
                      {appliedDiscount.isValid && (
                        <span className="px-2 py-0.5 rounded-full bg-[#fc4778] text-white font-mono text-[10px] font-bold uppercase">
                          {appliedDiscount.percentage}% OFF
                        </span>
                      )}
                    </div>
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
                    <p className="text-neutral-300 text-xs font-medium">Full C-suite suite with Boardroom Simulation Engine & risk audits.</p>
                    <ul className="space-y-2 font-mono text-xs text-white font-bold">
                      <li>✓ Unlimited documents parsed</li>
                      <li>✓ Unlimited Boardroom Simulations</li>
                      <li>✓ 10 C-Suite Digital Twins</li>
                      <li>✓ Continuous Risk Scanner</li>
                      <li>✓ 24/7 Priority Support</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => handleGumroadCheckout("enterprise")}
                    className="w-full py-3.5 rounded-full bg-[#fc4778] hover:bg-white hover:text-black text-white font-mono text-xs font-bold uppercase transition-all relative z-10 shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Pay via Gumroad (${enterprisePrice})</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Single Audit Calculator Form */
              <div className="p-8 rounded-3xl bg-white/95 border border-[#cecece] shadow-xl space-y-6 backdrop-blur-md">
                <h3 className="font-serif text-2xl font-extrabold text-[#0f0f11]">Single Compliance Audit</h3>
                <p className="text-[#18181b] text-xs font-mono font-bold">
                  For one-time M&A data room audits, contract liability scans, or regulatory reviews.
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-mono text-xs text-[#0f0f11] font-bold uppercase">1 // Audit Type</label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-[#cecece] bg-white font-sans text-sm text-[#0f0f11] font-semibold focus:outline-none focus:border-[#fc4778]"
                    >
                      <option value="workspace">Contract Liability & Indemnification Scan</option>
                      <option value="data-room">M&A Data Room Audit</option>
                      <option value="regulatory">DPDP Act Compliance Review</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="font-mono text-xs text-[#0f0f11] font-bold uppercase">2 // Document Volume</label>
                    <select
                      value={projectCreativity}
                      onChange={(e) => setProjectCreativity(e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-[#cecece] bg-white font-sans text-sm text-[#0f0f11] font-semibold focus:outline-none focus:border-[#fc4778]"
                    >
                      <option value="standard">Up to 100 Documents</option>
                      <option value="enhanced">100 — 500 Documents</option>
                      <option value="creative">500+ Documents (Data Room)</option>
                    </select>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0f0f11] text-white space-y-2">
                  <span className="font-mono text-xs text-[#fc4778] uppercase font-bold">ESTIMATED AUDIT INVESTMENT</span>
                  <div className="font-serif text-3xl font-extrabold">
                    {projectType === "workspace" ? "$2,500 — $4,500" : "$6,500 — $12,000"}
                  </div>
                </div>
              </div>
            )}
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
      <footer className="py-12 border-t border-[#cecece] text-center font-mono text-xs text-[#18181b] font-bold z-10 bg-white/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 SYNAPS INTELLIGENCE INC. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-6 text-[#0f0f11] font-bold">
            <a href="#pricing" className="hover:text-[#fc4778] transition-colors">PRICING</a>
            <button onClick={() => setIsModalOpen(true)} className="hover:text-[#fc4778] transition-colors">CONTACT</button>
          </div>
        </div>
      </footer>

      {/* Sign-in Modal */}
      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
