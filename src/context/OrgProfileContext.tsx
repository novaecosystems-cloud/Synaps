'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { OrgProfile, Sector, OrgSize, OrgPriority } from '@/lib/org-adaptive-content';

interface OrgProfileContextValue {
  profile: OrgProfile | null;
  isLoading: boolean;
  isOnboardingComplete: boolean;
  refresh: () => void;
}

const OrgProfileContext = createContext<OrgProfileContextValue>({
  profile: null,
  isLoading: true,
  isOnboardingComplete: false,
  refresh: () => {},
});

/**
 * Provides org profile (sector, companyName, customAgents, etc.) to all dashboard pages.
 * Reads from org.settings JSON — no additional DB columns required.
 */
export function OrgProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<OrgProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();

      // settings is stored as a JSON object in org.settings
      const settings = data.organization?.settings ?? {};

      const orgProfile: OrgProfile = {
        sector: (settings.sector as Sector) || 'default',
        orgType: settings.orgType || 'enterprise',
        companyName: settings.companyName || data.organization?.name || 'Your Organisation',
        size: (settings.size as OrgSize) || '11-50',
        primaryRole: settings.primaryRole || 'executive',
        priorities: (settings.priorities as OrgPriority[]) || [],
        onboardingCompleted: settings.onboardingCompleted === true,
        customAgents: settings.customAgents || [],
        customMetrics: settings.customMetrics || [],
      };

      setProfile(orgProfile);
    } catch (err) {
      console.error('[OrgProfileContext] Failed to load org profile:', err);
      // Fall back to a safe default so dashboard doesn't break
      setProfile({
        sector: 'default',
        orgType: 'enterprise',
        companyName: 'Your Organisation',
        size: '11-50',
        primaryRole: 'executive',
        priorities: [],
        onboardingCompleted: false,
        customAgents: [],
        customMetrics: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <OrgProfileContext.Provider
      value={{
        profile,
        isLoading,
        isOnboardingComplete: profile?.onboardingCompleted === true,
        refresh: fetchProfile,
      }}
    >
      {children}
    </OrgProfileContext.Provider>
  );
}

/**
 * Hook to access org profile anywhere inside the dashboard.
 * Usage: const { profile, isLoading } = useOrgProfile();
 */
export function useOrgProfile(): OrgProfileContextValue {
  return useContext(OrgProfileContext);
}
