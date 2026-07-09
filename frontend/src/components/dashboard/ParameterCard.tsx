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
    <div className="glass-panel p-3 hover:border-hud-blue/20 transition-colors">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-3 h-3 text-hud-blue/60" />
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-lg font-bold font-mono text-white">{displayValue}</p>
      <p className="text-[10px] text-gray-600 font-mono">{unit}</p>
    </div>
  );
}
