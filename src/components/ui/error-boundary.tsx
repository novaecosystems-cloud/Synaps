'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-black/50 text-white p-4 border border-red-500/30 rounded-lg">
          <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
          <h2 className="text-lg font-bold">Something went wrong</h2>
          <p className="text-sm text-gray-400 text-center max-w-xs mt-1">
            {this.state.error?.message || 'Failed to load this section.'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
