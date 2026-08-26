"use client";

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { PlayCircle, Sparkles, ArrowRight } from 'lucide-react';
import { IoMdCheckmark } from "react-icons/io";
import { LuLoader } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export interface ChecklistItemWithProgress {
  id: number | string;
  text: string;
  status?: "completed" | "in_progress" | "pending";
  helperText?: string;
  helperLink?: {
    href: string;
    text: string;
  };
}

export interface AnimatedOnboardingChecklistProps {
  title?: string;
  description?: string;
  items?: ChecklistItemWithProgress[];
  videoThumbnailUrl?: string;
  videoUrl?: string;
  stepDuration?: number; // duration per step in ms (default: 3000)
  autoAdvance?: boolean;
  className?: string;
}

const DEFAULT_ITEMS: ChecklistItemWithProgress[] = [
  { 
    id: 1, 
    text: "Upload Master Services Agreement (MSA)", 
    helperText: "Supported: PDF, Word, Scanned Images", 
    helperLink: { href: "/dashboard/documents", text: "Upload Vault" } 
  },
  { 
    id: 2, 
    text: "Verify Delaware DGCL § 141 Redlines", 
    helperText: "Automated liability cap check", 
    helperLink: { href: "/dashboard/simulations", text: "View Invariants" } 
  },
  { 
    id: 3, 
    text: "Connect Jira Cloud Board (KAN)", 
    helperText: "1-Click automated mitigation dispatch", 
    helperLink: { href: "/dashboard/settings/api-keys", text: "Configure Token" } 
  },
  { 
    id: 4, 
    text: "Simulate 10-Agent Boardroom Quorum", 
    helperText: "Run $200M M&A counterfactual stress-test", 
    helperLink: { href: "/dashboard/boardroom", text: "Enter Boardroom" } 
  },
];

export const AnimatedOnboardingChecklist = ({
  title = "Welcome to Causarix — Guided Intelligence Setup",
  description = "Watch the automated pipeline calibrate your enterprise invariant graph, or click any step to verify manually.",
  items = DEFAULT_ITEMS,
  videoThumbnailUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",
  stepDuration = 3500,
  autoAdvance = true,
  className,
}: AnimatedOnboardingChecklistProps) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Auto-cycling step engine from OnboardCard
  useEffect(() => {
    if (!autoAdvance) return;

    setProgress(0);
    const progressTimer = setTimeout(() => {
      setProgress(100);
    }, 50);

    const stepTimer = setTimeout(() => {
      setActiveStepIndex((prev) => (prev + 1) % items.length);
    }, stepDuration);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(stepTimer);
    };
  }, [activeStepIndex, autoAdvance, items.length, stepDuration]);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn(
        "w-full max-w-5xl mx-auto bg-card text-card-foreground border border-border rounded-3xl shadow-xl p-6 sm:p-8 overflow-hidden backdrop-blur-md relative",
        className
      )}
    >
      {/* Subtle Background Radial Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Side: Title, Progress Bar, and Interactive Animated Checklist (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Causarix Dynamic Onboarding</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-serif">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Checklist Items with Step Progress Sync */}
          <ul className="space-y-3.5 pt-2">
            {items.map((item, idx) => {
              const isCompleted = idx < activeStepIndex;
              const isCurrent = idx === activeStepIndex;
              const isPending = idx > activeStepIndex;

              return (
                <motion.li
                  key={item.id}
                  variants={itemVariants}
                  onClick={() => setActiveStepIndex(idx)}
                  className={cn(
                    "p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between",
                    isCurrent
                      ? "bg-primary/5 border-primary/40 shadow-sm"
                      : isCompleted
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-muted/40 border-border/60 opacity-60 hover:opacity-100"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Step State Icon */}
                      {isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                          <IoMdCheckmark className="w-3.5 h-3.5" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 animate-spin">
                          <LuLoader className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-muted-foreground text-[10px] font-mono font-bold shrink-0">
                          {idx + 1}
                        </div>
                      )}

                      <div>
                        <span
                          className={cn(
                            "text-sm font-semibold block transition-colors",
                            isCurrent ? "text-primary font-bold" : isCompleted ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {item.text}
                        </span>
                        {item.helperText && (
                          <span className="text-[11px] text-muted-foreground font-medium">
                            {item.helperText}
                          </span>
                        )}
                      </div>
                    </div>

                    {item.helperLink && (
                      <a
                        href={item.helperLink.href}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] font-mono font-bold text-primary hover:underline shrink-0 flex items-center gap-1"
                      >
                        <span>{item.helperLink.text}</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Active Step Progress Fill Bar (From OnboardCard) */}
                  {isCurrent && (
                    <div className="mt-3 ml-9 mr-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        key={activeStepIndex}
                        className="h-full bg-primary rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: stepDuration / 1000, ease: "easeInOut" }}
                      />
                    </div>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* Right Side: Blended Visualizer + Video Modal Trigger (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* 3D Stacked Live Step Card Preview (From OnboardCard) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-black border border-neutral-800 text-white shadow-2xl space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                PIPELINE STATUS
              </span>
              <span>STEP {activeStepIndex + 1} OF {items.length}</span>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                  <div className="animate-spin">
                    <LuLoader className="w-4 h-4" />
                  </div>
                  <span>{items[activeStepIndex]?.text || "Processing Invariants..."}</span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                <motion.div
                  key={activeStepIndex}
                  className="h-full bg-emerald-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: stepDuration / 1000, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Video Guide Modal Trigger */}
          <div className="relative group rounded-2xl overflow-hidden cursor-pointer w-full aspect-video border border-border shadow-md">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative w-full h-full">
                  <img
                    src={videoThumbnailUrl}
                    alt="Causarix Onboarding Video Guide"
                    width={1280}
                    height={720}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 group-hover:bg-black/30 transition-all">
                    <PlayCircle className="h-14 w-14 text-white/90 transform transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
                    <span className="font-mono text-xs font-bold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                      Watch 2-Min Walkthrough
                    </span>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 border-0 overflow-hidden bg-black">
                <div className="aspect-video w-full">
                  <iframe
                    src={videoUrl}
                    title="Causarix Onboarding Video Guide"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  ></iframe>
                </div>
              </DialogContent>
            </Dialog>
          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default AnimatedOnboardingChecklist;
