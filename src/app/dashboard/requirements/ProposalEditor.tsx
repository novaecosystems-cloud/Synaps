'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Play, Download, Printer, FileText, CheckCircle, Save, Sparkles, History, AlignLeft, RefreshCw, Send, ListTree, GitBranch } from 'lucide-react';
import WorkflowPanel from './WorkflowPanel';

export default function ProposalEditor({ documentId }: { documentId: string }) {
  const [proposal, setProposal] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [rightTab, setRightTab] = useState<'AI' | 'WORKFLOW'>('AI');
  
  // Auto-save state
  const [saving, setSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // AI Assistant State
  const [aiInstruction, setAiInstruction] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => {
    if (documentId) {
      fetchProposal();
    }
  }, [documentId]);

  const fetchProposal = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/proposals?documentId=${documentId}`);
      const data = await res.json();
      if (data.success && data.proposal) {
        setProposal(data.proposal);
        if (data.proposal.sections.length > 0 && !activeSectionId) {
          handleSectionSelect(data.proposal.sections[0]);
        }
      } else {
        // No proposal generated yet
        setProposal(null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateProposal = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`/api/proposals/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId })
      });
      const data = await res.json();
      if (data.success) {
        setProposal(data.proposal);
        if (data.proposal.sections.length > 0) {
          handleSectionSelect(data.proposal.sections[0]);
        }
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSectionSelect = (section: any) => {
    // If we're navigating away from a dirty section, we'd normally force save.
    // For now, auto-save handles most of it.
    setActiveSectionId(section.id);
    setEditorContent(section.content);
    setAiInstruction('');
  };

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setEditorContent(val);

    // Update local state immediately for fast switching
    if (proposal) {
      const updatedSections = proposal.sections.map((s: any) => 
        s.id === activeSectionId ? { ...s, content: val } : s
      );
      setProposal({ ...proposal, sections: updatedSections });
    }

    // Debounced Auto-save
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setSaving(true);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await fetch('/api/proposals/sections', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionId: activeSectionId, content: val })
        });
      } catch (err) {
        console.error("Auto-save failed", err);
      } finally {
        setSaving(false);
      }
    }, 1500);
  };

  const regenerateActiveSection = async () => {
    if (!activeSectionId || !aiInstruction) return;
    setAiGenerating(true);
    try {
      const res = await fetch('/api/proposals/sections/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId: activeSectionId, instructions: aiInstruction })
      });
      const data = await res.json();
      if (data.success) {
        setEditorContent(data.section.content);
        // Update local state
        const updatedSections = proposal.sections.map((s: any) => 
          s.id === activeSectionId ? data.section : s
        );
        setProposal({ ...proposal, sections: updatedSections });
        setAiInstruction('');
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert("Failed to regenerate: " + err.message);
    } finally {
      setAiGenerating(false);
    }
  };

  const activeSection = proposal?.sections.find((s: any) => s.id === activeSectionId);

  // Exporters
  const handlePrint = () => window.print();
  const downloadMarkdown = () => {
    if (!proposal) return;
    const md = proposal.sections.map((s: any) => `# ${s.title}\n\n${s.content}\n\n`).join('---\n\n');
    const blob = new Blob([`# ${proposal.title}\n\n${md}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${proposal.title.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!documentId) return <div className="p-8 text-center text-muted-foreground">Please select a document first.</div>;

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex justify-between items-center p-4 bg-card border-b border-border shadow-sm print:hidden shrink-0">
        <div>
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" /> 
            Proposal Editor
          </h2>
          <p className="text-sm text-muted-foreground ml-7">AI-assisted full document creation.</p>
        </div>
        <div className="flex gap-2 items-center">
          {saving && <span className="text-xs text-muted-foreground flex items-center gap-1 mr-4"><Loader2 className="w-3 h-3 animate-spin" /> Auto-saving...</span>}
          {proposal && (
            <>
              <button onClick={downloadMarkdown} className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground text-sm rounded-md transition-colors flex items-center gap-2 border border-border">
                <Download className="w-4 h-4" /> Markdown
              </button>
              <button onClick={handlePrint} className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground text-sm rounded-md transition-colors flex items-center gap-2 border border-border">
                <Printer className="w-4 h-4" /> Print / PDF
              </button>
            </>
          )}
          {!proposal && !loading && (
             <button 
             onClick={generateProposal}
             disabled={generating}
             className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-md transition-colors font-medium flex items-center gap-2"
           >
             {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
             {generating ? 'Generating Draft...' : 'Generate Initial Draft'}
           </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center print:hidden">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : !proposal ? (
        <div className="flex-1 flex flex-col justify-center items-center text-muted-foreground p-8 print:hidden">
          <FileText className="w-16 h-16 opacity-20 mb-4" />
          <p>No proposal draft exists yet.</p>
          <p className="text-sm">Click "Generate Initial Draft" to build a full proposal based on extracted requirements and gaps.</p>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Pane: Outline (Hidden on Print) */}
          <div className="w-64 bg-card border-r border-border flex flex-col shrink-0 print:hidden overflow-y-auto">
            <div className="p-3 border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <ListTree className="w-4 h-4" /> Document Outline
            </div>
            <div className="p-2 space-y-1">
              {proposal.sections.map((sec: any) => (
                <button
                  key={sec.id}
                  onClick={() => handleSectionSelect(sec)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors truncate ${activeSectionId === sec.id ? 'bg-indigo-500/10 text-indigo-400 font-medium' : 'hover:bg-muted text-muted-foreground'}`}
                >
                  {sec.title}
                </button>
              ))}
            </div>
          </div>

          {/* Center Pane: Editor */}
          <div className="flex-1 flex flex-col bg-background relative overflow-hidden print:w-full print:bg-white print:text-black">
            {/* Print Layout */}
            <div className="hidden print:block space-y-12 p-12">
               <h1 className="text-4xl font-bold font-serif mb-8 text-center">{proposal.title}</h1>
               {proposal.sections.map((s: any) => (
                 <div key={s.id} className="break-inside-avoid">
                   <h2 className="text-2xl font-bold mb-4 font-serif border-b pb-2">{s.title}</h2>
                   <div className="whitespace-pre-wrap font-serif text-sm leading-relaxed">{s.content}</div>
                 </div>
               ))}
            </div>

            {/* Editor Layout (Hidden on Print) */}
            <div className="flex-1 flex flex-col p-6 print:hidden overflow-hidden">
               <div className="mb-4">
                 <h3 className="text-2xl font-bold text-foreground">{activeSection?.title}</h3>
               </div>
               <textarea 
                  value={editorContent}
                  onChange={handleEditorChange}
                  className="flex-1 w-full bg-card border border-border rounded-lg p-6 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
                  placeholder="Type section content here (Markdown supported)..."
               />
            </div>
          </div>

          {/* Right Pane: AI Assistant / Workflow (Hidden on Print) */}
          <div className="w-96 bg-card border-l border-border flex flex-col shrink-0 print:hidden overflow-y-auto">
             <div className="flex border-b border-border">
                <button 
                  onClick={() => setRightTab('AI')} 
                  className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 ${rightTab === 'AI' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-muted-foreground hover:bg-muted'}`}
                >
                  <Sparkles className="w-4 h-4" /> AI Assistant
                </button>
                <button 
                  onClick={() => setRightTab('WORKFLOW')} 
                  className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 ${rightTab === 'WORKFLOW' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-muted-foreground hover:bg-muted'}`}
                >
                  <GitBranch className="w-4 h-4" /> Workflow
                </button>
             </div>
             
             {rightTab === 'AI' && (
               <div className="p-4 flex-1 flex flex-col space-y-4 overflow-y-auto">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Instruct the AI to rewrite or refine the current section. Provide context like "make it more aggressive" or "include timeline milestones".
                  </p>
                  <div className="flex flex-col gap-2">
                     <textarea
                       value={aiInstruction}
                       onChange={e => setAiInstruction(e.target.value)}
                       placeholder="E.g., Rewrite this to emphasize our ISO 27001 compliance..."
                       className="w-full bg-background border border-border rounded-md p-3 text-sm h-32 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                     />
                     <button 
                       onClick={regenerateActiveSection}
                       disabled={aiGenerating || !aiInstruction}
                       className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-md transition-colors font-medium flex justify-center items-center gap-2 text-sm"
                     >
                       {aiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                       {aiGenerating ? 'Rewriting...' : 'Regenerate Section'}
                     </button>
                  </div>

                  {activeSection?.versionHistory && activeSection.versionHistory.length > 0 && (
                    <div className="mt-8">
                       <h4 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1 mb-3">
                         <History className="w-3 h-3" /> Version History
                       </h4>
                       <div className="space-y-3">
                         {activeSection.versionHistory.map((history: any, idx: number) => (
                           <div key={idx} className="bg-background border border-border rounded-md p-3 text-xs">
                              <span className="text-indigo-400 font-medium block mb-1">Prompt: "{history.prompt}"</span>
                              <span className="text-muted-foreground">Replaced {new Date(history.timestamp).toLocaleString()}</span>
                           </div>
                         ))}
                       </div>
                    </div>
                  )}
               </div>
             )}

             {rightTab === 'WORKFLOW' && (
               <WorkflowPanel 
                 proposalId={proposal.id} 
                 organizationId={proposal.organizationId} 
                 userId={proposal.ownerId || 'system'} 
               />
             )}
          </div>

        </div>
      )}
    </div>
  );
}
