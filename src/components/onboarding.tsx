'use client';

import React, { useEffect, useState } from 'react';
import { X, Command, Search } from 'lucide-react';

export function OnboardingHints() {
  const [showSearchHint, setShowSearchHint] = useState(false);

  useEffect(() => {
    // Only show if the user hasn't dismissed it before
    const hasDismissed = localStorage.getItem('synaps_onboarding_search_dismissed');
    if (!hasDismissed) {
      // Delay slightly so it pops up nicely
      const timer = setTimeout(() => {
        setShowSearchHint(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissSearchHint = () => {
    setShowSearchHint(false);
    localStorage.setItem('synaps_onboarding_search_dismissed', 'true');
  };

  if (!showSearchHint) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500 print:hidden">
      <div className="bg-primary/95 text-primary-foreground p-4 rounded-xl shadow-2xl shadow-primary/20 max-w-sm border border-primary/20 relative">
        <button 
          onClick={dismissSearchHint}
          className="absolute top-2 right-2 p-1 rounded-md hover:bg-primary-foreground/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start gap-3 mt-1">
          <div className="p-2 bg-primary-foreground/10 rounded-lg">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">Quick Search</h4>
            <p className="text-xs text-primary-foreground/80 leading-relaxed mb-3">
              Press <kbd className="font-sans px-1.5 py-0.5 rounded-sm bg-primary-foreground/20 text-xs shadow-sm ml-0.5 mr-0.5"><Command className="w-3 h-3 inline pb-0.5" /> K</kbd> anywhere to quickly search across all your projects, documents, and requirements.
            </p>
            <button 
              onClick={dismissSearchHint}
              className="text-xs font-medium bg-primary-foreground text-primary px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
