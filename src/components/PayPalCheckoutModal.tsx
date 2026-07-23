'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Loader2, CheckCircle2, CreditCard, ExternalLink, Copy, Check } from 'lucide-react';

interface PayPalModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  planName: string;
  amount: number;
  currencySymbol: string;
  currencyCode: string;
  onSuccess: () => void;
}

export default function PayPalCheckoutModal({
  isOpen,
  onClose,
  planId,
  planName,
  amount,
  currencySymbol,
  currencyCode,
  onSuccess
}: PayPalModalProps) {
  const [step, setStep] = useState<'instructions' | 'confirming' | 'done'>('instructions');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // PayPal.me handle — set NEXT_PUBLIC_PAYPAL_ME in Vercel env vars
  const paypalHandle = process.env.NEXT_PUBLIC_PAYPAL_ME || 'synapsapp';
  const paypalMeUrl = `https://paypal.me/${paypalHandle}/${amount}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(paypalMeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPayPal = () => {
    window.open(paypalMeUrl, '_blank');
  };

  const handleIHavePaid = async () => {
    setStep('confirming');

    try {
      await fetch('/api/settings/billing/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });
    } catch (e) {}

    setTimeout(() => {
      setStep('done');
      setTimeout(() => {
        onSuccess();
        onClose();
        window.location.reload();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-base-100 border border-base-300 rounded-3xl max-w-md w-full p-8 shadow-2xl relative space-y-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-base-content/50 hover:text-base-content">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#003087]/10 border border-[#003087]/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
              <path d="M7.5 21L3 21L5.25 9H12.75C16.5 9 18 11.25 17.25 14.25C16.5 17.25 13.5 18.75 10.5 18.75H8.25L7.5 21Z" fill="#009cde"/>
              <path d="M10.5 6L6 6L3.75 18H5.25L7.5 6.75H11.25C15 6.75 16.5 9 15.75 12C16.5 10.5 16.5 8.25 15 6.75C14.25 6 12.75 6 10.5 6Z" fill="#003087"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-base-content">Pay via PayPal</h2>
            <p className="text-xs text-base-content/60">{planName} — {currencySymbol}{amount}/{currencyCode} per month</p>
          </div>
        </div>

        {step === 'instructions' && (
          <div className="space-y-5">
            {/* Order Summary */}
            <div className="p-4 bg-base-200 border border-base-300 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between text-base-content/70">
                <span>Plan:</span>
                <span className="font-bold text-base-content">{planName}</span>
              </div>
              <div className="flex justify-between text-base-content/70">
                <span>Billing:</span>
                <span className="font-bold text-base-content">Monthly</span>
              </div>
              <div className="pt-2 border-t border-base-300 flex justify-between text-sm font-bold text-base-content">
                <span>Amount:</span>
                <span className="text-primary text-base font-extrabold">{currencySymbol}{amount} {currencyCode}</span>
              </div>
            </div>

            {/* Step-by-step instructions */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-base-content uppercase tracking-wider">How to pay in 3 steps:</p>

              <div className="space-y-2">
                {[
                  { n: 1, text: `Click "Open PayPal" to go to paypal.me/${paypalHandle}/${amount}` },
                  { n: 2, text: 'Log in to your PayPal account and complete the payment' },
                  { n: 3, text: 'Return here and click "I Have Paid" to unlock your credits instantly' }
                ].map(s => (
                  <div key={s.n} className="flex items-start gap-3 p-3 bg-base-200 rounded-xl text-xs text-base-content/80">
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-content font-bold flex items-center justify-center text-[10px] shrink-0">{s.n}</span>
                    <span>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PayPal URL copy box */}
            <div className="flex items-center gap-2 p-3 bg-base-200 border border-base-300 rounded-xl text-xs font-mono text-base-content/70 overflow-hidden">
              <span className="truncate flex-1">paypal.me/{paypalHandle}/{amount}</span>
              <button onClick={handleCopy} className="shrink-0 text-primary hover:text-primary/70 transition-colors">
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Action buttons */}
            <button
              onClick={handleOpenPayPal}
              className="w-full py-3.5 rounded-2xl bg-[#009cde] hover:bg-[#0085c0] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Open PayPal to Pay {currencySymbol}{amount}
            </button>

            <button
              onClick={handleIHavePaid}
              className="w-full py-3 rounded-2xl bg-success/15 hover:bg-success/25 border border-success/30 text-success font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              I Have Paid — Unlock My Credits Now
            </button>

            <div className="text-[10px] text-center text-base-content/40 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-success" />
              <span>Credits unlock immediately after clicking "I Have Paid"</span>
            </div>
          </div>
        )}

        {step === 'confirming' && (
          <div className="py-10 text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <h3 className="text-lg font-bold text-base-content">Activating Your Plan...</h3>
            <p className="text-xs text-base-content/60">Unlocking {planId === 'enterprise' ? '10,000' : '500'} daily AI credits on your account.</p>
          </div>
        )}

        {step === 'done' && (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h3 className="text-lg font-bold text-base-content">🎉 Plan Upgraded!</h3>
            <p className="text-xs text-base-content/60">
              Your daily AI credit limit is now <strong>{planId === 'enterprise' ? '10,000 (Unlimited)' : '500'} credits</strong>. Reloading your dashboard...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
