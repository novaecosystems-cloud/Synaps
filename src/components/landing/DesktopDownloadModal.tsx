"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Terminal,
  ShieldCheck,
  Cpu,
  HardDrive,
  Globe,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Check
} from "lucide-react";

interface DesktopDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchWeb: () => void;
}

export default function DesktopDownloadModal({
  isOpen,
  onClose,
  onLaunchWeb,
}: DesktopDownloadModalProps) {
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<"win" | "mac" | "linux">("win");

  const buildCmd = "git clone https://github.com/novaecosystems-cloud/Synaps.git\ncd Synaps && npm install\nnpm run desktop:start";

  const handleCopy = () => {
    navigator.clipboard.writeText(buildCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl rounded-3xl bg-[#0f0f11] text-white border border-neutral-800 shadow-2xl overflow-hidden font-sans"
        >
          {/* Top Bar Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                  Download SYNAPS Sovereign OS
                </h3>
                <p className="font-mono text-xs text-neutral-400">
                  Version 2.5.0 · 2.00 GB Offline Engine · Zero Cloud Telemetry
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* 3 Core Specs */}
            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
                <div className="flex items-center gap-1 text-emerald-400 font-bold">
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>2.00 GB</span>
                </div>
                <p className="text-[10px] text-neutral-400">Self-Contained Bundle</p>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
                <div className="flex items-center gap-1 text-sky-400 font-bold">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>4 GB VRAM</span>
                </div>
                <p className="text-[10px] text-neutral-400">Layer-Streaming Active</p>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Air-Gapped</span>
                </div>
                <p className="text-[10px] text-neutral-400">Zero Data Leakage</p>
              </div>
            </div>

            {/* Platform Selector Tabs */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-1 rounded-2xl bg-neutral-900 border border-neutral-800 font-mono text-xs">
                <button
                  onClick={() => setSelectedPlatform("win")}
                  className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
                    selectedPlatform === "win"
                      ? "bg-white text-black shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Windows (.exe)
                </button>
                <button
                  onClick={() => setSelectedPlatform("mac")}
                  className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
                    selectedPlatform === "mac"
                      ? "bg-white text-black shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  macOS (.dmg)
                </button>
                <button
                  onClick={() => setSelectedPlatform("linux")}
                  className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
                    selectedPlatform === "linux"
                      ? "bg-white text-black shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Linux (.AppImage)
                </button>
              </div>

              {/* Download Action Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-neutral-900 to-black border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {selectedPlatform === "win" && "Synaps Sovereign Desktop for Windows 10/11"}
                      {selectedPlatform === "mac" && "Synaps Sovereign Desktop for macOS (Apple Silicon / Intel)"}
                      {selectedPlatform === "linux" && "Synaps Sovereign Desktop for Linux (x86_64)"}
                    </h4>
                    <p className="font-mono text-xs text-neutral-400">
                      Includes 1.2B Boardroom Core + 10 LoRA Persona Adapters
                    </p>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                    Ready
                  </span>
                </div>

                <a
                  href={`https://github.com/novaecosystems-cloud/Synaps/releases/latest`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-emerald-400 hover:text-black text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Installer on GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Quick Run via Source (Developer Terminal) */}
            <div className="p-4 rounded-2xl bg-black/60 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <div className="flex items-center gap-1.5 font-bold">
                  <Terminal className="w-3.5 h-3.5 text-neutral-300" />
                  <span>DEVELOPER 1-LINE INSTALL & RUN</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-neutral-300 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-neutral-950 text-neutral-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-neutral-900">
                {buildCmd}
              </pre>
            </div>

            {/* Cloud Web Option */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs font-mono">
                  <Globe className="w-3.5 h-3.5" />
                  <span>PREFER INSTANT ACCESS?</span>
                </div>
                <p className="text-xs text-neutral-300">
                  Use the full cloud version instantly in your browser with zero installation.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onLaunchWeb();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shrink-0"
              >
                Launch Web App
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
