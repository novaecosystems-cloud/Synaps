"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
varying vec2 vUv;

// Noise function
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  
  // Create a base grid
  float noise = snoise(uv * 3.0 + uTime * 0.1);
  
  // Calculate distance to mouse
  float dist = distance(uv, uMouse);
  
  // Liquid distortion around mouse
  float mouseEffect = smoothstep(0.4, 0.0, dist);
  
  uv.x += snoise(uv * 5.0 + uTime * 0.2) * 0.05 * mouseEffect;
  uv.y += snoise(uv * 5.0 - uTime * 0.2) * 0.05 * mouseEffect;
  
  // Grid pattern
  vec2 grid = fract(uv * 20.0);
  float line = smoothstep(0.0, 0.05, grid.x) * smoothstep(0.0, 0.05, grid.y);
  
  // Color calculation
  vec3 baseColor = vec3(0.05, 0.05, 0.07);
  vec3 gridColor = vec3(0.15, 0.15, 0.2) * (1.0 - line);
  vec3 highlightColor = vec3(0.4, 0.3, 0.8) * mouseEffect * 0.5;
  
  vec3 finalColor = baseColor + gridColor + highlightColor;
  
  // Add subtle chaos based on noise
  finalColor += vec3(0.02, 0.03, 0.05) * noise;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const LiquidPlane = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Interpolate mouse smoothly
      materialRef.current.uniforms.uMouse.value.lerp(
        new THREE.Vector2(
          (state.pointer.x + 1) / 2,
          (state.pointer.y + 1) / 2
        ),
        0.1
      );
    }
  });

  return (
    <mesh>
      <planeGeometry args={[10, 10, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
};

export default function LiquidDistortion() {
  return (
    <div className="absolute inset-0 z-0 bg-base-100 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <LiquidPlane />
      </Canvas>
    </div>
  );
}
