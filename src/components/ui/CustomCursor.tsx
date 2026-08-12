"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

/**
 * Custom Following Cursor (BCursor from incredibles.dev)
 * Smooth lerp cursor dot with amber accent trail & scale expansion on hoverable elements.
 */
export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useSpring(-20, { stiffness: 400, damping: 28 });
  const cursorY = useSpring(-20, { stiffness: 400, damping: 28 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.closest("button") ||
          target.closest("a") ||
          target.getAttribute("role") === "button" ||
          target.dataset.cursorExpand === "true")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden hidden md:block">
      {/* Outer Glow Ring */}
      <motion.div
        className="absolute rounded-full border border-amber-500/40 bg-amber-500/10 backdrop-blur-[2px]"
        style={{
          x: cursorX as any,
          y: cursorY as any,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? 48 : 24,
          height: isHovered ? 48 : 24,
          borderColor: isHovered ? "rgba(255, 122, 0, 0.8)" : "rgba(255, 122, 0, 0.3)",
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      />

      {/* Inner Dot Cursor */}
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#FF7A00]"
        style={{
          x: cursorX as any,
          y: cursorY as any,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
