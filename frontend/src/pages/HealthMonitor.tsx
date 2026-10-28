import { motion } from 'framer-motion';
import { Activity, AlertTriangle, TrendingDown } from 'lucide-react';
import { useDashboardContext } from '@/context/DashboardContext';
import StatusCard from '@/components/common/StatusCard';
import TrendChart from '@/components/charts/TrendChart';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';


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
      className="space-y-4"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-cyan-400" />
        <div>
          <h1 className="text-sm font-mono text-gray-200 uppercase tracking-[0.25em]">HEALTH_MONITOR</h1>
          <p className="text-[9px] text-gray-600 font-mono uppercase tracking-wider">DEGRADATION_TRACKING</p>
        </div>
      </motion.div>

      {/* Health Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <StatusCard title="COMPRESSOR" value={health.compressorHealth} type="health" status={healthValue(health.compressorHealth)} />
        <StatusCard title="COMBUSTOR" value={health.combustorHealth} type="health" status={healthValue(health.combustorHealth)} />
        <StatusCard title="TURBINE" value={health.turbineHealth} type="health" status={healthValue(health.turbineHealth)} />
        <StatusCard title="OVERALL" value={health.overallHealth} type="health" status={healthValue(health.overallHealth)} large />
      </motion.div>

      {/* Degradation Chart */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div className="lg:col-span-2">
          <TrendChart
            data={degradationTrends}
            title="COMPONENT_DEGRADATION_VS_CYCLE"
            lines={[
              { dataKey: 'compressorHealth', color: '#22d3ee', name: 'COMPRESSOR' },
              { dataKey: 'combustorHealth', color: '#fbbf24', name: 'COMBUSTOR' },
              { dataKey: 'turbineHealth', color: '#fb923c', name: 'TURBINE' },
              { dataKey: 'overallHealth', color: '#34d399', name: 'OVERALL' },
            ]}
          />
        </div>

        {/* Health Summary */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-2 bg-cyan-400" />
            <span className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-mono">COMPONENT_DETAIL</span>
          </div>
          <HealthSummaryCard
            title="COMPRESSOR"
            value={health.compressorHealth}
            icon={Activity}
            details={[
              { label: 'PR_EFF', value: `${(health.compressorHealth * 0.95 * 100).toFixed(0)}%` },
              { label: 'BLADE', value: health.compressorHealth > 0.7 ? 'OK' : 'DEG' },
            ]}
          />
          <HealthSummaryCard
            title="COMBUSTOR"
            value={health.combustorHealth}
            icon={AlertTriangle}
            details={[
              { label: 'BURN_EFF', value: `${(health.combustorHealth * 0.92 * 100).toFixed(0)}%` },
              { label: 'FLAME', value: health.combustorHealth > 0.6 ? 'STAB' : 'UNSTAB' },
            ]}
          />
          <HealthSummaryCard
            title="TURBINE"
            value={health.turbineHealth}
            icon={TrendingDown}
            details={[
              { label: 'EXP_EFF', value: `${(health.turbineHealth * 0.90 * 100).toFixed(0)}%` },
              { label: 'THERM', value: health.turbineHealth > 0.6 ? 'NOM' : 'ELEV' },
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
  const barColor =
    value >= 0.8 ? '#34d399' : value >= 0.6 ? '#fbbf24' : value >= 0.4 ? '#fb923c' : '#ef4444';
  const statusLabel = value >= 0.8 ? 'NOM' : value >= 0.6 ? 'DEG' : value >= 0.4 ? 'WRN' : 'CRIT';

  return (
    <motion.div
      className="panel p-2"
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="w-3 h-3" style={{ color: barColor }} />
        <span className="text-[9px] font-mono text-gray-400 uppercase tracking-[0.15em]">{title}</span>
        <span className="ml-auto text-[8px] font-mono" style={{ color: barColor }}>{statusLabel}</span>
      </div>
      <div className="h-1 bg-slate-900 mb-1.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.6, ease: 'linear' }}
          className="h-full"
          style={{ backgroundColor: barColor }}
        />
      </div>
      <div className="space-y-0.5">
        {details.map((d) => (
          <div key={d.label} className="flex justify-between">
            <span className="text-[8px] text-gray-600 font-mono uppercase">{d.label}</span>
            <span className="text-[9px] text-gray-300 font-mono tabular-nums">{d.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
