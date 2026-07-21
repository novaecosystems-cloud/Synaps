'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { 
  X, ExternalLink, Send, FileText, FolderKanban, ShieldCheck,
  Command
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SpriteText from 'three-spritetext';

interface NetworkGraphProps {
  data: {
    nodes: any[];
    links: any[];
  }
}

const vertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec3 uColor;
uniform float uHover;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Prevent negative values in pow() which causes invisible/black materials
  float fresnel = max(0.0, 0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)));
  float intensity = pow(fresnel, 2.0);
  
  // Energy flow bands
  float bands = sin(vPosition.y * 5.0 - uTime * 2.0) * sin(vPosition.x * 5.0 + uTime);
  bands = smoothstep(0.8, 1.0, bands);
  
  // Base coloring
  vec3 glow = uColor * intensity * 2.0;
  vec3 energy = vec3(1.0) * bands * (0.3 + uHover * 0.7);
  
  // Core highlight on hover
  vec3 core = mix(uColor, vec3(1.0), uHover * 0.8);
  
  // Final mix
  vec3 finalColor = glow + energy + (core * 0.4);
  float alpha = clamp(intensity * 1.5 + bands + uHover, 0.3, 1.0);
  
  gl_FragColor = vec4(finalColor, alpha);
}
`;

export function NetworkGraph({ data }: NetworkGraphProps) {
  const fgRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [hoverNode, setHoverNode] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    
    // Initial camera zoom and lighting
    setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.d3Force('charge')?.strength(-400);
        fgRef.current.cameraPosition({ z: 400 });
        
        // Add custom lighting to the scene for the 3D materials
        const scene = fgRef.current.scene();
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(ambientLight);
        scene.add(directionalLight);
      }
    }, 500);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'organization': return '#eab308'; // yellow/gold
      case 'project': return '#a855f7'; // purple
      case 'user': return '#3b82f6'; // blue
      case 'document': return '#10b981'; // emerald/green
      default: return '#ffffff';
    }
  };

  const handleNodeClick = useCallback((node: any) => {
    setSelectedNode(node);
    
    // Slide camera flat over the node without twisting the angle
    fgRef.current?.cameraPosition(
      { x: node.x, y: node.y, z: 250 }, // Position directly above
      { x: node.x, y: node.y, z: 0 },   // Look straight down at it
      1000  // ms transition
    );
  }, []);

  // Shared geometry to save memory (memoized to prevent GPU memory leak on re-render)
  const sphereGeometry = React.useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);

  // Construct 3D Mesh for each node
  const nodeThreeObject = useCallback((node: any) => {
    const r = Math.sqrt(Math.max(0, node.val || 1)) * 1.5;
    const color = getNodeColor(node.type);
    
    const group = new THREE.Group();

    // The Shader Sphere
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
        uHover: { value: 0.0 }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const sphere = new THREE.Mesh(sphereGeometry, material);
    sphere.scale.set(r, r, r);
    group.add(sphere);

    // Text Label
    const sprite = new SpriteText(node.name);
    sprite.color = 'rgba(255, 255, 255, 0.8)';
    sprite.textHeight = 3.5;
    sprite.position.set(0, -(r + 6), 0);
    group.add(sprite);

    node.__material = material; // Store reference for GPU animation loop
    return group;
  }, [sphereGeometry]);

  // GPU Animation Loop
  useEffect(() => {
    if (!mounted || !data.nodes) return;
    
    let animationFrameId: number;
    const animate = () => {
      const time = performance.now() * 0.001;
      
      data.nodes.forEach(node => {
        if (node.__material) {
          const isHovered = hoverNode?.id === node.id;
          const isSelected = selectedNode?.id === node.id;
          
          // Update Time for Shader
          node.__material.uniforms.uTime.value = time;

          // Smooth interpolation for hover state
          const targetHover = (isHovered || isSelected) ? 1.0 : 0.0;
          node.__material.uniforms.uHover.value += (targetHover - node.__material.uniforms.uHover.value) * 0.1;
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [mounted, data, hoverNode, selectedNode]);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-full font-sans">
      
      {/* Background Radial Gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/10 via-[#020204] to-[#010102] z-0"></div>

      {/* 3D Force Graph */}
      <div className="absolute inset-0 z-10 cursor-crosshair">
        <ForceGraph3D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={data}
          nodeThreeObject={nodeThreeObject}
          linkWidth={0.5}
          linkColor={(link: any) => {
            const isHighlighted = selectedNode && (link.source.id === selectedNode.id || link.target.id === selectedNode.id);
            return isHighlighted ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.1)';
          }}
          onNodeClick={handleNodeClick}
          onNodeHover={setHoverNode}
          onBackgroundClick={() => setSelectedNode(null)}
          d3AlphaDecay={0.05}
          d3VelocityDecay={0.4}
          backgroundColor="rgba(0,0,0,0)" // Transparent to let the CSS gradient show
        />
      </div>

      {/* Floating Header / Navigation */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-3 glass-panel px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors group">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="font-bold text-sm tracking-tight text-white uppercase">Sisyphus</span>
        </Link>
        <div className="h-6 w-px bg-white/20"></div>
        <Link href="/dashboard/projects" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Projects</Link>
        <Link href="/dashboard/documents" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Documents</Link>
      </div>

      {/* Glassmorphic Legend (Left side) */}
      <div className="absolute bottom-24 left-6 z-50 glass-panel border border-white/10 rounded-xl p-4 bg-black/40 backdrop-blur-md w-48 shadow-2xl">
        <h4 className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-3">Legend</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full shadow-[0_0_10px_#eab308]" style={{ background: '#eab308' }}></div>
            <span className="text-xs text-white/80 font-medium">Organization</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full shadow-[0_0_10px_#a855f7]" style={{ background: '#a855f7' }}></div>
            <span className="text-xs text-white/80 font-medium">Projects</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full shadow-[0_0_10px_#10b981]" style={{ background: '#10b981' }}></div>
            <span className="text-xs text-white/80 font-medium">Documents</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full shadow-[0_0_10px_#3b82f6]" style={{ background: '#3b82f6' }}></div>
            <span className="text-xs text-white/80 font-medium">Team Members</span>
          </div>
        </div>
      </div>

      {/* Right Detail Panel (Animated conditionally) */}
      <div className={cn(
        "absolute right-6 top-6 bottom-24 w-96 z-50 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]",
        selectedNode ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
      )}>
        {selectedNode && (
          <div className="w-full h-full glass-panel border border-white/10 rounded-2xl bg-black/50 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 blur-xl">
                <div className="w-24 h-24 rounded-full" style={{ background: getNodeColor(selectedNode.type) }}></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border" style={{ 
                    borderColor: `${getNodeColor(selectedNode.type)}40`,
                    color: getNodeColor(selectedNode.type),
                    backgroundColor: `${getNodeColor(selectedNode.type)}10`
                  }}>
                    {selectedNode.type}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium border border-white/10 text-white/70 bg-white/5">
                    Active
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white leading-tight mb-2">{selectedNode.name}</h2>
                <p className="text-xs text-white/50 flex items-center gap-1">
                  ID: {selectedNode.id.split('-').pop()}
                </p>
              </div>
              <button onClick={() => setSelectedNode(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors z-20">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dynamic Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              
              {/* Type Specific Metric Blocks */}
              {selectedNode.type === 'document' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-panel border border-white/10 bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-white/50 mb-1">File Type</p>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-white truncate">{selectedNode.mimeType}</span>
                    </div>
                  </div>
                  <div className="glass-panel border border-white/10 bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-white/50 mb-1">File Size</p>
                    <p className="text-lg font-medium text-white">{(selectedNode.sizeBytes / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              )}

              {selectedNode.type === 'project' && (
                <div className="glass-panel border border-white/10 bg-white/5 rounded-xl p-5 relative overflow-hidden">
                   <div className="flex justify-between items-end mb-4">
                     <div>
                       <p className="text-sm text-white/60 mb-1">Completion Rate</p>
                       <h3 className="text-3xl font-bold text-white flex items-baseline gap-1">
                         65<span className="text-lg text-white/40">%</span>
                       </h3>
                     </div>
                     <span className="text-xs text-emerald-400 flex items-center gap-1 bg-emerald-400/10 px-2 py-1 rounded">
                       +12% <span className="opacity-50">mo</span>
                     </span>
                   </div>
                   
                   {/* Fake bar chart */}
                   <div className="flex items-end justify-between h-12 gap-1 w-full opacity-60">
                     {[20, 35, 25, 45, 60, 40, 75, 50, 85, 65, 45, 70].map((h, i) => (
                       <div key={i} className="w-full bg-primary/40 rounded-t-sm" style={{ height: `${h}%` }}></div>
                     ))}
                   </div>
                </div>
              )}

              {/* Analysis Block */}
              <div className="glass-panel border border-red-500/20 bg-red-500/5 rounded-xl p-5 relative overflow-hidden group hover:border-red-500/40 transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50 group-hover:bg-red-500 transition-colors"></div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-red-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> AI Analysis Flag
                  </h4>
                  <ExternalLink className="w-4 h-4 text-red-400/50" />
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Multiple dependencies were found to be out of date or require compliance review within the context of this node. Proceed with caution.
                </p>
              </div>

              {/* Related Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel border border-white/10 bg-black/40 rounded-xl p-4 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-1.5 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-bold text-white">12</span>
                  </div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider">Related Items</p>
                </div>
                
                <div className="glass-panel border border-white/10 bg-black/40 rounded-xl p-4 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-1.5 rounded-full border border-blue-500/30 text-blue-400 bg-blue-500/10">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-bold text-white">4</span>
                  </div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider">Documents</p>
                </div>
              </div>
            </div>
            
            {/* Action Footer */}
            <div className="p-6 border-t border-white/10 bg-black/40">
              <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10">
                Explore Details
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Command Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-6">
        {/* Top metrics bar above search */}
        <div className="flex items-center justify-between mb-4 px-4">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Compliance Rate</p>
              <p className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                <span className="text-sm bg-emerald-400/20 px-1.5 py-0.5 rounded">↑</span> 98%
              </p>
            </div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Total Nodes</p>
              <div className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span> {data.nodes.length}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Implementation</p>
              <p className="text-lg font-bold text-blue-400 flex items-center gap-2">
                <span className="text-sm bg-blue-400/20 px-1.5 py-0.5 rounded">👍</span> 57%
              </p>
            </div>
          </div>
        </div>
        
        {/* Search/Chat Input */}
        <div className="w-full glass-panel border border-white/20 bg-white/5 backdrop-blur-xl rounded-full p-2 flex items-center gap-3 shadow-2xl">
          <div className="flex items-center gap-2 pl-4 pr-2 py-2 border-r border-white/10">
            <Command className="w-4 h-4 text-white/50" />
            <span className="text-sm font-medium text-white/80">AI Agent</span>
          </div>
          <input 
            type="text" 
            placeholder="Ask a question about the organization data..." 
            className="flex-1 bg-transparent border-none text-white outline-none placeholder:text-white/40 text-sm px-2"
          />
          <button className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors shrink-0">
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
