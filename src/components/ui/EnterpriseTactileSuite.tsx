"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from 'framer-motion';
import { UploadCloud, FileText, Check, Play, Pause, ShieldAlert, Printer } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// 1. TACTILE 3D PHYSICAL BUTTON (Compressible Depth & Highlight Edge)
// ─────────────────────────────────────────────────────────────────────────────
interface TactileButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "amber" | "rose" | "dark";
  className?: string;
  disabled?: boolean;
}

export function TactileButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
}: TactileButtonProps) {
  const themes = {
    primary: {
      face: "#4f46e5",
      highlight: "#6366f1",
      base: "#312e81",
      baseShadow: "#1e1b4b",
      text: "#ffffff",
    },
    amber: {
      face: "#d97706",
      highlight: "#f59e0b",
      base: "#92400e",
      baseShadow: "#451a03",
      text: "#ffffff",
    },
    rose: {
      face: "#e11d48",
      highlight: "#f43f5e",
      base: "#9f1239",
      baseShadow: "#4c0519",
      text: "#ffffff",
    },
    dark: {
      face: "#27272a",
      highlight: "#3f3f46",
      base: "#18181b",
      baseShadow: "#09090b",
      text: "#f4f4f5",
    },
  };

  const t = themes[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group/tactile relative inline-block cursor-pointer select-none font-sans font-bold text-xs ${className}`}
      style={{
        ["--t-face" as any]: t.face,
        ["--t-highlight" as any]: t.highlight,
        ["--t-base" as any]: t.base,
        ["--t-shadow" as any]: t.baseShadow,
        ["--t-text" as any]: t.text,
      }}
    >
      {/* 3D Base Foundation */}
      <span className="absolute inset-x-0 top-[6px] h-10 rounded-xl bg-[var(--t-base)] shadow-[inset_0_-2px_0_var(--t-shadow),0_6px_12px_rgba(0,0,0,0.4)]" />

      {/* Compressible Surface Face */}
      <span className="relative flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--t-face)] px-5 text-[var(--t-text)] shadow-[inset_0_1.5px_0_var(--t-highlight)] transition-transform duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] group-hover/tactile:translate-y-0.5 group-active/tactile:translate-y-[5px]">
        {children}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. ENCRYPTED TEXT SCRAMBLER (Decryption Matrix Animation)
// ─────────────────────────────────────────────────────────────────────────────
interface ScrambleTextProps {
  text: string;
  duration?: number;
  className?: string;
  onTrigger?: boolean;
}

const GLYPHS = "~<@>^=:][#@!$%&*+-_/{}0123456789";

export function ScrambleText({
  text,
  duration = 800,
  className = "",
  onTrigger = false,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);
    const length = text.length;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      const revealedCount = Math.floor(progress * length);

      let scrambled = "";
      for (let i = 0; i < length; i++) {
        if (i < revealedCount || text[i] === " " || text[i] === "/" || text[i] === "-") {
          scrambled += text[i];
        } else {
          scrambled += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }

      setDisplayText(scrambled);

      if (progress >= 1) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, 40);
  };

  useEffect(() => {
    scramble();
  }, [text, onTrigger]);

  return (
    <span
      onMouseEnter={scramble}
      className={`font-mono inline-flex items-center cursor-default tracking-wide select-none ${className}`}
    >
      {displayText}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PHYSICAL SERRATED THERMAL RECEIPT PRINTER
// ─────────────────────────────────────────────────────────────────────────────
interface ThermalReceiptProps {
  title?: string;
  orderId?: string;
  items?: { name: string; cost: string; note?: string }[];
  total?: string;
  statusText?: string;
  onPrint?: () => void;
}

export function ThermalReceipt({
  title = "M&A LIABILITY AUDIT REPORT",
  orderId = "SYN-2026-9042",
  items = [
    { name: "Delaware DGCL § 141 Redline", cost: "$0.00", note: "100% Citation Grounded" },
    { name: "Uncapped Indemnity Waiver", cost: "$4.2M Risk", note: "Flagged by General Counsel" },
    { name: "Monte Carlo 10k Run Margin", cost: "98.4%", note: "Confidence Score" },
  ],
  total = "$0.00 (VERIFIED)",
  statusText = "EXECUTIVE LEDGER SYNCHRONIZED",
}: ThermalReceiptProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-sm mx-auto group cursor-pointer pt-6 pb-2"
    >
      {/* Extruded Metallic Receipt Slot */}
      <div className="relative z-20 h-3 w-full rounded-full bg-gradient-to-b from-neutral-800 to-neutral-950 border border-neutral-700/60 shadow-[0_4px_10px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.2)]">
        <div className="mx-auto h-1 w-3/4 rounded-full bg-black shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />
      </div>

      {/* Physical Textured Paper Feeding out of Slot */}
      <motion.article
        initial={{ y: 0 }}
        animate={{ y: isHovered ? 12 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative z-10 mx-3 bg-[#faf9f5] text-neutral-900 font-mono p-5 rounded-t-sm shadow-2xl border-x border-neutral-300 select-none"
        style={{
          clipPath:
            "polygon(0 0, 100% 0, 100% calc(100% - 8px), 97% 100%, 94% calc(100% - 8px), 91% 100%, 88% calc(100% - 8px), 85% 100%, 82% calc(100% - 8px), 79% 100%, 76% calc(100% - 8px), 73% 100%, 70% calc(100% - 8px), 67% 100%, 64% calc(100% - 8px), 61% 100%, 58% calc(100% - 8px), 55% 100%, 52% calc(100% - 8px), 49% 100%, 46% calc(100% - 8px), 43% 100%, 40% calc(100% - 8px), 37% 100%, 34% calc(100% - 8px), 31% 100%, 28% calc(100% - 8px), 25% 100%, 22% calc(100% - 8px), 19% 100%, 16% calc(100% - 8px), 13% 100%, 10% calc(100% - 8px), 7% 100%, 4% calc(100% - 8px), 0 calc(100% - 8px))",
        }}
      >
        {/* Receipt Header */}
        <div className="text-center space-y-1 pb-3 border-b border-dashed border-neutral-400">
          <div className="flex items-center justify-center gap-1.5 font-bold text-xs tracking-wider uppercase">
            <Printer className="w-3.5 h-3.5 text-neutral-700" />
            SYNAPS PROOF OF REASONING
          </div>
          <p className="text-[10px] text-neutral-500">{orderId}</p>
        </div>

        {/* Audit Line Items */}
        <div className="py-3 space-y-2 text-xs">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start text-[11px] leading-tight">
              <div>
                <p className="font-bold text-neutral-800">{item.name}</p>
                {item.note && <p className="text-[9px] text-neutral-500">{item.note}</p>}
              </div>
              <span className="font-bold font-mono text-neutral-900 shrink-0">{item.cost}</span>
            </div>
          ))}
        </div>

        {/* Total Summary */}
        <div className="pt-2 pb-1 border-t border-dashed border-neutral-400 flex justify-between items-center font-bold text-xs">
          <span className="uppercase tracking-wider text-[10px]">TOTAL DISPOSITION</span>
          <span className="text-sm text-emerald-700 font-mono">{total}</span>
        </div>

        {/* Barcode Strip */}
        <div className="mt-3 pt-2 text-center space-y-1">
          <div className="mx-auto h-6 w-3/4 bg-[repeating-linear-gradient(90deg,#171717_0px,#171717_1.5px,transparent_1.5px,transparent_3.5px,#171717_3.5px,#171717_5px,transparent_5px,transparent_6px)] opacity-90" />
          <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">
            {statusText}
          </p>
        </div>
      </motion.article>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HOLD TO CONFIRM BUTTON (Timed Guard for High-Stakes Actions)
// ─────────────────────────────────────────────────────────────────────────────
interface HoldToConfirmButtonProps {
  label?: string;
  confirmedLabel?: string;
  onConfirm: () => void;
  holdDurationMs?: number;
  className?: string;
}

export function HoldToConfirmButton({
  label = "Hold to Execute M&A Override",
  confirmedLabel = "Override Executed!",
  onConfirm,
  holdDurationMs = 1200,
  className = "",
}: HoldToConfirmButtonProps) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startHold = () => {
    if (isConfirmed) return;
    setIsHolding(true);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / holdDurationMs) * 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timerRef.current!);
        setIsConfirmed(true);
        setIsHolding(false);
        onConfirm();
        setTimeout(() => {
          setIsConfirmed(false);
          setProgress(0);
        }, 3000);
      }
    }, 20);
  };

  const stopHold = () => {
    if (isConfirmed) return;
    setIsHolding(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(0);
  };

  return (
    <div
      onMouseDown={startHold}
      onMouseUp={stopHold}
      onMouseLeave={stopHold}
      onTouchStart={startHold}
      onTouchEnd={stopHold}
      className={`relative isolate flex h-10 min-w-56 cursor-pointer select-none items-center justify-center overflow-hidden rounded-xl border border-rose-500/40 bg-rose-950/40 px-4 font-sans font-bold text-xs text-rose-300 transition-all active:scale-[0.98] ${className}`}
    >
      {/* Background Fill Fill-up Layer */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-700 transition-[width] ease-linear"
        style={{ width: `${progress}%` }}
      />

      {/* Label Content */}
      <span className="relative z-10 flex items-center gap-2 text-white">
        {isConfirmed ? (
          <>
            <Check className="w-4 h-4 text-white animate-bounce" />
            <span>{confirmedLabel}</span>
          </>
        ) : (
          <>
            <ShieldAlert className={`w-4 h-4 ${isHolding ? "animate-pulse text-white" : "text-rose-400"}`} />
            <span>{isHolding ? `Holding (${Math.round(progress)}%)...` : label}</span>
          </>
        )}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MAGNETIC FILE DROP ZONE (Interactive Ingestion Target)
// ─────────────────────────────────────────────────────────────────────────────
interface MagneticDropZoneProps {
  onFileDrop?: (file: File) => void;
  title?: string;
  subhead?: string;
}

export function MagneticDropZone({
  onFileDrop,
  title = "Drop Corporate Contract for 1-Shot OCR",
  subhead = "Supports PDF, DOCX, Scans (Auto Line-Level SHA-256 Indexing)",
}: MagneticDropZoneProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex h-36 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-700 bg-neutral-950/60 p-6 text-center transition-all duration-300 group hover:border-indigo-500 hover:bg-indigo-950/20 cursor-pointer overflow-hidden"
    >
      {/* Floating Simulated File Tag that Pulls Magnetically on Hover */}
      <motion.div
        animate={{
          x: isHovered ? 0 : 40,
          y: isHovered ? -10 : -35,
          rotate: isHovered ? -3 : 8,
          scale: isHovered ? 1.05 : 0.95,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="absolute top-4 right-8 z-10 flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-neutral-900/90 px-2.5 py-1.5 shadow-lg backdrop-blur-md"
      >
        <div className="flex size-5 items-center justify-center rounded bg-indigo-600/30 text-indigo-400">
          <FileText className="w-3 h-3" />
        </div>
        <span className="text-[10px] font-mono font-bold text-neutral-300">
          merger_agreement_v3.pdf
        </span>
      </motion.div>

      {/* Main Target Surface */}
      <motion.div
        animate={{ scale: isHovered ? 1.03 : 1 }}
        className="flex flex-col items-center justify-center space-y-1.5"
      >
        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
          <UploadCloud className="w-5 h-5" />
        </div>
        <h4 className="font-bold text-xs text-white tracking-wide">{title}</h4>
        <p className="text-[10px] text-neutral-400 font-mono max-w-sm">{subhead}</p>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. RETRO CASSETTE AUDIO BRIEFING PLAYER
// ─────────────────────────────────────────────────────────────────────────────
interface CassettePlayerProps {
  title?: string;
  trackTime?: string;
  duration?: string;
}

export function CassetteAudioPlayer({
  title = "CEO Morning Executive Briefing · Side A",
  trackTime = "01:24",
  duration = "04:30",
}: CassettePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative w-full max-w-md mx-auto p-4 rounded-3xl bg-[#121216] border border-neutral-800 shadow-2xl space-y-4">
      {/* Cassette Skeuomorphic Body */}
      <div className="relative aspect-[1.6] w-full rounded-2xl border border-neutral-950 bg-gradient-to-br from-[#2a2a2e] via-[#1c1c1f] to-[#121214] p-3 shadow-inner overflow-hidden select-none">
        {/* Cassette Label Header */}
        <div className="rounded-lg bg-gradient-to-r from-amber-600 to-rose-600 p-2 text-white flex justify-between items-center shadow-md">
          <div className="min-w-0">
            <span className="text-[8px] font-mono uppercase font-bold tracking-widest opacity-80">
              SYNAPS AUDIO TAPE 01
            </span>
            <h5 className="font-bold text-xs truncate leading-tight">{title}</h5>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-black/40 text-[9px] font-mono font-bold">
            SIDE A
          </span>
        </div>

        {/* Center Transparent Tape Window with Dual Rotating Spools */}
        <div className="my-2.5 mx-auto h-16 w-3/4 rounded-full border border-neutral-900 bg-[#0c0c0e] p-2 flex items-center justify-between shadow-inner relative">
          {/* Connecting Tape Strip */}
          <div className="absolute inset-x-8 top-1/2 h-1 -translate-y-1/2 bg-amber-900/60" />

          {/* Left Reel Spool */}
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="w-10 h-10 rounded-full border-2 border-neutral-700 bg-neutral-900 flex items-center justify-center relative z-10"
          >
            <div className="w-3 h-3 rounded-full bg-white/20" />
            <div className="absolute inset-1 border border-dashed border-neutral-600 rounded-full" />
          </motion.div>

          {/* Center Time Counter Display */}
          <div className="z-10 font-mono text-[10px] font-bold text-amber-400 bg-black/80 px-2 py-0.5 rounded border border-neutral-800">
            {trackTime} / {duration}
          </div>

          {/* Right Reel Spool */}
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="w-10 h-10 rounded-full border-2 border-neutral-700 bg-neutral-900 flex items-center justify-center relative z-10"
          >
            <div className="w-3 h-3 rounded-full bg-white/20" />
            <div className="absolute inset-1 border border-dashed border-neutral-600 rounded-full" />
          </motion.div>
        </div>

        {/* Tape Playback Controls */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black font-bold hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
