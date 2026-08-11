'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import SignInModal from '@/components/SignInModal';

export default function FramerSynapsLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative w-full h-screen bg-[#0c0c0e] text-white overflow-hidden flex flex-col antialiased">
      {/* ── TOP ACTION BAR OVERLAY ────────────────────────────────────────────── */}
      <header className="fixed top-4 right-6 z-50 flex items-center gap-3">
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-full backdrop-blur-md bg-black/70 hover:bg-black/90 border border-white/20 text-neutral-200 hover:text-white font-mono text-xs font-semibold tracking-wider transition-all flex items-center gap-1.5 shadow-2xl"
        >
          <span>Dashboard</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
        </Link>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(255,122,0,0.4)] transition-all transform hover:scale-105"
        >
          Sign In
        </button>
      </header>

      {/* ── DIRECT FRAMER EMBED CANVAS ─────────────────────────────────────── */}
      <iframe
        src="https://consistent-board-994542.framer.app/"
        className="w-full h-full border-0 flex-1 relative z-10"
        title="SYNAPS — Enterprise Intelligence Layer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />

      {/* Sign In Modal */}
      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
