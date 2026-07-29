'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SUITES = [
  {
    id: 1,
    src: '/assets/synaps_executive_briefing.png',
    label: 'AI COO Command Console & Briefing',
    tag: 'COMMAND CONSOLE',
    desc: 'Evaluates compliance gaps, FSSAI licenses, tender agreements, and operational risk metrics across your knowledge graph.',
    specs: ['Org Health Score (60/100) & Coverage (40%)', 'Decision Confidence Meter (20% to 100%)', 'Zero-Retention Grounded Memory SLA', '24/7 Real-Time Anomaly Audit']
  },
  {
    id: 2,
    src: '/assets/synaps_multiagent_flight_control.png',
    label: 'Multi-Agent Flight Control System',
    tag: 'FLIGHT CONTROL',
    desc: 'Orchestrates 10 specialized AI agents (Research, Finance, Legal, Engineering, Ops, Infosec, HR) in parallel mission flights.',
    specs: ['10 Specialized Agent Personas', 'Shared Memory Graph Pipeline', 'Parallel Task Execution Engine', 'Full Audit Log & Provenance Tracing']
  },
  {
    id: 3,
    src: '/assets/synaps_boardroom_digital_twins.png',
    label: 'Executive Boardroom Digital Twins',
    tag: 'DIGITAL TWINS',
    desc: 'Simulates strategic enterprise decisions across 8 C-suite personas (CEO, CFO, CTO, Legal, HR) grounded in company memory.',
    specs: ['8 C-Suite Persona Twins', 'Stress-testing Strategic Options', 'Consensus & Divergence Heatmaps', 'Instant Debate Record Generation']
  },
  {
    id: 4,
    src: '/assets/synaps_ai_strategy_studio.png',
    label: 'AI Strategy Studio & Blueprint Engine',
    tag: 'STRATEGY STUDIO',
    desc: 'Formulates 11-stage enterprise strategy documents, Red-Team AI challenges, SWOT analysis, and execution roadmap milestones.',
    specs: ['11-Stage Transformation Roadmap', 'Automated Competitive Threat Scanning', 'Resource & Budget Allocation Plan', 'Risk Mitigation Playbook']
  }
];

export default function MadeWithGSAPSynapsLanding() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnnual, setIsAnnual] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [specModalData, setSpecModalData] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % SUITES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const filteredSuites = searchQuery.trim() === ''
    ? SUITES
    : SUITES.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()) || s.tag.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ background: '#0B0D12', color: '#F3EDE3', fontFamily: "'Inter', sans-serif", minHeight: '100vh' }}>
      
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header
        style={{
          position: 'fixed', top: 20, left: '4%', width: '92%', zIndex: 100,
          background: 'rgba(18, 20, 29, 0.88)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 40,
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}
      >
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#FFF', letterSpacing: '-0.02em', fontFamily: "'Space Grotesk', sans-serif" }}>
            SYNAPS<span style={{ color: '#10B981' }}>.AI</span>
          </span>
        </Link>

        <nav className="hide-mob" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <a href="#briefing-console" style={{ color: '#E2E8F0', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Briefing Console</a>
          <a href="#flight-control" style={{ color: '#E2E8F0', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Flight Control</a>
          <a href="#digital-twins" style={{ color: '#E2E8F0', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Digital Twins</a>
          <a href="#strategy-studio" style={{ color: '#E2E8F0', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Strategy Studio</a>
          <a href="#pricing" style={{ color: '#E2E8F0', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Pricing</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setSearchOpen(true)}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            🔍 Search (Ctrl+K)
          </button>
          <Link
            href="/login"
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
          >
            Sign In
          </Link>
          <Link
            href="/login"
            style={{ background: '#10B981', color: '#0B0D12', padding: '10px 22px', borderRadius: 20, fontSize: 13, fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            Launch Console →
          </Link>
        </div>
      </header>

      <main style={{ paddingTop: 120 }}>
        
        {/* ── HERO SECTION: DARK LANDO 3D TILTED DOCUMENT preview ───── */}
        <section style={{ maxWidth: 1240, margin: '0 auto', padding: '40px 30px 80px 30px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 50, alignItems: 'center' }}>
            
            {/* HERO LEFT CONTENT */}
            <div>
              <span style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10B981', fontSize: 12, fontWeight: 800, padding: '6px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 20, letterSpacing: '1px' }}>
                ENTERPRISE DECISION INTELLIGENCE LAYER
              </span>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(42px, 5vw, 64px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-1.5px', color: '#FFF', marginBottom: 20 }}>
                NOT A CHATBOT.<br />
                <span style={{ color: '#10B981', textShadow: '0 0 30px rgba(16, 185, 129, 0.4)' }}>THE INTELLIGENCE</span><br />
                LAYER ABOVE EVERY DOC.
              </h1>
              <p style={{ fontSize: 17, color: '#94A3B8', lineHeight: 1.65, marginBottom: 30, maxWidth: 560 }}>
                SYNAPS transforms company documents into an active, reasoning decision network. Inspect multi-evidence summaries, run multi-twin boardroom simulations, and verify mathematical confidence scores.
              </p>
              <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
                <Link
                  href="/login"
                  style={{ background: '#10B981', color: '#0B0D12', padding: '14px 28px', borderRadius: 12, fontSize: 14, fontWeight: 800, textDecoration: 'none', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)' }}
                >
                  LAUNCH DECISION HUB →
                </Link>
                <Link
                  href="/login"
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', padding: '14px 28px', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}
                >
                  RUN TWIN SIMULATION
                </Link>
              </div>

              <div style={{ display: 'flex', gap: 30, paddingTop: 25, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 800, color: '#FFF' }}>99.4%</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Synthesized Confidence</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 800, color: '#FFF' }}>10</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Parallel Mission Agents</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 800, color: '#FFF' }}>110</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Decision Models</div>
                </div>
              </div>
            </div>

            {/* HERO RIGHT 45-DEGREE TILTED 3D CARD */}
            <div style={{ perspective: 1200, display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  width: '100%', maxWidth: 480, background: '#12141D', borderRadius: 20,
                  border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(16, 185, 129, 0.15)',
                  overflow: 'hidden', transform: 'rotateY(-18deg) rotateX(10deg) rotateZ(2deg)', transition: 'transform 0.4s ease'
                }}
              >
                <div style={{ background: '#0B0D12', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }}></span>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }}></span>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }}></span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', fontFamily: 'monospace' }}>SYNAPS.AI // REASONING NODE #001</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#10B981' }}>LIVE REASONING</span>
                </div>
                <div style={{ position: 'relative', height: 300, background: '#000' }}>
                  <img src={SUITES[activeSlide].src} alt={SUITES[activeSlide].label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(11,13,18,0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 14px', borderRadius: 12, fontSize: 12, fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, background: '#10B981', borderRadius: '50%', boxShadow: '0 0 10px #10B981' }}></span>
                    <span>{SUITES[activeSlide].tag}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 4 UNIQUE SUITES DRAG SHOWCASE */}
          <div style={{ marginTop: 70, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {SUITES.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => { setActiveSlide(idx); setSpecModalData(s); }}
                style={{
                  background: '#12141D', borderRadius: 20, overflow: 'hidden', border: idx === activeSlide ? '2px solid #10B981' : '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: idx === activeSlide ? '0 0 30px rgba(16, 185, 129, 0.2)' : 'none'
                }}
              >
                <div style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
                  <img src={s.src} alt={s.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '16px 16px 12px 16px', background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)' }}>
                    <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6EE7B7', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' }}>{s.tag}</span>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: '#FFF', marginTop: 4 }}>{s.label}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── REAL APP FEATURE DEEP-DIVE ───────────────────────────── */}
        <section id="briefing-console" style={{ maxWidth: 1240, margin: '0 auto', padding: '60px 30px' }}>
          {SUITES.map((suite, idx) => (
            <div
              key={suite.id}
              id={suite.tag.toLowerCase().replace(' ', '-')}
              style={{
                display: 'grid', gridTemplateColumns: idx % 2 === 0 ? '1fr 1fr' : '1fr 1fr', gap: 50, alignItems: 'center',
                marginBottom: 90, direction: idx % 2 === 1 ? 'rtl' : 'ltr'
              }}
            >
              <div style={{ direction: 'ltr' }}>
                <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', border: '1px solid rgba(99, 102, 241, 0.3)', fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 20, display: 'inline-block', marginBottom: 15 }}>
                  MODULE 0{suite.id} • {suite.tag}
                </span>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 38, fontWeight: 800, color: '#FFF', marginBottom: 16, lineHeight: 1.1 }}>{suite.label}</h2>
                <p style={{ fontSize: 16, color: '#94A3B8', lineHeight: 1.65, marginBottom: 25 }}>{suite.desc}</p>
                <ul style={{ listStyle: 'none', fontSize: 14, color: '#CBD5E1', lineHeight: 2.2 }}>
                  {suite.specs.map((spec, sIdx) => (
                    <li key={sIdx}>✓ {spec}</li>
                  ))}
                </ul>
              </div>

              <div style={{ direction: 'ltr' }}>
                <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', background: '#12141D' }}>
                  <img src={suite.src} alt={suite.label} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ── PRICING SECTION ──────────────────────────────────────── */}
        <section id="pricing" style={{ padding: '80px 30px', background: '#07080B' }}>
          <div style={{ maxWidth: 680, margin: '0 auto', background: '#12141D', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 30, padding: '60px 40px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
            <span style={{ color: '#10B981', fontSize: 12, fontWeight: 800, letterSpacing: '1px' }}>• MEMBERSHIP & ENTERPRISE ACCESS</span>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 38, fontWeight: 800, color: '#FFF', marginTop: 10, marginBottom: 30 }}>
              Unlock the full <span style={{ color: '#10B981' }}>intelligence suite</span>
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 35 }}>
              <button onClick={() => setIsAnnual(false)} style={{ background: 'none', border: 'none', fontSize: 16, fontWeight: 600, color: !isAnnual ? '#FFF' : '#64748B', cursor: 'pointer' }}>Quarterly</button>
              <div onClick={() => setIsAnnual(!isAnnual)} style={{ width: 60, height: 32, background: isAnnual ? '#10B981' : '#1E293B', borderRadius: 20, padding: 4, cursor: 'pointer', transition: 'background 0.3s' }}>
                <div style={{ width: 24, height: 24, background: '#FFF', borderRadius: '50%', transform: isAnnual ? 'translateX(28px)' : 'translateX(0)', transition: 'transform 0.3s' }}></div>
              </div>
              <button onClick={() => setIsAnnual(true)} style={{ background: 'none', border: 'none', fontSize: 16, fontWeight: 600, color: isAnnual ? '#FFF' : '#64748B', cursor: 'pointer' }}>Annual <sup style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', padding: '2px 6px', borderRadius: 10, fontSize: 11 }}>-20%</sup></button>
            </div>

            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 64, fontWeight: 800, color: '#FFF', lineHeight: 1 }}>
              ${isAnnual ? '39' : '49'}
              <span style={{ display: 'block', fontSize: 14, color: '#94A3B8', fontWeight: 500, marginTop: 8 }}>{isAnnual ? 'per month, billed annually' : 'per month, billed quarterly'}</span>
            </div>

            <ul style={{ listStyle: 'none', textAlign: 'left', maxWidth: 440, margin: '30px auto', fontSize: 15, lineHeight: 2.2, color: '#CBD5E1' }}>
              <li>✓ Unlimited access to Executive Operational Briefing Console</li>
              <li>✓ Multi-Agent Flight Control System (10 Parallel Personas)</li>
              <li>✓ Executive Digital Twins & Boardroom Simulation Engine</li>
              <li>✓ AI Strategy Studio & 11-Stage Roadmap Generator</li>
              <li>✓ REST API, TypeScript & Python SDK access</li>
              <li>✓ 24/7 Enterprise Priority Support & 99.9% Uptime SLA</li>
            </ul>

            <Link
              href="/login"
              style={{ display: 'flex', justifyContent: 'center', width: '100%', background: '#10B981', color: '#0B0D12', padding: '16px 0', borderRadius: 14, fontSize: 15, fontWeight: 800, textDecoration: 'none', marginTop: 25, boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)' }}
            >
              Get Started with Synaps Pro →
            </Link>
          </div>
        </section>

        {/* ── FOOTER & 9-DOCUMENT LEGAL HUB ─────────────────────────── */}
        <footer style={{ background: '#0B0D12', padding: '80px 30px 40px 30px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 40, marginBottom: 40 }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#10B981', marginBottom: 6 }}>🔒 GLOBAL LEGAL & GOVERNANCE CENTER</h4>
              <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 20 }}>SYNAPS operates as a registered Data Fiduciary enforcing multi-jurisdictional compliance.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                <Link href="/legal/privacy" style={{ background: '#12141D', padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, color: '#E2E8F0', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>📄 1. Privacy Policy (DPDP / GDPR)</Link>
                <Link href="/legal/terms" style={{ background: '#12141D', padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, color: '#E2E8F0', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>📋 2. Terms &amp; AUP</Link>
                <Link href="/legal/data-processing" style={{ background: '#12141D', padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, color: '#E2E8F0', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>🤝 3. Data Processing Addendum (DPA)</Link>
                <Link href="/legal/security" style={{ background: '#12141D', padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, color: '#E2E8F0', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>🛡️ 4. Security Architecture (72h SLA)</Link>
                <Link href="/legal/ai-policy" style={{ background: '#12141D', padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, color: '#E2E8F0', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>🤖 5. AI Responsible Usage Statement</Link>
                <Link href="/legal/cookies" style={{ background: '#12141D', padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, color: '#E2E8F0', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>🍪 6. Cookie &amp; Tracking Policy</Link>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748B' }}>
              <div>© 2026 SYNAPS Technologies Inc. All rights reserved.</div>
              <div>Registered Data Fiduciary • ISO/IEC 27001 & SOC 2 Aligned</div>
            </div>
          </div>
        </footer>

      </main>

      {/* SPOTLIGHT SEARCH MODAL */}
      {searchOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <div style={{ background: '#12141D', borderRadius: 24, padding: 30, width: '100%', maxWidth: 600, border: '1px solid rgba(255,255,255,0.15)', position: 'relative' }}>
            <button onClick={() => setSearchOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#94A3B8', fontSize: 24, cursor: 'pointer' }}>&times;</button>
            <p style={{ color: '#10B981', fontSize: 12, fontWeight: 800 }}>• SPOTLIGHT MODULE SEARCH</p>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Type to search modules, agents, digital twins..."
              autoFocus
              style={{ width: '100%', padding: '14px 18px', background: '#0B0D12', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#FFF', fontSize: 16, margin: '15px 0 20px 0', outline: 'none' }}
            />
            <div style={{ maxHeight: 350, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredSuites.map(s => (
                <div key={s.id} onClick={() => { setSearchOpen(false); setSpecModalData(s); }} style={{ padding: 14, background: '#0B0D12', borderRadius: 12, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#FFF', marginBottom: 4 }}>
                    <span>SUITE #{s.id} {s.label}</span>
                    <span style={{ fontSize: 11, background: 'rgba(16,185,129,0.2)', color: '#10B981', padding: '2px 8px', borderRadius: 6 }}>{s.tag}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#94A3B8' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SPEC DRAWER MODAL */}
      {specModalData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <div style={{ background: '#12141D', borderRadius: 24, padding: 36, width: '100%', maxWidth: 640, border: '1px solid rgba(255,255,255,0.15)', position: 'relative' }}>
            <button onClick={() => setSpecModalData(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#94A3B8', fontSize: 24, cursor: 'pointer' }}>&times;</button>
            <span style={{ background: 'rgba(99,102,241,0.2)', color: '#818CF8', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 6 }}>SUITE #{specModalData.id} • {specModalData.tag}</span>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#FFF', margin: '10px 0 14px 0' }}>{specModalData.label}</h2>
            <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{specModalData.desc}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {specModalData.specs.map((sp: string, idx: number) => (
                <div key={idx} style={{ background: '#0B0D12', padding: 12, borderRadius: 10, fontSize: 13, color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.1)' }}>✓ {sp}</div>
              ))}
            </div>
            <Link
              href="/login"
              style={{ display: 'block', textAlign: 'center', width: '100%', background: '#10B981', color: '#0B0D12', padding: '14px 0', borderRadius: 12, fontSize: 14, fontWeight: 800, textDecoration: 'none' }}
            >
              Launch Suite #{specModalData.id} into Workspace →
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
