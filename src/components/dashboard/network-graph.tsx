'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { 
  X, ExternalLink, Send, FileText, FolderKanban, ShieldCheck,
  Command, Network, BrainCircuit, Calendar, Tag, Layers, CheckCircle2,
  HelpCircle, ArrowRight, Cpu, Zap
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
    
    // Minimalist Force Layout: Strong repulsion (-750) & spacious link distance (130) to eliminate text overlaps
    setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.d3Force('charge')?.strength(-750);
        fgRef.current.d3Force('link')?.distance(130);
        fgRef.current.cameraPosition({ x: 0, y: 0, z: 280 }, { x: 0, y: 0, z: 0 }, 1000);
        
        const scene = fgRef.current.scene();
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(1, 1, 1);
        scene.add(ambientLight);
        scene.add(directionalLight);
      }
    }, 400);

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
      { x: node.x, y: node.y, z: 140 },
      { x: node.x, y: node.y, z: 0 },
      1000
    );
  }, []);

  // Minimalist, Clean 3D Node Object (MaayanLab Style: Sleek Glowing Orbs + Crisp Floating Text)
  const nodeThreeObject = useCallback((node: any) => {
    const color = getNodeColor(node.type);
    const group = new THREE.Group();

    // 1. Sleek 3D Glowing Orb Sphere (Radius 3.5)
    const geometry = new THREE.SphereGeometry(3.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.9
    });
    const sphere = new THREE.Mesh(geometry, material);
    group.add(sphere);

    // 2. Minimalist Floating Sprite Text Label (Clean, zero box background clutter)
    const sprite = new SpriteText(node.name || 'Entity');
    sprite.color = '#f8fafc';
    sprite.textHeight = 3.6;
    sprite.fontWeight = '600';
    sprite.backgroundColor = 'rgba(3, 4, 8, 0.75)';
    sprite.padding = [2, 4];
    sprite.borderRadius = 4;
    sprite.position.set(0, 7, 0);
    group.add(sprite);

    return group;
  }, []);

  const handleReasoningQuery = async () => {
    if (!queryInput.trim() || isReasoning) return;
    setIsReasoning(true);
    setReasoningResult(null);

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
        alert(`Graph RAG Error: ${json.error}`);
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsReasoning(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative w-full h-full bg-[#030408] overflow-hidden select-none font-sans">
      
      {/* 3D Force Graph Render */}
      <ForceGraph3D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={filteredData}
        nodeThreeObject={nodeThreeObject}
        nodeLabel={(n: any) => `<div style="background: rgba(3,4,8,0.95); border: 1px solid ${getNodeColor(n.type)}; padding: 6px 12px; border-radius: 10px; font-family: sans-serif; color: white;">
          <strong style="color: ${getNodeColor(n.type)}; font-size: 11px;">${n.type || 'ENTITY'}</strong>: <span style="font-weight: 700;">${n.name}</span><br/>
          <span style="font-size: 11px; color: #94a3b8;">${n.description || 'Enterprise Memory Node'}</span>
        </div>`}
        onNodeClick={handleNodeClick}
        onNodeHover={(n: any) => setHoverNode(n)}
        linkColor={() => 'rgba(99, 102, 241, 0.35)'}
        linkWidth={1.5}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1.8}
        linkDirectionalParticleSpeed={0.006}
        linkDirectionalParticleColor={() => '#a855f7'}
        backgroundColor="#030408"
      />

      {/* Top Left Header (Minimalist Synaps Memory Graph) */}
      <div className="absolute top-6 left-6 z-40 flex items-center gap-3">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-black/80 border border-indigo-500/30 backdrop-blur-xl shadow-2xl text-white">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm tracking-wider uppercase">Synaps Memory Graph</span>
        </div>

        {/* Node Filters */}
        <div className="hidden md:flex items-center gap-1.5 p-1 bg-black/80 border border-white/10 backdrop-blur-xl rounded-2xl">
          <button
            onClick={() => setSelectedTypeFilter(null)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
              !selectedTypeFilter ? "bg-indigo-600 text-white shadow-md" : "text-white/60 hover:text-white"
            )}
          >
            All Nodes ({data.nodes.length})
          </button>
          {['ORGANIZATION', 'DOCUMENT', 'MEETING', 'CONTRACT', 'VENDOR'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTypeFilter(selectedTypeFilter === t ? null : t)}
              className={cn(
                "px-2.5 py-1.5 rounded-xl text-[11px] font-bold uppercase transition-all flex items-center gap-1 border",
                selectedTypeFilter === t ? "border-indigo-500 text-white bg-indigo-500/20" : "border-transparent text-white/60 hover:text-white"
              )}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: getNodeColor(t) }} />
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Left Node Types Legend Panel */}
      <div className="absolute left-6 bottom-24 z-40 hidden sm:block p-4 bg-black/80 border border-white/10 backdrop-blur-2xl rounded-2xl space-y-2 text-white w-48 shadow-2xl">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Enterprise Node Types</span>
        <div className="space-y-1.5 text-xs">
          {[
            { type: 'DOCUMENT', label: 'Document' },
            { type: 'CONTRACT', label: 'Contract' },
            { type: 'VENDOR', label: 'Invoice / Vendor' },
            { type: 'PROJECT', label: 'Project / Budget' },
            { type: 'DEPARTMENT', label: 'Employee / Dept' },
            { type: 'MEETING', label: 'Decision / Meeting' },
            { type: 'POLICY', label: 'Policy / Compliance' }
          ].map(item => (
            <div key={item.type} className="flex items-center gap-2 font-medium">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: getNodeColor(item.type) }}></div>
              <span className="text-slate-200">{item.label}</span>
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
          <div className="w-full h-full border border-white/10 rounded-2xl bg-black/85 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden text-white">
            
            <div className="p-6 border-b border-white/10 relative overflow-hidden">
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

              <button onClick={() => setSelectedNode(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors z-20">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {selectedNode.metadata?.summary && (
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-white/50 font-bold mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" /> AI Executive Summary
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed p-3 border border-white/10 rounded-xl bg-white/5">
                    {selectedNode.metadata.summary}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Graph Reasoning Result Floating Modal */}
      {reasoningResult && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in fade-in duration-200">
          <div className="border border-indigo-500/40 bg-black/90 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl relative text-white">
            <button 
              onClick={() => setReasoningResult(null)} 
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2.5 mb-3 border-b border-white/10 pb-3">
              <div className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <BrainCircuit className="w-4 h-4 animate-pulse" />
              </div>
              <h3 className="font-extrabold text-sm text-indigo-300 uppercase tracking-wider">Enterprise Graph Reasoning Answer</h3>
              <span className="ml-auto text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30 font-bold">
                {reasoningResult.confidenceScore}% Confidence
              </span>
            </div>

            <div className="text-sm leading-relaxed text-slate-200 mb-4 max-h-60 overflow-y-auto custom-scrollbar pr-2 whitespace-pre-wrap">
              {reasoningResult.answer}
            </div>

            {reasoningResult.relationshipPaths && reasoningResult.relationshipPaths.length > 0 && (
              <div className="border-t border-white/10 pt-3">
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-1.5">Graph Traversal Paths</span>
                <div className="space-y-1.5">
                  {reasoningResult.relationshipPaths.map((pathStr: string, idx: number) => (
                    <div key={idx} className="text-xs text-indigo-300 bg-indigo-950/40 border border-indigo-500/20 p-2.5 rounded-xl flex items-center gap-2 font-mono">
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
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
        <div className="w-full border border-white/20 bg-black/80 backdrop-blur-2xl rounded-full p-2 flex items-center gap-3 shadow-2xl">
          <div className="flex items-center gap-2 pl-4 pr-2 py-2 border-r border-white/10 shrink-0">
            <BrainCircuit className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-extrabold text-white uppercase tracking-wider">Graph RAG</span>
          </div>
          <input 
            type="text" 
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleReasoningQuery()}
            placeholder="Ask anything (e.g. 'meeting 3' or 'Who holds Contract X?')..." 
            className="flex-1 bg-transparent border-none text-white outline-none placeholder:text-white/40 text-xs sm:text-sm px-2 font-sans"
          />
          <button 
            onClick={handleReasoningQuery}
            disabled={isReasoning}
            className="h-10 px-5 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shrink-0 shadow-lg"
          >
            {isReasoning ? <BrainCircuit className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{isReasoning ? 'Reasoning...' : 'Ask Memory Graph'}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
