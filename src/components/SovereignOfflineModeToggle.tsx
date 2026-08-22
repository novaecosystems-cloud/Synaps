"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Globe, X, Lock, Cpu } from "lucide-react";

export function SovereignOfflineModeToggle() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* ── HEADER BADGE / COMING SOON PILL ───────────────────────────── */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0D0F17] border border-slate-800 text-xs">
        {/* Active Cloud Gateway */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold bg-primary text-white shadow-[0_0_12px_rgba(45,78,255,0.3)]"
          title="Cloud Multi-LLM Gateway (Gemini 2.5 / Groq Llama 3.3 / DeepSeek)"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Cloud Gateway</span>
        </div>

        {/* Sovereign Offline Mode - COMING SOON */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold text-slate-400 hover:text-cyan-300 hover:bg-slate-900/60 transition-all cursor-pointer border border-transparent hover:border-cyan-800/40"
          title="100% Air-Gapped Sovereign Hardware Mode (Coming Soon)"
        >
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sovereign Offline</span>
          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-cyan-950/80 text-cyan-400 border border-cyan-700/50">
            Coming Soon
          </span>
        </button>
      </div>

      {/* ── COMING SOON PREVIEW MODAL ────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0D0F17] border border-cyan-800/50 rounded-3xl p-6 shadow-2xl space-y-5 text-slate-100 font-sans"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-600/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      Sovereign Offline OS
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                        Coming Soon
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">100% Air-Gapped Bare Metal Engine</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-3 text-xs text-slate-300">
                <p className="leading-relaxed">
                  We are currently packaging the standalone zero-dependency installer for <strong>Causarix Sovereign Offline OS</strong>. When released, you will be able to run complete SCM simulations, 10-Agent Boardroom debates, and SCM do-calculus entirely on local hardware with zero internet access.
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white text-[11px]">Strict Zero Data Egress</div>
                      <div className="text-[11px] text-slate-400">Air-gapped execution for defense, healthcare, and quantitative finance.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <Cpu className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white text-[11px]">Local Quantized Neural Weights</div>
                      <div className="text-[11px] text-slate-400">Ultra-fast inference directly on consumer laptops with 0.00% math drift.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/80 text-white font-bold text-xs cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SovereignOfflineModeToggle;
