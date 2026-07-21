"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollProxy } from '../SceneManager';

export default function EnterpriseChaos() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const count = 2000;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const instances = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      // Chaotic positions
      const chaosPos = new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60,
        -10 - Math.random() * 50
      );
      
      // Grid positions (Data scene)
      const gridSize = 10;
      const spacing = 4;
      const x = (i % gridSize) - (gridSize / 2);
      const y = Math.floor((i / gridSize) % gridSize) - (gridSize / 2);
      const z = Math.floor(i / (gridSize * gridSize)) - (gridSize / 2);
      const gridPos = new THREE.Vector3(x * spacing, y * spacing, -30 + z * spacing);
      
      return {
        chaosPos,
        gridPos,
        rot: new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        speed: Math.random() * 0.05
      };
    });
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    const p = scrollProxy.progress;
    
    // Visible during Scene 1 (0-0.16), Scene 2 (0.16-0.33), and start of Scene 3 (0.33-0.45)
    if (p > 0.45) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;

    instances.forEach((inst, i) => {
      const currentPos = new THREE.Vector3();
      const currentRot = new THREE.Euler();
      let currentScale = 1;

      if (p < 0.16) {
        // Scene 1: Chaos
        inst.rot.x += inst.speed;
        inst.rot.y += inst.speed;
        currentPos.copy(inst.chaosPos);
        currentRot.set(inst.rot.x, inst.rot.y, inst.rot.z);
      } 
      
      // Compute blended position based on scroll
      let chaosWeight = 1;
      let gridWeight = 0;
      let coreWeight = 0;

      if (p <= 0.16) {
        chaosWeight = 1;
        gridWeight = 0;
      } else if (p <= 0.33) {
        // Transition from Chaos to Grid
        gridWeight = (p - 0.16) / 0.17; // 0 to 1
        chaosWeight = 1 - gridWeight;
      } else if (p <= 0.45) {
        // Transition from Grid to Core (Intelligence)
        gridWeight = 1 - ((p - 0.33) / 0.12); // 1 to 0
        coreWeight = 1 - gridWeight; // 0 to 1
        chaosWeight = 0;
      }

      // Add rotation animation
      inst.rot.x += inst.speed * chaosWeight;
      inst.rot.y += inst.speed * chaosWeight;

      // Calculate final position
      currentPos.copy(inst.chaosPos).multiplyScalar(chaosWeight)
                .add(inst.gridPos.clone().multiplyScalar(gridWeight));

      if (coreWeight > 0) {
        // Suck into core at Z = -60
        const corePos = new THREE.Vector3(0, 0, -60);
        currentPos.add(corePos.multiplyScalar(coreWeight));
        currentScale = 1 - coreWeight;
      }

      // Calculate final rotation
      if (gridWeight > 0) {
        // Align to grid (rotation 0,0,0)
        currentRot.set(
          inst.rot.x * chaosWeight,
          inst.rot.y * chaosWeight,
          inst.rot.z * chaosWeight
        );
      } else {
        currentRot.set(inst.rot.x, inst.rot.y, inst.rot.z);
      }

      dummy.position.copy(currentPos);
      dummy.rotation.copy(currentRot);
      dummy.scale.setScalar(currentScale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <planeGeometry args={[0.8, 0.4]} />
        {/* Cinematic glass/holographic material */}
        <meshPhysicalMaterial 
          color="#a78bfa" 
          transparent 
          opacity={0.6} 
          wireframe 
          transmission={0.5} 
          roughness={0.2}
          side={THREE.DoubleSide} 
        />
      </instancedMesh>
    </group>
  );
}
