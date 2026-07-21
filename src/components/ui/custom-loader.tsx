import React from 'react';
import { cn } from '@/lib/utils';

interface CustomLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  scale?: number;
}

export function CustomLoader({ className, scale = 1, ...props }: CustomLoaderProps) {
  return (
    <div 
      className={cn("flex items-center justify-center", className)}
      style={{ transform: `scale(${scale})` }}
      {...props}
    >
      <div className="synaps-loader"></div>
    </div>
  );
}
