'use client';

import { useState, useEffect } from 'react';
import { Sparkles, X, ArrowRight, ShieldCheck, Clock, Users } from 'lucide-react';
import { getGumroadCheckoutUrl } from '@/lib/gumroad';
import { isLaunchPromoValid, getLaunchPromoBadgeInfo, LAUNCH_PROMO_CONFIG } from '@/lib/launch-promo';

interface LaunchPromoModalProps {
  userPlan?: string;
}

export default function LaunchPromoModal({ userPlan }: LaunchPromoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const claimedCount = 84; // 84 out of 100 slots claimed

  useEffect(() => {
    // DO NOT show to MAX / Enterprise paid users
    if (userPlan === 'max' || userPlan === 'enterprise') {
      return;
    }

    // Verify promo validity (Max 100 users & Valid until Sept 5, 2026)
    const promoCheck = isLaunchPromoValid(claimedCount);
    if (!promoCheck.isValid) {
      return; // Do not display if expired or 100/100 slots full
    }

    // Check if shown in this browser session
    const sessionDismissed = sessionStorage.getItem('causarix_launch_promo_dismissed');
    if (!sessionDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [userPlan, claimedCount]);

  const handleDismiss = () => {
    sessionStorage.setItem('causarix_launch_promo_dismissed', 'true');
    setIsOpen(false);
  };

  const handleClaimOffer = () => {
    sessionStorage.setItem('causarix_launch_promo_dismissed', 'true');
    const checkoutUrl = getGumroadCheckoutUrl('pro', undefined, LAUNCH_PROMO_CONFIG.code);
    window.open(checkoutUrl, '_blank');
    setIsOpen(false);
  };

  const promoBadge = getLaunchPromoBadgeInfo(claimedCount);

  if (!isOpen || !promoBadge.isValid) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-[#181715] text-[#ECE9E3] border border-[#D96B27]/40 rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl relative text-left">
        
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors p-1 rounded-full bg-white/5 hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D96B27]/20 border border-[#D96B27]/40 text-[#D96B27] text-[11px] font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>First 100 Users Only · {claimedCount}/100 Claimed</span>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h2 className="font-serif-anthropic text-3xl font-normal text-[#ECE9E3] leading-tight">
            Claim 30% OFF CAUSARIX Pro & Enterprise MAX.
          </h2>
          <p className="text-xs font-sans-anthropic text-[#A5A095] leading-relaxed">
            Unlock the 10-Agent Boardroom, Digital Twin OS, and 3D Memory Graph with code <strong className="font-mono text-white bg-[#D96B27] px-2 py-0.5 rounded">{LAUNCH_PROMO_CONFIG.code}</strong>.
          </p>
        </div>

        {/* Urgency & Expiration Warning */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-[#242320] border border-[#383631] text-xs font-sans-anthropic text-[#ECE9E3]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#D96B27] font-bold">
              <Users className="w-4 h-4" />
              <span>Strict 100-User Limit:</span>
            </div>
            <span className="font-mono text-xs font-bold text-white bg-[#D96B27]/30 px-2 py-0.5 rounded border border-[#D96B27]/50">
              Only {100 - claimedCount} Slots Left
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#A5A095] pt-1 border-t border-[#2F2D29]">
            <Clock className="w-4 h-4 text-[#D96B27]" />
            <span>Valid until <strong>September 5, 2026</strong> (Expires for User #101+)</span>
          </div>

          <div className="flex items-center gap-2 text-[#A5A095]">
            <ShieldCheck className="w-4 h-4 text-[#D96B27]" />
            <span>Pre-applied at checkout with 14-day money-back guarantee</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleClaimOffer}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-[#D96B27] hover:bg-[#C25918] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D96B27]/25"
          >
            Claim 30% Off ({100 - claimedCount} Left)
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleDismiss}
            className="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-[#383631] hover:border-white text-[#A5A095] hover:text-white text-xs font-mono uppercase tracking-wider transition-colors text-center"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
