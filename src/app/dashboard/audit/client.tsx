"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Search, Filter, Download, ChevronLeft, ChevronRight, Activity, Calendar, User, Database } from 'lucide-react';

export default function AuditExplorerClient({ organizationId }: { organizationId: string }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const limit = 20;

  // Selected Log (Modal)
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter, startDate, endDate]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const params = new URLSearchParams({ organizationId, limit: limit.toString(), offset: offset.toString() });
      if (search) params.append('search', search);
      if (actionFilter) params.append('action', actionFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await fetch(`/api/audit?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setTotal(data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const exportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['ID', 'Timestamp', 'User', 'Action', 'Entity Type', 'Entity ID', 'IP Address'];
    const csvRows = [headers.join(',')];

    for (const log of logs) {
      const row = [
        log.id,
        new Date(log.createdAt).toISOString(),
        log.userId || 'System',
        log.action,
        log.entityType,
        log.entityId,
        log.ipAddress || 'N/A'
      ];
      // Escape commas and quotes for CSV
      csvRows.push(row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="h-full flex flex-col p-6 space-y-4">
      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 border border-border rounded-lg shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full md:w-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action or resource ID..." 
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:ring-1 focus:ring-indigo-500"
          />
        </form>
        
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <select 
            value={actionFilter} 
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="bg-background border border-border rounded-md px-3 py-2 text-sm"
          >
            <option value="">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="UPLOAD">Upload</option>
            <option value="DELETE">Delete</option>
            <option value="AI_GENERATION">AI Generation</option>
            <option value="STATUS_CHANGED">Status Changed</option>
            <option value="REVIEWER_ASSIGNED">Reviewer Assigned</option>
            <option value="COMMENT_ADDED">Comment Added</option>
            <option value="EXPORT">Export</option>
          </select>

          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            className="bg-background border border-border rounded-md px-3 py-2 text-sm"
          />
          <span className="text-muted-foreground text-sm">to</span>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            className="bg-background border border-border rounded-md px-3 py-2 text-sm"
          />

          <button onClick={exportCSV} className="ml-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 bg-card border border-border rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border sticky top-0">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Resource</th>
                <th className="px-6 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No logs found matching your criteria.
                  </td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-800">
                      <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs">{log.action}</span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2 text-slate-600">
                        <User className="w-3.5 h-3.5" />
                        {log.userId || 'System'}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Database className="w-3.5 h-3.5" />
                        {log.entityType} <span className="text-xs text-slate-400">({log.entityId.slice(0, 8)}...)</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button onClick={() => setSelectedLog(log)} className="text-indigo-600 hover:text-indigo-800 font-medium text-xs underline">
                        View Payloads
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-muted/20 border-t border-border px-6 py-3 flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{Math.min((page - 1) * limit + 1, total)}</span> to <span className="font-medium text-foreground">{Math.min(page * limit, total)}</span> of <span className="font-medium text-foreground">{total}</span> entries
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 rounded hover:bg-muted disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium">Page {page} of {Math.max(1, totalPages)}</span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || total === 0}
              className="p-1 rounded hover:bg-muted disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-2xl rounded-xl shadow-xl border border-border flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-bold">Log Details <span className="text-sm font-normal text-muted-foreground ml-2">{selectedLog.id}</span></h3>
              <button onClick={() => setSelectedLog(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-muted-foreground text-xs uppercase font-semibold mb-1">Action</span>
                  <span className="font-medium">{selectedLog.action}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs uppercase font-semibold mb-1">Timestamp</span>
                  <span>{new Date(selectedLog.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs uppercase font-semibold mb-1">User ID</span>
                  <span>{selectedLog.userId || 'System'}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs uppercase font-semibold mb-1">IP Address</span>
                  <span>{selectedLog.ipAddress || 'Not recorded'}</span>
                </div>
              </div>

              <div>
                <span className="block text-muted-foreground text-xs uppercase font-semibold mb-2">Before State</span>
                <pre className="bg-muted text-foreground p-4 rounded-lg text-xs overflow-x-auto border border-border">
                  {selectedLog.before ? JSON.stringify(selectedLog.before, null, 2) : 'null'}
                </pre>
              </div>

              <div>
                <span className="block text-muted-foreground text-xs uppercase font-semibold mb-2">After State</span>
                <pre className="bg-muted text-foreground p-4 rounded-lg text-xs overflow-x-auto border border-border">
                  {selectedLog.after ? JSON.stringify(selectedLog.after, null, 2) : 'null'}
                </pre>
              </div>
              
              <div>
                <span className="block text-muted-foreground text-xs uppercase font-semibold mb-2">Metadata</span>
                <pre className="bg-muted text-foreground p-4 rounded-lg text-xs overflow-x-auto border border-border">
                  {selectedLog.metadata ? JSON.stringify(selectedLog.metadata, null, 2) : 'null'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
