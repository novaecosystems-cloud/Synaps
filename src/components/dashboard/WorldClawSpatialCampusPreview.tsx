"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Sparkles,
  RotateCcw,
  Compass,
  Cpu,
  ShieldCheck,
  Scale,
  DollarSign,
  Activity,
  Maximize2,
  Minimize2,
  Eye,
  Terminal,
  ArrowRight,
  ExternalLink,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpatialRoom {
  id: string;
  name: string;
  category: "LEGAL" | "BOARDROOM" | "FINANCE" | "SECURITY" | "LOGISTICS";
  icon: any;
  color: string;
  glowColor: string;
  gridPos: { x: number; y: number; z: number };
  assetsCount: number;
  activeAgents: string[];
  currentTask: string;
  stat: string;
  statLabel: string;
}

const SPATIAL_ROOMS: SpatialRoom[] = [
  {
    id: "room_boardroom",
    name: "The Autonomous War Room",
    category: "BOARDROOM",
    icon: Cpu,
    color: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.4)",
    gridPos: { x: 0, y: 0, z: 0 },
    assetsCount: 10,
    activeAgents: ["CEO", "CFO", "CTO", "Legal Counsel", "CRO"],
    currentTask: "Dialectic Consensus on $5.2M Vendor Contract Redlines",
    stat: "10 C-Suite Twins",
    statLabel: "Synchronous Deliberation",
  },
  {
    id: "room_legal",
    name: "Legal & Statutory Wing",
    category: "LEGAL",
    icon: Scale,
    color: "#ec4899",
    glowColor: "rgba(236, 72, 153, 0.4)",
    gridPos: { x: -140, y: 0, z: -80 },
    assetsCount: 42,
    activeAgents: ["General Counsel", "Compliance Director"],
    currentTask: "Auditing Delaware DGCL § 141 & ICA § 27 Non-Compete Clauses",
    stat: "100% Citations",
    statLabel: "Line-Level Coordinate Proof",
  },
  {
    id: "room_finance",
    name: "Financial & Capital Vault",
    category: "FINANCE",
    icon: DollarSign,
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    gridPos: { x: 140, y: 0, z: -80 },
    assetsCount: 28,
    activeAgents: ["CFO Agent", "Risk Director"],
    currentTask: "Monte Carlo 10,000 Runs Cash Runway Sensitivity",
    stat: "$4.8M Exposure",
    statLabel: "Downside Risk Cap",
  },
  {
    id: "room_security",
    name: "Zero-Trust Security Bunker",
    category: "SECURITY",
    icon: ShieldCheck,
    color: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.4)",
    gridPos: { x: 0, y: 0, z: 140 },
    assetsCount: 19,
    activeAgents: ["CISO Agent", "Infosec Auditor"],
    currentTask: "DPDP Act 2023 Consent Logs & SHA-256 Chaining",
    stat: "99.99% Uptime",
    statLabel: "Zero-Trust Integrity",
  },
];

export function WorldClawSpatialCampusPreview() {
  const [selectedRoom, setSelectedRoom] = useState<SpatialRoom>(SPATIAL_ROOMS[0]);
  const [cameraAngle, setCameraAngle] = useState({ rotateX: 60, rotateZ: -25 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [pipelineStage, setPipelineStage] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setCameraAngle((prev) => ({
        ...prev,
        rotateZ: (prev.rotateZ + 0.3) % 360,
      }));
    }, 50);
    return () => clearInterval(interval);
  }, [autoRotate]);

  const triggerWorldClawGeneration = () => {
    setIsGenerating(true);
    setPipelineStage(0);
    const stages = [1, 2, 3];
    stages.forEach((st, idx) => {
      setTimeout(() => {
        setPipelineStage(st);
        if (st === 3) setIsGenerating(false);
      }, (idx + 1) * 800);
    });
  };

  return (
    <div className="w-full h-full min-h-[600px] flex flex-col bg-[#050508] text-white rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl">
      {/* ── TOP CONTROL HEADER ──────────────────────────────────────────────── */}
      <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white tracking-wide">
                WorldClaw 3D Enterprise Campus
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Tencent Hunyuan3D Mesh
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono">
              Agentic Coarse-to-Fine 3D Institutional Memory Palace
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAutoRotate(!autoRotate)}
            className="border-white/10 bg-white/5 hover:bg-white/10 text-xs h-8"
          >
            <RotateCcw className={`w-3.5 h-3.5 mr-1.5 ${autoRotate ? "animate-spin" : ""}`} />
            {autoRotate ? "Orbiting" : "Paused"}
          </Button>

          <Button
            size="sm"
            onClick={triggerWorldClawGeneration}
            disabled={isGenerating}
            className="bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-bold text-xs h-8 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            {isGenerating ? "Synthesizing 3D..." : "Regenerate Spatial World"}
          </Button>
        </div>
      </div>

      {/* ── 3D ISOMETRIC INTERACTIVE VIEWPORT ─────────────────────────────────── */}
      <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center p-6 select-none">
        {/* Background Radial Glow & Holographic Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e1b4b_0%,#050508_70%)] opacity-40" />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* 3D Transform Container */}
        <div
          className="relative w-[500px] h-[500px] flex items-center justify-center transition-transform duration-700"
          style={{
            perspective: "1200px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          <motion.div
            animate={{
              rotateX: cameraAngle.rotateX,
              rotateZ: cameraAngle.rotateZ,
            }}
            transition={{ type: "tween", ease: "linear", duration: 0.1 }}
            className="relative w-full h-full flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Base Holographic Terrain Platform */}
            <div
              className="absolute w-[440px] h-[440px] rounded-3xl border-2 border-indigo-500/30 bg-indigo-950/20 backdrop-blur-sm shadow-[0_0_50px_rgba(79,70,229,0.2)]"
              style={{ transform: "translateZ(-30px)" }}
            >
              {/* Radiating concentric pulse rings */}
              <div className="absolute inset-8 rounded-2xl border border-indigo-400/20" />
              <div className="absolute inset-20 rounded-full border border-indigo-400/30" />
              <div className="absolute inset-36 rounded-full border border-amber-400/40 animate-pulse" />
            </div>

            {/* Connecting Energy Vectors (Lines between central Boardroom and wings) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ transform: "translateZ(-10px)" }}
            >
              <line x1="250" y1="250" x2="110" y2="170" stroke="rgba(236,72,153,0.4)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="250" y1="250" x2="390" y2="170" stroke="rgba(16,185,129,0.4)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="250" y1="250" x2="250" y2="390" stroke="rgba(59,130,246,0.4)" strokeWidth="2" strokeDasharray="4 4" />
            </svg>

            {/* Spatial Rooms / Wings */}
            {SPATIAL_ROOMS.map((room) => {
              const isSelected = selectedRoom.id === room.id;
              const Icon = room.icon;

              return (
                <motion.div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  whileHover={{ scale: 1.15 }}
                  className="absolute cursor-pointer flex flex-col items-center justify-center group"
                  style={{
                    transform: `translateX(${room.gridPos.x}px) translateY(${room.gridPos.z}px) translateZ(${isSelected ? "45px" : "15px"})`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Holographic Pillar / Pedestal */}
                  <div
                    className="w-24 h-24 rounded-2xl border flex flex-col items-center justify-center p-2 text-center transition-all duration-300 backdrop-blur-md"
                    style={{
                      backgroundColor: isSelected ? `${room.color}25` : "rgba(18,18,24,0.8)",
                      borderColor: isSelected ? room.color : "rgba(255,255,255,0.15)",
                      boxShadow: isSelected ? `0 0 30px ${room.glowColor}` : "0 8px 16px rgba(0,0,0,0.5)",
                    }}
                  >
                    <Icon
                      className="w-7 h-7 mb-1 transition-transform group-hover:scale-110"
                      style={{ color: room.color }}
                    />
                    <span className="text-[10px] font-bold tracking-tight text-white leading-tight">
                      {room.name.split(" ")[1] || room.name}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400 mt-0.5">
                      {room.assetsCount} docs
                    </span>
                  </div>

                  {/* Vertical Elevation Laser Beam */}
                  {isSelected && (
                    <div
                      className="w-1 h-12 absolute -top-12 rounded-full animate-pulse"
                      style={{
                        background: `linear-gradient(to top, ${room.color}, transparent)`,
                        boxShadow: `0 0 10px ${room.color}`,
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* ── 4-STAGE WORLDCLAW PIPELINE STATUS STRIP ─────────────────────────── */}
        <div className="absolute bottom-4 left-6 right-6 z-20 flex flex-wrap items-center justify-between p-3 rounded-2xl bg-[#121218]/90 border border-white/10 backdrop-blur-xl font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-neutral-400 font-bold uppercase text-[11px]">
              WorldClaw Pipeline:
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px]">
            {[
              "01. Macro Terrain",
              "02. Regional Layout",
              "03. 3D Mesh Splats",
              "04. Memory Grounding",
            ].map((step, idx) => (
              <span
                key={idx}
                className={`px-2 py-1 rounded-md transition-all ${
                  pipelineStage >= idx
                    ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40"
                    : "text-neutral-500 bg-white/5 border border-white/5"
                }`}
              >
                ✓ {step}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM SELECTED ROOM INSPECTION DRAWER ───────────────────────────── */}
      <div className="p-6 bg-[#0a0a0f] border-t border-white/10 z-20 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left Column: Room Overview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase"
              style={{
                backgroundColor: `${selectedRoom.color}20`,
                color: selectedRoom.color,
                border: `1px solid ${selectedRoom.color}40`,
              }}
            >
              {selectedRoom.category} REGION
            </span>
            <span className="text-xs font-mono text-neutral-400">
              {selectedRoom.assetsCount} Ingested Assets
            </span>
          </div>

          <h4 className="font-bold text-lg text-white">{selectedRoom.name}</h4>
          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            {selectedRoom.currentTask}
          </p>
        </div>

        {/* Middle Column: Active Agents in Room */}
        <div className="space-y-1.5 font-mono text-xs">
          <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-bold">
            Active Digital Twins In Spatial Zone:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedRoom.activeAgents.map((agent, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 text-[11px] flex items-center gap-1"
              >
                <Bot className="w-3 h-3 text-amber-400" />
                {agent}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Primary Stat & Direct Teleport Action */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono text-neutral-400 uppercase">
              {selectedRoom.statLabel}
            </div>
            <div className="text-xl font-bold text-white" style={{ color: selectedRoom.color }}>
              {selectedRoom.stat}
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => {
              window.location.href = selectedRoom.category === "BOARDROOM" ? "/dashboard/boardroom" : "/dashboard/documents";
            }}
            className="bg-white text-black hover:bg-neutral-200 font-mono font-bold text-xs h-9"
          >
            <span>Enter Room</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
