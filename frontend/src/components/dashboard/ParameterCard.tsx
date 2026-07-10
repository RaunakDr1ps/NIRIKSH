import { motion } from 'framer-motion';
import { formatNumber } from '@/utils/format';
import type { LucideIcon } from 'lucide-react';

interface ParameterCardProps {
  label: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  format?: string;
  decimals?: number;
}

export default function ParameterCard({ label, value, unit, icon: Icon, format: fmt, decimals = 2 }: ParameterCardProps) {
  const displayValue =
    fmt === 'rpm'
      ? `${(value / 1000).toFixed(1)}k`
      : fmt === 'fuel'
      ? value.toFixed(4)
      : fmt === 'temp'
      ? `${value.toFixed(0)}`
      : fmt === 'pressure'
      ? `${(value / 1e3).toFixed(1)}k`
      : formatNumber(value, decimals);

  return (
    <motion.div
      className="glass-panel p-3 card-border-glow"
      whileHover={{ y: -2, borderColor: 'rgba(0, 212, 255, 0.3)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-hud-blue/60" />
        <span className="text-[10px] text-gray-500 uppercase tracking-[0.1em]">{label}</span>
      </div>
      <p className="text-lg font-bold font-mono tabular-nums text-white">
        {displayValue}
      </p>
      <p className="text-[10px] text-gray-600 font-mono">{unit}</p>
    </motion.div>
  );
}
