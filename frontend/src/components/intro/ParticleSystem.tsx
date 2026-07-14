import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { IntroPhase } from './AnimationContext';

interface Props {
  phase: IntroPhase;
}

interface Particle {
  id: number;
  sx: number;
  sy: number;
  cx: number;
  cy: number;
  size: number;
  color: string;
  delay: number;
  dur: number;
}

const COLORS = ['#00d4ff', '#00b4ff', '#0088ff', '#40d0ff', '#00ffb9'];
const COUNT = 60;

function generate(w: number, h: number): Particle[] {
  const centerX = w / 2;
  const centerY = h * 0.4;
  const spreadX = w * 0.25;
  const spreadY = h * 0.15;

  return Array.from({ length: COUNT }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.3 + Math.random() * 0.7;
    const distance = radius * Math.max(w, h) * 0.6;

    return {
      id: i,
      sx: centerX + Math.cos(angle) * distance,
      sy: centerY + Math.sin(angle) * distance,
      cx: centerX + (Math.random() - 0.5) * spreadX,
      cy: centerY + (Math.random() - 0.5) * spreadY,
      size: 1.5 + Math.random() * 2.5,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.2,
      dur: 0.6 + Math.random() * 0.4,
    };
  });
}

/* Always returns safe {x, y, opacity, scale} — never undefined */
function targets(particles: Particle[], intro: boolean, dispersing: boolean) {
  return particles.map((p) => {
    if (dispersing) {
      return { x: p.sx * 1.4, y: p.sy * 1.4, opacity: 0, scale: 0 };
    }
    if (intro) {
      return { x: p.cx, y: p.cy, opacity: 0.7, scale: 1 };
    }
    return { x: p.sx, y: p.sy, opacity: 0, scale: 0 };
  });
}

export default function ParticleSystem({ phase }: Props) {
  const isIntro = phase === 'intro';
  const isComplete = phase === 'complete';
  const dispersing = isComplete;

  const [dims] = useState(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }));

  const particles = useMemo(() => generate(dims.w, dims.h), [dims.w, dims.h]);
  const t = useMemo(
    () => targets(particles, isIntro, dispersing),
    [particles, isIntro, dispersing],
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 1,
      }}
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: 0,
            top: 0,
            backgroundColor: p.color,
            willChange: 'transform',
          }}
          initial={{ x: p.sx, y: p.sy, opacity: 0, scale: 0 }}
          animate={{ x: t[i].x, y: t[i].y, opacity: t[i].opacity, scale: t[i].scale }}
          transition={{
            x: { duration: p.dur, delay: p.delay, ease: [0.25, 0.1, 0.25, 1] },
            y: { duration: p.dur, delay: p.delay, ease: [0.25, 0.1, 0.25, 1] },
            opacity: { duration: 0.35, delay: p.delay },
            scale: { duration: 0.35, delay: p.delay },
          }}
        />
      ))}
    </div>
  );
}
