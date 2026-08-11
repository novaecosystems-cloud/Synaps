'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  Lock,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  Search,
  Database,
  GitBranch,
  AlertTriangle,
  Scale,
  Zap,
  Check,
  ChevronRight
} from 'lucide-react';
import SignInModal from '@/components/SignInModal';
import Link from 'next/link';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// ─── 01 SCENE: GEOMETRIC SYNAPS MARK ASSEMBLY (SVG Line-by-Line Connection) ───
function SynapsLogoAssemblyAnimation() {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll('path, circle, line');

    gsap.fromTo(
      paths,
      { strokeDasharray: 300, strokeDashoffset: 300, opacity: 0 },
      {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 2.2,
        stagger: 0.25,
        ease: 'power3.inOut',
      }
    );
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 120 120" className="w-24 h-24 sm:w-32 sm:h-32 mx-auto drop-shadow-[0_0_35px_rgba(0,150,255,0.4)]">
      {/* Outer Hexagon Frame */}
      <path d="M 60 10 L 105 35 L 105 85 L 60 110 L 15 85 L 15 35 Z" fill="none" stroke="#0055FF" strokeWidth="2.5" />
      {/* Inner Node Connections */}
      <line x1="60" y1="10" x2="60" y2="60" stroke="#00F0FF" strokeWidth="2" />
      <line x1="105" y1="35" x2="60" y2="60" stroke="#00F0FF" strokeWidth="2" />
      <line x1="105" y1="85" x2="60" y2="60" stroke="#00F0FF" strokeWidth="2" />
      <line x1="60" y1="110" x2="60" y2="60" stroke="#0055FF" strokeWidth="2" />
      <line x1="15" y1="85" x2="60" y2="60" stroke="#0055FF" strokeWidth="2" />
      <line x1="15" y1="35" x2="60" y2="60" stroke="#00F0FF" strokeWidth="2" />
      {/* Core Node Joints */}
      <circle cx="60" cy="60" r="6" fill="#00F0FF" />
      <circle cx="60" cy="10" r="3.5" fill="#0055FF" />
      <circle cx="105" cy="35" r="3.5" fill="#00F0FF" />
      <circle cx="105" cy="85" r="3.5" fill="#0055FF" />
      <circle cx="60" cy="110" r="3.5" fill="#0055FF" />
      <circle cx="15" cy="85" r="3.5" fill="#00F0FF" />
      <circle cx="15" cy="35" r="3.5" fill="#0055FF" />
    </svg>
  );
}

// ─── 3D CYBERNETIC STRUCTURE CANVAS ──────────────────────────────────────────
function CinematicSystemCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1000);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const numNodes = 64;
    const radius = Math.min(width, height) * 0.34;
    const nodes: { ox: number; oy: number; oz: number; size: number }[] = [];

    for (let i = 0; i < numNodes; i++) {
      const phi = Math.acos(-1 + (2 * i) / numNodes);
      const theta = Math.sqrt(numNodes * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      nodes.push({ ox: x, oy: y, oz: z, size: Math.random() * 2.2 + 1 });
    }

    let angleX = 0;
    let angleY = 0;
    let targetAngleX = 0;
    let targetAngleY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetAngleY = ((e.clientX - cx) / rect.width) * 0.6;
      targetAngleX = ((e.clientY - cy) / rect.height) * 0.6;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      ctx.fillStyle = '#07080c';
      ctx.fillRect(0, 0, width, height);

      // System coordinate grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
      ctx.lineWidth = 1;
      const step = 44;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      angleX += (targetAngleX - angleX) * 0.04 + 0.002;
      angleY += (targetAngleY - angleY) * 0.04 + 0.004;

      const fov = 440;
      const cx = width / 2;
      const cy = height / 2;

      const projected: { x: number; y: number; scale: number; z: number }[] = [];

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const radX = angleX;
        const radY = angleY;

        let y1 = node.oy * Math.cos(radX) - node.oz * Math.sin(radX);
        let z1 = node.oy * Math.sin(radX) + node.oz * Math.cos(radX);

        let x2 = node.ox * Math.cos(radY) + z1 * Math.sin(radY);
        let z2 = -node.ox * Math.sin(radY) + z1 * Math.cos(radY);

        const scale = fov / (fov + z2 + 300);
        const px = x2 * scale + cx;
        const py = y1 * scale + cy;

        projected.push({ x: px, y: py, scale, z: z2 });
      }

      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 135) {
            const alpha = (1 - dist / 135) * 0.38 * projected[i].scale;
            ctx.strokeStyle = `rgba(0, 150, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const node = nodes[i];
        const size = node.size * p.scale;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, size), 0, Math.PI * 2);
        ctx.fillStyle = p.z > 0 ? '#00f0ff' : '#0055ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = p.z > 0 ? 10 : 3;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block rounded-2xl cursor-grab active:cursor-grabbing" />;
}

// ─── MAIN CINEMATIC LANDING COMPONENT ─────────────────────────────────────────
export default function CinematicSystemLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transformationStage, setTransformationStage] = useState<number>(0);
  const [agentProgress, setAgentProgress] = useState(0);
  const [agentSearching, setAgentSearching] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // GSAP ScrollTrigger Sequence Setup
  useGSAP(
    () => {
      const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  // Auto progression for Document Transformation Sequence
  useEffect(() => {
    const timer = setInterval(() => {
      setTransformationStage((prev) => (prev + 1) % 4);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const triggerAgentSearch = () => {
    setAgentSearching(true);
    setAgentProgress(0);

    const interval = setInterval(() => {
      setAgentProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setAgentSearching(false);
          return 100;
        }
        return prev + 10;
      });
    }, 130);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#07080c] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 sm:px-12 py-5 flex items-center justify-between backdrop-blur-xl bg-[#07080c]/80 border-b border-white/10">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 p-[1px] shadow-[0_0_24px_rgba(0,150,255,0.35)]">
            <div className="w-full h-full rounded-[11px] bg-[#07080c] flex items-center justify-center">
              <span className="font-mono text-xl font-bold text-cyan-400">S</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-lg font-bold text-white tracking-wider leading-none">SYNAPS</span>
            <span className="font-mono text-[9px] text-cyan-400/80 tracking-widest uppercase">EVIDENCE BRAIN</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-mono text-xs text-slate-400 tracking-wider">
          <a href="#opening" className="hover:text-cyan-400 transition-colors uppercase">01 // ASSEMBLY</a>
          <a href="#transformation" className="hover:text-cyan-400 transition-colors uppercase">02 // PARSER</a>
          <a href="#question" className="hover:text-cyan-400 transition-colors uppercase">03 // INQUIRY</a>
          <a href="#agents" className="hover:text-cyan-400 transition-colors uppercase">04 // AGENTS</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/chat"
            className="hidden sm:flex items-center gap-2 font-mono text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-lg border border-white/10 hover:border-cyan-500/40 bg-white/5 hover:bg-cyan-500/10 transition-all"
          >
            <span>OPEN APP</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold uppercase tracking-wider shadow-[0_0_24px_rgba(0,85,255,0.4)] hover:shadow-[0_0_32px_rgba(0,150,255,0.6)] transition-all flex items-center gap-2"
          >
            <span>ENTER SYNAPS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ── 03 SCENE: OPENING SCENE (Logo Mark Assembly) ─────────────────────── */}
      <section id="opening" className="pt-36 sm:pt-44 pb-20 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <SynapsLogoAssemblyAnimation />

        <div className="mt-8 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-mono text-xs uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>AN INTELLIGENCE SYSTEM REVEALING ITSELF</span>
        </div>

        <h1 className="font-mono text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-none mt-6 mb-6">
          SYNAPS <br />
          <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-sky-300 bg-clip-text text-transparent">
            EVIDENCE-GROUNDED BRAIN
          </span>
        </h1>

        <p className="max-w-2xl text-slate-400 text-base sm:text-lg leading-relaxed mb-10 font-sans">
          Documents do not exist in isolation. Synaps turns raw PDFs, contracts, and financial reports into an auditable spatial system of verified relationships.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_32px_rgba(0,85,255,0.45)] hover:scale-105 transition-all flex items-center gap-2.5"
          >
            <span>ENTER SYNAPS SYSTEM</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 font-mono text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2.5"
          >
            <span>LAUNCH DASHBOARD</span>
            <ArrowUpRight className="w-4 h-4 text-cyan-400" />
          </Link>
        </div>

        {/* 3D Cyber Core Engine Container */}
        <div className="w-full h-[450px] sm:h-[580px] lg:h-[680px] relative rounded-2xl overflow-hidden border border-cyan-500/25 shadow-[0_0_60px_rgba(0,150,255,0.15)] bg-[#07080c]">
          <CinematicSystemCanvas />
          <div className="absolute top-4 right-4 pointer-events-none z-10 flex items-center gap-2 bg-[#07080c]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-500/30">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono text-[10px] text-cyan-300 uppercase tracking-widest font-bold">3D CYBERNETIC SYNAPS ENGINE</span>
          </div>
        </div>
      </section>

      {/* ── 04 SCENE: HERO TRANSFORMATION (Document -> Paragraph -> Concept -> Decision) */}
      <section id="transformation" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid lg:grid-cols-12 gap-12 items-center" data-reveal>
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-bold">// 02 DOCUMENT TRANSFORMATION</div>
            <h2 className="font-mono text-3xl sm:text-4xl font-bold text-white leading-tight">
              A PARAGRAPH BECOMES A CONCEPT. A CONCEPT BECOMES A DECISION.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Watch Synaps dynamically decompose complex enterprise documentation into verified, auditable knowledge primitives.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <button
                onClick={() => setTransformationStage(0)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  transformationStage === 0 ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200 font-bold' : 'border-white/10 bg-white/5 text-slate-400'
                }`}
              >
                <span>1. DOCUMENT SCANNING & OCR</span>
                <FileText className="w-4 h-4 text-cyan-400" />
              </button>

              <button
                onClick={() => setTransformationStage(1)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  transformationStage === 1 ? 'border-blue-400 bg-blue-500/10 text-blue-200 font-bold' : 'border-white/10 bg-white/5 text-slate-400'
                }`}
              >
                <span>2. PARAGRAPH & CLAUSE PARSING</span>
                <Layers className="w-4 h-4 text-blue-400" />
              </button>

              <button
                onClick={() => setTransformationStage(2)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  transformationStage === 2 ? 'border-amber-400 bg-amber-500/10 text-amber-200 font-bold' : 'border-white/10 bg-white/5 text-slate-400'
                }`}
              >
                <span>3. CROSS-DOCUMENT RELATIONSHIP MAPPING</span>
                <GitBranch className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => setTransformationStage(3)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  transformationStage === 3 ? 'border-emerald-400 bg-emerald-500/10 text-emerald-200 font-bold' : 'border-white/10 bg-white/5 text-slate-400'
                }`}
              >
                <span>4. EXECUTIVE DECISION COMPRESSION</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0d0f17] shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 font-mono text-xs text-slate-400">
                <span className="text-white font-bold">SYNAPS PIPELINE ENGINE // STAGE {transformationStage + 1} OF 4</span>
                <span className="text-cyan-400">STATUS: ACTIVE</span>
              </div>

              <AnimatePresence mode="wait">
                {transformationStage === 0 && (
                  <motion.div key="stage0" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-4 font-mono text-xs sm:text-sm">
                    <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40 space-y-2">
                      <div className="text-cyan-300 font-bold">INCOMING DOCUMENT: Master_Services_Agreement_2026.pdf</div>
                      <p className="text-slate-400">Page count: 48 · Extracted entities: 142 · Table structures: 12</p>
                    </div>
                  </motion.div>
                )}

                {transformationStage === 1 && (
                  <motion.div key="stage1" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-4 font-mono text-xs sm:text-sm">
                    <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-200 space-y-2">
                      <div className="text-blue-300 font-bold uppercase">Section 14.2 — Liability Limitation</div>
                      <p className="text-slate-200 font-sans">"The aggregate liability of either party under this agreement shall not exceed $2,500,000 USD."</p>
                    </div>
                  </motion.div>
                )}

                {transformationStage === 2 && (
                  <motion.div key="stage2" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-4 font-mono text-xs sm:text-sm">
                    <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 space-y-2">
                      <div className="text-amber-300 font-bold uppercase">Cross-Document Relationship Discovered</div>
                      <p className="text-slate-300">Linked to <strong className="text-white">Q3_Risk_Framework.pdf</strong>: standard cap is $1.0M. Discrepancy of <strong className="text-amber-400">+$1.5M detected</strong>.</p>
                    </div>
                  </motion.div>
                )}

                {transformationStage === 3 && (
                  <motion.div key="stage3" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-4 font-mono text-xs sm:text-sm">
                    <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 space-y-2">
                      <div className="text-emerald-300 font-bold uppercase">Verified Decision Surface</div>
                      <p className="text-slate-200">Require CLO approval prior to execution. Risk mitigation clause automatically drafted.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── 07 SCENE: "ONE QUESTION" MOMENT ───────────────────────────────────── */}
      <section id="question" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16" data-reveal>
          <div className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-bold mb-3">// 03 THE ONE QUESTION MOMENT</div>
          <h2 className="font-mono text-3xl sm:text-5xl font-bold text-white mb-4">
            "WHAT CHANGED ACROSS OUR CONTRACTS?"
          </h2>
          <p className="text-slate-400 text-base">
            Instead of reading 50 pages line-by-line, ask Synaps. The system brings the exact difference into focus.
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-2xl border border-white/10 bg-[#0d0f17] shadow-2xl space-y-6" data-reveal>
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 font-mono text-sm flex items-center justify-between">
            <span className="font-bold text-white">QUERY: "Compare termination notice periods across 2025 vs 2026 supplier agreements"</span>
            <span className="text-xs text-cyan-300">PROCESSED IN 95ms</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 font-mono text-xs sm:text-sm">
            <div className="p-5 rounded-xl border border-red-500/30 bg-red-500/10 space-y-2">
              <div className="text-red-300 font-bold">2025 Agreement Clause 9.1</div>
              <p className="text-slate-300">"Either party may terminate upon <span className="bg-red-500/30 text-white px-1.5 py-0.5 rounded">30 days</span> written notice."</p>
            </div>
            <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-2">
              <div className="text-emerald-300 font-bold">2026 Agreement Clause 11.4</div>
              <p className="text-slate-300">"Either party may terminate upon <span className="bg-emerald-500/30 text-white px-1.5 py-0.5 rounded">90 days</span> written notice + cure period."</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10 SCENE: AUTONOMOUS AGENT WORKFLOW ───────────────────────────────── */}
      <section id="agents" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid lg:grid-cols-12 gap-12 items-center" data-reveal>
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-bold">// 04 AUTONOMOUS AGENTS</div>
            <h2 className="font-mono text-3xl sm:text-4xl font-bold text-white leading-tight">
              SYNAPS AGENTS ACT. THEY DO NOT SIMPLY CHAT.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Instantly launch autonomous agent workflows to audit risk, extract clauses, verify compliance, or draft response playbooks.
            </p>

            <button
              onClick={triggerAgentSearch}
              disabled={agentSearching}
              className="w-fit px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 shadow-[0_0_24px_rgba(0,85,255,0.35)]"
            >
              <Cpu className="w-4 h-4 text-cyan-300" />
              <span>{agentSearching ? 'EXECUTING AGENT WORKFLOW...' : 'RUN LIVE AGENT DEMO'}</span>
            </button>
          </div>

          <div className="lg:col-span-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0d0f17] font-mono text-xs space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-slate-400">
                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-cyan-400" /> AGENT TASK: AUDIT INDEMNIFICATION CLAUSES</span>
                <span className="text-cyan-400 font-bold">{agentProgress}%</span>
              </div>

              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 transition-all duration-150" style={{ width: `${agentProgress}%` }} />
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-black/40 space-y-2 text-slate-300">
                <div>[14:27:01] Scanning 142 repository files...</div>
                {agentProgress >= 30 && <div className="text-blue-400">[14:27:02] Identified 7 indemnification references across 4 agreements.</div>}
                {agentProgress >= 70 && <div className="text-amber-400">[14:27:03] Flagged 1 outdated liability cap in MSA_2024.pdf.</div>}
                {agentProgress >= 100 && <div className="text-emerald-400 font-bold">[14:27:04] WORKFLOW COMPLETE. Audit report saved to Workspace.</div>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 15 SCENE: FINAL CONVERGENCE & ENTRY ──────────────────────────────── */}
      <section className="py-32 px-6 sm:px-12 max-w-5xl mx-auto text-center border-t border-white/10 relative" data-reveal>
        <SynapsLogoAssemblyAnimation />

        <h2 className="font-mono text-3xl sm:text-5xl font-extrabold text-white mt-8 mb-6 tracking-tight">
          YOUR INFORMATION ALREADY KNOWS MORE THAN YOU THINK.
        </h2>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop searching blindly through isolated folders. Unlock the hidden evidentiary relationships inside your enterprise.
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-9 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm font-bold uppercase tracking-widest shadow-[0_0_40px_rgba(0,85,255,0.5)] hover:scale-105 transition-all inline-flex items-center gap-3"
        >
          <span>ENTER SYNAPS SYSTEM</span>
          <ArrowRight className="w-4 h-4 text-cyan-300" />
        </button>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 sm:px-12 border-t border-white/10 font-mono text-xs text-slate-500 flex flex-wrap items-center justify-between gap-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-slate-300 font-bold">SYNAPS AI</span>
          <span>© 2026 SYNAPS ENTERPRISE INC.</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <Link href="/legal/terms" className="hover:text-cyan-400 transition-colors">TERMS</Link>
          <Link href="/legal/privacy" className="hover:text-cyan-400 transition-colors">PRIVACY</Link>
          <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">DASHBOARD</Link>
        </div>
      </footer>

      {/* Sign In Modal */}
      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
