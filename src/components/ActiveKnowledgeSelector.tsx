'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, FileText, Check, ChevronDown, Sparkles, SlidersHorizontal, 
  RefreshCw, FileCode, FileSpreadsheet, FileImage, Folder, Trash2, Tag, Loader2 
} from 'lucide-react';

export interface DocumentItem {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes?: number;
  group?: string;
  source?: string;
}

interface ActiveKnowledgeSelectorProps {
  onScopeChange?: (selectedFiles: string[], selectedGroup?: string) => void;
  className?: string;
}

export function ActiveKnowledgeSelector({ onScopeChange, className }: ActiveKnowledgeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [availableDocs, setAvailableDocs] = useState<DocumentItem[]>([]);
  const [availableGroups, setAvailableGroups] = useState<string[]>(['General Vault']);
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL_GROUPS');
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>(['ALL']); // 'ALL' or specific document names

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/documents/all');
      const data = await res.json();
      if (data.success && Array.isArray(data.documents)) {
        setAvailableDocs(data.documents);
        if (Array.isArray(data.groups) && data.groups.length > 0) {
          setAvailableGroups(data.groups);
        }
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();

    // Load saved scope & group from localStorage
    try {
      const savedGroup = localStorage.getItem('synaps_active_group_filter');
      if (savedGroup) setSelectedGroup(savedGroup);

      const savedScope = localStorage.getItem('synaps_active_knowledge_scope');
      if (savedScope) {
        const parsed = JSON.parse(savedScope);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedFileIds(parsed);
        }
      }
    } catch (e) {}

    const handleFocus = () => fetchDocuments();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Filter docs by group
  const displayedDocs = selectedGroup === 'ALL_GROUPS' 
    ? availableDocs 
    : availableDocs.filter(d => (d.group || 'General Vault') === selectedGroup);

  const handleGroupSelect = (groupName: string) => {
    setSelectedGroup(groupName);
    try {
      localStorage.setItem('synaps_active_group_filter', groupName);
    } catch (e) {}

    if (groupName !== 'ALL_GROUPS') {
      const groupDocs = availableDocs.filter(d => (d.group || 'General Vault') === groupName).map(d => d.name);
      setSelectedFileIds(groupDocs.length > 0 ? groupDocs : ['ALL']);
      saveScope(groupDocs.length > 0 ? groupDocs : ['ALL'], groupName);
    } else {
      setSelectedFileIds(['ALL']);
      saveScope(['ALL'], 'ALL_GROUPS');
    }
  };

  const saveScope = (updatedFiles: string[], group?: string) => {
    try {
      localStorage.setItem('synaps_active_knowledge_scope', JSON.stringify(updatedFiles));
      window.dispatchEvent(new CustomEvent('synaps-knowledge-scope-changed', { 
        detail: { files: updatedFiles, group: group || selectedGroup } 
      }));
    } catch (e) {}

    if (onScopeChange) {
      const allNames = displayedDocs.map(d => d.name);
      onScopeChange(updatedFiles.includes('ALL') ? allNames : updatedFiles, group || selectedGroup);
    }
  };

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
    saveScope(updated);
  };

  // Permanent Hard Delete Handler (Wipes AI Memory Completely)
  const handleHardDeleteDocument = async (e: React.MouseEvent, docId: string, docName: string) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to PERMANENTLY delete "${docName}"?\n\nThis will purge all file data, vector chunks, and knowledge graph relationships so the AI completely forgets it.`)) {
      return;
    }

    setDeletingId(docId);
    try {
      const res = await fetch(`/api/documents/all?documentId=${docId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setAvailableDocs(prev => prev.filter(d => d.id !== docId));
        setSelectedFileIds(prev => prev.filter(f => f !== docName));
        alert(`Document "${docName}" and all AI memory entries permanently purged.`);
      } else {
        alert(`Error deleting document: ${json.error}`);
      }
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
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
    ? selectedGroup === 'ALL_GROUPS' 
      ? `All Ingested Knowledge Base Files (${availableDocs.length} Documents Loaded)`
      : `Group: '${selectedGroup}' (${displayedDocs.length} Documents Active)`
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Active Knowledge Scope & Group Selector</span>
              <span className="badge badge-primary badge-sm font-mono text-[10px] flex items-center gap-1">
                {loading && <RefreshCw className="w-2.5 h-2.5 animate-spin" />}
                {displayedDocs.length} Active Docs
              </span>
            </div>
            <p className="text-xs font-semibold text-base-content mt-0.5 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-indigo-400" />
              {displayText}
            </p>
          </div>
        </div>

        {/* Controls: Group Selector & File Selector Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          
          {/* Group Filter Dropdown */}
          <select
            value={selectedGroup}
            onChange={(e) => handleGroupSelect(e.target.value)}
            className="select select-sm border-primary/40 bg-base-100 text-xs font-bold rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL_GROUPS">📁 All Groups & Folders</option>
            {availableGroups.map(g => (
              <option key={g} value={g}>📂 Group: {g}</option>
            ))}
          </select>

          {/* Document Multi-Select Dropdown Button */}
          <div className="relative w-full sm:w-auto">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="btn btn-sm btn-outline border-primary/40 hover:border-primary w-full sm:w-auto gap-2 rounded-xl text-xs font-bold shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
              Choose Files ({selectedFileIds.length})
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 top-full mt-2 w-88 md:w-96 bg-base-100 border border-base-300 rounded-2xl shadow-2xl z-50 p-3 space-y-2 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center px-2 pb-2 border-b border-base-300">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60">Choose Active Document Scope</span>
                  <button 
                    onClick={() => toggleFile('ALL')} 
                    className="text-[10px] text-primary font-bold hover:underline"
                  >
                    Select All ({displayedDocs.length})
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
                      <span>All Documents in {selectedGroup === 'ALL_GROUPS' ? 'Vault' : `'${selectedGroup}'`}</span>
                    </div>
                    {isAllSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </div>

                  {/* Individual Uploaded & Demo Documents */}
                  {displayedDocs.map((doc) => {
                    const isChecked = !isAllSelected && selectedFileIds.includes(doc.name);
                    const isDeleting = deletingId === doc.id;
                    return (
                      <div 
                        key={doc.id}
                        onClick={() => toggleFile(doc.name)}
                        className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-colors group ${
                          isChecked ? 'bg-primary/10 text-primary border border-primary/20 font-semibold' : 'hover:bg-base-200 text-base-content/80'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          {getFileBadgeIcon(doc.name, doc.mimeType)}
                          <span className="truncate">{doc.name}</span>
                          {doc.group && (
                            <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 text-[9px] font-bold">
                              {doc.group}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Permanent Hard Delete Button */}
                          <button
                            title="Permanently hard delete document & wipe AI memory"
                            onClick={(e) => handleHardDeleteDocument(e, doc.id, doc.name)}
                            disabled={isDeleting}
                            className="p-1 rounded-lg hover:bg-red-500/20 text-base-content/30 hover:text-red-500 transition-colors"
                          >
                            {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" /> : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                          {isChecked && <Check className="w-4 h-4 text-primary" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-base-300 flex justify-between items-center text-[10px] text-base-content/50">
                  <span>AI Grounded strictly across active group/files</span>
                  <button onClick={() => setIsOpen(false)} className="btn btn-primary btn-xs rounded-lg px-3">Done</button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
