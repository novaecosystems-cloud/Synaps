"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Sparkles, Check, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdaptiveEnterpriseOnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const isCompleted = localStorage.getItem("causarix_mobile_card_onboarding_v3");
    if (!isCompleted) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = (redirectPath?: string) => {
    localStorage.setItem("causarix_mobile_card_onboarding_v3", "true");
    localStorage.setItem("causarix_dashboard_intro_completed_v2", "true");
    localStorage.setItem("causarix_onboarding_completed", "true");
    setIsOpen(false);
    if (redirectPath) {
      router.push(redirectPath);
    }
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const slides = [
    // ── SLIDE 1: STRAIGHT TO THE POINT ───────────────────────────────────────
    {
      id: 0,
      badge: "DECISION INTELLIGENCE",
      titlePrefix: "Everything is",
      highlightWord: "straight",
      titleSuffix: "to the point.",
      description: "Determine your corporate planning easily with Causarix. Everything is right on track with 0.00% math drift and 100% SHA-256 evidence, no problem!",
      buttonText: "Next Feature",
      accentColor: "#FF6B4A", // Vibrant coral orange from reference
      renderIllustration: () => (
        <div className="relative w-full h-56 flex items-center justify-center">
          {/* Ambient Warm Gradient Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-100/60 via-orange-50/40 to-transparent rounded-3xl" />
          
          <svg viewBox="0 0 320 220" className="w-64 h-48 drop-shadow-md">
            {/* Background calendar board */}
            <rect x="40" y="45" width="170" height="135" rx="14" fill="#FEE588" stroke="#F6C444" strokeWidth="2.5" />
            <rect x="52" y="70" width="146" height="98" rx="8" fill="#F87171" />
            
            {/* Calendar spiral rings */}
            <circle cx="65" cy="45" r="4" fill="#FFF" stroke="#E2A928" strokeWidth="2" />
            <circle cx="95" cy="45" r="4" fill="#FFF" stroke="#E2A928" strokeWidth="2" />
            <circle cx="125" cy="45" r="4" fill="#FFF" stroke="#E2A928" strokeWidth="2" />
            <circle cx="155" cy="45" r="4" fill="#FFF" stroke="#E2A928" strokeWidth="2" />
            <circle cx="185" cy="45" r="4" fill="#FFF" stroke="#E2A928" strokeWidth="2" />

            {/* Calendar Grid Lines */}
            <line x1="52" y1="98" x2="198" y2="98" stroke="#FCA5A5" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="52" y1="126" x2="198" y2="126" stroke="#FCA5A5" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="100" y1="70" x2="100" y2="168" stroke="#FCA5A5" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="150" y1="70" x2="150" y2="168" stroke="#FCA5A5" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Checkmarks */}
            <path d="M70 115 L78 122 L92 108" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M120 142 L128 149 L142 135" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M168 115 L176 122 L190 108" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

            {/* Growth Trendline Arrow */}
            <path d="M60 145 Q120 100 185 60 Q210 45 250 25" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
            <polygon points="255,20 238,22 248,35" fill="#F59E0B" />

            {/* Deco leaves left */}
            <path d="M25 65 Q40 55 35 75 Q20 85 25 65" fill="#34D399" />
            <path d="M22 80 Q38 75 30 95 Q15 100 22 80" fill="#10B981" />

            {/* Stylized Executive Character */}
            {/* Body */}
            <rect x="225" y="80" width="34" height="60" rx="6" fill="#FDE047" />
            {/* Tie */}
            <polygon points="240,82 244,82 242,105" fill="#EF4444" />
            {/* Head */}
            <circle cx="242" cy="62" r="14" fill="#FCD34D" />
            <path d="M232 58 Q242 46 254 54 Q256 64 246 68 Z" fill="#1E1B4B" />
            {/* Pants */}
            <rect x="225" y="135" width="15" height="50" rx="3" fill="#2563EB" />
            <rect x="244" y="135" width="15" height="50" rx="3" fill="#1D4ED8" />
            {/* Shoes */}
            <ellipse cx="230" cy="186" rx="8" ry="4" fill="#1E293B" />
            <ellipse cx="254" cy="186" rx="8" ry="4" fill="#1E293B" />

            {/* Huge Pen held by character */}
            <g transform="rotate(-35 220 70)">
              <rect x="180" y="45" width="85" height="16" rx="3" fill="#2563EB" />
              <polygon points="180,45 160,53 180,61" fill="#93C5FD" />
              <polygon points="165,51 155,53 165,55" fill="#1E293B" />
              <rect x="260" y="45" width="8" height="16" fill="#1E40AF" />
            </g>
          </svg>
        </div>
      )
    },

    // ── SLIDE 2: PICK EVERY SCENARIO ─────────────────────────────────────────
    {
      id: 1,
      badge: "SCM COUNTERFACTUALS",
      titlePrefix: "Pick every",
      highlightWord: "scenario",
      titleSuffix: "that you want!",
      description: "Simulate high-stakes business what-ifs easily with Causarix. 10 C-suite digital twins test every downside with zero arithmetic drift, no problem, guys!",
      buttonText: "Next Feature",
      accentColor: "#FF6B4A",
      renderIllustration: () => (
        <div className="relative w-full h-56 flex items-center justify-center">
          {/* Ambient Warm Gradient Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-orange-100/60 via-amber-50/40 to-transparent rounded-3xl" />

          <svg viewBox="0 0 320 220" className="w-64 h-48 drop-shadow-md">
            {/* Radiating Upward Energy Arrows */}
            <path d="M160 110 Q140 60 120 40" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="116,36 122,46 128,38" fill="#38BDF8" />

            <path d="M165 110 Q165 55 165 30" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="165,24 160,34 170,34" fill="#38BDF8" />

            <path d="M170 110 Q190 60 210 40" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="214,36 206,38 212,46" fill="#38BDF8" />

            {/* Floating Gift Boxes & Scenario Packages */}
            {/* Orange Gift Box Top Right */}
            <rect x="195" y="25" width="36" height="36" rx="6" fill="#F97316" />
            <line x1="213" y1="25" x2="213" y2="61" stroke="#FDE047" strokeWidth="4" />
            <line x1="195" y1="43" x2="231" y2="43" stroke="#FDE047" strokeWidth="4" />
            <circle cx="213" cy="25" r="5" fill="#FDE047" />

            {/* Shopping Bag Top Left */}
            <path d="M105 35 L125 35 L130 58 L100 58 Z" fill="#FBBF24" />
            <path d="M110 35 Q115 22 120 35" fill="none" stroke="#D97706" strokeWidth="2" />

            {/* Red Floating Hearts */}
            <path d="M235 30 Q240 24 245 30 Q250 36 245 42 L240 48 L235 42 Z" fill="#EF4444" />
            <path d="M250 45 Q254 40 258 45 Q262 50 258 55 L254 60 L250 55 Z" fill="#F87171" transform="scale(0.7) translate(100, 10)" />

            {/* Navy Blue Bottom Gift Bags */}
            <rect x="110" y="115" width="45" height="50" rx="6" fill="#1E1B4B" />
            <path d="M125 115 Q132 100 140 115" fill="none" stroke="#FDE047" strokeWidth="2" />
            <polygon points="132,130 135,138 143,138 137,143 139,151 132,146 125,151 127,143 121,138 129,138" fill="#FDE047" transform="scale(0.8) translate(30, 20)" />

            {/* Stylized Executive operating tablet */}
            <rect x="180" y="95" width="30" height="45" rx="5" fill="#FDE047" />
            <circle cx="205" cy="75" r="14" fill="#FCD34D" />
            <path d="M195 72 Q205 60 218 68 Q220 78 210 82 Z" fill="#1E1B4B" />
            <path d="M195 85 Q220 85 225 125 L180 125 Z" fill="#4338CA" />

            {/* Tablet in hand */}
            <rect x="155" y="88" width="36" height="28" rx="4" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
            <rect x="160" y="92" width="26" height="20" rx="2" fill="#38BDF8" />
            <line x1="164" y1="98" x2="182" y2="98" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="164" y1="104" x2="176" y2="104" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Green plants around */}
            <path d="M85 140 Q105 130 95 160 Q80 165 85 140" fill="#10B981" />
            <path d="M225 140 Q245 130 235 165 Q220 170 225 140" fill="#059669" />
          </svg>
        </div>
      )
    },

    // ── SLIDE 3: FLASH DISPATCH / GET STARTED ────────────────────────────────
    {
      id: 2,
      badge: "AUTONOMOUS EXECUTION",
      titlePrefix: "Instant dispatch",
      highlightWord: "everyday,",
      titleSuffix: "all of happy now.",
      description: "Turn boardroom consensus into immediate Jira tickets, Delaware legal proofs, and automated cash hedging. Everything is right on track, no problem, guys!",
      buttonText: "Get Started",
      accentColor: "#FF6B4A",
      renderIllustration: () => (
        <div className="relative w-full h-56 flex items-center justify-center">
          {/* Ambient Warm Gradient Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-red-100/60 via-amber-50/40 to-transparent rounded-3xl" />

          <svg viewBox="0 0 320 220" className="w-64 h-48 drop-shadow-md">
            {/* Background Golden Glow Frame */}
            <rect x="80" y="40" width="160" height="145" rx="14" fill="none" stroke="#FDE047" strokeWidth="2" strokeDasharray="6 6" />

            {/* FLASH SALE / DISPATCH RIBBON BADGE */}
            <g transform="rotate(-12 110 60)">
              <rect x="60" y="45" width="105" height="32" rx="6" fill="#1E1B4B" />
              <text x="75" y="66" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1">
                FLASH
              </text>
              <polygon points="60,77 150,77 140,95 60,95" fill="#EF4444" />
              <text x="80" y="90" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                DISPATCH
              </text>
            </g>

            {/* Stacked Gift Boxes Carried by Character */}
            {/* Top Box Orange */}
            <rect x="175" y="30" width="28" height="24" rx="4" fill="#F97316" />
            <line x1="189" y1="30" x2="189" y2="54" stroke="#FEF08A" strokeWidth="2.5" />
            <circle cx="189" cy="30" r="3" fill="#FEF08A" />

            {/* Middle Box Cyan */}
            <rect x="165" y="52" width="38" height="28" rx="4" fill="#06B6D4" />
            <line x1="184" y1="52" x2="184" y2="80" stroke="#FFFFFF" strokeWidth="2.5" />
            <polygon points="184,60 178,68 190,68" fill="#F43F5E" />

            {/* Bottom Large Green Box */}
            <rect x="155" y="78" width="46" height="34" rx="4" fill="#10B981" />
            <line x1="178" y1="78" x2="178" y2="112" stroke="#FFFFFF" strokeWidth="2.5" />

            {/* Confetti & Lightning */}
            <polygon points="215,35 225,25 220,45" fill="#FDE047" />
            <polygon points="75,120 85,110 80,130" fill="#FDE047" />
            <circle cx="230" cy="70" r="3" fill="#EF4444" />
            <circle cx="95" cy="40" r="3" fill="#3B82F6" />

            {/* Happy Walking Executive Character */}
            <circle cx="205" cy="65" r="13" fill="#FCD34D" />
            <path d="M195 62 Q205 50 220 58 Q222 70 210 74 Z" fill="#1E1B4B" />
            {/* Ponytail */}
            <path d="M218 60 Q235 55 230 75" fill="none" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" />

            {/* Skirt & Legs in motion */}
            <polygon points="180,110 210,110 220,145 170,145" fill="#FDE047" />
            <line x1="188" y1="145" x2="175" y2="180" stroke="#FCD34D" strokeWidth="5" strokeLinecap="round" />
            <line x1="202" y1="145" x2="218" y2="178" stroke="#FCD34D" strokeWidth="5" strokeLinecap="round" />
            {/* Pink High Heels */}
            <polygon points="175,180 165,184 175,186" fill="#F43F5E" />
            <polygon points="218,178 228,182 220,185" fill="#F43F5E" />

            {/* Floating Blue Gift Box bottom left */}
            <rect x="125" y="145" width="28" height="26" rx="4" fill="#1E1B4B" />
            <line x1="139" y1="145" x2="139" y2="171" stroke="#FDE047" strokeWidth="2.5" />
            <line x1="125" y1="158" x2="153" y2="158" stroke="#FDE047" strokeWidth="2.5" />
          </svg>
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  const current = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-amber-950/20 backdrop-blur-md animate-fade-in font-sans">
      {/* ── CARD CONTAINER (Matches Clean Vertical Proportions of Reference) ── */}
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-[360px] sm:max-w-[380px] bg-[#FFFFFF] text-[#1E293B] rounded-[36px] p-6 sm:p-7 shadow-[0_24px_70px_rgba(249,115,22,0.18),0_10px_30px_rgba(0,0,0,0.08)] border border-orange-100/80 relative flex flex-col justify-between overflow-hidden"
      >
        {/* Subtle Ambient Light in Card Background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row (Badge + Skip Button) */}
        <div className="flex items-center justify-between z-10">
          <span className="text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-orange-100/80 text-[#FF6B4A]">
            {current.badge}
          </span>

          <button
            onClick={() => handleComplete()}
            className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors px-2 py-1"
          >
            Skip
          </button>
        </div>

        {/* Top Illustration Area */}
        <div className="my-2 z-10">
          {current.renderIllustration()}
        </div>

        {/* Middle Typography Area (Big Bold Headline with highlighted word) */}
        <div className="text-left space-y-3 z-10">
          <h2 className="text-3xl sm:text-[34px] font-black tracking-tight text-[#111827] leading-[1.12]">
            {current.titlePrefix}{" "}
            <span className="text-[#FF6B4A]">{current.highlightWord}</span>{" "}
            {current.titleSuffix}
          </h2>

          <p className="text-xs sm:text-[13px] text-slate-500 font-medium leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Bottom Button Action */}
        <div className="mt-6 space-y-4 z-10">
          <button
            onClick={nextSlide}
            className="w-full py-4 rounded-2xl bg-[#FF6B4A] hover:bg-[#F25A37] active:scale-[0.98] text-white font-bold text-sm tracking-tight shadow-[0_8px_24px_rgba(255,107,74,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{current.buttonText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* ── SEGMENTED PROGRESS BARS (Matches Reference: — — —) ── */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? "w-10 bg-[#FF6B4A]"
                    : "w-8 bg-slate-200 hover:bg-slate-300"
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AdaptiveEnterpriseOnboardingModal;
