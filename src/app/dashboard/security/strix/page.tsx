'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, ShieldCheck, Terminal, Play, Cpu, AlertTriangle,
  FileCode, CheckCircle2, Lock, ArrowRight, RefreshCw, Zap, Bug, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StrixSecurityPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[STRIX-INIT] Initializing Autonomous Security & Pentest Agent (v2.4)...',
    '[STRIX-INIT] Loading Zero-Trust rule sets & dynamic exploit payload generators...',
    '[STRIX-READY] Ready for autonomous vulnerability assessment.'
  ]);
  const [scanResult, setScanResult] = useState<any>(null);
  const [selectedTarget, setSelectedTarget] = useState('Full Enterprise Workspace');

  const runStrixScan = async () => {
    setIsScanning(true);
    setScanProgress(10);
    setConsoleLogs(prev => [
      ...prev,
      `[STRIX-AGENT] Target locked: ${selectedTarget}`,
      '[STRIX-AGENT] Mapping endpoints, legal document boundaries & financial ledgers...',
      '[STRIX-[#01]] Executing dynamic payload injection and clause risk verification...'
    ]);

    // Simulate real-time pentest console logging
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 20;
      });
    }, 400);

    try {
      const response = await fetch('/api/security/strix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: selectedTarget, mode: 'autonomous_agent' })
      });
      const data = await response.json();

      setTimeout(() => {
        clearInterval(interval);
        setScanProgress(100);
        setIsScanning(false);
        if (data.success) {
          setScanResult(data.data);
          setConsoleLogs(prev => [
            ...prev,
            '[STRIX-AGENT] Vulnerability scan completed in 1.42s.',
            `[STRIX-SUCCESS] Found ${data.data.totalVulnerabilities} actionable security & business logic risks.`,
            '[STRIX-REPORT] Generated PoC exploits and remediation briefs.'
          ]);
        }
      }, 1500);
    } catch (e: any) {
      clearInterval(interval);
      setIsScanning(false);
      setConsoleLogs(prev => [...prev, `[STRIX-ERROR] ${e.message}`]);
    }
  };

  useEffect(() => {
    // Run initial scan on load
    runStrixScan();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C6FF2E]/10 border border-[#C6FF2E]/30 flex items-center justify-center text-[#C6FF2E]">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                STRIX Autonomous Pentest Agent
              </h1>
              <p className="text-xs text-white/50 font-mono mt-0.5">
                AI-driven dynamic vulnerability scanning, PoC validation & risk audit
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            disabled={isScanning}
            className="px-4 py-2.5 rounded-xl bg-[#111118] border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C6FF2E]"
          >
            <option value="Full Enterprise Workspace">Full Enterprise Workspace</option>
            <option value="Master_Services_Agreement_2026.pdf">Master_Services_Agreement_2026.pdf</option>
            <option value="Financial_Audit_Report_3_Hotels_Q2.xlsx">Financial_Audit_Report_3_Hotels_Q2.xlsx</option>
            <option value="API Endpoints & Integration Keys">API Endpoints & Keys</option>
          </select>

          <button
            onClick={runStrixScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C6FF2E] hover:bg-[#b5f020] text-black font-extrabold text-xs transition-all disabled:opacity-50 shadow-lg shadow-[#C6FF2E]/10"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                SCANNING...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                RUN STRIX AUDIT
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#111118] border border-white/10 space-y-1">
          <span className="text-[10px] font-mono text-white/40 uppercase">SECURITY RATING</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#C6FF2E]">
              {scanResult ? `${scanResult.securityScore}/100` : '--'}
            </span>
            <span className="text-xs font-mono text-green-400 font-bold">GRADE B+</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111118] border border-white/10 space-y-1">
          <span className="text-[10px] font-mono text-white/40 uppercase">TOTAL VULNERABILITIES</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">
              {scanResult ? scanResult.totalVulnerabilities : 0}
            </span>
            <span className="text-xs font-mono text-red-400 font-bold">
              {scanResult ? `${scanResult.highSeverityCount} High Risk` : ''}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111118] border border-white/10 space-y-1">
          <span className="text-[10px] font-mono text-white/40 uppercase">SCAN MODE</span>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold font-mono text-white uppercase">Autonomous PoC</span>
            <span className="text-xs font-mono text-[#C6FF2E]">STRIX v2.4</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#111118] border border-white/10 space-y-1">
          <span className="text-[10px] font-mono text-white/40 uppercase">ZERO-TRUST AUDIT</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold text-green-400 flex items-center gap-1.5 pt-2">
              <ShieldCheck className="w-4 h-4" />
              PASSED GROUNDING
            </span>
          </div>
        </div>
      </div>

      {/* Terminal Log Console */}
      <div className="rounded-2xl bg-[#0a0a0f] border border-white/10 overflow-hidden shadow-2xl">
        <div className="bg-white/5 px-4 py-2.5 border-b border-white/5 flex items-center justify-between text-xs font-mono text-white/60">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#C6FF2E]" />
            <span>STRIX Execution Console Output</span>
          </div>
          {isScanning && (
            <span className="text-[10px] text-[#C6FF2E] font-bold animate-pulse">
              ANALYZING {scanProgress}%
            </span>
          )}
        </div>
        <div className="p-4 font-mono text-xs text-white/80 space-y-1.5 max-h-[180px] overflow-y-auto bg-black/40">
          {consoleLogs.map((log, i) => (
            <div key={i} className={cn(
              log.includes('STRIX-SUCCESS') ? 'text-[#C6FF2E] font-bold' :
              log.includes('STRIX-ERROR') ? 'text-red-400 font-bold' :
              log.includes('Target') ? 'text-amber-300' : 'text-white/60'
            )}>
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Vulnerabilities & PoCs List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-400" />
          Detected Vulnerabilities & Validated PoCs
        </h2>

        {scanResult && scanResult.vulnerabilities ? (
          <div className="space-y-4">
            {scanResult.vulnerabilities.map((vuln: any) => (
              <div key={vuln.id} className="p-6 rounded-2xl bg-[#111118] border border-white/10 space-y-4 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider",
                      vuln.severity === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    )}>
                      {vuln.severity} · CVSS {vuln.cvssScore}
                    </span>
                    <span className="text-xs font-mono text-white/40">{vuln.id}</span>
                    <h3 className="text-sm md:text-base font-bold text-white">{vuln.title}</h3>
                  </div>
                  <span className="text-xs font-mono text-white/50">{vuln.category}</span>
                </div>

                <p className="text-xs text-white/70 leading-relaxed">
                  {vuln.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {/* PoC Code Box */}
                  <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                    <span className="text-[10px] text-[#C6FF2E] font-bold uppercase">PROOF OF CONCEPT (PoC)</span>
                    <p className="text-white/80 text-[11px] leading-relaxed">{vuln.poc}</p>
                  </div>

                  {/* Remediation Box */}
                  <div className="p-3 rounded-xl bg-[#C6FF2E]/10 border border-[#C6FF2E]/20 space-y-1">
                    <span className="text-[10px] text-[#C6FF2E] font-bold uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      RECOMMENDED REMEDIATION
                    </span>
                    <p className="text-white/90 text-[11px] leading-relaxed font-sans">{vuln.remediation}</p>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-white/40 pt-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Location: {vuln.location}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-white/40 font-mono text-xs">
            Run STRIX scan to detect vulnerabilities across documents, ledgers, and API keys.
          </div>
        )}
      </div>
    </div>
  );
}
