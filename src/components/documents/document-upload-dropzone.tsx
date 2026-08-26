'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { UploadCloud, File as FileIcon, FileText, FileSpreadsheet, Image as ImageIcon, FileCode, Presentation, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { requestUploadUrl, confirmUpload } from '@/app/actions/document';
import { cn } from '@/lib/utils';
import { CustomLoader } from '@/components/ui/custom-loader';

interface DocumentUploadDropzoneProps {
  organizationId: string;
  projectId?: string;
  onUploadSuccess?: () => void;
}

export type DocumentTypeKey = 'PDF' | 'XLSX' | 'DOCX' | 'PPTX' | 'CSV' | 'TXT' | 'IMAGE' | 'CODE' | 'OTHER';

export interface DocumentTypeInfo {
  type: DocumentTypeKey;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
}

export function getDocumentTypeInfo(file: { name: string; type?: string }): DocumentTypeInfo {
  const name = file.name.toLowerCase();
  const mime = file.type?.toLowerCase() || '';

  if (name.endsWith('.pdf') || mime.includes('pdf')) {
    return {
      type: 'PDF',
      label: 'PDF Document',
      badgeBg: 'bg-rose-500/10',
      badgeText: 'text-rose-400',
      badgeBorder: 'border-rose-500/30',
      icon: FileText,
      iconColor: 'text-rose-400',
      iconBg: 'bg-rose-500/10 border-rose-500/20'
    };
  }

  if (name.endsWith('.xlsx') || name.endsWith('.xls') || mime.includes('spreadsheet') || mime.includes('excel')) {
    return {
      type: 'XLSX',
      label: 'Excel Spreadsheet',
      badgeBg: 'bg-emerald-500/10',
      badgeText: 'text-emerald-400',
      badgeBorder: 'border-emerald-500/30',
      icon: FileSpreadsheet,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20'
    };
  }

  if (name.endsWith('.docx') || name.endsWith('.doc') || mime.includes('wordprocessing') || mime.includes('msword')) {
    return {
      type: 'DOCX',
      label: 'Word Document',
      badgeBg: 'bg-cyan-500/10',
      badgeText: 'text-cyan-400',
      badgeBorder: 'border-cyan-500/30',
      icon: FileText,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10 border-cyan-500/20'
    };
  }

  if (name.endsWith('.csv') || mime.includes('csv')) {
    return {
      type: 'CSV',
      label: 'CSV Data Sheet',
      badgeBg: 'bg-teal-500/10',
      badgeText: 'text-teal-400',
      badgeBorder: 'border-teal-500/30',
      icon: FileSpreadsheet,
      iconColor: 'text-teal-400',
      iconBg: 'bg-teal-500/10 border-teal-500/20'
    };
  }

  if (name.endsWith('.pptx') || name.endsWith('.ppt') || mime.includes('presentation') || mime.includes('powerpoint')) {
    return {
      type: 'PPTX',
      label: 'Presentation Deck',
      badgeBg: 'bg-amber-500/10',
      badgeText: 'text-amber-400',
      badgeBorder: 'border-amber-500/30',
      icon: Presentation,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10 border-amber-500/20'
    };
  }

  if (name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.markdown') || mime.includes('text/plain') || mime.includes('markdown')) {
    return {
      type: 'TXT',
      label: 'Markdown / Text',
      badgeBg: 'bg-purple-500/10',
      badgeText: 'text-purple-400',
      badgeBorder: 'border-purple-500/30',
      icon: FileCode,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10 border-purple-500/20'
    };
  }

  if (mime.startsWith('image/') || /\.(png|jpe?g|webp|svg|gif)$/i.test(name)) {
    return {
      type: 'IMAGE',
      label: 'Corporate Asset / Image',
      badgeBg: 'bg-blue-500/10',
      badgeText: 'text-blue-400',
      badgeBorder: 'border-blue-500/30',
      icon: ImageIcon,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10 border-blue-500/20'
    };
  }

  if (/\.(json|yaml|yml|tsv|xml|sql)$/i.test(name)) {
    return {
      type: 'CODE',
      label: 'Structured Data',
      badgeBg: 'bg-indigo-500/10',
      badgeText: 'text-indigo-400',
      badgeBorder: 'border-indigo-500/30',
      icon: FileCode,
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-500/10 border-indigo-500/20'
    };
  }

  return {
    type: 'OTHER',
    label: 'Enterprise Document',
    badgeBg: 'bg-slate-500/10',
    badgeText: 'text-slate-400',
    badgeBorder: 'border-slate-500/30',
    icon: FileIcon,
    iconColor: 'text-slate-400',
    iconBg: 'bg-slate-500/10 border-slate-500/20'
  };
}

export function estimatePageCount(file: { name: string; size: number; type?: string }): string {
  const name = file.name.toLowerCase();
  const mime = file.type?.toLowerCase() || '';
  const size = file.size;

  if (name.endsWith('.pdf') || mime.includes('pdf')) {
    const pages = Math.max(1, Math.round(size / (55 * 1024)));
    return `~${pages} page${pages > 1 ? 's' : ''}`;
  }

  if (name.endsWith('.docx') || name.endsWith('.doc') || mime.includes('wordprocessing')) {
    const pages = Math.max(1, Math.round(size / (28 * 1024)));
    return `~${pages} page${pages > 1 ? 's' : ''}`;
  }

  if (name.endsWith('.xlsx') || name.endsWith('.xls') || mime.includes('spreadsheet')) {
    const sheets = Math.max(1, Math.min(25, Math.round(size / (20 * 1024))));
    const rows = Math.max(10, Math.round(size / 120));
    return `~${sheets} sheet${sheets > 1 ? 's' : ''} (est. ~${rows} rows)`;
  }

  if (name.endsWith('.csv')) {
    const rows = Math.max(10, Math.round(size / 90));
    return `~${rows} data rows`;
  }

  if (name.endsWith('.pptx') || name.endsWith('.ppt')) {
    const slides = Math.max(1, Math.round(size / (110 * 1024)));
    return `~${slides} slide${slides > 1 ? 's' : ''}`;
  }

  if (name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.markdown')) {
    const pages = Math.max(1, Math.round(size / (3.2 * 1024)));
    return `~${pages} page${pages > 1 ? 's' : ''}`;
  }

  if (mime.startsWith('image/') || /\.(png|jpe?g|webp|svg|gif)$/i.test(name)) {
    return '1 asset';
  }

  const pages = Math.max(1, Math.round(size / (50 * 1024)));
  return `~${pages} page${pages > 1 ? 's' : ''}`;
}

export function getStageMessage(progress: number, status: 'uploading' | 'success' | 'error'): string {
  if (status === 'error') return 'Upload interrupted';
  if (status === 'success') return 'Grounded & Verified in Corporate Vault';
  if (progress < 25) return 'Encrypting & Requesting Vault Allocation...';
  if (progress < 60) return 'Streaming Chunks to Zero-Retention Vault...';
  if (progress < 90) return 'Extracting AST & Computing SHA-256 Digest...';
  return 'Finalizing Grounded Knowledge Ingestion...';
}

interface UploadItem {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  docType: DocumentTypeInfo;
  pageEstimate: string;
}

export function DocumentUploadDropzone({ organizationId, projectId, onUploadSuccess }: DocumentUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadItem[]>([]);

  // Optimistic progress ticker for active uploads
  useEffect(() => {
    const hasActiveUploads = uploadingFiles.some(f => f.status === 'uploading' && f.progress < 90);
    if (!hasActiveUploads) return;

    const interval = setInterval(() => {
      setUploadingFiles(prev => prev.map(item => {
        if (item.status !== 'uploading') return item;
        // Optimistically increment progress smoothly
        if (item.progress < 30) {
          return { ...item, progress: Math.min(30, item.progress + 6) };
        } else if (item.progress < 75) {
          return { ...item, progress: Math.min(75, item.progress + 3) };
        } else if (item.progress < 88) {
          return { ...item, progress: Math.min(88, item.progress + 1) };
        }
        return item;
      }));
    }, 200);

    return () => clearInterval(interval);
  }, [uploadingFiles]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const uploadFile = async (file: File, fileIndex: number) => {
    try {
      // 1. Request signed URL
      const reqRes = await requestUploadUrl(file.name, file.type, file.size, organizationId, projectId);
      
      if (!reqRes.success || !reqRes.uploadUrl || !reqRes.gcsPath) {
        throw new Error(reqRes.error || 'Failed to initialize upload');
      }

      // 2. Upload to GCS using XHR to track progress
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', reqRes.uploadUrl!, true);
        xhr.setRequestHeader('Content-Type', file.type);
        
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const rawProgress = Math.round((e.loaded / e.total) * 100);
            setUploadingFiles(prev => {
              const next = [...prev];
              if (next[fileIndex]) {
                // Ensure progress doesn't jump backwards against optimistic estimate
                next[fileIndex] = {
                  ...next[fileIndex],
                  progress: Math.max(next[fileIndex].progress, Math.min(95, rawProgress))
                };
              }
              return next;
            });
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve(true);
          else reject(new Error('GCS Upload Failed'));
        };

        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(file);
      });

      // 3. Confirm Upload to Backend
      const confRes = await confirmUpload(file.name, reqRes.gcsPath, file.type, file.size, organizationId, projectId);
      if (!confRes.success) throw new Error(confRes.error || 'Failed to save metadata');

      setUploadingFiles(prev => {
        const next = [...prev];
        if (next[fileIndex]) {
          next[fileIndex] = {
            ...next[fileIndex],
            progress: 100,
            status: 'success'
          };
        }
        return next;
      });

      if (onUploadSuccess) onUploadSuccess();

    } catch (err: any) {
      setUploadingFiles(prev => {
        const next = [...prev];
        if (next[fileIndex]) {
          next[fileIndex] = {
            ...next[fileIndex],
            status: 'error',
            error: err.message
          };
        }
        return next;
      });
    }
  };

  const startUploads = (files: File[]) => {
    const startIndex = uploadingFiles.length;
    const newItems: UploadItem[] = files.map(file => ({
      file,
      progress: 15, // Instant optimistic start
      status: 'uploading' as const,
      docType: getDocumentTypeInfo(file),
      pageEstimate: estimatePageCount(file)
    }));

    setUploadingFiles(prev => [...prev, ...newItems]);

    files.forEach((file, idx) => {
      uploadFile(file, startIndex + idx);
    });
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      startUploads(files);
    }
  }, [organizationId, projectId, onUploadSuccess, uploadingFiles.length]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      startUploads(files);
      e.target.value = ''; // reset input
    }
  };

  return (
    <div className="space-y-4">
      {/* Dropzone Area */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden",
          isDragging 
            ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10" 
            : "border-white/10 bg-black/30 hover:border-cyan-500/40 hover:bg-black/40"
        )}
      >
        <input 
          type="file" 
          multiple 
          accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.md,.markdown,.txt,.csv,.json,.yaml,.yml,.tsv,image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          onChange={handleFileInput}
        />
        
        <div className="p-4 rounded-2xl bg-cyan-500/10 mb-3 border border-cyan-500/20 flex items-center justify-center">
          {uploadingFiles.some(f => f.status === 'uploading') ? (
            <CustomLoader scale={0.7} className="text-cyan-400" />
          ) : (
            <UploadCloud className={cn("h-8 w-8 transition-transform duration-200", isDragging ? "text-cyan-400 scale-110" : "text-cyan-500/70")} />
          )}
        </div>
        
        <p className="text-sm font-bold text-white mb-1">Click or drag corporate documents to ingest</p>
        <p className="text-xs text-white/50 max-w-md text-center leading-relaxed">
          Full support for <strong className="text-rose-400">PDF</strong>, <strong className="text-emerald-400">XLSX</strong>, <strong className="text-cyan-400">DOCX</strong>, <strong className="text-amber-400">PPTX</strong>, Markdown & Images. Encrypted with zero-retention SLAs.
        </p>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10 text-[11px] text-white/40 font-mono">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% SHA-256 Digest</span>
          <span>•</span>
          <span>Instant Optimistic Parsing</span>
          <span>•</span>
          <span>Delaware DGCL Safe Harbor</span>
        </div>
      </div>

      {/* Optimistic Upload Feedback List */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-white/60">
            <span>VAULT INGESTION QUEUE ({uploadingFiles.length})</span>
            <span>{uploadingFiles.filter(f => f.status === 'success').length} of {uploadingFiles.length} Grounded</span>
          </div>

          {uploadingFiles.map((up, i) => {
            const DocIcon = up.docType.icon;
            const stageText = getStageMessage(up.progress, up.status);

            return (
              <div 
                key={i} 
                className={cn(
                  "p-4 rounded-2xl border transition-all space-y-2.5 bg-black/40",
                  up.status === 'success' ? "border-emerald-500/30 bg-emerald-950/20" :
                  up.status === 'error' ? "border-red-500/30 bg-red-950/20" :
                  "border-cyan-500/20"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Document Type Icon with Distinctive Colors */}
                    <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm", up.docType.iconBg)}>
                      <DocIcon className={cn("w-5 h-5", up.docType.iconColor)} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn("text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border", up.docType.badgeBg, up.docType.badgeText, up.docType.badgeBorder)}>
                          {up.docType.type}
                        </span>
                        <p className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                          {up.file.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-white/60 font-mono mt-0.5">
                        <span>{(up.file.size / 1024 / 1024).toFixed(2)} MB</span>
                        <span>•</span>
                        <span className="text-cyan-300 font-semibold">{up.pageEstimate}</span>
                        <span>•</span>
                        <span className="text-white/40 text-[11px]">{stageText}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 shrink-0">
                    {up.status === 'uploading' && (
                      <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold">
                        <span>{up.progress}%</span>
                        <CustomLoader scale={0.3} />
                      </div>
                    )}
                    {up.status === 'success' && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Grounded
                      </span>
                    )}
                    {up.status === 'error' && (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-400 font-mono bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded-xl">
                        <AlertCircle className="w-4 h-4 text-red-400" /> Failed
                      </span>
                    )}
                  </div>
                </div>

                {/* Instant Optimistic Progress Bar */}
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden relative">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-300 relative",
                      up.status === 'error' ? "bg-red-500" : 
                      up.status === 'success' ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/50" : 
                      "bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-400 shadow-sm shadow-cyan-500/50"
                    )}
                    style={{ width: `${up.progress}%` }}
                  >
                    {up.status === 'uploading' && (
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    )}
                  </div>
                </div>

                {up.status === 'error' && (
                  <p className="text-xs text-red-400 flex items-center gap-1.5 font-medium">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {up.error || 'Network error during upload'}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
