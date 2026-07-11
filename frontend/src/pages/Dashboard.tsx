import { motion } from 'framer-motion';
import { useDashboardContext } from '@/context/DashboardContext';
import StatusCard from '@/components/common/StatusCard';
import HealthGauge from '@/components/common/HealthGauge';
import EngineDiagram from '@/components/engine/EngineDiagram';
import TrendChart from '@/components/charts/TrendChart';
import WarningPanel from '@/components/dashboard/WarningPanel';
import PredictionPanel from '@/components/dashboard/PredictionPanel';
import ParameterCard from '@/components/dashboard/ParameterCard';
import UploadButton from '@/components/dashboard/UploadButton';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { Activity, Gauge, Thermometer, Wind, Fuel, Compass } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
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

export default function Dashboard() {
  const { data, loading, error } = useDashboardContext();

  if (loading && !data) {
    return <LoadingSkeleton type="page" />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!data) return null;

  const { telemetry, health, prediction, warnings, degradationTrends, modelInfo } = data;

  const params = [
    { label: 'RPM', value: telemetry.rpm_rev_min, unit: 'rev/min', icon: Gauge, format: 'rpm' },
    { label: 'Altitude', value: telemetry.altitude_m, unit: 'm', icon: Activity },
    { label: 'Mach', value: telemetry.mach, unit: 'Ma', icon: Wind, decimals: 2 },
    { label: 'Fuel Flow', value: telemetry.fuelFlow_kg_s, unit: 'kg/s', icon: Fuel, format: 'fuel' },
    { label: 'T4 (Turbine Inlet)', value: telemetry.t4_k, unit: 'K', icon: Thermometer, format: 'temp' },
    { label: 'P3 (Comp. Discharge)', value: telemetry.p3_pa, unit: 'Pa', icon: Compass, format: 'pressure' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Top Bar */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-[0.15em]">
            Engine Overview
          </h2>
          <p className="text-[10px] text-gray-600 font-mono mt-0.5">
            Real-time engine health monitoring
          </p>
        </div>
        <UploadButton />
      </motion.div>

      {/* Top Row: Status Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Compressor"
          value={health.compressorHealth}
          type="health"
          status={health.compressorHealth >= 0.8 ? 'healthy' : health.compressorHealth >= 0.6 ? 'attention' : health.compressorHealth >= 0.4 ? 'warning' : 'critical'}
        />
        <StatusCard
          title="Combustor"
          value={health.combustorHealth}
          type="health"
          status={health.combustorHealth >= 0.8 ? 'healthy' : health.combustorHealth >= 0.6 ? 'attention' : health.combustorHealth >= 0.4 ? 'warning' : 'critical'}
        />
        <StatusCard
          title="Turbine"
          value={health.turbineHealth}
          type="health"
          status={health.turbineHealth >= 0.8 ? 'healthy' : health.turbineHealth >= 0.6 ? 'attention' : health.turbineHealth >= 0.4 ? 'warning' : 'critical'}
        />
        <StatusCard
          title="Overall Health"
          value={health.overallHealth}
          type="health"
          status={health.overallHealth >= 0.8 ? 'healthy' : health.overallHealth >= 0.6 ? 'attention' : health.overallHealth >= 0.4 ? 'warning' : 'critical'}
          large
        />
      </motion.div>

      {/* Middle Row: Engine Diagram + Gauges */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <EngineDiagram health={health} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <HealthGauge label="Thrust" value={prediction.thrust_N} max={50000} unit="N" type="thrust" />
          <HealthGauge label="TSFC" value={prediction.tsfc_g_N_s} max={50} unit="g/kN·s" type="tsfc" />
          <HealthGauge label="Confidence" value={modelInfo.accuracy * 100} max={100} unit="%" type="confidence" />
          <HealthGauge label="RUL" value={health.overallHealth * 100} max={100} unit="%" type="rul" />
        </div>
      </motion.div>

      {/* Parameters Grid */}
      <motion.div variants={itemVariants} className="glass-panel p-4 card-border-glow">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-surface-600/30">
          <div className="w-0.5 h-4 bg-hud-blue rounded-full" />
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
            Live Engine Parameters
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {params.map((p) => (
            <ParameterCard key={p.label} {...p} />
          ))}
        </div>
      </motion.div>

      {/* Bottom Row: Charts + Warnings */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
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
        </div>
        <div className="space-y-4">
          <WarningPanel warnings={warnings} />
          <PredictionPanel
            thrust={prediction.thrust_N}
            tsfc={prediction.tsfc_g_N_s}
            confidence={prediction.confidence}
            modelInfo={modelInfo}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center h-full"
    >
      <div className="glass-panel p-8 text-center max-w-md">
        <div className="w-12 h-12 rounded-full bg-hud-red/10 border border-hud-red/30 flex items-center justify-center mx-auto mb-4">
          <motion.span
            className="text-hud-red text-xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            !
          </motion.span>
        </div>
        <h3 className="text-hud-red font-mono text-sm mb-2">SYSTEM ERROR</h3>
        <p className="text-gray-400 text-sm">{message}</p>
      </div>
    </motion.div>
  );
}
