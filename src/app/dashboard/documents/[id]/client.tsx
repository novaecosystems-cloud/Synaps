'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search, BookOpen, ChevronLeft, ChevronRight, Download, RefreshCw,
  GitCompare, Layers, Lock, ExternalLink, Info, Loader2, X,
  Building2, Users, MapPin, Calendar, DollarSign, Mail, Percent,
  Tag, AlignLeft, FileText, Hash, ArrowRight, Sparkles, Zap,
  AlertTriangle, CheckCircle2, Target, List, ChevronDown, ChevronUp,
  CornerDownRight, Globe, ScanLine, Filter, BookMarked, Eye, Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ClientProps {
  documentId: string;
  documentName: string;
  detectedType: string;
  pageCount: number;
  allDocs: { id: string; name: string }[];
  initialPage?: number;
  initialQuery?: string;
}

interface SearchHit {
  chunkId: string;
  pageNumber: number;
  section: string;
  text: string;
  score: number;
  matchType: string;
  highlightOffsets?: Array<{ start: number; end: number }>;
  snippet?: string;
}

interface PageData {
  pageNumber: number;
  text: string;
  sections: string[];
  chunkCount: number;
}

interface EntityData {
  people: Array<{ name: string; count: number }>;
  organizations: Array<{ name: string; count: number }>;
  locations: Array<{ name: string; count: number }>;
  dates: Array<{ value: string; count: number }>;
  monetary: Array<{ value: string; count: number }>;
  emails: string[];
  percentages: string[];
  keyTerms: Array<{ term: string; count: number }>;
  tableOfContents: Array<{ title: string; pageNumber: number }>;
  stats: { totalChunks: number; totalCharacters: number; estimatedReadingTime: number };
}

type SidePanel = 'search' | 'entities' | 'toc' | 'reader' | 'agent' | null;
type SearchMode = 'keyword' | 'fuzzy' | 'semantic';

export default function DocumentReaderClient({
  documentId,
  documentName,
  detectedType,
  pageCount: initialPageCount,
  allDocs,
  initialPage = 1,
  initialQuery = ''
}: ClientProps) {
  // Page navigation
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageCount, setPageCount] = useState(initialPageCount);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [pageLoading, setPageLoading] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchMode, setSearchMode] = useState<SearchMode>('keyword');
  const [searchHits, setSearchHits] = useState<SearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [totalOccurrences, setTotalOccurrences] = useState(0);
  const [pagesWithHits, setPagesWithHits] = useState<number[]>([]);
  const [activeHitIdx, setActiveHitIdx] = useState(0);

  // Entities
  const [entities, setEntities] = useState<EntityData | null>(null);
  const [entitiesLoading, setEntitiesLoading] = useState(false);

  // Panels
  const [sidePanel, setSidePanel] = useState<SidePanel>('search');

  // Intelligence (existing)
  const [intelligence, setIntelligence] = useState<any | null>(null);
  const [intelligenceLoading, setIntelligenceLoading] = useState(true);

  // Compare
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareDocId, setCompareDocId] = useState('');
  const [compareLoading, setCompareLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any | null>(null);
  // Phase 2 Agent State
  const [agentGoal, setAgentGoal] = useState('');
  const [agentRunning, setAgentRunning] = useState(false);
  const [agentResult, setAgentResult] = useState<any | null>(null);

  const handleRunAgentGoal = async (goalStr?: string) => {
    const prompt = goalStr || agentGoal;
    if (!prompt.trim()) return;
    setAgentRunning(true);
    setAgentResult(null);
    try {
      const isResearchQuery = /research|case|court|judg\w+|affect\s+this\s+contract|similar\s+cases|concern\s+management|company\s+background|publicly\s+available|benchmark/i.test(prompt);
      const endpoint = isResearchQuery ? '/api/agent/research' : '/api/agent/document';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: prompt, query: prompt, documentId })
      });
      const json = await res.json();
      if (json.success) {
        setAgentResult({
          ...json,
          answer: json.answer || json.synthesisAnswer,
          citations: json.citations || json.internalCitations,
          webSources: json.externalCitations
        });
        // Check if agent mentioned a page to navigate to
        const pageMatch = (json.answer || json.synthesisAnswer || '').match(/\[[^\]]+,\s*p\.(\d+)\]/);
        if (pageMatch) {
          const pg = parseInt(pageMatch[1], 10);
          if (!isNaN(pg)) {
            setCurrentPage(pg);
            fetchPage(pg);
          }
        }
      }
    } catch (e) {
      console.error("Agent execution failed:", e);
    } finally {
      setAgentRunning(false);
    }
  };

  const searchInputRef = useRef<HTMLInputElement>(null);
  const pageTextRef = useRef<HTMLDivElement>(null);

  // ── Fetch page content ──────────────────────────────────────────────────
  const fetchPage = useCallback(async (pg: number) => {
    setPageLoading(true);
    try {
      const res = await fetch(`/api/documents/${documentId}/pages?page=${pg}`);
      const json = await res.json();
      if (json.success && json.pages?.length > 0) {
        setPageData(json.pages[0]);
        setPageCount(json.pageCount || initialPageCount);
      } else {
        setPageData(null);
      }
    } catch (_) {
      setPageData(null);
    } finally {
      setPageLoading(false);
    }
  }, [documentId, initialPageCount]);

  // ── Fetch entities on mount ─────────────────────────────────────────────
  const fetchEntities = useCallback(async () => {
    setEntitiesLoading(true);
    try {
      const res = await fetch(`/api/documents/${documentId}/entities`);
      const json = await res.json();
      if (json.success) setEntities(json);
    } catch (_) {}
    finally { setEntitiesLoading(false); }
  }, [documentId]);

  // ── Search handler (declared before useEffect so it can be called on mount) ──
  const handleSearch = useCallback(async (query: string, mode: SearchMode) => {
    if (!query.trim()) {
      setSearchHits([]);
      setPagesWithHits([]);
      setTotalOccurrences(0);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `/api/documents/${documentId}/search?q=${encodeURIComponent(query)}&mode=${mode}&limit=100`
      );
      const json = await res.json();
      if (json.success) {
        setSearchHits(json.hits || []);
        setPagesWithHits(json.pagesWithHits || []);
        setTotalOccurrences(json.totalOccurrences || 0);
        setActiveHitIdx(0);
        if (json.hits?.length > 0) {
          const firstPage = json.hits[0].pageNumber;
          setCurrentPage(firstPage);
          fetchPage(firstPage);
        }
      }
    } catch (_) {}
    finally { setSearching(false); }
  }, [documentId, fetchPage]);

  // ── Fetch intelligence ──────────────────────────────────────────────────
  useEffect(() => {
    async function fetchIntelligence() {
      try {
        const res = await fetch(`/api/documents/${documentId}/intelligence`);
        const json = await res.json();
        if (json.success) setIntelligence(json.data);
      } catch (_) {}
      finally { setIntelligenceLoading(false); }
    }
    fetchIntelligence();
    fetchEntities();
    fetchPage(initialPage);

    // Auto-search if query is pre-loaded from URL (use setTimeout to avoid
    // calling handleSearch before state is ready)
    if (initialQuery) {
      setTimeout(() => {
        handleSearch(initialQuery, 'keyword');
        setSidePanel('search');
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  // Keep handleSearch stable in refs for the setTimeout above


  // ── Navigate to a search hit ────────────────────────────────────────────
  const goToHit = useCallback((hit: SearchHit, idx: number) => {
    setActiveHitIdx(idx);
    setCurrentPage(hit.pageNumber);
    fetchPage(hit.pageNumber);
    setTimeout(() => {
      pageTextRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }, [fetchPage]);

  // ── Navigate to a page ──────────────────────────────────────────────────
  const goToPage = useCallback((pg: number) => {
    const target = Math.max(1, Math.min(pageCount, pg));
    setCurrentPage(target);
    fetchPage(target);
  }, [pageCount, fetchPage]);

  // ── Navigate hit arrows ─────────────────────────────────────────────────
  const prevHit = () => {
    const idx = Math.max(0, activeHitIdx - 1);
    setActiveHitIdx(idx);
    goToHit(searchHits[idx], idx);
  };
  const nextHit = () => {
    const idx = Math.min(searchHits.length - 1, activeHitIdx + 1);
    setActiveHitIdx(idx);
    goToHit(searchHits[idx], idx);
  };

  // ── Render highlighted text ─────────────────────────────────────────────
  const renderHighlightedText = (text: string, hits: SearchHit[]) => {
    if (!searchQuery || hits.length === 0) {
      return <span>{text}</span>;
    }
    // Find any hit for this page
    const pageHit = hits.find(h => h.text === text && h.highlightOffsets?.length);
    if (!pageHit?.highlightOffsets?.length) {
      // Simple highlight via regex
      const parts = text.split(new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
      return (
        <>
          {parts.map((part, i) =>
            part.toLowerCase() === searchQuery.toLowerCase()
              ? <mark key={i} className="bg-amber-400/80 text-gray-900 rounded-sm px-0.5 font-semibold">{part}</mark>
              : <span key={i}>{part}</span>
          )}
        </>
      );
    }
    // Use precise offsets
    const result: React.ReactNode[] = [];
    let cursor = 0;
    for (const off of pageHit.highlightOffsets) {
      if (off.start > cursor) result.push(<span key={cursor}>{text.substring(cursor, off.start)}</span>);
      result.push(
        <mark key={off.start} className="bg-amber-400/80 text-gray-900 rounded-sm px-0.5 font-semibold">
          {text.substring(off.start, off.end)}
        </mark>
      );
      cursor = off.end;
    }
    if (cursor < text.length) result.push(<span key={cursor}>{text.substring(cursor)}</span>);
    return <>{result}</>;
  };

  // ── Get current page hits ───────────────────────────────────────────────
  const currentPageHits = searchHits.filter(h => h.pageNumber === currentPage);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full min-h-screen bg-[#0a0a0f] text-white font-sans">

      {/* ── LEFT SIDEBAR: Search + Navigation ────────────────────────────────── */}
      <aside className="w-80 shrink-0 border-r border-white/5 flex flex-col bg-[#0d0d14]">
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-sm font-semibold text-white/90 truncate">{documentName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">{detectedType}</span>
            <span>{pageCount} pages</span>
            {entities?.stats && (
              <span>~{entities.stats.estimatedReadingTime}min read</span>
            )}
          </div>
        </div>

        {/* Panel selector tabs */}
        <div className="flex border-b border-white/5">
          {[
            { id: 'search' as SidePanel, icon: Search, label: 'Search' },
            { id: 'agent' as SidePanel, icon: Sparkles, label: 'AI Agent' },
            { id: 'toc' as SidePanel, icon: List, label: 'Contents' },
            { id: 'entities' as SidePanel, icon: Tag, label: 'Entities' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSidePanel(sidePanel === tab.id ? null : tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2 text-xs transition-colors",
                sidePanel === tab.id
                  ? "text-indigo-400 border-b-2 border-indigo-400 font-semibold"
                  : "text-white/40 hover:text-white/60"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── SEARCH PANEL ── */}
        {sidePanel === 'search' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-white/5 space-y-2">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch(searchQuery, searchMode)}
                  placeholder='Search document... (Enter)'
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-8 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setSearchHits([]); setPagesWithHits([]); }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mode selector */}
              <div className="flex gap-1">
                {(['keyword', 'fuzzy', 'semantic'] as SearchMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setSearchMode(m)}
                    className={cn(
                      "flex-1 py-1 rounded text-xs font-medium transition-colors capitalize",
                      searchMode === m
                        ? "bg-indigo-500/30 text-indigo-300 border border-indigo-500/30"
                        : "text-white/35 hover:text-white/55 border border-transparent"
                    )}
                  >
                    {m === 'semantic' ? '✦ AI' : m}
                  </button>
                ))}
              </div>

              {/* Search button */}
              <button
                onClick={() => handleSearch(searchQuery, searchMode)}
                disabled={searching || !searchQuery.trim()}
                className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Search results */}
            {searchHits.length > 0 && (
              <>
                {/* Stats bar */}
                <div className="flex items-center justify-between px-3 py-2 bg-amber-500/10 border-b border-amber-500/20">
                  <span className="text-xs text-amber-300">
                    <span className="font-bold">{totalOccurrences}</span> occurrences · <span className="font-bold">{pagesWithHits.length}</span> pages
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={prevHit}
                      disabled={activeHitIdx === 0}
                      className="p-1 rounded hover:bg-white/10 disabled:opacity-30"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs text-white/40 min-w-[40px] text-center">
                      {activeHitIdx + 1}/{searchHits.length}
                    </span>
                    <button
                      onClick={nextHit}
                      disabled={activeHitIdx === searchHits.length - 1}
                      className="p-1 rounded hover:bg-white/10 disabled:opacity-30"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Hit list */}
                <div className="flex-1 overflow-y-auto">
                  {searchHits.map((hit, idx) => (
                    <button
                      key={hit.chunkId}
                      onClick={() => goToHit(hit, idx)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 border-b border-white/5 hover:bg-white/5 transition-colors",
                        idx === activeHitIdx && "bg-indigo-500/10 border-l-2 border-l-indigo-500"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-1.5 py-0.5 rounded text-xs bg-indigo-500/20 text-indigo-300 font-mono shrink-0">
                          p.{hit.pageNumber}
                        </span>
                        {hit.section && hit.section !== 'General' && (
                          <span className="text-xs text-white/35 truncate">{hit.section}</span>
                        )}
                      </div>
                      <p className="text-xs text-white/60 line-clamp-3 leading-relaxed">
                        {buildSnippetText(hit.text, searchQuery)}
                      </p>
                      {hit.highlightOffsets && hit.highlightOffsets.length > 1 && (
                        <span className="text-xs text-amber-400/70 mt-0.5 block">
                          {hit.highlightOffsets.length} occurrences on this chunk
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}

            {searchHits.length === 0 && searchQuery && !searching && (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4 text-center">
                <Search className="w-8 h-8 text-white/10" />
                <p className="text-sm text-white/30">No results found</p>
                <p className="text-xs text-white/20">Try fuzzy or AI semantic search</p>
              </div>
            )}

            {!searchQuery && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  <Search className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/60">Document Search</p>
                  <p className="text-xs text-white/25 mt-1">
                    Find any term across all {pageCount} pages.<br />
                    Click a result to jump to the exact page.
                  </p>
                </div>
                <div className="text-xs text-white/20 space-y-1 text-left w-full bg-white/3 rounded-lg p-3">
                  <p><kbd className="text-indigo-400">keyword</kbd> — exact match</p>
                  <p><kbd className="text-indigo-400">fuzzy</kbd> — near match</p>
                  <p><kbd className="text-indigo-400">✦ AI</kbd> — semantic meaning</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TABLE OF CONTENTS PANEL ── */}
        {sidePanel === 'toc' && (
          <div className="flex-1 overflow-y-auto">
            {entitiesLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
              </div>
            ) : entities?.tableOfContents?.length ? (
              <div className="py-2">
                {entities.tableOfContents.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(item.pageNumber)}
                    className="w-full text-left px-3 py-2 hover:bg-white/5 flex items-center gap-2.5 group transition-colors"
                  >
                    <span className="text-xs text-indigo-400 font-mono w-8 shrink-0">p.{item.pageNumber}</span>
                    <span className="text-xs text-white/60 group-hover:text-white/80 truncate">{item.title}</span>
                    <CornerDownRight className="w-3 h-3 text-white/20 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
                <List className="w-8 h-8 text-white/10" />
                <p className="text-xs text-white/30">
                  No sections detected yet.<br />
                  Process the document to extract structure.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── ENTITIES PANEL ── */}
        {sidePanel === 'entities' && (
          <div className="flex-1 overflow-y-auto">
            {entitiesLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
              </div>
            ) : entities ? (
              <div className="py-2 space-y-0">
                <EntityGroup
                  icon={Users}
                  label="People"
                  color="blue"
                  items={entities.people.map(p => ({ label: p.name, badge: `×${p.count}` }))}
                  onItemClick={name => { setSearchQuery(name); handleSearch(name, 'keyword'); setSidePanel('search'); }}
                />
                <EntityGroup
                  icon={Building2}
                  label="Organizations"
                  color="purple"
                  items={entities.organizations.map(o => ({ label: o.name, badge: `×${o.count}` }))}
                  onItemClick={name => { setSearchQuery(name); handleSearch(name, 'keyword'); setSidePanel('search'); }}
                />
                <EntityGroup
                  icon={DollarSign}
                  label="Monetary Values"
                  color="green"
                  items={entities.monetary.map(m => ({ label: m.value, badge: `×${m.count}` }))}
                  onItemClick={val => { setSearchQuery(val); handleSearch(val, 'keyword'); setSidePanel('search'); }}
                />
                <EntityGroup
                  icon={Calendar}
                  label="Dates"
                  color="amber"
                  items={entities.dates.map(d => ({ label: d.value, badge: `×${d.count}` }))}
                  onItemClick={val => { setSearchQuery(val); handleSearch(val, 'keyword'); setSidePanel('search'); }}
                />
                <EntityGroup
                  icon={Tag}
                  label="Key Legal Terms"
                  color="red"
                  items={entities.keyTerms.slice(0, 15).map(t => ({ label: t.term, badge: `×${t.count}` }))}
                  onItemClick={term => { setSearchQuery(term); handleSearch(term, 'keyword'); setSidePanel('search'); }}
                />
                {entities.emails.length > 0 && (
                  <EntityGroup
                    icon={Mail}
                    label="Emails"
                    color="cyan"
                    items={entities.emails.map(e => ({ label: e, badge: '' }))}
                    onItemClick={e => { setSearchQuery(e); handleSearch(e, 'keyword'); setSidePanel('search'); }}
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
                <ScanLine className="w-8 h-8 text-white/10" />
                <p className="text-xs text-white/30">Entities will appear once the document is processed.</p>
              </div>
            )}
          </div>
        )}

        {/* ── AGENT PANEL (Phase 2) ── */}
        {sidePanel === 'agent' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-white/5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Document Intelligence Agent
              </div>
              <div className="relative">
                <textarea
                  rows={3}
                  value={agentGoal}
                  onChange={e => setAgentGoal(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleRunAgentGoal();
                    }
                  }}
                  placeholder='Ask agent e.g. "Go to page 2 and find termination clause" or "What are the biggest risks?"'
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50 resize-none"
                />
              </div>

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap gap-1">
                {[
                  'Research ABC v XYZ & impact on this contract',
                  'Find termination clause & page',
                  'Find similar cases & public examples',
                  'Research company background & risks'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setAgentGoal(chip); handleRunAgentGoal(chip); }}
                    className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-300 rounded px-2 py-0.5 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleRunAgentGoal()}
                disabled={agentRunning || !agentGoal.trim()}
                className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-semibold flex items-center justify-center gap-2 transition-colors text-white"
              >
                {agentRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : <Sparkles className="w-3.5 h-3.5 text-white" />}
                {agentRunning ? 'Agent Reasoning...' : 'Run Agent Research'}
              </button>
            </div>

            {/* Agent execution log & results */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {agentRunning && (
                <div className="flex flex-col items-center justify-center py-8 gap-2 text-white/40">
                  <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                  <p className="text-xs">Reasoning Agent is searching Web + Vault Documents...</p>
                </div>
              )}

              {agentResult && (
                <div className="space-y-3">
                  {/* Tool steps log */}
                  {agentResult.toolSteps?.length > 0 && (
                    <div className="bg-white/3 border border-white/5 rounded-lg p-2 space-y-1.5">
                      <div className="text-[10px] text-white/40 font-mono flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-indigo-400" /> Tool Steps Executed ({agentResult.toolSteps.length})
                      </div>
                      {agentResult.toolSteps.map((step: any, idx: number) => (
                        <div key={idx} className="text-[11px] bg-black/40 rounded p-1.5 text-white/60 font-mono">
                          {step.action && (
                            <span className="text-amber-400 font-bold block">⚙ {step.action}</span>
                          )}
                          <p className="line-clamp-2 text-white/50">{step.thought}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Agent final answer */}
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 space-y-2">
                    <div className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Evidence-Backed Answer
                    </div>
                    <div className="text-xs text-white/80 leading-relaxed whitespace-pre-wrap font-sans">
                      {agentResult.answer}
                    </div>
                  </div>

                  {/* Internal Page Citations */}
                  {agentResult.citations?.length > 0 && (
                    <div className="bg-white/3 border border-white/5 rounded-lg p-2.5 space-y-1">
                      <div className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">Document Citations</div>
                      <div className="flex flex-wrap gap-1">
                        {agentResult.citations.map((c: any, i: number) => (
                          <button
                            key={i}
                            onClick={() => goToPage(c.pageNumber)}
                            className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-mono transition-colors"
                          >
                            [{c.documentName}, p.{c.pageNumber}]
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* External Web Citations */}
                  {agentResult.webSources?.length > 0 && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2.5 space-y-1">
                      <div className="text-[10px] text-blue-300 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <Globe className="w-3 h-3 text-blue-400" /> Web Sources ({agentResult.webSources.length})
                      </div>
                      <div className="space-y-1">
                        {agentResult.webSources.map((s: any, i: number) => (
                          <a
                            key={i}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-300 hover:underline flex items-center gap-1 truncate"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            {s.title || s.url}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Identified Contract Risks */}
                  {agentResult.risks?.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 space-y-1">
                      <div className="text-[10px] text-red-300 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-400" /> Contract Risks ({agentResult.risks.length})
                      </div>
                      {agentResult.risks.map((r: any, i: number) => (
                        <div key={i} className="text-xs text-white/70 border-b border-red-500/10 pb-1 last:border-none">
                          <span className="text-red-400 font-bold">[{r.severity}]</span> {r.explanation}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!agentRunning && !agentResult && (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                  <Sparkles className="w-8 h-8 text-white/10" />
                  <p className="text-xs text-white/40 font-semibold">Document Agent Ready</p>
                  <p className="text-[11px] text-white/25 max-w-[200px]">
                    Ask complex questions. The agent executes page tools, extracts clauses, detects risks, and provides evidence citations.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* ── MAIN CONTENT AREA ──────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#0d0d14] shrink-0">
          <Link href="/dashboard/documents">
            <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" />
              Documents
            </button>
          </Link>

          <div className="h-4 w-px bg-white/10" />

          {/* Page navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1 || pageLoading}
              className="p-1.5 rounded-lg hover:bg-white/8 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-white/40">Page</span>
              <input
                type="number"
                value={currentPage}
                min={1}
                max={pageCount}
                onChange={e => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v)) setCurrentPage(v);
                }}
                onBlur={e => goToPage(parseInt(e.target.value, 10))}
                onKeyDown={e => e.key === 'Enter' && goToPage(parseInt((e.target as HTMLInputElement).value, 10))}
                className="w-14 text-center bg-white/5 border border-white/10 rounded py-1 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              />
              <span className="text-xs text-white/40">of {pageCount}</span>
            </div>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= pageCount || pageLoading}
              className="p-1.5 rounded-lg hover:bg-white/8 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Hit navigation */}
          {searchHits.length > 0 && (
            <>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/15 rounded-lg border border-amber-500/20">
                  <span className="text-xs text-amber-300 font-semibold">{totalOccurrences}</span>
                  <span className="text-xs text-amber-400/70">hits</span>
                </div>
                <button
                  onClick={prevHit}
                  disabled={activeHitIdx === 0}
                  className="p-1.5 rounded hover:bg-white/8 disabled:opacity-30"
                  title="Previous hit"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={nextHit}
                  disabled={activeHitIdx === searchHits.length - 1}
                  className="p-1.5 rounded hover:bg-white/8 disabled:opacity-30"
                  title="Next hit"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          <div className="ml-auto flex items-center gap-2">
            {/* Pages with hits indicator */}
            {pagesWithHits.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-white/35">
                <BookMarked className="w-3.5 h-3.5" />
                <span>{pagesWithHits.length} pages match</span>
              </div>
            )}
            <button
              onClick={() => setCompareModalOpen(true)}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 px-2.5 py-1.5 rounded-lg hover:bg-white/5 border border-white/8 transition-colors"
            >
              <GitCompare className="w-3.5 h-3.5" />
              Compare
            </button>
            <Link href={`/api/documents/${documentId}/download`} target="_blank">
              <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 px-2.5 py-1.5 rounded-lg hover:bg-white/5 border border-white/8 transition-colors">
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </Link>
          </div>
        </div>

        {/* Page mini-map: show which pages have search hits */}
        {pagesWithHits.length > 0 && pageCount > 0 && (
          <div className="px-4 py-1.5 border-b border-white/5 flex items-center gap-2 bg-[#0a0a10]">
            <span className="text-xs text-white/25 shrink-0">Hit pages:</span>
            <div className="flex-1 overflow-x-auto">
              <div className="flex gap-1">
                {pagesWithHits.slice(0, 50).map(pg => (
                  <button
                    key={pg}
                    onClick={() => goToPage(pg)}
                    className={cn(
                      "px-1.5 py-0.5 rounded text-xs font-mono transition-colors shrink-0",
                      currentPage === pg
                        ? "bg-amber-500 text-gray-900 font-bold"
                        : "bg-amber-500/20 text-amber-300 hover:bg-amber-500/35"
                    )}
                  >
                    {pg}
                  </button>
                ))}
                {pagesWithHits.length > 50 && (
                  <span className="text-xs text-white/25 px-2 py-0.5">+{pagesWithHits.length - 50} more</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content area: 2 columns — page reader + intelligence panel */}
        <div className="flex-1 overflow-hidden flex">
          {/* Page Reader */}
          <div className="flex-1 overflow-y-auto p-6" ref={pageTextRef}>
            {pageLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                <p className="text-sm text-white/30">Loading page {currentPage}...</p>
              </div>
            ) : pageData ? (
              <div className="max-w-3xl mx-auto">
                {/* Page header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-white/5" />
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/3">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-xs text-white/50 font-mono">
                      Page {pageData.pageNumber} of {pageCount}
                    </span>
                    {currentPageHits.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs">
                        {currentPageHits.length} hit{currentPageHits.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="h-px flex-1 bg-white/5" />
                </div>

                {/* Page sections */}
                {pageData.sections?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pageData.sections.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full border border-indigo-500/20 bg-indigo-500/8 text-xs text-indigo-300">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Page text */}
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="bg-[#111118] rounded-xl border border-white/5 p-6">
                    <p className="text-sm leading-7 text-white/75 whitespace-pre-wrap font-mono">
                      {currentPageHits.length > 0
                        ? renderHighlightedText(pageData.text, currentPageHits)
                        : pageData.text
                      }
                    </p>
                  </div>
                </div>

                {/* Navigation footer */}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous page
                  </button>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= pageCount}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 disabled:opacity-30 transition-colors"
                  >
                    Next page
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-white/3 flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white/15" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/50">No content extracted yet</p>
                  <p className="text-xs text-white/25 mt-1">
                    This document hasn't been processed.<br />
                    Go to Documents → click "Process" to extract text.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Intelligence Panel */}
          <aside className="w-72 shrink-0 border-l border-white/5 overflow-y-auto bg-[#0d0d14] hidden xl:block">
            <div className="p-4 border-b border-white/5">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                AI Intelligence
              </h3>
            </div>

            {intelligenceLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
              </div>
            ) : intelligence ? (
              <div className="p-4 space-y-4">
                {/* Risk Score */}
                {intelligence.riskScore !== undefined && (
                  <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="text-xs text-white/40 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      Risk Score
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-white">
                        {intelligence.riskScore}
                        <span className="text-sm text-white/30">/100</span>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-full h-2">
                        <div
                          className={cn("h-full rounded-full", intelligence.riskScore > 70 ? "bg-red-500" : intelligence.riskScore > 40 ? "bg-amber-500" : "bg-green-500")}
                          style={{ width: `${intelligence.riskScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary */}
                {intelligence.summary && (
                  <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="text-xs text-white/40 mb-2 flex items-center gap-1.5">
                      <AlignLeft className="w-3.5 h-3.5 text-indigo-400" />
                      Executive Summary
                    </div>
                    <p className="text-xs text-white/65 leading-relaxed line-clamp-6">
                      {intelligence.summary}
                    </p>
                    <Link href={`/dashboard/documents/${documentId}`}>
                      <button className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                        Full analysis <ArrowRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                )}

                {/* Key risks */}
                {intelligence.risks?.length > 0 && (
                  <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="text-xs text-white/40 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      Top Risks
                    </div>
                    <ul className="space-y-1.5">
                      {intelligence.risks.slice(0, 4).map((risk: any, i: number) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-white/55">
                          <span className="text-red-400 shrink-0 mt-0.5">•</span>
                          {typeof risk === 'string' ? risk : risk.description || risk.title || JSON.stringify(risk)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key clauses */}
                {intelligence.keyClauses?.length > 0 && (
                  <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="text-xs text-white/40 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                      Key Clauses
                    </div>
                    <ul className="space-y-1.5">
                      {intelligence.keyClauses.slice(0, 4).map((clause: any, i: number) => (
                        <li key={i} className="text-xs text-white/55 flex items-start gap-1.5">
                          <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                          {typeof clause === 'string' ? clause : clause.title || clause.description || JSON.stringify(clause)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
                <Sparkles className="w-8 h-8 text-white/10" />
                <p className="text-xs text-white/25">
                  AI analysis unavailable.<br />Process the document first.
                </p>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* ── COMPARE MODAL ─────────────────────────────────────────────────── */}
      {compareModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111118] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-indigo-400" />
                Compare Documents
              </h2>
              <button onClick={() => setCompareModalOpen(false)} className="text-white/40 hover:text-white/70">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <select
                value={compareDocId}
                onChange={e => setCompareDocId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              >
                <option value="">Select document to compare...</option>
                {allDocs.filter(d => d.id !== documentId).map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <button
                onClick={async () => {
                  if (!compareDocId) return;
                  setCompareLoading(true);
                  try {
                    const res = await fetch('/api/documents/compare', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ doc1Id: documentId, doc2Id: compareDocId })
                    });
                    const json = await res.json();
                    if (json.success) setComparisonResult(json.data);
                  } finally { setCompareLoading(false); }
                }}
                disabled={!compareDocId || compareLoading}
                className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-sm font-semibold flex items-center justify-center gap-2"
              >
                {compareLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitCompare className="w-4 h-4" />}
                {compareLoading ? 'Comparing...' : 'Run Comparison'}
              </button>
              {comparisonResult && (
                <div className="bg-white/3 rounded-xl border border-white/5 p-4 text-sm text-white/70 max-h-64 overflow-y-auto">
                  <pre className="text-xs leading-relaxed whitespace-pre-wrap">
                    {typeof comparisonResult === 'string' ? comparisonResult : JSON.stringify(comparisonResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Entity Group Component ─────────────────────────────────────────────────
function EntityGroup({
  icon: Icon,
  label,
  color,
  items,
  onItemClick
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  items: Array<{ label: string; badge: string }>;
  onItemClick: (label: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  if (!items.length) return null;

  const colorMap: Record<string, string> = {
    blue: 'text-blue-400', purple: 'text-purple-400', green: 'text-green-400',
    amber: 'text-amber-400', red: 'text-red-400', cyan: 'text-cyan-400'
  };
  const bgMap: Record<string, string> = {
    blue: 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20',
    purple: 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20',
    green: 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20',
    amber: 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20',
    red: 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20',
    cyan: 'bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20',
  };

  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-white/3 transition-colors"
      >
        <Icon className={String(cn("w-3.5 h-3.5 shrink-0", colorMap[color] || ''))} />
        <span className="text-xs font-semibold text-white/60 flex-1 text-left">{label}</span>
        <span className="text-xs text-white/30 mr-1">{items.length}</span>
        {expanded ? <ChevronUp className="w-3 h-3 text-white/25" /> : <ChevronDown className="w-3 h-3 text-white/25" />}
      </button>
      {expanded && (
        <div className="px-3 pb-3 flex flex-wrap gap-1.5">
          {items.slice(0, 12).map((item, i) => (
            <button
              key={i}
              onClick={() => onItemClick(item.label)}
              title={`Search for "${item.label}"`}
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs transition-colors",
                bgMap[color]
              )}
            >
              <span className={cn("truncate max-w-[100px]", colorMap[color])}>{item.label}</span>
              {item.badge && <span className="text-white/25 text-xs">{item.badge}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Helper ─────────────────────────────────────────────────────────────────
function buildSnippetText(text: string, keyword: string, contextChars = 80): string {
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const idx = lowerText.indexOf(lowerKeyword);
  if (idx === -1) return text.substring(0, contextChars * 2);

  const start = Math.max(0, idx - contextChars);
  const end = Math.min(text.length, idx + keyword.length + contextChars);
  return (start > 0 ? '...' : '') + text.substring(start, end) + (end < text.length ? '...' : '');
}
