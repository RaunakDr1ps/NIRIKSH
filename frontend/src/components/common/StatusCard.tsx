import { motion } from 'framer-motion';
import { getHealthStatus, formatPercentage } from '@/utils/format';
import type { HealthStatus } from '@/types/engine';

interface StatusCardProps {
  title: string;
  value: number;
  type: 'health' | 'status';
  status: HealthStatus;
  large?: boolean;
}

export default function StatusCard({ title, value, status, large }: StatusCardProps) {
  const { label, dotClass } = getHealthStatus(value);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`glass-panel-hover p-4 ${large ? 'ring-1 ring-hud-blue/20' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">{title}</span>
        <span className={dotClass} />
      </div>
      <div className={`font-mono font-bold ${large ? 'text-4xl' : 'text-2xl'}`} style={{ color: getHealthStatus(value).color }}>
        {formatPercentage(value)}
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs font-mono" style={{ color: getHealthStatus(value).color }}>
          {label}
        </span>
        {status === 'critical' && (
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-[10px] text-hud-red font-mono"
          >
            CRITICAL
          </motion.span>
        )}
      </div>
      <div className="mt-3 h-1.5 bg-surface-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full transition-colors duration-500"
          style={{ backgroundColor: getHealthStatus(value).color, boxShadow: `0 0 8px ${getHealthStatus(value).color}40` }}
        />
      </div>
    </motion.div>
  );
}
