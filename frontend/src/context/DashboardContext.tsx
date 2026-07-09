import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import type { DashboardData } from '@/types/engine';
import { getDashboard } from '@/services/api';

interface DashboardContextValue {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children, pollIntervalMs = 5000 }: { children: ReactNode; pollIntervalMs?: number }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await getDashboard();
      if (!controller.signal.aborted) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    refetch();
    intervalRef.current = setInterval(refetch, pollIntervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [refetch, pollIntervalMs]);

  return (
    <DashboardContext.Provider value={{ data, loading, error, refetch }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return ctx;
}
