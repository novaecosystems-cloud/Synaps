"use client";

import { gsap } from "gsap";
import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Zap, Laptop, CheckCircle, ArrowRight, Play, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface CrowdCanvasProps {
  src?: string;
  rows?: number;
  cols?: number;
  className?: string;
}

export const CrowdCanvas = ({
  src = "/images/peeps/all-peeps.png",
  rows = 15,
  cols = 7,
  className,
}: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Story Animation State
  const [storyStage, setStoryStage] = useState<"walking" | "narrative" | "focused" | "synaps_hero">("walking");
  const [synapsTasksCompleted, setSynapsTasksCompleted] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Helper functions
    const randomRange = (min: number, max: number) => min + Math.random() * (max - min);
    const randomIndex = (array: any[]) => (randomRange(0, array.length) | 0);
    const removeFromArray = (array: any[], i: number) => array.splice(i, 1)[0];
    const removeItemFromArray = (array: any[], item: any) => removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = (array: any[]) => removeFromArray(array, randomIndex(array));
    const getRandomFromArray = (array: any[]) => array[randomIndex(array) | 0];

    // Canvas Stage
    const stage = { width: 0, height: 0 };

    // Procedural Fallback Sprite Generator if external image fails
    const generateFallbackSpriteSheet = (): HTMLCanvasElement => {
      const spriteCanvas = document.createElement("canvas");
      const sRows = rows;
      const sCols = cols;
      const pW = 60;
      const pH = 100;
      spriteCanvas.width = sRows * pW;
      spriteCanvas.height = sCols * pH;
      const sCtx = spriteCanvas.getContext("2d")!;

      const colors = ["#475569", "#64748b", "#334155", "#1e293b", "#0f172a", "#38bdf8", "#00f0ff"];

      for (let r = 0; r < sRows; r++) {
        for (let c = 0; c < sCols; c++) {
          const x = r * pW;
          const y = c * pH;
          const color = colors[(r + c) % colors.length];

          sCtx.save();
          sCtx.translate(x + pW / 2, y + pH / 2);

          // Head
          sCtx.fillStyle = "#e2e8f0";
          sCtx.beginPath();
          sCtx.arc(0, -25, 12, 0, Math.PI * 2);
          sCtx.fill();

          // Body / Suit
          sCtx.fillStyle = color;
          sCtx.beginPath();
          sCtx.roundRect(-14, -10, 28, 40, 6);
          sCtx.fill();

          // Legs
          sCtx.fillStyle = "#1e293b";
          sCtx.fillRect(-10, 30, 8, 25);
          sCtx.fillRect(2, 30, 8, 25);

          // Work accessory (paper stack or briefcase)
          sCtx.fillStyle = "#f59e0b";
          sCtx.fillRect(-18, 0, 8, 14);

          sCtx.restore();
        }
      }
      return spriteCanvas;
    };

    type Peep = {
      image: HTMLImageElement | HTMLCanvasElement;
      rect: number[];
      width: number;
      height: number;
      drawArgs: any[];
      x: number;
      y: number;
      anchorY: number;
      scaleX: number;
      isFocusedMan?: boolean;
      walk: any;
      setRect: (rect: number[]) => void;
      render: (ctx: CanvasRenderingContext2D) => void;
    };

    const createPeep = ({
      image,
      rect,
      isFocused = false,
    }: {
      image: HTMLImageElement | HTMLCanvasElement;
      rect: number[];
      isFocused?: boolean;
    }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        isFocusedMan: isFocused,
        walk: null,
        setRect: (r: number[]) => {
          peep.rect = r;
          peep.width = r[2];
          peep.height = r[3];
          peep.drawArgs = [peep.image, ...r, 0, 0, peep.width, peep.height];
        },
        render: (c: CanvasRenderingContext2D) => {
          c.save();
          c.translate(peep.x, peep.y);
          c.scale(peep.scaleX, 1);

          // If this is the focused hero man, draw glowing aura behind him!
          if (peep.isFocusedMan) {
            c.shadowColor = "#00f0ff";
            c.shadowBlur = 35;
            c.fillStyle = "rgba(0, 240, 255, 0.25)";
            c.beginPath();
            c.arc(peep.width / 2, peep.height / 2, 60, 0, Math.PI * 2);
            c.fill();
          }

          c.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height
          );

          // Draw Glowing Synaps Laptop if he is the focused hero
          if (peep.isFocusedMan) {
            // Laptop screen
            c.fillStyle = "#0a0a10";
            c.strokeStyle = "#00f0ff";
            c.lineWidth = 2;
            c.beginPath();
            c.roundRect(peep.width / 2 - 18, peep.height / 2 - 10, 36, 22, 4);
            c.fill();
            c.stroke();

            // Screen glow
            c.fillStyle = "#00f0ff";
            c.fillRect(peep.width / 2 - 14, peep.height / 2 - 6, 28, 14);

            // Laptop keyboard base
            c.fillStyle = "#1e293b";
            c.fillRect(peep.width / 2 - 24, peep.height / 2 + 12, 48, 6);
          }

          c.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    const resetPeep = ({ stage, peep }: { stage: any; peep: any }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return { startX, startY, endX };
    };

    const normalWalk = ({ peep, props }: { peep: any; props: any }) => {
      const { startX, startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.5, 1.5));
      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: "none",
        },
        0
      );
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: Math.floor(xDuration / yDuration),
          yoyo: true,
          y: startY - 10,
        },
        0
      );

      return tl;
    };

    const walks = [normalWalk];
    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];
    let focusedPeep: Peep | null = null;

    const img = new Image();

    const createPeeps = (imgSource: HTMLImageElement | HTMLCanvasElement) => {
      const width = (imgSource as any).naturalWidth || (imgSource as HTMLCanvasElement).width || 800;
      const height = (imgSource as any).naturalHeight || (imgSource as HTMLCanvasElement).height || 600;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      for (let i = 0; i < total; i++) {
        const isHero = i === 12; // Pick hero person
        const peep = createPeep({
          image: imgSource,
          rect: [
            (i % rows) * rectWidth,
            ((i / rows) | 0) * rectHeight,
            rectWidth,
            rectHeight,
          ],
          isFocused: isHero,
        });

        if (isHero) focusedPeep = peep;
        allPeeps.push(peep);
      }
    };

    const addPeepToCrowd = () => {
      if (!availablePeeps.length) return null;
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({ peep, stage }),
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const initCrowd = () => {
      while (availablePeeps.length) {
        const p = addPeepToCrowd();
        if (p && p.walk) p.walk.progress(Math.random());
      }
    };

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

      crowd.forEach((peep) => {
        peep.render(ctx);
      });

      ctx.restore();
    };

    const resize = () => {
      if (!canvas) return;
      stage.width = canvas.clientWidth || window.innerWidth;
      stage.height = canvas.clientHeight || 400;
      canvas.width = stage.width * (window.devicePixelRatio || 1);
      canvas.height = stage.height * (window.devicePixelRatio || 1);

      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
    };

    const init = () => {
      createPeeps(img.complete && img.naturalWidth > 0 ? img : generateFallbackSpriteSheet());
      resize();
      gsap.ticker.add(render);
    };

    img.onload = init;
    img.onerror = () => {
      createPeeps(generateFallbackSpriteSheet());
      resize();
      gsap.ticker.add(render);
    };
    img.src = src;

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    // ─── 3-4 SECOND STORY TIMELINE TRIGGER ─────────────────────────────────────
    // Step 1: 0s-3.5s normal walking crowd
    // Step 2: 3.5s narrative text popup
    const timer1 = setTimeout(() => {
      setStoryStage("narrative");
    }, 3500);

    // Step 3: 5.5s focus on ONE man, stop him in center, open laptop!
    const timer2 = setTimeout(() => {
      setStoryStage("focused");
      if (focusedPeep && focusedPeep.walk) {
        focusedPeep.walk.pause();
        // Move him to prominent center location
        gsap.to(focusedPeep, {
          x: stage.width / 2 - 30,
          y: stage.height - 180,
          duration: 1.2,
          ease: "power2.out",
        });
      }
    }, 5500);

    // Step 4: 7.5s Synaps Executive Speed Aura & 100x task counter
    const timer3 = setTimeout(() => {
      setStoryStage("synaps_hero");
      let count = 0;
      const interval = setInterval(() => {
        count += 4;
        setSynapsTasksCompleted(count);
        if (count >= 100) clearInterval(interval);
      }, 50);
    }, 7500);

    return () => {
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(render);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, [src, rows, cols]);

  return (
    <div ref={containerRef} className={cn("relative w-full h-[85vh] bg-[#0b0c10] text-white overflow-hidden flex flex-col justify-between", className)}>
      
      {/* Narrative Header Bar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-4 text-center">
        {storyStage === "walking" && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-mono tracking-wider animate-pulse">
            <span>Standard Office Crowd · Manual Workflow Mode</span>
          </div>
        )}

        {storyStage === "narrative" && (
          <div className="px-6 py-4 rounded-2xl bg-black/80 border border-amber-500/40 backdrop-blur-xl text-amber-200 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 mb-1">Traditional Office Reality</p>
            <p className="text-sm font-medium text-white/90 leading-snug">
              People struggling with traditional, tedious manual work — reading endless PDFs, formatting reports, and answering emails one by one.
            </p>
          </div>
        )}

        {(storyStage === "focused" || storyStage === "synaps_hero") && (
          <div className="px-6 py-4 rounded-2xl bg-[#0d1527]/90 border border-cyan-500/50 backdrop-blur-xl text-cyan-200 shadow-2xl shadow-cyan-500/20 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-center gap-2 text-cyan-400 text-xs font-mono font-extrabold uppercase tracking-widest mb-1">
              <Zap className="w-4 h-4 fill-cyan-400 animate-bounce" />
              <span>Synaps AI Transformation</span>
            </div>
            <p className="text-sm font-semibold text-white leading-snug">
              One executive stops, opens <span className="text-cyan-400 font-bold underline decoration-cyan-400">Synaps AI</span> on his laptop, and automates his entire day in seconds.
            </p>
          </div>
        )}
      </div>

      {/* Floating 100x Speed & Task Completion Badge */}
      {storyStage === "synaps_hero" && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 animate-in fade-in zoom-in-90 duration-500">
          <div className="px-6 py-3 rounded-full bg-cyan-500/20 border border-cyan-400/60 backdrop-blur-md shadow-2xl shadow-cyan-500/40 flex items-center gap-3">
            <Laptop className="w-6 h-6 text-cyan-400 animate-pulse" />
            <div>
              <p className="text-xs text-cyan-300 font-mono font-bold uppercase tracking-wider">Executive Speed Boost</p>
              <p className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>{synapsTasksCompleted} / 100 Tasks Done</span>
                <CheckCircle className="w-5 h-5 text-cyan-400" />
              </p>
            </div>
          </div>

          <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono tracking-wider shadow-lg">
            ⚡ 100x Faster Than Traditional Manual Work
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0b0c10] to-transparent pointer-events-none z-10" />
    </div>
  );
};

export const Skiper39 = CrowdCanvas;
