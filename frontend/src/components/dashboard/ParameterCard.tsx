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
      <div className="flex items-center gap-2 mb-2">
        <span className="w-7 h-7 rounded-md bg-hud-blue/8 flex items-center justify-center flex-shrink-0">
          <Icon className="w-3.5 h-3.5 text-hud-blue/70" />
        </span>
        <span className="text-[10px] text-gray-500 uppercase tracking-[0.1em] font-medium">{label}</span>
      </div>
      <p className="text-lg font-bold font-mono tabular-nums text-white ml-9">
        {displayValue}
      </p>
      <p className="text-[10px] text-gray-600 font-mono ml-9">{unit}</p>
    </motion.div>
  );
}
