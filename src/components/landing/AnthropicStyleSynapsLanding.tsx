'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ArrowRight, ShieldCheck, CheckCircle2,
  FileText, Lock, X,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SignInModal from '@/components/SignInModal';

gsap.registerPlugin(ScrollTrigger);

// ── DATA ─────────────────────────────────────────────────────────────────────
const PILLARS = [
  {
    id: 'grounding',
    title: 'Evidence Grounding',
    body: 'Every answer traces back to exact page and line references in your documents. No guessing, no hallucination — pure verifiable intelligence.',
    icon: '📄'
  },
  {
    id: 'boardroom',
    title: '10-Agent Boardroom',
    body: 'Ten specialized AI agents debate risks, obligations, deadlines, and exposures simultaneously before producing a consensus brief you can act on.',
    icon: '🧠'
  },
  {
    id: 'security',
    title: 'Zero-Trust Vault',
    body: 'Your data stays yours. Multi-tenant isolation, AES-256 encryption, and HTTP-Only backend sessions ensure nothing leaks — ever.',
    icon: '🔒'
  }
];

const FEATURES = [
  { label: 'Ingests PDF, Excel, DOCX, CSV', icon: <FileText className="w-5 h-5" /> },
  { label: 'Line-level source citations on every answer', icon: <CheckCircle2 className="w-5 h-5" /> },
  { label: 'Real-time multi-agent risk debate', icon: <ShieldCheck className="w-5 h-5" /> },
  { label: '2FA-secured with HTTP-Only sessions', icon: <Lock className="w-5 h-5" /> },
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function AnthropicStyleSynapsLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ── GSAP: Word-pop-in on hero words ────────────────────────────────────────
  useGSAP(() => {
    // Staggered pop-in for hero words
    gsap.from('[data-pop]', {
      scale: 0.2,
      y: 40,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(2.5)',
      stagger: 0.08,
    });

    // Fade-up for sub text
    gsap.from('[data-fade]', {
      opacity: 0,
      y: 24,
      duration: 0.7,
      delay: 0.5,
      ease: 'power3.out',
      stagger: 0.12,
    });

    // Scroll-triggered reveals
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        opacity: 0,
        y: 40,
        scale: 0.96,
        duration: 0.75,
        ease: 'power3.out',
      });
    });

    // Staggered pop-in for pillar cards
    gsap.utils.toArray<HTMLElement>('[data-pop-card]').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        scale: 0.85,
        opacity: 0,
        y: 30,
        duration: 0.55,
        delay: i * 0.1,
        ease: 'back.out(2)',
      });
    });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0B0A12] text-white overflow-x-hidden"
    >
      {/* ── GLOBAL STYLES ────────────────────────────────────────────────────── */}
      <style jsx global>{`
        /* ─ CRAV-style font aliases ─ */
        .font-modak    { font-family: 'Modak', cursive; }
        .font-mouse    { font-family: 'Mouse Memoirs', sans-serif; letter-spacing: 0.05em; }

        /* ─ Stroke helpers matching CRAV ─ */
        .text-stroke-dark {
          -webkit-text-stroke: 3px #4C0016;
          paint-order: stroke fill;
        }
        .text-stroke-sm {
          -webkit-text-stroke: 2px rgba(139,92,246,0.6);
          paint-order: stroke fill;
        }

        /* ─ Blob button matching CRAV's SVG blob (adapted with purple) ─ */
        .blob-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          outline: none;
          border: none;
          background: transparent;
          padding: 0;
        }
        .blob-btn svg {
          transition: fill 0.2s ease;
        }
        .blob-btn:hover svg path {
          fill: #6D28D9;
        }
        .blob-btn span {
          position: relative;
          z-index: 10;
          color: white;
          font-family: 'Mouse Memoirs', sans-serif;
          font-size: clamp(16px, 2vw, 22px);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          pointer-events: none;
        }

        /* ─ Pill button (nav) ─ */
        .pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Mouse Memoirs', sans-serif;
          font-size: clamp(14px, 1.4vw, 18px);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 10px 24px;
          border-radius: 9999px;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), background 0.2s;
        }
        .pill-btn:hover { transform: scale(1.06); }

        /* ─ Section wavy divider ─ */
        .wavy-top {
          position: absolute;
          top: 0; left: 0; right: 0;
          overflow: hidden;
          line-height: 0;
        }
        .wavy-top svg { width: 100%; height: 80px; }

        /* ─ Scroll text band ─ */
        @keyframes scroll-band {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .scroll-band { animation: scroll-band 20s linear infinite; }

        /* ─ Feature card spring hover ─ */
        .spring-card {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .spring-card:hover { transform: scale(1.04) rotate(-0.5deg); }

        /* ─ Word hover pop ─ */
        .word-hover {
          display: inline-block;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), color 0.2s;
          cursor: default;
        }
        .word-hover:hover { transform: scale(1.12) translateY(-4px); color: #A78BFA; }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════════
          NAV
      ══════════════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-[4vw] py-[1.8vw] md:py-[1vw]">
        {/* Logo */}
        <Link href="/" className="font-modak text-[8vw] md:text-[3.5vw] leading-none text-[#7C3AED] hover:scale-105 transition-transform inline-block">
          SYNAPS
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-[2vw]">
          <a href="#how" className="font-mouse text-[1.2vw] uppercase text-purple-300/80 hover:text-white transition-colors">How it works</a>
          <a href="#features" className="font-mouse text-[1.2vw] uppercase text-purple-300/80 hover:text-white transition-colors">Features</a>
          <a href="#security" className="font-mouse text-[1.2vw] uppercase text-purple-300/80 hover:text-white transition-colors">Security</a>
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-[2vw]">
          <button
            onClick={() => setShowSignInModal(true)}
            className="pill-btn bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
          >
            Sign In
          </button>
          <button
            onClick={() => setShowSignInModal(true)}
            className="pill-btn border-2 border-purple-500/50 text-purple-200 hover:border-purple-400 hover:text-white hidden md:inline-flex"
          >
            Try Free
          </button>
          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-purple-300 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0B0A12]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-8 pt-16">
          {['How it works', 'Features', 'Security'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '')}`}
              className="font-modak text-5xl text-white hover:text-[#7C3AED] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <button
            onClick={() => { setMenuOpen(false); setShowSignInModal(true); }}
            className="pill-btn bg-[#7C3AED] text-white text-2xl px-10 py-4 mt-4"
          >
            Start Free
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-[22vw] md:pt-[12vw] pb-[10vw] overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-[60vh] rounded-full bg-[#7C3AED]/20 blur-[120px]" />
        </div>

        {/* Badge */}
        <p
          data-fade
          className="font-mouse text-[3.5vw] md:text-[1.4vw] uppercase text-[#7C3AED] tracking-widest mb-[2vw]"
        >
          Enterprise AI for Documents &amp; Data
        </p>

        {/* Giant hero headline — CRAV-style word-pop */}
        <h1
          className="font-modak leading-[0.85] text-center mb-[4vw]"
          style={{ fontSize: 'clamp(56px, 18vw, 220px)' }}
          aria-label="READ THINK DECIDE"
        >
          <span aria-hidden className="block overflow-visible">
            <span data-pop className="inline-block will-change-transform text-white word-hover">READ</span>
          </span>
          <span aria-hidden className="block overflow-visible">
            <span data-pop className="inline-block will-change-transform text-[#7C3AED] word-hover">THINK</span>
          </span>
          <span aria-hidden className="block overflow-visible">
            <span data-pop className="inline-block will-change-transform text-white word-hover">DECIDE</span>
          </span>
        </h1>

        {/* Sub text */}
        <p
          data-fade
          className="font-mouse text-[4.5vw] md:text-[1.6vw] text-purple-200/80 max-w-[44vw] mx-auto leading-[1.4] mb-[5vw]"
        >
          SYNAPS reads your contracts, ledgers, and reports — then reasons across them with 10 AI agents. Every answer cites the exact line it came from.
        </p>

        {/* CTA blob button — CRAV style */}
        <div data-fade className="relative w-fit mx-auto mb-[2vw]">
          <button
            onClick={() => setShowSignInModal(true)}
            className="blob-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 602 200" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
              <path
                fill="#7C3AED"
                d="M310.777 0.20434C424.154 2.91791 540.733 30 574.176 100C606.479 166 533.962 195 442.064 198C364.995 200 270.863 196 193.524 186C93.8313 173 -27.3608 150 5.48889 80C40.0621 5 186.179 -2.77783 310.777 0.20434Z"
              />
            </svg>
            <span className="relative z-10 inline-block px-[5vw] py-[2vw] md:px-[3vw] md:py-[1.2vw]">
              Start Free — No Credit Card
            </span>
          </button>
        </div>

        {/* Demo link */}
        <a
          data-fade
          href="https://capture.navattic.com/cmshd2htw000g04jp4r211hjd"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mouse text-[3.5vw] md:text-[1.2vw] uppercase text-purple-400 hover:text-white transition-colors flex items-center gap-2 mx-auto w-fit"
        >
          <span>Watch Interactive Tour</span>
          <ArrowRight className="w-4 h-4" />
        </a>

        {/* Scroll band */}
        <div className="absolute bottom-[4vw] left-0 w-full overflow-hidden pointer-events-none select-none">
          <div className="scroll-band flex whitespace-nowrap gap-[6vw] opacity-20">
            {Array(8).fill(null).map((_, i) => (
              <span key={i} className="font-modak text-[4vw] text-purple-300">
                SYNAPS · AI DECISIONS · ZERO HALLUCINATION · SOURCE CITATIONS ·&nbsp;
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION: HOW IT WORKS  (CRAV "about" section)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="how" className="relative bg-[#7C3AED] py-[12vw] overflow-hidden">
        {/* Wavy top divider */}
        <div className="wavy-top">
          <svg viewBox="0 0 1536 80" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1536,0 H-1 V40 S300,80 700,30 S1200,70 1536,30 V0" fill="#0B0A12" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center space-y-[6vw] pt-[4vw]">
          {/* Section title */}
          <div data-reveal>
            <p className="font-mouse text-[3vw] md:text-[1.2vw] uppercase text-[#FFD6FF] tracking-widest mb-2">
              THREE STEPS
            </p>
            <h2 className="font-modak text-white leading-[0.9]" style={{ fontSize: 'clamp(40px, 10vw, 120px)' }}>
              <span className="word-hover inline-block">UPLOAD</span>{' '}
              <span className="word-hover inline-block text-[#FFD750]">ASK</span>{' '}
              <span className="word-hover inline-block">VERIFY</span>
            </h2>
            <p className="font-mouse text-[3.5vw] md:text-[1.3vw] text-purple-200 mt-4 max-w-2xl mx-auto leading-relaxed">
              Drop in any document, ask a complex question, and receive a sourced answer with line citations — in seconds.
            </p>
          </div>

          {/* Three cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[3vw]">
            {[
              {
                num: '01',
                title: 'Upload',
                body: 'Drag in PDFs, Excel files, Word docs, or CSV data. SYNAPS parses, chunks, and indexes everything automatically.',
                color: 'bg-[#5B21B6]',
                accent: '#FFD750'
              },
              {
                num: '02',
                title: 'Ask',
                body: 'Ask any complex question in plain English. The 10-Agent Boardroom cross-examines every document simultaneously.',
                color: 'bg-[#0D0A1A]',
                accent: '#7C3AED'
              },
              {
                num: '03',
                title: 'Verify',
                body: 'Every answer comes with exact page and section references. Click any citation to jump straight to the source.',
                color: 'bg-[#FFD750]',
                accent: '#4C0016'
              }
            ].map((step) => (
              <div
                key={step.num}
                data-pop-card
                className={cn('spring-card rounded-[2vw] p-[4vw] md:p-[2.5vw] text-left border-4 border-black/20', step.color)}
              >
                <p className="font-modak text-[8vw] md:text-[4vw] leading-none mb-3" style={{ color: step.accent }}>
                  {step.num}
                </p>
                <h3 className="font-modak text-[6vw] md:text-[2.5vw] text-white leading-none mb-3">{step.title}</h3>
                <p className="font-mouse text-[3.5vw] md:text-[1.1vw] text-white/80 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>

          {/* Demo CTA */}
          <div data-reveal className="pt-[2vw]">
            <a
              href="https://capture.navattic.com/cmshd2htw000g04jp4r211hjd"
              target="_blank"
              rel="noopener noreferrer"
              className="blob-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 602 200" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                <path fill="#FFD750" d="M310.777 0.20434C424.154 2.91791 540.733 30 574.176 100C606.479 166 533.962 195 442.064 198C364.995 200 270.863 196 193.524 186C93.8313 173 -27.3608 150 5.48889 80C40.0621 5 186.179 -2.77783 310.777 0.20434Z" />
              </svg>
              <span className="relative z-10 text-[#4C0016] inline-block px-[5vw] py-[2vw] md:px-[3vw] md:py-[1.2vw]">
                See It In Action ↗
              </span>
            </a>
          </div>
        </div>

        {/* Wavy bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg viewBox="0 0 1536 80" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-20">
            <path d="M0,80 H1536 V40 S1200,0 900,50 S400,10 0,40 V80" fill="#0B0A12" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION: CAPABILITIES
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-[12vw] px-6 max-w-7xl mx-auto">
        {/* Big centred headline */}
        <div data-reveal className="text-center mb-[8vw]">
          <p className="font-mouse text-[3vw] md:text-[1.2vw] uppercase text-[#7C3AED] tracking-widest mb-3">
            WHAT SYNAPS DOES
          </p>
          <h2 className="font-modak text-white leading-[0.88]" style={{ fontSize: 'clamp(36px, 9vw, 110px)' }}>
            <span className="word-hover inline-block">INTELLIGENT.</span>{' '}
            <span className="word-hover inline-block text-[#7C3AED]">GROUNDED.</span><br />
            <span className="word-hover inline-block">TRUSTED.</span>
          </h2>
        </div>

        {/* Three pillar cards — CRAV photo-tilt grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[3vw] mb-[8vw]">
          {PILLARS.map((p, i) => (
            <div
              key={p.id}
              data-pop-card
              className={cn(
                'spring-card rounded-[3vw] overflow-hidden border-4 border-purple-500/30 bg-gradient-to-b from-[#16122B] to-[#0D0A1A] p-[4vw] md:p-[2.5vw] space-y-4',
                i === 1 ? 'md:-translate-y-[2vw]' : ''
              )}
            >
              <div className="text-[7vw] md:text-[4vw] leading-none">{p.icon}</div>
              <h3 className="font-modak text-[6vw] md:text-[2.2vw] text-white leading-none">{p.title}</h3>
              <p className="font-mouse text-[3.5vw] md:text-[1.1vw] text-purple-200/80 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Feature list row */}
        <div data-reveal className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[2vw]">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="spring-card flex items-center gap-3 bg-[#131022] border border-purple-500/20 rounded-2xl p-4 md:p-[1.2vw]"
            >
              <span className="text-[#7C3AED] shrink-0">{f.icon}</span>
              <span className="font-mouse text-[3.5vw] md:text-[1vw] text-purple-100 uppercase leading-tight">{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION: SECURITY BAND (CRAV red band → purple)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="security" className="relative bg-[#7C3AED] py-[10vw] overflow-hidden">
        {/* Wavy top */}
        <div className="wavy-top">
          <svg viewBox="0 0 1536 80" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1536,0 H-1 V55 S400,0 800,60 S1300,10 1536,55 V0" fill="#0B0A12" />
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center space-y-[4vw] pt-[4vw]">
          <div data-reveal>
            <p className="font-mouse text-[3vw] md:text-[1.2vw] uppercase text-[#FFD6FF] tracking-widest mb-3">
              ENTERPRISE-GRADE SECURITY
            </p>
            <h2 className="font-modak text-white leading-[0.9]" style={{ fontSize: 'clamp(36px, 9vw, 110px)' }}>
              YOUR DATA.<br />
              <span className="text-[#FFD750]">STAYS YOURS.</span>
            </h2>
            <p className="font-mouse text-[3.5vw] md:text-[1.3vw] text-purple-200 max-w-xl mx-auto mt-4 leading-relaxed">
              AES-256 encryption, multi-tenant isolation, HTTP-Only sessions, and 2FA OTP. Your documents never train public models.
            </p>
          </div>

          <div data-reveal className="grid grid-cols-1 md:grid-cols-3 gap-[2vw]">
            {[
              { title: 'Encrypted at Rest', body: 'AES-256 GCM for stored data. TLS 1.3 for every request in transit.' },
              { title: 'Tenant Isolation', body: 'Row-level DB security ensures no data ever bleeds between organizations.' },
              { title: '2FA + OTP Auth', body: 'Backend HTTP-Only sessions with server-side 2FA. Zero client-side cookie exposure.' }
            ].map((item) => (
              <div
                key={item.title}
                data-pop-card
                className="spring-card bg-[#5B21B6]/60 border-2 border-white/20 rounded-2xl p-[4vw] md:p-[1.8vw] text-left"
              >
                <h4 className="font-modak text-[5vw] md:text-[1.8vw] text-white mb-2">{item.title}</h4>
                <p className="font-mouse text-[3vw] md:text-[1vw] text-purple-200/90 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div data-reveal>
            <button
              onClick={() => setShowSignInModal(true)}
              className="blob-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 602 200" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                <path fill="#0D0A1A" d="M310.777 0.20434C424.154 2.91791 540.733 30 574.176 100C606.479 166 533.962 195 442.064 198C364.995 200 270.863 196 193.524 186C93.8313 173 -27.3608 150 5.48889 80C40.0621 5 186.179 -2.77783 310.777 0.20434Z" />
              </svg>
              <span className="relative z-10 text-[#7C3AED] inline-block px-[5vw] py-[2vw] md:px-[3vw] md:py-[1.2vw]">
                Request Access
              </span>
            </button>
          </div>
        </div>

        {/* Wavy bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg viewBox="0 0 1536 80" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-20">
            <path d="M0,80 H1536 V40 S1000,0 600,50 S200,20 0,40 V80" fill="#0B0A12" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION: FINAL CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-[12vw] px-6 text-center space-y-[4vw]">
        <div data-reveal>
          <h2 className="font-modak text-white leading-[0.88]" style={{ fontSize: 'clamp(40px, 11vw, 140px)' }}>
            <span className="word-hover inline-block">START</span>{' '}
            <span className="word-hover inline-block text-[#7C3AED]">READING</span><br />
            <span className="word-hover inline-block">SMARTER.</span>
          </h2>
        </div>

        <p data-fade className="font-mouse text-[4vw] md:text-[1.4vw] text-purple-300/80 max-w-xl mx-auto">
          Upload your first document. Ask your first question. Get your first cited answer — in under 60 seconds.
        </p>

        <div data-fade className="flex flex-col md:flex-row items-center justify-center gap-[2vw]">
          <button
            onClick={() => setShowSignInModal(true)}
            className="blob-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 602 200" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
              <path fill="#7C3AED" d="M310.777 0.20434C424.154 2.91791 540.733 30 574.176 100C606.479 166 533.962 195 442.064 198C364.995 200 270.863 196 193.524 186C93.8313 173 -27.3608 150 5.48889 80C40.0621 5 186.179 -2.77783 310.777 0.20434Z" />
            </svg>
            <span className="relative z-10 inline-block px-[5vw] py-[2vw] md:px-[3vw] md:py-[1.2vw]">
              Create Free Account
            </span>
          </button>

          <a
            href="https://capture.navattic.com/cmshd2htw000g04jp4r211hjd"
            target="_blank"
            rel="noopener noreferrer"
            className="pill-btn border-2 border-purple-500/40 text-purple-300 hover:border-purple-400 hover:text-white"
          >
            <span>Interactive Demo ↗</span>
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-purple-900/40 py-[4vw] px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="font-modak text-[#7C3AED] text-3xl leading-none">SYNAPS</span>
            <span className="font-mouse text-[1vw] md:text-xs text-purple-400/60 uppercase">© 2026 SYNAPS Technologies, Inc.</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            {[
              { href: '/legal/privacy', label: 'Privacy' },
              { href: '/legal/terms', label: 'Terms' },
              { href: '/legal/eula', label: 'EULA' },
              { href: '/legal/dmca', label: 'DMCA' },
              { href: '/legal/security', label: 'Security' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mouse text-purple-400/60 hover:text-white transition-colors text-sm uppercase"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════════════════════════ */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
    </div>
  );
}
