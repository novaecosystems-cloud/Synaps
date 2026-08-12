"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Custom Loop Hook ────────────────────────────────────────────────────────
export const useLoop = (delay = 1400) => {
  const [key, setKey] = useState(0);

  const incrementKey = useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const interval = setInterval(incrementKey, delay);
    return () => clearInterval(interval);
  }, [delay, incrementKey]);

  return { key };
};

// ─── Preset Dashboard Loading Text Arrays ────────────────────────────────────
const DASHBOARD_LOADING_TEXTS: Record<string, string[]> = {
  chat: [
    "Querying Precision Document Graph...",
    "Verifying Live Web Search Citations...",
    "Synthesising Executive Response...",
    "Calculating Zero-Hallucination Confidence...",
    "Formatting Markdown Answer...",
  ],
  "chief-of-staff": [
    "Scanning Enterprise Communication Channels...",
    "Prioritising Critical Action Items...",
    "Evaluating Risk Exposure Across Projects...",
    "Formulating Chief of Staff Executive Briefing...",
    "Finalising Daily Action Recommendations...",
  ],
  boardroom: [
    "Initializing C-Suite Digital Twins (CEO, CFO, CTO, Legal)...",
    "Running Strategic Scenario Simulations...",
    "Simulating Financial & Legal Consensus...",
    "Calculating Risk-Reward Multipliers...",
    "Generating Board Consensus Proposal...",
  ],
  documents: [
    "Parsing PDF & Word Document Structures...",
    "Extracting Liability & Risk Clauses...",
    "Embedding Source Passages into Vector Memory...",
    "Indexing Document Knowledge Graph...",
    "Finalising Document Processing...",
  ],
  graph: [
    "Traversing Enterprise Memory Graph...",
    "Retrieving Historical Decision Context...",
    "Validating Document Provenance & Lineage...",
    "Synthesising Decision Graph Nodes...",
  ],
  risk: [
    "Scanning Contractual Indemnification Liabilities...",
    "Cross-Referencing Regulatory Compliance Frameworks...",
    "Calculating Enterprise Risk Score...",
    "Generating Executive Mitigation Report...",
  ],
  default: [
    "Connecting to Synaps AI Executive Engine...",
    "Processing Grounded RAG Query...",
    "Verifying Source Traceability...",
    "Finalising AI Response...",
  ],
};

interface SkiperLoopLoaderProps {
  preset?: keyof typeof DASHBOARD_LOADING_TEXTS | string;
  messages?: string[];
  delay?: number;
  className?: string;
  showIcon?: boolean;
}

export function SkiperLoopLoader({
  preset = "default",
  messages: customMessages,
  delay = 1400,
  className,
  showIcon = true,
}: SkiperLoopLoaderProps) {
  const { key } = useLoop(delay);

  const array = useMemo(() => {
    if (customMessages && customMessages.length > 0) return customMessages;
    return DASHBOARD_LOADING_TEXTS[preset] || DASHBOARD_LOADING_TEXTS.default;
  }, [preset, customMessages]);

  const currentItem = useMemo(() => {
    return array[key % array.length];
  }, [array, key]);

  return (
    <div className={cn("inline-flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold tracking-wider py-1.5 px-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 shadow-inner overflow-hidden", className)}>
      {showIcon && (
        <span className="shrink-0 flex items-center justify-center">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
        </span>
      )}

      <div className="relative h-4 overflow-hidden min-w-[220px]">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={key}
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center whitespace-nowrap text-cyan-300"
          >
            {currentItem}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

export { SkiperLoopLoader as Skiper62 };
