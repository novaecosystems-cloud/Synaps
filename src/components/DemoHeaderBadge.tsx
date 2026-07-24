'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Video, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useSearchParams, usePathname } from 'next/navigation';

export default function DemoHeaderBadge() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isRecordingMode, setIsRecordingMode] = useState(false);

  useEffect(() => {
    // Enable recording mode automatically if ?recording=true or ?rec=true in URL
    const recParam = searchParams.get('recording') || searchParams.get('rec');
    if (recParam === 'true' || recParam === '1') {
      setIsRecordingMode(true);
    }
  }, [searchParams]);

  // Hide badge completely in recording mode or if not on demo route
  const isDemoRoute = pathname === '/demo' || searchParams.get('demo') === 'true';
  if (!isDemoRoute || isRecordingMode) return null;

  return (
    <div className="flex items-center gap-2">
      {/* Demo Badge */}
      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-500 text-xs font-extrabold shadow-sm animate-pulse">
        <Sparkles className="w-3.5 h-3.5" />
        <span>DEMO MODE</span>
      </div>

      {/* Quick Recording Toggle */}
      <button
        onClick={() => setIsRecordingMode(true)}
        className="px-2.5 py-1 bg-base-200 hover:bg-base-300 border border-base-300 rounded-full text-base-content/70 hover:text-base-content text-[11px] font-bold flex items-center gap-1 transition-all"
        title="Hide badge & UI overlays for clean video recording"
      >
        <Video className="w-3 h-3 text-red-500" />
        <span>Clean Recording Mode</span>
      </button>
    </div>
  );
}
