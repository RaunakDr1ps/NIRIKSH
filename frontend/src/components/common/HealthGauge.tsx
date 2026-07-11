import { motion } from 'framer-motion';
import { formatNumber } from '@/utils/format';

interface HealthGaugeProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  type: 'thrust' | 'tsfc' | 'confidence' | 'rul';
}

function getGradientId(type: string) {
  return `gauge-grad-${type}`;
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

  const dimColor = type === 'confidence'
    ? '#002a40'
    : type === 'rul'
    ? '#002a15'
    : type === 'thrust'
    ? '#3a2a00'
    : '#3a1500';

  const circumference = 2 * Math.PI * 42;
  const offset = circumference * (1 - percentage / 100);

  const animatedValue =
    type === 'rul'
      ? Math.round(value)
      : formatNumber(value, type === 'thrust' ? 0 : 1);

  const ticks = [0, 20, 40, 60, 80, 100];

  return (
    <motion.div
      className="glass-panel p-4 flex flex-col items-center card-border-glow"
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <span className="text-[10px] text-gray-500 uppercase tracking-[0.15em] mb-2 font-medium">{label}</span>
      <div className="relative w-24 h-24 mb-1">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <defs>
            <linearGradient id={getGradientId(type)} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={1} />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle cx="50" cy="50" r="42" fill="none" stroke={dimColor} strokeWidth="8" />

          {/* Tick marks */}
          {ticks.map((tick) => {
            const angle = (tick / 100) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const innerR = 38;
            const outerR = 46;
            const x1 = 50 + innerR * Math.cos(rad);
            const y1 = 50 + innerR * Math.sin(rad);
            const x2 = 50 + outerR * Math.cos(rad);
            const y2 = 50 + outerR * Math.sin(rad);
            const active = tick <= percentage;
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={active ? color : '#1a2540'}
                strokeWidth={active ? 1.2 : 0.8}
                strokeLinecap="round"
                opacity={active ? 0.9 : 0.3}
                style={active ? { filter: `drop-shadow(0 0 2px ${color}80)` } : undefined}
              />
            );
          })}

          {/* Active arc */}
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={`url(#${getGradientId(type)})`}
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
            className="text-lg font-bold font-mono tabular-nums leading-none"
            style={{ color }}
            key={value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {animatedValue}
          </motion.span>
          <motion.span
            className="text-[7px] text-gray-500 font-mono mt-1 tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {unit}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
