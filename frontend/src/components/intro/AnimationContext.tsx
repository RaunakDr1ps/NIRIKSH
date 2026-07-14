import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type IntroPhase = 'idle' | 'intro' | 'complete';

interface AnimationContextValue {
  phase: IntroPhase;
  start: () => void;
  complete: () => void;
  ready: boolean;
}

const AnimationContext = createContext<AnimationContextValue | null>(null);

const SESSION_KEY = 'niriksh-intro-played';

function hasPlayedBefore(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

function markPlayed(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, 'true');
  } catch {
    /* noop */
  }
}

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>(() =>
    hasPlayedBefore() ? 'complete' : 'idle',
  );

  const start = useCallback(() => setPhase('intro'), []);
  const complete = useCallback(() => {
    setPhase('complete');
    markPlayed();
  }, []);

  // Auto-advance: idle → intro after 80ms
  useEffect(() => {
    if (phase !== 'idle') return;
    const timer = setTimeout(start, 80);
    return () => clearTimeout(timer);
  }, [phase, start]);

  const ready = phase === 'complete';

  return (
    <AnimationContext.Provider value={{ phase, start, complete, ready }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimationContext(): AnimationContextValue {
  const ctx = useContext(AnimationContext);
  if (!ctx) throw new Error('useAnimationContext must be used within AnimationProvider');
  return ctx;
}
