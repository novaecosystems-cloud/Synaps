'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles, X, Keyboard, Search, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function GlobalHotkeys() {
  const pathname = usePathname();
  const [showHelper, setShowHelper] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. ESCAPE: Close any open modal, thought inspector, or helper
      if (e.key === 'Escape') {
        if (showHelper) {
          setShowHelper(false);
          e.preventDefault();
          return;
        }
        // Broadcast close event for modals and thought inspectors
        window.dispatchEvent(new CustomEvent('causarix-close-modals'));
        return;
      }

      // 2. CMD / CTRL + K: Open Executive Command Palette / Global Search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        
        // Dispatch custom events for CommandPalette & GlobalSearch
        window.dispatchEvent(new CustomEvent('causarix-open-command-palette'));
        window.dispatchEvent(new CustomEvent('causarix-open-search'));
        return;
      }

      // 3. CMD / CTRL + ENTER: Trigger boardroom deliberation or active simulation run
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();

        // Dispatch causal trigger events
        window.dispatchEvent(new CustomEvent('causarix-trigger-action'));
        window.dispatchEvent(new CustomEvent('causarix-run-deliberation'));
        window.dispatchEvent(new CustomEvent('causarix-run-simulation'));

        // Query active primary action button with data-hotkey="run-action"
        const primaryBtn = document.querySelector<HTMLButtonElement>(
          'button[data-hotkey="run-action"], button[data-action="run-deliberation"], button[data-action="run-simulation"]'
        );

        if (primaryBtn && !primaryBtn.disabled) {
          primaryBtn.click();
          triggerToast('⚡ Executing Primary Action [⌘+Enter]');
        } else if (pathname?.includes('/boardroom')) {
          triggerToast('🏛️ Convening 10-Agent Boardroom Quorum [⌘+Enter]');
        } else if (pathname?.includes('/simulations')) {
          triggerToast('📊 Executing Monte Carlo Risk & VaR Simulation [⌘+Enter]');
        } else {
          triggerToast('⚡ Triggering Deliberation Engine [⌘+Enter]');
        }
        return;
      }

      // 4. TOGGLE SHORTCUTS CHEATSHEET: '?' OR 'Cmd+/'
      if (
        ((e.metaKey || e.ctrlKey) && e.key === '/') ||
        (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName))
      ) {
        e.preventDefault();
        setShowHelper(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pathname, showHelper]);

  const triggerToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 2400);
  };

  return (
    <>
      {/* Visual Executive Action HUD / Toast */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-950/95 border border-cyan-500/50 text-cyan-300 shadow-2xl backdrop-blur-md text-xs font-bold tracking-wide font-mono">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>{activeToast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Power-User Keyboard Shortcuts Cheatsheet Modal */}
      <AnimatePresence>
        {showHelper && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowHelper(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.15 }}
              onClick={e => e.stopPropagation()}
              className="bg-base-100 border border-base-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 text-base-content"
            >
              <div className="flex items-center justify-between border-b border-base-300 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 flex items-center justify-center">
                    <Keyboard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Executive Tactile Hotkeys</h3>
                    <p className="text-xs text-base-content/60 font-medium">Power-user keyboard navigation shortcuts</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHelper(false)}
                  className="p-1.5 rounded-xl text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-base-200/60 border border-base-300">
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-cyan-500" />
                    <div>
                      <div className="text-xs font-bold text-base-content">Global Knowledge & Command Bar</div>
                      <div className="text-[11px] text-base-content/60">Search all corporate nodes, documents & graph</div>
                    </div>
                  </div>
                  <kbd className="px-2.5 py-1 rounded-lg bg-base-100 border border-base-300 font-mono text-xs font-bold text-cyan-500 shadow-sm">
                    ⌘ / Ctrl + K
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-base-200/60 border border-base-300">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="text-xs font-bold text-base-content">Trigger Deliberation / Simulation</div>
                      <div className="text-[11px] text-base-content/60">Convene 10-Agent Boardroom or Monte Carlo Run</div>
                    </div>
                  </div>
                  <kbd className="px-2.5 py-1 rounded-lg bg-base-100 border border-base-300 font-mono text-xs font-bold text-amber-500 shadow-sm">
                    ⌘ / Ctrl + ⏎
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-base-200/60 border border-base-300">
                  <div className="flex items-center gap-3">
                    <X className="w-4 h-4 text-rose-500" />
                    <div>
                      <div className="text-xs font-bold text-base-content">Dismiss Modal / Thought Inspector</div>
                      <div className="text-[11px] text-base-content/60">Close active popups, inspectors and overlays</div>
                    </div>
                  </div>
                  <kbd className="px-2.5 py-1 rounded-lg bg-base-100 border border-base-300 font-mono text-xs font-bold text-rose-500 shadow-sm">
                    Esc
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-base-200/60 border border-base-300">
                  <div className="flex items-center gap-3">
                    <Keyboard className="w-4 h-4 text-purple-500" />
                    <div>
                      <div className="text-xs font-bold text-base-content">Toggle Hotkeys Cheatsheet</div>
                      <div className="text-[11px] text-base-content/60">Open or close this quick reference modal</div>
                    </div>
                  </div>
                  <kbd className="px-2.5 py-1 rounded-lg bg-base-100 border border-base-300 font-mono text-xs font-bold text-purple-500 shadow-sm">
                    ? or ⌘ /
                  </kbd>
                </div>
              </div>

              <div className="pt-2 border-t border-base-300 flex justify-between items-center text-xs text-base-content/60">
                <span className="font-mono text-[11px]">Causarix Tactile Ergonomics Core</span>
                <button
                  onClick={() => setShowHelper(false)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-sm"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default GlobalHotkeys;
