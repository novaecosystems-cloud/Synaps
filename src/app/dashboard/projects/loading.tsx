import React from 'react';
import { PageHeaderSkeleton, DocumentGridSkeleton, TableSkeleton } from '@/components/ui/skeleton';

export default function ProjectsLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <PageHeaderSkeleton />
      <DocumentGridSkeleton count={6} />
      <TableSkeleton rows={4} cols={4} />
    </div>
  );
}
