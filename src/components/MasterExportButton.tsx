'use client';

import React, { useState } from 'react';
import { Download, FileText, Table, Sparkles, ChevronDown } from 'lucide-react';
import { downloadMasterAIReport } from '@/lib/export-helpers';

export default function MasterExportButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: 'PDF' | 'CSV') => {
    setLoading(true);
    setOpen(false);
    try {
      await downloadMasterAIReport(format);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-tight transition-all cursor-pointer border border-emerald-500/30 font-sans shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>{loading ? 'Generating Export...' : 'Export Master AI Reports'}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40"
        />
      )}

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider uppercase block">
              MASTER AI EXPORT ENGINE
            </span>
            <p className="text-xs text-slate-400">Download all AI outputs across Executive Overview & Subdashboards.</p>
          </div>

          <button
            onClick={() => handleExport('PDF')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs font-semibold text-slate-200 hover:bg-slate-800/80 transition-colors"
          >
            <div className="p-1.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Export Full Executive Brief (PDF)</div>
              <div className="text-[10px] text-slate-400">Print-formatted PDF with all AI sections</div>
            </div>
          </button>

          <button
            onClick={() => handleExport('CSV')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs font-semibold text-slate-200 hover:bg-slate-800/80 transition-colors mt-1"
          >
            <div className="p-1.5 rounded bg-indigo-950/80 text-indigo-400 border border-indigo-800/50">
              <Table className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Export All Risk & AI Data (CSV)</div>
              <div className="text-[10px] text-slate-400">Spreadsheet table of all structured outputs</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
