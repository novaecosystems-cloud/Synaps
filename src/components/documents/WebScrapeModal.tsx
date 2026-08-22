"use client";

import React, { useState } from "react";
import { 
  Globe, X, Loader2, CheckCircle2, ArrowRight, Sparkles, 
  FileText, ExternalLink, ShieldCheck, Zap, Layers 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface WebScrapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function WebScrapeModal({ isOpen, onClose, onSuccess }: WebScrapeModalProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  if (!isOpen) return null;

  const presets = [
    { label: "Stripe Docs", url: "https://stripe.com" },
    { label: "Hacker News", url: "https://news.ycombinator.com" },
    { label: "Anthropic Research", url: "https://www.anthropic.com/research" },
  ];

  const handleScrape = async () => {
    let cleanUrl = url.trim();
    if (!cleanUrl) {
      setError("Please enter a website URL.");
      return;
    }

    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
      setUrl(cleanUrl);
    }

    setLoading(true);
    setError(null);
    setSuccessData(null);

    try {
      const res = await fetch("/api/documents/web-scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to scrape and index webpage.");
      }

      setSuccessData(data.scrapeResult);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0B0D14] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl text-slate-100 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-indigo-500/30 border border-cyan-500/50 flex items-center justify-center text-cyan-300">
            <Globe className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest">
              FIRECRAWL ENGINE · LIVE WEB INGESTION
            </div>
            <h2 className="text-lg font-bold text-white">Ingest Live Website or Domain</h2>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Enter any live website URL. The engine crawls the page, strips ads/popups, converts content to clean <strong>LLM-ready Markdown</strong>, and indexes it into your <strong>Document Vault</strong> for instant Boardroom RAG.
        </p>

        {/* URL Input Form */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300">Website or Page URL</label>
            <div className="flex gap-2 mt-1.5">
              <input
                type="url"
                placeholder="https://example.com/pricing or company.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-2xl bg-black/60 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono transition-all"
              />
              <Button
                onClick={handleScrape}
                disabled={loading || !url.trim()}
                className="px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-black font-extrabold text-xs uppercase tracking-wider gap-1.5 shadow-lg cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-black" />}
                {loading ? "Scraping..." : "Crawl"}
              </Button>
            </div>
          </div>

          {/* 1-Click Presets */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="text-[10px] font-mono text-slate-500">Quick Test:</span>
            {presets.map((p) => (
              <button
                key={p.url}
                onClick={() => setUrl(p.url)}
                className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 space-y-1">
            <div className="font-bold">Scraping Failed</div>
            <p className="text-[11px] text-rose-300/80">{error}</p>
          </div>
        )}

        {/* Loading Animation Status */}
        {loading && (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Firecrawl Engine is Processing Page...</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono space-y-1 pl-6">
              <div>✓ Establishing TLS handshake...</div>
              <div>✓ Extracting semantic HTML elements...</div>
              <div>⚡ Stripping ads, scripts & generating Markdown...</div>
            </div>
          </div>
        )}

        {/* Success Banner */}
        {successData && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Successfully Ingested into Document Vault!</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-black/40 p-3 rounded-xl border border-emerald-900/40">
              <div>
                <span className="text-slate-500 block">Title:</span>
                <span className="text-slate-200 font-bold truncate block">{successData.title}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Words / Chunks:</span>
                <span className="text-cyan-300 font-bold">{successData.wordCount} words ({successData.chunksIndexed} chunks)</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                onClick={onClose}
                className="btn-sm rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs"
              >
                View in Document Vault
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default WebScrapeModal;
