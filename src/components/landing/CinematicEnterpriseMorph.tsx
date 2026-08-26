'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

// ─── 4D HYPERCUBE MATHEMATICAL MORPH ENGINE (tesseract-explorer + Hypercube inspired) ───
// 16 Vertices of a 4D Tesseract (Hypercube)
const TESSERACT_4D_VERTICES: number[][] = [];
for (let i = 0; i < 16; i++) {
  TESSERACT_4D_VERTICES.push([
    ((i >> 0) & 1) * 2 - 1,
    ((i >> 1) & 1) * 2 - 1,
    ((i >> 2) & 1) * 2 - 1,
    ((i >> 3) & 1) * 2 - 1,
  ]);
}

// 32 Edges of a 4D Tesseract
const TESSERACT_EDGES: [number, number][] = [];
for (let i = 0; i < 16; i++) {
  for (let j = i + 1; j < 16; j++) {
    let diff = 0;
    for (let k = 0; k < 4; k++) {
      if (TESSERACT_4D_VERTICES[i][k] !== TESSERACT_4D_VERTICES[j][k]) diff++;
    }
    if (diff === 1) TESSERACT_EDGES.push([i, j]);
  }
}

// 4D Rotation in (axisA, axisB) plane
function rotate4D(v: number[], angle: number, axisA: number, axisB: number): number[] {
  const res = [...v];
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  res[axisA] = v[axisA] * cos - v[axisB] * sin;
  res[axisB] = v[axisA] * sin + v[axisB] * cos;
  return res;
}

// 4D to 3D Perspective Projection (from tesseract-explorer)
function project4Dto3D(v: number[], distance: number = 2.5): THREE.Vector3 {
  const w = distance - v[3];
  const factor = w !== 0 ? 1 / w : 1;
  return new THREE.Vector3(v[0] * factor * 2.2, v[1] * factor * 2.2, v[2] * factor * 2.2);
}

// 4D Clifford Torus math (from Hypercube)
function getCliffordTorus4D(u: number, v: number): number[] {
  const r = 1.2;
  return [
    r * Math.cos(u * Math.PI * 2),
    r * Math.sin(u * Math.PI * 2),
    r * Math.cos(v * Math.PI * 2),
    r * Math.sin(v * Math.PI * 2)
  ];
}

// 4D Hypersphere math
function getHypersphere4D(u: number, v: number): number[] {
  const theta = u * Math.PI * 2;
  const phi = (v - 0.5) * Math.PI;
  const r = 1.5;
  return [
    r * Math.cos(phi) * Math.cos(theta),
    r * Math.sin(phi),
    r * Math.cos(phi) * Math.sin(theta),
    r * Math.sin(theta * 0.5)
  ];
}

// 4D Möbius Strip math
function getMobius4D(u: number, v: number): number[] {
  const uAngle = u * Math.PI * 2;
  const w = (v - 0.5) * 1.2;
  const R = 1.5;
  return [
    (R + w * Math.cos(uAngle / 2)) * Math.cos(uAngle),
    (R + w * Math.cos(uAngle / 2)) * Math.sin(uAngle),
    w * Math.sin(uAngle / 2),
    w * Math.cos(uAngle / 2)
  ];
}

export const MORPH_STAGES = [
  {
    id: 1,
    title: 'Stage 1 — The Enterprise',
    geometryName: '4D Tesseract Hypercube',
    meaning: '12 Siloed Knowledge Sources',
    desc: 'Inspired by tesseract-explorer & Hypercube 4D rotation matrices. Each panel represents an isolated enterprise data source: Documents, PDFs, Emails, Contracts, Teams, Calendar, CRM, Drive, Slack, Databases, Notes, Tasks.',
    color: '#94A3B8',
    panels: ['Documents', 'PDFs', 'Emails', 'Contracts', 'Teams', 'Calendar', 'CRM', 'Drive', 'Slack', 'Databases', 'Notes', 'Tasks']
  },
  {
    id: 2,
    title: 'Stage 2 — Data Becomes Unified',
    geometryName: '4D Hypersphere Projection',
    meaning: 'Continuous Topology Transformation',
    desc: 'Rigid hypercube vertices melt continuously into a 4D Hypersphere. Hard boundaries dissolve as SYNAPS unifies every department into one connected knowledge space.',
    color: '#6366F1',
    panels: ['Unified Data', 'Departmental Alignment', 'Zero Retention SLA', 'Single Source of Truth']
  },
  {
    id: 3,
    title: 'Stage 3 — Intelligence Connects Everything',
    geometryName: '4D Clifford Torus',
    meaning: 'Cross-Departmental Relationship Paths',
    desc: 'The hypersphere morphs into a 4D Clifford Torus. Precision-machined grooves travel along intersecting 4D planes, mapping relationships across files and teams.',
    color: '#10B981',
    panels: ['Cross-Doc Reasoning', 'Metadata Linking', 'Entity Graphing', 'Contract Cross-Reference']
  },
  {
    id: 4,
    title: 'Stage 4 — Continuous Organizational Memory',
    geometryName: '4D Möbius Manifold',
    meaning: 'Infinite Continuous Memory',
    desc: 'The Clifford Torus twists into a continuous 4D Möbius manifold. Knowledge never ends; every executive decision feeds future decisions.',
    color: '#F59E0B',
    panels: ['Search', 'Analyze', 'Compare', 'Decide', 'Remember', 'Retrieve', 'Learn', 'Reason', 'Connect']
  },
  {
    id: 5,
    title: 'Stage 5 — Intelligence Becomes Action',
    geometryName: 'Evolved Interconnected Hypercube',
    meaning: 'Your Enterprise Thinks as One',
    desc: 'The Möbius manifold reorganizes back into an evolved 4D hypercube. Interconnected edge graph lines link previously isolated data into unified action.',
    color: '#34D399',
    panels: ['SYNAPS Decision Layer', '110 Decision Models', 'AI Boardroom Action', 'Enterprise Co-Pilot']
  }
];

export default function CinematicEnterpriseMorph() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [stageProgress, setStageProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activePanelHover, setActivePanelHover] = useState<string | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  const currentStageIndex = Math.min(Math.floor(stageProgress), 4);
  const currentStage = MORPH_STAGES[currentStageIndex];

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStageProgress(prev => (prev + 0.005) % 4.0001);
    }, 16);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Three.js WebGL Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#060810');

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 6.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Studio Lights
    const ambientLight = new THREE.AmbientLight('#1E293B', 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#F8FAFC', 2.8);
    keyLight.position.set(4, 8, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#6366F1', 1.8);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);

    const accentLight = new THREE.DirectionalLight('#10B981', 1.5);
    accentLight.position.set(2, -4, 4);
    scene.add(accentLight);

    // Create 4D Tesseract Edges LineSegments
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(TESSERACT_EDGES.length * 2 * 3);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: '#10B981',
      linewidth: 2,
      transparent: true,
      opacity: 0.8
    });
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    // Create Vertex Spheres
    const sphereGroup = new THREE.Group();
    const sphereGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const sphereMat = new THREE.MeshStandardMaterial({ color: '#34D399', metalness: 0.9, roughness: 0.2 });

    for (let i = 0; i < 16; i++) {
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphereGroup.add(sphere);
    }
    scene.add(sphereGroup);

    let animId: number;
    let tAngle = 0;

    const renderLoop = () => {
      tAngle += 0.008;

      if (!isDraggingRef.current) {
        scene.rotation.y += 0.003;
        scene.rotation.x = Math.sin(tAngle * 0.5) * 0.1;
      }

      // Compute 4D projected vertices
      const currentProgress = (container as any).__stageProgress || 0;
      const projected3DVerts: THREE.Vector3[] = [];

      for (let i = 0; i < 16; i++) {
        let v4 = [...TESSERACT_4D_VERTICES[i]];

        // 4D Rotations (from Hypercube)
        v4 = rotate4D(v4, tAngle * 0.6, 0, 1);
        v4 = rotate4D(v4, tAngle * 0.4, 2, 3);
        v4 = rotate4D(v4, tAngle * 0.3, 0, 3);

        const stage = Math.floor(currentProgress);
        const frac = currentProgress - stage;

        let vTarget4D = v4;
        if (stage === 1) {
          vTarget4D = getHypersphere4D((i / 16), (i / 16));
        } else if (stage === 2) {
          vTarget4D = getCliffordTorus4D((i / 16), (i / 16));
        } else if (stage === 3) {
          vTarget4D = getMobius4D((i / 16), (i / 16));
        }

        // Interpolate 4D coordinates
        const interp4D = v4.map((val, k) => THREE.MathUtils.lerp(val, vTarget4D[k] || val, frac));

        // Project 4D to 3D
        const p3D = project4Dto3D(interp4D);
        projected3DVerts.push(p3D);

        // Update vertex sphere positions
        const sphereMesh = sphereGroup.children[i];
        if (sphereMesh) sphereMesh.position.copy(p3D);
      }

      // Update Line Segments
      const posArray = lineGeometry.attributes.position.array as Float32Array;
      TESSERACT_EDGES.forEach(([a, b], eIdx) => {
        const pA = projected3DVerts[a];
        const pB = projected3DVerts[b];
        posArray[eIdx * 6 + 0] = pA.x;
        posArray[eIdx * 6 + 1] = pA.y;
        posArray[eIdx * 6 + 2] = pA.z;
        posArray[eIdx * 6 + 3] = pB.x;
        posArray[eIdx * 6 + 4] = pB.y;
        posArray[eIdx * 6 + 5] = pB.z;
      });
      lineGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    (container as any).__threeScene = { scene, lineSegments, lineGeometry };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Pass progress to container reference
  useEffect(() => {
    const container = mountRef.current;
    if (container) {
      (container as any).__stageProgress = stageProgress;
    }
  }, [stageProgress]);

  // Pointer drag to orbit
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    const container = mountRef.current;
    if (container && (container as any).__threeScene) {
      const { scene } = (container as any).__threeScene;
      scene.rotation.y += deltaX * 0.008;
      scene.rotation.x += deltaY * 0.008;
    }

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="relative w-full rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden shadow-2xl my-12">
      {/* HEADER STAGE CARD */}
      <div className="absolute top-6 left-6 z-20 space-y-1 backdrop-blur-md bg-slate-900/85 border border-slate-800/80 p-4 rounded-xl max-w-sm pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: currentStage.color }} />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400">
            STAGE 0{currentStage.id} / 05 — {currentStage.geometryName}
          </span>
        </div>
        <h3 className="text-lg font-extrabold text-white tracking-tight">{currentStage.title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed pt-1">{currentStage.desc}</p>
      </div>

      {/* ENGRAVED KNOWLEDGE SOURCE NODES */}
      <div className="absolute top-6 right-6 z-20 flex flex-wrap gap-2 max-w-xs justify-end pointer-events-auto">
        {currentStage.panels.map((panel, idx) => (
          <span
            key={idx}
            onMouseEnter={() => setActivePanelHover(panel)}
            onMouseLeave={() => setActivePanelHover(null)}
            className={`text-[11px] font-mono font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activePanelHover === panel
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/60 scale-105 shadow-md shadow-emerald-950/40'
                : 'bg-slate-900/70 text-slate-300 border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400'
            }`}
          >
            ⌘ {panel}
          </span>
        ))}
      </div>

      {/* WEBGL 4D TESSERACT MOUNT */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-[540px] cursor-grab active:cursor-grabbing relative"
      >
        <div className="absolute bottom-20 left-6 z-10 opacity-40 pointer-events-none">
          <div className="text-xs font-mono text-slate-500 tracking-widest uppercase">4D TESSERACT KNOWLEDGE ENGINE</div>
          <div className="text-xl font-black text-slate-400 font-mono tracking-tighter">CONTINUOUS TOPOLOGY MORPH</div>
        </div>
      </div>

      {/* SCRUBBER & CONTROLS */}
      <div className="p-5 bg-slate-900/90 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 z-20 relative backdrop-blur-xl">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center font-bold transition-all shrink-0"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <div className="flex-1 sm:w-64 space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>TIMELINE SCRUBBER</span>
              <span>{(stageProgress * 3.75).toFixed(1)}s / 15.0s</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="0.001"
              value={stageProgress}
              onChange={(e) => {
                setIsPlaying(false);
                setStageProgress(parseFloat(e.target.value));
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
          {MORPH_STAGES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setIsPlaying(false);
                setStageProgress(idx);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap border ${
                Math.floor(stageProgress) === idx
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-400 shadow-lg shadow-emerald-950/40'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              0{s.id}. {s.geometryName.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* FINAL TAGLINE OVERLAY */}
      {Math.floor(stageProgress) === 4 && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-30 flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
          <div className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase mb-2">
            ORGANIZATIONAL MEMORY COMPLETE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Your Enterprise Thinks as One.
          </h2>
          <p className="text-slate-400 max-w-lg text-sm mb-6 leading-relaxed">
            SYNAPS is not another AI chatbot—it is the continuous intelligence layer that organizes, reasons over, and remembers everything across your organization.
          </p>
          <button
            onClick={() => {
              setStageProgress(0);
              setIsPlaying(true);
            }}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            Replay Transformation ↺
          </button>
        </div>
      )}
    </div>
  );
}
