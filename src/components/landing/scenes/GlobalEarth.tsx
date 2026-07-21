"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollProxy } from '../SceneManager';

export default function GlobalEarth() {
  const earthRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const nodesRef = useRef<THREE.PointsMaterial>(null);
  
  // Generate random lat/long points for nodes
  const nodeCount = 800;
  const radius = 30;
  
  const nodes = useMemo(() => {
    const pos = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      
      pos[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      pos[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, [nodeCount]);

  useFrame((state) => {
    if (!earthRef.current || !materialRef.current || !nodesRef.current) return;
    const p = scrollProxy.progress;
    
    if (p < 0.70) {
      earthRef.current.visible = false;
      return;
    }
    earthRef.current.visible = true;

    // Fade in
    let opacity = 0;
    if (p >= 0.83) {
      opacity = Math.min(1, (p - 0.83) / 0.1);
    }
    materialRef.current.opacity = opacity * 0.8;
    nodesRef.current.opacity = opacity;

    // Slow rotation
    earthRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    earthRef.current.rotation.x = 0.2; // slight tilt
  });

  return (
    <group position={[0, 0, -300]} ref={earthRef}>
      {/* Premium Glass Earth */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshPhysicalMaterial 
          ref={materialRef}
          color="#1a1a2e"
          transmission={0.9}
          opacity={0}
          metalness={0.2}
          roughness={0.1}
          ior={1.5}
          thickness={2}
          specularIntensity={1}
          specularColor="#6D67B2"
          transparent
        />
      </mesh>
      
      {/* Nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodes, 3]}
          />
        </bufferGeometry>
        <pointsMaterial ref={nodesRef} size={0.6} color="#EAB308" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      
      {/* Holographic grid lines */}
      <mesh>
        <sphereGeometry args={[radius + 0.1, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.03} wireframe depthWrite={false} />
      </mesh>
    </group>
  );
}
