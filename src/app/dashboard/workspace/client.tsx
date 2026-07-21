'use client'

import { useState, useRef, useEffect } from 'react';
import { 
  FileText, Database, Sparkles, Send, Loader2, Link2, 
  ChevronRight, BrainCircuit, Activity, FileCheck, ShieldAlert 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  confidenceScore?: number;
};

export default function WorkspaceClient({ initialDocuments }: { initialDocuments: any[] }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'initial', role: 'assistant', content: "Hello! I am connected to your document vector database. Ask me a question, and I will retrieve the most contextually relevant evidence to generate an answer." }
  ]);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [isRetrieving, setIsRetrieving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isRetrieving]);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isRetrieving) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: query };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setQuery('');
    setIsRetrieving(true);

    try {
      const res = await fetch(`/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });
      
      const data = await res.json();
      
      if (data.success) {
        if (data.evidence) setEvidence(data.evidence);
        
        setMessages(prev => [
          ...prev, 
          { 
            id: Date.now().toString(), 
            role: 'assistant', 
            content: data.answer || "I could not generate an answer based on the provided documents.",
            sources: data.sources || [],
            confidenceScore: data.confidenceScore || 0
          }
        ]);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: `Error: ${err.message || "Failed to query the AI model."}` 
      }]);
    } finally {
      setIsRetrieving(false);
    }
  };

  const lastAssistantMessage = messages.slice().reverse().find(m => m.role === 'assistant' && m.id !== 'initial');
  const displayConfidence = lastAssistantMessage?.confidenceScore ?? 0;
    
  const relatedDocIds = Array.from(new Set(evidence.map(e => e.documentId)));
  const relatedDocs = initialDocuments.filter(d => relatedDocIds.includes(d.id));

  return (
    <div className="h-full flex flex-col gap-4 animate-in fade-in duration-700 text-base-content">
      
      {/* 3-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        
        {/* LEFT PANEL: Knowledge Base */}
        <div className="lg:col-span-3 flex flex-col bg-base-100 border border-base-300 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-base-300 bg-base-200/50">
            <h2 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" /> Knowledge Base
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {initialDocuments.length === 0 ? (
              <div className="text-center py-8 text-base-content/40 text-xs">No documents available</div>
            ) : (
              initialDocuments.map(doc => (
                <div key={doc.id} className="group relative flex items-center gap-3 p-3 rounded-xl bg-base-200 border border-base-300 hover:border-primary/40 transition-all cursor-pointer hover:bg-base-300/50">
                  <FileText className="w-4 h-4 text-primary/70 shrink-0 relative z-10" />
                  <div className="flex-1 min-w-0 relative z-10">
                    <p className="text-xs font-medium truncate">{doc.name}</p>
                    <p className="text-[10px] text-base-content/50">{formatDistanceToNow(new Date(doc.createdAt))} ago</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CENTER PANEL: AI Conversation */}
        <div className="lg:col-span-6 flex flex-col bg-base-100 border border-base-300 rounded-2xl overflow-hidden shadow-sm relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          <div className="p-4 border-b border-base-300 bg-base-200/50">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-primary" /> AI Canvas
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-content shadow-sm rounded-tr-sm' 
                    : 'bg-base-200 border border-base-300 rounded-tl-sm'
                }`}>
                  {msg.role === 'user' ? (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="prose prose-sm max-w-none text-base-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="pt-3 border-t border-base-300 flex flex-wrap gap-2 items-center">
                          <span className="text-[10px] uppercase tracking-wider text-base-content/50 font-semibold flex items-center gap-1 mr-1">
                            <FileCheck className="w-3 h-3" /> Sources cited:
                          </span>
                          {msg.sources.map((src, idx) => (
                            <span key={idx} className="badge badge-sm badge-outline badge-primary">
                              {src}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isRetrieving && (
              <div className="flex justify-start animate-in fade-in zoom-in duration-300">
                <div className="bg-base-200 border border-base-300 rounded-2xl rounded-tl-sm px-5 py-4 flex flex-col gap-3 shadow-sm">
                  <div className="flex items-center gap-3 text-primary text-sm font-medium">
                    <Loader2 className="w-4 h-4 animate-spin" /> Retrieving Context & Reasoning
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-base-content/50">
                      <ChevronRight className="w-3 h-3 text-primary/50" /> Extracting semantic intent...
                    </div>
                    <div className="flex items-center gap-2 text-xs text-base-content/50 animate-pulse">
                      <ChevronRight className="w-3 h-3 text-primary/50" /> Scanning 3072D vector space...
                    </div>
                    <div className="flex items-center gap-2 text-xs text-success/70 animate-pulse">
                      <ChevronRight className="w-3 h-3 text-success/70" /> Generating conversational response...
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-base-200/50 border-t border-base-300">
            <form onSubmit={handleQuery} className="relative group">
              <div className="relative flex items-center bg-base-100 rounded-xl border border-base-300 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Ask anything about your documents..."
                  className="flex-1 bg-transparent px-4 py-4 text-sm focus:outline-none"
                  disabled={isRetrieving}
                />
                <button 
                  type="submit" 
                  disabled={isRetrieving || !query.trim()}
                  className="btn btn-primary btn-sm h-10 mr-2"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT PANEL: Evidence */}
        <div className="lg:col-span-3 flex flex-col bg-base-100 border border-base-300 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-base-300 bg-base-200/50">
            <h2 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-success" /> Retrieved Evidence
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {evidence.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-base-content/40 text-xs text-center px-4">
                <Database className="w-8 h-8 mb-3 opacity-20" />
                Waiting for query to retrieve contextual chunks...
              </div>
            ) : (
              evidence.map((chunk, idx) => (
                <div key={chunk.id} className="animate-in slide-in-from-right-4 fade-in duration-500" style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}>
                  <div className="bg-success/5 border border-success/20 rounded-xl p-3 hover:bg-success/10 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="badge badge-success badge-sm badge-outline text-[10px] uppercase">
                        Rank #{idx + 1}
                      </span>
                      <span className="text-[10px] text-base-content/50">Pg {chunk.pageNumber || '?'}</span>
                    </div>
                    <p className="text-xs text-base-content/70 leading-relaxed pl-2 border-l-2 border-success/30 line-clamp-6 hover:line-clamp-none transition-all">
                      {chunk.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>

      {/* BOTTOM PANEL: Info Bar */}
      <div className="shrink-0 h-16 bg-base-100 border border-base-300 rounded-2xl px-6 flex items-center justify-between shadow-sm">
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${displayConfidence > 80 ? 'bg-success/10 text-success' : displayConfidence > 50 ? 'bg-warning/10 text-warning' : displayConfidence > 0 ? 'bg-error/10 text-error' : 'bg-base-200 text-base-content/50'}`}>
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-base-content/50 font-semibold mb-0.5">Confidence Score</p>
              <p className="text-sm font-medium">{displayConfidence > 0 ? `${displayConfidence}% AI Confidence` : 'N/A'}</p>
            </div>
          </div>

          <div className="h-8 w-px bg-base-300 hidden md:block" />

          <div className="hidden md:flex items-center gap-3">
            <div className="p-2 bg-info/10 rounded-lg text-info">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-base-content/50 font-semibold mb-0.5">Related Documents</p>
              <div className="flex gap-2">
                {relatedDocs.length > 0 ? relatedDocs.map(doc => (
                   <span key={doc.id} className="text-xs text-info truncate max-w-[120px]">{doc.name}</span>
                )) : <span className="text-xs text-base-content/40">None</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button disabled className="btn btn-sm btn-ghost border border-base-300 opacity-50 text-xs">
             <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Require Human Review
           </button>
           <button disabled className="btn btn-sm btn-primary btn-outline opacity-50 text-xs">
             <FileCheck className="w-3.5 h-3.5 mr-1" /> Generate Report
           </button>
        </div>

      </div>

    </div>
  );
}
