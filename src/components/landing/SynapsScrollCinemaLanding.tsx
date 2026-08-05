'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  FileText, Search, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle,
  GitCompare, Sparkles, Layers, Eye, Check, ExternalLink, ChevronRight,
  Database, RefreshCw, Lock, Zap, FileSpreadsheet, Building2, HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SYNAPS SCROLL-CINEMA LANDING PAGE
 * ─────────────────────────────────────────────────────────────────────────────
 * An interactive scroll-scrubbed cinematic product launch film using financials.mp4
 * Theme: premium product launch, documentary forensic investigation, absolute credibility.
 */

interface DocumentCardData {
  title: string;
  category: string;
  date: string;
  pages: number;
  highlightClause?: string;
  risk?: string;
}

const DEMO_DOCUMENTS: DocumentCardData[] = [
  {
    title: "Master_Services_Agreement_2026.pdf",
    category: "Commercial Contracts",
    date: "Jan 14, 2026",
    pages: 42,
    highlightClause: "Section 8.4: Vendor guarantees fixed pricing unless written notice is served 45 days prior to Oct 15 renewal.",
    risk: "14% Escalation Risk"
  },
  {
    title: "Apex_Hotels_India_Q3_Operations_SOP.pdf",
    category: "Hotel Operations & SOPs",
    date: "Aug 02, 2026",
    pages: 28,
    highlightClause: "SOP #104: Monthly HVAC maintenance required at Jaipur & Delhi properties.",
    risk: "Clean"
  },
  {
    title: "ISO_27001_Guest_Data_Security_Audit.pdf",
    category: "Compliance & Security",
    date: "May 19, 2026",
    pages: 18,
    highlightClause: "Section 9.3: Zero-Trust AI policy strictly prohibits unvetted public LLM uploads.",
    risk: "SOC 2 Type II Verified"
  },
  {
    title: "Financial_Audit_Report_3_Hotels_Q2.xlsx",
    category: "Financial Audits",
    date: "Jul 11, 2026",
    pages: 12,
    highlightClause: "F&B COGS increased from 28.2% to 34.6% resulting in ₹38.4L quarterly margin leakage.",
    risk: "Margin Leakage"
  },
  {
    title: "APAC_Expansion_Strategic_Risk_Matrix.pdf",
    category: "Executive Strategy",
    date: "Jun 30, 2026",
    pages: 35,
    highlightClause: "Capital reallocation of ₹18.5L recommended for Jaipur property infrastructure.",
    risk: "Action Needed"
  }
];

const INTERACTIVE_QUESTIONS = [
  {
    id: 'q1',
    question: "What risks are hidden in this contract?",
    answer: "Section 8.4 contains an automatic 14% annual cost escalation clause triggering on Nov 1 unless written notice is served 45 days prior (Oct 15).",
    docName: "Master_Services_Agreement_2026.pdf",
    page: "Page 8",
    section: "Section 8.4 — Price Adjustments",
    clauseText: "In the event Customer does not issue written notice of non-renewal at least forty-five (45) days prior to the Renewal Date, rates shall automatically adjust upward by fourteen percent (14%).",
    riskLevel: "HIGH",
    recommendation: "Serve written non-renewal notice before Oct 15, 2026 to renegotiate capped escalation at 4."
  },
  {
    id: 'q2',
    question: "How does this compare with last year's agreement?",
    answer: "Compared to 2025 MSA: 15-day notice window removed, 14% uncapped price increase added, and Zero-Trust DPA obligations introduced.",
    docName: "Master_Services_Agreement_2026.pdf vs 2025_MSA.pdf",
    page: "Pages 8 & 14",
    section: "Delta Comparison Matrix",
    clauseText: "+ Section 14.1 Zero-Trust DPA Clause Added | - Section 9.3 15-day Renewal Notice Removed | Base Fee +4.2%",
    riskLevel: "MODERATE",
    recommendation: "Align Section 14.1 with internal CISO Zero-Trust directives before final signature."
  },
  {
    id: 'q3',
    question: "Where is financial leakage occurring across properties?",
    answer: "F&B cost of goods sold (COGS) increased from 28.2% to 34.6% across Mumbai & Delhi properties, causing ₹38.4L quarterly leakage.",
    docName: "Financial_Audit_Report_3_Hotels_Q2.xlsx",
    page: "Sheet 3, Cell F14",
    section: "F&B COGS Variance Schedule",
    clauseText: "Raw produce price spikes from Royal Agri Supplies contributed 78% of the total cost overrun.",
    riskLevel: "HIGH",
    recommendation: "Enforce bulk purchasing caps under F&B Procurement Contract #APX-FB-2026."
  },
  {
    id: 'q4',
    question: "Should management approve this vendor?",
    answer: "Approve with conditions. Vendor passes SOC 2 Type II audit but requires strict price-cap amendment before execution.",
    docName: "Vendor_Security_&_Legal_Deduction_Brief.pdf",
    page: "Page 2",
    section: "Executive Recommendation",
    clauseText: "Security score 99.4% (Passed). Commercial terms require mandatory 4% escalation ceiling.",
    riskLevel: "LOW",
    recommendation: "Approve vendor subject to execution of Addendum B (Price Cap Agreement)."
  }
];

export default function SynapsScrollCinemaLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeScene, setActiveScene] = useState(1);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [decodingFrames, setDecodingFrames] = useState(true);

  // Interactive Question Explorer State
  const [selectedQuestion, setSelectedQuestion] = useState(INTERACTIVE_QUESTIONS[0]);

  // Capabilities tab
  const [activeTab, setActiveTab] = useState<'read' | 'find' | 'connect' | 'verify' | 'decide'>('read');

  // GSAP ScrollTrigger timeline setup
  useEffect(() => {
    let active = true;
    let scrollTriggerInstance: any = null;

    const initScrubTrigger = () => {
      const video = videoRef.current;
      if (!video) {
        if (active) requestAnimationFrame(initScrubTrigger);
        return;
      }

      const setupScrollScrub = () => {
        setVideoLoaded(true);
        setDecodingFrames(false);
        const duration = video.duration || 10;

        if (scrollTriggerInstance) return;

        scrollTriggerInstance = ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.1, // Smooth scrub
          onUpdate: (self) => {
            const progress = self.progress;
            setScrollProgress(progress);

            // Update active scene based on progress
            const currentProgress = progress * 100;
            if (currentProgress < 10) setActiveScene(1);
            else if (currentProgress < 20) setActiveScene(2);
            else if (currentProgress < 35) setActiveScene(3);
            else if (currentProgress < 48) setActiveScene(4);
            else if (currentProgress < 60) setActiveScene(5);
            else if (currentProgress < 70) setActiveScene(6);
            else if (currentProgress < 80) setActiveScene(7);
            else if (currentProgress < 90) setActiveScene(8);
            else if (currentProgress < 95) setActiveScene(9);
            else setActiveScene(10);

            // Scrub video currentTime smoothly
            const targetTime = progress * duration;
            if (!isNaN(targetTime)) {
              video.currentTime = targetTime;
            }
          }
        });
      };

      if (video.readyState >= 1) {
        setupScrollScrub();
      } else {
        video.addEventListener('loadedmetadata', setupScrollScrub);
        video.addEventListener('error', () => {
          setVideoError(true);
          setDecodingFrames(false);
          setupScrollScrub();
        });
      }
    };

    initScrubTrigger();

    // Fail-safe loader removal after 1.5s to prevent getting stuck
    const failSafeTimer = setTimeout(() => {
      setDecodingFrames(false);
    }, 1500);

    // Secondary animations for overlay cards
    gsap.fromTo('.cinematic-card', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.2 }
    );

    return () => {
      active = false;
      clearTimeout(failSafeTimer);
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
    };
  }, []);

  // Paint video to canvas for custom filters & vignette
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    let animationFrameId: number;

    const paintFrame = () => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const cw = (canvas.width = window.innerWidth);
        const ch = (canvas.height = window.innerHeight);

        if (video.readyState >= 2) {
          // Draw video frame styled with object-fit: cover logic
          const videoRatio = video.videoWidth / video.videoHeight;
          const canvasRatio = cw / ch;
          let sx = 0, sy = 0, sw = video.videoWidth, sh = video.videoHeight;

          if (canvasRatio > videoRatio) {
            sh = video.videoWidth / canvasRatio;
            sy = (video.videoHeight - sh) / 2;
          } else {
            sw = video.videoHeight * canvasRatio;
            sx = (video.videoWidth - sw) / 2;
          }

          ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);
        } else {
          // Technical engineering document layout grid (forensic wireframe style)
          ctx.fillStyle = '#070708';
          ctx.fillRect(0, 0, cw, ch);

          ctx.strokeStyle = 'rgba(255,255,255,0.015)';
          ctx.lineWidth = 1;
          const gridSize = 80;
          for (let x = 0; x < cw; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, ch);
            ctx.stroke();
          }
          for (let y = 0; y < ch; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(cw, y);
            ctx.stroke();
          }

          // Render soft layout indicator guidelines representing document stacking
          ctx.strokeStyle = 'rgba(198, 255, 46, 0.08)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(cw / 2 - 180, ch / 2 - 240, 360, 480, 12);
          ctx.stroke();
        }

        // 1. Grade boost: boost brightness & contrast
        ctx.save();
        ctx.fillStyle = 'rgba(7, 7, 8, 0.15)'; // Deepen base
        ctx.fillRect(0, 0, cw, ch);

        // 2. High-end Vignette
        const radGrad = ctx.createRadialGradient(cw / 2, ch / 2, cw * 0.15, cw / 2, ch / 2, cw * 0.65);
        radGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        radGrad.addColorStop(0.5, 'rgba(7, 7, 8, 0.2)');
        radGrad.addColorStop(1, 'rgba(7, 7, 8, 0.95)');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, cw, ch);

        // 3. Volt glow radial center-out
        const voltGlow = ctx.createRadialGradient(cw / 2, ch * 0.65, 10, cw / 2, ch * 0.65, cw * 0.45);
        voltGlow.addColorStop(0, 'rgba(198, 255, 46, 0.05)');
        voltGlow.addColorStop(1, 'rgba(7, 7, 8, 0)');
        ctx.fillStyle = voltGlow;
        ctx.fillRect(0, 0, cw, ch);

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(paintFrame);
    };

    paintFrame();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="min-h-screen bg-[#070708] text-[#F3F3F5] font-sans selection:bg-[#C6FF2E] selection:text-black antialiased overflow-x-hidden">
      
      {/* ── MINIMAL FLOATING NAVIGATION ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070708]/80 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#C6FF2E]/10 border border-[#C6FF2E]/30 flex items-center justify-center text-[#C6FF2E] font-bold text-sm">
              S
            </div>
            <span className="font-bold text-lg tracking-wider text-white group-hover:text-[#C6FF2E] transition-colors">
              SYNAPS
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-white/50">
            <a href="#hero-story" className="hover:text-white transition-colors">Product Launch</a>
            <a href="#ask-the-work" className="hover:text-white transition-colors">Ask the Work</a>
            <a href="#source-is-answer" className="hover:text-white transition-colors">Evidence Grounding</a>
            <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-white/60 hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/demo"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C6FF2E] hover:bg-[#b5f020] text-black text-xs font-bold transition-all shadow-lg shadow-[#C6FF2E]/10 font-mono"
            >
              LAUNCH DEMO
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── SCROLL-CONTROLLED CINEMATIC SCENE STAGE ── */}
      <div ref={containerRef} id="hero-story" className="relative h-[900vh]">
        
        {/* Sticky Fixed Backdrop Viewport */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-10 bg-[#070708]">
          
          {/* Canvas for Smooth Scrubbed Video & Vignettes */}
          <canvas ref={canvasRef} className="w-full h-full block object-cover" />
          
          {/* Video Stream Decoder */}
          <video
            ref={videoRef}
            src="/financials.mp4"
            preload="auto"
            playsInline
            muted
            loop
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              opacity: 0,
              pointerEvents: 'none',
              zIndex: -1,
            }}
          />

          {/* Loader Overlay */}
          {decodingFrames && (
            <div className="absolute inset-0 bg-[#070708] z-30 flex flex-col items-center justify-center gap-4">
              <RefreshCw className="w-6 h-6 text-[#C6FF2E] animate-spin" />
              <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Decoding product launch film...</span>
            </div>
          )}

          {/* Fallback Static Canvas Visual in case of Video Error */}
          {videoError && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c11] to-[#070708] -z-10" />
          )}

          {/* ── CINEMATIC ACT OVERLAYS ── */}
          <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 md:p-12 max-w-7xl mx-auto">
            
            {/* Top Act indicator */}
            <div className="flex items-center gap-3 pt-16">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF2E] animate-ping" />
              <span className="text-[10px] font-mono tracking-widest text-[#C6FF2E]/80 uppercase font-bold">
                SCENE {String(activeScene).padStart(2, '0')} · {
                  activeScene === 1 ? "THE CHAOS" :
                  activeScene === 2 ? "THE GATEWAY" :
                  activeScene === 3 ? "FIND" :
                  activeScene === 4 ? "UNDERSTAND" :
                  activeScene === 5 ? "COMPARE" :
                  activeScene === 6 ? "CONNECT" :
                  activeScene === 7 ? "VERIFY" :
                  activeScene === 8 ? "DECIDE" :
                  activeScene === 9 ? "INTELLIGENCE NETWORK" :
                  "SYNAPS REVEAL"
                }
              </span>
            </div>

            {/* Main Interactive Narrative Panels */}
            <div className="my-auto max-w-xl space-y-6">
              {activeScene === 1 && (
                <div className="space-y-4 animate-fade-in text-left">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
                    Everything your company knows.
                  </h1>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#C6FF2E] tracking-tight">
                    Somewhere.
                  </h2>
                  <p className="text-sm text-white/40 font-medium max-w-md leading-relaxed">
                    Buried across thousands of contracts, SOPs, financial audits, and strategic reports. Messy, layered, and fragmented.
                  </p>
                </div>
              )}

              {activeScene === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <span className="text-xs font-mono text-[#C6FF2E] font-bold tracking-widest uppercase">01 / THE CONTEXT</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                    Entering the product.
                  </h2>
                  <div className="p-4 rounded-xl bg-[#111118]/90 border border-white/10 backdrop-blur-md space-y-2 pointer-events-auto shadow-2xl">
                    <div className="flex items-center justify-between text-[10px] text-white/40 font-mono">
                      <span className="flex items-center gap-1.5 text-white/90">
                        <FileText className="w-3.5 h-3.5 text-[#C6FF2E]" />
                        Master_Services_Agreement_2026.pdf
                      </span>
                      <span>Page 1 of 42</span>
                    </div>
                    <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-[#C6FF2E] rounded-full" />
                    </div>
                    <p className="text-xs text-[#C6FF2E] font-semibold font-mono tracking-wider animate-pulse pt-1">
                      COMMAND QUERY: "Find every mention of termination."
                    </p>
                  </div>
                </div>
              )}

              {activeScene === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <span className="text-xs font-mono text-[#C6FF2E] font-bold tracking-widest uppercase">02 / FIND</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                    Find the clause.
                  </h2>
                  <div className="bg-[#111118]/90 border border-white/10 backdrop-blur-md rounded-2xl p-5 space-y-4 pointer-events-auto shadow-2xl">
                    <div className="flex items-center justify-between text-xs border-b border-white/5 pb-3">
                      <span className="text-white/60 font-medium">QUERY RESULTS</span>
                      <span className="text-[#C6FF2E] font-bold">5 References Located</span>
                    </div>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto">
                      <div className="p-2.5 rounded bg-[#C6FF2E]/10 border border-[#C6FF2E]/20 text-xs flex justify-between items-center text-[#C6FF2E] font-semibold">
                        <span>Page 8 · Section 8.4 (Notice Period)</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <div className="p-2.5 rounded bg-white/3 border border-white/5 text-xs text-white/50 flex justify-between items-center">
                        <span>Page 14 · Section 12.1 (Termination)</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <div className="p-2.5 rounded bg-white/3 border border-white/5 text-xs text-white/50 flex justify-between items-center">
                        <span>Page 27 · Section 19.3 (Breach Terms)</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeScene === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <span className="text-xs font-mono text-[#C6FF2E] font-bold tracking-widest uppercase">03 / UNDERSTAND</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                    Structure the unstructured.
                  </h2>
                  <div className="grid grid-cols-2 gap-3 pointer-events-auto">
                    {[
                      { label: "RISKS", count: 4, status: "High Risk" },
                      { label: "OBLIGATIONS", count: 12, status: "Active" },
                      { label: "DEADLINES", count: 3, status: "Action Required" },
                      { label: "EXPOSURES", count: 1, status: "Monitored" }
                    ].map(card => (
                      <div key={card.label} className="p-4 rounded-xl bg-[#111118]/90 border border-white/10 backdrop-blur-md text-left space-y-1">
                        <span className="text-[10px] font-mono text-white/40">{card.label}</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xl font-bold text-white">{card.count}</span>
                          <span className="text-[9px] text-[#C6FF2E] font-bold uppercase">{card.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeScene === 5 && (
                <div className="space-y-4 animate-fade-in">
                  <span className="text-xs font-mono text-[#C6FF2E] font-bold tracking-widest uppercase">04 / COMPARE</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                    Context changes the answer.
                  </h2>
                  <div className="p-4 rounded-xl bg-[#111118]/90 border border-white/10 backdrop-blur-md pointer-events-auto space-y-3 shadow-2xl">
                    <div className="text-xs text-white/60 font-semibold border-b border-white/5 pb-2">
                      Agreement Term Comparison (12 vs 24 Months)
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                        <span className="block text-[10px] text-red-400/60 font-mono font-bold">2025 AGREEMENT</span>
                        12 Months term notice
                      </div>
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                        <span className="block text-[10px] text-green-400/60 font-mono font-bold">2026 AGREEMENT</span>
                        24 Months term notice
                      </div>
                    </div>
                    <span className="block text-[9px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                      ▲ DELTA: 12-Month Extension Added without ceiling caps.
                    </span>
                  </div>
                </div>
              )}

              {activeScene === 6 && (
                <div className="space-y-4 animate-fade-in">
                  <span className="text-xs font-mono text-[#C6FF2E] font-bold tracking-widest uppercase">05 / CONNECT</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                    Connect across records.
                  </h2>
                  <p className="text-sm text-white/40 leading-relaxed max-w-md">
                    SYNAPS traces relationships between operational SOPs, master supply contracts, and financial ledgers, mapping direct connections without abstract floating neural network slop.
                  </p>
                </div>
              )}

              {activeScene === 7 && (
                <div className="space-y-4 animate-fade-in">
                  <span className="text-xs font-mono text-[#C6FF2E] font-bold tracking-widest uppercase">06 / VERIFY</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                    Don't just get the answer. <span className="text-[#C6FF2E]">See the source.</span>
                  </h2>
                  <div className="p-4 rounded-xl bg-[#111118]/90 border border-white/10 backdrop-blur-md pointer-events-auto space-y-2 shadow-2xl text-left">
                    <span className="text-[10px] font-mono text-[#C6FF2E] font-bold uppercase tracking-wider">Trace Pathway Verified</span>
                    <p className="text-xs text-white/80 leading-relaxed font-mono bg-black/40 p-3 rounded border border-white/5">
                      "In the event Customer does not issue written notice... rates automatically adjust upward by 14%."
                    </p>
                    <div className="text-[10px] font-mono text-white/40 flex items-center justify-between">
                      <span>Source: MSA_2026.pdf</span>
                      <span>Page 8 · Section 8.4</span>
                    </div>
                  </div>
                </div>
              )}

              {activeScene === 8 && (
                <div className="space-y-4 animate-fade-in">
                  <span className="text-xs font-mono text-[#C6FF2E] font-bold tracking-widest uppercase">07 / DECIDE</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                    Turn facts into decisions.
                  </h2>
                  <div className="p-5 rounded-2xl bg-[#12121a]/95 border-l-4 border-red-500 pointer-events-auto shadow-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Decision Briefing</span>
                      <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[9px] font-bold">HIGH RISK</span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed font-semibold">
                      Recommendation: Do not sign the 2026 renewal until the uncapped 14% rate escalation is renegotiated.
                    </p>
                    <div className="border-t border-white/5 pt-2 flex items-center gap-4 text-[10px] text-white/40">
                      <span>3 Evidence Sources</span>
                      <span>•</span>
                      <span>Deadline: Oct 15</span>
                    </div>
                  </div>
                </div>
              )}

              {activeScene === 9 && (
                <div className="space-y-4 animate-fade-in">
                  <span className="text-xs font-mono text-[#C6FF2E] font-bold tracking-widest uppercase">08 / UNIFIED NETWORK</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                    One source of truth.
                  </h2>
                  <p className="text-sm text-white/40 leading-relaxed">
                    Scattered files, contracts, decisions, and operations align cleanly into a structured, easily queryable operational memory database.
                  </p>
                </div>
              )}

              {activeScene === 10 && (
                <div className="space-y-6 pointer-events-auto animate-fade-in">
                  <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-none">
                    SYNAPS
                  </h2>
                  <p className="text-base text-[#C6FF2E] font-mono tracking-wide font-bold">
                    Turn scattered information into decisions you can defend.
                  </p>
                  <p className="text-sm text-white/50 max-w-md leading-relaxed">
                    Zero chatbot slop. Direct, grounded knowledge integration for operations, legal, risk, and finance teams.
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <Link
                      href="/demo"
                      className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C6FF2E] hover:bg-[#b5f020] text-black text-xs font-bold transition-all shadow-xl shadow-[#C6FF2E]/20"
                    >
                      ENTER SYNAPS
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                      href="#ask-the-work"
                      className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all"
                    >
                      SEE HOW IT WORKS
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Progress Bar */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[10px] font-mono text-white/30">
              <span className="uppercase">CINEMATIC SCENE PROGRESS</span>
              <div className="flex-1 max-w-[200px] mx-6 h-0.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#C6FF2E] transition-all duration-100" style={{ width: `${scrollProgress * 100}%` }} />
              </div>
              <span>{Math.round(scrollProgress * 100)}%</span>
            </div>

          </div>

        </div>

      </div>

      {/* ── SECTION 11: "ASK THE WORK" INTERACTIVE EXPLORER ── */}
      <section id="ask-the-work" className="py-24 border-t border-white/5 bg-[#0a0a0f] relative z-30">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#C6FF2E] tracking-widest uppercase font-bold">
              01 / ASK THE WORK
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Query your operational memory.
            </h2>
            <p className="text-sm text-white/50 max-w-xl leading-relaxed">
              Select an executive question below to see how SYNAPS parses unstructured company data and presents verifiable recommendations based on exact source citations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Question Selector List */}
            <div className="lg:col-span-5 space-y-3">
              {INTERACTIVE_QUESTIONS.map(q => (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestion(q)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group",
                    selectedQuestion.id === q.id
                      ? "bg-[#C6FF2E]/10 border-[#C6FF2E]/40 text-white"
                      : "bg-white/3 border-white/5 text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className={cn("w-4 h-4 shrink-0", selectedQuestion.id === q.id ? "text-[#C6FF2E]" : "text-white/30")} />
                    <span className="text-xs font-bold font-mono tracking-wide uppercase">{q.question}</span>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 shrink-0 transition-transform", selectedQuestion.id === q.id ? "text-[#C6FF2E] translate-x-1" : "text-white/20")} />
                </button>
              ))}
            </div>

            {/* Right Live Evidenced Result */}
            <div className="lg:col-span-7 bg-[#111118] border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
              {/* Answer Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-xs font-mono text-[#C6FF2E] font-bold uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C6FF2E]" />
                  SYNAPS Evidenced Synthesis
                </span>
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  selectedQuestion.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  selectedQuestion.riskLevel === 'MODERATE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-green-500/20 text-green-400 border border-green-500/30'
                )}>
                  {selectedQuestion.riskLevel} RISK
                </span>
              </div>

              {/* Direct Answer */}
              <p className="text-xs md:text-sm text-white/90 font-medium leading-relaxed">
                {selectedQuestion.answer}
              </p>

              {/* Source Evidence Box */}
              <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs text-white/40 font-mono">
                  <span className="flex items-center gap-1.5 text-[#C6FF2E] font-semibold">
                    <FileText className="w-3.5 h-3.5" />
                    {selectedQuestion.docName}
                  </span>
                  <span>{selectedQuestion.page} · {selectedQuestion.section}</span>
                </div>
                <p className="text-xs font-mono text-white/70 bg-black/40 p-3 rounded-lg border border-white/5 leading-relaxed">
                  "{selectedQuestion.clauseText}"
                </p>
              </div>

              {/* Recommendation */}
              <div className="p-4 rounded-xl bg-[#C6FF2E]/10 border border-[#C6FF2E]/20 space-y-1">
                <div className="text-xs font-bold text-[#C6FF2E] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Recommended Action
                </div>
                <p className="text-xs text-white/80 font-medium leading-relaxed">
                  {selectedQuestion.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 13: "THE SOURCE IS THE ANSWER" EVIDENCE VIEWER ── */}
      <section id="source-is-answer" className="py-24 border-t border-white/5 bg-[#070708] relative z-30">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#C6FF2E] tracking-widest uppercase font-bold">
              02 / EVIDENTIARY TRACEABILITY
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              The source is the answer.
            </h2>
            <p className="text-sm text-white/50 max-w-xl leading-relaxed">
              Ground every operational summary. SYNAPS references matching clauses, cells, and guidelines with exact coordinate mapping and verified source badges.
            </p>
          </div>

          {/* Interactive Document Page Viewer */}
          <div className="bg-[#111118] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Viewer Toolbar */}
            <div className="bg-white/3 border-b border-white/5 px-6 py-3 flex items-center justify-between text-xs text-white/60">
              <div className="flex items-center gap-3 font-mono">
                <FileText className="w-4 h-4 text-[#C6FF2E]" />
                <span className="font-bold text-white">Master_Services_Agreement_2026.pdf</span>
                <span className="text-white/30">|</span>
                <span>Page 8 of 42</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-bold uppercase">Source Grounded</span>
                <Link href="/demo" className="flex items-center gap-1 text-[#C6FF2E] hover:underline font-semibold ml-4">
                  Open Source <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Document Content Viewport */}
            <div className="p-8 font-mono text-xs text-white/70 space-y-6 max-h-[420px] overflow-y-auto leading-relaxed bg-[#0d0d14]">
              <div className="border-b border-white/5 pb-4 text-white/30">
                MASTER SERVICES AGREEMENT · SECTION 8 — COMMERCIAL TERMS & PRICE ESCALATIONS
              </div>

              <p>
                8.1 <span className="text-white">Base Service Fees.</span> Customer agrees to pay the annual recurring subscription fees set forth in Schedule A. Invoices shall be remitted net-30 days from date of issuance.
              </p>

              <p>
                8.2 <span className="text-white">Taxes & Expenses.</span> All fees are exclusive of applicable state, federal, or value-added taxes, which shall be billed separately to Customer.
              </p>

              {/* Highlighted Evidence Passage */}
              <div className="p-4 rounded-xl bg-[#C6FF2E]/15 border-l-4 border-[#C6FF2E] text-white space-y-2 my-4">
                <div className="flex items-center justify-between text-[10px] text-[#C6FF2E] font-bold uppercase tracking-wider">
                  <span>SECTION 8.4 — PRICE ADJUSTMENTS & AUTOMATIC RENEWAL (EVIDENCE MATCH)</span>
                  <span>CONFIDENCE: 99.8%</span>
                </div>
                <p className="font-semibold leading-relaxed">
                  "In the event Customer does not issue written notice of non-renewal at least forty-five (45) days prior to the Renewal Date (Oct 15), rates shall automatically adjust upward by fourteen percent (14%) for the subsequent twelve (12) month term."
                </p>
              </div>

              <p>
                8.5 <span className="text-white">Limitation of Liability.</span> Except for gross negligence or willful misconduct, neither party shall be liable for indirect, consequential, or punitive damages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 14: PRODUCT CAPABILITIES ── */}
      <section id="capabilities" className="py-24 border-t border-white/5 bg-[#0a0a0f] relative z-30">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#C6FF2E] tracking-widest uppercase font-bold">
              03 / CAPABILITIES
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Enterprise Operations Capabilities
            </h2>
          </div>

          {/* 5 Core Capabilities Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { id: 'read', label: 'READ', icon: Layers, desc: 'Read and structure complex operational records, contracts, and spreadsheets.' },
              { id: 'find', label: 'FIND', icon: Search, desc: 'Locate exact words, obligations, and terms across millions of pages.' },
              { id: 'connect', label: 'CONNECT', icon: GitCompare, desc: 'Compare documents side-by-side and highlight structural deltas.' },
              { id: 'verify', label: 'VERIFY', icon: ShieldCheck, desc: 'Trace answers back to verifiable source documents & line coordinates.' },
              { id: 'decide', label: 'DECIDE', icon: CheckCircle2, desc: 'Turn raw unstructured files into actionable, formatted decision briefs.' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "p-5 rounded-xl border text-left transition-all space-y-3",
                  activeTab === tab.id
                    ? "bg-[#C6FF2E]/10 border-[#C6FF2E]/40 text-white"
                    : "bg-white/3 border-white/5 text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-[#C6FF2E]" : "text-white/40")} />
                <div>
                  <h3 className="font-extrabold text-sm tracking-wider">{tab.label}</h3>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">{tab.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Active capability detail visual */}
          <div className="p-8 rounded-2xl bg-[#111118] border border-white/10 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
            <div className="flex-1 space-y-4">
              <h3 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                {activeTab === 'read' && "Understand complex documentation"}
                {activeTab === 'find' && "Instant keyword & fuzzy search"}
                {activeTab === 'connect' && "Cross-document comparison matrix"}
                {activeTab === 'verify' && "Strict page-level citations"}
                {activeTab === 'decide' && "Formatted decision briefs"}
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                {activeTab === 'read' && "Ingest and process PDFs, DOCX, and XLSX sheets automatically. Extract tabular structures, signatures, metadata, and legal definitions."}
                {activeTab === 'find' && "Perform exact, fuzzy, and semantic vector query matches. Discover hidden notices and liabilities in seconds."}
                {activeTab === 'connect' && "Identify differences in terms, fees, caps, and warranties between current and previous contract versions."}
                {activeTab === 'verify' && "Eliminate hallucinations entirely. Every summary is accompanied by a direct link to the original page in the document."}
                {activeTab === 'decide' && "Go from unstructured documents to structured action points. Get recommendations and risk assessments formatted for executives."}
              </p>
            </div>
            <div className="w-full md:w-[320px] p-4 rounded-xl bg-black/40 border border-white/5 text-xs font-mono space-y-2">
              <div className="text-[10px] text-white/30 border-b border-white/5 pb-2">SYNAPS PREVIEW</div>
              {activeTab === 'read' && (
                <div className="space-y-1.5 text-white/60">
                  <p className="text-white">• Document processed: SOP_104.pdf</p>
                  <p>• Status: Completed in 2.1s</p>
                  <p>• Scanned pages: 28 pages</p>
                </div>
              )}
              {activeTab === 'find' && (
                <div className="space-y-1.5 text-white/60">
                  <p className="text-white">• Search query: "renewal notice"</p>
                  <p>• Results: 2 exact, 1 fuzzy</p>
                  <p className="text-[#C6FF2E]">• Best match: Page 8 (notice window)</p>
                </div>
              )}
              {activeTab === 'connect' && (
                <div className="space-y-1.5 text-white/60">
                  <p className="text-white">• Target: MSA_2026 vs MSA_2025</p>
                  <p className="text-green-400">• Added: 14% Price escalation</p>
                  <p className="text-red-400">• Removed: 15-day notice window</p>
                </div>
              )}
              {activeTab === 'verify' && (
                <div className="space-y-1.5 text-white/60">
                  <p className="text-white">• Citation grounded: Page 8 Sec 8.4</p>
                  <p>• Content Hash: SHA-256 verified</p>
                  <p>• Hallucination rate: 0.00%</p>
                </div>
              )}
              {activeTab === 'decide' && (
                <div className="space-y-1.5 text-white/60">
                  <p className="text-[#C6FF2E] font-bold">• RECOMMENDATION: RENEGOTIATE</p>
                  <p>• Risk score: 85/100 (HIGH)</p>
                  <p>• Action: Send non-renewal notice</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <footer className="py-20 border-t border-white/5 bg-[#070708] relative z-30">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-[#C6FF2E]/10 border border-[#C6FF2E]/30 flex items-center justify-center text-[#C6FF2E] font-bold text-xl mx-auto">
            S
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Turn scattered information into decisions you can defend.
          </h2>
          <p className="text-sm md:text-base text-white/50 max-w-xl mx-auto leading-relaxed">
            SYNAPS connects the documents, evidence and decisions your organization already has — so people can find what matters, understand why it matters, and act on it.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <Link
              href="/demo"
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-[#C6FF2E] hover:bg-[#b5f020] text-black text-sm font-bold transition-all shadow-xl shadow-[#C6FF2E]/20"
            >
              LAUNCH DEMO
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="pt-12 text-xs font-mono text-white/25">
            © 2026 SYNAPS INC. ENTERPRISE DECISION INTELLIGENCE OPERATING SYSTEM.
          </div>
        </div>
      </footer>
    </div>
  );
}
