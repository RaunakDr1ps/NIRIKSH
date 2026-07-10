import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
}

export default function ParticleField({ count = 25 }: { count?: number }) {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1.5 + Math.random() * 2.5,
        duration: 18 + Math.random() * 30,
        delay: Math.random() * -30,
        driftX: -20 + Math.random() * 40,
        driftY: -20 + Math.random() * 40,
      })),
    [count],
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.id % 3 === 0 ? '#00d4ff' : p.id % 3 === 1 ? '#00ffb9' : '#ffffff',
          }}
          animate={{
            x: [0, p.driftX * 0.3, p.driftX * 0.5, p.driftX * 0.3, 0],
            y: [0, p.driftY * 0.3, p.driftY * 0.5, p.driftY * 0.3, 0],
            opacity: [0.02, 0.06, 0.04, 0.07, 0.02],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
