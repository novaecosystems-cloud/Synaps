"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, Tag, Check, ShoppingBag, ShieldCheck
} from "lucide-react";
import { getGumroadCheckoutUrl } from "@/lib/gumroad";

interface TimedUsagePaywallModalProps {
  userPlan?: string;
  userEmail?: string;
  isPremium?: boolean;
  onCloseOverride?: () => void;
}

const USAGE_LIMIT_SECONDS = 7 * 60; // 7 minutes = 420 seconds
const STORAGE_KEY = "causarix_active_usage_seconds_v1";
const EXTENSION_KEY = "causarix_usage_extended_v1";

export default function TimedUsagePaywallModal({
  userPlan = "free",
  userEmail,
  isPremium = false,
  onCloseOverride,
}: TimedUsagePaywallModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasExtended, setHasExtended] = useState(false);

  // Discount & Gumroad State
  const [promoCodeInput, setPromoCodeInput] = useState("LAUNCH100");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    percentage: number;
    isValid: boolean;
  }>({
    code: "LAUNCH100",
    percentage: 61,
    isValid: true,
  });

  // Track active time spent on the app
  useEffect(() => {
    if (isPremium || userPlan === "max" || userPlan === "enterprise") {
      return; // Never trigger paywall for subscribed premium users
    }

    try {
      const storedSecs = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
      const storedExtended = localStorage.getItem(EXTENSION_KEY) === "true";
      setHasExtended(storedExtended);

      const limit = storedExtended ? USAGE_LIMIT_SECONDS + 180 : USAGE_LIMIT_SECONDS;
      if (storedSecs >= limit) {
        setIsOpen(true);
      }
    } catch (e) {}

    const timer = setInterval(() => {
      try {
        const storedSecs = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
        const next = storedSecs + 1;
        localStorage.setItem(STORAGE_KEY, next.toString());
        const extended = localStorage.getItem(EXTENSION_KEY) === "true";
        const currentLimit = extended ? USAGE_LIMIT_SECONDS + 180 : USAGE_LIMIT_SECONDS;
        
        if (next >= currentLimit && !isOpen) {
          setIsOpen(true);
        }
      } catch (e) {}
    }, 1000);

    return () => clearInterval(timer);
  }, [isPremium, userPlan, isOpen]);

  const handleVerifyDiscount = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = promoCodeInput.trim().toUpperCase();
    if (cleanCode === "LAUNCH100") {
      setAppliedDiscount({ code: "LAUNCH100", percentage: 61, isValid: true });
    } else if (cleanCode === "SYNAPS50") {
      setAppliedDiscount({ code: "SYNAPS50", percentage: 50, isValid: true });
    } else if (cleanCode.length > 0) {
      setAppliedDiscount({ code: cleanCode, percentage: 20, isValid: true });
    } else {
      setAppliedDiscount({ code: "", percentage: 0, isValid: false });
    }
  };

  const handleCheckout = (plan: "pro" | "enterprise") => {
    const url = getGumroadCheckoutUrl(
      plan,
      userEmail,
      appliedDiscount.isValid ? appliedDiscount.code : undefined
    );
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleExtendSession = () => {
    try {
      localStorage.setItem(EXTENSION_KEY, "true");
      setHasExtended(true);
      setIsOpen(false);
      if (onCloseOverride) onCloseOverride();
    } catch (e) {}
  };

  // Pricing calculations
  const baseStandard = 29;
  const baseEnterprise = 100;
  const standardPrice = appliedDiscount.isValid && appliedDiscount.code !== "LAUNCH100"
    ? Math.round(baseStandard * (1 - appliedDiscount.percentage / 100))
    : baseStandard;
  const enterprisePrice = appliedDiscount.isValid
    ? appliedDiscount.code === "LAUNCH100" ? 39 : Math.round(baseEnterprise * (1 - appliedDiscount.percentage / 100))
    : baseEnterprise;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-4xl bg-[#090d16] border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden relative my-auto text-white p-6 sm:p-10 space-y-8"
        >
          {/* Specular Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#fc4778]/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Header */}
          <div className="space-y-3 relative z-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider shadow-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>7-Minute Executive Evaluation Session Concluded</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              You've experienced Causarix.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-[#fc4778] to-indigo-300">
                Preserve your enterprise memory.
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Your free 7-minute test-drive window has ended. Upgrade to Pro or Enterprise to maintain continuous 10-Agent Boardroom Quorum, 60s Delaware Redlines, and KùzuDB graph traversal.
            </p>
          </div>

          {/* Promo Code Strip */}
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-2 font-mono text-xs text-amber-300 font-bold">
              <Tag className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Pioneer Launch Special: Code <strong className="text-white bg-white/10 px-1.5 py-0.5 rounded">LAUNCH100</strong> active for 61% OFF Enterprise Pro ($39/mo).</span>
            </div>

            <form onSubmit={handleVerifyDiscount} className="flex gap-2 w-full sm:w-auto shrink-0">
              <input
                type="text"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                placeholder="Enter promo code"
                className="px-3 py-1.5 rounded-lg border border-white/20 bg-black/60 font-mono text-xs text-white uppercase focus:outline-none focus:border-amber-400 w-36"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-black uppercase transition-all"
              >
                Check
              </button>
            </form>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 items-stretch">
            {/* Standard Pro Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-300 font-bold uppercase tracking-wider">
                    PRO WORKSPACE
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 font-mono text-[10px] font-bold">
                    SOLO OPERATOR
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                      ${standardPrice}
                    </span>
                    <span className="text-xs text-slate-400 font-sans font-medium">/month</span>
                  </div>
                  <p className="text-[11px] font-mono text-emerald-400 font-bold mt-1">
                    ⚡ Just ${(standardPrice / 30).toFixed(2)}/day — less than a coffee
                  </p>
                </div>

                <ul className="space-y-2 text-xs font-mono text-slate-200">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Up to 500 documents indexed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>10,000 AI Credits / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Daily Chief of Staff Briefings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Document & Web RAG Search</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleCheckout("pro")}
                className="w-full py-3 rounded-xl bg-white hover:bg-slate-200 text-black font-mono text-xs font-black uppercase transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Get Pro (${standardPrice}/mo)</span>
              </button>
            </div>

            {/* Enterprise Sovereign Card (Highlighted) */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-black border-2 border-amber-400/80 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-[#fc4778] to-indigo-500" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-[#fc4778] text-black font-mono text-[10px] font-black uppercase tracking-wider">
                    ⭐ MOST POPULAR · 84% CHOOSE THIS
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold">
                    61% OFF ACTIVE
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                      ${enterprisePrice}
                    </span>
                    <span className="text-xs text-slate-400 font-sans font-medium">/month</span>
                    <span className="font-mono text-sm text-slate-500 line-through font-bold">
                      ${baseEnterprise}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-amber-300 font-bold mt-1">
                    ⚡ Just ${(enterprisePrice / 30).toFixed(2)}/day for 10 C-Suite AI Agents
                  </p>
                </div>

                <ul className="space-y-2 text-xs font-mono text-white font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Unlimited documents & repositories</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>10-Agent Boardroom Quorum Deliberations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Automated Delaware DGCL § 141 Redlines</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Deterministic Pyodide WASM Financial Models</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleCheckout("enterprise")}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-[#fc4778] hover:from-white hover:to-white hover:text-black text-black font-mono text-xs font-black uppercase transition-all shadow-lg flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.3)]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Get Enterprise Pro (${enterprisePrice}/mo)</span>
              </button>
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400 relative z-10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Processed securely by Gumroad Merchant of Record · 1-Click Cancel Anytime</span>
            </div>

            {!hasExtended && (
              <button
                onClick={handleExtendSession}
                className="text-slate-400 hover:text-white underline text-[11px] transition-colors"
              >
                Extend Evaluation Session by 3 Minutes (One-Time) →
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
