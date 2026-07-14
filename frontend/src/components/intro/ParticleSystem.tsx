import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface ParticleSystemProps {
  particleCount: number;
  phase: 'converging' | 'assembled' | 'dispersing';
}

interface Packet {
  id: number;
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  dx: number;
  dy: number;
  size: number;
  color: string;
  glow: string;
  delay: number;
  dur: number;
  opacity: number;
  type: 'pressure' | 'temp' | 'fuel' | 'rpm' | 'efficiency';
}

const SENSOR_COLORS: Record<string, string> = {
  pressure: '#00d4ff',
  temp: '#ff6a00',
  fuel: '#00ffb9',
  rpm: '#ffb300',
  efficiency: '#00ff88',
};

function generatePackets(count: number, w: number, h: number): Packet[] {
  const cx = w / 2;
  const cy = h * 0.4;
  const types: Packet['type'][] = ['pressure', 'temp', 'fuel', 'rpm', 'efficiency'];

  return Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length];
    const baseColor = SENSOR_COLORS[type];

    const angle = Math.random() * Math.PI * 2;
    const radius = 0.3 + Math.random() * 0.7;
    const dist = radius * Math.max(w, h) * 0.65;

    const laneX = (Math.random() - 0.5) * w * 0.2;

    return {
      id: i,
      sx: cx + Math.cos(angle) * dist,
      sy: cy + Math.sin(angle) * dist,
      tx: cx + laneX,
      ty: cy + (Math.random() - 0.5) * h * 0.15,
      dx: cx + laneX + (Math.random() - 0.5) * w * 0.6,
      dy: cy + 80 + Math.random() * h * 0.3,
      size: 1.2 + Math.random() * 2.2,
      color: baseColor,
      glow: `0 0 ${2 + Math.random() * 5}px ${baseColor}50`,
      delay: Math.random() * 0.25,
      dur: 0.6 + Math.random() * 0.4,
      opacity: 0.3 + Math.random() * 0.5,
      type,
    };
  });
}

export default function ParticleSystem({ particleCount, phase }: ParticleSystemProps) {
  const [dims] = useState(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }));

  const packets = useMemo(
    () => generatePackets(particleCount, dims.w, dims.h),
    [particleCount, dims.w, dims.h],
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
      {packets.map((p) => {
        const isConverging = phase === 'converging';
        const isDispersing = phase === 'dispersing';

        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: p.glow,
              left: 0,
              top: 0,
              willChange: 'transform',
            }}
            initial={{ x: p.sx, y: p.sy, opacity: 0, scale: 0 }}
            animate={
              isConverging
                ? { x: p.tx, y: p.ty, opacity: p.opacity, scale: 1 }
                : isDispersing
                ? { x: p.dx, y: p.dy, opacity: 0, scale: 0 }
                : {
                    x: p.tx + (Math.random() - 0.5) * 6,
                    y: p.ty + (Math.random() - 0.5) * 6,
                    opacity: p.opacity * 0.7,
                    scale: 0.85 + Math.random() * 0.3,
                  }
            }
            transition={
              isConverging
                ? {
                    x: { duration: p.dur, delay: p.delay, ease: [0.25, 0.1, 0.25, 1] },
                    y: { duration: p.dur, delay: p.delay, ease: [0.25, 0.1, 0.25, 1] },
                    opacity: { duration: 0.35, delay: p.delay },
                    scale: { duration: 0.35, delay: p.delay },
                  }
                : isDispersing
                ? {
                    x: { duration: 0.5, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] },
                    y: { duration: 0.5, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] },
                    opacity: { duration: 0.3, delay: 0.05 },
                    scale: { duration: 0.3, delay: 0.05 },
                  }
                : {
                    x: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                    y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.3 },
                  }
            }
          />
        );
      })}
    </div>
  );
}
