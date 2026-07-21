'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Play, Terminal, CheckCircle2, Circle, AlertCircle, Sparkles, BrainCircuit, Activity } from 'lucide-react';

const AGENTS = [
  { id: 'doc_analyst', name: 'Document Analyst', description: 'Parses structural metadata' },
  { id: 'req_analyst', name: 'Requirement Analyst', description: 'Extracts obligations' },
  { id: 'comp_analyst', name: 'Compliance Analyst', description: 'Queries Vector DB' },
  { id: 'risk_analyst', name: 'Risk Analyst', description: 'Identifies capability gaps' },
  { id: 'exec_reviewer', name: 'Executive Reviewer', description: 'Go/No-Go & Summary' },
  { id: 'prop_writer', name: 'Proposal Writer', description: 'Drafts 13-section Proposal' }
];

type AgentStatus = 'idle' | 'active' | 'completed' | 'error';
type LogEntry = { timestamp: string; agentId: string; message: string; type: string };

export default function AgentWorkspace({ documentId, onComplete }: { documentId: string, onComplete?: () => void }) {
  const [statuses, setStatuses] = useState<Record<string, AgentStatus>>(
    AGENTS.reduce((acc, a) => ({ ...acc, [a.id]: 'idle' }), {})
  );
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const startOrchestration = () => {
    if (!documentId) return;
    
    // Reset state
    setStatuses(AGENTS.reduce((acc, a) => ({ ...acc, [a.id]: 'idle' }), {}));
    setLogs([]);
    setIsRunning(true);
    setIsComplete(false);

    fetch('/api/agents/orchestrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId })
    }).then(async response => {
      if (!response.body) throw new Error("No body");
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (!dataStr.trim()) continue;
            
            try {
              const event = JSON.parse(dataStr);
              
              if (event.type === 'status' && event.agentId) {
                setStatuses(prev => ({ ...prev, [event.agentId]: event.message as AgentStatus }));
              }
              
              if (event.type === 'log' || event.type === 'info' || event.type === 'error' || event.type === 'complete') {
                setLogs(prev => [...prev, {
                  timestamp: new Date(event.timestamp).toLocaleTimeString(),
                  agentId: event.agentId,
                  message: event.message,
                  type: event.type
                }]);
              }

              if (event.type === 'complete') {
                setIsRunning(false);
                setIsComplete(true);
                if (onComplete) onComplete();
              }

              if (event.type === 'error') {
                setIsRunning(false);
              }
            } catch (e) {
              console.error("Failed to parse SSE line", dataStr);
            }
          }
        }
      }
    }).catch(err => {
      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        agentId: 'orchestrator',
        message: 'Connection failed: ' + err.message,
        type: 'error'
      }]);
      setIsRunning(false);
    });
  };

  if (!documentId) return <div className="p-8 text-center text-muted-foreground">Please select a document first.</div>;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-card border-b border-border shadow-sm shrink-0">
        <div>
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-500" /> 
            Agent Workspace
          </h2>
          <p className="text-sm text-muted-foreground ml-7">Multi-Agent System Orchestrator</p>
        </div>
        <div className="flex gap-2 items-center">
          <button 
             onClick={startOrchestration}
             disabled={isRunning}
             className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-md transition-colors font-medium flex items-center gap-2"
           >
             {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : (isComplete ? <Sparkles className="w-4 h-4" /> : <Play className="w-4 h-4" />)}
             {isRunning ? 'Orchestrating...' : (isComplete ? 'Run Again' : 'Start Automated Pipeline')}
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row p-6 gap-6">
        
        {/* Left: Agent Status Grid */}
        <div className="w-full md:w-1/3 flex flex-col gap-3 overflow-y-auto pr-2">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Active Agents
          </h3>
          {AGENTS.map(agent => {
            const status = statuses[agent.id];
            return (
              <div key={agent.id} className={`p-4 rounded-xl border transition-all duration-300 ${status === 'active' ? 'bg-indigo-500/10 border-indigo-500/50 shadow-md transform scale-[1.02]' : status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-card border-border'}`}>
                <div className="flex justify-between items-center mb-1">
                  <h4 className={`font-semibold text-sm ${status === 'active' ? 'text-indigo-400' : 'text-foreground'}`}>
                    {agent.name}
                  </h4>
                  {status === 'active' ? (
                    <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                  ) : status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : status === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{agent.description}</p>
                {status === 'active' && <div className="h-1 w-full bg-indigo-500/20 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-indigo-500 w-full animate-pulse rounded-full"></div>
                </div>}
              </div>
            );
          })}
        </div>

        {/* Right: Live Terminal Logs */}
        <div className="w-full md:w-2/3 bg-[#0c0c0e] rounded-xl border border-[#1f1f22] flex flex-col shadow-inner overflow-hidden">
           <div className="bg-[#18181b] border-b border-[#27272a] p-3 flex items-center gap-2 text-[#a1a1aa] text-xs font-mono">
             <Terminal className="w-4 h-4" /> Orchestrator Output
           </div>
           <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2">
             {logs.length === 0 ? (
               <div className="text-[#52525b] italic">Waiting to start orchestration...</div>
             ) : (
               logs.map((log, i) => (
                 <div key={i} className={`flex gap-3 leading-relaxed ${
                   log.type === 'error' ? 'text-red-400' :
                   log.type === 'complete' ? 'text-emerald-400 font-bold' :
                   log.type === 'info' ? 'text-blue-400' :
                   'text-[#d4d4d8]'
                 }`}>
                   <span className="text-[#52525b] shrink-0">[{log.timestamp}]</span>
                   <span className="text-indigo-400 shrink-0 font-semibold w-32 truncate" title={log.agentId}>
                     {log.agentId === 'orchestrator' ? 'SYSTEM' : AGENTS.find(a => a.id === log.agentId)?.name || log.agentId}
                   </span>
                   <span className="break-words">
                     {log.type === 'error' ? 'ERROR: ' : ''}{log.message}
                   </span>
                 </div>
               ))
             )}
             <div ref={logsEndRef} />
           </div>
        </div>

      </div>
    </div>
  );
}
