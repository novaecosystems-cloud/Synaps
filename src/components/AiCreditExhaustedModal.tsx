'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Sparkles, Crown, X, ArrowRight, ShieldCheck, 
  Clock, Tag, Check, Mail, HeartHandshake
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AiCreditExhaustedModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  userRole?: string; // 'MEMBER' | 'ADMIN' | 'LEADER'
}

export default function AiCreditExhaustedModal({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  userRole: externalUserRole
}: AiCreditExhaustedModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>('MEMBER');
  const [email, setEmail] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleClose = () => {
    if (externalOnClose) externalOnClose();
    setInternalIsOpen(false);
  };

  // Listen for global credit exhaustion events across any dashboard API request
  useEffect(() => {
    const handleCreditExhausted = (e: any) => {
      if (e?.detail?.role) setUserRole(e.detail.role);
      setInternalIsOpen(true);
    };

    window.addEventListener('synaps:credits_exhausted' as any, handleCreditExhausted);
    return () => window.removeEventListener('synaps:credits_exhausted' as any, handleCreditExhausted);
  }, []);

  // 24-30 Hour Flash Countdown Timer
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDiscountApplied(true);
    setTimeout(() => {
      window.location.href = '/dashboard/settings/billing';
    }, 1500);
  };

  if (!isOpen) return null;

  const isFreeTier = userRole === 'MEMBER' || userRole === 'GUEST';
  const isProTier = userRole === 'ADMIN' || userRole === 'MANAGER';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: 'backOut' }}
          className="relative w-full max-w-lg bg-gradient-to-br from-slate-900 via-base-100 to-slate-950 border border-primary/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(139,92,246,0.25)] overflow-hidden"
        >
          {/* Uiverse Exit Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-base-200/80 hover:bg-base-300 border border-base-300 text-base-content font-bold flex items-center justify-center text-lg transition-all shadow-md z-10"
            aria-label="Close modal"
          >
            ×
          </button>

          {/* Header Banner */}
          <div className="text-center space-y-3 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
              <Zap className="w-7 h-7 fill-amber-500 text-amber-500 animate-pulse" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-extrabold uppercase tracking-wider">
                Daily AI Credits Refilling at Midnight UTC
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-base-content tracking-tight">
                {isFreeTier 
                  ? "You've Used All Free AI Credits for Today! ✨" 
                  : "Pro Daily AI Credits Reached! 🚀"}
              </h2>
            </div>

            {/* Polite Friendly Message */}
            <p className="text-xs text-base-content/70 leading-relaxed font-medium max-w-sm mx-auto">
              {isFreeTier ? (
                <>
                  Great work exploring Synaps today! You've reached your free <strong>50 daily AI credits</strong> limit. Upgrade to <strong>Pro ($7/mo)</strong> or <strong>Enterprise Max ($20/mo)</strong> to instantly unlock up to 10,000 credits today.
                </>
              ) : (
                <>
                  You're making huge progress! You've used your <strong>500 Pro daily credits</strong>. Upgrade to <strong>Enterprise Max ($20/mo)</strong> to unlock <strong>Unlimited AI Credits</strong> instantly.
                </>
              )}
            </p>
          </div>

          {/* 24-30 Hour Flash Discount Form (Styled & Animated from Uiverse.io snippet) */}
          <div className="mt-6 p-5 bg-gradient-to-br from-primary/10 via-base-200 to-purple-950/40 border border-primary/30 rounded-2xl space-y-4 shadow-inner relative overflow-hidden">
            {/* Flash Deal Timer */}
            <div className="flex justify-between items-center border-b border-primary/20 pb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>SPECIAL 10% OFF FLASH DISCOUNT</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-300 bg-base-300/60 px-2.5 py-1 rounded-lg border border-base-300">
                <Clock className="w-3 h-3 text-primary animate-spin" />
                <span>
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            {discountApplied ? (
              <div className="py-4 text-center space-y-2">
                <Check className="w-10 h-10 text-success mx-auto animate-bounce" />
                <h4 className="font-bold text-sm text-success">10% Promo Code Applied!</h4>
                <p className="text-[11px] text-base-content/60">Redirecting to Billing page with discount active...</p>
              </div>
            ) : (
              <form onSubmit={handleApplyDiscount} className="space-y-3">
                <p className="text-[11px] text-base-content/80 text-center font-medium">
                  Claim an extra <strong>10% OFF</strong> your upgrade! Enter your email to auto-apply discount code:
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-base-content/40" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your work email"
                      className="w-full pl-9 pr-3 py-2 bg-base-100 border border-base-300 rounded-xl text-xs text-base-content outline-none focus:ring-2 focus:ring-primary/40 font-medium"
                    />
                  </div>
                  <Button type="submit" className="rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-content px-5 py-2">
                    Claim 10% OFF!
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-2">
            <Link href="/dashboard/settings/billing" onClick={handleClose} className="w-full">
              <Button className="w-full rounded-2xl gap-2 font-bold py-3.5 bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-primary/25">
                {isFreeTier ? (
                  <>
                    <Sparkles className="w-4 h-4" /> Upgrade to Pro ($7) or Max ($20)
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4" /> Upgrade to Enterprise Max ($20 / Unlimited)
                  </>
                )}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <button
              onClick={handleClose}
              className="w-full text-center text-xs text-base-content/50 hover:text-base-content py-2 font-medium transition-colors"
            >
              No thanks, I'll wait for midnight UTC reset
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
