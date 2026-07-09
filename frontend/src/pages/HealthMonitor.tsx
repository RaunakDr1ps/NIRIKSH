import { motion } from 'framer-motion';
import { Activity, AlertTriangle, TrendingDown } from 'lucide-react';
import { useDashboardContext } from '@/context/DashboardContext';
import StatusCard from '@/components/common/StatusCard';
import TrendChart from '@/components/charts/TrendChart';
import { getHealthStatus } from '@/utils/format';

export default function HealthMonitor() {
  const { data, loading } = useDashboardContext();

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-hud-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const { health, degradationTrends } = data;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="w-6 h-6 text-hud-blue" />
        <h1 className="text-2xl font-bold text-white">Health Monitor</h1>
        <span className="text-xs text-gray-600 font-mono self-end mb-1">DEGRADATION TRACKING</span>
      </div>

      {/* Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard title="Compressor" value={health.compressorHealth} type="health" status={health.compressorHealth >= 0.8 ? 'healthy' : health.compressorHealth >= 0.6 ? 'attention' : health.compressorHealth >= 0.4 ? 'warning' : 'critical'} />
        <StatusCard title="Combustor" value={health.combustorHealth} type="health" status={health.combustorHealth >= 0.8 ? 'healthy' : health.combustorHealth >= 0.6 ? 'attention' : health.combustorHealth >= 0.4 ? 'warning' : 'critical'} />
        <StatusCard title="Turbine" value={health.turbineHealth} type="health" status={health.turbineHealth >= 0.8 ? 'healthy' : health.turbineHealth >= 0.6 ? 'attention' : health.turbineHealth >= 0.4 ? 'warning' : 'critical'} />
        <StatusCard title="Overall Health" value={health.overallHealth} type="health" status={health.overallHealth >= 0.8 ? 'healthy' : health.overallHealth >= 0.6 ? 'attention' : health.overallHealth >= 0.4 ? 'warning' : 'critical'} large />
      </div>

      {/* Degradation Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TrendChart
            data={degradationTrends}
            title="Component Degradation Over Cycles"
            lines={[
              { dataKey: 'compressorHealth', color: '#00d4ff', name: 'Compressor' },
              { dataKey: 'combustorHealth', color: '#ffb300', name: 'Combustor' },
              { dataKey: 'turbineHealth', color: '#ff6a00', name: 'Turbine' },
              { dataKey: 'overallHealth', color: '#00ff88', name: 'Overall' },
            ]}
          />
        </div>

        {/* Health Summary */}
        <div className="space-y-4">
          <HealthSummaryCard
            title="Compressor Status"
            value={health.compressorHealth}
            icon={Activity}
            details={[
              { label: 'Pressure Ratio Efficiency', value: `${(health.compressorHealth * 0.95 * 100).toFixed(0)}%` },
              { label: 'Blade Condition', value: health.compressorHealth > 0.7 ? 'Good' : 'Degraded' },
            ]}
          />
          <HealthSummaryCard
            title="Combustor Status"
            value={health.combustorHealth}
            icon={AlertTriangle}
            details={[
              { label: 'Burner Efficiency', value: `${(health.combustorHealth * 0.92 * 100).toFixed(0)}%` },
              { label: 'Flame Stability', value: health.combustorHealth > 0.6 ? 'Stable' : 'Unstable' },
            ]}
          />
          <HealthSummaryCard
            title="Turbine Status"
            value={health.turbineHealth}
            icon={TrendingDown}
            details={[
              { label: 'Expansion Efficiency', value: `${(health.turbineHealth * 0.90 * 100).toFixed(0)}%` },
              { label: 'Thermal Stress', value: health.turbineHealth > 0.6 ? 'Nominal' : 'Elevated' },
            ]}
          />
        </div>
      </div>
    </motion.div>
  );
}

function HealthSummaryCard({
  title,
  value,
  icon: Icon,
  details,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  details: { label: string; value: string }[];
}) {
  const { label, color } = getHealthStatus(value);

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4" style={{ color }} />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{title}</span>
        <span className="ml-auto text-[10px] font-mono" style={{ color }}>{label}</span>
      </div>
      <div className="h-2 bg-surface-700 rounded-full mb-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}40` }}
        />
      </div>
      <div className="space-y-1.5">
        {details.map((d) => (
          <div key={d.label} className="flex justify-between text-xs">
            <span className="text-gray-500">{d.label}</span>
            <span className="text-gray-300 font-mono">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
