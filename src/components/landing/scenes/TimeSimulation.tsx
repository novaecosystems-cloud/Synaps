"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollProxy } from '../SceneManager';

export default function TimeSimulation() {
  const groupRef = useRef<THREE.Group>(null);
  
  // We will create 5 paths. 1 main straight path, 4 branching paths.
  const mainPathMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const branchMatsRef = useRef<THREE.MeshBasicMaterial[]>([]);

  const paths = useMemo(() => {
    const mainCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, -60),
      new THREE.Vector3(0, 0, -90),
      new THREE.Vector3(0, 0, -120),
    ]);

    const branches = [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, -60),
        new THREE.Vector3(10, 5, -80),
        new THREE.Vector3(20, 10, -100),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, -60),
        new THREE.Vector3(-10, -5, -80),
        new THREE.Vector3(-20, -10, -100),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, -60),
        new THREE.Vector3(5, -10, -75),
        new THREE.Vector3(10, -20, -95),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, -60),
        new THREE.Vector3(-5, 10, -85),
        new THREE.Vector3(-15, 20, -110),
      ]),
    ];

    return { mainCurve, branches };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const p = scrollProxy.progress;
    
    if (p < 0.45 || p > 0.85) {
      groupRef.current.visible = false;
      return;
    }
    groupRef.current.visible = true;

    // Fade in all paths (Scene 4: Simulation 0.50 -> 0.66)
    // Fade out branches (Scene 5: Decisions 0.66 -> 0.83)
    let mainOpacity = 0;
    let branchOpacity = 0;

    if (p >= 0.50 && p < 0.66) {
      // Scene 4: Simulating multiple timelines
      const fade = (p - 0.50) / 0.16;
      mainOpacity = fade * 0.5;
      branchOpacity = fade * 0.3;
    } else if (p >= 0.66 && p < 0.83) {
      // Scene 5: Deciding (Branches fade, main highlights)
      const fade = (p - 0.66) / 0.17;
      mainOpacity = 0.5 + (fade * 0.5); // Gets brighter
      branchOpacity = 0.3 - (fade * 0.3); // Fades out completely
    } else if (p >= 0.83) {
      mainOpacity = Math.max(0, 1 - ((p - 0.83) / 0.05)); // Fade out main at end
      branchOpacity = 0;
    }

    if (mainPathMatRef.current) {
      mainPathMatRef.current.opacity = mainOpacity;
    }
    branchMatsRef.current.forEach(mat => {
      if (mat) mat.opacity = branchOpacity;
    });

    // Pulse effects
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
  });

  return (
    <group ref={groupRef}>
      {/* Main Golden Path */}
      <mesh>
        <tubeGeometry args={[paths.mainCurve, 64, 1.5, 16, false]} />
        <meshBasicMaterial 
          ref={mainPathMatRef}
          color="#EAB308" 
          wireframe 
          transparent 
          opacity={0} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Branching Timelines */}
      {paths.branches.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 64, 0.5, 8, false]} />
          <meshBasicMaterial 
            ref={(el) => { if (el) branchMatsRef.current[i] = el; }}
            color="#6D67B2" 
            wireframe 
            transparent 
            opacity={0} 
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
