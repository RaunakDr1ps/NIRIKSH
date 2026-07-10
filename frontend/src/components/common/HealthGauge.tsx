import { motion } from 'framer-motion';
import { formatNumber } from '@/utils/format';

interface HealthGaugeProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  type: 'thrust' | 'tsfc' | 'confidence' | 'rul';
}

export default function HealthGauge({ label, value, max, unit, type }: HealthGaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const color =
    type === 'confidence'
      ? '#00d4ff'
      : type === 'rul'
      ? '#00ff88'
      : type === 'thrust'
      ? '#ffb300'
      : '#ff6a00';

  const circumference = 2 * Math.PI * 42;
  const offset = circumference * (1 - percentage / 100);

  const animatedValue =
    type === 'rul'
      ? Math.round(value)
      : formatNumber(value, type === 'thrust' ? 0 : 1);

  return (
    <motion.div
      className="glass-panel p-4 flex flex-col items-center"
      whileHover={{ scale: 1.02, y: -1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <span className="text-[10px] text-gray-500 uppercase tracking-[0.15em] mb-2">{label}</span>
      <div className="relative w-24 h-24 mb-2">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#1a2540" strokeWidth="8" />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-lg font-bold font-mono tabular-nums"
            style={{ color }}
            key={value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {animatedValue}
          </motion.span>
          <span className="text-[8px] text-gray-500 font-mono mt-0.5">{unit}</span>
        </div>
      </div>
    </motion.div>
  );
}
