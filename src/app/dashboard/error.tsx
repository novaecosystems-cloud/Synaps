'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 ring-4 ring-destructive/5">
        <ShieldAlert className="h-10 w-10 text-destructive" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Something went wrong!</h2>
        <p className="mt-2 text-muted-foreground text-sm max-w-[500px]">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => window.location.href = '/dashboard/projects'} variant="outline">
          Return to Projects
        </Button>
        <Button onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
}
