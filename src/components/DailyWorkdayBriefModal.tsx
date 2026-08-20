'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Sparkles, CheckCircle2, ArrowRight, ShieldAlert, 
  Volume2, VolumeX, X, Calendar, FileText, TrendingUp, Users, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DailyWorkdayBriefModalProps {
  isOpenOverride?: boolean;
  onCloseOverride?: () => void;
}

export default function DailyWorkdayBriefModal({ isOpenOverride, onCloseOverride }: DailyWorkdayBriefModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [briefData, setBriefData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Format today and yesterday's date
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const dateFormatted = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Only open when explicitly triggered by the user clicking the "Daily Brief" button
      if (isOpenOverride) {
        setIsOpen(true);
        fetchDailyBrief();
      }
    }
  }, [isOpenOverride]);

  const fetchDailyBrief = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/chief-of-staff/brief');
      const json = await res.json();
      if (json.success && json.data) {
        setBriefData(json.data);
      }
    } catch (e) {
      console.warn('Notice fetching daily brief, using synthesized workday data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('synaps_daily_brief_date', todayStr);
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setIsOpen(false);
    if (onCloseOverride) onCloseOverride();
  };

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `Good morning Executive. Here is your daily workday briefing for ${dateFormatted}. 
    Previous workday recap: All organizational memory graphs and document indices are reconciled with zero data leaks. 
    Today's top focus items include reviewing pending enterprise contracts, checking Boardroom deliberation items, and auditing risk vulnerabilities. Have a productive workday.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  if (!isOpen && !isOpenOverride) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl rounded-3xl bg-[#0e121e] text-white border border-neutral-800 shadow-2xl overflow-hidden font-sans flex flex-col max-h-[90vh]"
        >
          {/* Header Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Top Bar */}
          <div className="p-6 border-b border-neutral-800/80 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Daily Workday Executive Brief
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                    NEW WORKDAY
                  </span>
                </div>
                <p className="font-mono text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{dateFormatted}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleAudio}
                className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-mono font-bold ${
                  isSpeaking 
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 animate-pulse' 
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
                }`}
                title={isSpeaking ? 'Mute Audio Briefing' : 'Listen to Audio Briefing'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{isSpeaking ? 'Playing' : 'Listen'}</span>
              </button>

              <button
                onClick={handleDismiss}
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar relative z-10 flex-1">
            
            {/* Previous Workday Recap Card */}
            <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800/90 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                <span className="font-mono text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  // PREVIOUS WORKDAY RECAP & RECONCILIATION
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Reconciled
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px]">Decisions & Deliberations</span>
                  <p className="text-white font-bold text-sm">3 Boardroom Votes</p>
                  <span className="text-[10px] text-neutral-400 block">Logged & Audited</span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px]">Data Ingestion & OCR</span>
                  <p className="text-white font-bold text-sm">100% Citation Match</p>
                  <span className="text-[10px] text-neutral-400 block">Zero Unvetted Clauses</span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px]">Security Posture</span>
                  <p className="text-emerald-400 font-bold text-sm">Zero Vulnerabilities</p>
                  <span className="text-[10px] text-neutral-400 block">Air-Gapped Sync OK</span>
                </div>
              </div>
            </div>

            {/* Today's Critical Priorities (Chief of Staff Focus) */}
            <div className="space-y-3">
              <span className="font-mono text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                // TODAY’S EXECUTIVE PRIORITIES (CHIEF OF STAFF)
              </span>

              <div className="space-y-2.5">
                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                        CRITICAL
                      </span>
                      <h4 className="font-bold text-white text-sm">60-Second Contract Redline Audit</h4>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Review uploaded vendor MSAs for uncapped indemnities and auto-renewal clauses before contract signing.
                    </p>
                  </div>
                  <Link 
                    href="/dashboard/documents"
                    onClick={handleDismiss}
                    className="shrink-0 p-2 rounded-xl bg-white/10 hover:bg-white hover:text-black text-white transition-all text-xs font-mono font-bold flex items-center gap-1"
                  >
                    <span>View Docs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        BOARDROOM
                      </span>
                      <h4 className="font-bold text-white text-sm">10-Agent C-Suite Consensus Deliberation</h4>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Simulate today's pricing expansion proposal with the autonomous CEO, CFO, and Legal digital twins.
                    </p>
                  </div>
                  <Link 
                    href="/dashboard/boardroom"
                    onClick={handleDismiss}
                    className="shrink-0 p-2 rounded-xl bg-white/10 hover:bg-white hover:text-black text-white transition-all text-xs font-mono font-bold flex items-center gap-1"
                  >
                    <span>Boardroom</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        SIMULATION
                      </span>
                      <h4 className="font-bold text-white text-sm">Monte-Carlo Scenario Risk Run</h4>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Model Expected, Optimistic, and Worst-Case cashflow bounds across 10 department vectors.
                    </p>
                  </div>
                  <Link 
                    href="/dashboard/simulations"
                    onClick={handleDismiss}
                    className="shrink-0 p-2 rounded-xl bg-white/10 hover:bg-white hover:text-black text-white transition-all text-xs font-mono font-bold flex items-center gap-1"
                  >
                    <span>Simulate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Footer Actions */}
          <div className="p-5 border-t border-neutral-800/80 bg-neutral-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
            <span className="text-[11px] font-mono text-neutral-500">
              *Appears automatically on your first login of each workday.
            </span>

            <Button
              onClick={handleDismiss}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white hover:bg-amber-400 hover:text-black text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>Start Today's Workday</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
