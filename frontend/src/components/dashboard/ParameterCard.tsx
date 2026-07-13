import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/common/AnimatedCounter';
import type { LucideIcon } from 'lucide-react';

interface ParameterCardProps {
  label: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  format?: string;
  decimals?: number;
}

function getFormatFn(fmt?: string) {
  switch (fmt) {
    case 'rpm':
      return (v: number) => `${(v / 1000).toFixed(1)}k`;
    case 'fuel':
      return (v: number) => v.toFixed(4);
    case 'temp':
      return (v: number) => `${v.toFixed(0)}`;
    case 'pressure':
      return (v: number) => `${(v / 1e3).toFixed(1)}k`;
    default:
      return undefined;
  }
}

export default function ParameterCard({ label, value, unit, icon: Icon, format: fmt }: ParameterCardProps) {
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
        <AnimatedCounter
          value={value}
          format={getFormatFn(fmt)}
          decimals={fmt === 'fuel' ? 4 : fmt === 'temp' ? 0 : 2}
        />
      </p>
      <p className="text-[10px] text-gray-600 font-mono ml-9">{unit}</p>
    </motion.div>
  );
}
