'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, X, Menu } from 'lucide-react';
import SignInModal from '@/components/SignInModal';

gsap.registerPlugin(ScrollTrigger);

// ─── FONT PRELOAD (Zero-style fonts) ─────────────────────────────────────────
// Fustat, Google Sans Flex, STK Bureau Serif, Sloop Script Pro, PP Supply Mono
// loaded via Google Fonts + Framer CDN in layout.tsx

// ─── DATA ────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: '01',
    title: 'Upload anything',
    body: 'Drop PDFs, Excel sheets, DOCX files, or CSVs. Synaps parses every page in seconds.',
  },
  {
    num: '02',
    title: 'Ask in plain language',
    body: 'No query syntax. Ask like you\'re texting a CFO. Synaps locates the exact clause, cell, or paragraph.',
  },
  {
    num: '03',
    title: 'Get cited, auditable answers',
    body: 'Every response links directly to page and line numbers. Share with confidence. Never guess again.',
  },
];

const MARQUEE_ITEMS = [
  'Evidence Grounded', 'No hallucinations', '10-Agent Boardroom', 'Real-time Risk Debate',
  'AES-256 Encrypted', 'DPDP Act Compliant', 'Instant Answers', 'PDF · Excel · DOCX · CSV',
  'Line-Level Citations', 'Memory Graph AI', 'Zero-Trust Vault',
];

// ─── MARQUEE STRIP ────────────────────────────────────────────────────────────
function MarqueeStrip() {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    gsap.to(el, {
      x: '-50%',
      duration: 28,
      ease: 'none',
      repeat: -1,
    });
  }, []);

  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="overflow-hidden w-full border-y border-[#e7e5e4]" style={{ background: '#fffdf7' }}>
      <div ref={track} className="flex gap-0 whitespace-nowrap will-change-transform" style={{ width: 'max-content' }}>
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-8 py-4"
            style={{ fontFamily: "'PP Supply Mono Regular', monospace", fontSize: 13, color: '#262424', letterSpacing: '0.04em' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5112] inline-block" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ZeroStyleSynapsLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ── GSAP Animations ────────────────────────────────────────────────────────
  useGSAP(() => {
    // Nav slides up from below (Zero style — translateY 400px → 0)
    if (navRef.current) {
      gsap.from(navRef.current, {
        y: 120,
        opacity: 0,
        duration: 0.9,
        delay: 0.3,
        ease: 'back.out(1.8)',
      });
    }

    // Hero words spring pop-in
    gsap.from('[data-pop]', {
      scale: 0.15,
      y: 48,
      opacity: 0,
      duration: 0.65,
      ease: 'back.out(2.5)',
      stagger: 0.07,
    });

    // Sub-text fade up
    gsap.from('[data-fade]', {
      opacity: 0,
      y: 28,
      duration: 0.75,
      delay: 0.55,
      ease: 'power3.out',
      stagger: 0.1,
    });

    // Scroll reveals
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        opacity: 0,
        y: 44,
        duration: 0.75,
        ease: 'power3.out',
      });
    });

    // Step number pop-ins
    gsap.utils.toArray<HTMLElement>('[data-step]').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        scale: 0.7,
        opacity: 0,
        duration: 0.6,
        delay: i * 0.12,
        ease: 'back.out(2)',
      });
    });
  }, { scope: containerRef });

  return (
    <>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fustat:wght@400;500;600;700&family=Google+Sans+Flex:wght@300..900&display=swap');
        @font-face {
          font-family: "STK Bureau Serif Book";
          src: url("https://framerusercontent.com/assets/l3qQgMiMq1tGawLasW3ZYLwMDkk.woff2");
          font-display: swap; font-style: normal; font-weight: 400;
        }
        @font-face {
          font-family: "STK Bureau Serif Medium";
          src: url("https://framerusercontent.com/assets/K1M9FDVW9oDVcdPb4bMucPx0Dus.woff2");
          font-display: swap; font-style: normal; font-weight: 500;
        }
        @font-face {
          font-family: "Sloop Script Pro Bold";
          src: url("https://framerusercontent.com/assets/1XmrGlp7hIw1bpyVxsl2fMgytJA.woff2");
          font-display: swap; font-style: italic; font-weight: 700;
        }
        @font-face {
          font-family: "Sloop Script Pro Regular";
          src: url("https://framerusercontent.com/assets/C1ObxRRtNQ1griqs4mhh5CVCw.woff2");
          font-display: swap; font-style: italic; font-weight: 400;
        }
        @font-face {
          font-family: "PP Supply Mono Regular";
          src: url("https://framerusercontent.com/assets/CTX3fHUepJxbyoY195f0xCdXUU.woff2");
          font-display: swap; font-style: normal; font-weight: 400;
        }

        :root {
          --zero-bg: #fffdf7;
          --zero-ink: #262424;
          --zero-ink-muted: #6c6b6e;
          --zero-rule: #e7e5e4;
          --zero-cream: #f2efed;
          --zero-orange: #ff5112;
          --zero-hero-bg: #0b0e1a;
          --zero-hero-accent: #7c3aed;
          --zero-green: #b6ffb6;
        }

        html { scroll-behavior: smooth; }

        .font-serif-stk { font-family: "STK Bureau Serif Medium", Georgia, serif; }
        .font-sloop { font-family: "Sloop Script Pro Bold", cursive; font-style: italic; }
        .font-sloop-reg { font-family: "Sloop Script Pro Regular", cursive; font-style: italic; }
        .font-mono-pp { font-family: "PP Supply Mono Regular", monospace; }
        .font-fustat { font-family: "Fustat", system-ui, sans-serif; }
        .font-gsans { font-family: "Google Sans Flex", "Fustat", system-ui, sans-serif; }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        /* Superellipse pill nav — same shape as Zero */
        .nav-pill {
          border-radius: 99px;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(38,36,36,0.1);
          box-shadow: 0 8px 40px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.8) inset;
        }
        .nav-pill-dark {
          background: rgba(11,14,26,0.75);
          border-color: rgba(255,255,255,0.1);
        }

        /* Lenis-style smooth scroll stub */
        [data-pop], [data-pop-card], [data-step] { will-change: transform; }

        /* Hero gradient orbs */
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          mix-blend-mode: screen;
          pointer-events: none;
        }
      `}</style>

      <div ref={containerRef} style={{ background: 'var(--zero-bg)', color: 'var(--zero-ink)' }}>

        {/* ── FLOATING NAV (bottom center, Zero style) ─────────────────────── */}
        <nav ref={navRef} style={{
          position: 'fixed',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          <div className="nav-pill flex items-center gap-1 px-2 py-2">
            {/* Logo mark */}
            <div className="flex items-center gap-2 px-3 py-1.5"
              style={{ fontFamily: '"Google Sans Flex", system-ui', fontWeight: 700, fontSize: 15, color: 'var(--zero-ink)' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '8px',
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 800, fontFamily: '"Google Sans Flex", system-ui' }}>S</span>
              </div>
              Synaps
            </div>

            <div style={{ width: 1, height: 20, background: 'var(--zero-rule)', margin: '0 4px' }} />

            {/* Nav links */}
            {[
              { label: 'How it works', href: '#how' },
              { label: 'Features', href: '#features' },
              { label: 'Security', href: '#security' },
            ].map(({ label, href }) => (
              <a key={label} href={href}
                style={{
                  fontFamily: '"Fustat", system-ui', fontSize: 14, fontWeight: 500,
                  color: 'var(--zero-ink)', padding: '6px 14px', borderRadius: 99,
                  transition: 'background 0.15s', textDecoration: 'none',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(38,36,36,0.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {label}
              </a>
            ))}

            <div style={{ width: 1, height: 20, background: 'var(--zero-rule)', margin: '0 4px' }} />

            {/* CTA */}
            <button
              onClick={() => setShowSignInModal(true)}
              style={{
                fontFamily: '"Fustat", system-ui', fontSize: 14, fontWeight: 600,
                background: 'var(--zero-ink)', color: '#fff',
                border: 'none', borderRadius: 99, padding: '8px 20px', cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: '0 2px 12px rgba(38,36,36,0.25)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            >
              Get started →
            </button>
          </div>
        </nav>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section style={{
          position: 'relative',
          minHeight: '100vh',
          background: 'var(--zero-hero-bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '120px 24px 160px',
        }}>
          {/* Background orbs — like Zero's lottie blobs */}
          <div className="hero-orb" style={{ width: 600, height: 600, background: '#7c3aed', opacity: 0.35, top: '-100px', left: '-100px' }} />
          <div className="hero-orb" style={{ width: 500, height: 500, background: '#312e81', opacity: 0.4, bottom: '-80px', right: '-80px' }} />
          <div className="hero-orb" style={{ width: 300, height: 300, background: '#b6ffb6', opacity: 0.08, top: '40%', left: '30%' }} />

          {/* Badge */}
          <div data-fade style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 99, padding: '6px 16px 6px 10px', marginBottom: 48,
          }}>
            <span style={{
              background: '#7c3aed', borderRadius: 99, padding: '2px 10px',
              fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: '"PP Supply Mono Regular", monospace',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>Beta</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: '"Fustat", system-ui' }}>
              Your enterprise brain is here
            </span>
          </div>

          {/* Main headline — Google Sans Flex, massive */}
          <h1 style={{
            fontFamily: '"Google Sans Flex", system-ui',
            fontWeight: 700,
            fontSize: 'clamp(48px, 8vw, 96px)',
            lineHeight: 1.0,
            color: '#ffffff',
            textAlign: 'center',
            maxWidth: 900,
            letterSpacing: '-0.03em',
          }}>
            {['Know.', 'Decide.', 'Win.'].map((word) => (
              <span key={word} data-pop style={{ display: 'inline-block', marginRight: '0.25em' }}>
                {word}
              </span>
            ))}
          </h1>

          {/* Script accent */}
          <div data-fade style={{
            fontFamily: '"Sloop Script Pro Bold", cursive',
            fontStyle: 'italic',
            fontSize: 'clamp(28px, 4vw, 52px)',
            color: '#b6ffb6',
            marginTop: 8,
            marginBottom: 32,
            textAlign: 'center',
          }}>
            Your enterprise AI, grounded in truth
          </div>

          {/* Subhead */}
          <p data-fade style={{
            fontFamily: '"STK Bureau Serif Book", Georgia, serif',
            fontSize: 'clamp(16px, 2vw, 22px)',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.62)',
            textAlign: 'center',
            maxWidth: 560,
            marginBottom: 56,
          }}>
            Synaps turns your contracts, reports, and data into a conversational knowledge system. Ask anything. Get cited answers in seconds.
          </p>

          {/* CTAs */}
          <div data-fade style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => setShowSignInModal(true)}
              style={{
                fontFamily: '"Fustat", system-ui', fontWeight: 600, fontSize: 16,
                background: '#fff', color: 'var(--zero-ink)',
                border: 'none', borderRadius: 99, padding: '14px 32px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            >
              Start for free
              <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <a href="#how" style={{
              fontFamily: '"Fustat", system-ui', fontWeight: 500, fontSize: 16,
              color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 99, padding: '14px 28px', textDecoration: 'none',
              transition: 'border-color 0.2s, color 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.6)'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.7)'; }}
            >
              See how it works
            </a>
          </div>

          {/* Bottom stat band inside hero */}
          <div data-fade style={{
            position: 'absolute', bottom: 40, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap',
          }}>
            {[
              { val: '10×', label: 'Faster document review' },
              { val: '100%', label: 'Source-cited answers' },
              { val: '10', label: 'AI agents in parallel' },
            ].map(({ val, label }) => (
              <div key={val} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: '"Google Sans Flex", system-ui', fontWeight: 800, fontSize: 32, color: '#fff', lineHeight: 1 }}>{val}</div>
                <div style={{ fontFamily: '"Fustat", system-ui', fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── MARQUEE ───────────────────────────────────────────────────────── */}
        <MarqueeStrip />

        {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
        <section id="how" style={{
          background: 'var(--zero-bg)', padding: 'clamp(64px, 8vw, 128px) clamp(24px, 6vw, 96px)',
          maxWidth: 1200, margin: '0 auto',
        }}>
          {/* Section label */}
          <div data-reveal style={{
            fontFamily: '"PP Supply Mono Regular", monospace', fontSize: 11,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'var(--zero-orange)', marginBottom: 24,
          }}>
            How it works
          </div>

          <h2 data-reveal style={{
            fontFamily: '"Google Sans Flex", system-ui', fontWeight: 700,
            fontSize: 'clamp(36px, 5vw, 72px)',
            color: 'var(--zero-ink)', lineHeight: 1.05, letterSpacing: '-0.025em',
            maxWidth: 700, marginBottom: 80,
          }}>
            Three steps.<br />
            <span className="font-sloop" style={{ fontSize: '0.85em', color: 'var(--zero-ink-muted)' }}>
              Zero confusion.
            </span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STEPS.map(({ num, title, body }, i) => (
              <div key={num} data-step style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '0 48px',
                padding: '40px 0',
                borderTop: '1px solid var(--zero-rule)',
                alignItems: 'start',
              }}>
                {/* Number */}
                <div style={{
                  fontFamily: '"Google Sans Flex", system-ui', fontWeight: 800,
                  fontSize: 'clamp(64px, 8vw, 112px)', color: 'var(--zero-cream)',
                  lineHeight: 1, letterSpacing: '-0.04em', minWidth: 120,
                }}>
                  {num}
                </div>
                {/* Text */}
                <div style={{ paddingTop: 12 }}>
                  <h3 style={{
                    fontFamily: '"Google Sans Flex", system-ui', fontWeight: 700,
                    fontSize: 'clamp(22px, 3vw, 36px)', color: 'var(--zero-ink)',
                    marginBottom: 12, letterSpacing: '-0.02em',
                  }}>
                    {title}
                  </h3>
                  <p style={{
                    fontFamily: '"STK Bureau Serif Book", Georgia, serif',
                    fontSize: 'clamp(15px, 1.5vw, 19px)', color: 'var(--zero-ink-muted)',
                    lineHeight: 1.7, maxWidth: 520,
                  }}>
                    {body}
                  </p>
                </div>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--zero-rule)' }} />
          </div>
        </section>

        {/* ── DARK FEATURES BAND ────────────────────────────────────────────── */}
        <section id="features" style={{
          background: 'var(--zero-hero-bg)',
          padding: 'clamp(64px, 8vw, 128px) clamp(24px, 6vw, 96px)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* bg orb */}
          <div className="hero-orb" style={{ width: 700, height: 700, background: '#4f46e5', opacity: 0.18, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />

          <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div data-reveal style={{
              fontFamily: '"PP Supply Mono Regular", monospace', fontSize: 11,
              letterSpacing: '0.15em', textTransform: 'uppercase', color: '#b6ffb6', marginBottom: 24,
            }}>
              Features
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 0 }}>
              {[
                { emoji: '📄', title: 'Document Intelligence', body: 'Ingests PDF, Excel, DOCX, CSV. Extracts meaning, not just text.' },
                { emoji: '🧠', title: '10-Agent Boardroom', body: 'Ten specialist AI agents debate risks and obligations in parallel before giving you one clear answer.' },
                { emoji: '🔒', title: 'Zero-Trust Vault', body: 'AES-256 encryption, HTTP-Only sessions, multi-tenant isolation. Your data stays yours.' },
                { emoji: '⚡', title: 'Instant Answers', body: 'Sub-second retrieval. Line-level citations on every response. No more hunting through 300-page decks.' },
                { emoji: '🌐', title: 'Web + Doc Hybrid AI', body: 'Ask about your documents and the live web at the same time. Grounded in real sources, always.' },
                { emoji: '🇮🇳', title: 'DPDP Act Compliant', body: 'Built to meet India\'s Digital Personal Data Protection Act 2023 from day one.' },
              ].map(({ emoji, title, body }, i) => (
                <div key={title} data-reveal style={{
                  padding: '40px 36px',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  borderLeft: i % 3 !== 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}>
                  <div style={{ fontSize: 32, marginBottom: 20 }}>{emoji}</div>
                  <h3 style={{
                    fontFamily: '"Google Sans Flex", system-ui', fontWeight: 700,
                    fontSize: 20, color: '#fff', marginBottom: 10, letterSpacing: '-0.01em',
                  }}>{title}</h3>
                  <p style={{
                    fontFamily: '"STK Bureau Serif Book", Georgia, serif',
                    fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65,
                  }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECURITY / TRUST SECTION ──────────────────────────────────────── */}
        <section id="security" style={{
          background: 'var(--zero-cream)',
          padding: 'clamp(64px, 8vw, 128px) clamp(24px, 6vw, 96px)',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div data-reveal style={{
              fontFamily: '"PP Supply Mono Regular", monospace', fontSize: 11,
              letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--zero-orange)', marginBottom: 24,
            }}>
              Security & Trust
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px 96px', alignItems: 'start' }}>
              <div data-reveal>
                <h2 style={{
                  fontFamily: '"Google Sans Flex", system-ui', fontWeight: 700,
                  fontSize: 'clamp(32px, 4vw, 56px)', color: 'var(--zero-ink)',
                  lineHeight: 1.1, letterSpacing: '-0.025em', marginBottom: 24,
                }}>
                  Enterprise-grade security.<br />
                  <span className="font-sloop-reg" style={{ fontSize: '0.8em' }}>Built-in, not bolted-on.</span>
                </h2>
                <p style={{
                  fontFamily: '"STK Bureau Serif Book", Georgia, serif',
                  fontSize: 18, color: 'var(--zero-ink-muted)', lineHeight: 1.7,
                }}>
                  Your documents, your organisation, your data. Synaps never mixes data across tenants. Every request is authenticated. Every session is isolated.
                </p>
              </div>

              <div data-reveal style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: 'AES-256 encryption at rest & in transit', check: true },
                  { label: 'Multi-tenant data isolation', check: true },
                  { label: 'HTTP-Only session tokens (no XSS)', check: true },
                  { label: 'DPDP Act 2023 compliant audit logs', check: true },
                  { label: '2FA / MFA authentication support', check: true },
                  { label: 'Zero data sold to third parties — ever', check: true },
                ].map(({ label, check }) => (
                  <div key={label} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '18px 0', borderBottom: '1px solid var(--zero-rule)',
                  }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: 99,
                      background: '#262424', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span style={{ fontFamily: '"Fustat", system-ui', fontSize: 15, color: 'var(--zero-ink)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section style={{
          background: 'var(--zero-hero-bg)', position: 'relative', overflow: 'hidden',
          padding: 'clamp(80px, 10vw, 160px) clamp(24px, 6vw, 96px)',
          textAlign: 'center',
        }}>
          <div className="hero-orb" style={{ width: 800, height: 800, background: '#7c3aed', opacity: 0.2, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div data-reveal style={{
              fontFamily: '"Sloop Script Pro Bold", cursive', fontStyle: 'italic',
              fontSize: 'clamp(36px, 5vw, 64px)', color: '#b6ffb6', marginBottom: 16,
            }}>
              Ready to know more?
            </div>

            <h2 data-reveal style={{
              fontFamily: '"Google Sans Flex", system-ui', fontWeight: 700,
              fontSize: 'clamp(40px, 6vw, 80px)', color: '#fff',
              lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 24,
            }}>
              Your enterprise brain<br />starts here.
            </h2>

            <p data-reveal style={{
              fontFamily: '"STK Bureau Serif Book", Georgia, serif',
              fontSize: 'clamp(16px, 1.5vw, 20px)', color: 'rgba(255,255,255,0.55)',
              maxWidth: 480, margin: '0 auto 48px',
            }}>
              Join teams already using Synaps to move faster, decide better, and eliminate document chaos.
            </p>

            <div data-reveal style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowSignInModal(true)}
                style={{
                  fontFamily: '"Fustat", system-ui', fontWeight: 700, fontSize: 17,
                  background: '#fff', color: 'var(--zero-ink)',
                  border: 'none', borderRadius: 99, padding: '16px 40px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  boxShadow: '0 4px 32px rgba(0,0,0,0.35)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
              >
                Get started — it's free
                <ArrowRight style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <p data-reveal style={{
              fontFamily: '"Fustat", system-ui', fontSize: 13,
              color: 'rgba(255,255,255,0.3)', marginTop: 20,
            }}>
              No credit card required · Setup in 2 minutes
            </p>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────────────── */}
        <footer style={{
          background: 'var(--zero-ink)', padding: '40px clamp(24px, 6vw, 96px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '8px',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 800, fontFamily: '"Google Sans Flex", system-ui' }}>S</span>
            </div>
            <span style={{ fontFamily: '"Google Sans Flex", system-ui', fontWeight: 700, fontSize: 15, color: '#fff' }}>Synaps</span>
          </div>

          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Contact'].map(link => (
              <a key={link} href="#" style={{
                fontFamily: '"Fustat", system-ui', fontSize: 13,
                color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
                transition: 'color 0.15s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.8)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.4)'; }}
              >
                {link}
              </a>
            ))}
          </div>

          <p style={{
            fontFamily: '"Fustat", system-ui', fontSize: 12,
            color: 'rgba(255,255,255,0.25)',
          }}>
            © {new Date().getFullYear()} Synaps. All rights reserved.
          </p>
        </footer>

        {/* ── SIGN IN MODAL ─────────────────────────────────────────────────── */}
        {showSignInModal && (
          <SignInModal onClose={() => setShowSignInModal(false)} />
        )}
      </div>
    </>
  );
}
