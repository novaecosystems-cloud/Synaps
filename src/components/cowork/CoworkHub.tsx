'use client';

import React, { useState } from 'react';
import {
  Users,
  Plug,
  Layers,
  Sparkles,
  Copy,
  Check,
  Play,
  Terminal,
  ShieldCheck,
  Activity,
  Globe,
  Radio,
  FileCode,
  FolderLock,
  Plus,
  Send,
  MessageSquare,
  Bot,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRESET_SKILLS } from '@/lib/book-to-skill';

export default function CoworkHub() {
  const [activeTab, setActiveTab] = useState<'cowork' | 'mcp' | 'den'>('cowork');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Live MCP Tool Test Runner
  const [selectedTool, setSelectedTool] = useState('query_boardroom_verdict');
  const [testInput, setTestInput] = useState('Should we approve the $120M acquisition with a $15M indemnity cap?');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testingTool, setTestingTool] = useState(false);

  // Cowork Chat Simulation
  const [coworkMessages, setCoworkMessages] = useState([
    {
      id: 'msg_1',
      sender: 'Sarah Chen (COO)',
      avatar: 'SC',
      color: 'bg-blue-500',
      time: '11:20 AM',
      text: 'Team, please review the revised indemnification schedule in Section 8.2. Chief of Staff flagged a $15M cap.',
    },
    {
      id: 'msg_2',
      sender: 'Victoria Hayes (General Counsel AI)',
      avatar: 'GC',
      color: 'bg-amber-500',
      time: '11:22 AM',
      text: 'Reviewed against /mna-cross-border-playbook. 12.5% cap ($15M) and 18-month warranty survival are within authorized parameters. Support approval.',
      isAi: true,
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const mcpBaseUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/mcp` : 'https://synaps-one.vercel.app/api/mcp';

  const copyConfig = (type: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const claudeConfig = JSON.stringify(
    {
      mcpServers: {
        synaps: {
          url: mcpBaseUrl,
          transport: 'http',
          headers: {
            Authorization: 'Bearer synaps_live_YOUR_API_KEY_FROM_SETTINGS',
          },
        },
      },
    },
    null,
    2
  );

  const cursorConfig = JSON.stringify(
    {
      mcp: {
        synaps: {
          type: 'remote',
          enabled: true,
          url: mcpBaseUrl,
        },
      },
    },
    null,
    2
  );

  const antigravityConfig = JSON.stringify(
    {
      'antigravity.mcpServers': {
        synaps: {
          endpoint: mcpBaseUrl,
          capabilities: ['search_synaps_memory', 'query_boardroom_verdict', 'execute_playbook_skill'],
        },
      },
    },
    null,
    2
  );

  const handleRunMcpTool = async () => {
    setTestingTool(true);
    setTestResult(null);

    try {
      let params: any = {};
      if (selectedTool === 'search_synaps_memory') {
        params = { query: testInput };
      } else if (selectedTool === 'query_boardroom_verdict') {
        params = { question: testInput };
      } else if (selectedTool === 'execute_playbook_skill') {
        params = { skillName: 'mna-cross-border-playbook', query: testInput };
      } else {
        params = { detailed: true };
      }

      const res = await fetch('/api/mcp', {
        method: 'POST',
        credentials: 'include', // use the active Synaps session cookie
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'test_call_1',
          method: 'tools/call',
          params: {
            name: selectedTool,
            arguments: params,
          },
        }),
      });

      const data = await res.json();
      setTestResult(data.result?.content?.[0]?.text || JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestResult(`Execution error: ${err.message}`);
    } finally {
      setTestingTool(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: `msg_${Date.now()}`,
      sender: 'You (Executive Member)',
      avatar: 'ME',
      color: 'bg-indigo-600',
      time: 'Just now',
      text: newMessage,
    };
    setCoworkMessages([...coworkMessages, msg]);
    setNewMessage('');

    // Simulate AI Agent Boardroom response
    setTimeout(() => {
      setCoworkMessages((prev) => [
        ...prev,
        {
          id: `msg_${Date.now() + 1}`,
          sender: 'Dr. Aris Thorne (CTO AI)',
          avatar: 'CTO',
          color: 'bg-cyan-500',
          time: 'Just now',
          text: 'Evaluated against Google Cloud Well-Architected Framework: zero copyleft GPL risks found, multi-region database failover verified.',
          isAi: true,
        },
      ]);
    }, 1200);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 text-base-content font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Users className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-base-content">Synaps Cowork & Universal MCP Bridge</h1>
              <span className="badge badge-primary badge-sm font-mono text-[10px] font-bold">OpenWork Architecture</span>
            </div>
            <p className="text-xs text-base-content/60 mt-1">
              Real-time multi-user collaborative matter workspaces, organization skill registry, and universal MCP bridge for Claude Desktop, Cursor & Antigravity.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-base-200 p-1 rounded-2xl border border-base-300">
          <button
            onClick={() => setActiveTab('cowork')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'cowork' ? 'bg-indigo-600 text-white' : 'text-base-content/70 hover:bg-base-300'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Cowork Matter Room
          </button>
          <button
            onClick={() => setActiveTab('mcp')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'mcp' ? 'bg-indigo-600 text-white' : 'text-base-content/70 hover:bg-base-300'
            }`}
          >
            <Plug className="w-3.5 h-3.5" /> Remote MCP Bridge
          </button>
          <button
            onClick={() => setActiveTab('den')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'den' ? 'bg-indigo-600 text-white' : 'text-base-content/70 hover:bg-base-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Org Skills Den ({PRESET_SKILLS.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Cowork Matter Room */}
      {activeTab === 'cowork' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Matter Rooms Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-5 bg-base-100 border border-base-300 rounded-3xl space-y-3 shadow-sm">
              <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
                <FolderLock className="w-4 h-4 text-indigo-400" /> Active Cowork Matters
              </h3>

              <div className="space-y-2">
                {[
                  {
                    title: 'Project Titan M&A Deal Room ($120M)',
                    activeUsers: ['Eleanor (CEO)', 'Marcus (CFO)', 'Victoria (Legal)'],
                    status: 'IN REVIEW',
                    active: true,
                  },
                  {
                    title: 'DPDP Act 2023 Enterprise Audit',
                    activeUsers: ['Elena (Compliance)', 'David (HR)'],
                    status: 'AUDITING',
                    active: false,
                  },
                  {
                    title: 'Q3 Enterprise Cloud Migration',
                    activeUsers: ['Dr. Aris (CTO)', 'Kevin (Ops)'],
                    status: 'PLANNED',
                    active: false,
                  },
                ].map((room, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      room.active
                        ? 'bg-indigo-500/10 border-indigo-500/40 shadow-sm ring-1 ring-indigo-500/30'
                        : 'bg-base-200/50 border-base-300/60 hover:bg-base-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-base-content truncate">{room.title}</span>
                      <span className="badge badge-success badge-xs font-bold text-[9px]">{room.status}</span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[11px] text-base-content/60 font-medium">
                        {room.activeUsers.join(', ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shared Real-Time Cowork Stream */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm flex flex-col h-[560px]">
              <div className="flex justify-between items-center pb-3 border-b border-base-300/40">
                <div>
                  <h3 className="font-bold text-sm text-base-content">Project Titan M&A Deal Room</h3>
                  <p className="text-xs text-base-content/60">3 Team Members + 10 Boardroom AI Agents Active</p>
                </div>
                <span className="badge badge-outline badge-sm text-[10px] font-bold text-emerald-400">
                  Live Synced
                </span>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {coworkMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl border space-y-1.5 ${
                      msg.isAi
                        ? 'bg-indigo-950/20 border-indigo-500/30'
                        : 'bg-base-200/60 border-base-300/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center ${msg.color}`}
                        >
                          {msg.avatar}
                        </span>
                        <span className="font-bold text-xs text-base-content">{msg.sender}</span>
                        {msg.isAi && (
                          <span className="badge badge-primary badge-xs text-[9px] font-bold">AI AGENT</span>
                        )}
                      </div>
                      <span className="text-[10px] text-base-content/40 font-mono">{msg.time}</span>
                    </div>
                    <p className="text-xs text-base-content/85 leading-relaxed pl-8">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Input Bar */}
              <div className="flex gap-2 pt-2 border-t border-base-300/40">
                <input
                  type="text"
                  placeholder="Share a thought or ask the AI agents in this matter..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="input input-sm input-bordered flex-1 rounded-xl text-xs"
                />
                <Button
                  onClick={handleSendMessage}
                  className="btn-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Universal Remote MCP Bridge */}
      {activeTab === 'mcp' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1-Click Connectors */}
          <div className="space-y-4">
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-indigo-400" /> Connect External AI Clients (1-Click Configs)
                </h3>
                <span className="badge badge-success badge-sm font-mono font-bold text-[10px]">JSON-RPC 2.0</span>
              </div>

              <div className="p-3 bg-base-200 rounded-2xl flex items-center justify-between text-xs font-mono">
                <span className="truncate">{mcpBaseUrl}</span>
                <span className="badge badge-outline badge-xs text-emerald-400 font-bold">200 OK</span>
              </div>

              {/* Claude Desktop Config */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-base-content">1. Claude Desktop (`claude_desktop_config.json`)</span>
                  <button
                    onClick={() => copyConfig('claude', claudeConfig)}
                    className="btn btn-ghost btn-xs gap-1 text-[11px]"
                  >
                    {copiedType === 'claude' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedType === 'claude' ? 'Copied' : 'Copy JSON'}
                  </button>
                </div>
                <pre className="p-3 bg-base-200 rounded-xl text-[11px] font-mono overflow-x-auto text-base-content/80">
                  {claudeConfig}
                </pre>
              </div>

              {/* Cursor Config */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-base-content">2. Cursor IDE (`.cursor/mcp.json`)</span>
                  <button
                    onClick={() => copyConfig('cursor', cursorConfig)}
                    className="btn btn-ghost btn-xs gap-1 text-[11px]"
                  >
                    {copiedType === 'cursor' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedType === 'cursor' ? 'Copied' : 'Copy JSON'}
                  </button>
                </div>
                <pre className="p-3 bg-base-200 rounded-xl text-[11px] font-mono overflow-x-auto text-base-content/80">
                  {cursorConfig}
                </pre>
              </div>

              {/* Google Antigravity & VS Code */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-base-content">3. Google Antigravity & VS Code (`settings.json`)</span>
                  <button
                    onClick={() => copyConfig('antigravity', antigravityConfig)}
                    className="btn btn-ghost btn-xs gap-1 text-[11px]"
                  >
                    {copiedType === 'antigravity' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedType === 'antigravity' ? 'Copied' : 'Copy JSON'}
                  </button>
                </div>
                <pre className="p-3 bg-base-200 rounded-xl text-[11px] font-mono overflow-x-auto text-base-content/80">
                  {antigravityConfig}
                </pre>
              </div>
            </div>
          </div>

          {/* Interactive MCP Tool Test Console */}
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-base-100 to-indigo-950/20 border border-base-300 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" /> Live MCP Tool Test Console
                </h3>
                <span className="text-[10px] text-base-content/60 font-mono">POST /api/mcp</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-base-content/60 uppercase">Select MCP Tool:</label>
                  <select
                    value={selectedTool}
                    onChange={(e) => setSelectedTool(e.target.value)}
                    className="select select-sm select-bordered w-full rounded-xl text-xs font-bold mt-1"
                  >
                    <option value="query_boardroom_verdict">query_boardroom_verdict (10-Agent Deliberation)</option>
                    <option value="search_synaps_memory">search_synaps_memory (Corporate Knowledge Search)</option>
                    <option value="execute_playbook_skill">execute_playbook_skill (Run M&A / DPDP Skills)</option>
                    <option value="get_compliance_scorecard">get_compliance_scorecard (DPDP Statutory Audit)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-base-content/60 uppercase">Test Query Parameter:</label>
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    className="input input-sm input-bordered w-full rounded-xl text-xs mt-1"
                  />
                </div>

                <Button
                  onClick={handleRunMcpTool}
                  disabled={testingTool}
                  className="w-full rounded-2xl gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                >
                  <Play className={testingTool ? 'w-3.5 h-3.5 animate-spin' : 'w-3.5 h-3.5'} />
                  {testingTool ? 'Executing JSON-RPC 2.0 Tool...' : 'Execute Tool via MCP'}
                </Button>
              </div>

              {testResult && (
                <div className="p-4 bg-base-200/90 border border-base-300 rounded-2xl text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-[260px] overflow-y-auto animate-fadeIn">
                  {testResult}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Org Skills Den */}
      {activeTab === 'den' && (
        <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-base-content">Organization Skills & Playbook Den</h3>
              <p className="text-xs text-base-content/60">
                Shared skills and distilled rulebooks accessible to all team members and external MCP clients.
              </p>
            </div>
            <span className="badge badge-primary badge-sm font-mono font-bold text-[10px]">
              {PRESET_SKILLS.length} Published Skills
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRESET_SKILLS.map((skill) => (
              <div key={skill.id} className="p-5 bg-base-200/60 border border-base-300 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-base-content">{skill.displayName}</span>
                  <span className="badge badge-outline badge-xs font-bold text-[9px]">{skill.category}</span>
                </div>
                <p className="text-xs text-base-content/70 leading-relaxed">{skill.description}</p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-base-300/40">
                  <span className="font-mono text-indigo-400 font-bold">/{skill.name}</span>
                  <span className="badge badge-success badge-xs font-bold text-[9px]">MCP READY</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
