"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from 'react';
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

    const stage = { width: 0, height: 0 };

    // Procedural Fallback Sprite Generator if external image is missing
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
          sCtx.fillStyle = "#e2e8f0";
          sCtx.beginPath();
          sCtx.arc(0, -25, 12, 0, Math.PI * 2);
          sCtx.fill();

          sCtx.fillStyle = color;
          sCtx.beginPath();
          sCtx.roundRect(-14, -10, 28, 40, 6);
          sCtx.fill();

          sCtx.fillStyle = "#1e293b";
          sCtx.fillRect(-10, 30, 8, 25);
          sCtx.fillRect(2, 30, 8, 25);
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
      walk: any;
      setRect: (rect: number[]) => void;
      render: (ctx: CanvasRenderingContext2D) => void;
    };

    const createPeep = ({
      image,
      rect,
    }: {
      image: HTMLImageElement | HTMLCanvasElement;
      rect: number[];
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

    const img = new Image();

    const createPeeps = (imgSource: HTMLImageElement | HTMLCanvasElement) => {
      const width = (imgSource as any).naturalWidth || (imgSource as HTMLCanvasElement).width || 800;
      const height = (imgSource as any).naturalHeight || (imgSource as HTMLCanvasElement).height || 600;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: imgSource,
            rect: [
              (i % rows) * rectWidth,
              ((i / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          })
        );
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

    return () => {
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, [src, rows, cols]);

  return (
    <div className={cn("relative h-full w-full bg-[#0b0c10] text-white overflow-hidden", className)}>
      <canvas ref={canvasRef} className="absolute bottom-0 h-[90vh] w-full" />
    </div>
  );
};

export const Skiper39 = CrowdCanvas;
