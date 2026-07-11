import { motion } from 'framer-motion';
import { Activity, AlertTriangle, TrendingDown } from 'lucide-react';
import { useDashboardContext } from '@/context/DashboardContext';
import StatusCard from '@/components/common/StatusCard';
import TrendChart from '@/components/charts/TrendChart';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { getHealthStatus } from '@/utils/format';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function HealthMonitor() {
  const { data, loading } = useDashboardContext();

  if (loading && !data) {
    return <LoadingSkeleton type="page" />;
  }

  if (!data) return null;

  const { health, degradationTrends } = data;

  const healthValue = (v: number) =>
    v >= 0.8 ? 'healthy' : v >= 0.6 ? 'attention' : v >= 0.4 ? 'warning' : 'critical';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <Activity className="w-6 h-6 text-hud-blue" />
        <div>
          <h1 className="text-2xl font-bold text-white">Health Monitor</h1>
          <p className="text-[10px] text-gray-600 font-mono">DEGRADATION TRACKING</p>
        </div>
      </motion.div>

      {/* Health Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard title="Compressor" value={health.compressorHealth} type="health" status={healthValue(health.compressorHealth)} />
        <StatusCard title="Combustor" value={health.combustorHealth} type="health" status={healthValue(health.combustorHealth)} />
        <StatusCard title="Turbine" value={health.turbineHealth} type="health" status={healthValue(health.turbineHealth)} />
        <StatusCard title="Overall Health" value={health.overallHealth} type="health" status={healthValue(health.overallHealth)} large />
      </motion.div>

      {/* Degradation Chart */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-0.5 h-3 bg-hud-blue/60 rounded-full" />
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Component Details</span>
          </div>
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
      </motion.div>
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
    <motion.div
      className="glass-panel p-4 card-border-glow"
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4" style={{ color }} />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{title}</span>
        <span className="ml-auto text-[10px] font-mono" style={{ color }}>{label}</span>
      </div>
      <div className="h-2 bg-surface-700/80 rounded-full mb-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}40` }}
        />
      </div>
      <div className="space-y-1.5">
        {details.map((d) => (
          <div key={d.label} className="flex justify-between text-xs">
            <span className="text-gray-500">{d.label}</span>
            <span className="text-gray-300 font-mono tabular-nums">{d.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
