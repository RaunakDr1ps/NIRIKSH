import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/common/AnimatedCounter';

interface HealthGaugeProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  type: 'thrust' | 'tsfc' | 'confidence' | 'rul';
}

export default function HealthGauge({ label, value, max, unit, type }: HealthGaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const circumference = 2 * Math.PI * 42;
  const offset = circumference * (1 - percentage / 100);

  const gaugeColor =
    type === 'confidence' ? '#22d3ee' : type === 'rul' ? '#34d399' : type === 'thrust' ? '#fbbf24' : '#fb923c';

  return (
    <motion.div
      className="panel p-2 flex flex-col items-center"
    >
      <span className="text-[8px] text-gray-500 uppercase tracking-[0.2em] mb-1 font-mono">{label}</span>
      <div className="relative w-20 h-20 mb-0.5">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="6" />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={gaugeColor}
            strokeWidth="6"
            strokeLinecap="butt"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: 'linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold font-mono tabular-nums leading-none" style={{ color: gaugeColor }}>
            <AnimatedCounter
              value={value}
              decimals={type === 'rul' ? 0 : type === 'thrust' ? 0 : 1}
              format={type === 'rul' ? (v) => Math.round(v).toString() : undefined}
            />
          </span>
          <span className="text-[7px] text-gray-600 font-mono mt-0.5 tracking-wider">
            {unit}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
