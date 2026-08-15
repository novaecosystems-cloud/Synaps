'use client';

import React, { useState, useEffect } from 'react';
import {
  Download,
  Laptop,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Terminal,
  ExternalLink,
  Sparkles,
  Command,
} from 'lucide-react';

export default function DownloadDesktopModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handlePwaInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsPwaInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install Synaps PWA: Click the Install icon in your browser URL bar or Add to Home Screen.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 font-sans animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-base-100 border border-base-300 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6 text-base-content">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Synaps AI Desktop OS</h2>
                <span className="badge badge-success badge-xs font-bold text-[9px] gap-1">
                  <ShieldCheck className="w-3 h-3" /> DEFENDER SAFE
                </span>
              </div>
              <p className="text-xs text-base-content/60 mt-0.5">
                Native executive suite with Alt+Space Spotlight Companion, Colibrì 744B MoE & 24/7 background sync.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content"
          >
            ✕
          </button>
        </div>

        {/* Security / Antivirus Assurance Banner */}
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-xs text-emerald-400">
          <ShieldCheck className="w-5 h-5 flex-shrink-0" />
          <span>
            <strong>Clean & Verified:</strong> Built with standard non-elevated user permissions (<code>asInvoker</code>). Zero malware flags, zero telemetry exfiltration.
          </span>
        </div>

        {/* Download Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Windows Setup Installer */}
          <a
            href="/api/downloads/windows"
            className="p-4 rounded-2xl bg-base-200 hover:bg-base-300/80 border border-base-300 hover:border-indigo-500/50 transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-base-content flex items-center gap-2">
                  🪟 Windows Setup (.exe)
                </span>
                <span className="badge badge-primary badge-xs text-[9px] font-bold">RECOMMENDED</span>
              </div>
              <p className="text-xs text-base-content/60">
                Full NSIS Installer with Start Menu, Desktop shortcuts, and background tray agent.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:translate-x-0.5 transition-transform">
              <span>Download Installer (~154 MB)</span>
              <Download className="w-4 h-4" />
            </div>
          </a>

          {/* Windows Portable Edition */}
          <a
            href="/api/downloads/windows"
            className="p-4 rounded-2xl bg-base-200 hover:bg-base-300/80 border border-base-300 hover:border-cyan-500/50 transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-base-content flex items-center gap-2">
                  ⚡ Windows Portable (.exe)
                </span>
                <span className="badge badge-accent badge-xs text-[9px] font-bold">NO INSTALL</span>
              </div>
              <p className="text-xs text-base-content/60">
                Zero-installation standalone binary. Runs directly from USB or any folder.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:translate-x-0.5 transition-transform">
              <span>Download Portable</span>
              <Download className="w-4 h-4" />
            </div>
          </a>

          {/* macOS DMG */}
          <a
            href="/api/downloads/mac"
            className="p-4 rounded-2xl bg-base-200 hover:bg-base-300/80 border border-base-300 hover:border-purple-500/50 transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-1">
              <span className="font-bold text-sm text-base-content flex items-center gap-2">
                🍎 macOS (.dmg)
              </span>
              <p className="text-xs text-base-content/60">
                Universal binary for Apple Silicon (M1/M2/M3/M4) and Intel Macs.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:translate-x-0.5 transition-transform">
              <span>Download DMG</span>
              <Download className="w-4 h-4" />
            </div>
          </a>

          {/* Instant 1-Click PWA */}
          <div
            onClick={handlePwaInstall}
            className="p-4 rounded-2xl bg-base-200 hover:bg-base-300/80 border border-base-300 hover:border-emerald-500/50 transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-base-content flex items-center gap-2">
                  🌐 Instant PWA (0 MB)
                </span>
                <span className="badge badge-success badge-xs text-[9px] font-bold">INSTANT</span>
              </div>
              <p className="text-xs text-base-content/60">
                Installs directly to your Dock or Start Menu from the browser without downloading an .exe.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
              <span>{isPwaInstalled ? 'Installed ✓' : 'Install to Desktop Now'}</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Hotkeys Quick Reference */}
        <div className="p-3 bg-base-200/60 rounded-2xl flex items-center justify-between flex-wrap gap-2 text-[11px] font-mono text-base-content/70">
          <div className="flex items-center gap-2">
            <Command className="w-3.5 h-3.5 text-indigo-400" />
            <span>Spotlight Companion: <kbd className="kbd kbd-xs font-bold bg-base-300">Alt + Space</kbd></span>
          </div>
          <div className="flex items-center gap-2">
            <span>Terminal CLI: <code className="text-indigo-400">node bin/synaps.js</code></span>
          </div>
        </div>
      </div>
    </div>
  );
}
