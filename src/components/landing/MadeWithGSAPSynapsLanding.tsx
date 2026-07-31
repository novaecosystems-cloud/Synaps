'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';


import WaitlistModal from '../WaitlistModal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

// ─── TEXT SCRAMBLE ────────────────────────────────────────────────────────────
class TextScrambler {
  private el: HTMLElement;
  private chars = '!<>-_\\/[]{}—=+*^?#abcdefghijklmnopqrstuvwxyz01234';
  private queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];
  private frame = 0;
  private frameReq = 0;
  private resolve!: () => void;

  constructor(el: HTMLElement) {
    this.el = el;
    this.update = this.update.bind(this);
  }

  setText(newText: string): Promise<void> {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((resolve) => { this.resolve = resolve; });
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameReq);
    this.frame = 0;
    this.update();
    return promise;
  }

  private update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      const { from, to, start, end } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!this.queue[i].char || Math.random() < 0.28) {
          this.queue[i].char = this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        output += `<span style="color:#CAFF00;opacity:0.6">${this.queue[i].char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameReq = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}



// ─── HORIZONTAL MARQUEE ───────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  'ENTERPRISE INTELLIGENCE', 'DECISION MEMORY', 'AI AGENTS', 'CORPORATE GRAPH',
  'BOARDROOM SIMULATION', 'KNOWLEDGE INGESTION', 'RISK ANALYSIS', 'STRATEGY STUDIO',
];

function Marquee({ reverse = false }: { reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const w = ref.current.scrollWidth / 2;
    gsap.fromTo(ref.current, { x: reverse ? -w : 0 }, {
      x: reverse ? 0 : -w, duration: 28, ease: 'none', repeat: -1,
    });
  }, [reverse]);
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div ref={ref} style={{ display: 'flex', gap: 60, whiteSpace: 'nowrap', width: 'max-content' }}>
        {items.map((item, i) => (
          <span key={i} style={{ fontSize: 13, fontWeight: 700, letterSpacing: '3px', color: i % 3 === 0 ? '#CAFF00' : '#333', fontFamily: "'Space Grotesk', sans-serif" }}>
            {item} <span style={{ color: '#222' }}>•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SUITES = [
  { id:'01', tag:'COMMAND CONSOLE', label:'AI COO Command Console', sub:'Briefing & Operational Intelligence', color:'#CAFF00', dark:'#0A0A0A',
    desc:'Transforms all your documents, emails, CRMs, and contracts into a real-time operational briefing — grounded in your actual organizational memory, never hallucinated.',
    specs:['Org Health Score & Coverage', 'Decision Confidence Meter', 'Zero-Retention Memory SLA', '24/7 Real-Time Anomaly Audit'],
    stat:'99.4%', statLabel:'Synthesis Accuracy' },
  { id:'02', tag:'FLIGHT CONTROL', label:'Multi-Agent Flight Control', sub:'10 Parallel AI Agent Orchestration', color:'#FFFFFF', dark:'#0A0A0A',
    desc:'Orchestrates 10 specialized AI agents (Research, Finance, Legal, Engineering, Infosec, HR) simultaneously — each grounded in your company knowledge graph.',
    specs:['10 Specialized Agent Personas', 'Shared Memory Graph Pipeline', 'Parallel Task Execution', 'Full Audit Log & Provenance'],
    stat:'10×', statLabel:'Parallel Throughput' },
  { id:'03', tag:'DIGITAL TWINS', label:'Executive Boardroom Twins', sub:'8 C-Suite Personas, Zero Hallucination', color:'#CAFF00', dark:'#0A0A0A',
    desc:'Simulates how your CEO, CFO, CTO, Legal, HR would respond to any strategic scenario — grounded in historical company memory and risk tolerances.',
    specs:['8 C-Suite Persona Twins', 'Stress-Testing Strategic Options', 'Consensus & Divergence Heatmaps', 'Debate Record Generation'],
    stat:'8', statLabel:'C-Suite Personas' },
  { id:'04', tag:'STRATEGY STUDIO', label:'AI Strategy Studio', sub:'11-Stage Enterprise Roadmap Generator', color:'#FFFFFF', dark:'#0A0A0A',
    desc:'Formulates end-to-end enterprise strategy documents, competitive threat analysis, Red-Team AI challenges, and 11-stage execution roadmaps in minutes.',
    specs:['11-Stage Transformation Roadmap', 'Competitive Threat Scanning', 'Resource & Budget Allocation', 'Risk Mitigation Playbook'],
    stat:'110', statLabel:'Decision Models' },
];

const STATS = [
  { v:'110', l:'Decision Models', n:'01' },
  { v:'99.4%', l:'Confidence Score', n:'02' },
  { v:'10', l:'Parallel Agents', n:'03' },
  { v:'<2s', l:'Reasoning Latency', n:'04' },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function MadeWithGSAPSynapsLanding() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCard, setActiveCard] = useState(0);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const heroWordRef = useRef<HTMLSpanElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // GSAP: Hero entrance + scramble
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-line-1', { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: 'power4.out', delay: 0.3 });
      gsap.fromTo('.hero-line-2', { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: 'power4.out', delay: 0.55 });
      gsap.fromTo('.hero-line-3', { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: 'power4.out', delay: 0.75 });
      gsap.fromTo('.hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.1 });
      gsap.fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.3 });
      gsap.fromTo('.hero-badge', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)', delay: 0.15 });
      gsap.fromTo('.hero-canvas', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out', delay: 0.8 });
    });
    return () => ctx.revert();
  }, []);

  // GSAP: ScrollTrigger section reveals
  useEffect(() => {
    const sections = document.querySelectorAll('.reveal-section');
    sections.forEach(el => {
      gsap.fromTo(el.querySelectorAll('.reveal-child'),
        { yPercent: 60, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' } }
      );
    });
    // Stats counter
    document.querySelectorAll('.stat-num').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });
  }, []);

  // Scramble rotating word
  useEffect(() => {
    const words = ['INTELLIGENCE', 'MEMORY', 'DECISIONS', 'INSIGHT', 'STRATEGY'];
    let idx = 0;
    const el = heroWordRef.current;
    if (!el) return;
    const scrambler = new TextScrambler(el);
    const cycle = () => {
      scrambler.setText(words[idx]).then(() => { setTimeout(cycle, 2200); });
      idx = (idx + 1) % words.length;
    };
    const timer = setTimeout(cycle, 1600);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') { setSearchOpen(false); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // Auto rotate suite cards
  useEffect(() => {
    const t = setInterval(() => setActiveCard(p => (p + 1) % SUITES.length), 3800);
    return () => clearInterval(t);
  }, []);

  const filteredSuites = searchQuery ? SUITES.filter(s =>
    s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tag.toLowerCase().includes(searchQuery.toLowerCase())
  ) : SUITES;

  return (
    <div style={{ background: '#000', color: '#fff', fontFamily: "'Space Grotesk', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── GLOBAL CSS ─────────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&family=Syne:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        *{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{background:#000;overflow-x:hidden;}
        ::selection{background:#CAFF00;color:#000;}

        /* NAV */
        .nav-pill { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(12px); border-radius: 999px; padding: 8px 20px; display: flex; align-items: center; gap: 4px; }
        .nav-link { color: rgba(255,255,255,0.5); text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; padding: 4px 12px; border-radius: 999px; transition: all 0.2s; white-space: nowrap; }
        .nav-link:hover { color: #fff; background: rgba(255,255,255,0.06); }

        /* BUTTONS */
        .btn-lime { display: inline-flex; align-items: center; gap: 10px; background: #CAFF00; color: #000; border: none; font-family: inherit; font-size: 14px; font-weight: 800; letter-spacing: 0.02em; padding: 14px 28px; border-radius: 999px; cursor: pointer; text-decoration: none; transition: all 0.25s; }
        .btn-lime:hover { background: #d8ff33; transform: translateY(-2px); }
        .btn-outline { display: inline-flex; align-items: center; gap: 10px; background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.2); font-family: inherit; font-size: 14px; font-weight: 600; letter-spacing: 0.02em; padding: 14px 28px; border-radius: 999px; cursor: pointer; text-decoration: none; transition: all 0.25s; }
        .btn-outline:hover { border-color: rgba(255,255,255,0.6); }

        /* DISPLAY TEXT */
        .display-xl { font-family: 'Syne', sans-serif; font-size: clamp(64px, 10vw, 148px); font-weight: 900; line-height: 0.92; letter-spacing: -0.04em; color: #fff; }
        .display-lg { font-family: 'Syne', sans-serif; font-size: clamp(48px, 7vw, 100px); font-weight: 900; line-height: 0.92; letter-spacing: -0.04em; color: #fff; }
        .display-md { font-family: 'Syne', sans-serif; font-size: clamp(36px, 5vw, 72px); font-weight: 900; line-height: 0.96; letter-spacing: -0.03em; color: #fff; }
        .display-lime { color: #CAFF00; }
        .display-dim { color: rgba(255,255,255,0.25); }

        /* OVERFLOW CLIP WRAPPER */
        .overflow-clip { overflow: hidden; }

        /* CARDS */
        .glass-card { background: #111; border: 1px solid rgba(255,255,255,0.07); border-radius: 24px; overflow: hidden; transition: border-color 0.3s; }
        .glass-card:hover { border-color: rgba(202,255,0,0.25); }

        .suite-num { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.25); letter-spacing: 0.1em; }
        .section-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.3); letter-spacing: 0.12em; text-transform: uppercase; }

        /* SEPARATOR */
        .sep { width: 100%; height: 1px; background: rgba(255,255,255,0.07); }

        /* PRICING */
        .pricing-card { background: #0d0d0d; border: 1px solid rgba(255,255,255,0.08); border-radius: 28px; padding: 40px 36px; display: flex; flex-direction: column; }
        .pricing-card.featured { background: #CAFF00; border-color: #CAFF00; }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .hide-mob { display: none !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
        }

        /* MARQUEE */
        .marquee-wrap { padding: 22px 0; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); }

        /* SCROLLBAR */
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #000; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }

        /* CARD HOVER LIFT */
        .lift { transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1); }
        .lift:hover { transform: translateY(-6px); }

        /* GRID LAYOUT HELPERS */
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 900px) { .grid-3 { grid-template-columns: 1fr 1fr !important; } .grid-4 { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .grid-3, .grid-4 { grid-template-columns: 1fr !important; } }

        /* BLINK CURSOR */
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .blink { animation: blink 1s step-start infinite; }

        /* FLOAT ANIM */
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .float { animation: float 4s ease-in-out infinite; }

        /* SPIN SLOW */
        @keyframes spin-slow { to{transform:rotate(360deg)} }
        .spin-slow { animation: spin-slow 18s linear infinite; }

        /* PULSE */
        @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:0.4} }
        .pulse-dot { animation: pulse-dot 1.8s ease-in-out infinite; }
      `}</style>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <header style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 1280, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, background: '#CAFF00', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: '#000' }}>S</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', fontFamily: "'Space Grotesk', sans-serif" }}>SYNAPS.AI</span>
        </Link>

        {/* Nav pill */}
        <nav className="nav-pill hide-mob">
          {['Console', 'Agents', 'Boardroom', 'Strategy', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">{item}</a>
          ))}
          <Link href="/demo" className="nav-link" style={{ color: '#CAFF00', fontWeight: 700 }}>⚡ Demo Mode</Link>
        </nav>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button onClick={() => setSearchOpen(true)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', padding: '8px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.05em' }} className="hide-mob">
            ⌘ K
          </button>
          <Link href="/demo" style={{ color: '#CAFF00', border: '1px solid rgba(202,255,0,0.3)', textDecoration: 'none', fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: 999 }}>
            ⚡ Try Demo
          </Link>
          <button onClick={() => setWaitlistOpen(true)} className="btn-lime" style={{ padding: '10px 22px', fontSize: 13 }}>
            🔥 JOIN WAITLIST <span>↓</span>
          </button>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '140px 40px 80px', position: 'relative', overflow: 'hidden', maxWidth: 1400, margin: '0 auto' }}>

        {/* Top badge */}
        <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 40, opacity: 0 }}>
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#CAFF00' }} className="pulse-dot" />
          <span className="section-label">ENTERPRISE DECISION INTELLIGENCE — SYNAPS.AI</span>
        </div>

        {/* Massive headline */}
        <h1 style={{ marginBottom: 0 }}>
          <div className="overflow-clip">
            <div className="display-xl hero-line-1" style={{ opacity: 0 }}>Enterprise</div>
          </div>
          <div className="overflow-clip">
            <div className="display-xl hero-line-2 display-lime" style={{ opacity: 0 }}>
              <span ref={heroWordRef} style={{ display: 'inline-block', minWidth: '4ch' }}>MEMORY</span>
            </div>
          </div>
          <div className="overflow-clip">
            <div className="display-xl hero-line-3 display-dim" style={{ opacity: 0 }}>
              for every org.
            </div>
          </div>
        </h1>

        {/* Sub + CTA row */}
        <div className="hero-sub" style={{ marginTop: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap', opacity: 0 }}>
          <div style={{ maxWidth: 440 }}>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400 }}>
              Synaps ingests every document, email, contract, and decision your organization has ever made — and lets any executive ask anything, with complete confidence.
            </p>
          </div>
          <div className="hero-cta" style={{ display: 'flex', gap: 14, alignItems: 'center', flexShrink: 0, opacity: 0 }}>
            <Link href="/login" className="btn-lime">
              Launch Console →
            </Link>
            <Link href="#suite" className="btn-outline">
              See how it works
            </Link>
          </div>
        </div>

        {/* Hero stats strip */}
        <div style={{ marginTop: 80, display: 'flex', gap: 60, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 32 }} className="hero-sub">
          {STATS.map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 900, color: i % 2 === 0 ? '#CAFF00' : '#fff', letterSpacing: '-0.03em' }}>{s.v}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────────────── */}
      <div className="marquee-wrap">
        <Marquee />
      </div>



      {/* ── SUITE CARDS ──────────────────────────────────────────────────────── */}
      <section id="console" style={{ padding: '120px 40px', maxWidth: 1400, margin: '0 auto' }} className="reveal-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60, flexWrap: 'wrap', gap: 24 }}>
          <div className="reveal-child">
            <div className="suite-num" style={{ marginBottom: 12 }}>#001</div>
            <h2 className="display-md">
              Four intelligence<br />
              <span className="display-dim">modules.</span>
            </h2>
          </div>
          <Link href="/login" className="btn-outline reveal-child">Explore all modules →</Link>
        </div>

        {/* Card grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }} className="grid-2">
          {SUITES.map((suite, idx) => (
            <div key={idx} className="glass-card lift" style={{ padding: 36, cursor: 'pointer', background: activeCard === idx ? '#111' : '#080808', borderColor: activeCard === idx ? 'rgba(202,255,0,0.3)' : 'rgba(255,255,255,0.06)' }} onClick={() => setActiveCard(idx)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div className="suite-num">#{suite.id}</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: activeCard === idx ? '#CAFF00' : 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', fontFamily: "'JetBrains Mono', monospace" }}>{suite.tag}</span>
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 10, letterSpacing: '-0.02em' }}>{suite.label}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginBottom: 0, fontWeight: 500 }}>{suite.sub}</p>

              <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 20, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{suite.desc}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {suite.specs.map((spec, si) => (
                    <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                      <span style={{ color: '#CAFF00', fontSize: 10 }}>✓</span> {spec}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 900, color: '#CAFF00' }}>{suite.stat}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>{suite.statLabel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE 2 ─────────────────────────────────────────────────────────── */}
      <div className="marquee-wrap">
        <Marquee reverse />
      </div>



      {/* ── HOW IT WORKS ──────────────────────────────────────────────────────── */}
      <section id="agents" style={{ padding: '120px 40px', maxWidth: 1400, margin: '0 auto' }} className="reveal-section">
        <div style={{ marginBottom: 60 }}>
          <div className="suite-num reveal-child" style={{ marginBottom: 12 }}>#002</div>
          <h2 className="display-md reveal-child">
            From raw data<br />
            <span className="display-dim">to board-ready decisions.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }} className="reveal-child">
          {[
            { n:'01', t:'Ingest', d:'Upload every document, email, CRM export, and database dump into your secure Synaps vault.', c:'#CAFF00' },
            { n:'02', t:'Connect', d:'Synaps builds a 4D graph — linking people, decisions, risks, and knowledge across time.', c:'rgba(255,255,255,0.6)' },
            { n:'03', t:'Decide', d:'Ask any question. 10 specialized agents reason across your entire knowledge graph and return grounded answers.', c:'rgba(255,255,255,0.25)' },
          ].map((step, i) => (
            <div key={i} style={{ padding: 40, borderTop: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.2)', marginBottom: 32 }}>{step.n}</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 48, fontWeight: 900, color: step.c, marginBottom: 16, letterSpacing: '-0.03em' }}>{step.t}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{step.d}</p>
            </div>
          ))}
        </div>
      </section>



      {/* ── PRICING ───────────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '120px 40px', maxWidth: 1400, margin: '0 auto' }} className="reveal-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div className="suite-num reveal-child" style={{ marginBottom: 12 }}>#003</div>
            <h2 className="display-md reveal-child">
              Transparent pricing,<br />
              <span className="display-lime">built for teams.</span>
            </h2>
          </div>
          {/* Toggle */}
          <div className="reveal-child" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: !isAnnual ? '#fff' : 'rgba(255,255,255,0.35)', cursor: 'pointer' }} onClick={() => setIsAnnual(false)}>Monthly</span>
            <div onClick={() => setIsAnnual(!isAnnual)} style={{ width: 48, height: 26, background: isAnnual ? '#CAFF00' : 'rgba(255,255,255,0.1)', borderRadius: 999, padding: 3, cursor: 'pointer', transition: 'background 0.3s', flexShrink: 0 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: isAnnual ? '#000' : '#fff', transform: isAnnual ? 'translateX(22px)' : 'translateX(0)', transition: 'transform 0.3s' }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: isAnnual ? '#fff' : 'rgba(255,255,255,0.35)', cursor: 'pointer' }} onClick={() => setIsAnnual(true)}>
              Annual <span style={{ background: '#CAFF00', color: '#000', padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 800, marginLeft: 4 }}>−20%</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'start' }} className="reveal-child">

          {/* Starter */}
          <div className="pricing-card">
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', fontFamily: "'JetBrains Mono', monospace", marginBottom: 28 }}>STARTER TRIAL</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 56, fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 8 }}>$0</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 32 }}>14-day free trial</div>
            <div className="sep" style={{ marginBottom: 28 }} />
            {['100 AI Credits', 'Single User Workspace', 'Basic Document Ingestion (10 MB)', 'Standard AI Chat', 'PDF & CSV Export'].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14, fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <span style={{ color: '#CAFF00', fontWeight: 800, flexShrink: 0 }}>✓</span>{f}
              </div>
            ))}
            <Link href="/login" className="btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 28, borderRadius: 14 }}>
              Start free trial
            </Link>
          </div>

          {/* Pro — featured */}
          <div className="pricing-card featured" style={{ transform: 'scale(1.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#000', letterSpacing: '0.12em', fontFamily: "'JetBrains Mono', monospace" }}>PRO MEMBER</div>
              <span style={{ background: '#000', color: '#CAFF00', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999 }}>POPULAR</span>
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 56, fontWeight: 900, color: '#000', lineHeight: 1, marginBottom: 8 }}>${isAnnual ? '7' : '9'}</div>
            <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', marginBottom: 32 }}>per month{isAnnual ? ', billed annually' : ', billed monthly'}</div>
            <div className="sep" style={{ background: 'rgba(0,0,0,0.1)', marginBottom: 28 }} />
            {['1,000 AI Reasoning Credits / mo', '10 Parallel AI Agents', 'Full 3D Corporate Memory Graph', 'Universal PDF & CSV Export', 'Multi-Tenant Org Isolation', 'Team Invites & Roles'].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14, fontSize: 13, color: 'rgba(0,0,0,0.6)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <span style={{ color: '#000', fontWeight: 800, flexShrink: 0 }}>✓</span>{f}
              </div>
            ))}
            <Link href="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#000', color: '#CAFF00', borderRadius: 14, padding: '14px 0', fontWeight: 800, fontSize: 14, textDecoration: 'none', marginTop: 28, width: '100%', transition: 'all 0.2s' }}>
              Get Pro — ${isAnnual ? '7' : '9'}/mo →
            </Link>
          </div>

          {/* Enterprise */}
          <div className="pricing-card">
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', fontFamily: "'JetBrains Mono', monospace", marginBottom: 28 }}>ENTERPRISE MAX</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 56, fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 8 }}>${isAnnual ? '20' : '25'}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 32 }}>per month{isAnnual ? ', billed annually' : ', billed monthly'}</div>
            <div className="sep" style={{ marginBottom: 28 }} />
            {['Unlimited AI Reasoning Credits', '110 Enterprise Decision Models', '8 C-Suite Digital Twins', 'Boardroom Simulation Engine', 'AI Strategy Studio & Roadmap', 'Dedicated Account Manager & 99.9% SLA'].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14, fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <span style={{ color: '#CAFF00', fontWeight: 800, flexShrink: 0 }}>✓</span>{f}
              </div>
            ))}
            <Link href="/login" className="btn-lime" style={{ width: '100%', justifyContent: 'center', marginTop: 28, borderRadius: 14 }}>
              Unlock Enterprise →
            </Link>
          </div>

        </div>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 24, fontFamily: "'JetBrains Mono', monospace" }}>No credit card required · 14-day free trial · Cancel anytime</p>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 40px', background: '#CAFF00', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(40px, 6vw, 90px)', fontWeight: 900, color: '#000', lineHeight: 0.96, letterSpacing: '-0.04em' }}>
              Start building<br />your memory graph.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(0,0,0,0.5)', marginTop: 20, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Join 200+ enterprise teams that rely on Synaps to make faster, grounded decisions.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#000', color: '#CAFF00', padding: '16px 32px', borderRadius: 999, fontWeight: 800, fontSize: 15, textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif" }}>
              Join Now ↓
            </Link>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'transparent', color: '#000', border: '1.5px solid rgba(0,0,0,0.2)', padding: '16px 32px', borderRadius: 999, fontWeight: 600, fontSize: 15, textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif' " }}>
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────────── */}
      <footer style={{ background: '#000', padding: '80px 40px 40px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 40, marginBottom: 80 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 30, height: 30, background: '#CAFF00', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#000' }}>S</div>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>SYNAPS.AI</span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', lineHeight: 1.7, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>The intelligence layer above every enterprise document.</p>
            </div>
            {[
              { h: 'PRODUCT', links: ['Console', 'Agents', 'Boardroom', 'Strategy Studio', 'Pricing'] },
              { h: 'COMPANY', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { h: 'LEGAL', links: ['Privacy Policy', 'Terms of Service', 'Data Processing', 'Security', 'Cookie Policy'] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em', fontFamily: "'JetBrains Mono', monospace", marginBottom: 18 }}>{col.h}</div>
                {col.links.map((l, li) => (
                  <div key={li} style={{ marginBottom: 10 }}>
                    <a href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                    >{l}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace", flexWrap: 'wrap', gap: 16 }}>
            <div>© 2026 SYNAPS Technologies Inc. All rights reserved.</div>
            <div>Registered Data Fiduciary · ISO/IEC 27001 · SOC 2 Aligned</div>
          </div>
        </div>
      </footer>

      {/* SPOTLIGHT SEARCH */}
      {searchOpen && (
        <div onClick={() => setSearchOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '18vh 20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#111', borderRadius: 20, padding: 24, width: '100%', maxWidth: 600, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search modules, agents, digital twins..."
                autoFocus
                style={{ flex: 1, padding: '13px 16px', background: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 15, outline: 'none', fontFamily: "'Space Grotesk', sans-serif" }}
              />
              <button onClick={() => setSearchOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: 42, height: 42, borderRadius: 12, cursor: 'pointer', fontSize: 15, flexShrink: 0 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredSuites.map(s => (
                <div key={s.id} style={{ padding: '14px 16px', background: '#000', borderRadius: 12, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>{s.tag}</div>
                  </div>
                  <span style={{ background: 'rgba(202,255,0,0.1)', color: '#CAFF00', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap', marginLeft: 12, fontFamily: "'JetBrains Mono', monospace" }}>#{s.id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WAITLIST MODAL */}
      <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />

    </div>
  );
}
