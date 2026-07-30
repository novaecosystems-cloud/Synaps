import React from 'react';
import { PageHeaderSkeleton, DocumentGridSkeleton } from '@/components/ui/skeleton';

export default function StrategyLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <PageHeaderSkeleton />
      <DocumentGridSkeleton count={6} />
    </div>
  );
}
