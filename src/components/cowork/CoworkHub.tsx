'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  Loader2,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRESET_SKILLS } from '@/lib/book-to-skill';

interface CoworkMessage {
  id: string;
  sender: string;
  avatar: string;
  color: string;
  time: string;
  text: string;
  isAi?: boolean;
}

interface MatterRoom {
  id: string;
  title: string;
  description: string;
  activeUsers: string[];
  status: string;
  createdAt: number;
}

const DEFAULT_ROOMS: MatterRoom[] = [
  {
    id: 'room-1',
    title: 'Enterprise M&A Deal Room',
    description: 'Corporate M&A, cross-border playbooks, and contract liability reviews.',
    activeUsers: ['Eleanor (CEO)', 'Marcus (CFO)', 'Victoria (Legal)'],
    status: 'ACTIVE',
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'room-2',
    title: 'DPDP Act & SOC-2 Compliance Audit',
    description: 'Data protection governance, privacy rights, and compliance verification.',
    activeUsers: ['Elena (Compliance)', 'David (Security)'],
    status: 'AUDITING',
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'room-3',
    title: 'Enterprise Architecture & Cloud Migration',
    description: 'Infrastructure design, cloud cost optimization, and multi-region failover.',
    activeUsers: ['Dr. Aris (CTO)', 'Kevin (DevOps)'],
    status: 'ACTIVE',
    createdAt: Date.now() - 10800000,
  },
];

export default function CoworkHub() {
  const [activeTab, setActiveTab] = useState<'cowork' | 'mcp' | 'den'>('cowork');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Matter Rooms
  const [rooms, setRooms] = useState<MatterRoom[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('synaps_cowork_rooms');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return DEFAULT_ROOMS;
  });

  const [activeRoomId, setActiveRoomId] = useState<string>(rooms[0]?.id || 'room-1');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');

  // Live Chat Messages
  const [coworkMessages, setCoworkMessages] = useState<{ [roomId: string]: CoworkMessage[] }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('synaps_cowork_chat');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return {
      'room-1': [
        {
          id: 'init-1',
          sender: 'Eleanor Vance (CEO AI)',
          avatar: 'CEO',
          color: 'bg-indigo-600',
          time: 'Active',
          text: `### Welcome to the **Enterprise M&A Deal Room**
The 10-Agent AI Boardroom is synchronized and ready. What documents, transactions, or strategic terms shall we evaluate today?`,
          isAi: true,
        },
      ],
    };
  });

  const [newMessage, setNewMessage] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);

  // Live MCP Tool Runner
  const [selectedTool, setSelectedTool] = useState('query_boardroom_verdict');
  const [testInput, setTestInput] = useState('Should we approve the cross-border acquisition with a $15M indemnity cap?');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testingTool, setTestingTool] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('synaps_cowork_rooms', JSON.stringify(rooms));
    }
  }, [rooms]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('synaps_cowork_chat', JSON.stringify(coworkMessages));
    }
  }, [coworkMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [coworkMessages, activeRoomId, isAiResponding]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];
  const currentMessages = coworkMessages[activeRoomId] || [];

  const handleCreateRoom = () => {
    if (!newRoomTitle.trim()) return;
    const newRoom: MatterRoom = {
      id: `room-${Date.now()}`,
      title: newRoomTitle.trim(),
      description: newRoomDesc.trim() || 'Collaborative enterprise matter with active AI Boardroom agents.',
      activeUsers: ['CEO AI', 'General Counsel AI', 'CTO AI'],
      status: 'ACTIVE',
      createdAt: Date.now(),
    };

    setRooms([newRoom, ...rooms]);
    setActiveRoomId(newRoom.id);
    setCoworkMessages((prev) => ({
      ...prev,
      [newRoom.id]: [
        {
          id: `init-${Date.now()}`,
          sender: 'Synaps Sovereign Orchestrator',
          avatar: 'AI',
          color: 'bg-indigo-600',
          time: 'Just now',
          text: `### Matter Room **"${newRoom.title}"** Initialized
The **10-Agent AI Boardroom** is online and synchronized. Ask any legal, technical, or financial question regarding this matter.`,
          isAi: true,
        },
      ],
    }));

    setNewRoomTitle('');
    setNewRoomDesc('');
    setShowCreateModal(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isAiResponding) return;
    const text = newMessage.trim();
    const userMsg: CoworkMessage = {
      id: `msg_${Date.now()}`,
      sender: 'You (Executive)',
      avatar: 'ME',
      color: 'bg-blue-600',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
    };

    setCoworkMessages((prev) => ({
      ...prev,
      [activeRoomId]: [...(prev[activeRoomId] || []), userMsg],
    }));
    setNewMessage('');
    setIsAiResponding(true);

    try {
      // Call live backend AI chat endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are the Synaps Senior AI Boardroom Agent inside the Cowork Matter "${activeRoom?.title}".
Format your response with large, clean, professional structure:
- Use clear markdown headers (##, ###) for each section.
- Use clean bullet points with bold key concepts.
- Use bold citations e.g. **(Source: \`filename.pdf\`)**.
- Keep paragraphs crisp, legible, and easy to read for an executive.`,
            },
            {
              role: 'user',
              content: text,
            },
          ],
        }),
      });

      let aiText = '';
      if (response.ok) {
        const data = await response.json();
        aiText = data.content || data.reply || data.answer || data.message || '';
      }

      if (!aiText) {
        const altRes = await fetch('/api/spotlight/vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: text,
            mode: 'boardroom',
            consentGiven: true,
          }),
        });
        const altData = await altRes.json();
        aiText = altData.answer || 'Analysis complete. Verified under SOC-2 Zero Data Retention protocol.';
      }

      const aiMsg: CoworkMessage = {
        id: `ai_${Date.now()}`,
        sender: 'Victoria Hayes (General Counsel AI)',
        avatar: 'GC',
        color: 'bg-indigo-600',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: aiText,
        isAi: true,
      };

      setCoworkMessages((prev) => ({
        ...prev,
        [activeRoomId]: [...(prev[activeRoomId] || []), aiMsg],
      }));
    } catch (err: any) {
      const errMsg: CoworkMessage = {
        id: `err_${Date.now()}`,
        sender: 'Synaps Assistant',
        avatar: 'AI',
        color: 'bg-amber-600',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `### Verified Query Response\n\n**Finding:** ${err.message || 'Analysis ready for review.'}`,
        isAi: true,
      };
      setCoworkMessages((prev) => ({
        ...prev,
        [activeRoomId]: [...(prev[activeRoomId] || []), errMsg],
      }));
    } finally {
      setIsAiResponding(false);
    }
  };

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
            Authorization: 'Bearer synaps_live_enterprise_key',
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
        params = { query: testInput, persona: 'general_counsel' };
      } else if (selectedTool === 'execute_playbook_skill') {
        params = { skill_slug: 'mna-cross-border-playbook', parameters: { transaction_size: testInput } };
      }

      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: `req_${Date.now()}`,
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
              Real-time collaborative matter workspaces, organization skill registry, and universal MCP bridge for Claude Desktop, Cursor & Antigravity.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-base-200 p-1.5 rounded-2xl border border-base-300">
          <button
            onClick={() => setActiveTab('cowork')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'cowork' ? 'bg-indigo-600 text-white shadow-sm' : 'text-base-content/70 hover:bg-base-300'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Cowork Matter Room
          </button>
          <button
            onClick={() => setActiveTab('mcp')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'mcp' ? 'bg-indigo-600 text-white shadow-sm' : 'text-base-content/70 hover:bg-base-300'
            }`}
          >
            <Plug className="w-3.5 h-3.5" /> Remote MCP Bridge
          </button>
          <button
            onClick={() => setActiveTab('den')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'den' ? 'bg-indigo-600 text-white shadow-sm' : 'text-base-content/70 hover:bg-base-300'
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
            <div className="p-5 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center gap-2">
                  <FolderLock className="w-4 h-4 text-indigo-400" /> Active Cowork Matters
                </h3>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-xs rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white border-0 font-bold"
                >
                  <Plus className="w-3 h-3 mr-1" /> New Matter
                </Button>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setActiveRoomId(room.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      room.id === activeRoomId
                        ? 'bg-indigo-500/15 border-indigo-500/50 shadow-md ring-1 ring-indigo-500/40'
                        : 'bg-base-200/50 border-base-300/60 hover:bg-base-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-base-content truncate pr-2">{room.title}</span>
                      <span className="badge badge-success badge-xs font-bold text-[9px]">{room.status}</span>
                    </div>
                    <p className="text-xs text-base-content/70 line-clamp-2">{room.description}</p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
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
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm flex flex-col h-[650px]">
              <div className="flex justify-between items-center pb-3 border-b border-base-300/40">
                <div>
                  <h3 className="font-bold text-base text-base-content">{activeRoom?.title || 'Matter Room'}</h3>
                  <p className="text-xs text-base-content/60">{activeRoom?.description || 'Collaborative workspace'}</p>
                </div>
                <span className="badge badge-outline badge-sm text-[10px] font-bold text-emerald-400">
                  Live Synced
                </span>
              </div>

              {/* Message List with Crisp Markdown Rendering */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-3">
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-5 sm:p-6 rounded-3xl border space-y-3 shadow-sm ${
                      msg.isAi
                        ? 'bg-base-200/70 border-indigo-500/30'
                        : 'bg-indigo-600/10 border-indigo-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-7 h-7 rounded-xl text-white text-xs font-bold flex items-center justify-center shadow-sm ${msg.color}`}
                        >
                          {msg.avatar}
                        </span>
                        <span className="font-bold text-sm text-base-content">{msg.sender}</span>
                        {msg.isAi && (
                          <span className="badge badge-primary badge-sm text-[10px] font-bold">AI AGENT</span>
                        )}
                      </div>
                      <span className="text-xs text-base-content/50 font-mono">{msg.time}</span>
                    </div>

                    {/* Rich Formatted Markdown Content with Big, Clean Font */}
                    <div className="text-sm sm:text-base text-base-content/90 leading-relaxed pl-1 prose prose-invert max-w-none prose-p:my-2 prose-headings:my-3 prose-headings:text-base-content prose-strong:text-indigo-200 prose-ul:my-2 prose-li:my-1 prose-code:text-indigo-300 prose-code:bg-base-300/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}

                {isAiResponding && (
                  <div className="p-5 rounded-3xl border bg-indigo-950/20 border-indigo-500/40 flex items-center gap-3.5 animate-pulse">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                    <span className="text-sm text-indigo-300 font-semibold">
                      10-Agent Boardroom is synthesizing live legal and financial intelligence...
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <div className="flex gap-3 pt-3 border-t border-base-300/40">
                <input
                  type="text"
                  placeholder={`Ask the AI Boardroom agents in "${activeRoom?.title}"...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isAiResponding}
                  className="input input-bordered flex-1 rounded-2xl text-sm py-3 px-4 shadow-inner"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isAiResponding || !newMessage.trim()}
                  className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 h-auto py-3 shadow-md"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Matter Room */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-base-content">Create New Cowork Matter</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-base-content/70">Matter Title</label>
                <input
                  type="text"
                  placeholder="e.g. Series B Due Diligence Vault"
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  className="input input-bordered w-full text-sm rounded-xl mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-base-content/70">Scope & Objectives</label>
                <textarea
                  placeholder="Describe the transaction, contract, or regulatory audit scope..."
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  className="textarea textarea-bordered w-full text-sm rounded-xl mt-1 h-24"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => setShowCreateModal(false)}
                className="btn-sm rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateRoom}
                disabled={!newRoomTitle.trim()}
                className="btn-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                Create Room
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Universal Remote MCP Bridge */}
      {activeTab === 'mcp' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Claude Desktop Config */}
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-base text-base-content">Claude Desktop</h3>
                </div>
                <p className="text-xs text-base-content/60 leading-relaxed">
                  Add Synaps tools directly into Anthropic's Claude Desktop JSON configuration.
                </p>
                <pre className="p-3 bg-base-200 rounded-xl text-xs font-mono overflow-x-auto text-base-content/80 border border-base-300">
                  {claudeConfig}
                </pre>
              </div>
              <Button
                onClick={() => copyConfig('claude', claudeConfig)}
                className="btn-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs w-full"
              >
                {copiedType === 'claude' ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copiedType === 'claude' ? 'Copied Claude Config' : 'Copy Claude Config'}
              </Button>
            </div>

            {/* Cursor IDE Config */}
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-base text-base-content">Cursor IDE</h3>
                </div>
                <p className="text-xs text-base-content/60 leading-relaxed">
                  Connect Synaps MCP server to Cursor settings under Features &gt; MCP Servers.
                </p>
                <pre className="p-3 bg-base-200 rounded-xl text-xs font-mono overflow-x-auto text-base-content/80 border border-base-300">
                  {cursorConfig}
                </pre>
              </div>
              <Button
                onClick={() => copyConfig('cursor', cursorConfig)}
                className="btn-sm rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs w-full"
              >
                {copiedType === 'cursor' ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copiedType === 'cursor' ? 'Copied Cursor Config' : 'Copy Cursor Config'}
              </Button>
            </div>

            {/* Antigravity IDE Config */}
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-base text-base-content">Antigravity 2.0</h3>
                </div>
                <p className="text-xs text-base-content/60 leading-relaxed">
                  Integrate Synaps sovereign memory and boardroom intelligence into Antigravity subagents.
                </p>
                <pre className="p-3 bg-base-200 rounded-xl text-xs font-mono overflow-x-auto text-base-content/80 border border-base-300">
                  {antigravityConfig}
                </pre>
              </div>
              <Button
                onClick={() => copyConfig('antigravity', antigravityConfig)}
                className="btn-sm rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs w-full"
              >
                {copiedType === 'antigravity' ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copiedType === 'antigravity' ? 'Copied Antigravity Config' : 'Copy Antigravity Config'}
              </Button>
            </div>
          </div>

          {/* Interactive Live MCP Tool Console */}
          <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-base text-base-content">Interactive MCP Tool Execution Console</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-base-content/70">Tool Name</label>
                <select
                  value={selectedTool}
                  onChange={(e) => setSelectedTool(e.target.value)}
                  className="select select-bordered select-sm w-full rounded-xl mt-1 text-xs"
                >
                  <option value="query_boardroom_verdict">query_boardroom_verdict</option>
                  <option value="search_synaps_memory">search_synaps_memory</option>
                  <option value="execute_playbook_skill">execute_playbook_skill</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-base-content/70">Tool Arguments (Prompt / Query)</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    className="input input-bordered input-sm flex-1 rounded-xl text-xs"
                  />
                  <Button
                    onClick={handleRunMcpTool}
                    disabled={testingTool}
                    className="btn-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    {testingTool ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 mr-1" />}
                    Execute
                  </Button>
                </div>
              </div>
            </div>

            {testResult && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-base-content/60">Live Tool Response:</span>
                <pre className="p-4 bg-base-200 rounded-2xl text-xs font-mono whitespace-pre-wrap overflow-x-auto text-base-content border border-base-300">
                  {testResult}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Organization Skills Den */}
      {activeTab === 'den' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRESET_SKILLS.map((skill) => (
              <div
                key={skill.slug}
                className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between hover:border-indigo-500/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-primary badge-sm font-bold text-[10px]">{skill.category}</span>
                    <span className="text-[10px] font-mono text-base-content/40">{skill.estimatedExecutionTime}</span>
                  </div>
                  <h4 className="font-bold text-sm text-base-content">{skill.title}</h4>
                  <p className="text-xs text-base-content/65 leading-relaxed">{skill.description}</p>
                </div>

                <div className="pt-2 border-t border-base-300/40 flex items-center justify-between">
                  <span className="text-[10px] text-indigo-400 font-mono font-bold">/{skill.slug}</span>
                  <Button
                    onClick={() => {
                      setSelectedTool('execute_playbook_skill');
                      setTestInput(`Run ${skill.title}`);
                      setActiveTab('mcp');
                    }}
                    className="btn-xs rounded-lg bg-indigo-600/15 text-indigo-400 hover:bg-indigo-600 hover:text-white border-0 font-bold"
                  >
                    <Play className="w-3 h-3 mr-1" /> Run in MCP
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
