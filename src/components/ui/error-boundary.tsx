'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ShieldAlert, ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface IsolatedErrorBoundaryProps {
  children?: ReactNode;
  name?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallback?: ReactNode | ((retry: () => void, error: Error | null) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRetry?: () => void;
  resetKeys?: any[];
  className?: string;
  compact?: boolean;
  showDetails?: boolean;
}

export interface IsolatedErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  isDetailsExpanded: boolean;
}

/**
 * IsolatedErrorBoundary
 * Prevents any single component crash (e.g. WebGL context loss, chart render error, network drop)
 * from crashing the entire page or neighboring components.
 * Provides a 1-click "Auto-Recover / Retry" button with key-based remounting.
 */
export class IsolatedErrorBoundary extends Component<IsolatedErrorBoundaryProps, IsolatedErrorBoundaryState> {
  public state: IsolatedErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    retryCount: 0,
    isDetailsExpanded: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<IsolatedErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[IsolatedErrorBoundary - ${this.props.name || 'Anonymous'}] Caught component crash:`, error, errorInfo);
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  public componentDidUpdate(prevProps: IsolatedErrorBoundaryProps) {
    if (this.state.hasError && this.props.resetKeys && prevProps.resetKeys) {
      const hasChanged = this.props.resetKeys.length !== prevProps.resetKeys.length ||
        this.props.resetKeys.some((val, idx) => val !== prevProps.resetKeys?.[idx]);
      if (hasChanged) {
        this.handleRetry();
      }
    }
  }

  public handleRetry = () => {
    this.props.onRetry?.();
    this.setState((prev) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prev.retryCount + 1,
      isDetailsExpanded: false,
    }));
  };

  private toggleDetails = () => {
    this.setState((prev) => ({ isDetailsExpanded: !prev.isDetailsExpanded }));
  };

  public render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.handleRetry, this.state.error);
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { name, fallbackTitle, fallbackDescription, className, compact } = this.props;
      const { error, isDetailsExpanded } = this.state;

      if (compact) {
        return (
          <div
            className={cn(
              "flex items-center justify-between p-3 rounded-2xl bg-black/60 border border-amber-500/30 text-white backdrop-blur-md gap-3",
              className
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="text-xs font-bold text-amber-300">
                  {name ? `[${name}] ` : ''}{fallbackTitle || 'Component Isolated'}
                </span>
                <p className="text-[11px] text-neutral-400 truncate">
                  {error?.message || 'Recovering from unexpected state'}
                </p>
              </div>
            </div>
            <Button
              onClick={this.handleRetry}
              size="sm"
              variant="outline"
              className="rounded-xl border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-white font-bold text-xs gap-1.5 h-8 px-2.5 shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </Button>
          </div>
        );
      }

      return (
        <div
          className={cn(
            "flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl bg-black/80 border border-amber-500/30 text-white backdrop-blur-xl shadow-2xl text-center space-y-4 relative overflow-hidden",
            className
          )}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-rose-500/5 pointer-events-none" />

          {/* Warning Icon Badge */}
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div className="space-y-1.5 max-w-md z-10">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {name && (
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {name}
                </span>
              )}
              <h3 className="text-base font-bold text-white tracking-tight">
                {fallbackTitle || 'Component Isolated & Shielded'}
              </h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              {fallbackDescription ||
                'A transient render error was contained in this component. Neighboring views and system state remain 100% operational.'}
            </p>
            {error?.message && (
              <p className="text-[11px] font-mono text-amber-400/90 bg-amber-950/40 border border-amber-500/20 px-3 py-1.5 rounded-xl inline-block mt-2 max-w-full truncate">
                {error.message}
              </p>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 z-10 flex-wrap justify-center pt-2">
            <Button
              onClick={this.handleRetry}
              className="rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-extrabold text-xs uppercase tracking-wider gap-2 py-2.5 px-5 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Auto-Recover / Retry</span>
            </Button>

            {error?.stack && (
              <button
                onClick={this.toggleDetails}
                className="text-[11px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1"
              >
                <Terminal className="w-3 h-3" />
                <span>{isDetailsExpanded ? 'Hide Trace' : 'Inspect Trace'}</span>
                {isDetailsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {/* Technical Diagnostics Trace (Collapsible) */}
          {isDetailsExpanded && error?.stack && (
            <div className="w-full max-w-xl text-left bg-black/90 border border-white/10 rounded-2xl p-4 text-[10px] font-mono text-neutral-300 overflow-x-auto max-h-40 custom-scrollbar z-10">
              <div className="text-amber-400 font-bold mb-1">Stack Trace:</div>
              <pre className="whitespace-pre-wrap">{error.stack}</pre>
            </div>
          )}
        </div>
      );
    }

    return (
      <React.Fragment key={this.state.retryCount}>
        {this.props.children}
      </React.Fragment>
    );
  }
}

// Backwards compatibility alias
export const ErrorBoundary = IsolatedErrorBoundary;
export default IsolatedErrorBoundary;
