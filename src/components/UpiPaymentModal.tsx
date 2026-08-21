'use client';

import React, { useState } from 'react';
import { 
  QrCode, X, Copy, Check, Sparkles, ShieldCheck, 
  Smartphone, ArrowRight, Zap, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId?: 'pro' | 'enterprise';
  upiId?: string; // e.g. "shourya@upi" or custom VPA
}

export default function UpiPaymentModal({
  isOpen,
  onClose,
  planId = 'pro',
  upiId = 'shourya@upi' // Easily configurable fallback
}: UpiPaymentModalProps) {
  const [copied, setCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  // Plan pricing in INR (approx 30% OFF applied)
  const planDetails = planId === 'enterprise' ? {
    title: 'Causarix Enterprise MAX',
    priceInr: '₹899',
    priceUsd: '$10.99',
    rawAmount: 899,
    credits: '10,000 Credits/Day'
  } : {
    title: 'Causarix Pro Intelligence',
    priceInr: '₹599',
    priceUsd: '$7.99',
    rawAmount: 599,
    credits: '500 Credits/Day'
  };

  // Generate standard UPI Intent URI
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=Causarix%20AI&am=${planDetails.rawAmount}&cu=INR&tn=${encodeURIComponent(`Causarix ${planId.toUpperCase()} Subscription`)}`;

  // Generate QR Code Image URL using public QR Server API
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiIntentUri)}&color=000000&bgcolor=ffffff`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/settings/billing/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upi_payment_notice',
          userEmail: userEmail.trim(),
          utrNumber: utrNumber.trim(),
          planId
        })
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit UPI verification:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141414] text-[#FBF9F5] border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative text-left overflow-hidden">
        
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-primary to-emerald-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors p-1.5 rounded-full bg-white/5 hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Instant UPI QR Code Scanner</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Scan & Pay with Any UPI App
          </h2>
          <p className="text-xs text-white/60">
            Selected Plan: <strong className="text-amber-400">{planDetails.title}</strong> ({planDetails.priceInr} / {planDetails.priceUsd}/mo)
          </p>
        </div>

        {/* QR CODE CONTAINER */}
        <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center space-y-3 shadow-inner border border-white/20">
          <img 
            src={qrCodeImageUrl} 
            alt="UPI Payment QR Code" 
            className="w-48 h-48 rounded-lg object-contain border border-slate-200"
          />
          <div className="text-center space-y-0.5">
            <span className="text-[11px] text-slate-600 font-sans font-bold block">
              Scan with Google Pay, PhonePe, Paytm, BHIM, Cred, or Camera
            </span>
            <span className="text-xs font-extrabold text-slate-900 font-mono">
              Amount Due: {planDetails.priceInr}
            </span>
          </div>
        </div>

        {/* UPI ID COPY BOX */}
        <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-2 text-xs">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-white/50 uppercase tracking-wider font-mono block">Direct UPI ID / VPA</span>
            <span className="font-mono text-amber-300 font-bold truncate block">{upiId}</span>
          </div>
          <button
            onClick={handleCopyUpi}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] font-bold flex items-center gap-1.5 transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            {copied ? 'Copied!' : 'Copy UPI'}
          </button>
        </div>

        {/* VERIFICATION FORM */}
        {isSubmitted ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2 text-center text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-white text-sm">UPI Payment Submitted!</h4>
            <p className="text-emerald-300/80 leading-relaxed">
              Thank you! Your transaction reference has been logged. Your <strong>{planDetails.title}</strong> account access is being activated.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase"
            >
              Done & Return to Workspace
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitVerification} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-white/60 uppercase tracking-wider block">
                Your Synaps Account Email *
              </label>
              <input
                type="email"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-white/60 uppercase tracking-wider block">
                UTR / Reference Number (Optional)
              </label>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 421988102931 or GPay Reference ID"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Verifying Payment...' : 'I Have Completed UPI Payment'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
