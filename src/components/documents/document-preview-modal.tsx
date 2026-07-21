import React from 'react';
import { X, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomLoader } from '@/components/ui/custom-loader';
import { cn } from '@/lib/utils';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string | null;
  mimeType: string;
  fileName: string;
  isLoading?: boolean;
}

export function DocumentPreviewModal({ isOpen, onClose, url, mimeType, fileName, isLoading }: DocumentPreviewModalProps) {
  if (!isOpen) return null;

  const isImage = mimeType.startsWith('image/');
  const isPdf = mimeType === 'application/pdf';
  const isPreviewable = isImage || isPdf;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative flex flex-col w-full max-w-5xl h-[85vh] bg-[#0A0A0E] border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3 truncate pr-4">
            <span className="font-semibold text-white truncate">{fileName}</span>
            <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded border border-white/5">
              {mimeType}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {url && (
              <Button variant="outline" size="sm" className="h-8 gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {isPreviewable ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                  {isPreviewable ? 'Open in New Tab' : 'Download File'}
                </a>
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center bg-black/20 p-4 overflow-auto relative">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <CustomLoader scale={0.8} />
              <p className="text-sm font-medium animate-pulse mt-4">Generating secure preview...</p>
            </div>
          ) : !url ? (
            <div className="text-red-400 text-sm">Failed to load preview URL.</div>
          ) : isImage ? (
            <img 
              src={url} 
              alt={fileName} 
              className="max-w-full max-h-full object-contain rounded shadow-lg border border-white/5" 
            />
          ) : isPdf ? (
            <iframe 
              src={`${url}#toolbar=0`} 
              className="w-full h-full rounded border border-white/5 bg-white"
              title={fileName}
            />
          ) : (
            <div className="flex flex-col items-center gap-4 p-8 text-center max-w-sm">
              <div className="p-4 rounded-full bg-white/5 border border-white/10">
                <Download className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">No Preview Available</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Web browsers cannot natively preview <strong>{mimeType}</strong> files securely. Please download the file to view it.
                </p>
                <Button className="w-full gap-2" asChild>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" /> Download File
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
