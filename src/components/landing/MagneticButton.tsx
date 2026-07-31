'use client';

import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  glowColor?: string;
}

export default function MagneticButton({
  children,
  onClick,
  className,
  glowColor = '#CAFF00'
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (e.clientX - centerX) * 0.35; // magnetic pull strength
    const distanceY = (e.clientY - centerY) * 0.35;

    setPosition({ x: distanceX, y: distanceY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: 'transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
      className={cn(
        "relative inline-flex items-center justify-center font-extrabold cursor-pointer overflow-hidden transition-all duration-300 active:scale-95 group",
        className
      )}
    >
      {/* Background Pulse Glow */}
      <span 
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-md pointer-events-none" 
        style={{ background: glowColor }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
