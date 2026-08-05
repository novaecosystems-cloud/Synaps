'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { getGumroadCheckoutUrl } from '@/lib/gumroad';

interface LaunchPromoModalProps {
  userPlan?: string;
}

export default function LaunchPromoModal({ userPlan }: LaunchPromoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // DO NOT show to MAX / Enterprise paid users
    if (userPlan === 'max' || userPlan === 'enterprise') {
      return;
    }

    // Check if shown in this browser session
    const sessionDismissed = sessionStorage.getItem('synaps_launch_promo_dismissed');
    if (!sessionDismissed) {
      // Small delay for smooth entrance after page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [userPlan]);

  const handleDismiss = () => {
    sessionStorage.setItem('synaps_launch_promo_dismissed', 'true');
    setIsOpen(false);
  };

  const handleClaimOffer = () => {
    sessionStorage.setItem('synaps_launch_promo_dismissed', 'true');
    const checkoutUrl = getGumroadCheckoutUrl('pro', undefined, 'LAUNCH100');
    window.open(checkoutUrl, '_blank');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-[#191919] text-[#FBF9F5] border border-[#CC5A00]/40 rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl relative text-left">
        
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors p-1 rounded-full bg-white/5 hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CC5A00]/20 border border-[#CC5A00]/40 text-[#CC5A00] text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Day Special Offer</span>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h2 className="font-serif-anthropic text-3xl font-normal text-[#FBF9F5] leading-tight">
            Get 30% OFF SYNAPS Pro & Enterprise.
          </h2>
          <p className="text-xs font-sans-anthropic text-[#A5A29A] leading-relaxed">
            Unlock the 10-Agent C-Suite Boardroom, 3D Memory Graph, and Strix Zero-Trust security with code <strong className="font-mono text-white bg-[#CC5A00] px-2 py-0.5 rounded">LAUNCH100</strong>.
          </p>
        </div>

        {/* Highlights */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-sans-anthropic text-white/90">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#CC5A00]" />
            <span>Pre-applied 30% discount at checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#CC5A00]" />
            <span>14-day 100% money-back guarantee</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleClaimOffer}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[#CC5A00] hover:bg-[#b85100] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#CC5A00]/25"
          >
            Claim 30% Off Now
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleDismiss}
            className="w-full sm:w-auto py-3.5 px-5 rounded-full border border-white/20 hover:border-white text-white/70 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors text-center"
          >
            Maybe Later
          </button>
        </div>

      </div>
    </div>
  );
}
