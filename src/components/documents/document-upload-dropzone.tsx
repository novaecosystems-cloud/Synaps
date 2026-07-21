'use client';

import React, { useCallback, useState } from 'react';
import { UploadCloud, File as FileIcon, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { requestUploadUrl, confirmUpload } from '@/app/actions/document';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CustomLoader } from '@/components/ui/custom-loader';

interface DocumentUploadDropzoneProps {
  organizationId: string;
  projectId?: string;
  onUploadSuccess?: () => void;
}

export function DocumentUploadDropzone({ organizationId, projectId, onUploadSuccess }: DocumentUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Array<{
    file: File;
    progress: number;
    status: 'uploading' | 'success' | 'error';
    error?: string;
  }>>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const uploadFile = async (file: File, index: number) => {
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
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploadingFiles(prev => {
              const next = [...prev];
              next[index].progress = progress;
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
        next[index].status = 'success';
        return next;
      });

      if (onUploadSuccess) onUploadSuccess();

    } catch (err: any) {
      setUploadingFiles(prev => {
        const next = [...prev];
        next[index].status = 'error';
        next[index].error = err.message;
        return next;
      });
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      
      const newUploads = files.map(file => ({
        file,
        progress: 0,
        status: 'uploading' as const
      }));

      setUploadingFiles(prev => [...newUploads, ...prev]);

      // Start uploads
      files.forEach((file, idx) => {
        uploadFile(file, idx);
      });
    }
  }, [organizationId, projectId, onUploadSuccess]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      const newUploads = files.map(file => ({
        file,
        progress: 0,
        status: 'uploading' as const
      }));

      setUploadingFiles(prev => [...newUploads, ...prev]);

      files.forEach((file, idx) => {
        uploadFile(file, idx);
      });
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
          "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-colors cursor-pointer overflow-hidden",
          isDragging ? "border-primary bg-primary/5" : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/30"
        )}
      >
        <input 
          type="file" 
          multiple 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          onChange={handleFileInput}
        />
        <div className="p-4 rounded-full bg-white/5 mb-4 border border-white/10 flex items-center justify-center min-h-[5rem] min-w-[5rem]">
          {uploadingFiles.some(f => f.status === 'uploading') ? (
            <CustomLoader scale={0.6} className="text-primary" />
          ) : (
            <UploadCloud className={cn("h-8 w-8 transition-colors", isDragging ? "text-primary" : "text-muted-foreground")} />
          )}
        </div>
        <p className="text-sm font-medium text-white mb-1">Click or drag files to upload</p>
        <p className="text-xs text-muted-foreground max-w-sm text-center">
          Support for PDF, DOCX, XLSX, PPTX, and Images up to 10GB.
        </p>
      </div>

      {/* Upload Progress List */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((up, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-black/40">
              <div className="flex-shrink-0 p-2 rounded bg-white/5 border border-white/10">
                <FileIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-white truncate pr-4">{up.file.name}</p>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {(up.file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                {/* Progress Bar Container */}
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      up.status === 'error' ? "bg-red-500" : "bg-primary"
                    )}
                    style={{ width: `${up.progress}%` }}
                  />
                </div>
                {up.status === 'error' && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {up.error}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 ml-4 flex items-center justify-center w-12 h-12">
                {up.status === 'uploading' && <CustomLoader scale={0.3} />}
                {up.status === 'success' && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                {up.status === 'error' && <X className="h-6 w-6 text-red-500" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
