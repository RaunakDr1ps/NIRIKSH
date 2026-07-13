import { useMemo } from 'react';

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

export default function ParticleField({ count = 15 }: { count?: number }) {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1.5 + Math.random() * 2.5,
        duration: 18 + Math.random() * 30,
        delay: -(Math.random() * 30),
        driftX: -20 + Math.random() * 40,
        driftY: -20 + Math.random() * 40,
      })),
    [count],
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.id % 3 === 0 ? '#00d4ff' : p.id % 3 === 1 ? '#00ffb9' : '#ffffff',
            '--drift-x': `${p.driftX}px`,
            '--drift-y': `${p.driftY}px`,
            animation: `particle-field ${p.duration}s ${p.delay}s infinite ease-in-out`,
            willChange: 'transform',
          } as React.CSSProperties}
        />
      ))}
      <style>{`
        @keyframes particle-field {
          0%, 100% { transform: translate(0, 0); opacity: 0.02; }
          25% { transform: translate(calc(var(--drift-x, 0) * 0.3), calc(var(--drift-y, 0) * 0.3)); opacity: 0.06; }
          50% { transform: translate(calc(var(--drift-x, 0) * 0.5), calc(var(--drift-y, 0) * 0.5)); opacity: 0.04; }
          75% { transform: translate(calc(var(--drift-x, 0) * 0.3), calc(var(--drift-y, 0) * 0.3)); opacity: 0.07; }
        }
      `}</style>
    </div>
  );
}
