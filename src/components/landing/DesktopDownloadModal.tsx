"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  ShieldCheck,
  Cpu,
  HardDrive,
  Globe,
  ArrowUpRight,
  CheckCircle2
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
  const [selectedPlatform, setSelectedPlatform] = useState<"win" | "mac" | "linux">("win");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl rounded-3xl bg-[#0f0f11] text-white border border-neutral-800 shadow-2xl overflow-hidden font-sans"
        >
          {/* Top Bar Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                  Download SYNAPS Desktop
                </h3>
                <p className="font-mono text-xs text-neutral-400">
                  Version 2.5.0 · 1-Click Standalone Installer (.exe)
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
                  <span>155 MB</span>
                </div>
                <p className="text-[10px] text-neutral-400">Fast 1-Click Setup</p>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
                <div className="flex items-center gap-1 text-sky-400 font-bold">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Zero CMD</span>
                </div>
                <p className="text-[10px] text-neutral-400">Direct .exe Installer</p>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Air-Gapped</span>
                </div>
                <p className="text-[10px] text-neutral-400">Offline Guardian</p>
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
              <div className="p-6 rounded-2xl bg-gradient-to-b from-neutral-900 to-black border border-neutral-800 space-y-5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-base">
                      {selectedPlatform === "win" && "Synaps Setup for Windows (.exe)"}
                      {selectedPlatform === "mac" && "Synaps Desktop for macOS (.dmg)"}
                      {selectedPlatform === "linux" && "Synaps Desktop for Linux (.AppImage)"}
                    </h4>
                    <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                      Standalone Installer
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Just double-click to install on your system. No command prompt, Git, or terminal setup required.
                  </p>
                </div>

                <a
                  href={
                    selectedPlatform === "win"
                      ? "https://github.com/novaecosystems-cloud/Synaps/releases/download/v2.5.0/Synaps-Setup-0.1.0.exe"
                      : "https://github.com/novaecosystems-cloud/Synaps/releases/tag/v2.5.0"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl bg-white hover:bg-emerald-400 hover:text-black text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl group"
                >
                  <Download className="w-4 h-4 text-emerald-600 group-hover:text-black" />
                  <span>
                    {selectedPlatform === "win" && "Download Synaps-Setup.exe"}
                    {selectedPlatform === "mac" && "Download Synaps.dmg"}
                    {selectedPlatform === "linux" && "Download Synaps.AppImage"}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-neutral-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Auto-Desktop Shortcut
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Offline Failover Built-In
                  </span>
                </div>
              </div>
            </div>

            {/* Cloud Web Option */}
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-white font-bold text-xs font-mono">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PREFER BROWSER ACCESS?</span>
                </div>
                <p className="text-xs text-neutral-400">
                  Run the full C-suite suite instantly in your browser with zero installation.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onLaunchWeb();
                }}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-white hover:text-black text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shrink-0 border border-neutral-700"
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
