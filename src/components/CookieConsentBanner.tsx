"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, X, ChevronDown, ChevronUp, Check, Ban } from "lucide-react";

type ConsentState = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  decided: boolean;
  timestamp: number;
};

const DEFAULT_CONSENT: ConsentState = {
  essential: true, // always on — cannot be turned off
  analytics: false,
  marketing: false,
  decided: false,
  timestamp: 0,
};

const STORAGE_KEY = "synaps-cookie-consent";
const CONSENT_EXPIRY_DAYS = 365;

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: ConsentState = JSON.parse(stored);
        const ageMs = Date.now() - (parsed.timestamp || 0);
        const expiredMs = CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
        if (parsed.decided && ageMs < expiredMs) {
          // Valid consent already stored — don't show banner
          setVisible(false);
          return;
        }
      }
    } catch {}
    // Show banner after slight delay for layout paint
    setTimeout(() => setVisible(true), 1200);
  }, []);

  const save = (state: ConsentState) => {
    const withTime = { ...state, decided: true, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withTime));
    setVisible(false);
  };

  const acceptAll = () =>
    save({ essential: true, analytics: true, marketing: true, decided: true, timestamp: 0 });

  const rejectAll = () =>
    save({ essential: true, analytics: false, marketing: false, decided: true, timestamp: 0 });

  const saveCustom = () =>
    save({ ...consent, essential: true, decided: true, timestamp: 0 });

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-end justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" />

      {/* Banner Card */}
      <div
        className="relative w-full max-w-2xl bg-[#0d0f18] border border-white/15 rounded-3xl shadow-2xl shadow-black/60 p-6 pointer-events-auto animate-in fade-in slide-in-from-bottom-6 duration-500"
        role="dialog"
        aria-modal="true"
        aria-label="Cookie & Privacy Consent"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Your Privacy, Your Choice
              </h2>
              <p className="text-[11px] text-slate-400 font-mono uppercase tracking-widest">
                GDPR · CCPA · DPDP Act 2023 · PIPEDA · PDPA
              </p>
            </div>
          </div>
          <button
            onClick={rejectAll}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
            aria-label="Decline all and close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-5">
          We use cookies to deliver our services, improve performance, and — only with your
          permission — measure analytics. We <strong className="text-white">never sell</strong> your
          personal data. Your choices are stored for 365 days and you can change them at any time
          via our{" "}
          <Link href="/legal/cookies" className="text-amber-400 hover:underline font-semibold">
            Cookie Policy
          </Link>
          .
        </p>

        {/* Customise Accordion */}
        <div className="mb-5">
          <button
            onClick={() => setShowDetails((v) => !v)}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors"
          >
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Manage Preferences
          </button>

          {showDetails && (
            <div className="mt-4 space-y-3 border border-white/10 rounded-2xl p-4 bg-white/[0.02]">
              {/* Essential */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Essential Cookies</p>
                  <p className="text-xs text-slate-500">Required for authentication, security, and session management. Cannot be disabled.</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold font-mono border border-emerald-500/30">
                  ALWAYS ON
                </div>
              </div>

              <hr className="border-white/10" />

              {/* Analytics */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-white">Analytics Cookies</p>
                  <p className="text-xs text-slate-500">Vercel Web Analytics — helps us understand feature usage (no personal data shared with 3rd parties).</p>
                </div>
                <button
                  onClick={() => setConsent((c) => ({ ...c, analytics: !c.analytics }))}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                    consent.analytics ? "bg-amber-400" : "bg-slate-700"
                  }`}
                  role="switch"
                  aria-checked={consent.analytics}
                  aria-label="Toggle analytics cookies"
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      consent.analytics ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <hr className="border-white/10" />

              {/* Marketing */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-white">Marketing Cookies</p>
                  <p className="text-xs text-slate-500">Currently none in use. Toggle for future opt-in to relevant product updates and personalization.</p>
                </div>
                <button
                  onClick={() => setConsent((c) => ({ ...c, marketing: !c.marketing }))}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                    consent.marketing ? "bg-amber-400" : "bg-slate-700"
                  }`}
                  role="switch"
                  aria-checked={consent.marketing}
                  aria-label="Toggle marketing cookies"
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      consent.marketing ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={acceptAll}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-black uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Check className="w-4 h-4" /> Accept All Cookies
          </button>

          {showDetails && (
            <button
              onClick={saveCustom}
              className="flex-1 py-3 px-6 bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 border border-white/15"
            >
              Save My Choices
            </button>
          )}

          <button
            onClick={rejectAll}
            className="flex-1 sm:flex-none py-3 px-6 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-white/20"
          >
            <Ban className="w-4 h-4" /> Reject All
          </button>
        </div>

        {/* CCPA "Do Not Sell" + Legal links */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-500 font-mono">
          <Link href="/legal/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link href="/legal/cookies" className="hover:text-amber-400 transition-colors">Cookie Policy</Link>
          <span>·</span>
          <Link href="/legal/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link>
          <span>·</span>
          <button
            onClick={rejectAll}
            className="text-amber-400/80 hover:text-amber-400 transition-colors font-bold uppercase tracking-wider cursor-pointer"
          >
            Do Not Sell My Personal Information (CCPA)
          </button>
        </div>
      </div>
    </div>
  );
}
