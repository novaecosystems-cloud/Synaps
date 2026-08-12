"use client";

import * as React from "react";
import { motion, useAnimationFrame } from "framer-motion";

import { cn } from "@/lib/utils";

export interface AuroraBarsProps {
  /** @default 32 */
  barCount?: number;
  /** gradient color stops, bottom to top — @default ["#fc4778", "#ff7a00", "#00f0ff", "#38bdf8", "#00000000"] */
  colors?: string[];
  /** max bar height as fraction of container height — @default 0.92 */
  maxHeightRatio?: number;
  /** min bar height as fraction of container height — @default 0.18 */
  minHeightRatio?: number;
  /** undulation speed — @default 0.5 */
  speed?: number;
  /** @default 3 */
  gap?: number;
  /** px blur per bar, creates soft glow — @default 0 */
  blur?: number;
  /** @default "#f1f1f1" */
  background?: string;
  className?: string;
}

/** two sine waves per bar for organic movement + interactive mouse influence */
function barHeight(
  index: number,
  total: number,
  time: number,
  minH: number,
  maxH: number,
  mouseX: number,
  mouseY: number
): number {
  const norm = (index / (total - 1)) * Math.PI;
  const arch = Math.sin(norm);

  const wave1 = Math.sin(time * 1.5 + index * 0.35) * 0.22;
  const wave2 = Math.sin(time * 0.8 + index * 0.18 + 1.2) * 0.15;

  const barX = index / (total - 1);
  const distToMouse = Math.abs(barX - mouseX);
  const mouseBoost = Math.max(0, 1 - distToMouse * 3.5) * (1 - mouseY) * 0.35;

  const combined = (arch + wave1 + wave2 + mouseBoost) / 1.35;
  const clamped = Math.max(0.08, Math.min(1.0, combined));

  return minH + clamped * (maxH - minH);
}

export function AuroraBars({
  barCount = 32,
  colors = ["#fc4778", "#ff7a00", "#00f0ff", "#38bdf8", "#00000000"],
  maxHeightRatio = 0.92,
  minHeightRatio = 0.18,
  speed = 0.6,
  gap = 4,
  blur = 2,
  background = "transparent",
  className,
}: AuroraBarsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0.5, y: 0.5 });
  const [heights, setHeights] = React.useState<number[]>(() =>
    Array.from({ length: barCount }, (_, i) =>
      barHeight(i, barCount, 0, minHeightRatio, maxHeightRatio, 0.5, 0.5)
    )
  );

  const timeRef = React.useRef(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setMousePos({ x, y });
  };

  useAnimationFrame((_, delta) => {
    timeRef.current += (delta / 1000) * speed;
    const t = timeRef.current;
    setHeights(
      Array.from({ length: barCount }, (_, i) =>
        barHeight(i, barCount, t, minHeightRatio, maxHeightRatio, mousePos.x, mousePos.y)
      )
    );
  });

  const gradientStop = colors
    .map((c, i) => `${c} ${Math.round((i / (colors.length - 1)) * 100)}%`)
    .join(", ");
  const gradient = `linear-gradient(to top, ${gradientStop})`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn("relative w-full h-full overflow-hidden cursor-pointer", className)}
      style={{ background }}
    >
      <div className="absolute inset-0 flex items-end">
        {Array.from({ length: barCount }).map((_, i) => {
          const heightFraction = heights[i] ?? maxHeightRatio;
          return (
            <div
              key={i}
              className="flex-1"
              style={{
                height: "100%",
                display: "flex",
                alignItems: "flex-end",
                padding: `0 ${gap / 2}px`,
              }}
            >
              <motion.div
                style={{
                  width: "100%",
                  height: `${heightFraction * 100}%`,
                  background: gradient,
                  borderRadius: "9999px 9999px 0 0",
                  filter: `blur(${blur}px)`,
                  opacity: 0.85,
                }}
              />
            </div>
          );
        })}
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 100%, transparent 30%, #f1f1f1cc 100%)",
        }}
      />
    </div>
  );
}
