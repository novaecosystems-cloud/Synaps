'use client';

import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AiCreditBadgeProps {
  onOpenPaywall?: () => void;
  className?: string;
}

export default function AiCreditBadge({ onOpenPaywall, className }: AiCreditBadgeProps) {
  const [credits, setCredits] = useState<{ creditsUsed: number; creditLimit: number; remaining: number; role?: string } | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch('/api/settings/ai/credits');
        const data = await res.json();
        if (data.success && data.credits) {
          setCredits(data.credits);
          if (data.credits.remaining === 0) {
            window.dispatchEvent(new CustomEvent('synaps:credits_exhausted', { detail: { role: data.credits.role } }));
          }
        }
      } catch (e) {}
    };

    fetchCredits();

    const handleCreditUpdate = (e: Event) => {
      const customEv = e as CustomEvent;
      if (customEv.detail) {
        setCredits((prev) => ({
          creditsUsed: customEv.detail.creditsUsed ?? prev?.creditsUsed ?? 0,
          creditLimit: customEv.detail.creditLimit ?? prev?.creditLimit ?? 50,
          remaining: customEv.detail.remaining ?? prev?.remaining ?? 50,
          role: customEv.detail.role ?? prev?.role ?? 'MEMBER'
        }));
      }
      fetchCredits();
    };

    // Fast 5-second polling so Owner Admin approvals reflect instantly on the user app!
    const interval = setInterval(fetchCredits, 5000);
    window.addEventListener('focus', fetchCredits);
    window.addEventListener('synaps:credits_updated', handleCreditUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', fetchCredits);
      window.removeEventListener('synaps:credits_updated', handleCreditUpdate);
    };
  }, []);

  const handleClick = () => {
    if (onOpenPaywall) {
      onOpenPaywall();
    } else {
      window.dispatchEvent(new CustomEvent('synaps:credits_exhausted', { detail: { role: credits?.role || 'MEMBER' } }));
    }
  };

  if (!credits) return null;

  const role = (credits.role || 'MEMBER').toUpperCase();
  const isEnterprise = role === 'OWNER' || role === 'LEADER' || credits.creditLimit >= 10000;
  const isPro = !isEnterprise && (role === 'ADMIN' || credits.creditLimit >= 500);

  return (
    <button
      onClick={handleClick}
      className={cn(
        "px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-extrabold text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md hover:scale-[1.03] shrink-0 whitespace-nowrap",
        isEnterprise 
          ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25"
          : isPro
            ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
            : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white aura-cyan",
        className
      )}
      title="View Plan & AI Credit Limits"
    >
      <Zap className={cn("w-3.5 h-3.5 shrink-0", !isEnterprise && !isPro ? "fill-white animate-pulse" : isEnterprise ? "fill-cyan-400 text-cyan-400" : "fill-emerald-400 text-emerald-400")} />
      <span>
        {isEnterprise ? 'ENTERPRISE MAX' : isPro ? 'PRO AI' : 'UPGRADE'}
      </span>
    </button>
  );
}
