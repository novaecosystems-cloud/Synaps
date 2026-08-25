'use client';

/**
 * 0ms Back-Navigation In-Memory & Session ViewModel Cache
 * 
 * Provides instantaneous 0ms synchronous hydration when navigating back and forth
 * between dashboard tabs (SCM Monte Carlo Simulations, 10-Agent Boardroom Deliberations,
 * Parametric Counterfactual Studio).
 * 
 * Hierarchy:
 * 1. Module-level in-memory Map (0ms lookup, 0 deserialization overhead)
 * 2. SessionStorage / LocalStorage mirror (persists across page reloads / auth redirects)
 */

export interface CachedSimulationViewModel {
  decisionType: string;
  decisionDetails: string;
  simulationResult: any;
  activeScenarioTab?: 'expected' | 'optimistic' | 'worstCase';
  activeScenarioId?: string | null;
  timestamp: number;
}

export interface CachedBoardroomViewModel {
  query: string;
  meetingResult: any;
  activeScenarioId?: string | null;
  selectedExecutiveId?: string | null;
  timestamp: number;
}

export interface CachedParametricViewModel {
  scenarioId: string;
  sliderValues: Record<string, Record<string, number>>;
  customScenarios?: any[];
  timestamp: number;
}

const STORAGE_KEYS = {
  simulation: 'causarix_vm_cache_simulation_v1',
  boardroom: 'causarix_vm_cache_boardroom_v1',
  parametric: 'causarix_vm_cache_parametric_v1',
  simulationHistory: 'causarix_vm_history_simulations_v1',
  boardroomHistory: 'causarix_vm_history_boardrooms_v1',
} as const;

// Module-level in-memory cache stores (lives across client SPA tab switches)
let memorySimulationCache: CachedSimulationViewModel | null = null;
let memoryBoardroomCache: CachedBoardroomViewModel | null = null;
let memoryParametricCache: CachedParametricViewModel | null = null;
const memorySimulationHistory: CachedSimulationViewModel[] = [];
const memoryBoardroomHistory: CachedBoardroomViewModel[] = [];

// Hydrate memory cache synchronously from storage on initial module evaluation in browser
if (typeof window !== 'undefined') {
  try {
    const rawSim = sessionStorage.getItem(STORAGE_KEYS.simulation) || localStorage.getItem(STORAGE_KEYS.simulation);
    if (rawSim) memorySimulationCache = JSON.parse(rawSim);
  } catch {}

  try {
    const rawBoard = sessionStorage.getItem(STORAGE_KEYS.boardroom) || localStorage.getItem(STORAGE_KEYS.boardroom);
    if (rawBoard) memoryBoardroomCache = JSON.parse(rawBoard);
  } catch {}

  try {
    const rawParam = sessionStorage.getItem(STORAGE_KEYS.parametric) || localStorage.getItem(STORAGE_KEYS.parametric);
    if (rawParam) memoryParametricCache = JSON.parse(rawParam);
  } catch {}
}

// ── SCM SIMULATION CACHE ──────────────────────────────────────────────────────

export function getCachedSimulation(): CachedSimulationViewModel | null {
  if (memorySimulationCache) return memorySimulationCache;
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.simulation) || localStorage.getItem(STORAGE_KEYS.simulation);
    if (raw) {
      memorySimulationCache = JSON.parse(raw);
      return memorySimulationCache;
    }
  } catch {}
  return null;
}

export function setCachedSimulation(data: Omit<CachedSimulationViewModel, 'timestamp'>): void {
  const payload: CachedSimulationViewModel = {
    ...data,
    timestamp: Date.now(),
  };
  memorySimulationCache = payload;

  // Append to history (max 20 items)
  const existingIdx = memorySimulationHistory.findIndex(
    h => h.decisionType === data.decisionType && h.decisionDetails === data.decisionDetails
  );
  if (existingIdx >= 0) {
    memorySimulationHistory.splice(existingIdx, 1);
  }
  memorySimulationHistory.unshift(payload);
  if (memorySimulationHistory.length > 20) memorySimulationHistory.pop();

  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(payload);
    sessionStorage.setItem(STORAGE_KEYS.simulation, serialized);
    localStorage.setItem(STORAGE_KEYS.simulation, serialized);
    localStorage.setItem(STORAGE_KEYS.simulationHistory, JSON.stringify(memorySimulationHistory));
  } catch (err) {
    console.warn('[VM CACHE] Error writing simulation cache:', err);
  }
}

export function clearCachedSimulation(): void {
  memorySimulationCache = null;
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEYS.simulation);
    localStorage.removeItem(STORAGE_KEYS.simulation);
  } catch {}
}

// ── BOARDROOM DELIBERATION CACHE ──────────────────────────────────────────────

export function getCachedBoardroom(): CachedBoardroomViewModel | null {
  if (memoryBoardroomCache) return memoryBoardroomCache;
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.boardroom) || localStorage.getItem(STORAGE_KEYS.boardroom);
    if (raw) {
      memoryBoardroomCache = JSON.parse(raw);
      return memoryBoardroomCache;
    }
  } catch {}
  return null;
}

export function setCachedBoardroom(data: Omit<CachedBoardroomViewModel, 'timestamp'>): void {
  const payload: CachedBoardroomViewModel = {
    ...data,
    timestamp: Date.now(),
  };
  memoryBoardroomCache = payload;

  // Append to history (max 20 items)
  const existingIdx = memoryBoardroomHistory.findIndex(h => h.query === data.query);
  if (existingIdx >= 0) {
    memoryBoardroomHistory.splice(existingIdx, 1);
  }
  memoryBoardroomHistory.unshift(payload);
  if (memoryBoardroomHistory.length > 20) memoryBoardroomHistory.pop();

  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(payload);
    sessionStorage.setItem(STORAGE_KEYS.boardroom, serialized);
    localStorage.setItem(STORAGE_KEYS.boardroom, serialized);
    localStorage.setItem(STORAGE_KEYS.boardroomHistory, JSON.stringify(memoryBoardroomHistory));
  } catch (err) {
    console.warn('[VM CACHE] Error writing boardroom cache:', err);
  }
}

export function clearCachedBoardroom(): void {
  memoryBoardroomCache = null;
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEYS.boardroom);
    localStorage.removeItem(STORAGE_KEYS.boardroom);
  } catch {}
}

// ── PARAMETRIC COUNTERFACTUAL CACHE ───────────────────────────────────────────

export function getCachedParametric(): CachedParametricViewModel | null {
  if (memoryParametricCache) return memoryParametricCache;
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.parametric) || localStorage.getItem(STORAGE_KEYS.parametric);
    if (raw) {
      memoryParametricCache = JSON.parse(raw);
      return memoryParametricCache;
    }
  } catch {}
  return null;
}

export function setCachedParametric(data: Omit<CachedParametricViewModel, 'timestamp'>): void {
  const payload: CachedParametricViewModel = {
    ...data,
    timestamp: Date.now(),
  };
  memoryParametricCache = payload;

  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(payload);
    sessionStorage.setItem(STORAGE_KEYS.parametric, serialized);
    localStorage.setItem(STORAGE_KEYS.parametric, serialized);
  } catch (err) {
    console.warn('[VM CACHE] Error writing parametric cache:', err);
  }
}

// ── HISTORICAL DELIBERATIONS & SIMULATIONS ────────────────────────────────────

export function getHistoricalSimulations(): CachedSimulationViewModel[] {
  if (memorySimulationHistory.length > 0) return memorySimulationHistory;
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.simulationHistory);
    if (raw) {
      const parsed = JSON.parse(raw);
      memorySimulationHistory.push(...parsed);
      return memorySimulationHistory;
    }
  } catch {}
  return [];
}

export function getHistoricalBoardrooms(): CachedBoardroomViewModel[] {
  if (memoryBoardroomHistory.length > 0) return memoryBoardroomHistory;
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.boardroomHistory);
    if (raw) {
      const parsed = JSON.parse(raw);
      memoryBoardroomHistory.push(...parsed);
      return memoryBoardroomHistory;
    }
  } catch {}
  return [];
}
