'use client';

/**
 * Guest Simulation & State Persistence Store
 * Enables zero-friction test simulations, demo sandbox runs, and boardroom deliberations
 * for guests while persisting simulation state across sign-in flows.
 */

export interface SavedSimulationState {
  decisionType: string;
  decisionDetails: string;
  simulationResult: any;
  timestamp: number;
}

export interface SavedBoardroomState {
  query: string;
  meetingResult: any;
  timestamp: number;
}

export interface SavedParametricState {
  scenarioId: string;
  sliderValues: Record<string, number>;
  calculatedMetrics: any;
  timestamp: number;
}

export interface SavedAhaState {
  scenarioKey: string;
  timestamp: number;
}

const STORAGE_KEYS = {
  simulation: 'causarix_guest_simulation_state_v1',
  boardroom: 'causarix_guest_boardroom_state_v1',
  parametric: 'causarix_guest_parametric_state_v1',
  aha: 'causarix_guest_aha_state_v1',
  usagePrefix: 'causarix_usage_count_',
} as const;

type StateType = 'simulation' | 'boardroom' | 'parametric' | 'aha';

/**
 * Check if a user is in guest / demo mode (unauthenticated or demo account)
 */
export function isGuestUser(user: any): boolean {
  if (!user) return true;
  const email = (user.email || '').toLowerCase();
  if (!email) return true;
  if (email.includes('guest') || email.includes('demo') || email.includes('admin@apex-global.com')) {
    return true;
  }
  return false;
}

/**
 * Save simulation state into both sessionStorage and localStorage for resilience across reloads and auth redirects
 */
export function saveGuestSimulationState(type: StateType, data: any): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = JSON.stringify({
      ...data,
      timestamp: Date.now(),
    });
    const key = STORAGE_KEYS[type];
    sessionStorage.setItem(key, payload);
    localStorage.setItem(key, payload);
  } catch (err) {
    console.warn('[GUEST STORE] Failed to save state:', err);
  }
}

/**
 * Load persisted simulation state
 */
export function loadGuestSimulationState<T = any>(type: StateType): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const key = STORAGE_KEYS[type];
    const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch (err) {
    console.warn('[GUEST STORE] Failed to load state:', err);
    return null;
  }
}

/**
 * Clear persisted simulation state
 */
export function clearGuestSimulationState(type: StateType): void {
  if (typeof window === 'undefined') return;
  try {
    const key = STORAGE_KEYS[type];
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  } catch (err) {}
}

/**
 * Get the number of runs used by the guest for a specific feature
 */
export function getGuestUsageCount(feature: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const key = `${STORAGE_KEYS.usagePrefix}${feature}`;
    return parseInt(localStorage.getItem(key) || '0', 10);
  } catch {
    return 0;
  }
}

/**
 * Increment and return the number of runs used by the guest for a feature
 */
export function incrementGuestUsageCount(feature: string): number {
  if (typeof window === 'undefined') return 1;
  try {
    const current = getGuestUsageCount(feature);
    const next = current + 1;
    const key = `${STORAGE_KEYS.usagePrefix}${feature}`;
    localStorage.setItem(key, next.toString());
    
    // Dispatch custom event to notify banners
    window.dispatchEvent(new CustomEvent('causarix_guest_request_made', { detail: { feature, count: next } }));
    return next;
  } catch {
    return 1;
  }
}
