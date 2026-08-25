"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, CheckCircle2, X, ArrowRight, Zap, 
  Lightbulb, ShieldCheck, HelpCircle, Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBDASHBOARD_GUIDES, SubdashboardGuide } from "@/lib/subdashboard-guides";

export function SubdashboardIntroModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeGuide, setActiveGuide] = useState<SubdashboardGuide | null>(null);

  // Normalize pathname to find matching guide
  useEffect(() => {
    if (!pathname) return;

    // Direct match or parent match (e.g. /dashboard/documents/123 -> /dashboard/documents)
    let matchedGuide: SubdashboardGuide | null = SUBDASHBOARD_GUIDES[pathname] || null;
    
    if (!matchedGuide) {
      const parentPath = Object.keys(SUBDASHBOARD_GUIDES).find(p => p !== '/dashboard' && pathname.startsWith(p));
      if (parentPath) {
        matchedGuide = SUBDASHBOARD_GUIDES[parentPath];
      }
    }

    if (!matchedGuide) {
      setIsOpen(false);
      return;
    }

    setActiveGuide(matchedGuide);
    // Modal will ONLY open when the user explicitly triggers it (e.g. clicking the Help/Tour icon)
    setIsOpen(false);
  }, [pathname]);

  // Support manual trigger from any page via custom event
  useEffect(() => {
    const handleManualOpen = () => {
      if (activeGuide) {
        setIsOpen(true);
      }
    };
    window.addEventListener("open_subdashboard_guide", handleManualOpen);
    return () => window.removeEventListener("open_subdashboard_guide", handleManualOpen);
  }, [activeGuide]);

  const handleDismiss = () => {
    if (activeGuide) {
      const storageKey = `causarix_seen_guide_${activeGuide.routeKey}_v1`;
      localStorage.setItem(storageKey, "true");
    }
    setIsOpen(false);
  };

  if (!isOpen || !activeGuide) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="w-full max-w-lg bg-gradient-to-b from-[#181715] via-[#121110] to-[#0A0A0A] text-[#ECE9E3] border border-primary/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col justify-between text-left"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-5 right-5 p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors z-10"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-[10px] font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>{activeGuide.badge} · QUICK GUIDE</span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
              {activeGuide.title}
            </h2>
            <p className="text-xs font-mono text-primary font-bold mt-0.5">
              {activeGuide.tagline}
            </p>
          </div>
        </div>

        {/* What It Does Card */}
        <div className="py-4 space-y-3.5">
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-white/50 uppercase font-bold tracking-wider block">
              🎯 What This Subdashboard Does:
            </span>
            <p className="text-xs text-white/90 leading-relaxed font-medium">
              {activeGuide.whatItDoes}
            </p>
          </div>

          {/* How It Helps You */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-white/50 uppercase font-bold tracking-wider block px-1">
              💡 How It Helps You & Your Team:
            </span>
            <div className="space-y-1.5">
              {activeGuide.howItHelps.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-white/80 leading-relaxed px-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro-Tip Box */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-snug text-[11px]">
              <strong className="font-bold text-amber-300">Executive Pro-Tip:</strong> {activeGuide.proTip}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
          <span className="text-[10px] font-mono text-white/40">
            Shown once per subdashboard
          </span>
          <Button
            size="sm"
            onClick={handleDismiss}
            className="btn btn-primary btn-sm rounded-xl text-xs font-mono font-bold gap-1.5 shadow-md shadow-primary/20"
          >
            {activeGuide.primaryActionLabel} <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default SubdashboardIntroModal;
