'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Copy, Check, Clock, Send } from 'lucide-react';

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
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  if (!isOpen) return null;

  const paypalEmail = process.env.NEXT_PUBLIC_PAYPAL_EMAIL || 'novaecosystems@gmail.com';
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'novaecosystems@gmail.com';
  const paypalMeHandle = process.env.NEXT_PUBLIC_PAYPAL_ME || '';

  const paypalSendUrl = paypalMeHandle
    ? `https://paypal.me/${paypalMeHandle}/${amount}${currencyCode}`
    : `https://www.paypal.com/myaccount/transfer/homepage/send?email=${encodeURIComponent(paypalEmail)}&currencyCode=${currencyCode}&amount=${amount}`;

  const copyEmail = () => {
    navigator.clipboard.writeText(paypalEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleOpenPayPal = () => {
    window.open(paypalSendUrl, '_blank');
  };

  const handleNotifyUs = () => {
    if (!userEmail.trim()) return;
    // Open mailto with pre-filled content so user can send payment proof
    const subject = encodeURIComponent(`Synaps Plan Upgrade — ${planName}`);
    const body = encodeURIComponent(
      `Hi,\n\nI have sent ${currencySymbol}${amount} ${currencyCode} to ${paypalEmail} via PayPal for the ${planName} plan.\n\nMy Synaps account email: ${userEmail}\n\nPlease upgrade my account.\n\nThank you!`
    );
    window.open(`mailto:${supportEmail}?subject=${subject}&body=${body}`, '_blank');
    setEmailSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-base-100 border border-base-300 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden">

        {/* Top stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#003087] via-[#009cde] to-[#012169]" />

        <div className="p-8 space-y-5">
          <button onClick={onClose} className="absolute top-5 right-5 p-2 text-base-content/50 hover:text-base-content rounded-full hover:bg-base-200">
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#003087]/10 border border-[#003087]/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <path d="M7.5 21L3 21L5.25 9H12.75C16.5 9 18 11.25 17.25 14.25C16.5 17.25 13.5 18.75 10.5 18.75H8.25L7.5 21Z" fill="#009cde"/>
                <path d="M10.5 6L6 6L3.75 18H5.25L7.5 6.75H11.25C15 6.75 16.5 9 15.75 12C16.5 10.5 16.5 8.25 15 6.75C14.25 6 12.75 6 10.5 6Z" fill="#003087"/>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-base-content">Pay via PayPal</h2>
              <p className="text-xs text-base-content/50">{planName} — {currencySymbol}{amount} {currencyCode}/month</p>
            </div>
          </div>

          {/* Order summary */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-3 bg-base-200 rounded-xl text-center">
              <p className="text-base-content/50 mb-0.5">Plan</p>
              <p className="font-bold text-base-content truncate">{planName}</p>
            </div>
            <div className="p-3 bg-base-200 rounded-xl text-center">
              <p className="text-base-content/50 mb-0.5">Billing</p>
              <p className="font-bold text-base-content">Monthly</p>
            </div>
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-center">
              <p className="text-base-content/50 mb-0.5">Amount</p>
              <p className="font-extrabold text-primary">{currencySymbol}{amount}</p>
            </div>
          </div>

          {/* Step 1 — Send Payment */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-base-content/40 uppercase tracking-widest">Step 1 — Send Payment</p>
            <div className="flex items-center gap-2 p-3 bg-[#009cde]/10 border border-[#009cde]/30 rounded-xl">
              <Mail className="w-4 h-4 text-[#009cde] shrink-0" />
              <span className="font-mono text-sm font-bold text-base-content flex-1">{paypalEmail}</span>
              <button onClick={copyEmail} className="shrink-0 px-2.5 py-1.5 rounded-lg bg-[#009cde] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#0085c0] transition-all">
                {copiedEmail ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
            </div>
            <button
              onClick={handleOpenPayPal}
              className="w-full py-3 rounded-xl bg-[#009cde] hover:bg-[#0085c0] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
                <path d="M7.5 21L3 21L5.25 9H12.75C16.5 9 18 11.25 17.25 14.25C16.5 17.25 13.5 18.75 10.5 18.75H8.25L7.5 21Z"/>
              </svg>
              Open PayPal & Send {currencySymbol}{amount}
            </button>
          </div>

          {/* Step 2 — Email us proof */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-base-content/40 uppercase tracking-widest">Step 2 — Send us your payment confirmation</p>
            {emailSent ? (
              <div className="p-4 bg-success/10 border border-success/30 rounded-xl text-center space-y-1">
                <Check className="w-6 h-6 text-success mx-auto" />
                <p className="text-sm font-bold text-success">Email sent!</p>
                <p className="text-xs text-base-content/60">We'll upgrade your account within a few hours after verifying payment. You'll receive a confirmation email.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="email"
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  placeholder="Your Synaps account email..."
                  className="w-full px-4 py-2.5 bg-base-200 border border-base-300 rounded-xl text-sm text-base-content outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  onClick={handleNotifyUs}
                  disabled={!userEmail.trim()}
                  className="w-full py-3 rounded-xl bg-base-200 hover:bg-base-300 border border-base-300 text-base-content font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Send Payment Confirmation Email
                </button>
              </div>
            )}
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-700">
            <Clock className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Your plan is upgraded manually after we verify your PayPal payment. This usually takes <strong>a few hours</strong>, never more than 24 hours.</span>
          </div>

          <div className="text-[10px] text-center text-base-content/30 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Secured by PayPal. Account upgraded after manual payment verification.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
