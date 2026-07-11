import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useDashboardContext } from '@/context/DashboardContext';
import TrendChart from '@/components/charts/TrendChart';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { formatNumber } from '@/utils/format';

interface MetricCard {
  label: string;
  value: string;
  change: number;
  unit: string;
}

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

export default function Analytics() {
  const { data, loading } = useDashboardContext();

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 skeleton-pulse rounded" />
          <div className="h-7 w-32 skeleton-pulse rounded" />
        </div>
        <LoadingSkeleton type="card" count={4} />
        <LoadingSkeleton type="chart" count={2} />
      </div>
    );
  }

  if (!data) return null;

  const { history, degradationTrends, healthHistory } = data;

  const metrics: MetricCard[] = [
    {
      label: 'Avg RPM',
      value: `${formatNumber(history.reduce((s, t) => s + t.rpm_rev_min, 0) / history.length / 1000, 1)}k`,
      change: 2.3,
      unit: '%',
    },
    {
      label: 'Avg T4 Temp',
      value: `${formatNumber(history.reduce((s, t) => s + t.t4_k, 0) / history.length, 0)} K`,
      change: -1.1,
      unit: '%',
    },
    {
      label: 'Avg Health',
      value: `${formatNumber(healthHistory.reduce((s, h) => s + h.overallHealth, 0) / healthHistory.length * 100, 1)}%`,
      change: -0.8,
      unit: '%',
    },
    {
      label: 'Data Points',
      value: String(history.length),
      change: 100,
      unit: '',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-hud-blue" />
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-[10px] text-gray-600 font-mono">PERFORMANCE METRICS</p>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="glass-panel p-4 card-border-glow relative overflow-hidden"
            whileHover={{ y: -2 }}
          >
            {/* Accent bar */}
            <div
              className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
              style={{
                backgroundColor: m.change > 0 ? '#00ff88' : m.change < 0 ? '#ff0040' : '#4a5568',
                boxShadow: m.change !== 0 ? `0 0 6px ${m.change > 0 ? 'rgba(0,255,136,0.4)' : 'rgba(255,0,64,0.4)'}` : 'none',
              }}
            />
            <div className="pl-3">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">{m.label}</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-white">{m.value}</p>
              <div className="flex items-center gap-1 mt-1.5">
                {m.change > 0 ? (
                  <TrendingUp className="w-3 h-3 text-hud-green" />
                ) : m.change < 0 ? (
                  <TrendingDown className="w-3 h-3 text-hud-red" />
                ) : (
                  <Minus className="w-3 h-3 text-gray-500" />
                )}
                <span className={`text-[10px] font-mono tabular-nums ${m.change > 0 ? 'text-hud-green' : m.change < 0 ? 'text-hud-red' : 'text-gray-500'}`}>
                  {m.change > 0 ? '+' : ''}{m.change.toFixed(1)}{m.unit}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrendChart
          data={degradationTrends}
          title="Degradation Trends"
          lines={[
            { dataKey: 'compressorHealth', color: '#00d4ff', name: 'Compressor' },
            { dataKey: 'combustorHealth', color: '#ffb300', name: 'Combustor' },
            { dataKey: 'turbineHealth', color: '#ff6a00', name: 'Turbine' },
            { dataKey: 'overallHealth', color: '#00ff88', name: 'Overall' },
          ]}
        />
        <TrendChart
          data={degradationTrends.slice().reverse()}
          title="Health Distribution"
          lines={[
            { dataKey: 'overallHealth', color: '#00ff88', name: 'Overall Health' },
          ]}
        />
      </motion.div>
    </motion.div>
  );
}
