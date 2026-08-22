"use client";

import React from "react";
import { ShaderAnimation } from "@/components/ui/shader-animation";

export function CausarixShaderHero() {
  return (
    <div className="relative flex h-[520px] sm:h-[650px] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-cyan-900/40 bg-black shadow-2xl">
      <ShaderAnimation />
      <div className="absolute pointer-events-none z-10 flex flex-col items-center justify-center text-center px-4 space-y-2">
        <span className="text-5xl sm:text-7xl lg:text-8xl leading-none font-extrabold tracking-tight text-white drop-shadow-[0_0_35px_rgba(6,182,212,0.6)] font-sans uppercase">
          CAUSARIX
        </span>
        <span className="text-xs sm:text-sm font-mono tracking-[0.25em] text-cyan-300 font-bold uppercase drop-shadow-md">
          ADVANCED CAUSAL AI · TECHNOLOGIES
        </span>
      </div>
    </div>
  );
}

export default CausarixShaderHero;
