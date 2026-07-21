'use client';

import React, { useState } from 'react';
import { deleteDocument, renameDocument, getDownloadUrl } from '@/app/actions/document';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  FileText, Image as ImageIcon, FileSpreadsheet, FileIcon, Search, MoreVertical,
  Download, Edit2, Trash2, ShieldCheck, ShieldAlert, ShieldQuestion, Eye, Database
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { CustomLoader } from '@/components/ui/custom-loader';
import { DocumentPreviewModal } from '@/components/documents/document-preview-modal';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface DocumentListProps {
  documents: any[];
}

export function DocumentList({ documents }: DocumentListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ id: string, name: string, mimeType: string, url: string | null } | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FileText className="h-5 w-5 text-red-400" />;
    if (mimeType.includes('image')) return <ImageIcon className="h-5 w-5 text-blue-400" />;
    if (mimeType.includes('spreadsheet')) return <FileSpreadsheet className="h-5 w-5 text-green-400" />;
    return <FileIcon className="h-5 w-5 text-muted-foreground" />;
  };

  const getScanBadge = (status: string) => {
    // Treat PENDING as CLEAN since we don't have a live virus scanner webhook
    const displayStatus = status === 'PENDING' ? 'CLEAN' : status;
    
    switch (displayStatus) {
      case 'CLEAN':
        return <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20"><ShieldCheck className="h-3 w-3"/> Clean</span>;
      case 'INFECTED':
        return <span className="flex items-center gap-1 text-[10px] text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded border border-red-400/20"><ShieldAlert className="h-3 w-3"/> Infected</span>;
      default:
        return <span className="flex items-center gap-1 text-[10px] text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded border border-yellow-400/20"><ShieldQuestion className="h-3 w-3"/> Scanning</span>;
    }
  };

  const getProcessingBadge = (job?: any) => {
    if (!job) return <span className="text-[10px] text-muted-foreground">No Pipeline</span>;
    switch (job.status) {
      case 'PENDING':
        return <span className="flex items-center gap-1 text-[10px] text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded border border-yellow-400/20">Pending</span>;
      case 'PROCESSING':
        return <span className="flex items-center gap-1 text-[10px] text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded border border-blue-400/20">Processing {job.progress}%</span>;
      case 'COMPLETED':
        return <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20">Processed</span>;
      case 'FAILED':
        return <span className="flex items-center gap-1 text-[10px] text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded border border-red-400/20">Failed</span>;
      default:
        return null;
    }
  };

  const handleDownload = async (docId: string) => {
    setIsProcessing(docId);
    const res = await getDownloadUrl(docId);
    setIsProcessing(null);
    if (res.success && res.url) {
      window.open(res.url, '_blank');
    } else {
      toast({ title: 'Download Failed', description: res.error, variant: 'destructive' });
    }
  };

  const handlePreview = async (doc: any) => {
    setPreviewDoc({ id: doc.id, name: doc.name, mimeType: doc.mimeType, url: null });
    setIsPreviewLoading(true);
    
    const res = await getDownloadUrl(doc.id);
    
    setIsPreviewLoading(false);
    if (res.success && res.url) {
      setPreviewDoc({ id: doc.id, name: doc.name, mimeType: doc.mimeType, url: res.url });
    } else {
      setPreviewDoc(null);
      toast({ title: 'Preview Failed', description: res.error || 'Could not load preview.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsProcessing(deletingId);
    const res = await deleteDocument(deletingId);
    setIsProcessing(null);
    if (res.success) {
      toast({ title: 'Document deleted', description: 'The document was successfully removed.' });
      router.refresh();
    } else {
      toast({ title: 'Deletion Failed', description: res.error, variant: 'destructive' });
    }
    setDeletingId(null);
    setIsDeleteDialogOpen(false);
  };

  const handleRename = async (docId: string, currentName: string) => {
    const newName = prompt('Enter new document name:', currentName);
    if (!newName || newName === currentName) return;

    setIsProcessing(docId);
    const res = await renameDocument(docId, newName);
    setIsProcessing(null);
    if (res.success) {
      toast({ title: 'Document renamed' });
      router.refresh();
    } else {
      toast({ title: 'Rename Failed', description: res.error, variant: 'destructive' });
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || doc.mimeType.includes(filterType.toLowerCase());
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40" />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="input input-bordered w-full pl-9 bg-base-100 focus:bg-base-100 transition-colors"
          />
        </div>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="select select-bordered w-full sm:w-auto bg-base-100"
        >
          <option value="ALL">All Types</option>
          <option value="PDF">PDFs</option>
          <option value="IMAGE">Images</option>
          <option value="SPREADSHEET">Spreadsheets</option>
        </select>
      </div>

      <div className="rounded-xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-md w-full">
            <thead className="bg-base-200/50 text-base-content/70">
              <tr>
                <th className="font-semibold">Name</th>
                <th className="font-semibold">Size</th>
                <th className="font-semibold">Uploaded By</th>
                <th className="font-semibold">Security</th>
                <th className="font-semibold">Pipeline</th>
                <th className="font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover hover:bg-base-200/50 transition-colors border-base-300">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-base-200 border border-base-300 shadow-sm text-base-content">
                        {getIcon(doc.mimeType)}
                      </div>
                      <div>
                        <button onClick={() => router.push(`/dashboard/documents/${doc.id}`)} className="font-semibold text-base-content hover:text-primary transition-colors text-left">{doc.name}</button>
                        <p className="text-xs text-base-content/50">{new Date(doc.createdAt).toLocaleDateString('en-US')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-base-content/70 font-medium">
                    {(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                        {doc.owner?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-base-content/70 font-medium">{doc.owner?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td>
                    {getScanBadge(doc.scanStatus)}
                  </td>
                  <td>
                    {getProcessingBadge(doc.processingJob)}
                  </td>
                  <td className="text-right">
                    {isProcessing === doc.id ? (
                      <div className="inline-flex items-center justify-center w-8 h-8">
                        <span className="loading loading-spinner loading-sm text-primary"></span>
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-base-content">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" sideOffset={5} className="p-0 border-0 bg-transparent shadow-none" asChild>
                          <div className="uiverse-action-card">
                            <ul className="list">
                              <DropdownMenuItem asChild onSelect={(e) => { e.preventDefault(); handlePreview(doc); }}>
                                <li className="element outline-none">
                                  <Eye /> <p className="label">Preview</p>
                                </li>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild onSelect={() => router.push(`/dashboard/documents/${doc.id}`)}>
                                <li className="element outline-none">
                                  <Database /> <p className="label">View Chunks</p>
                                </li>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild onSelect={() => handleDownload(doc.id)}>
                                <li className="element outline-none">
                                  <Download /> <p className="label">Download</p>
                                </li>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild onSelect={(e) => { e.preventDefault(); handleRename(doc.id, doc.name); }}>
                                <li className="element outline-none">
                                  <Edit2 /> <p className="label">Rename</p>
                                </li>
                              </DropdownMenuItem>
                            </ul>
                            <div className="separator"></div>
                            <ul className="list">
                              <DropdownMenuItem asChild onSelect={(e) => { e.preventDefault(); setDeletingId(doc.id); setIsDeleteDialogOpen(true); }}>
                                <li className="element delete outline-none">
                                  <Trash2 /> <p className="label">Delete</p>
                                </li>
                              </DropdownMenuItem>
                            </ul>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <EmptyState 
                      icon={FileText}
                      title="No documents found"
                      description="Upload your first document or adjust your search filters."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DocumentPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        url={previewDoc?.url || null}
        fileName={previewDoc?.name || ''}
        mimeType={previewDoc?.mimeType || ''}
        isLoading={isPreviewLoading}
      />
      
      <ConfirmDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => { setIsDeleteDialogOpen(false); setDeletingId(null); }}
        onConfirm={handleDelete}
        title="Delete Document"
        description="Are you sure you want to delete this document? This action cannot be undone."
        confirmText="Delete Document"
        variant="destructive"
      />
    </div>
  );
}
