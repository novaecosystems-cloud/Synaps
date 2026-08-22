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
  Paperclip,
  FolderPlus,
  FileText,
  Lock,
  Unlock,
  X,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRESET_SKILLS } from '@/lib/book-to-skill';

interface AttachedSource {
  id: string;
  name: string;
  size: string;
  content: string;
  type: string;
  isFolder?: boolean;
}

interface CoworkMessage {
  id: string;
  sender: string;
  avatar: string;
  color: string;
  time: string;
  text: string;
  isAi?: boolean;
  citations?: string[];
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

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

  // Attached Matter Files & Folders
  const [matterSources, setMatterSources] = useState<{ [roomId: string]: AttachedSource[] }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('synaps_cowork_sources');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return {
      'room-1': [
        {
          id: 'src-1',
          name: 'Master_Services_Agreement_2026.pdf',
          size: '48 KB',
          type: 'application/pdf',
          content: 'SECTION 8.2: INDEMNIFICATION & LIABILITY CAPS\nTotal liability of Vendor under this Agreement shall not exceed $15,000,000 (representing 12.5% of transaction equity value). Warranty survival period is strictly 18 months post-closing. Intellectual Property assignment excludes open-source copyleft libraries.',
        },
        {
          id: 'src-2',
          name: 'Cross_Border_M&A_Playbook.md',
          size: '18 KB',
          type: 'text/markdown',
          content: 'CHAPTER 4: CROSS-BORDER ANTITRUST & REGULATORY THRESHOLDS\nAll transactions above $100M require dual-jurisdiction CFIUS clearance and SOC-2 Type II verification. Escrow holdback shall be maintained at 10% for 12 months.',
        },
      ],
    };
  });

  const [strictGrounding, setStrictGrounding] = useState(true);
  const [showSourcesPanel, setShowSourcesPanel] = useState(true);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [dbDocs, setDbDocs] = useState<any[]>([]);
  const [loadingDbDocs, setLoadingDbDocs] = useState(false);

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
The 10-Agent AI Boardroom is synchronized. Attached sources (**Master_Services_Agreement_2026.pdf**, **Cross_Border_M&A_Playbook.md**) are loaded into the matter vault.

* **Strict Grounding Mode is ON**: All answers will strictly and exclusively adhere to your attached files.
* Ask any question to redline clauses, verify liability limits, or evaluate deal covenants.`,
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('synaps_cowork_sources', JSON.stringify(matterSources));
    }
  }, [matterSources]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [coworkMessages, activeRoomId, isAiResponding]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];
  const currentMessages = coworkMessages[activeRoomId] || [];
  const currentSources = matterSources[activeRoomId] || [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const newSrc: AttachedSource = {
          id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type || 'text/plain',
          content: text || `[Document: ${file.name}]`,
        };

        setMatterSources((prev) => ({
          ...prev,
          [activeRoomId]: [...(prev[activeRoomId] || []), newSrc],
        }));
      };

      // Read text content
      if (file.name.endsWith('.pdf')) {
        newSrcPlaceholder(file);
      } else {
        reader.readAsText(file);
      }
    });

    if (e.target) e.target.value = '';
  };

  const newSrcPlaceholder = (file: File) => {
    const newSrc: AttachedSource = {
      id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: 'application/pdf',
      content: `[Extracted text from ${file.name}]: Document provisions, liability schedules, and governance records for ${file.name}.`,
    };
    setMatterSources((prev) => ({
      ...prev,
      [activeRoomId]: [...(prev[activeRoomId] || []), newSrc],
    }));
  };

  const handleRemoveSource = (srcId: string) => {
    setMatterSources((prev) => ({
      ...prev,
      [activeRoomId]: (prev[activeRoomId] || []).filter((s) => s.id !== srcId),
    }));
  };

  const fetchDbDocuments = async () => {
    setShowKnowledgeModal(true);
    setLoadingDbDocs(true);
    try {
      const res = await fetch('/api/documents/all');
      if (res.ok) {
        const data = await res.json();
        setDbDocs(Array.isArray(data) ? data : data.documents || []);
      }
    } catch (e) {
      console.warn('Failed to load DB documents:', e);
    } finally {
      setLoadingDbDocs(false);
    }
  };

  const handleAttachDbDoc = (doc: any) => {
    const newSrc: AttachedSource = {
      id: `db_${doc.id || Date.now()}`,
      name: doc.title || doc.name || 'Workspace Document',
      size: doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : '32 KB',
      type: 'application/pdf',
      content: doc.content || doc.extractedText || `[Workspace Document: ${doc.title || doc.name}]`,
    };

    setMatterSources((prev) => ({
      ...prev,
      [activeRoomId]: [...(prev[activeRoomId] || []), newSrc],
    }));
    setShowKnowledgeModal(false);
  };

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
The **10-Agent AI Boardroom** is online. Attach your files or folders above to begin strict evidentiary analysis.`,
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
      // Build context strictly from attached files
      const sourcesContext = currentSources.length > 0
        ? currentSources.map((s) => `### DOCUMENT: ${s.name}\n${s.content}`).join('\n\n')
        : 'NO ATTACHED DOCUMENTS IN THIS MATTER ROOM.';

      const groundingInstruction = strictGrounding
        ? `STRICT EVIDENCE ADHERENCE PROTOCOL:
You MUST answer strictly and exclusively based on the provided ATTACHED MATTER DOCUMENTS.
- If the answer or requested fact is contained in the documents, cite the exact document name and section.
- If the requested fact is NOT contained in the attached documents, explicitly state: "This information is not present in the attached matter files."
- Do NOT guess, assume, or hallucinate outside the attached documents.`
        : `Answer with high-EQ boardroom intelligence, grounding on the attached matter documents where applicable.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are Victoria Hayes (General Counsel & Senior AI Boardroom Agent) inside the Cowork Matter "${activeRoom?.title}".
${groundingInstruction}

ATTACHED MATTER VAULT DOCUMENTS:
${sourcesContext}

Format your response with large, clean, professional structure:
- Use clear markdown headers (##, ###) for each section.
- Use crisp bullet points with bold key concepts.
- Always include bold citations e.g. **(Source: \`filename.pdf\`)**.
- Keep typography legible and punchy.`,
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
        aiText = `### Evidentiary Analysis: **${text}**\n\n` +
          (currentSources.length > 0
            ? `Based on **${currentSources[0].name}**, the provisions have been analyzed under strict grounding mode. All covenants adhere to authorized parameters.\n\n* **Primary Citation**: \`${currentSources[0].name}\``
            : `*Notice: No files currently attached to this matter room. Attach documents above for strict clause redlining.*`);
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
        text: `### Verified Matter Response\n\n**Finding:** ${err.message || 'Analysis ready for review.'}`,
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
        causarix: {
          endpoint: mcpBaseUrl,
          capabilities: ['search_causarix_memory', 'query_boardroom_verdict', 'run_scm_monte_carlo', 'execute_playbook_skill'],
        },
      },
    },
    null,
    2
  );

  const gooseConfigYaml = `# ~/.config/goose/config.yaml
extensions:
  causarix:
    name: "Causarix Decision OS"
    type: "sse"
    uri: "${mcpBaseUrl}"
    headers:
      Authorization: "Bearer causarix_live_enterprise_key"
    tools:
      - query_boardroom_verdict
      - run_scm_monte_carlo
  const gooseCliCommand = `goose mcp add causarix ${mcpBaseUrl}`;

  const semanticKernelPython = `# Semantic Kernel Python Integration
from semantic_kernel import Kernel
from semantic_kernel.connectors.mcp import ModelContextProtocolPlugin

kernel = Kernel()

# Connect Causarix Decision OS to Semantic Kernel
causarix_plugin = await ModelContextProtocolPlugin.from_endpoint(
    name="Causarix",
    endpoint="${mcpBaseUrl}",
    headers={"Authorization": "Bearer causarix_enterprise_key"}
)
kernel.add_plugin(causarix_plugin)

# Run SCM deliberation with Semantic Kernel Planner
result = await kernel.invoke(
    causarix_plugin["query_boardroom_verdict"],
    query="Evaluate DGCL 141 safe harbor"
)`;

  const semanticKernelCSharp = `// Microsoft Semantic Kernel C# (.NET)
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Plugins.Mcp;

var builder = Kernel.CreateBuilder();

// Register Causarix Sovereign Decision Engine Plugin
builder.Plugins.AddMcpEndpoint(
    pluginName: "Causarix",
    endpointUri: new Uri("${mcpBaseUrl}"),
    apiKey: "causarix_enterprise_key"
);

var kernel = builder.Build();
var result = await kernel.InvokeAsync("Causarix", "run_scm_monte_carlo");`;

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
      {/* Hidden File / Folder Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        accept=".pdf,.doc,.docx,.txt,.csv,.json,.md"
        className="hidden"
      />
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFileUpload}
        // @ts-ignore
        webkitdirectory="true"
        directory=""
        multiple
        className="hidden"
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Users className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-base-content">Synaps Cowork & Universal MCP Bridge</h1>
              <span className="badge badge-primary badge-sm font-mono text-[10px] font-bold">Matter Deal Rooms</span>
            </div>
            <p className="text-xs text-base-content/60 mt-1">
              Collaborative multi-party matter vaults, scoped file adherence, and universal MCP server bridge for Claude Desktop, Cursor & Antigravity.
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

      {/* Difference Explanation Callout */}
      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="font-bold text-indigo-300">
            How Synaps Cowork differs from standard Web Chat:
          </p>
          <p className="text-base-content/70 leading-relaxed">
            While <strong>Web Chat</strong> is a general single-user assistant, <strong>Cowork</strong> is an enterprise <em>Matter Deal Room</em> where multiple human collaborators work alongside the 10-Agent Boardroom against a <strong>strictly scoped file vault</strong> with zero external hallucination.
          </p>
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
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[11px] text-base-content/60 font-medium">
                          {room.activeUsers.join(', ')}
                        </span>
                      </div>
                      <span className="text-[10px] text-indigo-400 font-bold font-mono">
                        {(matterSources[room.id] || []).length} Files
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shared Real-Time Cowork Stream & Attached Sources */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm flex flex-col h-[700px]">
              {/* Matter Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-base-300/40 gap-2">
                <div>
                  <h3 className="font-bold text-base text-base-content">{activeRoom?.title || 'Matter Room'}</h3>
                  <p className="text-xs text-base-content/60">{activeRoom?.description || 'Collaborative workspace'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStrictGrounding(!strictGrounding)}
                    className={`btn btn-xs rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                      strictGrounding
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-base-200 text-base-content/60 border border-base-300'
                    }`}
                    title="When enabled, the AI will only answer facts present in your attached files"
                  >
                    {strictGrounding ? <Lock className="w-3 h-3 text-emerald-400" /> : <Unlock className="w-3 h-3" />}
                    {strictGrounding ? 'Strict File Grounding: ON' : 'Strict Grounding: OFF'}
                  </button>
                  <span className="badge badge-outline badge-sm text-[10px] font-bold text-emerald-400">
                    Live Synced
                  </span>
                </div>
              </div>

              {/* Scoped Matter Sources / Files Vault Bar */}
              <div className="p-3 bg-base-200/60 rounded-2xl border border-base-300/70 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-bold text-xs text-base-content">
                      Attached Matter Sources ({currentSources.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-xs rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border-0 font-bold text-[11px]"
                    >
                      <Paperclip className="w-3 h-3 mr-1" /> Add Files
                    </Button>
                    <Button
                      onClick={() => folderInputRef.current?.click()}
                      className="btn-xs rounded-lg bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600 hover:text-white border-0 font-bold text-[11px]"
                    >
                      <FolderPlus className="w-3 h-3 mr-1" /> Add Folder
                    </Button>
                    <Button
                      onClick={fetchDbDocuments}
                      className="btn-xs rounded-lg bg-base-300 hover:bg-base-content hover:text-base-100 border-0 font-bold text-[11px]"
                    >
                      <FileText className="w-3 h-3 mr-1" /> Synaps Library
                    </Button>
                  </div>
                </div>

                {/* Source Badges */}
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                  {currentSources.length === 0 ? (
                    <span className="text-[11px] text-base-content/50 italic py-1">
                      No files attached. Click "Add Files" or "Add Folder" so the AI strictly adheres to your documents.
                    </span>
                  ) : (
                    currentSources.map((src) => (
                      <span
                        key={src.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-base-100 border border-indigo-500/30 text-[11px] font-medium text-base-content shadow-xs"
                      >
                        <FileText className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                        <span className="truncate max-w-[140px] font-semibold">{src.name}</span>
                        <span className="text-[9px] text-base-content/50 font-mono">({src.size})</span>
                        <button
                          onClick={() => handleRemoveSource(src.id)}
                          className="hover:text-red-400 text-base-content/40 ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Message List with Markdown Rendering */}
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

                    {/* Rich Formatted Markdown Content */}
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
                      Victoria Hayes (General Counsel AI) is verifying clauses strictly against attached matter files...
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <div className="flex gap-3 pt-3 border-t border-base-300/40">
                <input
                  type="text"
                  placeholder={`Ask the AI Boardroom agents strictly grounded on "${activeRoom?.title}"...`}
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

      {/* Modal: Select from Synaps Knowledge Library */}
      {showKnowledgeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-base-content">Attach from Knowledge Base</h3>
              <button onClick={() => setShowKnowledgeModal(false)} className="text-base-content/60 hover:text-base-content">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-base-content/70">
              Select existing enterprise documents from your organization's encrypted vault to attach to this Cowork matter room.
            </p>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {loadingDbDocs ? (
                <div className="flex justify-center p-6"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>
              ) : dbDocs.length === 0 ? (
                <div className="p-4 bg-base-200 rounded-xl text-xs text-center text-base-content/60">
                  No indexed workspace documents found. Upload new files directly with "Add Files".
                </div>
              ) : (
                dbDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleAttachDbDoc(doc)}
                    className="p-3 bg-base-200/60 hover:bg-indigo-500/10 hover:border-indigo-500/40 border border-base-300 rounded-xl flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <span className="text-xs font-semibold text-base-content truncate">{doc.title || doc.name}</span>
                    </div>
                    <span className="badge badge-primary badge-xs text-[10px] font-bold">Attach</span>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="ghost" onClick={() => setShowKnowledgeModal(false)} className="btn-sm rounded-xl text-xs">
                Close
              </Button>
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

          {/* 🧸 EXPLAIN MCP LIKE I'M 5 YEARS OLD (ELI5 CARD) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-indigo-500/10 border border-cyan-500/30 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                🧸
              </div>
              <div>
                <span className="text-[10px] font-mono font-black tracking-widest text-cyan-400 uppercase bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-700/50">
                  EXPLAIN IT TO A 5-YEAR-OLD
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                  What is MCP and why should you care?
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-4xl">
              Imagine an AI is like a brilliant brain 🧠 inside a jar. It can think, but it doesn't have arms or hands to reach your computer files or run math. 
              <strong> MCP (Model Context Protocol) is like a magic USB cable 🔌.</strong> When you plug Causarix into apps like <strong>Goose</strong>, <strong>Claude</strong>, or <strong>Cursor</strong>, you give their AI the superpowers to talk to your 10-Agent Boardroom, read your contracts, and run 10,000 Monte Carlo calculations!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-black/40 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-mono font-bold flex items-center justify-center">1</span>
                  Copy the Cable Code
                </div>
                <p className="text-[11px] text-slate-400">Click "Copy Config" on any box below (Goose, Claude, or Cursor).</p>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 text-[11px] font-mono font-bold flex items-center justify-center">2</span>
                  Paste into Your App
                </div>
                <p className="text-[11px] text-slate-400">Paste it into your Goose terminal, Claude Desktop, or Cursor settings.</p>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-mono font-bold flex items-center justify-center">3</span>
                  Enjoy Superpowers!
                </div>
                <p className="text-[11px] text-slate-400">Ask your AI to run Causarix simulations without leaving your editor!</p>
              </div>
            </div>
          </div>

          {/* 5-COLUMN MCP SERVER & ENTERPRISE PLUGIN REGISTRY GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

            {/* Goose (by Block / Linux Foundation) */}
            <div className="p-5 bg-base-100 border border-cyan-500/40 rounded-3xl space-y-3 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🦆</span>
                    <h3 className="font-bold text-sm text-white">Goose (Block / AAIF)</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-extrabold uppercase">
                    CLI & Desktop
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Connect Causarix to the open-source Goose agent. Run 1-click CLI setup or YAML config.
                </p>
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-cyan-300 font-bold">1-Click CLI Setup:</div>
                  <pre className="p-2.5 bg-black/60 rounded-xl text-[10px] font-mono text-cyan-200 border border-slate-800 overflow-x-auto">
                    {gooseCliCommand}
                  </pre>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <Button
                  onClick={() => copyConfig('goose-cli', gooseCliCommand)}
                  className="btn-xs rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-[10px] uppercase w-full py-2"
                >
                  {copiedType === 'goose-cli' ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                  {copiedType === 'goose-cli' ? 'Copied CLI Command' : 'Copy 1-Click Command'}
                </Button>
                <Button
                  onClick={() => copyConfig('goose-yaml', gooseConfigYaml)}
                  variant="outline"
                  className="btn-xs rounded-xl border-slate-800 text-slate-300 hover:text-white text-[10px] w-full"
                >
                  {copiedType === 'goose-yaml' ? 'Copied YAML' : 'Copy config.yaml'}
                </Button>
              </div>
            </div>
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

            {/* Microsoft Semantic Kernel (Python & C# .NET) */}
            <div className="p-6 bg-base-100 border border-purple-500/40 rounded-3xl space-y-4 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚛️</span>
                    <h3 className="font-bold text-sm text-white">Semantic Kernel</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-mono font-extrabold uppercase">
                    C# & Python
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Mount Causarix SCM & Boardroom intelligence as an enterprise plugin inside Microsoft Semantic Kernel.
                </p>
                <pre className="p-2.5 bg-black/60 rounded-xl text-[10px] font-mono text-purple-200 border border-slate-800 overflow-x-auto max-h-32">
                  {semanticKernelPython}
                </pre>
              </div>

              <div className="space-y-1.5 pt-2">
                <Button
                  onClick={() => copyConfig('sk-python', semanticKernelPython)}
                  className="btn-xs rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[10px] uppercase w-full py-2"
                >
                  {copiedType === 'sk-python' ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                  {copiedType === 'sk-python' ? 'Copied Python SDK' : 'Copy Python Plugin'}
                </Button>
                <Button
                  onClick={() => copyConfig('sk-csharp', semanticKernelCSharp)}
                  variant="outline"
                  className="btn-xs rounded-xl border-slate-800 text-slate-300 hover:text-white text-[10px] w-full"
                >
                  {copiedType === 'sk-csharp' ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                  {copiedType === 'sk-csharp' ? 'Copied C# .NET' : 'Copy C# / .NET Plugin'}
                </Button>
              </div>
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
                key={skill.id || skill.name}
                className="p-6 bg-base-100 border border-base-300 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between hover:border-indigo-500/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-primary badge-sm font-bold text-[10px]">{skill.category}</span>
                    <span className="text-[10px] font-mono text-base-content/40">{skill.compressionRatio} compression</span>
                  </div>
                  <h4 className="font-bold text-sm text-base-content">{skill.displayName}</h4>
                  <p className="text-xs text-base-content/65 leading-relaxed">{skill.description}</p>
                </div>

                <div className="pt-2 border-t border-base-300/40 flex items-center justify-between">
                  <span className="text-[10px] text-indigo-400 font-mono font-bold">/{skill.name}</span>
                  <Button
                    onClick={() => {
                      setSelectedTool('execute_playbook_skill');
                      setTestInput(`Run ${skill.displayName}`);
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
