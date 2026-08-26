'use client';

import { useEffect, useState } from 'react';
import { X, Command, Search } from 'lucide-react';

export function OnboardingHints() {
  const [showSearchHint, setShowSearchHint] = useState(false);

  useEffect(() => {
    const hasDismissed = localStorage.getItem('synaps_onboarding_search_dismissed');
    if (!hasDismissed) {
      const timer = setTimeout(() => {
        setShowSearchHint(true);
      }, 2000);

      // Auto-dismiss after 6 seconds so it never stays permanently on screen
      const autoDismissTimer = setTimeout(() => {
        setShowSearchHint(false);
        localStorage.setItem('synaps_onboarding_search_dismissed', 'true');
      }, 8000);

      return () => {
        clearTimeout(timer);
        clearTimeout(autoDismissTimer);
      };
    }
  }, []);

  const dismissSearchHint = () => {
    setShowSearchHint(false);
    localStorage.setItem('synaps_onboarding_search_dismissed', 'true');
  };

  if (!showSearchHint) return null;

  return (
    <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-3 fade-in duration-300 print:hidden pointer-events-auto">
      <div className="bg-base-100 text-base-content p-4 rounded-2xl shadow-2xl border border-indigo-500/30 max-w-xs relative ring-1 ring-indigo-500/20">
        <button 
          onClick={dismissSearchHint}
          className="absolute top-2.5 right-2.5 p-1 rounded-lg hover:bg-base-200 text-base-content/60 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs mb-1">Quick Search</h4>
            <p className="text-xs text-base-content/70 leading-relaxed mb-2">
              Press <kbd className="font-sans px-1.5 py-0.5 rounded bg-base-200 text-[10px] font-bold border border-base-300 ml-0.5 mr-0.5"><Command className="w-2.5 h-2.5 inline pb-0.5" /> K</kbd> to search across your documents.
            </p>
            <button 
              onClick={dismissSearchHint}
              className="text-[11px] font-bold bg-indigo-600 text-white px-2.5 py-1 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
