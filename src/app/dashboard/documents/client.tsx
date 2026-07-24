'use client';

import React, { useState, useEffect } from 'react';
import { DocumentUploadDropzone } from '@/components/documents/document-upload-dropzone';
import { DocumentList } from '@/components/documents/document-list';
import { Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DocumentsClientProps {
  organizationId: string;
  initialDocuments: any[];
}

export function DocumentsClient({ organizationId, initialDocuments }: DocumentsClientProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Check if any documents are currently pending
    const hasPendingJobs = initialDocuments.some(doc => 
      doc.scanStatus === 'PENDING' || doc.processingJob?.status === 'PENDING'
    );
    
    if (hasPendingJobs) {
      // Execute fast job processing worker
      fetch('/api/jobs/process').then(res => res.json()).then(() => {
        router.refresh();
      }).catch(console.error);
    }
  }, [initialDocuments, router]);

  const handleUploadSuccess = () => {
    router.refresh();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between tour-documents-header">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Document Vault</h1>
          <p className="text-base-content/60 text-sm mt-1">Securely manage your organization's files.</p>
        </div>
        <button 
          onClick={() => setIsUploading(!isUploading)}
          className="btn btn-primary shadow-sm"
        >
          {isUploading ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Upload File</>}
        </button>
      </div>

      {isUploading && (
        <div className="bg-base-200/50 border border-base-300 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-base-content mb-4">Upload New Documents</h2>
          <DocumentUploadDropzone 
            organizationId={organizationId} 
            onUploadSuccess={handleUploadSuccess} 
          />
        </div>
      )}

      <div className="mt-8">
        <DocumentList documents={initialDocuments} />
      </div>
    </div>
  );
}
