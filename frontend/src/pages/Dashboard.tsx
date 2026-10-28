import { motion } from 'framer-motion';
import { useDashboardContext } from '@/context/DashboardContext';
import StatusCard from '@/components/common/StatusCard';
import HealthGauge from '@/components/common/HealthGauge';
import EngineDiagram from '@/components/engine/EngineDiagram';
import DegradationForecast from '@/components/charts/DegradationForecast';
import WarningPanel from '@/components/dashboard/WarningPanel';
import PredictionPanel from '@/components/dashboard/PredictionPanel';
import ParameterCard from '@/components/dashboard/ParameterCard';
import UploadButton from '@/components/dashboard/UploadButton';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import AlarmBanner from '@/components/common/AlarmBanner';
import { Activity, Gauge, Thermometer, Wind, Fuel, Compass, Cpu, Upload, AlertCircle } from 'lucide-react';

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

  const { telemetry, health, prediction, warnings, degradationTrends, modelInfo, datasetLoaded } = data;

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
        <div className="flex items-center gap-3">
          <div className="glass-panel px-3 py-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-hud-blue" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{
                backgroundColor: datasetLoaded
                  ? (health.overallHealth >= 0.8 ? '#00ff88' : health.overallHealth >= 0.6 ? '#ffb300' : health.overallHealth >= 0.4 ? '#ff6a00' : '#ff0040')
                  : '#666666',
                boxShadow: datasetLoaded
                  ? `0 0 6px ${health.overallHealth >= 0.8 ? '#00ff88' : health.overallHealth >= 0.6 ? '#ffb300' : health.overallHealth >= 0.4 ? '#ff6a00' : '#ff0040'}80`
                  : 'none',
              }} />
              <span className="text-xs font-mono tabular-nums text-white">
                {datasetLoaded ? `${(health.overallHealth * 100).toFixed(0)}%` : 'N/A'}
              </span>
            </div>
          </div>
          <UploadButton />
        </div>
      </motion.div>

      {!datasetLoaded && (
        <motion.div variants={itemVariants}>
          <div className="glass-panel p-6 border border-hud-blue/40 bg-hud-blue/5 card-border-glow">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-hud-blue/10 border border-hud-blue/40 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-hud-blue" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">No Dataset Loaded</h3>
                <p className="text-sm text-gray-400 mb-2">
                  Upload a telemetry CSV file using the "Upload Dataset" button above to begin analyzing engine health, performance predictions, and degradation trends.
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  Expected columns: EngineID, Cycle, Altitude_m, Mach, Tamb_K, Pamb_Pa, RPM_rev_min, FuelFlow_kg_s, P2_Pa, T2_K, P3_Pa, T3_K, P4_Pa, T4_K
                </p>
              </div>
              <div className="flex items-center gap-2 text-hud-blue">
                <Upload className="w-5 h-5" />
                <span className="text-sm font-mono">Awaiting Upload</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top Row: Status Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Compressor"
          value={datasetLoaded ? health.compressorHealth : 0}
          type="health"
          status={datasetLoaded ? (health.compressorHealth >= 0.8 ? 'healthy' : health.compressorHealth >= 0.6 ? 'attention' : health.compressorHealth >= 0.4 ? 'warning' : 'critical') : 'attention'}
        />
        <StatusCard
          title="Combustor"
          value={datasetLoaded ? health.combustorHealth : 0}
          type="health"
          status={datasetLoaded ? (health.combustorHealth >= 0.8 ? 'healthy' : health.combustorHealth >= 0.6 ? 'attention' : health.combustorHealth >= 0.4 ? 'warning' : 'critical') : 'attention'}
        />
        <StatusCard
          title="Turbine"
          value={datasetLoaded ? health.turbineHealth : 0}
          type="health"
          status={datasetLoaded ? (health.turbineHealth >= 0.8 ? 'healthy' : health.turbineHealth >= 0.6 ? 'attention' : health.turbineHealth >= 0.4 ? 'warning' : 'critical') : 'attention'}
        />
        <StatusCard
          title="Overall Health"
          value={datasetLoaded ? health.overallHealth : 0}
          type="health"
          status={datasetLoaded ? (health.overallHealth >= 0.8 ? 'healthy' : health.overallHealth >= 0.6 ? 'attention' : health.overallHealth >= 0.4 ? 'warning' : 'critical') : 'attention'}
          large
        />
      </motion.div>

      {/* Middle Row: Engine Diagram + Gauges */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <EngineDiagram health={datasetLoaded ? health : { compressorHealth: 0, combustorHealth: 0, turbineHealth: 0, overallHealth: 0 }} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <HealthGauge label="Thrust" value={datasetLoaded ? prediction.thrust_N : 0} max={50000} unit="N" type="thrust" />
          <HealthGauge label="TSFC" value={datasetLoaded ? prediction.tsfc_g_N_s : 0} max={50} unit="g/kN·s" type="tsfc" />
          <HealthGauge label="Confidence" value={datasetLoaded ? modelInfo.accuracy * 100 : 0} max={100} unit="%" type="confidence" />
          <HealthGauge label="RUL" value={datasetLoaded ? health.overallHealth * 100 : 0} max={100} unit="%" type="rul" />
        </div>
      </motion.div>

      {/* Parameters Grid */}
      <motion.div variants={itemVariants} className="glass-panel p-4 card-border-glow">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-surface-600/30">
          <div className="w-0.5 h-4 bg-hud-blue rounded-full" />
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
            Live Engine Parameters
          </h3>
          {!datasetLoaded && (
            <span className="ml-auto text-[10px] font-mono text-gray-500 uppercase tracking-wider">
              No Data
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {datasetLoaded ? (
            params.map((p) => (
              <ParameterCard key={p.label} {...p} />
            ))
          ) : (
            params.map((p) => (
              <div key={p.label} className="glass-panel p-3 border border-surface-600/30 opacity-40">
                <div className="flex items-center gap-2 mb-1">
                  <p.icon className="w-3 h-3 text-gray-500" />
                  <span className="text-[9px] uppercase tracking-wider text-gray-500">{p.label}</span>
                </div>
                <div className="text-lg font-mono text-gray-600">--</div>
                <div className="text-[9px] text-gray-600">{p.unit}</div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Bottom Row: Charts + Warnings */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {datasetLoaded ? (
            <DegradationForecast
              trends={degradationTrends}
              currentHealth={health.overallHealth}
            />
          ) : (
            <div className="glass-panel p-6 h-[300px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">Degradation Trends</p>
                <p className="text-xs text-gray-600 font-mono">Upload dataset to view trends</p>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <AlarmBanner
            severity={
              datasetLoaded
                ? health.overallHealth >= 0.8
                  ? 'normal'
                  : health.overallHealth >= 0.6
                  ? 'warning'
                  : 'critical'
                : 'normal'
            }
            message={
              datasetLoaded
                ? health.overallHealth >= 0.8
                  ? 'All systems nominal'
                  : health.overallHealth >= 0.6
                  ? `Engine health declining — ${(health.overallHealth * 100).toFixed(1)}% remaining`
                  : `Critical engine degradation — immediate action required (${(health.overallHealth * 100).toFixed(1)}%)`
                : 'No dataset loaded — awaiting telemetry upload'
            }
            details={
              datasetLoaded && health.overallHealth < 0.8
                ? `Compressor: ${(health.compressorHealth * 100).toFixed(1)}% | Combustor: ${(health.combustorHealth * 100).toFixed(1)}% | Turbine: ${(health.turbineHealth * 100).toFixed(1)}%`
                : datasetLoaded
                ? undefined
                : 'Upload a CSV file to enable monitoring and predictions'
            }
          />
          <WarningPanel warnings={datasetLoaded ? warnings : []} />
          <PredictionPanel
            thrust={datasetLoaded ? prediction.thrust_N : 0}
            tsfc={datasetLoaded ? prediction.tsfc_g_N_s : 0}
            confidence={datasetLoaded ? prediction.confidence : 0}
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
          <span className="text-hud-red text-xl font-bold">!</span>
        </div>
        <h3 className="text-hud-red font-mono text-sm mb-2">SYSTEM ERROR</h3>
        <p className="text-gray-400 text-sm">{message}</p>
      </div>
    </motion.div>
  );
}
