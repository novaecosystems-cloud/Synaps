'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { 
  X, ExternalLink, Send, FileText, FolderKanban, ShieldCheck,
  Command, Network, BrainCircuit, Calendar, Tag, Layers, CheckCircle2,
  HelpCircle, ArrowRight, Cpu, Zap, Users, Clock, History, AlertTriangle
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
  const [nodeDetails, setNodeDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'docs' | 'people' | 'meetings' | 'projects' | 'decisions' | 'activity'>('summary');
  
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

  const handleNodeClick = useCallback(async (node: any) => {
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

  const nodeThreeObject = useCallback((node: any) => {
    const color = getNodeColor(node.type);
    const group = new THREE.Group();

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

      {/* Top Left Header */}
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
          {['ORGANIZATION', 'DOCUMENT', 'MEETING', 'CONTRACT', 'VENDOR', 'PROJECT', 'EMPLOYEE'].map((t) => (
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
      <div className="absolute left-6 bottom-24 z-40 hidden sm:block p-4 bg-black/80 border border-white/10 backdrop-blur-2xl rounded-2xl space-y-2 text-white w-48 shadow-2xl">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Enterprise Node Types</span>
        <div className="space-y-1.5 text-xs">
          {[
            { type: 'DOCUMENT', label: 'Document' },
            { type: 'CONTRACT', label: 'Contract' },
            { type: 'VENDOR', label: 'Customer / Vendor' },
            { type: 'PROJECT', label: 'Project / Budget' },
            { type: 'EMPLOYEE', label: 'Employee / Dept' },
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

      {/* Right Detail Inspector Drawer */}
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
                { id: 'decisions', label: 'Decisions', icon: Zap, count: nodeDetails?.relatedDecisions?.length },
                { id: 'activity', label: 'Timeline', icon: Clock }
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
                      {selectedNode.metadata?.keywords?.length > 0 && (
                        <div>
                          <h4 className="text-[10px] uppercase tracking-wider text-white/50 font-bold mb-2">Entity Keywords</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedNode.metadata.keywords.map((kw: string, i: number) => (
                              <span key={i} className="px-2.5 py-1 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono">
                                #{kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
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

                  {activeTab === 'meetings' && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] uppercase tracking-wider text-white/50 font-bold mb-2">Linked Meetings</h4>
                      {!nodeDetails?.linkedMeetings?.length ? (
                        <p className="text-xs text-white/40 font-mono py-4">No linked meetings found.</p>
                      ) : (
                        nodeDetails.linkedMeetings.map((m: any, i: number) => (
                          <div key={i} className="p-3 border border-white/10 rounded-2xl bg-white/5 text-xs">
                            <strong className="text-white block font-bold">{m.name}</strong>
                            <span className="text-[10px] text-amber-400 font-mono">{m.relationType}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'projects' && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] uppercase tracking-wider text-white/50 font-bold mb-2">Linked Projects</h4>
                      {!nodeDetails?.linkedProjects?.length ? (
                        <p className="text-xs text-white/40 font-mono py-4">No linked projects found.</p>
                      ) : (
                        nodeDetails.linkedProjects.map((proj: any, i: number) => (
                          <div key={i} className="p-3 border border-white/10 rounded-2xl bg-white/5 text-xs">
                            <strong className="text-white block font-bold">{proj.name}</strong>
                            <span className="text-[10px] text-purple-400 font-mono">{proj.relationType}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'decisions' && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] uppercase tracking-wider text-white/50 font-bold mb-2">Related Decisions</h4>
                      {!nodeDetails?.relatedDecisions?.length ? (
                        <p className="text-xs text-white/40 font-mono py-4">No related decisions found.</p>
                      ) : (
                        nodeDetails.relatedDecisions.map((dec: any, i: number) => (
                          <div key={i} className="p-3 border border-amber-500/30 rounded-2xl bg-amber-500/10 text-xs">
                            <strong className="text-amber-300 block font-bold">{dec.name}</strong>
                            <span className="text-[10px] text-white/60 font-mono">{dec.evidence || dec.description}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'activity' && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] uppercase tracking-wider text-white/50 font-bold mb-2">Recent Node Activity</h4>
                      {!nodeDetails?.recentActivity?.length ? (
                        <p className="text-xs text-white/40 font-mono py-4">No recent activity recorded.</p>
                      ) : (
                        nodeDetails.recentActivity.map((act: any, i: number) => (
                          <div key={i} className="p-3 border border-white/10 rounded-2xl bg-white/5 text-xs font-mono">
                            <span className="text-indigo-400 block text-[10px]">{new Date(act.date).toLocaleDateString()}</span>
                            <span className="text-white/80">{act.activity}</span>
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
            
            {/* Answer Header */}
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

            {/* Answer Content */}
            <div className="text-sm leading-relaxed text-slate-200 mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 whitespace-pre-wrap font-sans">
              {reasoningResult.answer}
            </div>

            {/* Related Entities */}
            {reasoningResult.relatedEntities && reasoningResult.relatedEntities.length > 0 && (
              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-2">Connected Entities</span>
                <div className="flex flex-wrap gap-2">
                  {reasoningResult.relatedEntities.map((ent: any, idx: number) => (
                    <div key={idx} className="px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-xs font-mono flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: getNodeColor(ent.type) }} />
                      <strong className="text-white">{ent.name}</strong>
                      <span className="text-[10px] text-indigo-300">({ent.relation || ent.type})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sources & Citations */}
            {reasoningResult.sources && reasoningResult.sources.length > 0 && (
              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-2">Sources & Traceability</span>
                <div className="flex flex-wrap gap-2">
                  {reasoningResult.sources.map((src: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                      ✓ {src}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {reasoningResult.timeline && reasoningResult.timeline.length > 0 && (
              <div className="mb-4 border-t border-white/10 pt-3">
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-2 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Event Timeline Sequence
                </span>
                <div className="space-y-1.5 font-mono text-xs">
                  {reasoningResult.timeline.map((t: any, idx: number) => (
                    <div key={idx} className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <span className="text-amber-400 font-bold">{t.date}</span>
                      <span className="text-white/80">{t.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Past Events */}
            {reasoningResult.similarPastEvents && reasoningResult.similarPastEvents.length > 0 && (
              <div className="border-t border-white/10 pt-3">
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-2 flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-purple-400" /> Similar Historical Events
                </span>
                <div className="space-y-1.5 font-mono text-xs">
                  {reasoningResult.similarPastEvents.map((ev: any, idx: number) => (
                    <div key={idx} className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <strong className="text-purple-300 block">{ev.event}</strong>
                      <span className="text-white/60 text-[10px]">{ev.relevance}</span>
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
