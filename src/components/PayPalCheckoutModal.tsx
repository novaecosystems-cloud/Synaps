'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Loader2, CheckCircle2, CreditCard, Copy, Check, Mail } from 'lucide-react';

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
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  if (!isOpen) return null;

  // Your PayPal receiving email — set NEXT_PUBLIC_PAYPAL_EMAIL in Vercel env vars
  const paypalEmail = process.env.NEXT_PUBLIC_PAYPAL_EMAIL || 'novaecosystems@gmail.com';

  // PayPal send money URL with recipient email pre-filled in the query string
  const paypalSendUrl = `https://www.paypal.com/myaccount/transfer/homepage/send?email=${encodeURIComponent(paypalEmail)}&currencyCode=${currencyCode}&amount=${amount}`;

  const copyEmail = () => {
    navigator.clipboard.writeText(paypalEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const copyAmount = () => {
    navigator.clipboard.writeText(String(amount));
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleOpenPayPal = () => {
    window.open(paypalSendUrl, '_blank');
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

            {/* BOLD CTA — email is the key info */}
            <div className="p-4 bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl space-y-2">
              <p className="text-xs font-black text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                <span>⚡</span> On PayPal: paste this email in the "Who are you paying?" field
              </p>
              <div className="flex items-center gap-2 p-3 bg-white/10 rounded-xl">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="font-mono text-base font-black text-base-content flex-1 select-all">{paypalEmail}</span>
                <button onClick={copyEmail} className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-bold flex items-center gap-1 hover:bg-blue-600 transition-all">
                  {copiedEmail ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                </button>
              </div>
              <p className="text-[10px] text-amber-600/80 font-medium">Then enter <strong>{currencySymbol}{amount}</strong> as the amount and send!</p>
            </div>


            {/* Email to send to */}
            <div className="space-y-2">
              <p className="text-[10px] text-base-content/50 font-bold uppercase tracking-wider">Send PayPal payment to this email:</p>
              <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="font-mono text-sm font-bold text-base-content flex-1">{paypalEmail}</span>
                <button onClick={copyEmail} className="shrink-0 text-blue-500 hover:text-blue-400 transition-colors">
                  {copiedEmail ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center gap-2 p-3 bg-base-200 border border-base-300 rounded-xl">
                <span className="text-xs text-base-content/60 flex-1">Amount to send:</span>
                <span className="font-mono text-sm font-bold text-primary">{currencySymbol}{amount}</span>
                <button onClick={copyAmount} className="shrink-0 text-base-content/40 hover:text-base-content transition-colors">
                  {copiedAmount ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <button
              onClick={handleOpenPayPal}
              className="w-full py-3.5 rounded-2xl bg-[#009cde] hover:bg-[#0085c0] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
                <path d="M7.5 21L3 21L5.25 9H12.75C16.5 9 18 11.25 17.25 14.25C16.5 17.25 13.5 18.75 10.5 18.75H8.25L7.5 21Z"/>
              </svg>
              Open PayPal Send Money
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
            <p className="text-xs text-base-content/60">Unlocking {planId === 'enterprise' ? '10,000' : '500'} daily AI credits.</p>
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
