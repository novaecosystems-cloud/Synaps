'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, ArrowRight, ShieldCheck, FileText, Lock, Sparkles, Plus, CheckCircle2, Globe, Cpu, Zap, Activity } from 'lucide-react';
import SignInModal from '@/components/SignInModal';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

// ─── TEXT SPLITTER: Word-preserving Hashgraph + Huge Inc `anim-fade` per-char ─
function SplitText({ text, className = '' }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wIdx) => (
        <span
          key={wIdx}
          style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: '0.22em' }}
        >
          {word.split('').map((char, cIdx) => (
            <span
              key={cIdx}
              className="anim-char"
              aria-hidden="true"
              style={{ transitionDelay: `${(Math.random() * 0.35 + wIdx * 0.05).toFixed(2)}s` }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

// ─── MARQUEE DATA ─────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  'EVIDENCE-GROUNDED RAG',
  '10-AGENT BOARDROOM DEBATE',
  'ZERO HALLUCINATION GUARANTEE',
  'LINE-LEVEL CITATIONS',
  'DPDP ACT 2023 COMPLIANT',
  '3D KNOWLEDGE GRAPH',
  'AES-256 ZERO-TRUST VAULT',
  'PDF · EXCEL · DOCX · CSV',
];

// ─── ACCORDION DATA (Huge Inc + Iberian) ──────────────────────────────────────
const FEATURES = [
  {
    id: '01',
    title: 'DOCUMENT REASONING & PARSING',
    sub: 'PDF · EXCEL · DOCX · CSV INGESTION IN SECONDS',
    body: 'Synaps parses multi-hundred-page PDFs, complex financial spreadsheets, and legal agreements with zero data loss. Line-level vector embeddings ground every answer directly in your source documents — zero hallucination possible.',
    icon: FileText,
  },
  {
    id: '02',
    title: '10-AGENT BOARDROOM CONSENSUS',
    sub: 'PARALLEL MULTI-AGENT RISK & OBLIGATION DEBATE',
    body: 'Ten specialized AI agents — Legal, Financial, Compliance, Risk, Security — analyze your input simultaneously. They debate vulnerabilities, flag hidden liabilities, and produce an auditable consensus brief before responding.',
    icon: Sparkles,
  },
  {
    id: '03',
    title: '3D ENTERPRISE MEMORY GRAPH',
    sub: 'NEURAL RELATIONSHIP VISUALIZATION ACROSS YOUR ORG',
    body: 'Connect entity relationships across your entire company database. Synaps maps contracts to projects, requirements to regulations, and personnel to risk exposure in an interactive 3D knowledge graph.',
    icon: Globe,
  },
  {
    id: '04',
    title: 'ZERO-TRUST VAULT & DPDP COMPLIANCE',
    sub: 'AES-256 ENCRYPTION & MULTI-TENANT ISOLATION',
    body: 'Built from day one to comply with India\'s DPDP Act 2023. AES-256 encryption at rest and in transit. Multi-tenant physical isolation. HTTP-Only session tokens. Zero user data ever trained on.',
    icon: Lock,
  },
];

// ─── AGENT CARDS (Huge Inc Grid) ──────────────────────────────────────────────
const AGENTS = [
  { title: 'CHIEF OF STAFF', role: 'Strategic Alignment', icon: ShieldCheck },
  { title: 'LEGAL COUNSEL', role: 'Liability & Clause Analysis', icon: FileText },
  { title: 'CFO', role: 'Capital & ROI Exposure', icon: CheckCircle2 },
  { title: 'RISK AUDITOR', role: 'Vulnerability Detection', icon: Lock },
  { title: 'COMPLIANCE', role: 'DPDP & Regulatory Match', icon: Sparkles },
  { title: 'ENGINEERING', role: 'Technical Feasibility', icon: Cpu },
  { title: 'MARKETING', role: 'Market Position Impact', icon: Globe },
  { title: 'OPERATIONS', role: 'Workflow Bottlenecks', icon: Activity },
  { title: 'SECURITY', role: 'Zero-Trust Isolation', icon: Zap },
  { title: 'DIGITAL TWIN', role: 'Executive Consensus', icon: Sparkles },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SynapsLanding() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [openFeature, setOpenFeature] = useState<string | null>('01');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  // ── Curtain Loader State ──────────────────────────────────────────────────
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [loaderComplete, setLoaderComplete] = useState(false);
  const curtainRef = useRef<HTMLDivElement>(null);
  const curtainWaveRef = useRef<SVGPathElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // ── Curtain Loader Progress Ticker (Hashgraph & Iberian style) ────────────
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 12) + 4;
      if (current >= 100) {
        current = 100;
        setLoaderProgress(100);
        clearInterval(interval);
        
        // Trigger Curtain Lift Animation with GSAP (cubic-bezier cubic curtain reveal)
        setTimeout(() => {
          if (curtainRef.current) {
            gsap.to(curtainRef.current, {
              y: '-100%',
              duration: 1.2,
              ease: 'cubic-bezier(0.14, 1, 0.34, 1)',
              onComplete: () => setLoaderComplete(true),
            });
          }
        }, 300);
      } else {
        setLoaderProgress(current);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Re-trigger Curtain Lift Wipe (for logo click or section change)
  const triggerCurtainWipe = useCallback(() => {
    if (!curtainRef.current) return;
    setLoaderComplete(false);
    setLoaderProgress(0);

    gsap.fromTo(
      curtainRef.current,
      { y: '100%' },
      {
        y: '0%',
        duration: 0.7,
        ease: 'cubic-bezier(0.14, 1, 0.34, 1)',
        onComplete: () => {
          gsap.to(curtainRef.current, {
            y: '-100%',
            duration: 0.9,
            delay: 0.2,
            ease: 'cubic-bezier(0.14, 1, 0.34, 1)',
            onComplete: () => setLoaderComplete(true),
          });
        },
      }
    );
  }, []);

  // ── Scroll progress + header reveal ─────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) setScrollProgress((window.scrollY / total) * 100);
      setHeaderVisible(window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Marquee animation ───────────────────────────────────────────────────
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    gsap.to(el, {
      x: '-50%',
      duration: 28,
      ease: 'none',
      repeat: -1,
    });
  }, []);

  // ── GSAP: animations ────────────────────────────────────────────────────
  useGSAP(() => {
    // IntersectionObserver for .anim-line wrappers -> trigger .is-visible
    const sections = document.querySelectorAll('[data-anim-section]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    sections.forEach((s) => io.observe(s));

    // Hashgraph style: anim-word translateY 75% -> 0
    gsap.utils.toArray<HTMLElement>('[data-slide-up]').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        y: '75%',
        opacity: 0,
        duration: 0.85,
        ease: 'cubic-bezier(0.14, 1, 0.34, 1)',
      });
    });

    // Iberian translateY(100%) fade
    gsap.utils.toArray<HTMLElement>('[data-slide-line]').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        y: '100%',
        opacity: 0,
        duration: 0.8,
        delay: i * 0.06,
        ease: 'cubic-bezier(0.14, 1, 0.34, 1)',
      });
    });

    // Hashgraph dash-reveal on vertical rule
    gsap.utils.toArray<HTMLElement>('[data-dash-vertical]').forEach((el) => {
      gsap.fromTo(el,
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          duration: 1.2,
          ease: 'cubic-bezier(0.14, 1, 0.34, 1)',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );
    });

    // Scale + opacity for agent cards (staggered)
    gsap.utils.toArray<HTMLElement>('[data-agent-card]').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
        scale: 0.88,
        opacity: 0,
        duration: 0.65,
        delay: (i % 5) * 0.06,
        ease: 'back.out(1.4)',
      });
    });

    // Logo mark: Hashgraph scale(.9) rotate(-20deg) -> scale(1) rotate(0)
    gsap.from('[data-logo-mark]', {
      scale: 0.9,
      rotate: -20,
      opacity: 0,
      duration: 1.4,
      ease: 'cubic-bezier(0.14, 1, 0.34, 1)',
    });

    return () => io.disconnect();
  }, { scope: containerRef });

  const openModal = useCallback(() => setShowSignIn(true), []);

  return (
    <>
      {/* ── GLOBAL STYLES (Hashgraph + Iberian + Huge Inc Fusion) ───────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

        /* ── Base ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        body { background-color: #000209; color: #eee; font-family: 'Space Grotesk', system-ui, sans-serif; overflow-x: hidden; }

        /* ── Huge Inc Color Palette Tokens ── */
        :root {
          --huge-black: #000000;
          --huge-magenta: #ff0090;
          --huge-cyan: #9bb8e1;
          --huge-purple: #7c3aed;
          --huge-gray-text: #73767d;
          --huge-dark-bg: #000209;
        }

        /* ── Font utilities ── */
        .ff-teko { font-family: 'Teko', sans-serif; text-transform: uppercase; line-height: 0.88em; letter-spacing: 0.01em; }
        .ff-mono { font-family: 'JetBrains Mono', monospace; }
        .ff-sans { font-family: 'Space Grotesk', system-ui, sans-serif; }

        /* ── Hashgraph character animation ── */
        .anim-char {
          position: relative;
          display: inline-block;
          opacity: 0;
          transform: translateY(75%);
          transition: transform 0.8s cubic-bezier(0.14, 1, 0.34, 1), opacity 0.8s linear;
        }
        .is-visible .anim-char { opacity: 1; transform: translateY(0); }

        /* ── Hashgraph line animation ── */
        .anim-line-oh { overflow: hidden; display: block; }
        .anim-line {
          transform: translateY(100%);
          transition: transform 0.8s cubic-bezier(0.14, 1, 0.34, 1);
        }
        .is-visible .anim-line { transform: translateY(0); }

        /* ── Body copy staggered fade ── */
        .anim-body-line {
          position: relative;
          display: block;
          opacity: 0;
          transition: opacity 0.6s linear;
        }
        .is-visible .anim-body-line { opacity: 1; }

        /* ── Huge Inc Signature Underline Slide ── */
        .huge-link {
          position: relative;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .huge-link::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--huge-magenta);
          transform: scaleX(0);
          transform-origin: bottom right;
          transition: transform 0.3s cubic-bezier(0.14, 1, 0.34, 1);
        }
        .huge-link:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
        .huge-link:hover .huge-arrow {
          transform: rotate(-45deg);
          color: var(--huge-magenta);
        }
        .huge-arrow {
          transition: transform 0.3s cubic-bezier(0.14, 1, 0.34, 1), color 0.3s ease;
        }

        /* ── Hashgraph shimmer button ── */
        .synaps-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: 46px;
          padding: 0 24px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          color: #eee;
          background: transparent;
          border: none;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          overflow: hidden;
          border-radius: 6px;
          text-decoration: none;
          transition: color 0.3s ease, border-color 0.3s ease;
        }
        .synaps-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          border: 2px solid #9bb8e1;
          border-radius: 6px;
          filter: blur(5px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.6s cubic-bezier(0.14, 1, 0.34, 1);
        }
        .synaps-btn:hover::before { opacity: 1; }

        .synaps-btn__border {
          position: absolute;
          inset: 0;
          border-radius: 6px;
          overflow: visible;
          pointer-events: none;
          z-index: 1;
        }
        .synaps-btn__border rect {
          stroke: url(#btnBorderGrad);
          stroke-width: 1;
          fill: none;
          stroke-dasharray: 0, 9999;
          transition: stroke-dasharray 0.6s cubic-bezier(0.9, 0, 0.1, 1);
        }
        .synaps-btn:hover .synaps-btn__border rect {
          stroke-dasharray: 9999, 0;
        }

        .synaps-btn__shimmer {
          position: absolute;
          inset: 0;
          border-radius: 6px;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
          transition: opacity 0.6s cubic-bezier(0.14, 1, 0.34, 1);
        }
        .synaps-btn__shimmer-inner {
          animation: btn-shimmer 5s cubic-bezier(0.14, 1, 0.34, 1) infinite forwards;
          display: flex;
          height: 100%;
          position: relative;
          width: 100%;
        }
        .synaps-btn__shimmer-inner::before {
          background-color: #9bb8e1;
          bottom: -4rem;
          content: "";
          filter: blur(24px);
          left: calc(50% - 20px);
          position: absolute;
          top: -4rem;
          transform: rotate(19.92deg);
          width: 40px;
        }
        @keyframes btn-shimmer {
          0%   { opacity: 1; transform: translateX(-100%); }
          10%  { opacity: 1; }
          70%  { opacity: 0; }
          100% { transform: translateX(100%); }
        }

        .synaps-btn__label { position: relative; z-index: 2; display: flex; align-items: center; gap: 8px; }
        .synaps-btn__label--base { transition: transform 0.6s cubic-bezier(0.9, 0, 0.1, 1), opacity 0.5s linear 0.1s; }
        .synaps-btn:hover .synaps-btn__label--base { opacity: 0; transform: translateY(-100%); }

        .synaps-btn__label--hover {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          z-index: 3;
          opacity: 0;
          transform: translateY(100%);
          transition: transform 0.6s cubic-bezier(0.14, 1, 0.34, 1), opacity 0.4s linear;
        }
        .synaps-btn:hover .synaps-btn__label--hover { opacity: 1; transform: translateY(0); }

        /* ── Dash-wipe vertical lines ── */
        @keyframes dash-wipe {
          0%   { clip-path: inset(0 0 0 0); }
          25%  { clip-path: inset(100% 0 0 0); }
          100% { clip-path: inset(100% 0 0 0); }
        }
        @keyframes dash-reveal {
          12%  { clip-path: inset(0 0 100% 0); }
          30%  { clip-path: inset(0 0 0 0); }
          100% { clip-path: inset(0 0 0 0); }
        }
        .dash-line {
          display: flex;
          height: 2.4rem;
          position: relative;
          width: 1px;
        }
        .dash-line::before,
        .dash-line::after {
          background: linear-gradient(180deg, #9bb8e1, #2c4e73);
          content: "";
          inset: 0;
          position: absolute;
        }
        .dash-line::before { animation: dash-wipe 2s linear infinite; clip-path: inset(0 0 0 0); }
        .dash-line::after  { animation: dash-reveal 2s linear infinite; clip-path: inset(0 0 100% 0); }

        /* ── Iberian: rotating badge ── */
        @keyframes rotateBadge { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .badge-rotate { animation: rotateBadge 35s linear infinite; }

        /* ── Marquee ── */
        @keyframes marqueeScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee-track { animation: marqueeScroll 28s linear infinite; display: flex; width: max-content; }
        .marquee-track:hover { animation-play-state: paused; }

        /* ── Gradient text ── */
        .text-gradient-blue {
          background: linear-gradient(135deg, #9bb8e1, #7c3aed, #ff0090);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Section title tag ── */
        .section-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #b7c6d4;
        }
        .section-tag__id {
          background: linear-gradient(90deg, #9bb8e1, #ff0090);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Body copy color ── */
        .body-copy { color: #b7c6d4; line-height: 1.7; }

        /* ── Huge Inc Hover Focus / Dim Effect ── */
        .huge-hover-list:hover > .huge-hover-item:not(:hover) {
          opacity: 0.3;
          filter: grayscale(40%);
          transition: opacity 0.4s ease, filter 0.4s ease;
        }
        .huge-hover-item {
          transition: opacity 0.4s ease, filter 0.4s ease, transform 0.3s ease, border-color 0.3s ease;
        }

        /* ── Accordion ── */
        .accordion-body { max-height: 0; overflow: hidden; transition: max-height 0.8s cubic-bezier(0.14, 1, 0.34, 1); }
        .accordion-body.open { max-height: 350px; }
        .accordion-icon { transition: transform 0.8s cubic-bezier(0.14, 1, 0.34, 1); }
        .accordion-icon.open { transform: rotate(135deg); }

        /* ── Agent card hover ── */
        .agent-card { transition: transform 0.4s cubic-bezier(0.14, 1, 0.34, 1), border-color 0.3s ease, background 0.3s ease; cursor: default; }
        .agent-card:hover { transform: translateY(-6px); border-color: rgba(255, 0, 144, 0.6); background: rgba(255, 0, 144, 0.08); }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #000209; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#9bb8e1, #7c3aed, #ff0090); border-radius: 99px; }
      `}</style>

      {/* ── CURTAIN LOADER (Hashgraph + Iberian Curtain Wave loader) ────────── */}
      {!loaderComplete && (
        <div
          ref={curtainRef}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: '#000209',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Ambient Glow behind loader */}
          <div style={{
            position: 'absolute', width: 600, height: 600,
            background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, rgba(255,0,144,0.15) 50%, transparent 75%)',
            filter: 'blur(80px)', pointerEvents: 'none',
          }} />

          {/* Loader Content */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            {/* Spinning Emblem */}
            <div style={{
              position: 'relative', width: 100, height: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg className="badge-rotate" viewBox="0 0 100 100" style={{ width: '100%', height: '100%', position: 'absolute' }}>
                <path id="loader-circle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="none" />
                <text fill="#9bb8e1" style={{ fontFamily: 'JetBrains Mono', fontSize: 7, letterSpacing: '0.24em' }}>
                  <textPath href="#loader-circle">SYNAPS AI · INITIALIZING SYSTEM · REASONING ·</textPath>
                </text>
              </svg>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'linear-gradient(135deg, #7c3aed, #ff0090)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(255,0,144,0.5)',
              }}>
                <span className="ff-teko" style={{ fontSize: 28, color: '#fff', lineHeight: 1 }}>S</span>
              </div>
            </div>

            {/* Progress Counter Ticker */}
            <div style={{ textAlign: 'center' }}>
              <div className="ff-teko" style={{ fontSize: 64, color: '#fff', lineHeight: 1, letterSpacing: '0.04em' }}>
                {loaderProgress.toString().padStart(2, '0')}<span style={{ fontSize: 32, color: '#ff0090' }}>%</span>
              </div>
              <div className="ff-mono" style={{ fontSize: 10, color: '#9bb8e1', letterSpacing: '0.2em', marginTop: 4 }}>
                INITIALIZING ENTERPRISE BRAIN...
              </div>
            </div>

            {/* Progress Bar Track */}
            <div style={{
              width: 240, height: 3, background: 'rgba(155,184,225,0.15)',
              borderRadius: 99, overflow: 'hidden', marginTop: 8,
            }}>
              <div style={{
                height: '100%', width: `${loaderProgress}%`,
                background: 'linear-gradient(90deg, #9bb8e1, #7c3aed, #ff0090)',
                transition: 'width 0.05s linear',
              }} />
            </div>
          </div>

          {/* Bottom Liquid Wave Curtain Edge (Iberian Style) */}
          <div style={{
            position: 'absolute', bottom: -60, left: 0, width: '100%',
            height: 120, pointerEvents: 'none',
          }}>
            <svg viewBox="0 0 1440 120" style={{ width: '100%', height: '100%', fill: '#000209' }}>
              <path ref={curtainWaveRef} d="M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,64C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
            </svg>
          </div>
        </div>
      )}

      {/* ── PROGRESS BAR ──────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 9999,
          height: 2, background: 'linear-gradient(90deg, #9bb8e1, #7c3aed, #ff0090)',
          width: `${scrollProgress}%`, transition: 'width 0.1s linear',
        }}
      />

      {/* ── SVG GRADIENT DEFS ────────────────────────────────────────────── */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <linearGradient id="btnBorderGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9bb8e1" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#ff0090" />
          </linearGradient>
        </defs>
      </svg>

      <div ref={containerRef}>

        {/* ── FIXED HEADER (Hashgraph + Huge Inc) ─────────────────────────── */}
        <header style={{
          position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
          padding: '20px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: headerVisible ? 'rgba(0, 2, 9, 0.9)' : 'transparent',
          backdropFilter: headerVisible ? 'blur(14px)' : 'none',
          borderBottom: headerVisible ? '1px solid rgba(155, 184, 225, 0.1)' : 'none',
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease',
        }}>
          {/* Logo - click triggers curtain wipe */}
          <div
            data-logo-mark
            onClick={triggerCurtainWipe}
            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
            title="Click to replay Curtain Loader"
          >
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #7c3aed, #ff0090)',
              padding: 1, boxShadow: '0 0 20px rgba(255,0,144,0.35)',
            }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: 9,
                background: '#000209', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="ff-teko" style={{ fontSize: 22, color: '#9bb8e1', lineHeight: 1 }}>S</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="ff-teko" style={{ fontSize: 22, color: '#fff', letterSpacing: '0.08em', lineHeight: 1 }}>SYNAPS AI</span>
              <span className="ff-mono" style={{ fontSize: 9, color: '#9bb8e1', letterSpacing: '0.2em', opacity: 0.7 }}>ENTERPRISE BRAIN</span>
            </div>
          </div>

          {/* Nav links (Huge Inc Underline Slide Style) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {[
              { label: 'FEATURES', href: '#features' },
              { label: 'BOARDROOM', href: '#boardroom' },
              { label: 'SECURITY', href: '#security' },
            ].map(({ label, href }) => (
              <a key={label} href={href} className="ff-mono huge-link" style={{
                fontSize: 11, color: 'rgba(238,238,238,0.7)', letterSpacing: '0.1em',
              }}>
                <span>{label}</span>
              </a>
            ))}

            <Link href="/dashboard/chat" className="ff-mono huge-link" style={{
              fontSize: 11, color: '#9bb8e1', letterSpacing: '0.1em', fontWeight: 700,
            }}>
              <span>APP</span>
              <ArrowUpRight className="w-3.5 h-3.5 huge-arrow" />
            </Link>

            <button onClick={openModal} className="synaps-btn">
              <svg className="synaps-btn__border" aria-hidden="true">
                <rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="5" ry="5" />
              </svg>
              <span className="synaps-btn__shimmer"><span className="synaps-btn__shimmer-inner" /></span>
              <span className="synaps-btn__label">
                <span className="synaps-btn__label--base">LAUNCH SYSTEM</span>
                <span className="synaps-btn__label--hover">SIGN IN →</span>
              </span>
            </button>
          </div>
        </header>

        {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
        <section ref={heroRef} style={{
          minHeight: '100svh', position: 'relative',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '0 40px 60px', overflow: 'hidden',
        }}>
          {/* Background glow orbs */}
          <div style={{
            position: 'absolute', top: '25%', left: '35%', width: 750, height: 500,
            background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.24) 0%, rgba(255,0,144,0.1) 50%, transparent 75%)',
            filter: 'blur(50px)', pointerEvents: 'none', transform: 'translate(-50%,-50%)',
          }} />

          {/* Rotating badge (Iberian) */}
          <div style={{
            position: 'absolute', top: 110, right: 60, width: 140, height: 140,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg className="badge-rotate" viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <path id="badge-circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
              <text fill="#9bb8e1" style={{ fontFamily: 'JetBrains Mono', fontSize: 7.5, letterSpacing: '0.22em' }}>
                <textPath href="#badge-circle">SYNAPS AI · 10-AGENT BOARDROOM · EVIDENCE GROUNDED ·</textPath>
              </text>
            </svg>
            <Sparkles style={{ position: 'absolute', width: 22, height: 22, color: '#ff0090' }} />
          </div>

          {/* Headline with word-preserving character split */}
          <div style={{ maxWidth: 1250, position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <span className="dash-line" />
              <span className="section-tag" data-slide-up>
                <span className="section-tag__id">// SYSTEM 3.4</span> · DPDP ACT 2023 COMPLIANT
              </span>
            </div>

            <h1
              className="ff-teko"
              data-anim-section
              style={{ fontSize: 'clamp(54px, 9.5vw, 150px)', color: '#fff', marginBottom: 16, lineHeight: 0.88 }}
            >
              <SplitText text="EVIDENCE GROUNDED" className="block" />
              <SplitText text="ENTERPRISE BRAIN" className="block text-gradient-blue" />
            </h1>

            {/* Sub-grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px 80px', marginTop: 40, alignItems: 'end' }}>
              <p className="body-copy" data-slide-up style={{ fontSize: 17, maxWidth: 520, lineHeight: 1.65 }}>
                Synaps transforms complex organizational documents, contracts, and datasets into an
                interactive, auditable knowledge graph. Powered by a{' '}
                <strong style={{ color: '#9bb8e1' }}>10-agent boardroom</strong> debate engine — grounded in your sources with line-level evidence.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="ff-mono" style={{
                  fontSize: 11, color: 'rgba(155,184,225,0.7)', letterSpacing: '0.12em',
                  paddingLeft: 12, borderLeft: '2px solid #ff0090', lineHeight: 1.8,
                }}>
                  PDF · EXCEL · DOCX · CSV<br />
                  ZERO HALLUCINATIONS GUARANTEED
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button onClick={openModal} className="synaps-btn" style={{ height: 50, fontSize: 13 }}>
                    <svg className="synaps-btn__border" aria-hidden="true">
                      <rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="5" ry="5" />
                    </svg>
                    <span className="synaps-btn__shimmer"><span className="synaps-btn__shimmer-inner" /></span>
                    <span className="synaps-btn__label">
                      <span className="synaps-btn__label--base">START FREE TRIAL <ArrowRight style={{ width: 14, height: 14 }} /></span>
                      <span className="synaps-btn__label--hover">SIGN UP NOW →</span>
                    </span>
                  </button>

                  <Link href="/dashboard/chat" className="synaps-btn" style={{
                    height: 50, fontSize: 13,
                    border: '1px solid rgba(155,184,225,0.25)',
                    borderRadius: 6,
                  }}>
                    <span className="synaps-btn__label" style={{ position: 'relative', zIndex: 2 }}>
                      OPEN APP <ArrowUpRight className="w-3.5 h-3.5 huge-arrow" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator (Hashgraph style dash-wipe) */}
          <div style={{
            position: 'absolute', bottom: 36, right: 40,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            <span className="ff-mono" style={{ fontSize: 9, color: '#576676', letterSpacing: '0.2em', writingMode: 'vertical-rl' }}>SCROLL</span>
            <div style={{
              width: 1, height: 50,
              background: 'linear-gradient(180deg, #9bb8e1, #ff0090)',
              margin: '0 auto',
            }} data-dash-vertical />
          </div>
        </section>

        {/* ── MARQUEE STRIP ─────────────────────────────────────────────────── */}
        <div style={{
          width: '100%', overflow: 'hidden', whiteSpace: 'nowrap',
          borderTop: '1px solid rgba(155,184,225,0.1)',
          borderBottom: '1px solid rgba(155,184,225,0.1)',
          background: 'rgba(5,9,20,0.85)', padding: '14px 0',
        }}>
          <div ref={marqueeRef} className="marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="ff-mono" style={{
                display: 'inline-flex', alignItems: 'center', gap: 16, padding: '0 28px',
                fontSize: 11, color: 'rgba(155,184,225,0.75)', letterSpacing: '0.12em',
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ff0090', display: 'inline-block' }} />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── FEATURES ACCORDION (Huge Inc Hover Focus + Iberian Expand) ────── */}
        <section id="features" style={{ padding: '120px 40px', maxWidth: 1250, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 64, flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div className="section-tag" data-slide-up style={{ marginBottom: 16 }}>
                <span className="section-tag__id">// 01</span> SYSTEM ARCHITECTURE
              </div>
              <h2 className="ff-teko" data-slide-up style={{ fontSize: 'clamp(52px, 6.5vw, 92px)', color: '#fff' }}>
                BUILT FOR<br />ZERO RISK
              </h2>
            </div>
            <p className="body-copy" data-slide-up style={{ maxWidth: 420, fontSize: 15, paddingTop: 24 }}>
              Standard LLMs guess when they don&apos;t know. Synaps requires line-level evidence for every claim — or refuses to answer entirely.
            </p>
          </div>

          {/* Accordion list with Huge Inc hover-focus dimming */}
          <div className="huge-hover-list" style={{ borderTop: '1px solid rgba(155,184,225,0.15)' }}>
            {FEATURES.map((f) => {
              const isOpen = openFeature === f.id;
              const isHovered = hoveredFeature === f.id;

              return (
                <div
                  key={f.id}
                  className="huge-hover-item"
                  onMouseEnter={() => setHoveredFeature(f.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  style={{ borderBottom: '1px solid rgba(155,184,225,0.15)' }}
                >
                  <button
                    onClick={() => setOpenFeature(isOpen ? null : f.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', padding: '28px 0',
                      background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'padding-left 0.4s cubic-bezier(0.14, 1, 0.34, 1)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.paddingLeft = '12px')}
                    onMouseLeave={e => (e.currentTarget.style.paddingLeft = '0')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                      <span className="ff-mono" style={{
                        fontSize: 16,
                        color: isOpen ? '#ff0090' : isHovered ? '#9bb8e1' : 'rgba(155,184,225,0.35)',
                        transition: 'color 0.3s ease', minWidth: 42,
                      }}>
                        [{f.id}]
                      </span>
                      <div>
                        <h3 className="ff-teko" style={{
                          fontSize: 'clamp(28px, 3.5vw, 48px)',
                          color: isOpen ? '#ff0090' : isHovered ? '#ffffff' : '#eee',
                          transition: 'color 0.3s ease', lineHeight: 1,
                        }}>
                          {f.title}
                        </h3>
                        <span className="ff-mono" style={{ fontSize: 10, color: '#73767d', letterSpacing: '0.1em' }}>{f.sub}</span>
                      </div>
                    </div>

                    <div className={`accordion-icon ${isOpen ? 'open' : ''}`} style={{
                      width: 44, height: 44, borderRadius: '50%',
                      border: `1px solid ${isOpen ? '#ff0090' : isHovered ? '#9bb8e1' : 'rgba(155,184,225,0.2)'}`,
                      background: isOpen ? 'rgba(255,0,144,0.15)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isOpen ? '#ff0090' : '#9bb8e1', flexShrink: 0,
                      transition: 'transform 0.8s cubic-bezier(0.14,1,0.34,1), border-color 0.3s, background 0.3s',
                    }}>
                      <Plus style={{ width: 18, height: 18 }} />
                    </div>
                  </button>

                  <div className={`accordion-body ${isOpen ? 'open' : ''}`}>
                    <div style={{
                      paddingLeft: 74, paddingBottom: 32, paddingRight: 60,
                      maxWidth: 750,
                    }}>
                      <p className="body-copy" style={{ fontSize: 15, lineHeight: 1.75 }}>
                        {f.body}
                      </p>

                      <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                        <button onClick={openModal} className="synaps-btn" style={{ height: 42, fontSize: 11 }}>
                          <svg className="synaps-btn__border" aria-hidden="true">
                            <rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="5" ry="5" />
                          </svg>
                          <span className="synaps-btn__shimmer"><span className="synaps-btn__shimmer-inner" /></span>
                          <span className="synaps-btn__label">
                            <span className="synaps-btn__label--base">TRY THIS FEATURE →</span>
                            <span className="synaps-btn__label--hover">SIGN IN →</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 10-AGENT BOARDROOM (Huge Inc Grid + Dim Hover) ────────────────── */}
        <section id="boardroom" style={{
          background: 'rgba(5,9,20,0.95)',
          borderTop: '1px solid rgba(155,184,225,0.08)',
          borderBottom: '1px solid rgba(155,184,225,0.08)',
          padding: '120px 40px',
        }}>
          <div style={{ maxWidth: 1250, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div className="section-tag" data-slide-up style={{ marginBottom: 16 }}>
                <span className="section-tag__id">// 02</span> PARALLEL REASONING ENGINE
              </div>
              <h2 className="ff-teko" data-slide-up style={{ fontSize: 'clamp(52px, 6.5vw, 92px)', color: '#fff' }}>
                THE 10-AGENT<br />
                <span className="text-gradient-blue">BOARDROOM</span>
              </h2>
              <p className="body-copy" data-slide-up style={{ maxWidth: 540, margin: '16px auto 0', fontSize: 15 }}>
                Ten specialized AI personas analyze your documents simultaneously and debate before responding.
              </p>
            </div>

            {/* Grid of Agents with Huge Inc hover list dimming */}
            <div className="huge-hover-list" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 16,
            }}>
              {AGENTS.map((agent, i) => (
                <div
                  key={i}
                  className="agent-card huge-hover-item"
                  data-agent-card
                  onMouseEnter={() => setHoveredAgent(i)}
                  onMouseLeave={() => setHoveredAgent(null)}
                  style={{
                    padding: '26px 22px',
                    borderRadius: 12,
                    background: 'rgba(0, 2, 9, 0.85)',
                    border: hoveredAgent === i ? '1px solid #ff0090' : '1px solid rgba(155,184,225,0.12)',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: hoveredAgent === i ? 'rgba(255,0,144,0.15)' : 'rgba(124,58,237,0.12)',
                    border: hoveredAgent === i ? '1px solid #ff0090' : '1px solid rgba(124,58,237,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: hoveredAgent === i ? '#ff0090' : '#9bb8e1', marginBottom: 16,
                    transition: 'transform 0.4s cubic-bezier(0.14,1,0.34,1), background 0.3s, border-color 0.3s',
                  }}>
                    <agent.icon style={{ width: 18, height: 18 }} />
                  </div>
                  <h4 className="ff-teko" style={{
                    fontSize: 22, color: hoveredAgent === i ? '#ffffff' : '#eee', marginBottom: 4, letterSpacing: '0.05em',
                  }}>
                    {agent.title}
                  </h4>
                  <p className="ff-mono" style={{ fontSize: 10, color: '#73767d', letterSpacing: '0.06em' }}>
                    {agent.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECURITY ─────────────────────────────────────────────────────── */}
        <section id="security" style={{ padding: '120px 40px' }}>
          <div style={{ maxWidth: 1250, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px 80px', alignItems: 'start' }}>
            <div>
              <div className="section-tag" data-slide-up style={{ marginBottom: 16 }}>
                <span className="section-tag__id">// 03</span> SECURITY & TRUST
              </div>
              <h2 className="ff-teko" data-slide-up style={{ fontSize: 'clamp(44px, 5vw, 76px)', color: '#fff', marginBottom: 24 }}>
                ENTERPRISE-GRADE<br />SECURITY.<br />
                <span style={{ color: '#ff0090' }}>BUILT-IN.</span>
              </h2>
              <p className="body-copy" data-slide-up style={{ fontSize: 16, lineHeight: 1.75 }}>
                Your documents, your organisation, your data. Synaps never mixes data across tenants. Every request is authenticated. Every session is isolated. DPDP Act 2023 compliant from day one.
              </p>

              <button onClick={openModal} className="synaps-btn" style={{ marginTop: 36, height: 50, fontSize: 13 }}>
                <svg className="synaps-btn__border" aria-hidden="true">
                  <rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="5" ry="5" />
                </svg>
                <span className="synaps-btn__shimmer"><span className="synaps-btn__shimmer-inner" /></span>
                <span className="synaps-btn__label">
                  <span className="synaps-btn__label--base">START FREE TRIAL →</span>
                  <span className="synaps-btn__label--hover">GET SECURE ACCESS →</span>
                </span>
              </button>
            </div>

            <div data-anim-section style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                'AES-256 encryption at rest & in transit',
                'Multi-tenant physical data isolation',
                'HTTP-Only session tokens (no XSS)',
                'DPDP Act 2023 compliant audit logs',
                '2FA / MFA authentication support',
                'Zero user data trained on models — ever',
              ].map((item, i) => (
                <div
                  key={i}
                  className="anim-body-line"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '18px 0',
                    borderBottom: '1px solid rgba(155,184,225,0.1)',
                    transitionDelay: `${i * 0.1}s`,
                  }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'rgba(255,0,144,0.1)', border: '1px solid rgba(255,0,144,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#ff0090" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="ff-mono" style={{ fontSize: 13, color: '#b7c6d4', letterSpacing: '0.03em' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section style={{
          padding: '160px 40px', textAlign: 'center',
          background: 'linear-gradient(180deg, #000209 0%, #060112 50%, #000209 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 800, height: 800,
            background: 'radial-gradient(ellipse at center, rgba(255,0,144,0.15) 0%, transparent 75%)',
            filter: 'blur(60px)', pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div className="section-tag" data-slide-up style={{ marginBottom: 24, display: 'block' }}>
              <span className="section-tag__id">// READY TO START</span>
            </div>

            <h2 className="ff-teko" data-anim-section style={{
              fontSize: 'clamp(44px, 8vw, 110px)', color: '#fff', lineHeight: 0.9, marginBottom: 28,
            }}>
              <SplitText text="YOUR ENTERPRISE" className="block" />
              <SplitText text="BRAIN STARTS" className="block text-gradient-blue" />
              <SplitText text="HERE" className="block" />
            </h2>

            <p className="body-copy" data-slide-up style={{ fontSize: 16, marginBottom: 48, lineHeight: 1.75, maxWidth: 560, margin: '0 auto 48px' }}>
              Join teams already using Synaps to move faster, decide better, and eliminate document chaos.
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={openModal} className="synaps-btn" style={{ height: 54, fontSize: 14 }}>
                <svg className="synaps-btn__border" aria-hidden="true">
                  <rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="5" ry="5" />
                </svg>
                <span className="synaps-btn__shimmer"><span className="synaps-btn__shimmer-inner" /></span>
                <span className="synaps-btn__label">
                  <span className="synaps-btn__label--base">GET STARTED FREE <ArrowRight style={{ width: 16, height: 16 }} /></span>
                  <span className="synaps-btn__label--hover">SIGN UP NOW →</span>
                </span>
              </button>

              <Link href="/dashboard/chat" className="synaps-btn" style={{
                height: 54, fontSize: 14,
                border: '1px solid rgba(155,184,225,0.25)',
                borderRadius: 6,
              }}>
                <span className="synaps-btn__label" style={{ position: 'relative', zIndex: 2 }}>
                  OPEN LIVE APP <ArrowUpRight className="w-4 h-4 huge-arrow" />
                </span>
              </Link>
            </div>

            <p className="ff-mono" style={{ marginTop: 24, fontSize: 11, color: '#73767d', letterSpacing: '0.1em' }}>
              NO CREDIT CARD · SETUP IN 2 MINUTES
            </p>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <footer style={{
          padding: '40px',
          borderTop: '1px solid rgba(155,184,225,0.08)',
          background: '#000209',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="ff-teko" style={{ fontSize: 20, color: '#fff', letterSpacing: '0.08em' }}>SYNAPS AI</span>
            <span className="ff-mono" style={{ fontSize: 10, color: '#73767d', marginLeft: 8 }}>
              © {new Date().getFullYear()}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 32 }}>
            {[
              { label: 'APP', href: '/dashboard/chat' },
              { label: 'DOCUMENTS', href: '/dashboard/documents' },
              { label: 'GRAPH', href: '/dashboard/graph' },
              { label: 'PRIVACY', href: '#' },
            ].map(({ label, href }) => (
              <a key={label} href={href} className="ff-mono huge-link" style={{
                fontSize: 10, color: '#73767d', letterSpacing: '0.12em',
              }}>
                <span>{label}</span>
              </a>
            ))}
          </div>
        </footer>

        {/* ── SIGN IN MODAL ─────────────────────────────────────────────────── */}
        <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
      </div>
    </>
  );
}
