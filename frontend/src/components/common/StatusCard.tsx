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
  const { label, dotClass, color } = getHealthStatus(value);

  return (
    <motion.div
      whileHover={{ scale: 1.015, y: -2, borderColor: 'rgba(0, 212, 255, 0.2)' }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`glass-panel p-4 card-border-glow ${large ? 'ring-1 ring-hud-blue/20' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-gray-400 uppercase tracking-[0.15em] font-medium">{title}</span>
        <motion.span
          className={dotClass}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <div className={`font-mono font-bold ${large ? 'text-4xl' : 'text-2xl'} tabular-nums`} style={{ color }}>
        <AnimatedCounter value={value * 100} decimals={1} suffix="%" />
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[11px] font-mono tracking-wider" style={{ color }}>
          {label}
        </span>
        {status === 'critical' && (
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-[10px] text-hud-red font-mono font-semibold"
          >
            CRITICAL
          </motion.span>
        )}
      </div>
      <div className="mt-3 h-1.5 bg-surface-700/80 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      </div>
    </motion.div>
  );
}
