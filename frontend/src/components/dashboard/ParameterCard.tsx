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
      className="panel-dense"
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon className="w-2.5 h-2.5 text-cyan-400/70" />
        <span className="text-[8px] text-gray-500 uppercase tracking-[0.15em] font-mono">{label}</span>
      </div>
      <p className="text-sm font-bold font-mono tabular-nums text-gray-200">
        <AnimatedCounter
          value={value}
          format={getFormatFn(fmt)}
          decimals={fmt === 'fuel' ? 4 : fmt === 'temp' ? 0 : 2}
        />
      </p>
      <p className="text-[8px] text-gray-600 font-mono">{unit}</p>
    </motion.div>
  );
}
