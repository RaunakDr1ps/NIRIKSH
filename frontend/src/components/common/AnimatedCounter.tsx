import { useEffect, useRef, useState, useCallback } from 'react';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  format?: (v: number) => string;
}

export default function AnimatedCounter({
  value,
  decimals = 0,
  suffix = '',
  prefix = '',
  className,
  format,
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(() => {
    if (format) return `${prefix}${format(value)}${suffix}`;
    return `${prefix}${value.toFixed(decimals)}${suffix}`;
  });
  const currentRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    const start = currentRef.current;
    const target = value;
    const diff = target - start;
    const duration = 400;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = start + diff * eased;
      currentRef.current = current;

      if (format) {
        setDisplay(`${prefix}${format(current)}${suffix}`);
      } else {
        setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(step);
  }, [value, decimals, suffix, prefix, format]);

  useEffect(() => {
    animate();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  return <span className={className}>{display}</span>;
}
