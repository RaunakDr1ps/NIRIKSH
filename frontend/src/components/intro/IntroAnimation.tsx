import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationContext } from './AnimationContext';
import ParticleSystem from './ParticleSystem';
import AnimatedAcronym from './AnimatedAcronym';
import HolographicEngine from './HolographicEngine';
import SystemBoot from './SystemBoot';
import IntroErrorBoundary from './IntroErrorBoundary';

function useReduced(): boolean {
  const [v, setV] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setV(mq.matches);
    const h = (e: MediaQueryListEvent) => setV(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return v;
}

export default function IntroAnimation() {
  const { phase, complete } = useAnimationContext();
  const reduced = useReduced();
  const [crashed, setCrashed] = useState(false);

  /* ── Single auto-advance timer ── */
  useEffect(() => {
    if (phase !== 'intro') return;
    const timer = setTimeout(complete, 2500);
    return () => clearTimeout(timer);
  }, [phase, complete]);

  /* ── Escape key ── */
  useEffect(() => {
    if (phase !== 'intro') return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') complete(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [phase, complete]);

  /* ── Glow flash before exit ── */
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (phase !== 'intro') return;
    const t = setTimeout(() => setFlash(true), 2300);
    const h = setTimeout(() => setFlash(false), 2400);
    return () => { clearTimeout(t); clearTimeout(h); };
  }, [phase]);

  if (crashed || phase === 'complete') return null;

  /* ── Initial idle state ── */
  if (phase === 'idle') {
    return <div className="fixed inset-0" style={{ zIndex: 9999, backgroundColor: '#0a0e17' }} />;
  }

  const skip = reduced;

  return (
    <IntroErrorBoundary onError={() => setCrashed(true)}>
      <AnimatePresence>
        <motion.div
          key="intro-root"
          className="fixed inset-0 overflow-hidden"
          style={{ zIndex: 9999, backgroundColor: '#0a0e17' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {skip ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-hud-blue font-mono text-sm">NIRIKSH</span>
            </div>
          ) : (
            <>
              {/* Grid background */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              <div className="scan-line-slow absolute inset-0 pointer-events-none z-[2]" />

              {/* Particles */}
              <ParticleSystem phase={phase} />

              {/* Engine */}
              <HolographicEngine phase={phase} />

              {/* Text */}
              <AnimatedAcronym phase={phase} />

              {/* Boot */}
              <SystemBoot phase={phase} />

              {/* Branding */}
              <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
                style={{ zIndex: 5 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 2.2, duration: 0.4 }}
              >
                <span className="font-mono text-[7px] tracking-[0.3em] text-gray-600 uppercase">
                  NIRIKSH Digital Twin Platform v2.1
                </span>
              </motion.div>

              {/* Skip */}
              <button
                onClick={complete}
                className="absolute top-4 right-4 z-10 px-3 py-1.5 text-[10px] font-mono tracking-wider
                           text-gray-500 hover:text-hud-blue border border-surface-600/30 hover:border-hud-blue/30
                           rounded transition-colors duration-200"
                aria-label="Skip intro"
              >
                SKIP INTRO
              </button>

              {/* Glow flash */}
              <AnimatePresence>
                {flash && (
                  <motion.div
                    key="flash"
                    className="fixed inset-0 pointer-events-none"
                    style={{
                      zIndex: 9998,
                      background:
                        'radial-gradient(ellipse at center, rgba(0,212,255,0.1) 0%, rgba(0,212,255,0.03) 40%, transparent 70%)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.06 }}
                  />
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </IntroErrorBoundary>
  );
}
