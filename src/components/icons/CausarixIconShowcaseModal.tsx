'use client';

import React, { useState } from 'react';
import {
  CausarixFeatureIconMap,
  CausarixFeatureIcon,
  FeatureIconKey,
} from './CausarixFeatureIcons';
import { Sparkles, Search, Copy, Check, X, Eye } from 'lucide-react';

interface IconMetadata {
  key: FeatureIconKey;
  name: string;
  category: 'Command' | 'AI & Boardroom' | 'Risk & Causal' | 'Operations' | 'Security & OS';
  description: string;
  badge?: 'PRO' | 'MAX' | 'CORE';
}

const ICONS_METADATA: IconMetadata[] = [
  { key: 'overview', name: 'Executive Overview', category: 'Command', description: 'Institutional cockpit & cross-departmental KPIs', badge: 'CORE' },
  { key: 'matters', name: 'Strategic Matters', category: 'Command', description: 'Legal briefs, litigations & board dockets', badge: 'PRO' },
  { key: 'chat', name: 'AI Chat & Web Search', category: 'Command', description: 'Global web intelligence & multi-turn deliberation', badge: 'CORE' },
  { key: 'mission-control', name: 'Mission Control', category: 'Command', description: 'Telemetry, radar & real-time agent dispatch', badge: 'CORE' },
  { key: 'chief-of-staff', name: 'Chief of Staff', category: 'Command', description: 'Executive filter, agenda manager & prioritization', badge: 'PRO' },

  { key: 'boardroom', name: '10-Agent Boardroom', category: 'AI & Boardroom', description: 'Adversarial executive twin quorum & Delaware § 141 seal', badge: 'PRO' },
  { key: 'agi-studio', name: 'AGI Executive Studio', category: 'AI & Boardroom', description: 'MCTS Tree-of-Thought with insolvency pruning', badge: 'PRO' },
  { key: 'digital-twin', name: 'Digital Twin OS', category: 'AI & Boardroom', description: 'Custom executive personas & calibrated decision profiles', badge: 'MAX' },
  { key: 'strategy', name: 'Strategy Studio', category: 'AI & Boardroom', description: 'Competitive positioning & 36 Chinese Stratagems', badge: 'PRO' },
  { key: 'charts', name: 'Chart Studio (ARLM)', category: 'AI & Boardroom', description: 'Dynamic financial charts & pro-forma EBITDA curves', badge: 'PRO' },
  { key: 'notebooks', name: 'Matter Notebooks', category: 'AI & Boardroom', description: 'Multi-modal audio scribe & synchronized meeting transcripts', badge: 'PRO' },
  { key: 'skills', name: 'Playbook to Skill (24x)', category: 'AI & Boardroom', description: 'Turn SOPs into autonomous 24x RAG skill adapters', badge: 'PRO' },
  { key: 'cowork', name: 'Cowork & MCP Den', category: 'AI & Boardroom', description: 'Live human-AI collaboration & MCP server tools', badge: 'PRO' },
  { key: 'assistant', name: 'Enterprise Assistant', category: 'AI & Boardroom', description: 'Executive copilot for rapid summaries & document drafting', badge: 'CORE' },
  { key: 'workspace', name: 'AI Workflows', category: 'AI & Boardroom', description: 'Automated DAG execution pipelines & triggers', badge: 'CORE' },
  { key: 'computer', name: 'Agent Computer', category: 'AI & Boardroom', description: 'Air-gapped code sandbox & Pyodide runtime', badge: 'PRO' },

  { key: 'risk-center', name: 'Risk Center', category: 'Risk & Causal', description: 'Exposure heatmaps, liability caps & penalty ratchets', badge: 'MAX' },
  { key: 'decisions', name: 'Decision Memory', category: 'Risk & Causal', description: 'Institutional precedent memory & DPO learning flywheel', badge: 'CORE' },
  { key: 'simulations', name: 'SCM Simulation Engine', category: 'Risk & Causal', description: 'Pearl do-calculus & 0.00% math drift Box-Muller kernel', badge: 'MAX' },
  { key: 'graph', name: '3D Memory Palace', category: 'Risk & Causal', description: 'Interactive WebGL knowledge graph of corporate entities', badge: 'PRO' },

  { key: 'projects', name: 'Projects & Tasks', category: 'Operations', description: 'Native Jira-grade Kanban board with Slack sync mesh', badge: 'CORE' },
  { key: 'requirements', name: 'Requirements Matrix', category: 'Operations', description: 'Hierarchical trace matrix & acceptance gates', badge: 'CORE' },
  { key: 'meetings', name: 'Executive Meetings', category: 'Operations', description: 'Vexa bot integration with instant remote data wipe', badge: 'CORE' },
  { key: 'timeline', name: 'Org Timeline', category: 'Operations', description: 'Chronological track of board milestones & resolutions', badge: 'CORE' },
  { key: 'documents', name: 'Document Library', category: 'Operations', description: 'Evidentiary coordinate-level PDF ingestion & OCR', badge: 'CORE' },
  { key: 'exports', name: 'Export History', category: 'Operations', description: 'Cryptographic PDF, CSV, and DGCL safe-harbor records', badge: 'CORE' },
  { key: 'analytics', name: 'Analytics & BI', category: 'Operations', description: 'Real-time telemetry, model latency & token usage', badge: 'PRO' },

  { key: 'billing', name: 'Plans & Treasury', category: 'Security & OS', description: 'Sovereign billing, credit ledger & multi-tier access', badge: 'CORE' },
  { key: 'audit', name: 'DGCL § 141 Merkle Proofs', category: 'Security & OS', description: 'Courtroom-admissible SHA-256 Merkle root verification', badge: 'PRO' },
  { key: 'firewall', name: 'AI Application Firewall', category: 'Security & OS', description: 'Secret key, PII redactor & anti-prompt-injection shields', badge: 'MAX' },
  { key: 'desktop', name: 'Air-Gapped Desktop OS', category: 'Security & OS', description: 'Zero-cloud egress standalone desktop execution (Causarix.exe)', badge: 'MAX' },
  { key: 'triad', name: 'Triad LoRA Models', category: 'Security & OS', description: 'Legal, Finance & Causal domain-specialized weights', badge: 'MAX' },
];

export const CausarixIconShowcaseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Command', 'AI & Boardroom', 'Risk & Causal', 'Operations', 'Security & OS'];

  const filtered = ICONS_METADATA.filter((icon) => {
    const matchesCat = activeCategory === 'All' || icon.category === activeCategory;
    const matchesSearch =
      icon.name.toLowerCase().includes(search.toLowerCase()) ||
      icon.description.toLowerCase().includes(search.toLowerCase()) ||
      icon.key.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(`<CausarixFeatureIcon name="${key}" size={24} />`);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-700/60 bg-[#0B0F19] text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                CAUSARIX™ Feature Icon System
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  Koboyo-Inspired • High-Contrast Vectors
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Hand-crafted organic vectors enhanced with multi-layer neon & fiduciary accent palettes for maximum visibility.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/40">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search 32+ feature icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Icon Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => {
            const isCopied = copiedKey === item.key;
            return (
              <div
                key={item.key}
                onClick={() => handleCopy(item.key)}
                className="group relative flex flex-col justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-700 transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 group-hover:scale-110 group-hover:border-slate-600 transition-transform duration-200 shadow-inner">
                    <CausarixFeatureIcon name={item.key} size={28} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          item.badge === 'MAX'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : item.badge === 'PRO'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-700/50 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                  <code className="text-indigo-400 font-mono font-medium">{item.key}</code>
                  <span className="flex items-center gap-1 group-hover:text-slate-200">
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filtered.length} of {ICONS_METADATA.length} active feature icons</span>
          <span>Click any card to copy React component import snippet</span>
        </div>
      </div>
    </div>
  );
};
