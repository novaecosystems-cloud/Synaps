'use client';

import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

export default function AiCreditBadge() {
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
          creditLimit: customEv.detail.creditLimit ?? prev?.creditLimit ?? 10000,
          remaining: customEv.detail.remaining ?? prev?.remaining ?? 10000,
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

  if (!credits) return null;

  const getTierLabel = () => {
    const role = (credits.role || 'MEMBER').toUpperCase();
    if (role === 'OWNER' || role === 'LEADER' || credits.creditLimit >= 10000) return 'ENTERPRISE MAX';
    if (role === 'ADMIN' || credits.creditLimit >= 500) return 'PRO AI';
    return 'SYNAPS AI';
  };

  return (
    <div 
      onClick={() => window.dispatchEvent(new CustomEvent('synaps:credits_exhausted', { detail: { role: credits.role } }))}
      className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-extrabold tracking-wider shadow-inner cursor-pointer hover:bg-cyan-500/25 transition-all shrink-0 whitespace-nowrap"
      title="Synaps AI Executive Engine active with zero-hallucination precision RAG. Click to manage plan."
    >
      <Zap className="h-3.5 w-3.5 fill-cyan-400 text-cyan-400 animate-pulse shrink-0" />
      <span className="truncate">{getTierLabel()}</span>
    </div>
  );
}
