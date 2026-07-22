'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { 
  X, ExternalLink, Send, FileText, FolderKanban, ShieldCheck,
  Command, Sparkles, Network, Calendar, Tag, Layers, CheckCircle2,
  HelpCircle, ArrowRight
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
  float fresnel = max(0.0, 0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)));
  float intensity = pow(fresnel, 2.0);
  
  float bands = sin(vPosition.y * 5.0 - uTime * 2.0) * sin(vPosition.x * 5.0 + uTime);
  bands = smoothstep(0.8, 1.0, bands);
  
  vec3 glow = uColor * intensity * 2.0;
  vec3 energy = vec3(1.0) * bands * (0.3 + uHover * 0.7);
  
  vec3 core = mix(uColor, vec3(1.0), uHover * 0.8);
  
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

  // Graph Reasoning AI State
  const [queryInput, setQueryInput] = useState('');
  const [reasoningResult, setReasoningResult] = useState<any | null>(null);
  const [isReasoning, setIsReasoning] = useState(false);

  // Node type filter
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    
    setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.d3Force('charge')?.strength(-400);
        fgRef.current.cameraPosition({ z: 400 });
        
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
    const t = (type || '').toUpperCase();
    switch (t) {
      case 'DOCUMENT': return '#10b981'; // emerald
      case 'CONTRACT': return '#f59e0b'; // amber
      case 'INVOICE': return '#ef4444'; // red
      case 'VENDOR':
      case 'CUSTOMER': return '#ec4899'; // pink
      case 'PROJECT':
      case 'BUDGET': return '#8b5cf6'; // purple
      case 'EMPLOYEE':
      case 'DEPARTMENT': return '#3b82f6'; // blue
      case 'DECISION':
      case 'MEETING': return '#eab308'; // yellow
      case 'POLICY':
      case 'COMPLIANCE_REQUIREMENT':
      case 'SOP': return '#06b6d4'; // cyan
      default: return '#a855f7';
    }
  };

  const filteredData = React.useMemo(() => {
    if (!selectedTypeFilter) return data;
    const nodes = data.nodes.filter(n => (n.type || '').toUpperCase() === selectedTypeFilter);
    const nodeIds = new Set(nodes.map(n => n.id));
    const links = data.links.filter(l => 
      nodeIds.has(typeof l.source === 'object' ? l.source.id : l.source) &&
      nodeIds.has(typeof l.target === 'object' ? l.target.id : l.target)
    );
    return { nodes, links };
  }, [data, selectedTypeFilter]);

  const handleNodeClick = useCallback((node: any) => {
    setSelectedNode(node);
    fgRef.current?.cameraPosition(
      { x: node.x, y: node.y, z: 250 },
      { x: node.x, y: node.y, z: 0 },
      1000
    );
  }, []);

  const sphereGeometry = React.useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);

  const nodeThreeObject = useCallback((node: any) => {
    const r = Math.sqrt(Math.max(0, node.val || 1)) * 1.5;
    const color = getNodeColor(node.type);
    
    const group = new THREE.Group();

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

    const sprite = new SpriteText(node.name);
    sprite.color = 'rgba(255, 255, 255, 0.85)';
    sprite.textHeight = 3.5;
    sprite.position.set(0, -(r + 6), 0);
    group.add(sprite);

    node.__material = material;
    return group;
  }, [sphereGeometry]);

  // GPU Animation Loop
  useEffect(() => {
    if (!mounted || !filteredData.nodes) return;
    
    let animationFrameId: number;
    const animate = () => {
      const time = performance.now() * 0.001;
      
      filteredData.nodes.forEach(node => {
        if (node.__material) {
          const isHovered = hoverNode?.id === node.id;
          const isSelected = selectedNode?.id === node.id;
          
          node.__material.uniforms.uTime.value = time;
          const targetHover = (isHovered || isSelected) ? 1.0 : 0.0;
          node.__material.uniforms.uHover.value += (targetHover - node.__material.uniforms.uHover.value) * 0.1;
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [mounted, filteredData, hoverNode, selectedNode]);

  const handleReasoningQuery = async () => {
    if (!queryInput.trim() || isReasoning) return;
    setIsReasoning(true);
    try {
      const res = await fetch('/api/graph/reason', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryInput })
      });
      const json = await res.json();
      if (json.success) {
        setReasoningResult(json);
      } else {
        setReasoningResult({ answer: `Error: ${json.error}`, relationshipPaths: [], confidenceScore: 0 });
      }
    } catch (e: any) {
      setReasoningResult({ answer: `Error: ${e.message}`, relationshipPaths: [], confidenceScore: 0 });
    } finally {
      setIsReasoning(false);
    }
  };

  if (!mounted) return null;

  const entityTypes = Array.from(new Set(data.nodes.map(n => (n.type || 'UNKNOWN').toUpperCase())));

  return (
    <div className="relative w-full h-full font-sans overflow-hidden">
      
      {/* Background Radial Gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-[#020204] to-[#010102] z-0"></div>

      {/* 3D Force Graph */}
      <div className="absolute inset-0 z-10 cursor-crosshair">
        <ForceGraph3D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={filteredData}
          nodeThreeObject={nodeThreeObject}
          linkWidth={0.6}
          linkColor={(link: any) => {
            const isHighlighted = selectedNode && (
              (typeof link.source === 'object' ? link.source.id : link.source) === selectedNode.id ||
              (typeof link.target === 'object' ? link.target.id : link.target) === selectedNode.id
            );
            return isHighlighted ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.12)';
          }}
          onNodeClick={handleNodeClick}
          onNodeHover={setHoverNode}
          onBackgroundClick={() => setSelectedNode(null)}
          d3AlphaDecay={0.05}
          d3VelocityDecay={0.4}
          backgroundColor="rgba(0,0,0,0)"
        />
      </div>

      {/* Floating Header */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-3 glass-panel px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors group">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="font-bold text-sm tracking-tight text-white uppercase">Synaps Memory Graph</span>
        </Link>
        <div className="h-6 w-px bg-white/20"></div>
        <div className="flex gap-2">
          <button 
            onClick={() => setSelectedTypeFilter(null)}
            className={cn("px-3 py-1 rounded-full text-xs font-semibold transition-all", !selectedTypeFilter ? "bg-primary text-white" : "bg-white/5 text-white/60 hover:text-white")}
          >
            All Nodes ({data.nodes.length})
          </button>
          {entityTypes.slice(0, 4).map(type => (
            <button
              key={type}
              onClick={() => setSelectedTypeFilter(selectedTypeFilter === type ? null : type)}
              className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border", 
                selectedTypeFilter === type ? "bg-white text-black font-semibold" : "bg-white/5 border-white/10 text-white/70 hover:text-white"
              )}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: getNodeColor(type) }}></span>
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Glassmorphic Legend */}
      <div className="absolute bottom-24 left-6 z-40 glass-panel border border-white/10 rounded-xl p-4 bg-black/40 backdrop-blur-md w-52 shadow-2xl">
        <h4 className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-3">Enterprise Node Types</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
          {[
            { label: 'Document', type: 'DOCUMENT' },
            { label: 'Contract', type: 'CONTRACT' },
            { label: 'Invoice / Vendor', type: 'INVOICE' },
            { label: 'Project / Budget', type: 'PROJECT' },
            { label: 'Employee / Dept', type: 'EMPLOYEE' },
            { label: 'Decision / Meeting', type: 'DECISION' },
            { label: 'Policy / Compliance', type: 'POLICY' },
          ].map(item => (
            <div key={item.type} className="flex items-center gap-2.5 text-xs text-white/80">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: getNodeColor(item.type) }}></div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Detail Inspector Panel */}
      <div className={cn(
        "absolute right-6 top-6 bottom-24 w-96 z-50 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]",
        selectedNode ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
      )}>
        {selectedNode && (
          <div className="w-full h-full glass-panel border border-white/10 rounded-2xl bg-black/60 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20 blur-2xl">
                <div className="w-32 h-32 rounded-full" style={{ background: getNodeColor(selectedNode.type) }}></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border" style={{ 
                    borderColor: `${getNodeColor(selectedNode.type)}40`,
                    color: getNodeColor(selectedNode.type),
                    backgroundColor: `${getNodeColor(selectedNode.type)}15`
                  }}>
                    {selectedNode.type}
                  </span>
                  {selectedNode.confidenceScore && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {(selectedNode.confidenceScore * 100).toFixed(0)}% Confidence
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white leading-tight mb-1">{selectedNode.name}</h2>
                <p className="text-xs text-white/60 line-clamp-2">{selectedNode.description}</p>
              </div>
              <button onClick={() => setSelectedNode(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors z-20">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Inspector */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              
              {/* Summary / Metadata */}
              {selectedNode.metadata?.summary && (
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-white/50 font-bold mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" /> AI Executive Summary
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed glass-panel p-3 border border-white/10 rounded-xl bg-white/5">
                    {selectedNode.metadata.summary}
                  </p>
                </div>
              )}

              {/* Keywords */}
              {selectedNode.metadata?.keywords && selectedNode.metadata.keywords.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-white/50 font-bold mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-400" /> Extracted Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.metadata.keywords.map((kw: string, i: number) => (
                      <span key={i} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[11px] text-white/80">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              {selectedNode.metadata?.timeline && selectedNode.metadata.timeline.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-white/50 font-bold mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Timeline Events
                  </h4>
                  <div className="space-y-2">
                    {selectedNode.metadata.timeline.map((ev: any, i: number) => (
                      <div key={i} className="flex gap-2 text-xs glass-panel p-2.5 border border-white/10 rounded-lg bg-white/5">
                        <span className="font-semibold text-cyan-400 text-[11px] whitespace-nowrap">{ev.date || 'Event'}</span>
                        <span className="text-white/70">{ev.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Source Document */}
              {selectedNode.document && (
                <div className="glass-panel p-3 border border-emerald-500/20 bg-emerald-500/5 rounded-xl">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mb-1">Source Document</span>
                  <p className="text-xs font-semibold text-white truncate">{selectedNode.document.name}</p>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* Graph Reasoning Result Floating Modal */}
      {reasoningResult && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
          <div className="glass-panel border border-indigo-500/40 bg-black/80 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl relative text-white">
            <button 
              onClick={() => setReasoningResult(null)} 
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              <h3 className="font-bold text-sm text-indigo-300 uppercase tracking-wider">Enterprise Graph Reasoning Answer</h3>
              <span className="ml-auto text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                {reasoningResult.confidenceScore}% Confidence
              </span>
            </div>
            <div className="text-sm leading-relaxed text-slate-200 mb-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
              {reasoningResult.answer}
            </div>
            {reasoningResult.relationshipPaths && reasoningResult.relationshipPaths.length > 0 && (
              <div className="border-t border-white/10 pt-3">
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-1.5">Graph Traversal Paths</span>
                <div className="space-y-1">
                  {reasoningResult.relationshipPaths.map((pathStr: string, idx: number) => (
                    <div key={idx} className="text-xs text-indigo-300 bg-indigo-950/40 border border-indigo-500/20 p-2 rounded flex items-center gap-2">
                      <ArrowRight className="w-3 h-3 text-indigo-400 shrink-0" />
                      <span>{pathStr}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Command Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-6">
        <div className="w-full glass-panel border border-white/20 bg-black/60 backdrop-blur-2xl rounded-full p-2 flex items-center gap-3 shadow-2xl">
          <div className="flex items-center gap-2 pl-4 pr-2 py-2 border-r border-white/10">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Graph RAG</span>
          </div>
          <input 
            type="text" 
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleReasoningQuery()}
            placeholder="Ask anything (e.g. Which vendor holds Contract X for Project Y?)..." 
            className="flex-1 bg-transparent border-none text-white outline-none placeholder:text-white/40 text-sm px-2"
          />
          <button 
            onClick={handleReasoningQuery}
            disabled={isReasoning}
            className="h-10 px-5 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-2 transition-colors shrink-0 shadow-lg"
          >
            {isReasoning ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{isReasoning ? 'Reasoning...' : 'Ask Memory Graph'}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
