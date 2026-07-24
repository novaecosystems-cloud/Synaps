'use client';

import React, { useState, useEffect } from 'react';
import { Database, FileText, Check, ChevronDown, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { NOVA_DEMO_DOCUMENTS } from '@/lib/demo-data';

interface ActiveKnowledgeSelectorProps {
  onScopeChange?: (selectedFiles: string[]) => void;
}

export function ActiveKnowledgeSelector({ onScopeChange }: ActiveKnowledgeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [availableFiles, setAvailableFiles] = useState<string[]>(NOVA_DEMO_DOCUMENTS.map(d => d.name));
  const [selectedFiles, setSelectedFiles] = useState<string[]>(['ALL']); // 'ALL' or specific file names

  useEffect(() => {
    // Fetch live documents from API or fallback
    fetch('/api/search/history')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.documents) && data.documents.length > 0) {
          setAvailableFiles(data.documents.map((d: any) => d.name));
        }
      })
      .catch(() => {});
  }, []);

  const toggleFile = (fileName: string) => {
    let updated: string[];
    if (fileName === 'ALL') {
      updated = ['ALL'];
    } else {
      const currentFiltered = selectedFiles.filter(f => f !== 'ALL');
      if (currentFiltered.includes(fileName)) {
        updated = currentFiltered.filter(f => f !== fileName);
        if (updated.length === 0) updated = ['ALL'];
      } else {
        updated = [...currentFiltered, fileName];
      }
    }
    setSelectedFiles(updated);
    if (onScopeChange) {
      onScopeChange(updated.includes('ALL') ? availableFiles : updated);
    }
  };

  const isAllSelected = selectedFiles.includes('ALL');
  const displayText = isAllSelected 
    ? `All Ingested Knowledge Base Files (${availableFiles.length} Files)` 
    : `${selectedFiles.length} Specific File${selectedFiles.length > 1 ? 's' : ''} Selected`;

  return (
    <div className="relative w-full bg-base-100 border border-primary/30 rounded-2xl p-3 shadow-md mb-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        {/* Title & Active Scope Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Active Knowledge Scope</span>
              <span className="badge badge-primary badge-sm font-mono text-[10px]">{availableFiles.length} Documents Loaded</span>
            </div>
            <p className="text-xs font-semibold text-base-content mt-0.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary/70" />
              {displayText}
            </p>
          </div>
        </div>

        {/* Dropdown Toggle */}
        <div className="relative w-full sm:w-auto">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-sm btn-outline border-primary/40 hover:border-primary w-full sm:w-auto gap-2 rounded-xl text-xs font-bold"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            Select Files for AI Analysis
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-base-100 border border-base-300 rounded-2xl shadow-2xl z-50 p-3 space-y-2 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center px-2 pb-2 border-b border-base-300">
                <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60">Choose AI Data Scope</span>
                <button 
                  onClick={() => toggleFile('ALL')} 
                  className="text-[10px] text-primary font-bold hover:underline"
                >
                  Select All
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar">
                {/* ALL Option */}
                <div 
                  onClick={() => toggleFile('ALL')}
                  className={`flex items-center justify-between p-2 rounded-xl cursor-pointer text-xs font-semibold transition-colors ${
                    isAllSelected ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-base-200 text-base-content'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>All Knowledge Base Documents</span>
                  </div>
                  {isAllSelected && <Check className="w-4 h-4 text-primary" />}
                </div>

                {/* Individual Files */}
                {availableFiles.map((file, idx) => {
                  const isChecked = !isAllSelected && selectedFiles.includes(file);
                  return (
                    <div 
                      key={idx}
                      onClick={() => toggleFile(file)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer text-xs transition-colors ${
                        isChecked ? 'bg-primary/10 text-primary border border-primary/20 font-semibold' : 'hover:bg-base-200 text-base-content/80'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <FileText className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                        <span className="truncate">{file}</span>
                      </div>
                      {isChecked && <Check className="w-4 h-4 text-primary shrink-0" />}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-base-300 flex justify-between items-center text-[10px] text-base-content/50">
                <span>AI Grounding Active</span>
                <button onClick={() => setIsOpen(false)} className="btn btn-primary btn-xs rounded-lg">Done</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
