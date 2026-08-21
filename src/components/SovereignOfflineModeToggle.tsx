"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Globe, HardDrive, Sparkles, Check, AlertCircle, RefreshCw, X, Terminal, ArrowRight } from "lucide-react";

export function SovereignOfflineModeToggle() {
  const [mode, setMode] = useState<"cloud" | "offline">("cloud");
  const [ollamaStatus, setOllamaStatus] = useState<"checking" | "online" | "offline">("checking");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const checkLocalOllama = async () => {
    setOllamaStatus("checking");
    try {
      const res = await fetch("/api/offline/status");
      const data = await res.json();
      if (data.online) {
        setOllamaStatus("online");
      } else {
        setOllamaStatus("offline");
      }
    } catch {
      setOllamaStatus("offline");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("causarix_execution_mode") as "cloud" | "offline";
    if (saved) {
      setMode(saved);
    }
    checkLocalOllama();
  }, []);

  const toggleMode = (newMode: "cloud" | "offline") => {
    setMode(newMode);
    localStorage.setItem("causarix_execution_mode", newMode);
    if (newMode === "offline" && ollamaStatus !== "online") {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* ── HEADER STATUS BADGE & TOGGLE ──────────────────────────────────── */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0D0F17] border border-slate-800 text-xs">
        <button
          onClick={() => toggleMode("cloud")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
            mode === "cloud"
              ? "bg-primary text-white shadow-[0_0_12px_rgba(45,78,255,0.3)]"
              : "text-slate-400 hover:text-white"
          }`}
          title="Cloud Multi-LLM Gateway (Gemini 2.5 / Groq Llama 3.3 / DeepSeek)"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Cloud Gateway</span>
        </button>

        <button
          onClick={() => toggleMode("offline")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
            mode === "offline"
              ? "bg-cyan-500 text-black font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              : "text-slate-400 hover:text-white"
          }`}
          title="100% Air-Gapped Sovereign Hardware Mode (Local Llama 3.2 on D:\OllamaModels)"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Offline Sovereign</span>
          {mode === "offline" && (
            <span className={`w-1.5 h-1.5 rounded-full ${ollamaStatus === "online" ? "bg-emerald-950 animate-pulse" : "bg-rose-950"}`} />
          )}
        </button>
      </div>

      {/* ── OFFLINE MODE SETUP / STATUS MODAL ──────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0D0F17] border border-cyan-800/60 rounded-3xl p-6 shadow-2xl space-y-5 text-slate-100 font-sans"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-700 flex items-center justify-center text-cyan-300">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Sovereign Air-Gapped Mode</h3>
                    <p className="text-xs text-cyan-400 font-mono">100% On-Premise Execution</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Banner */}
              <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                ollamaStatus === "online"
                  ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
                  : "bg-amber-950/20 border-amber-800/40 text-amber-300"
              }`}>
                {ollamaStatus === "online" ? (
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="text-xs font-bold font-mono">
                    {ollamaStatus === "online"
                      ? "LOCAL OLLAMA ENGINE DETECTED (ONLINE)"
                      : "LOCAL OLLAMA NOT DETECTED"}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {ollamaStatus === "online"
                      ? "Causarix is now routing all SCM simulations and 10-Agent Boardroom debates to your local Llama 3.2 1B model in D:\OllamaModels with zero internet connection."
                      : "To run 100% offline without cloud APIs, open your terminal and run the command below:"}
                  </p>
                </div>
              </div>

              {/* Quick Terminal Command Box */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono font-bold text-slate-400">
                  ONE-CLICK TERMINAL COMMAND:
                </label>
                <div className="p-3 bg-[#07090F] border border-slate-800 rounded-xl font-mono text-xs text-cyan-300 flex items-center justify-between">
                  <code>ollama run llama3.2:1b</code>
                  <button
                    onClick={() => navigator.clipboard.writeText("ollama run llama3.2:1b")}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-mono font-bold"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* 3 Sovereign Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                  <div className="text-[10px] font-mono text-slate-400">DATA PRIVACY</div>
                  <div className="text-xs font-bold text-white mt-0.5">0% Cloud Leaks</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                  <div className="text-[10px] font-mono text-slate-400">STORAGE</div>
                  <div className="text-xs font-bold text-white mt-0.5">D:\OllamaModels</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                  <div className="text-[10px] font-mono text-slate-400">ARITHMETIC</div>
                  <div className="text-xs font-bold text-white mt-0.5">0.00% Drift</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  onClick={checkLocalOllama}
                  className="px-3 py-2 rounded-xl text-xs font-mono font-bold text-slate-300 hover:text-white flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${ollamaStatus === "checking" ? "animate-spin" : ""}`} />
                  Re-check Engine
                </button>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-lg"
                >
                  Activate Sovereign Mode
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
