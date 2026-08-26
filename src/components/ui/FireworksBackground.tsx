'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export interface FireworksBackgroundProps {
  className?: string;
  color?: string;
  population?: number;
  autoFadeAfterMs?: number;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  decay: number;
  size: number;
}

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  color: string;
  exploded: boolean;
}

export function FireworksBackground({
  className,
  population = 5,
  autoFadeAfterMs,
  onComplete,
}: FireworksBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isActive = true;

    // Resize canvas
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const isDark = resolvedTheme === 'dark';
    const vibrantColors = isDark 
      ? ['#00f0ff', '#fc4778', '#38bdf8', '#a855f7', '#fbbf24', '#34d399'] 
      : ['#0284c7', '#e11d48', '#059669', '#7c3aed', '#d97706'];

    const rockets: Rocket[] = [];
    const particles: Particle[] = [];

    const createRocket = () => {
      if (!canvas) return;
      const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
      const targetY = Math.random() * (canvas.height * 0.4) + canvas.height * 0.1;
      const color = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
      rockets.push({
        x,
        y: canvas.height,
        vx: (Math.random() - 0.5) * 3,
        vy: -(Math.random() * 4 + 8),
        targetY,
        color,
        exploded: false,
      });
    };

    const explodeRocket = (x: number, y: number, color: string) => {
      const particleCount = 45;
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 / particleCount) * i + (Math.random() - 0.5);
        const speed = Math.random() * 5 + 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          decay: Math.random() * 0.015 + 0.015,
          size: Math.random() * 2.5 + 1.5,
        });
      }
    };

    // Initial rockets
    for (let i = 0; i < population; i++) {
      setTimeout(() => {
        if (isActive) createRocket();
      }, i * 350);
    }

    // Interval for repeating fireworks
    const interval = setInterval(() => {
      if (isActive && rockets.length < population) {
        createRocket();
      }
    }, 600);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update & Draw Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;

        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 8;
        ctx.fill();

        if (r.y <= r.targetY) {
          explodeRocket(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // Gravity
        p.vx *= 0.98; // Friction
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Auto cleanup if autoFadeAfterMs is provided
    let fadeTimer: NodeJS.Timeout;
    if (autoFadeAfterMs) {
      fadeTimer = setTimeout(() => {
        isActive = false;
        clearInterval(interval);
        onComplete?.();
      }, autoFadeAfterMs);
    }

    return () => {
      isActive = false;
      clearInterval(interval);
      clearTimeout(fadeTimer);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [population, resolvedTheme, autoFadeAfterMs, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('pointer-events-none absolute inset-0 z-20 h-full w-full', className)}
    />
  );
}

export default FireworksBackground;
