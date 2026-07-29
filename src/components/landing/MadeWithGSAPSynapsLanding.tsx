'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Real SYNAPS Showcase Modules ───────────────────────────────── */
const SLIDES = [
  {
    id: 1,
    src: '/showcase/executive_overview.png',
    label: 'Executive Operational Briefings',
    tag: 'AI COO Engine',
    desc: 'Provides automated daily C-suite briefings, cross-departmental KPI tracking, and real-time operational risk scoring from ingested enterprise files.',
    specs: ['Automated PDF/Doc Briefing Generation', 'Real-Time Risk & Opportunity Matrix', 'Cross-Department Alignment Scoring', 'Strict Zero-Hallucination Grounding']
  },
  {
    id: 2,
    src: '/showcase/mission_control.png',
    label: 'Multi-Agent Flight Control',
    tag: 'Agent Swarm',
    desc: 'Air traffic control for specialized AI agents — Research, Finance, Legal, Security, HR, and Strategy — executing concurrent enterprise tasks.',
    specs: ['10 Specialized Agent Personas', 'Parallel Task Execution Pipeline', 'Inter-Agent Conflict Resolution', 'Full Audit Log & Provenance Tracing']
  },
  {
    id: 3,
    src: '/showcase/digital_twins.png',
    label: 'Executive Digital Twins',
    tag: 'Boardroom Sim',
    desc: 'Simulate high-stakes enterprise decisions across 8 C-suite persona twins (CEO, CFO, CTO, Legal, HR, etc.) with grounded debate synthesis.',
    specs: ['8 Persona Decision Simulation', 'Stress-testing Strategic Options', 'Consensus & Divergence Heatmaps', 'Instant Debate Record Generation']
  },
  {
    id: 4,
    src: '/showcase/ai_strategy.png',
    label: 'AI Strategy & Blueprint Studio',
    tag: 'Roadmap Generator',
    desc: 'Generates 11-stage enterprise technology blueprints, competitive SWOT matrices, risk mitigations, and execution roadmaps.',
    specs: ['11-Stage Transformation Roadmap', 'Automated Competitive Threat Scanning', 'Resource & Budget Allocation Plan', 'Risk Mitigation Playbook']
  },
  {
    id: 5,
    src: '/showcase/decision_memory.png',
    label: 'Decision Memory & Graph Engine',
    tag: 'Precedent Memory',
    desc: 'Persists every past corporate decision, underlying assumptions, and outcomes. Search historical precedent graph with cosine similarity.',
    specs: ['Vector Graph Precedent Index', 'Assumption vs Outcome Validation', 'Semantic Decision Search', 'Institutional Knowledge Continuity']
  },
];

/* ─── Real Value Pillars ─────────────────────────────────────────── */
const VALUE_PILLARS = [
  {
    title: 'Grounded Intelligence',
    desc: 'Every insight, recommendation, and briefing is strictly anchored in your enterprise knowledge base with source verification.',
  },
  {
    title: 'Multi-Agent Autonomy',
    desc: '10 specialized agent roles operate in parallel to conduct thorough analysis across finance, compliance, technology, and operations.',
  },
  {
    title: 'Boardroom Simulation',
    desc: 'Test critical strategic moves against digital twin executive personas before taking them to the board.',
  },
  {
    title: 'Precedent Memory',
    desc: 'Never repeat past mistakes. SYNAPS indexes historical decisions, trade-offs, and lessons learned across your organization.',
  },
];

/* ─── Real SYNAPS Pricing Tiers ─────────────────────────────────── */
const PRICING_TIERS = [
  {
    id: 'starter',
    name: 'Starter Tier',
    badge: 'Free Tier',
    priceMonthly: '$0',
    priceYearly: '$0',
    period: '/ month',
    desc: 'Ideal for testing AI document search and baseline queries across your workspace.',
    popular: false,
    features: [
      '50 AI Credits / Day',
      '1 Organization Workspace',
      'AI Chat Assistant & RAG Search',
      'Basic Operational Risk Scanner',
      'Standard Support'
    ],
    cta: 'Get Started Free →',
    ctaLink: '/register'
  },
  {
    id: 'pro',
    name: 'Pro Intelligence',
    badge: 'Popular • 50% OFF',
    priceMonthly: '$7',
    priceYearly: '$5',
    period: '/ month',
    desc: 'Full multi-agent suite & 10-Agent AI Boardroom for growing executive teams.',
    popular: true,
    features: [
      '500 AI Credits / Day',
      'Collaborative 10-Agent AI Boardroom',
      'AI Strategy Studio & SWOT Blueprint',
      'Digital Twin OS (15 System Nodes)',
      '3D Corporate Memory Graph Engine',
      '14-Day 100% Refund Guarantee'
    ],
    cta: 'Upgrade to Pro ($7) →',
    ctaLink: '/register?plan=pro'
  },
  {
    id: 'enterprise',
    name: 'Enterprise Max',
    badge: 'Max Limit ($20 Cap)',
    priceMonthly: '$20',
    priceYearly: '$16',
    period: '/ month',
    desc: 'Unlimited AI capabilities for power users, executive boards & large enterprises.',
    popular: false,
    features: [
      '10,000 AI Credits / Day (Unlimited)',
      'Custom Fine-Tuned AI Models',
      'Unlimited Workspaces & Multi-Tenancy',
      'Permanent Audit Log Retention',
      'Dedicated 24/7 Success Manager',
      'Cancel & Refund Anytime Guarantee'
    ],
    cta: 'Get Enterprise Max ($20) →',
    ctaLink: '/register?plan=enterprise'
  }
];

/* ─── Full Legal & Governance Documents List ─────────────────────── */
const LEGAL_DOCS_LIST = [
  { slug: 'privacy', title: 'Privacy Policy', category: 'Privacy & Security', desc: 'GDPR, CCPA & Indian DPDP Act 2023 compliance.' },
  { slug: 'terms', title: 'Terms & Conditions', category: 'Legal', desc: 'SaaS licensing, multi-tenant isolation, and jurisdiction.' },
  { slug: 'acceptable-use', title: 'Acceptable Use Policy', category: 'Governance & AI', desc: 'Prohibited abuse & AI conduct standards.' },
  { slug: 'cookies', title: 'Cookie Policy', category: 'Privacy & Security', desc: 'Essential session cookies & zero ad-tracking.' },
  { slug: 'security', title: 'Security Policy', category: 'Privacy & Security', desc: 'AES-256, TLS 1.3, SOC2 readiness & RBAC.' },
  { slug: 'data-processing', title: 'Data Processing Notice', category: 'Governance & AI', desc: 'DPA terms & authorized sub-processors.' },
  { slug: 'ai-policy', title: 'AI Responsible Usage', category: 'Governance & AI', desc: 'Zero-hallucination safeguards & grounding.' },
  { slug: 'disclaimer', title: 'Legal Disclaimer', category: 'Legal', desc: 'AI analytical output & decision support terms.' },
  { slug: 'copyright', title: 'Copyright & DMCA', category: 'Legal', desc: 'Proprietary IP protection & takedown procedures.' },
  { slug: 'ip-infringement', title: 'IP Infringement Policy', category: 'Legal', desc: 'Trademark, patent & trade secret claim process.' },
  { slug: 'contact', title: 'Contact Directory', category: 'Support', desc: 'Global corporate email & office headquarters.' },
  { slug: 'support', title: 'Support & SLA Policy', category: 'Support', desc: '24/7 incident SLA response guarantees.' },
  { slug: 'security-vulnerability', title: 'Vulnerability Program', category: 'Support', desc: 'Responsible disclosure & safe harbor.' },
];

/* ─── Preloader Screen with Percentage Counter & Text Loader ──────── */
function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('INITIALIZING SYNAPS CORE...');
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const texts = [
      'INITIALIZING SYNAPS CORE...',
      'LOADING GRAPH PRECEDENTS...',
      'INDEXING C-SUITE DIGITAL TWINS...',
      'GROUNDING ZERO-HALLUCINATION SUITE...',
      'SYNAPS ENGINE READY'
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 12) + 6;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setLoadingText(texts[4]);
        setProgress(100);

        // GSAP Slide-up curtain reveal timeline
        setTimeout(() => {
          if (overlayRef.current) {
            gsap.to(overlayRef.current, {
              yPercent: -100,
              duration: 1.1,
              ease: 'power4.inOut',
              onComplete: () => {
                onComplete();
              }
            });
          }
        }, 300);
      } else {
        setProgress(currentProgress);
        const idx = Math.floor((currentProgress / 100) * 4);
        setLoadingText(texts[idx]);
      }
    }, 90);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: '#111111',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px 40px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: '#00ff88', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#111', fontSize: 14, fontWeight: 900 }}>S</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>SYNAPS AI OS</span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#00ff88', letterSpacing: '0.08em' }}>[ MADE WITH GSAP ENGINE ]</span>
      </div>

      <div style={{ maxWidth: 800 }}>
        <p style={{ fontSize: 12, fontWeight: 800, color: '#888', letterSpacing: '0.1em', marginBottom: 12 }}>
          {loadingText}
        </p>
        <div style={{ width: '100%', height: 4, background: '#222', borderRadius: 2, overflow: 'hidden', marginBottom: 24 }}>
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #00ff88, #ffffff)',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h1 style={{ fontSize: 'clamp(64px, 12vw, 160px)', fontWeight: 900, lineHeight: 0.8, letterSpacing: '-0.05em', color: '#ffffff' }}>
          {progress}%
        </h1>
        <p style={{ fontSize: 12, color: '#666', maxWidth: 300, textAlign: 'right', lineHeight: 1.5 }}>
          Enterprise Decision Intelligence Platform • Powered by Grounded Graph Memory
        </p>
      </div>
    </div>
  );
}

/* ─── Circular Rotating Text Badge Component ─────────────────────── */
function RotatingCircleBadge({ text = "MADE WITH SYNAPS • DECISION INTELLIGENCE • ", size = 130 }: { text?: string; size?: number }) {
  const circleRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (circleRef.current) {
      gsap.to(circleRef.current, {
        rotation: 360,
        repeat: -1,
        duration: 14,
        ease: 'none',
      });
    }
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        ref={circleRef}
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
      >
        <path
          id="textPath"
          d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          fill="none"
        />
        <text style={{ fontSize: 9.2, fontWeight: 800, fill: '#111111', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          <textPath href="#textPath" startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>
      {/* Center Icon */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: '#111111',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
      </div>
    </div>
  );
}

/* ─── Cookie Banner Component ─────────────────────────────────────── */
function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const c = localStorage.getItem('synaps_cookie');
    if (!c) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem('synaps_cookie', 'accepted');
    setShow(false);
  };
  const decline = () => {
    localStorage.setItem('synaps_cookie', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: '#ffffff',
        border: '1px solid #111111',
        borderRadius: 16,
        padding: '20px 28px',
        boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
        maxWidth: 500,
        width: 'calc(100% - 40px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div>
        <p style={{ fontSize: 13, fontWeight: 800, color: '#111', marginBottom: 6 }}>
          🍪 Cookie &amp; Session Preferences
        </p>
        <p style={{ fontSize: 12, color: '#555', lineHeight: 1.6 }}>
          SYNAPS uses essential local session storage to maintain your operational workspace security and interface state. Zero ad tracking.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={accept}
          style={{
            flex: 1,
            padding: '10px 20px',
            background: '#111',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Accept All
        </button>
        <button
          onClick={decline}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            color: '#111',
            border: '1px solid #ccc',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}

/* ─── Interactive Roll-Text Link Component ──────────────────────── */
function RollLink({ href, children, className = '', style = {} }: { href: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <a href={href} className={`roll-wrapper ${className}`} style={style}>
      <span className="roll-inner">
        <span className="roll-text">{children}</span>
        <span className="roll-text roll-hover">{children}</span>
      </span>
    </a>
  );
}

/* ─── Draggable High-Res Showcase Carousel ───────────────────────── */
function ShowcaseCarousel({ onSelectModule }: { onSelectModule: (index: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const n = SLIDES.length;

  const startAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % n);
    }, 4000);
  }, [n]);

  useEffect(() => {
    startAutoplay();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startAutoplay]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStartX(e.clientX);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffsetX(e.clientX - startX);
  };

  const handleMouseUp = () => {
    if (Math.abs(offsetX) > 60) {
      if (offsetX < 0) setCurrent(prev => (prev + 1) % n);
      else setCurrent(prev => (prev - 1 + n) % n);
    }
    setDragging(false);
    setOffsetX(0);
    startAutoplay();
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', userSelect: 'none' }}>
      <div
        style={{
          display: 'flex',
          transition: dragging ? 'none' : 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: `translateX(calc(-${current * 100}% + ${offsetX}px))`,
          cursor: dragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            onClick={() => !dragging && onSelectModule(i)}
            style={{
              minWidth: '100%',
              position: 'relative',
              aspectRatio: '16/9',
              background: '#e9e9e9',
              borderRadius: 20,
              overflow: 'hidden',
              border: '1px solid #d0d0d0',
              boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
            }}
          >
            <Image
              src={slide.src}
              alt={slide.label}
              fill
              unoptimized
              priority={i === 0}
              style={{
                objectFit: 'cover',
                objectPosition: 'top',
                imageRendering: 'crisp-edges',
              }}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 20,
          padding: '0 4px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 900, fontFamily: 'monospace', color: '#111' }}>
            #{String(current + 1).padStart(3, '0')}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#666', letterSpacing: '0.05em' }}>
            {SLIDES[current].tag}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: i === current ? '#111' : '#ccc',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                padding: 0,
              }}
            />
          ))}
        </div>

        <span style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>
          {SLIDES[current].label}
        </span>
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#aaa', marginTop: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        ← DRAG OR CLICK TO EXPLORE MODULES →
      </p>
    </div>
  );
}

/* ─── Main Landing Component ─────────────────────────────────────── */
export default function MadeWithSynapsLanding() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadingComplete) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      // Hero staggered line reveal
      gsap.fromTo(
        '.gsap-hero-title span',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.2,
        }
      );

      gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, mainRef);

    return () => {
      lenis.destroy();
      ctx.revert();
    };
  }, [loadingComplete]);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <div ref={mainRef} style={{ background: '#f1f1f1', color: '#111', fontFamily: "'Inter', sans-serif" }}>

      {/* ── PRELOADER COUNTER SCREEN ─────────────────────────────── */}
      <Preloader onComplete={() => setLoadingComplete(true)} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #f1f1f1; color: #111; overflow-x: hidden; }

        .wrapper { max-width: 1200px; margin: 0 auto; padding: 0 40px; }

        .roll-wrapper {
          display: inline-block;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          vertical-align: middle;
        }
        .roll-inner {
          display: flex;
          flex-direction: column;
          transition: transform 0.35s cubic-bezier(0.76, 0, 0.24, 1);
        }
        .roll-wrapper:hover .roll-inner {
          transform: translateY(-50%);
        }
        .roll-text {
          display: block;
          white-space: nowrap;
        }

        .diode::before {
          content: '';
          display: inline-block;
          width: 7px; height: 7px;
          background: #111;
          border-radius: 50%;
          margin-right: 8px;
          vertical-align: middle;
          animation: diodePulse 2s infinite ease-in-out;
        }
        .sec-black .diode::before { background: #00ff88; box-shadow: 0 0 10px #00ff88; }
        @keyframes diodePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        .title-xl { font-size: clamp(56px, 8vw, 120px); font-weight: 900; line-height: 0.9; letter-spacing: -0.04em; }
        .title-l  { font-size: clamp(40px, 6vw, 84px);  font-weight: 900; line-height: 0.95; letter-spacing: -0.03em; }
        .title-m  { font-size: clamp(28px, 4vw, 50px);  font-weight: 900; line-height: 1.05; letter-spacing: -0.02em; }
        .title-s  { font-size: clamp(22px, 3vw, 36px);  font-weight: 800; line-height: 1.1;  letter-spacing: -0.02em; }
        .title-xs { font-size: clamp(16px, 2vw, 24px);  font-weight: 700; line-height: 1.25; }
        .body-s   { font-size: 14px; line-height: 1.65; color: #444; }
        .body-xs  { font-size: 12px; line-height: 1.6;  color: #777; }
        .label    { font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }

        .text-g { color: #888; }

        .cta-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 26px; background: #111; color: #fff;
          border-radius: 100px; font-size: 13px; font-weight: 700;
          border: none; cursor: pointer; text-decoration: none;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .cta-btn:hover { transform: translateY(-2px); opacity: 0.9; }

        .cta-btn-outline {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 26px; background: transparent; color: #111;
          border-radius: 100px; font-size: 13px; font-weight: 700;
          border: 1.5px solid #111; cursor: pointer; text-decoration: none;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .cta-btn-outline:hover { background: #111; color: #fff; }

        .pillars-scroll {
          display: flex; gap: 20px; overflow-x: auto; padding-bottom: 20px;
          scrollbar-width: none;
        }
        .pillars-scroll::-webkit-scrollbar { display: none; }
        .pillar-card {
          min-width: 280px; max-width: 280px;
          background: #ffffff; border-radius: 20px;
          padding: 32px; border: 1px solid #e0e0e0;
          display: flex; flex-direction: column; justify-content: space-between;
          flex-shrink: 0; box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }

        .crisp-img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }

        @media (max-width: 768px) {
          .wrapper { padding: 0 20px; }
          .hide-mob { display: none !important; }
        }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(241,241,241,0.92)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #e0e0e0',
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 40px',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: '#111', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 900 }}>S</span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 900, color: '#111', letterSpacing: '-0.02em' }}>
            Made With Synaps
          </span>
        </Link>

        <nav className="hide-mob" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <RollLink href="#modules" style={{ fontSize: 13, fontWeight: 600 }}>
            Modules <span style={{ background: '#e0e0e0', borderRadius: 10, padding: '2px 8px', fontSize: 10, marginLeft: 4 }}>5</span>
          </RollLink>
          <RollLink href="#pillars" style={{ fontSize: 13, fontWeight: 600 }}>Architecture</RollLink>
          <RollLink href="#pricing" style={{ fontSize: 13, fontWeight: 600 }}>Pricing</RollLink>
          <RollLink href="#legal" style={{ fontSize: 13, fontWeight: 600 }}>Legal &amp; Governance</RollLink>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/register" className="cta-btn" style={{ padding: '8px 18px', fontSize: 12 }}>
            Join SYNAPS →
          </Link>
          <Link href="/login" style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid #ccc', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </Link>
        </div>
      </header>

      <main style={{ paddingTop: 64 }}>

        {/* ── HERO WITH ROTATING CIRCLE BADGE ────────────────────────── */}
        <section style={{ padding: '80px 0 60px' }}>
          <div className="wrapper">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 44, flexWrap: 'wrap', gap: 24 }}>
              <div>
                <h1 className="title-l gsap-hero-title" style={{ maxWidth: 740 }}>
                  <span style={{ display: 'block' }}>Grounded enterprise</span>
                  <span style={{ display: 'block' }} className="text-g">AI modules</span>
                  <span style={{ display: 'block' }}>built for high performance.</span>
                </h1>
                <p className="body-s" style={{ marginTop: 24, maxWidth: 460, fontSize: 15 }}>
                  Accelerate enterprise executive decisions with an ever-growing suite of
                  zero-hallucination AI intelligence tools.
                </p>
                <div style={{ display: 'flex', gap: 14, marginTop: 32, flexWrap: 'wrap' }}>
                  <a href="#modules" className="cta-btn">
                    Explore modules ↓
                  </a>
                  <a href="#pricing" className="cta-btn-outline">
                    View plans &amp; pricing
                  </a>
                </div>
              </div>

              {/* ── ROTATING CIRCULAR TEXT BADGE ─────────────────────── */}
              <div className="hide-mob" style={{ paddingTop: 10 }}>
                <RotatingCircleBadge text="SYNAPS DECISION INTELLIGENCE • GSAP DRIVEN • " size={140} />
              </div>
            </div>

            <div className="gsap-reveal">
              <ShowcaseCarousel onSelectModule={(idx) => setSelectedModule(idx)} />
            </div>
          </div>
        </section>

        {/* ── WHAT IT'S ALL ABOUT (DARK SECTION) ────────────────────── */}
        <section className="sec-black" style={{ padding: '100px 0', background: '#111111', color: '#ffffff' }}>
          <div className="wrapper gsap-reveal">
            <p className="label diode" style={{ marginBottom: 28, color: '#ffffff' }}>
              What it&apos;s all about
            </p>
            <p className="title-s" style={{ maxWidth: 800, color: '#ffffff' }}>
              An enterprise AI operating system that empowers your team to master{' '}
              <span style={{ color: '#888' }}>decision intelligence</span> and deploy it{' '}
              <span style={{ color: '#888' }}>instantly</span> across operations.
            </p>
            <p className="body-s" style={{ marginTop: 28, maxWidth: 580, color: '#aaa', fontSize: 15 }}>
              Precision in decision-making is vital. Daily operational briefings, multi-agent task execution,
              C-suite digital twins, and institutional precedent memory — all integrated in one platform.
            </p>

            <div style={{ marginTop: 60, borderRadius: 20, overflow: 'hidden', border: '1px solid #333', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
              <Image
                src="/showcase/executive_overview.png"
                alt="SYNAPS Platform Overview"
                width={1200}
                height={675}
                unoptimized
                className="crisp-img"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </section>

        {/* ── SCROLLING PILLARS ────────────────────────────────────── */}
        <section id="pillars" style={{ padding: '100px 0', borderBottom: '1px solid #e0e0e0' }}>
          <div className="wrapper gsap-reveal" style={{ marginBottom: 40 }}>
            <p className="label diode" style={{ marginBottom: 16 }}>Built for enterprise scale</p>
            <h2 className="title-m">Architecture &amp; Core Principles</h2>
          </div>

          <div className="wrapper">
            <div className="pillars-scroll">
              {VALUE_PILLARS.map((p, i) => (
                <div key={i} className="pillar-card gsap-reveal">
                  <div>
                    <span style={{ fontSize: 36, fontWeight: 900, color: '#ccc', display: 'block', marginBottom: 20 }}>
                      0{i + 1}
                    </span>
                    <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>{p.title}</h3>
                    <p className="body-s" style={{ fontSize: 13 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MODULE CARDS LISTING ─────────────────────────────────── */}
        <section id="modules" style={{ padding: '100px 0', borderBottom: '1px solid #e0e0e0' }}>
          <div className="wrapper">
            <div className="gsap-reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 20 }}>
              <div>
                <p className="label diode" style={{ marginBottom: 16 }}>Explore the suite</p>
                <h2 className="title-s">
                  5 Core Modules <span className="text-g">ready to deploy</span>
                </h2>
              </div>
              <Link href="/register" className="cta-btn">Start Workspace →</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {SLIDES.map((slide, i) => (
                <div
                  key={slide.id}
                  className="gsap-reveal"
                  style={{
                    background: '#ffffff', borderRadius: 20, overflow: 'hidden',
                    border: '1px solid #e0e0e0', boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 0 }}>
                    <div style={{ position: 'relative', minHeight: 320, background: '#f5f5f5' }}>
                      <Image
                        src={slide.src}
                        alt={slide.label}
                        fill
                        unoptimized
                        className="crisp-img"
                        style={{ objectFit: 'cover', objectPosition: 'top' }}
                      />
                    </div>

                    <div style={{ padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#888', letterSpacing: '0.06em' }}>
                          {slide.tag}
                        </span>
                        <h3 className="title-xs" style={{ margin: '8px 0 16px' }}>{slide.label}</h3>
                        <p className="body-s" style={{ marginBottom: 20 }}>{slide.desc}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {slide.specs.map((spec, sIdx) => (
                            <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#111' }} />
                              <span style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>{spec}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginTop: 28 }}>
                        <button
                          onClick={() => setSelectedModule(i)}
                          className="cta-btn-outline"
                          style={{ padding: '8px 18px', fontSize: 12 }}
                        >
                          View module specs →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING SECTION (AUTHENTIC SYNAPS TIERS) ─────────────── */}
        <section id="pricing" className="sec-black" style={{ padding: '100px 0', background: '#111111', color: '#ffffff' }}>
          <div className="wrapper gsap-reveal" style={{ textAlign: 'center' }}>
            <p className="label diode" style={{ marginBottom: 20, color: '#ffffff', justifyContent: 'center', display: 'flex' }}>
              Level up your decision capability
            </p>
            <h2 className="title-l" style={{ marginBottom: 16, color: '#ffffff' }}>
              Simple, transparent<br />
              <span className="text-g">workspace pricing</span>
            </h2>
            <p className="body-s" style={{ color: '#aaa', maxWidth: 520, margin: '0 auto 40px' }}>
              Instant access to all 5 SYNAPS AI modules with full grounded zero-hallucination execution. 14-day 100% refund guarantee.
            </p>

            {/* Billing Period Toggle */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#222', padding: 6, borderRadius: 100, marginBottom: 56 }}>
              <button
                onClick={() => setBillingPeriod('monthly')}
                style={{
                  padding: '8px 24px', borderRadius: 100, border: 'none', fontSize: 12, fontWeight: 700,
                  background: billingPeriod === 'monthly' ? '#fff' : 'transparent',
                  color: billingPeriod === 'monthly' ? '#111' : '#aaa',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                style={{
                  padding: '8px 24px', borderRadius: 100, border: 'none', fontSize: 12, fontWeight: 700,
                  background: billingPeriod === 'annual' ? '#fff' : 'transparent',
                  color: billingPeriod === 'annual' ? '#111' : '#aaa',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >
                Annual Billing <span style={{ color: '#00ff88', fontSize: 10, marginLeft: 4 }}>Save Up To 30%</span>
              </button>
            </div>

            {/* 3 Pricing Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, textAlign: 'left' }}>
              {PRICING_TIERS.map((tier) => {
                const price = billingPeriod === 'annual' ? tier.priceYearly : tier.priceMonthly;
                return (
                  <div
                    key={tier.id}
                    style={{
                      background: tier.popular ? '#ffffff' : '#1a1a1a',
                      color: tier.popular ? '#111111' : '#ffffff',
                      borderRadius: 24,
                      padding: 40,
                      border: tier.popular ? '2px solid #ffffff' : '1px solid #333333',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      boxShadow: tier.popular ? '0 20px 60px rgba(255,255,255,0.1)' : 'none',
                    }}
                  >
                    {tier.popular && (
                      <div
                        style={{
                          position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                          background: '#00ff88', color: '#111', fontSize: 10, fontWeight: 900,
                          padding: '4px 16px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}
                      >
                        {tier.badge}
                      </div>
                    )}

                    <div>
                      <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: tier.popular ? '#666' : '#888', letterSpacing: '0.05em' }}>
                        {tier.name}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '16px 0 12px' }}>
                        <span className="title-l" style={{ color: tier.popular ? '#111' : '#fff', lineHeight: 1 }}>{price}</span>
                        <span style={{ fontSize: 13, color: tier.popular ? '#666' : '#aaa', fontWeight: 600 }}>{tier.period}</span>
                      </div>
                      <p style={{ fontSize: 13, color: tier.popular ? '#444' : '#aaa', lineHeight: 1.5, marginBottom: 28 }}>
                        {tier.desc}
                      </p>

                      <div style={{ borderTop: `1px solid ${tier.popular ? '#eee' : '#333'}`, paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {tier.features.map((feat, fIdx) => (
                          <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ width: 16, height: 16, borderRadius: '50%', background: tier.popular ? '#111' : '#00ff88', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={tier.popular ? '#fff' : '#111'} strokeWidth="3.5"><path d="M20 6L9 17l-5-5" /></svg>
                            </span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: tier.popular ? '#222' : '#ddd' }}>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginTop: 36 }}>
                      <Link
                        href={tier.ctaLink}
                        className={tier.popular ? 'cta-btn' : 'cta-btn-outline'}
                        style={{
                          width: '100%', justifyContent: 'center', padding: '14px 0',
                          borderColor: tier.popular ? 'transparent' : '#fff', color: tier.popular ? '#fff' : '#fff',
                        }}
                      >
                        {tier.cta}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── LEGAL, GOVERNANCE & COMPLIANCE SECTION ─────────────── */}
        <section id="legal" style={{ padding: '100px 0', borderBottom: '1px solid #e0e0e0', background: '#ffffff' }}>
          <div className="wrapper">
            <div className="gsap-reveal" style={{ marginBottom: 48 }}>
              <p className="label diode" style={{ marginBottom: 12 }}>Enterprise Governance</p>
              <h2 className="title-m" style={{ marginBottom: 16 }}>Legal, Security &amp; Compliance Directory</h2>
              <p className="body-s" style={{ maxWidth: 640 }}>
                SYNAPS adheres to international privacy and compliance frameworks including GDPR, CCPA, Indian DPDP Act 2023, and SOC2 security standards. Review our complete governance documentation below.
              </p>
            </div>

            {/* Legal Docs Cards Grid */}
            <div className="gsap-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {LEGAL_DOCS_LIST.map((doc) => (
                <Link
                  key={doc.slug}
                  href={`/legal/${doc.slug}`}
                  style={{
                    display: 'block', textDecoration: 'none', color: 'inherit',
                    padding: 28, borderRadius: 16, border: '1px solid #e0e0e0',
                    background: '#f9f9f9', transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#111';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.background = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.background = '#f9f9f9';
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#888', letterSpacing: '0.05em' }}>
                    {doc.category}
                  </span>
                  <h3 style={{ fontSize: 16, fontWeight: 800, margin: '8px 0 6px', color: '#111' }}>
                    {doc.title} →
                  </h3>
                  <p style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>
                    {doc.desc}
                  </p>
                </Link>
              ))}
            </div>

            {/* Note & DPO Contact */}
            <div className="gsap-reveal" style={{ marginTop: 48, padding: 32, borderRadius: 20, background: '#111', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>Need Custom Enterprise DPA or Security Questionnaire?</h4>
                <p style={{ fontSize: 13, color: '#aaa' }}>Our Data Protection Officer and Legal team respond within 24 hours.</p>
              </div>
              <a href="mailto:novaecosystems@gmail.com" className="cta-btn" style={{ background: '#fff', color: '#111', padding: '12px 24px', fontSize: 12 }}>
                Email Legal Team →
              </a>
            </div>
          </div>
        </section>

        {/* ── SHOWCASE GRID ─────────────────────────────────────────── */}
        <section id="showcase" style={{ padding: '100px 0', borderBottom: '1px solid #e0e0e0' }}>
          <div className="wrapper gsap-reveal" style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <p className="label diode" style={{ marginBottom: 12 }}>High-Resolution Showcase</p>
              <h2 className="title-m">Visualizing SYNAPS Capabilities</h2>
            </div>
            <Link href="/register" className="cta-btn">Enter Workspace →</Link>
          </div>

          <div className="wrapper gsap-reveal">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
              {SLIDES.map((slide, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedModule(idx)}
                  style={{
                    borderRadius: 16, overflow: 'hidden', border: '1px solid #e0e0e0',
                    background: '#fff', cursor: 'pointer', transition: 'transform 0.3s ease',
                  }}
                >
                  <div style={{ position: 'relative', aspectRatio: '16/10' }}>
                    <Image
                      src={slide.src}
                      alt={slide.label}
                      fill
                      unoptimized
                      className="crisp-img"
                      style={{ objectFit: 'cover', objectPosition: 'top' }}
                    />
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{slide.tag}</span>
                    <h4 style={{ fontSize: 15, fontWeight: 800, marginTop: 4 }}>{slide.label}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────── */}
        <footer style={{ padding: '80px 0 40px', background: '#f1f1f1' }}>
          <div className="wrapper">
            <div className="gsap-reveal" style={{ marginBottom: 80 }}>
              <p className="label" style={{ marginBottom: 16 }}>Ready to transform enterprise decisions?</p>
              <p className="title-xl" style={{ lineHeight: 0.95, marginBottom: 36 }}>
                Get ready<br />
                <span className="text-g">to decide.</span>
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/register" className="cta-btn">
                  Join SYNAPS →
                </Link>
                <a href="#modules" className="cta-btn-outline">
                  Explore modules
                </a>
              </div>
            </div>

            <div
              style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
                gap: 40, borderTop: '1px solid #e0e0e0', paddingTop: 48,
              }}
            >
              <div>
                <h3 className="title-xs" style={{ marginBottom: 16 }}>Stay updated</h3>
                {subscribed ? (
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>✓ Subscribed to SYNAPS updates.</p>
                ) : (
                  <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      style={{
                        flex: 1, padding: '10px 14px', borderRadius: 8,
                        border: '1.5px solid #ccc', fontSize: 13, outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                    <button type="submit" className="cta-btn" style={{ padding: '10px 16px', fontSize: 12 }}>→</button>
                  </form>
                )}
                <p className="body-xs">Product updates &amp; release notes for enterprise decision intelligence.</p>
              </div>

              <div>
                <h4 style={{ fontSize: 13, fontWeight: 800, marginBottom: 16 }}>Product</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <RollLink href="#modules" style={{ fontSize: 12 }}>Modules</RollLink>
                  <RollLink href="#pillars" style={{ fontSize: 12 }}>Architecture</RollLink>
                  <RollLink href="#pricing" style={{ fontSize: 12 }}>Pricing</RollLink>
                  <RollLink href="#showcase" style={{ fontSize: 12 }}>Showcase</RollLink>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: 13, fontWeight: 800, marginBottom: 16 }}>Support</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <RollLink href="/legal/contact" style={{ fontSize: 12 }}>Contact Us</RollLink>
                  <RollLink href="/legal/support" style={{ fontSize: 12 }}>Support Policy &amp; SLA</RollLink>
                  <RollLink href="/legal/security-vulnerability" style={{ fontSize: 12 }}>Security Vulnerability</RollLink>
                  <RollLink href="/login" style={{ fontSize: 12 }}>Sign In</RollLink>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: 13, fontWeight: 800, marginBottom: 16 }}>Legal &amp; Compliance</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <RollLink href="/legal/privacy" style={{ fontSize: 12 }}>Privacy Policy (GDPR / CCPA)</RollLink>
                  <RollLink href="/legal/terms" style={{ fontSize: 12 }}>Terms &amp; Conditions</RollLink>
                  <RollLink href="/legal/acceptable-use" style={{ fontSize: 12 }}>Acceptable Use Policy</RollLink>
                  <RollLink href="/legal/cookies" style={{ fontSize: 12 }}>Cookie Policy</RollLink>
                  <RollLink href="/legal/security" style={{ fontSize: 12 }}>Security Policy</RollLink>
                  <RollLink href="/legal/data-processing" style={{ fontSize: 12 }}>Data Processing Notice (DPA)</RollLink>
                  <RollLink href="/legal/ai-policy" style={{ fontSize: 12 }}>AI Responsible Usage</RollLink>
                  <RollLink href="/legal/ip-infringement" style={{ fontSize: 12 }}>IP Infringement Policy</RollLink>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e0e0e0', marginTop: 48, paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#888' }}>© 2026 Made With Synaps. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>

      {/* ── MODULE DETAILS MODAL ────────────────────────────────────── */}
      {selectedModule !== null && (
        <div
          onClick={() => setSelectedModule(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#ffffff', borderRadius: 24, maxWidth: 800, width: '100%',
              maxHeight: '90vh', overflowY: 'auto', padding: 40, position: 'relative',
              boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
            }}
          >
            <button
              onClick={() => setSelectedModule(null)}
              style={{
                position: 'absolute', top: 24, right: 24, background: 'none', border: 'none',
                fontSize: 24, cursor: 'pointer', color: '#111', fontWeight: 700,
              }}
            >
              ✕
            </button>

            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#888' }}>
              {SLIDES[selectedModule].tag}
            </span>
            <h2 className="title-m" style={{ margin: '8px 0 16px' }}>{SLIDES[selectedModule].label}</h2>

            <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden', margin: '24px 0', border: '1px solid #e0e0e0' }}>
              <Image
                src={SLIDES[selectedModule].src}
                alt={SLIDES[selectedModule].label}
                fill
                unoptimized
                className="crisp-img"
                style={{ objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>

            <p className="body-s" style={{ fontSize: 15, marginBottom: 24 }}>{SLIDES[selectedModule].desc}</p>

            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>Key Capabilities &amp; Specifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {SLIDES[selectedModule].specs.map((spec, sIdx) => (
                <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#111' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{spec}</span>
                </div>
              ))}
            </div>

            <Link
              href="/register"
              className="cta-btn"
              style={{ width: '100%', justifyContent: 'center', padding: '14px 0' }}
            >
              Launch Workspace with this Module →
            </Link>
          </div>
        </div>
      )}

      {/* ── COOKIE BANNER ─────────────────────────────────────────── */}
      <CookieBanner />
    </div>
  );
}
