'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  WifiOff, 
  Wifi, 
  RefreshCw, 
  Minimize2, 
  Maximize2, 
  Radio, 
  Database, 
  Cpu, 
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

function playReconnectChime() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playNote = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // Ascending celebratory link restoration chime (C5 -> E5 -> G5 -> C6)
    playNote(523.25, 0, 0.2);
    playNote(659.25, 0.12, 0.2);
    playNote(783.99, 0.24, 0.25);
    playNote(1046.50, 0.36, 0.45);
  } catch (e) {}
}

export default function OfflineNetworkGuardian() {
  const [isOffline, setIsOffline] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [justRestored, setJustRestored] = useState(false);
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(15);
  const retryIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Active network test
  const checkConnectivity = useCallback(async () => {
    setIsTesting(true);
    const start = performance.now();
    try {
      // Fast cache-busted ping to static favicon or health route with strict 3.5s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`/favicon.ico?_t=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok || response.status === 304 || response.status === 200 || response.type === 'opaque') {
        const latency = Math.round(performance.now() - start);
        setPingLatency(latency);
        
        if (isOffline) {
          setIsOffline(false);
          setJustRestored(true);
          playReconnectChime();
          setTimeout(() => setJustRestored(false), 4000);
        }
        setIsTesting(false);
        return true;
      }
    } catch (err) {
      // Still offline
    }
    
    setIsOffline(true);
    setIsTesting(false);
    return false;
  }, [isOffline]);

  useEffect(() => {
    // Initial state check
    if (typeof window !== 'undefined') {
      const isSovereign = localStorage.getItem('causarix_execution_mode') === 'offline';
      if (!navigator.onLine) {
        setIsOffline(true);
        if (isSovereign) setIsMinimized(true);
      }
    }

    const handleOffline = () => {
      const isSovereign = localStorage.getItem('causarix_execution_mode') === 'offline';
      setIsOffline(true);
      setIsMinimized(isSovereign);
      setCountdown(15);
    };

    const handleOnline = async () => {
      const verified = await checkConnectivity();
      if (verified) {
        setIsOffline(false);
        setJustRestored(true);
        playReconnectChime();
        setTimeout(() => setJustRestored(false), 4000);
      }
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      if (retryIntervalRef.current) clearInterval(retryIntervalRef.current);
    };
  }, [checkConnectivity]);

  // Periodic auto-reconnection countdown timer when offline
  useEffect(() => {
    if (!isOffline) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          checkConnectivity();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOffline, checkConnectivity]);

  // If online and not in justRestored state, render nothing
  if (!isOffline && !justRestored) {
    return null;
  }

  // ─── CONNECTION RESTORED TOAST BANNER ─────────────────────────────────────
  if (justRestored && !isOffline) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-300">
        <div className="flex items-center gap-3 bg-slate-950/90 border-2 border-emerald-500/60 text-white px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl ring-4 ring-emerald-500/20">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs uppercase tracking-wider text-emerald-400">Connection Restored</span>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {pingLatency ? `${pingLatency}ms` : 'Online'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300">Cloud Synaps Intelligence link successfully re-established.</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── MINIMIZED FLOATING PILL ──────────────────────────────────────────────
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-4 fade-in duration-300">
        <div className="flex items-center gap-3 bg-slate-950/90 border border-rose-500/40 text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl ring-2 ring-rose-500/20">
          <div className="relative flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping absolute" />
            <div className="w-3 h-3 rounded-full bg-rose-500 relative" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs text-rose-400 uppercase tracking-wider">Offline Mode</span>
              <span className="text-[10px] font-mono text-slate-400">Auto-retry in {countdown}s</span>
            </div>
            <span className="text-[10px] text-slate-400 block">Local Cached Data Active</span>
          </div>

          <div className="flex items-center gap-1.5 ml-2 border-l border-white/10 pl-2">
            <button
              onClick={() => checkConnectivity()}
              disabled={isTesting}
              title="Test Connection"
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-all disabled:opacity-40"
            >
              <RefreshCw className={cn("w-4 h-4", isTesting && "animate-spin text-cyan-400")} />
            </button>
            <button
              onClick={() => setIsMinimized(false)}
              title="Expand Details"
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-all"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── FULL-SCREEN ANIMATED OFFLINE CARD (404-STYLE AESTHETIC) ──────────────
  return (
    <div className="fixed inset-0 z-[9999] bg-[#000209]/90 backdrop-blur-xl text-white flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans animate-in fade-in duration-300">
      {/* Ambient Cyber Disconnected Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-radial from-rose-600/15 via-cyan-600/10 to-transparent blur-[140px] pointer-events-none" />

      {/* Embedded CSS for Animated Cyber Offline Robot & Wi-Fi Wave Animations */}
      <style jsx global>{`
        .offline-face-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 220px;
          background: transparent;
        }

        .offline-face-container .offline-face {
          width: 190px;
          filter: drop-shadow(0 0 25px rgba(244, 63, 94, 0.45));
        }

        .offline-face__eyes,
        .offline-face__eye-lid,
        .offline-face__mouth-left,
        .offline-face__mouth-right,
        .offline-face__pupil {
          animation: offlineEyes 1s 0.3s forwards;
        }

        .offline-face__eye-lid,
        .offline-face__pupil {
          animation-duration: 3.5s;
          animation-delay: 1s;
          animation-iteration-count: infinite;
        }

        .offline-face__eye-lid {
          animation-name: offlineEyeLid;
        }

        .offline-face__pupil {
          animation-name: offlinePupil;
        }

        .offline-face__mouth-left {
          animation: offlineMouthFlat 3s ease-in-out infinite alternate;
        }

        .offline-face__mouth-right {
          animation: offlineMouthFlat 3s ease-in-out infinite alternate;
        }

        .offline-face__antenna-signal {
          animation: antennaRadar 2s ease-out infinite;
          transform-origin: center;
        }

        .offline-face__antenna-signal:nth-child(2) {
          animation-delay: 0.5s;
        }

        .offline-face__antenna-signal:nth-child(3) {
          animation-delay: 1s;
        }

        @keyframes offlineEyeLid {
          0%, 40%, 45%, 100% {
            transform: translateY(0);
          }
          42.5% {
            transform: translateY(18px);
          }
        }

        @keyframes offlineEyes {
          from {
            transform: translateY(110px);
          }
          to {
            transform: translateY(15px);
          }
        }

        @keyframes offlinePupil {
          0%, 35%, 100% {
            transform: translate(0, 0);
          }
          40%, 55% {
            transform: translate(-30px, 0);
          }
          60%, 75% {
            transform: translate(30px, 0);
          }
          80%, 90% {
            transform: translate(0, 15px);
          }
        }

        @keyframes offlineMouthFlat {
          0% {
            stroke-dashoffset: 0;
            opacity: 0.8;
          }
          50% {
            stroke-dashoffset: 15;
            opacity: 0.4;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0.8;
          }
        }

        @keyframes antennaRadar {
          0% {
            opacity: 1;
            transform: scale(0.85);
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
            transform: scale(1.4);
          }
        }
      `}</style>

      {/* Main Offline Glass Container Card */}
      <div className="relative z-10 max-w-xl w-full flex flex-col items-center text-center space-y-6 bg-slate-950/85 p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl ring-1 ring-rose-500/20">
        
        {/* Top Tag & Minimize Control */}
        <div className="w-full flex items-center justify-between">
          <div className="px-3.5 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-xs font-mono text-rose-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-rose-400" />
            <span>SYNAPS NETWORK · CONNECTION LOST</span>
          </div>

          <button
            onClick={() => setIsMinimized(true)}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1.5 font-mono"
            title="Minimize to floating widget"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Minimize</span>
          </button>
        </div>

        {/* Animated Cyber Face with Searching Radar Wi-Fi Antenna (404 Style) */}
        <div className="w-full flex justify-center relative">
          <main className="offline-face-container">
            <svg className="offline-face text-rose-500" viewBox="0 0 320 380">
              {/* Radio Wave Pulse Rings Above Head */}
              <g fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.6">
                <path className="offline-face__antenna-signal" d="M 120 40 A 40 40 0 0 1 200 40" stroke="#f43f5e" />
                <path className="offline-face__antenna-signal" d="M 95 20 A 70 70 0 0 1 225 20" stroke="#fb7185" />
                <path className="offline-face__antenna-signal" d="M 70 0 A 100 100 0 0 1 250 0" stroke="#f43f5e" />
              </g>

              {/* Antenna Spike */}
              <line x1="160" y1="45" x2="160" y2="85" stroke="#f43f5e" strokeWidth="14" strokeLinecap="round" />
              <circle cx="160" cy="45" r="10" fill="#f43f5e" />

              {/* Main Facial Character Outline */}
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="25"
              >
                {/* Eyes & Eyelids */}
                <g className="offline-face__eyes" transform="translate(0,112.5)">
                  <g transform="translate(15,0)">
                    <polyline className="offline-face__eye-lid" points="37,0 0,120 75,120"></polyline>
                    <polyline
                      className="offline-face__pupil"
                      points="55,120 55,155"
                      strokeDasharray="35 35"
                    ></polyline>
                  </g>
                  <g transform="translate(230,0)">
                    <polyline className="offline-face__eye-lid" points="37,0 0,120 75,120"></polyline>
                    <polyline
                      className="offline-face__pupil"
                      points="55,120 55,155"
                      strokeDasharray="35 35"
                    ></polyline>
                  </g>
                </g>

                {/* Nose */}
                <rect
                  className="offline-face__nose"
                  x="132.5"
                  y="112.5"
                  width="55"
                  height="155"
                  rx="4"
                  ry="4"
                  stroke="#fb7185"
                ></rect>

                {/* Glitching Disconnected Flat Mouth */}
                <g transform="translate(65,334)" strokeDasharray="102 102">
                  <path className="offline-face__mouth-left" d="M 0 15 L 95 15" stroke="#f43f5e"></path>
                  <path className="offline-face__mouth-right" d="M 95 15 L 190 15" stroke="#f43f5e"></path>
                </g>
              </g>
            </svg>
          </main>
        </div>

        {/* Headline & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-editorial tracking-tight">
            Signal Dropped · Synaps is Offline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed font-sans">
            Your device lost connection to the Internet. Synaps has automatically switched to <strong>Offline Resilient Mode</strong>.
          </p>
        </div>

        {/* Real-Time Telemetry & Offline Subsystems Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full text-left">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-rose-400 uppercase">
              <WifiOff className="w-3.5 h-3.5 shrink-0" />
              <span>Cloud Link</span>
            </div>
            <div className="text-xs font-bold text-slate-200">Disconnected</div>
            <div className="text-[9px] font-mono text-slate-400">Auto-retry in {countdown}s</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 uppercase">
              <Database className="w-3.5 h-3.5 shrink-0" />
              <span>Local Memory</span>
            </div>
            <div className="text-xs font-bold text-slate-200">Grounded Cache</div>
            <div className="text-[9px] font-mono text-slate-400">IndexedDB Active</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-cyan-400 uppercase">
              <Cpu className="w-3.5 h-3.5 shrink-0" />
              <span>Local Engine</span>
            </div>
            <div className="text-xs font-bold text-slate-200">Ollama / Standby</div>
            <div className="text-[9px] font-mono text-slate-400">Local Vector Ready</div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <button
            onClick={() => checkConnectivity()}
            disabled={isTesting}
            className="w-full sm:w-auto flex-1 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-primary to-cyan-600 hover:from-rose-500 hover:to-cyan-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-rose-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={cn("w-4 h-4", isTesting && "animate-spin")} />
            <span>{isTesting ? 'Pinging Cloud Node...' : 'Test Connection Now'}</span>
          </button>

          <button
            onClick={() => setIsMinimized(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Browse Offline Cache</span>
          </button>
        </div>

      </div>
    </div>
  );
}
