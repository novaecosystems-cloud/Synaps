'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, X, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AppUpdateNotifier() {
  const [initialVersion, setInitialVersion] = useState<string | null>(null);
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check initial build version
    const checkVersion = async () => {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        if (data.status === 'healthy' && data.version) {
          if (!initialVersion) {
            setInitialVersion(data.version);
          } else if (initialVersion !== data.version) {
            setNewVersionAvailable(true);
          }
        }
      } catch (e) {}
    };

    checkVersion();
    // Poll every 60 seconds for background updates
    const interval = setInterval(checkVersion, 60000);
    return () => clearInterval(interval);
  }, [initialVersion]);

  if (!newVersionAvailable || dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-base-100 border border-primary/40 rounded-3xl p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300 font-sans">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 fill-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-base-content">New Update Live</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold">Zero Downtime</span>
            </div>
            <p className="text-[11px] text-base-content/70 mt-0.5 leading-tight">
              Synaps AI has been updated in the background. Your active session and data are safely preserved.
            </p>
          </div>
        </div>

        <button 
          onClick={() => setDismissed(true)} 
          className="text-base-content/40 hover:text-base-content p-1 rounded-full hover:bg-base-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-base-200 flex items-center justify-between gap-2">
        <span className="text-[10px] text-base-content/50 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" /> State & Data Preserved
        </span>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary btn-xs rounded-xl gap-1.5 font-bold px-3 shadow-md"
        >
          <RefreshCw className="w-3 h-3" /> Update Now
        </button>
      </div>
    </div>
  );
}
