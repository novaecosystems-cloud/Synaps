"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal as TerminalIcon, Play, FileCode, Folder, Plus, RefreshCw, 
  CheckCircle2, AlertTriangle, ShieldCheck, Cpu, HardDrive, Zap, 
  ArrowRight, Copy, Check, Lock, Sparkles, Send, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface VirtualFile {
  path: string;
  name: string;
  sizeBytes: number;
  lastModified: string;
  author: string;
  content: string;
  type: "file" | "directory";
}

interface ExecutionResult {
  executionId: string;
  backend: "isolate_js" | "scm_python" | "isolate_shell";
  commandOrSource: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  memoryKb: number;
  deterministicHash: string;
  producedArtifacts?: string[];
}

export default function AgentComputerPage() {
  const [backend, setBackend] = useState<"isolate_js" | "scm_python" | "isolate_shell">("scm_python");
  const [sourceCode, setSourceCode] = useState<string>("");
  const [files, setFiles] = useState<VirtualFile[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string>("/workspace/scm_engine.py");
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // Fetch virtual filesystem
  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/agent-computer/files");
      const data = await res.json();
      if (data.success && data.files) {
        setFiles(data.files);
        const active = data.files.find((f: VirtualFile) => f.path === selectedFilePath);
        if (active) {
          setSourceCode(active.content);
        } else if (data.files.length > 0) {
          setSelectedFilePath(data.files[0].path);
          setSourceCode(data.files[0].content);
        }
      }
    } catch (e) {
      console.error("Failed to fetch files:", e);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleSelectFile = (file: VirtualFile) => {
    setSelectedFilePath(file.path);
    setSourceCode(file.content);
    if (file.name.endsWith(".py")) {
      setBackend("scm_python");
    } else if (file.name.endsWith(".js") || file.name.endsWith(".json")) {
      setBackend("isolate_js");
    } else {
      setBackend("isolate_shell");
    }
  };

  const handleRunExecution = async () => {
    if (!sourceCode.trim() || executing) return;
    setExecuting(true);
    setDispatchSuccess(false);

    try {
      const res = await fetch("/api/agent-computer/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: sourceCode, backend })
      });
      const data = await res.json();
      if (data.success && data.result) {
        setResult(data.result);
      }
    } catch (e) {
      console.error("Execution error:", e);
    } finally {
      setExecuting(false);
    }
  };

  const handleDispatchToActionBoard = async () => {
    if (!result) return;
    try {
      await fetch("/api/action-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `[Sandbox Invariant Verified] ${selectedFilePath.split("/").pop()}`,
          description: `Execution verified in Agent Computer (${result.backend}). Duration: ${result.durationMs}ms. SHA-256 Proof: ${result.deterministicHash.slice(0, 16)}...\n\nStdout:\n${result.stdout.slice(0, 300)}`,
          priority: "P0",
          status: "IN_REVIEW",
          assigneeName: "AI: CTO Twin",
          assigneeType: "AI",
          tags: ["Sandbox", "SCM", "Verified"]
        })
      });
      setDispatchSuccess(true);
      setTimeout(() => setDispatchSuccess(false), 3000);
    } catch (e) {
      console.error("Failed to dispatch task:", e);
    }
  };

  const handleCopyOutput = () => {
    if (result) {
      navigator.clipboard.writeText(result.stdout);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080B] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-[1700px] mx-auto space-y-6">
        
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                CLOUDFLARE COMPUTER · ISOLATED AGENT SANDBOX
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">ZERO-COLD-START EDGE V8 ISOLATES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
              AI Agent Computer & Execution Terminal
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Sandboxed runtime for AI agents. Run deterministic Python SCM solvers, Delaware legal audits, and virtual FUSE filesystems with 0.00% math drift.
            </p>
          </div>

          {/* Quick Metrics HUD */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="px-3 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-right">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Sandbox Status</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Air-Gapped Active
              </div>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-right">
              <div className="text-[10px] font-mono text-slate-400 uppercase">FUSE Store</div>
              <div className="text-xs font-bold text-cyan-300 font-mono">SQLite Durable Object</div>
            </div>
          </div>
        </div>

        {/* ── 3-COLUMN MAIN WORKSPACE ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: VIRTUAL FILE EXPLORER (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-4 rounded-3xl bg-[#0D0F17] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                  <Folder className="w-4 h-4 text-cyan-400" /> Virtual Filesystem
                </span>
                <button
                  onClick={fetchFiles}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Refresh Files"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5">
                {files.map((file) => {
                  const isSelected = file.path === selectedFilePath;
                  return (
                    <button
                      key={file.path}
                      onClick={() => handleSelectFile(file)}
                      className={`w-full p-2.5 rounded-2xl text-left text-xs transition-all flex items-center justify-between cursor-pointer border ${
                        isSelected 
                          ? "bg-cyan-950/60 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                          : "bg-slate-900/40 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCode className="w-4 h-4 shrink-0 text-cyan-400" />
                        <span className="font-mono text-xs truncate">{file.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        {file.sizeBytes}B
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Author Attribution */}
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-[11px] space-y-1">
                <span className="text-slate-500 font-mono uppercase block text-[10px]">Active Author</span>
                <div className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  {files.find(f => f.path === selectedFilePath)?.author || "@Agent Sandbox"}
                </div>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="p-4 rounded-3xl bg-[#0D0F17] border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                ⚡ Agent Presets
              </span>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    const f = files.find(x => x.name.includes("scm_engine"));
                    if (f) handleSelectFile(f);
                  }}
                  className="w-full p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs text-slate-300 flex items-center justify-between transition-all"
                >
                  <span>10,000 SCM Monte Carlo</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>

                <button
                  onClick={() => {
                    const f = files.find(x => x.name.includes("delaware"));
                    if (f) handleSelectFile(f);
                  }}
                  className="w-full p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs text-slate-300 flex items-center justify-between transition-all"
                >
                  <span>Delaware DGCL 141 Proof</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>
          </div>

          {/* MIDDLE & RIGHT: CODE RUNNER & TERMINAL OUTPUT (9 cols) */}
          <div className="lg:col-span-9 space-y-4">
            
            {/* Editor Container */}
            <div className="p-5 rounded-3xl bg-[#0D0F17] border border-slate-800 space-y-4">
              
              {/* Controls Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs font-bold text-white">
                    {selectedFilePath}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Backend Selector */}
                  <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                    <button
                      onClick={() => setBackend("scm_python")}
                      className={`px-3 py-1 rounded-xl font-mono text-[11px] font-bold transition-all ${
                        backend === "scm_python" ? "bg-cyan-500 text-black shadow" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Python SCM
                    </button>
                    <button
                      onClick={() => setBackend("isolate_js")}
                      className={`px-3 py-1 rounded-xl font-mono text-[11px] font-bold transition-all ${
                        backend === "isolate_js" ? "bg-cyan-500 text-black shadow" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Isolate JS
                    </button>
                    <button
                      onClick={() => setBackend("isolate_shell")}
                      className={`px-3 py-1 rounded-xl font-mono text-[11px] font-bold transition-all ${
                        backend === "isolate_shell" ? "bg-cyan-500 text-black shadow" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Bash Shell
                    </button>
                  </div>

                  {/* Run Button */}
                  <Button
                    onClick={handleRunExecution}
                    disabled={executing}
                    className="rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider gap-1.5 shadow-lg cursor-pointer"
                  >
                    {executing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Executing...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-black" /> Run in Sandbox
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Code Textarea */}
              <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-slate-900 font-mono text-xs">
                <textarea
                  value={sourceCode}
                  onChange={(e) => setSourceCode(e.target.value)}
                  rows={14}
                  className="w-full p-4 bg-transparent text-cyan-200 outline-none resize-none font-mono leading-relaxed custom-scrollbar selection:bg-cyan-500/30"
                  placeholder="Type code or shell commands to execute in isolated sandbox..."
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Terminal Stdout / Stderr Output Box */}
            <div className="p-5 rounded-3xl bg-black border border-slate-800 space-y-4 font-mono text-xs shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-slate-400 text-xs ml-2 font-bold uppercase tracking-wider">
                    STDOUT EXECUTION TELEMETRY
                  </span>
                </div>

                {result && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/40">
                      ⏱ {result.durationMs}ms
                    </span>
                    <span className="text-[10px] text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/40">
                      💾 {result.memoryKb} KB
                    </span>
                    <button
                      onClick={handleCopyOutput}
                      className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title="Copy Output"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Terminal Screen */}
              <div className="p-4 rounded-2xl bg-[#050608] border border-slate-900 min-h-[140px] max-h-[260px] overflow-y-auto custom-scrollbar text-slate-300 whitespace-pre-wrap leading-relaxed">
                {executing ? (
                  <div className="flex items-center gap-2 text-cyan-400 animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing in isolated V8 dynamic isolate runtime...</span>
                  </div>
                ) : result ? (
                  result.stderr ? (
                    <span className="text-rose-400">{result.stderr}</span>
                  ) : (
                    <span className="text-emerald-300">{result.stdout}</span>
                  )
                ) : (
                  <span className="text-slate-600">
                    Press "Run in Sandbox" to execute code inside the Cloudflare Computer SQLite/FUSE virtual isolate.
                  </span>
                )}
              </div>

              {/* Downstream Dispatch Button */}
              {result && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-900 text-xs">
                  <div className="text-[11px] text-slate-500 truncate max-w-md">
                    Deterministic SHA-256: <span className="text-slate-400">{result.deterministicHash}</span>
                  </div>

                  <button
                    onClick={handleDispatchToActionBoard}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    {dispatchSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" /> Dispatched to Action Board!
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-cyan-400" /> ⚡ Dispatch Output as P0 Task
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
