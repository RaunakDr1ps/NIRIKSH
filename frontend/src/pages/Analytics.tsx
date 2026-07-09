import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useDashboardContext } from '@/context/DashboardContext';
import TrendChart from '@/components/charts/TrendChart';
import { formatNumber } from '@/utils/format';

interface MetricCard {
  label: string;
  value: string;
  change: number;
  unit: string;
}

export default function Analytics() {
  const { data, loading } = useDashboardContext();

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-hud-blue border-t-transparent rounded-full animate-spin" />
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-hud-blue" />
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <span className="text-xs text-gray-600 font-mono self-end mb-1">PERFORMANCE METRICS</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-4"
          >
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">{m.label}</p>
            <p className="text-2xl font-bold font-mono text-white">{m.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {m.change > 0 ? (
                <TrendingUp className="w-3 h-3 text-hud-green" />
              ) : m.change < 0 ? (
                <TrendingDown className="w-3 h-3 text-hud-red" />
              ) : (
                <Minus className="w-3 h-3 text-gray-500" />
              )}
              <span className={`text-[10px] font-mono ${m.change > 0 ? 'text-hud-green' : m.change < 0 ? 'text-hud-red' : 'text-gray-500'}`}>
                {m.change > 0 ? '+' : ''}{m.change.toFixed(1)}{m.unit}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
      </div>
    </motion.div>
  );
}
