"use client";

import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer, Bloom, DepthOfField, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// Import Scenes
import EnterpriseChaos from './scenes/EnterpriseChaos';
import SynapsCore from './scenes/SynapsCore';
import TimeSimulation from './scenes/TimeSimulation';
import GlobalEarth from './scenes/GlobalEarth';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Global scroll state
export const scrollProxy = { progress: 0 };

export default function SceneManager() {
  const { camera, scene } = useThree();

  useEffect(() => {
    scene.fog = new THREE.FogExp2('#000000', 0.02);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Smooth scrubbing
      }
    });

    // We use a custom ease to mimic heavy camera gear (like risk.film)
    tl.to(scrollProxy, {
      progress: 1,
      ease: 'power2.inOut',
      duration: 1
    });

    return () => {
      tl.kill();
    };
  }, [scene]);

  useFrame((state) => {
    const p = scrollProxy.progress;
    const t = state.clock.elapsedTime;
    
    // Scene 1: Chaos (0.0 to 0.16)
    if (p < 0.16) {
      // Gentle floating camera
      camera.position.set(Math.sin(t * 0.5) * 1, Math.cos(t * 0.3) * 1, 10);
      camera.lookAt(0, 0, -10);
    } 
    // Scene 2: Data (0.16 to 0.33)
    else if (p < 0.33) {
      const p2 = (p - 0.16) / 0.17; // 0 to 1
      camera.position.set(0, 0, 10 - p2 * 20); // Moves from 10 to -10
      camera.lookAt(0, 0, -30);
    } 
    // Scene 3: Intelligence (Core) (0.33 to 0.50)
    else if (p < 0.50) {
      const p3 = (p - 0.33) / 0.17; // 0 to 1
      // Fly towards the core at Z=-60
      camera.position.set(
        Math.sin(p3 * Math.PI) * 15, 
        Math.cos(p3 * Math.PI) * 10, 
        -10 - p3 * 45 // Stops at -55 (just outside core)
      );
      camera.lookAt(0, 0, -60);
    } 
    // Scene 4: Simulation (0.50 to 0.66)
    else if (p < 0.66) {
      const p4 = (p - 0.50) / 0.16;
      // Dive into the core and look down the timelines
      camera.position.set(0, 0, -55 - p4 * 5); // Stops at -60 (start of timelines)
      camera.lookAt(0, 0, -120);
    } 
    // Scene 5: Decisions (0.66 to 0.83)
    else if (p < 0.83) {
      const p5 = (p - 0.66) / 0.17;
      // Fly down the golden timeline
      camera.position.set(0, 0, -60 - p5 * 60); // Stops at -120
      camera.lookAt(0, 0, -150);
    } 
    // Scene 6: Global Earth (0.83 to 1.0)
    else {
      const p6 = (p - 0.83) / 0.17;
      // Fly through space towards earth
      camera.position.set(Math.sin(p6 * 2) * 50, Math.cos(p6 * 2) * 20, -120 - p6 * 100);
      camera.lookAt(0, 0, -300); // Earth is at -300
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 20, 10]} intensity={2} color="#ffffff" />
      <pointLight position={[0, 0, -60]} intensity={10} color="#7c3aed" distance={100} />
      <pointLight position={[0, 0, -300]} intensity={20} color="#6D67B2" distance={200} />

      {/* Cinematic Scenes */}
      <EnterpriseChaos />
      <SynapsCore />
      <TimeSimulation />
      <GlobalEarth />

      {/* IMAX Post Processing */}
      <EffectComposer multisampling={0}>
        <DepthOfField focusDistance={0.02} focalLength={0.02} bokehScale={4} height={480} />
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} mipmapBlur />
        <ChromaticAberration 
          blendFunction={BlendFunction.NORMAL} 
          offset={new THREE.Vector2(0.003, 0.003)} 
          radialModulation={true} 
          modulationOffset={0.5} 
        />
        <Noise opacity={0.03} blendFunction={BlendFunction.OVERLAY} />
        <Vignette eskil={false} offset={0.1} darkness={1.2} />
      </EffectComposer>
    </>
  );
}
