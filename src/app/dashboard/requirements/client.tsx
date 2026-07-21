'use client'

import { useState, useEffect, Suspense } from 'react';
import { 
  ClipboardList, Search, Loader2, Play, FileText, 
  AlertTriangle, ShieldCheck, DollarSign, Clock, CheckCircle, Database, Sparkles, Download
} from 'lucide-react';
import GapDashboard from './GapDashboard';
import DecisionDashboard from './DecisionDashboard';
import SummaryDashboard from './SummaryDashboard';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import dynamic from 'next/dynamic';

const ProposalEditor = dynamic(() => import('./ProposalEditor'), { ssr: false, loading: () => <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> });
const AgentWorkspace = dynamic(() => import('./AgentWorkspace'), { ssr: false, loading: () => <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> });
const ExportDialog = dynamic(() => import('@/components/ui/ExportDialog').then(mod => mod.ExportDialog), { ssr: false });

type Requirement = {
  id: string;
  text: string;
  category: string;
  priority: string;
  confidence: number;
  pageNumber: number | null;
  evidence: string;
  document: { name: string };
  coverageStatus: string | null;
  coverageScore: number | null;
  coverageEvidence: string | null;
  matchedDocumentIds: string[];
};

export default function RequirementsClient({ documents }: { documents: {id: string, name: string}[] }) {
  const [selectedDoc, setSelectedDoc] = useState<string>(documents[0]?.id || '');
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);
  const [viewMode, setViewMode] = useState<'AGENTS' | 'EXTRACTION' | 'COVERAGE' | 'GAPS' | 'DECISION' | 'SUMMARY' | 'PROPOSAL'>('AGENTS');
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    if (selectedDoc) {
      fetchRequirements();
      setSelectedReq(null);
    }
  }, [selectedDoc, categoryFilter]);

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/requirements?documentId=${selectedDoc}&category=${categoryFilter}`);
      const data = await res.json();
      if (data.success) {
        setRequirements(data.requirements);
        if (selectedReq) {
          const updatedReq = data.requirements.find((r: any) => r.id === selectedReq.id);
          if (updatedReq) setSelectedReq(updatedReq);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExtract = async () => {
    if (!selectedDoc) return;
    setExtracting(true);
    try {
      const res = await fetch('/api/requirements/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: selectedDoc })
      });
      const data = await res.json();
      if (data.success) {
        fetchRequirements();
      } else {
        alert("Extraction failed: " + data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setExtracting(false);
    }
  };

  const handleCoverage = async () => {
    if (!selectedDoc) return;
    setAnalyzing(true);
    try {
      const res = await fetch('/api/requirements/coverage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: selectedDoc })
      });
      const data = await res.json();
      if (data.success) {
        fetchRequirements();
        setViewMode('COVERAGE');
      } else {
        alert("Coverage analysis failed: " + data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const filteredRequirements = requirements.filter(req => 
    req.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'HIGH': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'LOW': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-white/5 text-white/50 border-white/10';
    }
  };

  const getCoverageColor = (status: string | null) => {
    switch (status) {
      case 'COVERED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'PARTIALLY_COVERED': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'MISSING': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'UNKNOWN': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-white/5 text-white/50 border-white/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SECURITY': return <ShieldCheck className="w-4 h-4" />;
      case 'FINANCIAL': return <DollarSign className="w-4 h-4" />;
      case 'TIMELINE': return <Clock className="w-4 h-4" />;
      case 'RISK': return <AlertTriangle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-14rem)] print:h-auto print:block">
      {/* Main Table Area */}
      <div className="lg:col-span-8 flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-sm print:border-none print:shadow-none print:bg-transparent">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-border bg-muted/20 flex flex-wrap gap-4 items-center justify-between print:hidden">
          <div className="flex gap-4 items-center flex-1 overflow-x-auto pb-1 custom-scrollbar">
            <select 
              className="bg-background border border-input rounded-md px-3 py-2 text-sm max-w-[200px]"
              value={selectedDoc}
              onChange={e => setSelectedDoc(e.target.value)}
            >
              {documents.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            
            <div className="flex bg-muted/50 rounded-lg p-1 border border-border overflow-x-auto custom-scrollbar">
              <button 
                onClick={() => setViewMode('AGENTS')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex-shrink-0 flex items-center gap-2 ${viewMode === 'AGENTS' ? 'bg-indigo-500 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Agent Workspace
              </button>
              <div className="w-px h-6 bg-border mx-1 self-center hidden md:block flex-shrink-0"></div>
              <button 
                onClick={() => setViewMode('EXTRACTION')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex-shrink-0 ${viewMode === 'EXTRACTION' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Extraction
              </button>
              <button 
                onClick={() => setViewMode('COVERAGE')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex-shrink-0 ${viewMode === 'COVERAGE' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Coverage Matrix
              </button>
              <button 
                onClick={() => setViewMode('GAPS')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex-shrink-0 ${viewMode === 'GAPS' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Gap Analysis
              </button>
              <button 
                onClick={() => setViewMode('DECISION')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex-shrink-0 ${viewMode === 'DECISION' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Decision Workspace
              </button>
              <button 
                onClick={() => setViewMode('SUMMARY')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex-shrink-0 ${viewMode === 'SUMMARY' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Executive Summary
              </button>
              <button 
                onClick={() => setViewMode('PROPOSAL')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex-shrink-0 ${viewMode === 'PROPOSAL' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Proposal Editor
              </button>
            </div>

            <div className="flex gap-2 ml-auto flex-shrink-0">
              {viewMode === 'EXTRACTION' ? (
                <button 
                  onClick={handleExtract}
                  disabled={extracting || !selectedDoc}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {extracting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  {extracting ? 'Extracting...' : 'Extract'}
                </button>
              ) : (
                <button 
                  onClick={handleCoverage}
                  disabled={analyzing || !selectedDoc || requirements.length === 0}
                  className="bg-indigo-500 text-white hover:bg-indigo-600 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                  {analyzing ? 'Analyzing...' : 'Run Coverage Analysis'}
                </button>
              )}
              
              {selectedDoc && (
                <button 
                  onClick={() => setIsExportOpen(true)}
                  className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 border border-border"
                >
                  <Download className="w-4 h-4" /> Export
                </button>
              )}
            </div>
          </div>
        </div>

        <ErrorBoundary fallback={<div className="p-8 text-red-500">Workspace crashed. Please refresh or select a different tool.</div>}>
          <Suspense fallback={<div className="p-8 flex items-center justify-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading workspace...</div>}>
            {viewMode === 'AGENTS' ? (
              <div className="flex-1 overflow-hidden bg-background">
                <AgentWorkspace documentId={selectedDoc} onComplete={() => setViewMode('PROPOSAL')} />
              </div>
            ) : viewMode === 'PROPOSAL' ? (
              <div className="flex-1 overflow-hidden bg-background print:overflow-visible">
                <ProposalEditor documentId={selectedDoc} />
              </div>
            ) : viewMode === 'DECISION' ? (
              <div className="flex-1 overflow-y-auto bg-background p-6">
                <DecisionDashboard documentId={selectedDoc} />
              </div>
            ) : viewMode === 'SUMMARY' ? (
              <div className="flex-1 overflow-y-auto bg-background p-6">
                <SummaryDashboard documentId={selectedDoc} />
              </div>
            ) : viewMode === 'GAPS' ? (
              <div className="flex-1 overflow-y-auto bg-background p-6">
                <GapDashboard documentId={selectedDoc} />
              </div>
            ) : null}
          </Suspense>
        </ErrorBoundary>

        {viewMode !== 'AGENTS' && viewMode !== 'GAPS' && viewMode !== 'DECISION' && viewMode !== 'SUMMARY' && viewMode !== 'PROPOSAL' && (
          <>
            {/* Filters */}
        <div className="p-3 border-b border-border bg-card flex gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search text..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-background border border-input rounded-md text-sm w-full focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            className="bg-background border border-input rounded-md px-3 py-1.5 text-sm"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="FUNCTIONAL">Functional</option>
            <option value="TECHNICAL">Technical</option>
            <option value="COMPLIANCE">Compliance</option>
            <option value="SECURITY">Security</option>
            <option value="FINANCIAL">Financial</option>
            <option value="TIMELINE">Timeline</option>
            <option value="RISK">Risk</option>
          </select>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          {loading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : filteredRequirements.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <ClipboardList className="w-12 h-12 mb-4 opacity-20" />
              <p>No requirements found.</p>
              <p className="text-sm opacity-60">Click "Extract" to analyze this document.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/40 sticky top-0 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-3 font-medium">Requirement</th>
                  {viewMode === 'EXTRACTION' ? (
                    <>
                      <th className="px-6 py-3 font-medium">Category</th>
                      <th className="px-6 py-3 font-medium">Priority</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 font-medium">Coverage</th>
                      <th className="px-6 py-3 font-medium">Score</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRequirements.map(req => (
                  <tr 
                    key={req.id} 
                    onClick={() => setSelectedReq(req)}
                    className={`hover:bg-muted/30 cursor-pointer transition-colors ${selectedReq?.id === req.id ? 'bg-primary/5 border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'}`}
                  >
                    <td className="px-6 py-4">
                      <p className="line-clamp-2 text-foreground font-medium">{req.text}</p>
                    </td>
                    
                    {viewMode === 'EXTRACTION' ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            {getCategoryIcon(req.category)}
                            {req.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider ${getPriorityColor(req.priority)}`}>
                            {req.priority}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {req.coverageStatus ? (
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider ${getCoverageColor(req.coverageStatus)}`}>
                              {req.coverageStatus.replace('_', ' ')}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs italic">Unanalyzed</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {req.coverageScore !== null ? (
                            <span className="font-bold text-foreground">{req.coverageScore}%</span>
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        </>
        )}
      </div>

      {viewMode !== 'AGENTS' && viewMode !== 'GAPS' && viewMode !== 'DECISION' && viewMode !== 'SUMMARY' && viewMode !== 'PROPOSAL' && (
      <div className="lg:col-span-4 bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col">
        <div className="p-4 border-b border-border bg-muted/20">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> {viewMode === 'EXTRACTION' ? 'Extraction Evidence' : 'Coverage Evidence'}
          </h2>
        </div>
        
        {selectedReq ? (
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 animate-in slide-in-from-right-4">
            
            <div>
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Requirement</h3>
              <p className="text-sm font-medium leading-relaxed">{selectedReq.text}</p>
            </div>

            {viewMode === 'EXTRACTION' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-3 rounded-lg border border-border">
                    <span className="text-[10px] uppercase text-muted-foreground font-semibold">AI Confidence</span>
                    <p className="text-lg font-display font-bold text-emerald-500">{selectedReq.confidence}%</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border">
                    <span className="text-[10px] uppercase text-muted-foreground font-semibold">Page Number</span>
                    <p className="text-lg font-display font-bold">{selectedReq.pageNumber || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Source Quote</h3>
                  <div className="bg-[#050508] p-4 rounded-xl border border-white/5 relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-xl"></div>
                    <p className="text-xs text-white/70 italic leading-relaxed pl-2 font-serif">
                      "{selectedReq.evidence}"
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-3 rounded-lg border border-border">
                    <span className="text-[10px] uppercase text-muted-foreground font-semibold">Coverage</span>
                    <p className={`text-sm mt-1 font-bold ${selectedReq.coverageStatus === 'MISSING' ? 'text-red-500' : 'text-emerald-500'}`}>
                      {selectedReq.coverageStatus ? selectedReq.coverageStatus.replace('_', ' ') : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border">
                    <span className="text-[10px] uppercase text-muted-foreground font-semibold">Match Score</span>
                    <p className="text-lg font-display font-bold">{selectedReq.coverageScore ?? 0}%</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">AI Analysis</h3>
                  <div className="bg-[#050508] p-4 rounded-xl border border-white/5 relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-xl"></div>
                    <p className="text-xs text-white/70 italic leading-relaxed pl-2 font-serif">
                      {selectedReq.coverageEvidence || "Run Coverage Analysis to generate evidence."}
                    </p>
                  </div>
                </div>

                {selectedReq.matchedDocumentIds && selectedReq.matchedDocumentIds.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Matched Documents</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedReq.matchedDocumentIds.map((doc, idx) => (
                        <span key={idx} className="bg-white/5 border border-white/10 px-2 py-1 rounded text-xs text-muted-foreground flex items-center gap-1">
                          <Database className="w-3 h-3" /> {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
            <Search className="w-8 h-8 mb-4 opacity-20" />
            <p className="text-sm">Select a requirement from the table to view the exact text and evidence.</p>
          </div>
        )}
      </div>
      )}
      {/* Print Footer */}
      <div className="hidden print:flex fixed bottom-0 left-0 right-0 justify-center text-[10px] text-gray-500 py-4 bg-white z-50 text-center font-medium">
        Synaps - Sisyphus Ventures - AI can make mistakes
      </div>

      <ExportDialog 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
        documentId={selectedDoc}
        defaultType={viewMode === 'PROPOSAL' ? 'PROPOSAL' : viewMode === 'GAPS' ? 'GAP_ANALYSIS' : viewMode === 'DECISION' ? 'DECISION_REPORT' : viewMode === 'SUMMARY' ? 'EXECUTIVE_SUMMARY' : 'COMPLIANCE_REPORT'}
      />
    </div>
  );
}
