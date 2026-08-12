"use client";

import React, { useEffect, useRef } from "react";

/**
 * WebGL Fluid Canvas & Interactive Pointer Particle Trail
 * Recreates the incredibles.dev WebGL fluid simulation & dithered background shader.
 */
export function FluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl2", { alpha: true, depth: false, antialias: false }) ||
      (canvas.getContext("webgl") as WebGLRenderingContext | null);

    if (!gl) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse state
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      vx: 0,
      vy: 0,
      moved: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.vx = e.clientX - mouse.targetX;
      mouse.vy = e.clientY - mouse.targetY;
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.moved = true;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      gl.viewport(0, 0, width, height);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Shaders
    const vsSource = `
      attribute vec2 aPosition;
      varying vec2 vUv;
      void main() {
        vUv = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 vUv;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;

      float hash(vec2 p) {
        p = fract(p * vec2(127.1, 311.7));
        p += dot(p, p.yx + 19.19);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float bayer4(vec2 pixelPos) {
        vec2 p  = mod(pixelPos, 4.0);
        vec2 p2 = mod(p, 2.0);
        vec2 p4 = floor(p * 0.5);
        float inner = 2.0 * (p2.x + p2.y - 2.0 * p2.x * p2.y) + p2.y;
        float outer = 2.0 * (p4.x + p4.y - 2.0 * p4.x * p4.y) + p4.y;
        return (4.0 * inner + outer) / 16.0;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        vec2 mouseSt = u_mouse / u_resolution.xy;
        mouseSt.y = 1.0 - mouseSt.y;

        float dist = distance(st, mouseSt);
        float fluidRadius = 0.18;
        float fluidIntensity = smoothstep(fluidRadius, 0.0, dist);

        // Fluid noise motion
        vec2 flow = vec2(u_time * 0.02, -u_time * 0.015);
        float n = noise(st * 3.0 + flow + fluidIntensity * 0.4);

        // Dithering
        float threshold = bayer4(gl_FragCoord.xy);
        float dither = step(threshold, n + fluidIntensity * 0.3);

        // Color palette (SYNAPS Amber Glow #FF7A00 & Editorial Dark background)
        vec3 darkBg = vec3(0.05, 0.05, 0.07);
        vec3 midBg = vec3(0.09, 0.09, 0.12);
        vec3 amberGlow = vec3(1.0, 0.48, 0.0); // #FF7A00

        vec3 color = mix(darkBg, midBg, dither);
        color = mix(color, amberGlow, fluidIntensity * 0.45);

        gl_FragColor = vec4(color, 0.65);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error(glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Geometry quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uTime = gl.getUniformLocation(program, "u_time");

    let startTime = performance.now();

    const render = (time: number) => {
      // Lerp mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      gl.viewport(0, 0, width, height);
      gl.uniform2f(uResolution, width, height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uTime, (time - startTime) * 0.001);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-80"
    />
  );
}
