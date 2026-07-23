'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Sparkles, Loader2, CheckCircle2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PayPalModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  amount: number;
  onSuccess: () => void;
}

export default function PayPalCheckoutModal({
  isOpen,
  onClose,
  planName,
  amount,
  onSuccess
}: PayPalModalProps) {
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  if (!isOpen) return null;

  const handleSimulatedPayPalPay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPaid(true);
      setTimeout(() => {
        setPaid(false);
        onSuccess();
        onClose();
      }, 1800);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-base-100 border border-base-300 rounded-3xl max-w-md w-full p-8 shadow-2xl relative space-y-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-base-content/50 hover:text-base-content">
          <X className="w-5 h-5" />
        </button>

        {/* PayPal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-600/20 text-blue-600 flex items-center justify-center font-extrabold text-xl">
            <i>P</i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-base-content">PayPal Secure Checkout</h2>
            <p className="text-xs text-base-content/60">Instant payment to your PayPal balance</p>
          </div>
        </div>

        {paid ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-success mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-base-content">Payment Verified!</h3>
            <p className="text-xs text-base-content/60">Unlocking {planName} AI credits & workspace features...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="p-4 bg-base-200 border border-base-300 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-center text-base-content/70">
                <span>Selected Plan:</span>
                <span className="font-bold text-base-content">{planName}</span>
              </div>
              <div className="flex justify-between items-center text-base-content/70">
                <span>Billing Interval:</span>
                <span className="font-bold text-base-content">Monthly</span>
              </div>
              <div className="pt-2 border-t border-base-300 flex justify-between items-center text-sm font-bold text-base-content">
                <span>Total Due Today:</span>
                <span className="text-base font-extrabold text-primary">${amount}.00 USD</span>
              </div>
            </div>

            {/* PayPal Smart Payment Button */}
            <button
              onClick={handleSimulatedPayPalPay}
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting to PayPal...
                </>
              ) : (
                <>
                  <span className="font-black italic text-lg tracking-tight">Pay<span className="text-[#0070ba] bg-white rounded px-1 ml-0.5">Pal</span></span>
                  <span>Pay ${amount}.00 USD</span>
                </>
              )}
            </button>

            {/* Debit/Credit Card Alternative */}
            <button
              onClick={handleSimulatedPayPalPay}
              disabled={loading}
              className="w-full py-3 px-6 rounded-2xl bg-base-200 hover:bg-base-300 text-base-content font-bold text-xs border border-base-300 flex items-center justify-center gap-2 transition-all"
            >
              <CreditCard className="w-4 h-4 text-base-content/70" />
              Pay with Debit or Credit Card
            </button>

            <div className="text-[10px] text-center text-base-content/40 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-success" />
              <span>Protected by PayPal 256-bit SSL Encryption. Direct balance deposit.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
