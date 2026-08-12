"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MessageSquare, Sparkles, Building2, Scale, 
  FileText, Layers, Download, Compass, ShieldAlert 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { downloadMasterAIReport } from "@/lib/export-helpers";

interface TabItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  badge?: string;
}

const TABS: TabItem[] = [
  { id: "chat", label: "Executive Chat", href: "/dashboard/chat", icon: MessageSquare },
  { id: "chief-of-staff", label: "Chief of Staff", href: "/dashboard/chief-of-staff", icon: Sparkles, badge: "AI" },
  { id: "boardroom", label: "Boardroom", href: "/dashboard/boardroom", icon: Building2 },
  { id: "decisions", label: "Decisions", href: "/dashboard/decisions", icon: Scale },
  { id: "documents", label: "Vault", href: "/dashboard/documents", icon: FileText },
  { id: "graph", label: "Memory Graph", href: "/dashboard/graph", icon: Layers },
];

export function BottomTabBarNav() {
  const pathname = usePathname();
  const [exporting, setExporting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handlePdfExport = async () => {
    setExporting(true);
    try {
      await downloadMasterAIReport("PDF");
    } catch (e) {
      console.error("PDF Export error:", e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] pointer-events-auto",
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95 pointer-events-none"
      )}
    >
      {/* Sleek Floating Glassmorphic Pill Container (Matching 2nd UI reference image) */}
      <div className="flex items-center gap-1.5 p-2 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 text-white">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href || pathname?.startsWith(tab.href + "/");
          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "relative group flex flex-col sm:flex-row items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold transition-all duration-300 select-none outline-none",
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-400 group-hover:text-cyan-400")} />
              <span className="hidden sm:inline-block text-[11px] font-sans tracking-tight">{tab.label}</span>
              
              {tab.badge && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[9px] font-black text-black shadow-sm">
                  {tab.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="h-6 w-px bg-slate-700/80 mx-1 shrink-0" />

        {/* 1-Click PDF Export Trigger Button */}
        <button
          onClick={handlePdfExport}
          disabled={exporting}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/40 text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
          title="Export AI Report as PDF"
        >
          <Download className={cn("w-4 h-4", exporting && "animate-bounce")} />
          <span className="hidden md:inline-block text-[11px] font-mono uppercase tracking-wider">
            {exporting ? "Exporting..." : "PDF Report"}
          </span>
        </button>
      </div>
    </div>
  );
}
