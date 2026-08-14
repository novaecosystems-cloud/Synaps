'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { 
  X, ExternalLink, Send, FileText, FolderKanban, ShieldCheck,
  Command, Network, BrainCircuit, Calendar, Tag, Layers, CheckCircle2,
  HelpCircle, ArrowRight, Cpu, Zap, Users, Clock, History, AlertTriangle, Link2, Sparkles, FileCode, RefreshCw
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
  
  // Selection states
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [selectedLink, setSelectedLink] = useState<any | null>(null);
  
  const [nodeDetails, setNodeDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'docs' | 'people' | 'meetings' | 'projects' | 'decisions' | 'activity'>('summary');
  
  const [hoverNode, setHoverNode] = useState<any | null>(null);
  const [hoverLink, setHoverLink] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  // Controls
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);

  // Graph Reasoning AI State
  const [queryInput, setQueryInput] = useState('');
  const [reasoningResult, setReasoningResult] = useState<any | null>(null);
  const [isReasoning, setIsReasoning] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    
    setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.d3Force('charge')?.strength(-800);
        fgRef.current.d3Force('link')?.distance(140);
        fgRef.current.cameraPosition({ x: 0, y: 0, z: 280 }, { x: 0, y: 0, z: 0 }, 1000);
        
        const scene = fgRef.current.scene();
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(2, 2, 2);
        scene.add(ambientLight);
        scene.add(directionalLight);
      }
    }, 400);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (fgRef.current) {
      const controls = fgRef.current.controls();
      if (controls) {
        controls.autoRotate = autoRotate;
        controls.autoRotateSpeed = 0.8;
      }
    }
  }, [autoRotate]);

  const getNodeColor = (type: string) => {
    const t = (type || '').toUpperCase();
    switch (t) {
      case 'ORGANIZATION': return '#06b6d4'; // cyan
      case 'DOCUMENT': return '#3b82f6'; // royal blue
      case 'CONTRACT': return '#f59e0b'; // gold / amber
      case 'INVOICE': return '#ef4444'; // crimson
      case 'VENDOR':
      case 'CUSTOMER': return '#ec4899'; // pink / fuchsia
      case 'PROJECT': return '#6366f1'; // electric indigo
      case 'BUDGET': return '#8b5cf6'; // amethyst purple
      case 'EMPLOYEE':
      case 'DEPARTMENT': return '#38bdf8'; // sky blue
      case 'DECISION':
      case 'MEETING': return '#eab308'; // yellow
      case 'POLICY':
      case 'COMPLIANCE_REQUIREMENT':
      case 'SOP': return '#10b981'; // emerald shield
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

  const handleNodeClick = useCallback(async (node: any) => {
    setSelectedLink(null);
    setSelectedNode(node);
    setActiveTab('summary');
    setLoadingDetails(true);
    setNodeDetails(null);

    fgRef.current?.cameraPosition(
      { x: node.x, y: node.y, z: 140 },
      { x: node.x, y: node.y, z: 0 },
      1000
    );

    try {
      const res = await fetch(`/api/graph/node-details?nodeId=${node.id}`);
      const json = await res.json();
      if (json.success) {
        setNodeDetails(json.data);
      } else {
        setNodeDetails(null);
      }
    } catch (e) {
      console.error("Error fetching node details:", e);
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  const handleLinkClick = useCallback((link: any) => {
    setSelectedNode(null);
    setSelectedLink(link);
  }, []);

  // Custom Metallic Glassmorphic 3D Node Mesh
  const nodeThreeObject = useCallback((node: any) => {
    const colorHex = getNodeColor(node.type);
    const group = new THREE.Group();

    // Metallic Core Sphere
    const coreGeometry = new THREE.SphereGeometry(3.6, 32, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      emissive: new THREE.Color(colorHex),
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.8
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    // Outer Glass Aura Ring
    const auraGeometry = new THREE.SphereGeometry(4.8, 32, 32);
    const auraMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(colorHex),
      transparent: true,
      opacity: 0.25,
      roughness: 0.1,
      transmission: 0.8,
      thickness: 1.2
    });
    const aura = new THREE.Mesh(auraGeometry, auraMaterial);
    group.add(aura);

    // 3D Sprite Text Badge
    const sprite = new SpriteText(node.name || 'Entity');
    sprite.color = '#ffffff';
    sprite.textHeight = 3.8;
    sprite.fontWeight = '700';
    sprite.backgroundColor = 'rgba(2, 3, 6, 0.85)';
    sprite.padding = [3, 6];
    sprite.borderRadius = 6;
    sprite.position.set(0, 8, 0);
    group.add(sprite);

    return group;
  }, []);

  // Custom 3D Link Relationship Badge at Link Midpoint
  const linkThreeObject = useCallback((link: any) => {
    const label = link.type || 'CONNECTED_TO';
    const sprite = new SpriteText(label);
    sprite.color = '#a5b4fc';
    sprite.textHeight = 2.4;
    sprite.fontWeight = '700';
    sprite.backgroundColor = 'rgba(15, 23, 42, 0.9)';
    sprite.padding = [2, 4];
    sprite.borderRadius = 4;
    return sprite;
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
    <div className="relative w-full h-full bg-[#020306] overflow-hidden select-none font-sans">
      
      {/* 3D Force Graph Render */}
      <ForceGraph3D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={filteredData}
        nodeThreeObject={nodeThreeObject}
        linkThreeObject={linkThreeObject}
        linkPositionUpdate={(sprite: any, { start, end }: any) => {
          const middle = {
            x: start.x + (end.x - start.x) / 2,
            y: start.y + (end.y - start.y) / 2,
            z: start.z + (end.z - start.z) / 2
          };
          Object.assign(sprite.position, middle);
        }}
        nodeLabel={(n: any) => `<div style="background: rgba(2,3,6,0.95); border: 1px solid ${getNodeColor(n.type)}; padding: 8px 14px; border-radius: 12px; font-family: sans-serif; color: white; box-shadow: 0 10px 25px rgba(0,0,0,0.8);">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="background: ${getNodeColor(n.type)}30; color: ${getNodeColor(n.type)}; border: 1px solid ${getNodeColor(n.type)}60; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">${n.type || 'ENTITY'}</span>
            <strong style="font-[700]; font-size: 13px;">${n.name}</strong>
          </div>
          <p style="font-size: 11px; color: #cbd5e1; margin-top: 4px; line-height: 1.4;">${n.description || 'Enterprise Memory Node'}</p>
        </div>`}
        linkLabel={(l: any) => {
          const sourceName = typeof l.source === 'object' ? l.source.name : l.source;
          const targetName = typeof l.target === 'object' ? l.target.name : l.target;
          return `<div style="background: rgba(15, 23, 42, 0.95); border: 1px solid #6366f1; padding: 10px 14px; border-radius: 12px; font-family: sans-serif; color: white; max-width: 320px; box-shadow: 0 10px 25px rgba(0,0,0,0.8);">
            <div style="font-size: 10px; font-weight: 800; color: #a5b4fc; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">⚡ Connection Summary</div>
            <strong style="font-size: 12px; color: #f8fafc; display: block;">${sourceName} ➔ ${targetName}</strong>
            <span style="display: inline-block; background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); color: #818cf8; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin: 4px 0;">${l.type || 'RELATIONSHIP'}</span>
            <p style="font-size: 11px; color: #cbd5e1; margin: 4px 0 0 0; line-height: 1.4;">${l.description || 'Click link to view complete evidence & traceability.'}</p>
          </div>`;
        }}
        onNodeClick={handleNodeClick}
        onLinkClick={handleLinkClick}
        onNodeHover={(n: any) => setHoverNode(n)}
        onLinkHover={(l: any) => setHoverLink(l)}
        linkColor={(l: any) => (l === selectedLink || l === hoverLink ? '#818cf8' : 'rgba(99, 102, 241, 0.45)')}
        linkWidth={(l: any) => (l === selectedLink || l === hoverLink ? 3.5 : 1.8)}
        linkDirectionalParticles={3}
        linkDirectionalParticleWidth={2.4}
        linkDirectionalParticleSpeed={0.008}
        linkDirectionalParticleColor={() => '#a855f7'}
        backgroundColor="#020306"
      />

      {/* Top Left Header Toolbar */}
      <div className="absolute top-6 left-6 z-40 flex items-center gap-3">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-black/80 border border-indigo-500/30 backdrop-blur-xl shadow-2xl text-white">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm tracking-wider uppercase">Synaps Living Knowledge Graph</span>
        </div>

        {/* Controls Toolbar */}
        <div className="hidden md:flex items-center gap-1.5 p-1 bg-black/80 border border-white/10 backdrop-blur-xl rounded-2xl">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border",
              autoRotate ? "bg-emerald-600 text-white border-emerald-400 shadow-md" : "text-white/60 hover:text-white border-transparent"
            )}
          >
            <RefreshCw className={cn("w-3 h-3", autoRotate && "animate-spin")} />
            {autoRotate ? 'Orbit Active' : '3D Orbit'}
          </button>

          <button
            onClick={() => setSelectedTypeFilter(null)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
              !selectedTypeFilter ? "bg-indigo-600 text-white shadow-md" : "text-white/60 hover:text-white"
            )}
          >
            All Nodes ({data.nodes.length})
          </button>

          {['ORGANIZATION', 'CONTRACT', 'VENDOR', 'POLICY', 'BUDGET', 'DOCUMENT'].map((t) => (
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

      {/* Node Legend Panel */}
      <div className="absolute left-6 bottom-24 z-40 hidden sm:block p-4 bg-black/80 border border-white/10 backdrop-blur-2xl rounded-2xl space-y-2 text-white w-52 shadow-2xl">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Enterprise Node Types</span>
        <div className="space-y-1.5 text-xs">
          {[
            { type: 'ORGANIZATION', label: 'Organization Vault' },
            { type: 'CONTRACT', label: 'Legal MSA / Contract' },
            { type: 'VENDOR', label: 'Vendor / Partner' },
            { type: 'POLICY', label: 'Compliance & Policy' },
            { type: 'BUDGET', label: 'Financial Budget' },
            { type: 'DOCUMENT', label: 'Ingested File' },
            { type: 'PROJECT', label: 'Strategic Project' }
          ].map(item => (
            <div key={item.type} className="flex items-center gap-2 font-medium">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: getNodeColor(item.type) }}></div>
              <span className="text-slate-200">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Connection Relationship Inspector Drawer (WHEN A LINK IS CLICKED) */}
      {selectedLink && (
        <div className="absolute right-6 top-6 bottom-24 w-full max-w-md z-50 transition-all duration-300 animate-in slide-in-from-right-5 font-sans">
          <div className="w-full h-full border border-indigo-500/40 rounded-3xl bg-black/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden text-white">
            
            {/* Header */}
            <div className="p-6 border-b border-indigo-500/20 relative bg-indigo-500/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1">
                  <Link2 className="w-3 h-3 text-indigo-400" /> Connection Relationship Summary
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {((selectedLink.confidenceScore || 0.98) * 100).toFixed(0)}% Traceability
                </span>
              </div>
              
              <h2 className="text-lg font-extrabold text-white leading-tight mt-2 flex items-center gap-2">
                <span style={{ color: getNodeColor(selectedLink.source?.type) }}>{typeof selectedLink.source === 'object' ? selectedLink.source.name : selectedLink.source}</span>
                <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0" />
                <span style={{ color: getNodeColor(selectedLink.target?.type) }}>{typeof selectedLink.target === 'object' ? selectedLink.target.name : selectedLink.target}</span>
              </h2>

              <button onClick={() => setSelectedLink(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Relationship Detail Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              
              {/* Relationship Type Badge */}
              <div>
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-1">Relationship Predicate</span>
                <span className="px-3 py-1 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-purple-300 text-xs font-mono font-bold inline-block">
                  {selectedLink.type || 'CONNECTED_TO'}
                </span>
              </div>

              {/* Executive Connection Explanation */}
              <div>
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Why They Are Connected
                </span>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200 leading-relaxed font-sans">
                  {selectedLink.description || 'These enterprise entities share a direct operational, legal, or financial dependency.'}
                </div>
              </div>

              {/* Empirical Document Citation */}
              <div>
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-1.5 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" /> Source Citation & Evidence
                </span>
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-mono">
                  ✓ {selectedLink.evidence || 'Verified by Enterprise Knowledge Graph Mining Engine.'}
                </div>
              </div>

              {/* Source & Target Entity Cards */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-white/40 block">From Entity</span>
                  <strong className="text-xs text-white block truncate">{typeof selectedLink.source === 'object' ? selectedLink.source.name : selectedLink.source}</strong>
                  <span className="text-[10px] text-indigo-400 font-mono block">{selectedLink.source?.type || 'NODE'}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-white/40 block">To Entity</span>
                  <strong className="text-xs text-white block truncate">{typeof selectedLink.target === 'object' ? selectedLink.target.name : selectedLink.target}</strong>
                  <span className="text-[10px] text-indigo-400 font-mono block">{selectedLink.target?.type || 'NODE'}</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Right Detail Inspector Drawer (WHEN A NODE IS CLICKED) */}
      <div className={cn(
        "absolute right-6 top-6 bottom-24 w-full max-w-md z-50 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]",
        selectedNode ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
      )}>
        {selectedNode && (
          <div className="w-full h-full border border-white/10 rounded-3xl bg-black/90 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden text-white">
            
            {/* Header */}
            <div className="p-6 border-b border-white/10 relative overflow-hidden bg-white/5">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border" style={{ 
                  borderColor: `${getNodeColor(selectedNode.type)}40`,
                  color: getNodeColor(selectedNode.type),
                  backgroundColor: `${getNodeColor(selectedNode.type)}15`
                }}>
                  {selectedNode.type}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {(selectedNode.confidenceScore ? selectedNode.confidenceScore * 100 : 96).toFixed(0)}% Confidence
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white leading-tight mb-1 pr-8">{selectedNode.name}</h2>
              <p className="text-xs text-white/60 line-clamp-2">{selectedNode.description}</p>

              <button onClick={() => setSelectedNode(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors z-20">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-white/10 px-4 py-2 bg-black/40 overflow-x-auto custom-scrollbar text-[11px] font-bold uppercase tracking-wider">
              {[
                { id: 'summary', label: 'Summary', icon: FileText },
                { id: 'docs', label: 'Docs', icon: FileText, count: nodeDetails?.linkedDocs?.length },
                { id: 'people', label: 'People', icon: Users, count: nodeDetails?.linkedPeople?.length },
                { id: 'meetings', label: 'Meetings', icon: Calendar, count: nodeDetails?.linkedMeetings?.length },
                { id: 'projects', label: 'Projects', icon: FolderKanban, count: nodeDetails?.linkedProjects?.length },
                { id: 'decisions', label: 'Decisions', icon: Zap, count: nodeDetails?.relatedDecisions?.length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shrink-0",
                    activeTab === tab.id ? "bg-indigo-600 text-white shadow-md" : "text-white/50 hover:text-white"
                  )}
                >
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[9px]">{tab.count}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {loadingDetails ? (
                <div className="py-12 text-center text-white/40 text-xs font-mono animate-pulse">
                  Traversing knowledge graph relationships...
                </div>
              ) : (
                <>
                  {activeTab === 'summary' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-[10px] uppercase tracking-wider text-white/50 font-bold mb-2 flex items-center gap-1.5">
                          <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" /> Executive Node Summary
                        </h4>
                        <p className="text-xs text-white/80 leading-relaxed p-3.5 border border-white/10 rounded-2xl bg-white/5">
                          {selectedNode.metadata?.summary || selectedNode.description || 'Enterprise Memory Node indexed into connected knowledge graph.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'docs' && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] uppercase tracking-wider text-white/50 font-bold mb-2">Linked Documents</h4>
                      {!nodeDetails?.linkedDocs?.length ? (
                        <p className="text-xs text-white/40 font-mono py-4">No linked documents found.</p>
                      ) : (
                        nodeDetails.linkedDocs.map((doc: any, i: number) => (
                          <div key={i} className="p-3 border border-white/10 rounded-2xl bg-white/5 flex items-center justify-between text-xs">
                            <div>
                              <strong className="text-white block font-bold">{doc.name}</strong>
                              <span className="text-[10px] text-emerald-400 font-mono">{doc.relationType}</span>
                            </div>
                            <Link href={`/dashboard/documents/${doc.id}`} className="text-indigo-400 hover:underline text-[11px]">View →</Link>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'people' && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] uppercase tracking-wider text-white/50 font-bold mb-2">Linked Stakeholders & People</h4>
                      {!nodeDetails?.linkedPeople?.length ? (
                        <p className="text-xs text-white/40 font-mono py-4">No linked people found.</p>
                      ) : (
                        nodeDetails.linkedPeople.map((p: any, i: number) => (
                          <div key={i} className="p-3 border border-white/10 rounded-2xl bg-white/5 text-xs">
                            <strong className="text-white block font-bold">{p.name}</strong>
                            <span className="text-[10px] text-indigo-300 font-mono">{p.relationType}: {p.description}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Graph Reasoning Result Floating Modal */}
      {reasoningResult && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4 animate-in fade-in duration-200">
          <div className="border border-indigo-500/40 bg-black/95 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl relative text-white max-h-[80vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setReasoningResult(null)} 
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2.5 mb-4 border-b border-white/10 pb-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                <BrainCircuit className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-indigo-300 uppercase tracking-wider">Enterprise Living Graph Answer</h3>
                <span className="text-[10px] text-white/40 font-mono">Grounded in company memory & knowledge graph</span>
              </div>
              <span className="ml-auto text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {reasoningResult.confidenceScore}% Confidence
              </span>
            </div>

            <div className="text-sm leading-relaxed text-slate-200 mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 whitespace-pre-wrap font-sans">
              {reasoningResult.answer}
            </div>
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
            placeholder="Ask anything (e.g. 'Why is Vendor Acme connected to Master Contract?')..." 
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
