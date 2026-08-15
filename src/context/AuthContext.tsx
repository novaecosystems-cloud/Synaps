'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { loginAction, logoutAction } from '@/app/actions/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  sessionExpiresAt: number | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  sessionExpiresAt: null,
  logout: async () => {},
});

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes inactivity threshold

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {});
      await logoutAction().catch(() => {});
      if (auth) await auth.signOut().catch(() => {});
      setUser(null);
      setSessionExpiresAt(null);
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?reason=session_expired';
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Reset user inactivity timer on activity
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      console.warn('[AUTH] User inactive for 30 minutes. Auto-logging out...');
      handleLogout();
    }, INACTIVITY_TIMEOUT_MS);
  };

  useEffect(() => {
    // 1. Listen for user activity to manage inactivity timeout
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    activityEvents.forEach(evt => window.addEventListener(evt, resetInactivityTimer));
    resetInactivityTimer();

    // 2. Firebase Auth Listener
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          await loginAction(token);

          // Fetch session expiration details from API
          const res = await fetch('/api/auth/session');
          if (res.ok) {
            const data = await res.json();
            setSessionExpiresAt(data.expiresAt || null);
          }
        } catch (e) {
          console.warn('Failed to verify session details:', e);
        }
      }
      
      setLoading(false);
    });

    // 3. Periodic Session Expiration Health Check (Every 5 minutes for active sessions)
    const healthInterval = setInterval(async () => {
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/login')) {
        return; // Skip health checks on login screen
      }
      try {
        const res = await fetch('/api/auth/session');
        if (res.status === 401 && user) {
          console.warn('[AUTH] Session expired on server. Logging out...');
          handleLogout();
        } else if (res.ok) {
          const data = await res.json();
          setSessionExpiresAt(data.expiresAt || null);
        }
      } catch (e) {
        // Silently ignore network check failures
      }
    }, 5 * 60 * 1000);

    return () => {
      unsubscribe();
      clearInterval(healthInterval);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      activityEvents.forEach(evt => window.removeEventListener(evt, resetInactivityTimer));
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, sessionExpiresAt, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
