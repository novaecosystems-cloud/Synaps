import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 bg-base-100 rounded-xl border border-dashed border-base-300 transition-all hover:bg-base-200/50", className)}>
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-5 ring-4 ring-primary/5">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-base-content">{title}</h3>
      <p className="text-base-content/60 text-sm text-center max-w-sm mt-2 mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary shadow-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
