"use client";

import React, { useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, Loader } from '@react-three/drei';
import SceneManager from './SceneManager';
import HtmlOverlay from './HtmlOverlay';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export default function CinematicExperience() {
  useEffect(() => {
    let lenisInstance: any;
    
    // Dynamically import Lenis to avoid SSR issues
    import('lenis').then(({ default: Lenis }) => {
      lenisInstance = new Lenis({
        duration: 1.5,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      function raf(time: number) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    });

    return () => {
      if (lenisInstance) {
        lenisInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="relative w-full bg-black text-white selection:bg-[#EAB308] selection:text-black font-sans overflow-x-hidden">
      {/* Scrollable Container (1200vh gives enough room for 8 dense scenes) */}
      <div className="h-[1200vh] w-full" id="cinematic-scroll-container">
        
        {/* Fixed 3D Canvas Layer */}
        <div className="fixed top-0 left-0 w-full h-screen z-0">
          <ErrorBoundary>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 2000 }}
              dpr={[1, 2]} // Cap DPR to 2 for performance
              gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
            >
              <color attach="background" args={['#000000']} />
              <Suspense fallback={null}>
                <SceneManager />
                <Preload all />
              </Suspense>
            </Canvas>
          </ErrorBoundary>
        </div>
        
        {/* R3F Global Loader Overlay */}
        <Loader 
          containerStyles={{ background: 'transparent' }}
          innerStyles={{ backgroundColor: 'rgba(255,255,255,0.1)', height: '2px', width: '200px', borderRadius: '4px' }}
          barStyles={{ backgroundColor: '#EAB308', height: '2px' }}
          dataStyles={{ color: '#EAB308', fontSize: '12px', fontFamily: 'monospace' }}
        />
        
        {/* Fixed HTML Overlay Layer (Text & CTA) */}
        <div className="fixed top-0 left-0 w-full h-screen z-10 pointer-events-none flex flex-col">
          <HtmlOverlay />
        </div>
        
      </div>
    </div>
  );
}
