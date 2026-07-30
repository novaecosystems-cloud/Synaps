import React from 'react';
import { PageHeaderSkeleton, BoardroomSkeleton } from '@/components/ui/skeleton';

export default function BoardroomLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <PageHeaderSkeleton />
      <BoardroomSkeleton />
    </div>
  );
}
