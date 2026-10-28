import { motion } from 'framer-motion';
import { getHealthStatus } from '@/utils/format';
import type { HealthStatus } from '@/types/engine';
import AnimatedCounter from './AnimatedCounter';

interface StatusCardProps {
  title: string;
  value: number;
  type: 'health' | 'status';
  status: HealthStatus;
  large?: boolean;
}

export default function StatusCard({ title, value, status, large }: StatusCardProps) {
  const { label } = getHealthStatus(value);

  const barColor =
    value >= 0.8 ? '#34d399' : value >= 0.6 ? '#fbbf24' : value >= 0.4 ? '#fb923c' : '#ef4444';

  return (
    <motion.div
      className={`panel p-2 ${large ? 'border-cyan-900/40' : ''}`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-mono">{title}</span>
        <span className="w-1.5 h-1.5" style={{ backgroundColor: barColor }} />
      </div>
      <div className={`font-mono font-bold ${large ? 'text-3xl' : 'text-xl'} tabular-nums`} style={{ color: barColor }}>
        <AnimatedCounter value={value * 100} decimals={1} suffix="%" />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[9px] font-mono tracking-wider uppercase" style={{ color: barColor }}>
          {label}
        </span>
        {status === 'critical' && (
          <span className="text-[9px] text-red-500 font-mono uppercase tracking-wider">
            CRITICAL
          </span>
        )}
      </div>
      <div className="mt-2 h-1 bg-slate-900 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.8, ease: 'linear' }}
          className="h-full"
          style={{
            backgroundColor: barColor,
          }}
        />
      </div>
    </motion.div>
  );
}
