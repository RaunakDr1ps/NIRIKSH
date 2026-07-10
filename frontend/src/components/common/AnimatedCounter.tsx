import { useEffect, useState } from 'react';
import { useSpring, useMotionValue } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export default function AnimatedCounter({
  value,
  decimals = 0,
  suffix = '',
  prefix = '',
  className,
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(`${prefix}${value.toFixed(decimals)}${suffix}`);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 80,
    damping: 20,
  });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest: number) => {
      setDisplay(`${prefix}${latest.toFixed(decimals)}${suffix}`);
    });
    return unsubscribe;
  }, [spring, decimals, suffix, prefix]);

  return <span className={className}>{display}</span>;
}
