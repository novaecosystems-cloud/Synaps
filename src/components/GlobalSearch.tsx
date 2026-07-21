'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, History, BrainCircuit, X, FileText, Folder, CheckSquare, Briefcase, Users, Building, ChevronRight } from 'lucide-react';

interface SearchResult {
  id: string;
  resourceId: string;
  type: string;
  title: string;
  snippet: string;
  link: string;
}

interface GlobalSearchProps {
  userId?: string;
  organizationId?: string;
}

export function GlobalSearch({ userId = 'user-1', organizationId = 'org-1' }: GlobalSearchProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [semantic, setSemantic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);


  // Keyboard shortcut Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      fetchHistory();
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/search/history?userId=${userId}&organizationId=${organizationId}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      performSearch(query);
    }, 400); // Debounce
    return () => clearTimeout(timer);
  }, [query, semantic]);

  const performSearch = async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&userId=${userId}&organizationId=${organizationId}&semantic=${semantic}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const navigateToResult = (link: string) => {
    setIsOpen(false);
    router.push(link);
  };

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) acc[result.type] = [];
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const getIcon = (type: string) => {
    switch(type) {
      case 'Document': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'Project': return <Folder className="w-4 h-4 text-indigo-500" />;
      case 'Requirement': return <CheckSquare className="w-4 h-4 text-emerald-500" />;
      case 'Proposal': return <Briefcase className="w-4 h-4 text-purple-500" />;
      case 'User': return <Users className="w-4 h-4 text-orange-500" />;
      case 'Organization': return <Building className="w-4 h-4 text-gray-500" />;
      case 'Document Chunk (AI Match)': return <BrainCircuit className="w-4 h-4 text-pink-500" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  // Highlighting function
  const highlightText = (text: string, q: string) => {
    if (!q) return text;
    const parts = text.split(new RegExp(`(${q})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === q.toLowerCase() ? <span key={i} className="bg-yellow-200 text-yellow-900 font-medium px-1 rounded-sm">{part}</span> : part
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-neutral/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-2xl bg-base-100 rounded-xl shadow-2xl overflow-hidden border border-base-300 flex flex-col max-h-[80vh] text-base-content"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Area */}
        <div className="relative flex items-center px-4 py-6 border-b border-base-300 bg-base-200/30">
          <div className="uiverse-search-container flex-1 mr-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-base-content/40 z-10" />
            <input
              ref={inputRef}
              className="uiverse-search-input bg-base-100 text-base-content border border-base-300"
              name="text"
              type="text"
              placeholder="Search documents, projects..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => setSemantic(!semantic)}
            className={`flex items-center px-3 py-1.5 ml-3 rounded-full text-xs font-medium transition-colors ${semantic ? 'bg-primary/10 text-primary ring-1 ring-primary/30' : 'bg-base-200 text-base-content/70 hover:bg-base-300'}`}
            title="Toggle Semantic AI Search"
          >
            <BrainCircuit className={`w-3.5 h-3.5 mr-1.5 ${semantic ? 'text-primary' : 'text-base-content/50'}`} />
            Semantic Search
          </button>

          <button onClick={() => setIsOpen(false)} className="ml-3 p-1.5 rounded-md hover:bg-base-200 text-base-content/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="p-8 flex items-center justify-center text-base-content/50">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Searching...
            </div>
          )}

          {!loading && query.length === 0 && history.length > 0 && (
            <div className="p-4">
              <h3 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-3">Recent Searches</h3>
              <div className="space-y-1">
                {history.map((h, i) => (
                  <button 
                    key={i}
                    onClick={() => setQuery(h)}
                    className="w-full flex items-center px-3 py-2.5 text-sm text-base-content/80 rounded-md hover:bg-base-200 transition-colors"
                  >
                    <History className="w-4 h-4 text-base-content/40 mr-3" />
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && query.length > 0 && results.length === 0 && (
            <div className="p-12 text-center text-base-content/60">
              <Search className="w-12 h-12 text-base-content/20 mx-auto mb-4" />
              <p className="text-lg font-medium text-base-content">No results found</p>
              <p className="text-sm mt-1">Try adjusting your keywords or toggle Semantic Search.</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="p-2 space-y-4">
              {Object.entries(groupedResults).map(([type, typeResults]) => (
                <div key={type} className="mb-2">
                  <h3 className="px-3 py-2 text-xs font-semibold text-base-content/50 uppercase tracking-wider">{type}</h3>
                  <div className="space-y-1">
                    {typeResults.map(res => (
                      <button
                        key={res.id}
                        onClick={() => navigateToResult(res.link)}
                        className="w-full flex items-start text-left px-3 py-3 rounded-lg hover:bg-base-200 transition-colors group"
                      >
                        <div className="mt-0.5 mr-3 p-2 rounded-md bg-base-100 border border-base-300 shadow-sm group-hover:border-primary/30">
                          {getIcon(res.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-base-content truncate">
                            {highlightText(res.title, query)}
                          </p>
                          <p className="text-xs text-base-content/60 mt-1 line-clamp-1">
                            {highlightText(res.snippet, query)}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-base-content/30 opacity-0 group-hover:opacity-100 transition-opacity self-center ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-base-300 bg-base-200/50 flex items-center justify-between text-xs text-base-content/50">
          <div className="flex items-center space-x-4">
            <span className="flex items-center"><kbd className="bg-base-100 border border-base-300 rounded px-1.5 py-0.5 mr-1 font-sans text-[10px] text-base-content/60 shadow-sm">↑↓</kbd> to navigate</span>
            <span className="flex items-center"><kbd className="bg-base-100 border border-base-300 rounded px-1.5 py-0.5 mr-1 font-sans text-[10px] text-base-content/60 shadow-sm">Enter</kbd> to select</span>
          </div>
          <div>
            <kbd className="bg-base-100 border border-base-300 rounded px-1.5 py-0.5 mr-1 font-sans text-[10px] text-base-content/60 shadow-sm">Esc</kbd> to close
          </div>
        </div>
      </div>
    </div>
  );
}
