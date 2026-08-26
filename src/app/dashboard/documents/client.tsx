'use client';

import { useState, useEffect, useCallback } from 'react';
import { DocumentUploadDropzone } from '@/components/documents/document-upload-dropzone';
import { WebScrapeModal } from '@/components/documents/WebScrapeModal';
import { DocumentList } from '@/components/documents/document-list';
import { Plus, X, Search, Loader2, Globe, FileText, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface DocumentsClientProps {
  organizationId: string;
  initialDocuments: any[];
}

type SearchMode = 'keyword' | 'fuzzy' | 'semantic';

interface CrossHit {
  chunkId: string;
  pageNumber: number;
  section: string;
  text: string;
  score: number;
  snippet?: string;
  highlightOffsets?: Array<{ start: number; end: number }>;
}

interface CrossDocResult {
  documentId: string;
  documentName: string;
  occurrences: number;
  pages: number[];
  hits: CrossHit[];
}

export function DocumentsClient({ organizationId, initialDocuments }: DocumentsClientProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isWebScrapeOpen, setIsWebScrapeOpen] = useState(false);

  // Cross-document search
  const [crossQuery, setCrossQuery] = useState('');
  const [crossMode, setCrossMode] = useState<SearchMode>('keyword');
  const [crossSearching, setCrossSearching] = useState(false);
  const [crossResults, setCrossResults] = useState<CrossDocResult[]>([]);
  const [totalOccurrences, setTotalOccurrences] = useState(0);
  const [showCrossSearch, setShowCrossSearch] = useState(false);

  useEffect(() => {
    const hasPendingJobs = initialDocuments.some(doc =>
      doc.scanStatus === 'PENDING' || doc.processingJob?.status === 'PENDING'
    );
    if (hasPendingJobs) {
      fetch('/api/jobs/process').then(res => res.json()).then(() => {
        router.refresh();
      }).catch(console.error);
    }
  }, [initialDocuments, router]);

  const handleUploadSuccess = () => { router.refresh(); };

  const runCrossSearch = useCallback(async () => {
    if (!crossQuery.trim()) return;
    setCrossSearching(true);
    setCrossResults([]);
    try {
      const res = await fetch(
        `/api/documents/search-across?q=${encodeURIComponent(crossQuery)}&mode=${crossMode}&limit=5&totalLimit=100`
      );
      const json = await res.json();
      if (json.success) {
        setCrossResults(json.results || []);
        setTotalOccurrences(json.totalOccurrences || 0);
      }
    } catch (_) {
    } finally {
      setCrossSearching(false);
    }
  }, [crossQuery, crossMode]);

  const highlight = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((p, i) =>
      p.toLowerCase() === query.toLowerCase()
        ? `<mark class="bg-amber-400/80 text-gray-900 rounded-sm px-0.5 font-semibold not-italic">${p}</mark>`
        : p
    ).join('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="p-8 max-w-6xl mx-auto space-y-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between tour-documents-header">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <FileText className="w-4 h-4 text-indigo-400" />
              </div>
              Document Vault
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {initialDocuments.length} document{initialDocuments.length !== 1 ? 's' : ''} · Upload, search, and analyze your organization's files
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCrossSearch(s => !s)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                showCrossSearch
                  ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                  : "bg-white/5 border-white/10 text-white/50 hover:text-white/70 hover:bg-white/8"
              )}
            >
              <Globe className="w-4 h-4" />
              Cross-Doc Search
            </button>
            <button
              onClick={() => setIsWebScrapeOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-500/40 text-cyan-300 text-sm font-semibold transition-all shadow-sm cursor-pointer"
              title="Ingest any live website or competitor domain via Firecrawl engine"
            >
              <Globe className="h-4 w-4 text-cyan-400" />
              <span>Ingest Web (Firecrawl)</span>
            </button>

            <button
              onClick={() => setIsUploading(!isUploading)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
            >
              {isUploading ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Upload File</>}
            </button>
          </div>
        </div>

        {/* ── Upload Panel ── */}
        {isUploading && (
          <div className="bg-[#111118] border border-white/8 rounded-xl p-6 shadow-lg">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              Upload New Documents
            </h2>
            <DocumentUploadDropzone
              organizationId={organizationId}
              onUploadSuccess={handleUploadSuccess}
            />
          </div>
        )}

        {/* ── Cross-Document Search Panel ── */}
        {showCrossSearch && (
          <div className="bg-[#111118] border border-indigo-500/20 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">Search Across All Documents</h2>
              <span className="ml-auto text-xs text-white/30">
                Find every occurrence of any term across your entire vault
              </span>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  value={crossQuery}
                  onChange={e => setCrossQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && runCrossSearch()}
                  placeholder='e.g. "indemnification" or "payment terms" ...'
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
                />
              </div>
              <div className="flex border border-white/10 rounded-lg overflow-hidden">
                {(['keyword', 'fuzzy', 'semantic'] as SearchMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setCrossMode(m)}
                    className={cn(
                      "px-3 py-2 text-xs font-medium transition-colors capitalize",
                      crossMode === m ? "bg-indigo-500/30 text-indigo-300" : "text-white/35 hover:text-white/60 bg-transparent"
                    )}
                  >
                    {m === 'semantic' ? '✦ AI' : m}
                  </button>
                ))}
              </div>
              <button
                onClick={runCrossSearch}
                disabled={crossSearching || !crossQuery.trim()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-sm font-semibold transition-colors"
              >
                {crossSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Search
              </button>
            </div>

            {/* Cross-search results */}
            {crossSearching && (
              <div className="flex items-center justify-center py-8 gap-3 text-white/40">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Searching across all documents...</span>
              </div>
            )}

            {!crossSearching && crossResults.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span className="text-amber-300 font-bold">{totalOccurrences}</span> total occurrences in
                  <span className="text-white font-bold">{crossResults.length}</span> documents
                </div>
                {crossResults.map(result => (
                  <div key={result.documentId} className="bg-white/3 border border-white/5 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                      <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                      <Link href={`/dashboard/documents/${result.documentId}`} className="flex-1">
                        <span className="text-sm font-semibold text-white hover:text-indigo-300 transition-colors">
                          {result.documentName}
                        </span>
                      </Link>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                          {result.occurrences} occurrence{result.occurrences !== 1 ? 's' : ''}
                        </span>
                        <div className="flex gap-1">
                          {result.pages.slice(0, 8).map(pg => (
                            <Link
                              key={pg}
                              href={`/dashboard/documents/${result.documentId}?page=${pg}&q=${encodeURIComponent(crossQuery)}`}
                            >
                              <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/35 transition-colors cursor-pointer font-mono text-xs">
                                p.{pg}
                              </span>
                            </Link>
                          ))}
                          {result.pages.length > 8 && (
                            <span className="text-white/25 px-1">+{result.pages.length - 8} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="divide-y divide-white/5">
                      {result.hits.slice(0, 3).map(hit => (
                        <div key={hit.chunkId} className="px-4 py-3 group">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-indigo-300 font-mono">p.{hit.pageNumber}</span>
                            {hit.section && hit.section !== 'General' && (
                              <span className="text-xs text-white/30">· {hit.section}</span>
                            )}
                          </div>
                          <p
                            className="text-xs text-white/55 leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: highlight(hit.snippet || hit.text.substring(0, 300), crossQuery)
                            }}
                          />
                          <Link
                            href={`/dashboard/documents/${result.documentId}?page=${hit.pageNumber}&q=${encodeURIComponent(crossQuery)}`}
                            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Go to page {hit.pageNumber}
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      ))}
                      {result.hits.length > 3 && (
                        <Link href={`/dashboard/documents/${result.documentId}?q=${encodeURIComponent(crossQuery)}`}>
                          <div className="px-4 py-2 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-white/3 transition-colors cursor-pointer flex items-center gap-1">
                            View all {result.hits.length} hits in this document
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!crossSearching && crossQuery && crossResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                <Search className="w-8 h-8 text-white/10" />
                <p className="text-sm text-white/30">No results across any documents</p>
                <p className="text-xs text-white/20">Try fuzzy or AI search mode</p>
              </div>
            )}
          </div>
        )}

        {/* ── Document List ── */}
        <div className="mt-4">
          <DocumentList documents={initialDocuments} />
        </div>
      </div>
      <WebScrapeModal
        isOpen={isWebScrapeOpen}
        onClose={() => setIsWebScrapeOpen(false)}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
