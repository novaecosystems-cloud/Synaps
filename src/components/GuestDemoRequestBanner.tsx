"use client";

import React, { useState, useEffect } from "react";
import { Zap, Lock, Sparkles, ArrowRight, UserPlus, ShieldAlert } from "lucide-react";
import SignInModal from "@/components/SignInModal";

export function GuestDemoRequestBanner({ isGuest }: { isGuest?: boolean }) {
  const [requestsUsed, setRequestsUsed] = useState<number>(0);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  useEffect(() => {
    const count = parseInt(localStorage.getItem("causarix_guest_requests_used") || "0", 10);
    setRequestsUsed(count);

    // Listen for custom request events from dashboard buttons
    const handleGuestAction = () => {
      const current = parseInt(localStorage.getItem("causarix_guest_requests_used") || "0", 10);
      const updated = current + 1;
      localStorage.setItem("causarix_guest_requests_used", updated.toString());
      setRequestsUsed(updated);

      if (updated > 2) {
        setIsSignInOpen(true);
      }
    };

    window.addEventListener("causarix_guest_request_made", handleGuestAction);
    return () => window.removeEventListener("causarix_guest_request_made", handleGuestAction);
  }, []);

  if (!isGuest) return null;

  const remaining = Math.max(0, 2 - requestsUsed);

  return (
    <>
      <div className="w-full bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-primary/20 border-b border-amber-500/30 px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-sans z-40 backdrop-blur-md">
        <div className="flex items-center gap-2 text-slate-200">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
          <span className="font-mono font-bold text-amber-400 uppercase tracking-wider">
            GUEST DEMO MODE:
          </span>
          <span className="text-slate-300">
            {remaining > 0 ? (
              <>
                You have <strong className="text-cyan-300 font-mono text-sm px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/50">{remaining} of 2</strong> free guest requests remaining.
              </>
            ) : (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> 2 Free Guest Runs Exhausted
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsSignInOpen(true)}
            className="px-3 py-1 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1 transition-all shadow-md cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign In for 50 Daily Free Runs</span>
          </button>
        </div>
      </div>

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />
    </>
  );
}

export default GuestDemoRequestBanner;
