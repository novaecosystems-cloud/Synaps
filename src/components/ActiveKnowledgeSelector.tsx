'use client';

import React, { useState, useEffect } from 'react';
import { Database, FileText, Check, ChevronDown, Sparkles, SlidersHorizontal, RefreshCw, FileCode, FileSpreadsheet, FileImage } from 'lucide-react';

export interface DocumentItem {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes?: number;
  source?: string;
}

interface ActiveKnowledgeSelectorProps {
  onScopeChange?: (selectedFiles: string[]) => void;
  className?: string;
}

export function ActiveKnowledgeSelector({ onScopeChange, className }: ActiveKnowledgeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableDocs, setAvailableDocs] = useState<DocumentItem[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>(['ALL']); // 'ALL' or specific document names

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/documents/all');
      const data = await res.json();
      if (data.success && Array.isArray(data.documents) && data.documents.length > 0) {
        setAvailableDocs(data.documents);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();

    // Load saved scope from localStorage
    try {
      const savedScope = localStorage.getItem('synaps_active_knowledge_scope');
      if (savedScope) {
        const parsed = JSON.parse(savedScope);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedFileIds(parsed);
        }
      }
    } catch (e) {}

    // Listen for storage or focus updates
    const handleFocus = () => fetchDocuments();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const toggleFile = (fileName: string) => {
    let updated: string[];
    if (fileName === 'ALL') {
      updated = ['ALL'];
    } else {
      const currentFiltered = selectedFileIds.filter(f => f !== 'ALL');
      if (currentFiltered.includes(fileName)) {
        updated = currentFiltered.filter(f => f !== fileName);
        if (updated.length === 0) updated = ['ALL'];
      } else {
        updated = [...currentFiltered, fileName];
      }
    }
    
    setSelectedFileIds(updated);

    // Save to localStorage & notify
    try {
      localStorage.setItem('synaps_active_knowledge_scope', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('synaps-knowledge-scope-changed', { detail: updated }));
    } catch (e) {}

    if (onScopeChange) {
      const allNames = availableDocs.map(d => d.name);
      onScopeChange(updated.includes('ALL') ? allNames : updated);
    }
  };

  const getFileBadgeIcon = (name: string, mimeType: string) => {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    if (ext === 'docx' || ext === 'doc' || mimeType.includes('wordprocessingml')) {
      return <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    }
    if (ext === 'xlsx' || ext === 'xls' || ext === 'csv' || mimeType.includes('spreadsheetml')) {
      return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    }
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || mimeType.startsWith('image/')) {
      return <FileImage className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
    }
    return <FileCode className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
  };

  const isAllSelected = selectedFileIds.includes('ALL');
  const displayText = isAllSelected 
    ? `All Ingested Knowledge Base Files (${availableDocs.length} Documents & DOCX Loaded)` 
    : `${selectedFileIds.length} Specific Document${selectedFileIds.length > 1 ? 's' : ''} Selected`;

  return (
    <div className={`relative w-full bg-base-100 border border-primary/30 rounded-2xl p-3.5 shadow-md mb-6 animate-in fade-in duration-200 ${className || ''}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        {/* Title & Active Scope Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Database className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Active Knowledge Scope & File Selector</span>
              <span className="badge badge-primary badge-sm font-mono text-[10px] flex items-center gap-1">
                {loading && <RefreshCw className="w-2.5 h-2.5 animate-spin" />}
                {availableDocs.length} Documents Loaded
              </span>
            </div>
            <p className="text-xs font-semibold text-base-content mt-0.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary/70" />
              {displayText}
            </p>
          </div>
        </div>

        {/* Dropdown Toggle Button */}
        <div className="relative w-full sm:w-auto">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-sm btn-outline border-primary/40 hover:border-primary w-full sm:w-auto gap-2 rounded-xl text-xs font-bold shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            Choose Document / DOCX for AI Analysis
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-88 md:w-96 bg-base-100 border border-base-300 rounded-2xl shadow-2xl z-50 p-3 space-y-2 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center px-2 pb-2 border-b border-base-300">
                <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60">Choose DOCX / PDF / Data Scope</span>
                <button 
                  onClick={() => toggleFile('ALL')} 
                  className="text-[10px] text-primary font-bold hover:underline"
                >
                  Select All ({availableDocs.length})
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                {/* ALL Option */}
                <div 
                  onClick={() => toggleFile('ALL')}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs font-semibold transition-colors ${
                    isAllSelected ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-base-200 text-base-content'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>All Ingested Documents (DOCX, PDF, XLSX, PPTX)</span>
                  </div>
                  {isAllSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                </div>

                {/* Individual Uploaded & Demo Documents */}
                {availableDocs.map((doc) => {
                  const isChecked = !isAllSelected && selectedFileIds.includes(doc.name);
                  return (
                    <div 
                      key={doc.id}
                      onClick={() => toggleFile(doc.name)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                        isChecked ? 'bg-primary/10 text-primary border border-primary/20 font-semibold' : 'hover:bg-base-200 text-base-content/80'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        {getFileBadgeIcon(doc.name, doc.mimeType)}
                        <span className="truncate">{doc.name}</span>
                        {doc.source === 'UPLOADED' && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">Uploaded</span>
                        )}
                      </div>
                      {isChecked && <Check className="w-4 h-4 text-primary shrink-0" />}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-base-300 flex justify-between items-center text-[10px] text-base-content/50">
                <span>AI Grounded across selected files</span>
                <button onClick={() => setIsOpen(false)} className="btn btn-primary btn-xs rounded-lg px-3">Done</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
