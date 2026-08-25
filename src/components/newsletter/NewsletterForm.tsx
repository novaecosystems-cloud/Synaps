"use client";

import React, { useState } from "react";
import { Mail, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center justify-center gap-2 shadow-xl">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>Subscribed: Executive Research Dispatch briefings will be delivered to {email}.</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-2 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-2xl flex flex-col sm:flex-row items-stretch gap-2"
    >
      <div className="relative flex-1">
        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="executive@institution.com"
          className="w-full pl-10 pr-4 py-3 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none font-mono"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Subscribing...</span>
          </>
        ) : (
          <>
            <span>Subscribe</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
}

export default NewsletterForm;
