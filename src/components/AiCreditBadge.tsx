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
    const interval = setInterval(fetchCredits, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  if (!credits) return null;

  return (
    <div 
      onClick={() => window.dispatchEvent(new CustomEvent('synaps:credits_exhausted', { detail: { role: credits.role } }))}
      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-inner cursor-pointer hover:bg-primary/20 transition-all"
      title={`Daily AI Credits: ${credits.remaining} remaining out of ${credits.creditLimit} total daily credits for your role. Click to view upgrade options or discount.`}
    >
      <Zap className="h-3.5 w-3.5 fill-primary text-primary" />
      <span>{credits.remaining} / {credits.creditLimit} AI Credits</span>
    </div>
  );
}
