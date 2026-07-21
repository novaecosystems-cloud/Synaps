'use client';

import { useState, useEffect } from 'react';
import { Download, CheckCircle, AlertCircle, FileText, FileCode2, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function ExportHistoryPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000); // Poll every 5s for updates
    return () => clearInterval(interval);
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/exports');
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight mb-2">Export History</h1>
          <p className="text-muted-foreground">View and download your recently generated reports.</p>
        </div>
        <button onClick={fetchJobs} className="bg-primary/10 text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/20 transition-colors">
          Refresh
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {loading && jobs.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">Loading history...</div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No exports found. Generate one from a project document!</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/40">
              <tr>
                <th className="px-6 py-4 font-medium">Report Type</th>
                <th className="px-6 py-4 font-medium">Format</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {job.type.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {job.format === 'PDF' || job.format === 'DOCX' ? <FileText className="w-4 h-4" /> : <FileCode2 className="w-4 h-4" />}
                      {job.format}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {job.status === 'COMPLETED' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" /> Ready
                      </span>
                    ) : job.status === 'FAILED' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
                        <AlertCircle className="w-3 h-3" /> Failed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        <Clock className="w-3 h-3 animate-pulse" /> Processing
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {format(new Date(job.createdAt), 'MMM d, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {job.status === 'COMPLETED' && job.fileUrl ? (
                      <a 
                        href={`/api/exports/download?id=${job.id}`}
                        download
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-xs font-medium transition-colors"
                      >
                        <Download className="w-3 h-3" /> Download
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-xs">{job.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
