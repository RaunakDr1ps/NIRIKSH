import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationContext, type IntroPhase } from './AnimationContext';
import ParticleSystem from './ParticleSystem';
import AnimatedAcronym from './AnimatedAcronym';
import HolographicEngine, { type EnginePhase } from './HolographicEngine';
import SystemBoot from './SystemBoot';

function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return prefersReduced;
}

interface SubPhases {
  particle: 'converging' | 'assembled' | 'dispersing';
  acronym: 'hidden' | 'revealing' | 'complete';
  engine: EnginePhase;
  boot: 'hidden' | 'booting' | 'complete';
}

function useSubPhases(phase: IntroPhase): SubPhases {
  const [sub, setSub] = useState<SubPhases>({
    particle: 'converging',
    acronym: 'hidden',
    engine: 'hidden',
    boot: 'hidden',
  });

  useEffect(() => {
    if (phase !== 'playing') return;

    setSub({
      particle: 'converging',
      acronym: 'revealing',
      engine: 'blueprint',
      boot: 'hidden',
    });

    const t1 = setTimeout(() => setSub((s) => ({ ...s, engine: 'constructing' })), 120);
    const t2 = setTimeout(() => setSub((s) => ({ ...s, boot: 'booting' })), 450);
    const t3 = setTimeout(() => setSub((s) => ({ ...s, engine: 'complete' })), 550);
    const t4 = setTimeout(() => setSub((s) => ({ ...s, acronym: 'complete', boot: 'complete' })), 1600);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === 'transitioning') {
      setSub((s) => ({ ...s, particle: 'dispersing', engine: 'morphing' }));
    }
  }, [phase]);

  return sub;
}

/* ── Parallax layer helper ── */
function useParallaxLayer(driftX: number, driftY: number, duration: number, active: boolean) {
  return {
    animate: active
      ? { x: [0, driftX, -driftX * 0.5, 0], y: [0, -driftY, driftY * 0.7, 0] }
      : { x: 0, y: 0 },
    transition: {
      duration,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  };
}

export default function IntroAnimation() {
  const { phase, advance } = useAnimationContext();
  const reducedMotion = useReducedMotion();
  const sub = useSubPhases(phase);
  const [flashVisible, setFlashVisible] = useState(false);

  const handleAdvance = useCallback(() => {
    advance();
  }, [advance]);

  /* Auto-advance after 2.0s */
  useEffect(() => {
    if (phase === 'playing') {
      const timer = setTimeout(handleAdvance, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, handleAdvance]);

  /* Escape key skip */
  useEffect(() => {
    if (phase !== 'playing') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleAdvance();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, handleAdvance]);

  /* Glow flash at transition start */
  useEffect(() => {
    if (phase !== 'transitioning') return;
    const timer = setTimeout(() => setFlashVisible(true), 60);
    const hide = setTimeout(() => setFlashVisible(false), 200);
    return () => {
      clearTimeout(timer);
      clearTimeout(hide);
    };
  }, [phase]);

  if (phase === 'complete') return null;

  const skipAnim = reducedMotion || phase === 'pending';

  /* Layer parallax configs */
  const gridParallax = useParallaxLayer(2, -1, 12, !skipAnim);
  const particleParallax = useParallaxLayer(-3, 2, 10, !skipAnim);
  const engineParallax = useParallaxLayer(1.5, -0.8, 14, !skipAnim);
  const textParallax = useParallaxLayer(-1, 0.5, 9, !skipAnim);
  const bootParallax = useParallaxLayer(2, -1.5, 7, !skipAnim);

  return (
    <AnimatePresence>
      <motion.div
        key="intro-overlay"
        className="fixed inset-0 overflow-hidden"
        style={{ zIndex: 9999, backgroundColor: '#0a0e17' }}
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'transitioning' ? 0 : 1 }}
        transition={{
          duration: phase === 'transitioning' ? 0.65 : 0.3,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {skipAnim ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-hud-blue font-mono text-sm">NIRIKSH</span>
          </div>
        ) : (
          <>
            {/* Layer 1: Background grid */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0, 212, 255, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.025) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
              animate={gridParallax.animate}
              transition={gridParallax.transition}
            />

            {/* Scan line */}
            <div
              className="absolute inset-0 pointer-events-none z-[2]"
              style={{ position: 'relative' }}
            >
              <div className="scan-line-slow absolute inset-0" />
            </div>

            {/* Layer 2: Particles */}
            <motion.div
              className="absolute inset-0"
              animate={particleParallax.animate}
              transition={particleParallax.transition}
            >
              <ParticleSystem particleCount={180} phase={sub.particle} />
            </motion.div>

            {/* Layer 3: Holographic engine */}
            <motion.div
              className="absolute inset-0"
              animate={engineParallax.animate}
              transition={engineParallax.transition}
            >
              <HolographicEngine phase={sub.engine} />
            </motion.div>

            {/* Layer 4: NIRIKSH + Acronym */}
            <motion.div
              className="absolute inset-0"
              animate={textParallax.animate}
              transition={textParallax.transition}
            >
              <AnimatedAcronym phase={sub.acronym} />
            </motion.div>

            {/* Layer 5: System boot */}
            <motion.div
              className="absolute inset-0"
              animate={bootParallax.animate}
              transition={bootParallax.transition}
            >
              <SystemBoot phase={sub.boot} />
            </motion.div>

            {/* Bottom branding */}
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{ zIndex: 5 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: sub.boot === 'complete' ? 0.4 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="font-mono text-[7px] tracking-[0.3em] text-gray-600 uppercase">
                NIRIKSH Digital Twin Platform v2.1
              </span>
            </motion.div>

            {/* Skip button */}
            <button
              onClick={handleAdvance}
              className="absolute top-4 right-4 z-10 px-3 py-1.5 text-[10px] font-mono tracking-wider
                         text-gray-500 hover:text-hud-blue border border-surface-600/30 hover:border-hud-blue/30
                         rounded transition-colors duration-200"
              aria-label="Skip intro animation"
            >
              SKIP INTRO
            </button>
          </>
        )}
      </motion.div>

      {/* Glow flash at transition midpoint */}
      <AnimatePresence>
        {flashVisible && (
          <motion.div
            key="transition-flash"
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 9998,
              background:
                'radial-gradient(ellipse at center, rgba(0,212,255,0.12) 0%, rgba(0,212,255,0.04) 40%, transparent 70%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.08 }}
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
