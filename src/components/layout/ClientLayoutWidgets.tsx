"use client";

import { useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

const CommandPalette = dynamic(() => import("@/components/CommandPalette"), { ssr: false });
const GlobalHotkeys = dynamic(() => import("@/components/GlobalHotkeys"), { ssr: false });
const AppUpdateNotifier = dynamic(() => import("@/components/AppUpdateNotifier"), { ssr: false });
const OfflineNetworkGuardian = dynamic(() => import("@/components/OfflineNetworkGuardian"), { ssr: false });

export function ClientLayoutWidgets() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay non-critical widgets slightly on mobile to prioritize main thread for paint
    const timer = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Toaster />
      <Analytics />
      {mounted && (
        <>
          <CommandPalette />
          <GlobalHotkeys />
          <AppUpdateNotifier />
          <OfflineNetworkGuardian />
        </>
      )}
    </>
  );
}

export default ClientLayoutWidgets;
