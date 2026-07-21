import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  scale?: number;
}

export function Spinner({ className, scale = 1, style, ...props }: SpinnerProps) {
  return (
    <div 
      className={cn("spinner", className)} 
      style={{ 
        transform: `scale(${scale})`, 
        marginLeft: 0, // Override the -75px margin from the original CSS
        ...style 
      }}
      {...props}
    >
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
