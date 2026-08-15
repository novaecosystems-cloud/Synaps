'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { loginAction, logoutAction } from '@/app/actions/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  sessionExpiresAt: number | null;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  sessionExpiresAt: null,
  logout: async () => {},
  refreshSession: async () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);
  const isRefreshingRef = useRef(false);

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {});
      await logoutAction().catch(() => {});
      if (auth) await auth.signOut().catch(() => {});
      setUser(null);
      setSessionExpiresAt(null);
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/demo')) {
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, []);

  // Seamless Background Token & Session Refresh
  const refreshSession = useCallback(async (force = false): Promise<boolean> => {
    if (isRefreshingRef.current) return true;
    if (!auth || !auth.currentUser) return false;

    try {
      isRefreshingRef.current = true;
      const token = await auth.currentUser.getIdToken(force);
      const res = await loginAction(token);

      if (res?.success) {
        // Fetch session expiration timestamp
        const sessionRes = await fetch('/api/auth/session');
        if (sessionRes.ok) {
          const data = await sessionRes.json();
          setSessionExpiresAt(data.expiresAt || null);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.warn('[AUTH] Background session refresh note:', err);
      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    // 1. Firebase Persistent Auth Listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          await loginAction(token);

          const res = await fetch('/api/auth/session');
          if (res.ok) {
            const data = await res.json();
            setSessionExpiresAt(data.expiresAt || null);
          }
        } catch (e) {
          console.warn('[AUTH] Initial session synchronization error:', e);
        }
      }
      
      setLoading(false);
    });

    // 2. Refresh session on tab focus / window visibility restoration
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible' && auth.currentUser) {
        refreshSession(false);
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    // 3. Periodic Background Token Renewal (Every 15 minutes to keep 30-day session warm)
    const renewalInterval = setInterval(() => {
      if (auth.currentUser) {
        refreshSession(false);
      }
    }, 15 * 60 * 1000);

    // 4. Session Health Monitor (Every 5 minutes)
    const healthInterval = setInterval(async () => {
      if (typeof window !== 'undefined' && (window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/demo'))) {
        return;
      }
      try {
        const res = await fetch('/api/auth/session');
        if (res.status === 401) {
          // If server reports expired cookie but Firebase Client has an active user, silently re-authenticate!
          if (auth.currentUser) {
            console.log('[AUTH] Server session cookie refreshed silently via active Firebase user.');
            await refreshSession(true);
          }
        } else if (res.ok) {
          const data = await res.json();
          setSessionExpiresAt(data.expiresAt || null);
        }
      } catch (e) {
        // Silently ignore network hiccups
      }
    }, 5 * 60 * 1000);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      clearInterval(renewalInterval);
      clearInterval(healthInterval);
    };
  }, [refreshSession]);

  return (
    <AuthContext.Provider value={{ user, loading, sessionExpiresAt, logout: handleLogout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
