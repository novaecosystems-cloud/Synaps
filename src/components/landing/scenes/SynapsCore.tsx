"use client";

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollProxy } from '../SceneManager';

export default function SynapsCore() {
  const coreRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!coreRef.current || !shellRef.current) return;
    const p = scrollProxy.progress;
    
    // Positioned at Z = -60
    
    // Visibility: Scene 3 (0.33 -> 0.50) and inside (0.50 -> 0.66)
    if (p < 0.25 || p > 0.8) {
      coreRef.current.visible = false;
      return;
    }
    coreRef.current.visible = true;

    // Rotation
    coreRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    coreRef.current.rotation.x = state.clock.elapsedTime * 0.05;

    // Scale up as it absorbs data
    let scale = 0;
    if (p > 0.33 && p <= 0.50) {
      scale = ((p - 0.33) / 0.17) * 4; // Grows to size 4
    } else if (p > 0.50) {
      // Dive inside: expands massively
      scale = 4 + ((p - 0.50) / 0.16) * 30; // 4 to 34 (surrounding the camera)
    }
    
    // Smooth damp scale to avoid jerky growth
    coreRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);

    // Opacity fade out when we pass through it
    const shellMat = shellRef.current.material as THREE.MeshPhysicalMaterial;
    if (p > 0.60) {
      shellMat.opacity = Math.max(0, 1 - ((p - 0.60) / 0.06));
    } else {
      shellMat.opacity = 1;
    }
  });

  return (
    <group position={[0, 0, -60]} ref={coreRef}>
      {/* Dense Inner Core */}
      <mesh>
        <icosahedronGeometry args={[1, 2]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          emissive="#7c3aed"
          emissiveIntensity={2}
          wireframe 
        />
      </mesh>
      
      {/* Premium Glass Shell */}
      <mesh ref={shellRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          transmission={0.95}
          opacity={1}
          metalness={0.1}
          roughness={0.1}
          ior={1.5}
          thickness={0.5}
          specularIntensity={1}
          specularColor="#EAB308"
          transparent
        />
      </mesh>
    </group>
  );
}
