'use client';

import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Download, X, FileText, File, FileCode2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ExportType = 'EXECUTIVE_SUMMARY' | 'PROPOSAL' | 'GAP_ANALYSIS' | 'DECISION_REPORT' | 'COMPLIANCE_REPORT';
export type ExportFormat = 'PDF' | 'DOCX' | 'MARKDOWN' | 'CSV' | 'JSON';

interface ExportDialogProps {
  documentId?: string;
  projectId?: string;
  defaultType?: ExportType;
  isOpen: boolean;
  onClose: () => void;
}

export function ExportDialog({ documentId, projectId, defaultType = 'PROPOSAL', isOpen, onClose }: ExportDialogProps) {
  const [type, setType] = useState<ExportType>(defaultType);
  const [format, setFormat] = useState<ExportFormat>('PDF');
  const [status, setStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [jobId, setJobId] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setType(defaultType);
      setStatus('idle');
      setJobId(null);
      setDownloadUrl(null);
      setErrorMsg(null);
    }
  }, [isOpen, defaultType]);

  // Poll for job status
  useEffect(() => {
    if (!jobId || status !== 'generating') return;
    
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/exports/${jobId}`);
        const data = await res.json();
        if (data.status === 'COMPLETED') {
          setStatus('success');
          setDownloadUrl(`/api/exports/download?id=${jobId}`);
          clearInterval(interval);
        } else if (data.status === 'FAILED') {
          setStatus('error');
          setErrorMsg(data.error || 'Generation failed');
          clearInterval(interval);
        }
      } catch (e) {
        console.error(e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId, status]);

  const handleExport = async () => {
    setStatus('generating');
    setErrorMsg(null);
    try {
      const res = await fetch('/api/exports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, format, documentId, projectId })
      });
      const data = await res.json();
      if (data.success) {
        setJobId(data.jobId);
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Failed to start export');
      }
    } catch (e) {
      setStatus('error');
      setErrorMsg('Network error occurred');
    }
  };

  const formats = [
    { id: 'PDF', label: 'PDF Document', icon: File, description: 'Branded, print-ready document' },
    { id: 'DOCX', label: 'Word Document', icon: FileText, description: 'Editable formatted document' },
    { id: 'MARKDOWN', label: 'Markdown', icon: FileCode2, description: 'Plain text with formatting' },
    { id: 'CSV', label: 'CSV Data', icon: FileCode2, description: 'Raw tabular data' },
    { id: 'JSON', label: 'JSON Data', icon: FileCode2, description: 'Structured machine-readable data' },
  ];

  const types = [
    { id: 'EXECUTIVE_SUMMARY', label: 'Executive Summary' },
    { id: 'PROPOSAL', label: 'Proposal' },
    { id: 'GAP_ANALYSIS', label: 'Gap Analysis' },
    { id: 'DECISION_REPORT', label: 'Decision Report' },
    { id: 'COMPLIANCE_REPORT', label: 'Compliance Report' }
  ];

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-xl">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" /> Export Report
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground">
              Generate a branded report from your project data.
            </Dialog.Description>
          </div>
          
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          {status === 'idle' && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <label htmlFor="report-type" className="text-sm font-medium leading-none">Report Type</label>
                <select 
                  id="report-type"
                  value={type} 
                  onChange={(e) => setType(e.target.value as ExportType)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {types.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium leading-none">Export Format</label>
                <div className="grid grid-cols-1 gap-2">
                  {formats.map((f) => {
                    const Icon = f.icon;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setFormat(f.id as ExportFormat)}
                        className={cn(
                          "flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-300 ease-out group",
                          format === f.id 
                            ? "border-primary bg-primary/10 ring-2 ring-primary ring-offset-2 ring-offset-background shadow-[0_0_20px_rgba(var(--primary),0.2)] scale-[1.02]" 
                            : "border-border hover:border-primary/50 hover:bg-muted/50 hover:scale-[1.01]"
                        )}
                      >
                        <div className={cn(
                          "p-3 rounded-lg transition-colors duration-300", 
                          format === f.id 
                            ? "bg-primary text-primary-foreground shadow-lg" 
                            : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                        )}>
                          <Icon className={cn("w-5 h-5", format === f.id && "animate-bounce")} style={{ animationIterationCount: 1 }} />
                        </div>
                        <div>
                          <div className={cn("text-sm font-bold transition-colors duration-300", format === f.id ? "text-primary" : "text-foreground")}>{f.label}</div>
                          <div className="text-xs text-muted-foreground">{f.description}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button 
                  onClick={onClose}
                  className="h-10 px-4 py-2 bg-transparent hover:bg-muted text-foreground rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleExport}
                  className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Generate Export
                </button>
              </div>
            </div>
          )}

          {status === 'generating' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <div className="text-center">
                <h3 className="font-semibold text-lg">Generating Report...</h3>
                <p className="text-sm text-muted-foreground">This may take a few seconds.</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-500/20">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-semibold text-xl">Export Ready</h3>
                <p className="text-sm text-muted-foreground">Your {format} document has been generated successfully.</p>
              </div>
              <div className="flex gap-3 w-full max-w-xs">
                <button 
                  onClick={onClose}
                  className="flex-1 h-10 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-md text-sm font-medium transition-colors"
                >
                  Close
                </button>
                <a 
                  href={downloadUrl!}
                  download
                  className="flex-1 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download
                </a>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center border border-destructive/20">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-semibold text-xl">Export Failed</h3>
                <p className="text-sm text-muted-foreground">{errorMsg}</p>
              </div>
              <button 
                onClick={() => setStatus('idle')}
                className="h-10 px-6 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-md text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
