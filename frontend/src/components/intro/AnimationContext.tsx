import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';

export type IntroPhase = 'pending' | 'playing' | 'transitioning' | 'complete';

interface AnimationContextValue {
  phase: IntroPhase;
  advance: () => void;
  ready: boolean;
}

const AnimationContext = createContext<AnimationContextValue | null>(null);

const SESSION_KEY = 'niriksh-intro-played';

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>('pending');
  const initiated = useRef(false);

  useEffect(() => {
    const alreadyPlayed =
      typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem(SESSION_KEY) === 'true';

    if (alreadyPlayed) {
      setPhase('complete');
      return;
    }

    if (initiated.current) return;
    initiated.current = true;

    const timer = setTimeout(() => setPhase('playing'), 80);
    return () => clearTimeout(timer);
  }, []);

  const advance = useCallback(() => {
    setPhase('transitioning');
    setTimeout(() => {
      setPhase('complete');
      try {
        sessionStorage.setItem(SESSION_KEY, 'true');
      } catch {
        /* noop */
      }
    }, 800);
  }, []);

  const ready = phase === 'transitioning' || phase === 'complete';

  return (
    <AnimationContext.Provider value={{ phase, advance, ready }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimationContext(): AnimationContextValue {
  const ctx = useContext(AnimationContext);
  if (!ctx) throw new Error('useAnimationContext must be used within AnimationProvider');
  return ctx;
}
