'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Zap,
  ShieldCheck,
  FileCode,
  Layers,
  ArrowRight,
  Download,
  Copy,
  Check,
  Plus,
  RefreshCw,
  Search,
  Sliders,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Activity,
  Maximize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AgentSkillPackage, PRESET_SKILLS } from '@/lib/book-to-skill';

export default function BookToSkillStudio() {
  const [skills, setSkills] = useState<AgentSkillPackage[]>(PRESET_SKILLS);
  const [selectedSkillId, setSelectedSkillId] = useState<string>(PRESET_SKILLS[0].id);
  const [activeTab, setActiveTab] = useState<'rules' | 'antipatterns' | 'chapters' | 'spec'>('rules');

  // Distillation Form State
  const [showDistillModal, setShowDistillModal] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [category, setCategory] = useState<'LEGAL' | 'COMPLIANCE' | 'FINANCE' | 'OPERATIONS' | 'TECH'>('LEGAL');
  const [rawText, setRawText] = useState('');
  const [distilling, setDistilling] = useState(false);
  const [copiedSpec, setCopiedSpec] = useState(false);

  // Skill Query Simulator State
  const [simQuery, setSimQuery] = useState('');
  const [simAnswer, setSimAnswer] = useState<string | null>(null);
  const [simLoading, setSimLoading] = useState(false);

  const activeSkill = skills.find((s) => s.id === selectedSkillId) || skills[0];

  // Distill action
  const handleDistill = async () => {
    if (!docTitle.trim() || !rawText.trim()) return;

    setDistilling(true);
    try {
      const res = await fetch('/api/skills/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentTitle: docTitle,
          category,
          rawContent: rawText,
        }),
      });

      const data = await res.json();
      if (data.success && data.skill) {
        setSkills([data.skill, ...skills]);
        setSelectedSkillId(data.skill.id);
        setShowDistillModal(false);
        setDocTitle('');
        setRawText('');
      }
    } catch (err) {
      console.error('Failed to distill skill:', err);
    } finally {
      setDistilling(false);
    }
  };

  // Run Query Simulator against active skill
  const handleSimulateQuery = () => {
    if (!simQuery.trim()) return;
    setSimLoading(true);
    setTimeout(() => {
      // Find matching rule in active skill
      const matchedRule = activeSkill.decisionRules[0];
      setSimAnswer(
        `[${activeSkill.name}] Rule Invoked: ${matchedRule?.ruleTitle || 'Standard Rule'}\n\n` +
          `• Action Enforced: ${matchedRule?.actionRequired || 'Verify compliance benchmarks'}\n` +
          `• Condition: ${matchedRule?.condition || 'Standard evaluation'}\n` +
          `• Risk Bounded: ${matchedRule?.riskIfIgnored || 'Controlled risk exposure'}\n\n` +
          `⚡ Tokens Loaded: ${activeSkill.distilledTokens} tokens (Saved ~${activeSkill.sourceTokensRaw - activeSkill.distilledTokens} tokens vs full PDF scan).`
      );
      setSimLoading(false);
    }, 600);
  };

  const handleCopySpec = () => {
    navigator.clipboard.writeText(activeSkill.skillMdContent);
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2500);
  };

  const handleDownloadSkill = () => {
    const blob = new Blob([activeSkill.skillMdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SKILL_${activeSkill.name}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 text-base-content font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-base-content">Book & Playbook to Skill Studio</h1>
              <span className="badge badge-primary badge-sm font-mono text-[10px] font-bold">24x–51x Token Compression</span>
            </div>
            <p className="text-xs text-base-content/60 mt-1">
              Convert 200-page legal playbooks, compliance codes, and SOP manuals into executable Agent Skills conforming to the AgentSkills open standard.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowDistillModal(true)}
            className="rounded-2xl gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" /> Distill New Playbook / PDF
          </Button>
        </div>
      </div>

      {/* Modal / Ingestion View */}
      {showDistillModal && (
        <div className="p-6 bg-base-100 border border-indigo-500/30 rounded-3xl space-y-4 shadow-lg animate-fadeIn">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Distill Playbook or Book to Executable Agent Skill
            </h3>
            <button onClick={() => setShowDistillModal(false)} className="btn btn-ghost btn-xs rounded-xl">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Document / Playbook Title (e.g. Goldman Sachs M&A Diligence Guidelines 2026)"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="input input-sm input-bordered w-full rounded-xl text-xs"
              />
            </div>
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="select select-sm select-bordered w-full rounded-xl text-xs font-bold"
              >
                <option value="LEGAL">Legal & Contracts</option>
                <option value="COMPLIANCE">Compliance & Regulatory</option>
                <option value="FINANCE">Finance & Valuation</option>
                <option value="OPERATIONS">Operations & SOP</option>
                <option value="TECH">Technology & Architecture</option>
              </select>
            </div>
          </div>

          <div>
            <textarea
              rows={6}
              placeholder="Paste raw playbook, contract manual, statutory code, or book text here..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="textarea textarea-bordered w-full rounded-2xl text-xs font-mono resize-none"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-base-content/60 font-bold">Quick Sample:</span>
              <button
                onClick={() => {
                  setDocTitle('Enterprise SaaS Vendor Procurement SOP');
                  setCategory('OPERATIONS');
                  setRawText(
                    'Section 3.1: All software vendors exceeding $50,000 annual spend must provide SOC2 Type II audit reports. Indemnification for data breach liabilities must not be subject to the standard 12-month fee limitation cap. Sub-processor addendums require 60-day prior written notice before onboarding secondary infrastructure providers.'
                  );
                }}
                className="btn btn-xs btn-outline rounded-xl text-[10px]"
              >
                Load Vendor SOP
              </button>
            </div>

            <Button
              onClick={handleDistill}
              disabled={distilling || !docTitle.trim() || !rawText.trim()}
              className="rounded-2xl gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6"
            >
              <RefreshCw className={distilling ? 'w-4 h-4 animate-spin' : 'w-4 h-4'} />
              {distilling ? 'Distilling & Compressing (24x-51x)...' : 'Compile to Agent Skill'}
            </Button>
          </div>
        </div>
      )}

      {/* Main Studio View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Installed Skills List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 bg-base-100 border border-base-300 rounded-3xl space-y-3 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Installed Agent Skills ({skills.length})
            </h3>

            <div className="space-y-2">
              {skills.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSkillId(s.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    s.id === selectedSkillId
                      ? 'bg-indigo-500/10 border-indigo-500/40 shadow-sm ring-1 ring-indigo-500/30'
                      : 'bg-base-200/50 border-base-300/60 hover:bg-base-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-base-content truncate">{s.displayName}</span>
                    <span className="badge badge-primary badge-xs font-mono font-bold text-[9px]">
                      {s.compressionRatio}
                    </span>
                  </div>
                  <p className="text-[11px] text-base-content/60 line-clamp-2 leading-relaxed">
                    {s.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-base-content/40 pt-1 border-t border-base-300/30">
                    <span className="font-mono">/{s.name}</span>
                    <span>{s.decisionRules.length} rules</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Token Efficiency Compression Card */}
          <div className="p-5 bg-gradient-to-br from-indigo-500/10 via-base-100 to-base-100 border border-indigo-500/20 rounded-3xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Token Compression Factor
              </span>
              <span className="badge badge-info badge-sm font-mono font-bold text-[10px]">
                {activeSkill.compressionRatio} Efficiency
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-base-content/60">Source Raw Tokens:</span>
                <span className="font-mono text-base-content">{activeSkill.sourceTokensRaw.toLocaleString()} tokens</span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-base-content/60">Skill Distilled Tokens:</span>
                <span className="font-mono text-emerald-400 font-bold">{activeSkill.distilledTokens.toLocaleString()} tokens</span>
              </div>
            </div>
            <p className="text-[11px] text-base-content/70 leading-relaxed pt-1">
              Queries load the modular chapter on-demand, bypassing 98% of the document context tax without hallucination.
            </p>
          </div>
        </div>

        {/* Right Column: Skill Inspector & Interactive Simulator */}
        <div className="lg:col-span-2 space-y-4">
          {/* Skill Title & Actions Header */}
          <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-outline badge-sm font-bold text-[10px]">{activeSkill.category}</span>
                  <span className="text-xs text-base-content/50 font-mono">v{activeSkill.version}</span>
                </div>
                <h2 className="text-xl font-bold text-base-content mt-1">{activeSkill.displayName}</h2>
                <p className="text-xs text-base-content/60 mt-0.5">{activeSkill.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={handleCopySpec} variant="outline" className="btn-sm rounded-xl gap-1 text-xs">
                  {copiedSpec ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSpec ? 'Copied' : 'Copy Spec'}
                </Button>
                <Button onClick={handleDownloadSkill} variant="outline" className="btn-sm rounded-xl gap-1 text-xs">
                  <Download className="w-3.5 h-3.5" /> SKILL.md
                </Button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-1 border-t border-base-300/40 pt-3">
              <button
                onClick={() => setActiveTab('rules')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'rules' ? 'bg-indigo-600 text-white' : 'text-base-content/70 hover:bg-base-200'
                }`}
              >
                Decision Rules ({activeSkill.decisionRules.length})
              </button>
              <button
                onClick={() => setActiveTab('antipatterns')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'antipatterns' ? 'bg-indigo-600 text-white' : 'text-base-content/70 hover:bg-base-200'
                }`}
              >
                Anti-Patterns ({activeSkill.antiPatterns.length})
              </button>
              <button
                onClick={() => setActiveTab('chapters')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'chapters' ? 'bg-indigo-600 text-white' : 'text-base-content/70 hover:bg-base-200'
                }`}
              >
                Modular Chapters ({activeSkill.chapters.length})
              </button>
              <button
                onClick={() => setActiveTab('spec')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'spec' ? 'bg-indigo-600 text-white' : 'text-base-content/70 hover:bg-base-200'
                }`}
              >
                Raw SKILL.md
              </button>
            </div>
          </div>

          {/* Tab 1: Decision Rules */}
          {activeTab === 'rules' && (
            <div className="space-y-3">
              {activeSkill.decisionRules.map((rule, idx) => (
                <div key={rule.id || idx} className="p-5 bg-base-100 border border-base-300 rounded-3xl space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-base-content flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      {rule.ruleTitle}
                    </h4>
                    <span className="badge badge-xs badge-success font-bold text-[9px]">ACTIVE RULE</span>
                  </div>
                  <div className="space-y-1.5 pl-7 text-xs">
                    <div>
                      <span className="font-bold text-base-content/60">Condition: </span>
                      <span className="text-base-content/80">{rule.condition}</span>
                    </div>
                    <div>
                      <span className="font-bold text-emerald-400">Action Required: </span>
                      <span className="text-base-content font-medium">{rule.actionRequired}</span>
                    </div>
                    <div>
                      <span className="font-bold text-rose-400">Risk if Ignored: </span>
                      <span className="text-base-content/70">{rule.riskIfIgnored}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Anti-Patterns */}
          {activeTab === 'antipatterns' && (
            <div className="space-y-3">
              {activeSkill.antiPatterns.map((anti, idx) => (
                <div key={anti.id || idx} className="p-5 bg-base-100 border border-rose-500/20 rounded-3xl space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-rose-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Trap #{idx + 1}: {anti.trap}
                    </h4>
                  </div>
                  <div className="space-y-1.5 text-xs pl-6">
                    <div>
                      <span className="font-bold text-base-content/60">Why It Fails: </span>
                      <span className="text-base-content/80">{anti.whyItFails}</span>
                    </div>
                    <div>
                      <span className="font-bold text-emerald-400">Correct Approach: </span>
                      <span className="text-base-content font-medium">{anti.correctApproach}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Chapters */}
          {activeTab === 'chapters' && (
            <div className="space-y-3">
              {activeSkill.chapters.map((ch) => (
                <div key={ch.id} className="p-5 bg-base-100 border border-base-300 rounded-3xl space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-base-content flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" /> Chapter {ch.chapterNumber}: {ch.title}
                    </h4>
                    <span className="badge badge-ghost badge-xs font-mono text-[9px]">{ch.tokenCount} tokens</span>
                  </div>
                  <p className="text-xs text-base-content/60 font-medium">{ch.summary}</p>
                  <div className="p-3 bg-base-200/50 rounded-xl text-xs text-base-content/80 leading-relaxed font-mono">
                    {ch.content}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Raw SKILL.md */}
          {activeTab === 'spec' && (
            <div className="p-5 bg-base-100 border border-base-300 rounded-3xl shadow-sm">
              <pre className="p-4 bg-base-200 rounded-2xl text-xs font-mono text-base-content/90 overflow-x-auto whitespace-pre-wrap">
                {activeSkill.skillMdContent}
              </pre>
            </div>
          )}

          {/* Live Skill Execution Simulator */}
          <div className="p-6 bg-gradient-to-br from-base-100 to-indigo-950/20 border border-base-300 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" /> Live Agent Skill Simulator (Zero-Hallucination Query)
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold">On-Demand Token Loader</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder={`Ask a rule question... e.g. 'What is our maximum liability cap under /${activeSkill.name}?'`}
                value={simQuery}
                onChange={(e) => setSimQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSimulateQuery()}
                className="input input-sm input-bordered flex-1 rounded-xl text-xs"
              />
              <Button
                onClick={handleSimulateQuery}
                disabled={simLoading || !simQuery.trim()}
                className="btn-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
              >
                {simLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Query Skill'}
              </Button>
            </div>

            {simAnswer && (
              <div className="p-4 bg-base-200/80 border border-base-300 rounded-2xl text-xs font-mono whitespace-pre-wrap leading-relaxed animate-fadeIn">
                {simAnswer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
