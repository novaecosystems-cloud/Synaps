'use client';

import React, { useEffect, useState } from 'react';
import { CAUSARIX_QR_BASE64 } from '@/lib/causarix-qr-base64';
import { isFreeUserTier } from '@/lib/export-helpers';

interface FreeTierPrintWatermarkProps {
  className?: string;
  forceShow?: boolean;
}

export default function FreeTierPrintWatermark({ className = '', forceShow = false }: FreeTierPrintWatermarkProps) {
  const [isFree, setIsFree] = useState(false);

  useEffect(() => {
    setIsFree(forceShow || isFreeUserTier());
  }, [forceShow]);

  if (!isFree) return null;

  return (
    <div
      className={`print:flex free-tier-watermark mt-8 p-3.5 border-1.5 border-dashed border-cyan-500/60 rounded-xl bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-4 text-slate-800 dark:text-slate-200 ${className}`}
      style={{ pageBreakInside: 'avoid' }}
    >
      <div className="flex items-center gap-3.5">
        <img
          src={CAUSARIX_QR_BASE64}
          alt="Causarix Fiduciary AI QR"
          className="w-16 h-16 rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm flex-shrink-0"
        />
        <div>
          <div className="text-[11px] font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
            <span>🏛️</span> Audited by Causarix™ Fiduciary AI (Free Tier)
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 max-w-[500px] leading-tight">
            Scan with your phone camera to stress-test corporate decisions, simulate cash runway ruin, or verify statutory Delaware DGCL § 141 safe harbor.
          </div>
          <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold mt-1">
            👉 Go to <span className="underline">causarix.vercel.app</span> · Upgrade for unbranded whitelabel exports
          </div>
        </div>
      </div>
      <div className="text-right text-[9px] text-slate-500 dark:text-slate-400 font-mono flex-shrink-0 pl-3 border-l border-slate-200 dark:border-slate-800">
        <span className="bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-200 px-1.5 py-0.5 rounded font-bold">FREE AUDIT</span>
        <div className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">Delaware § 141</div>
      </div>
    </div>
  );
}
