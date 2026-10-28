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
      className="space-y-4"
    >
      {/* Top Bar */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-mono text-gray-300 uppercase tracking-[0.25em]">
            SYS_ID: #7520-NV | ENGINE_OVERVIEW
          </h2>
          <p className="text-[9px] text-gray-600 font-mono mt-0.5 uppercase tracking-wider">
            TELEMETRY_STREAM: {datasetLoaded ? 'ACTIVE' : 'IDLE'} | MODE: DIAGNOSTIC
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="panel px-2 py-1 flex items-center gap-2">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5" style={{
                backgroundColor: datasetLoaded
                  ? (health.overallHealth >= 0.8 ? '#34d399' : health.overallHealth >= 0.6 ? '#fbbf24' : health.overallHealth >= 0.4 ? '#fb923c' : '#ef4444')
                  : '#475569',
              }} />
              <span className="text-[10px] font-mono tabular-nums text-gray-300">
                {datasetLoaded ? `${(health.overallHealth * 100).toFixed(0)}%` : 'N/A'}
              </span>
            </div>
          </div>
          <UploadButton />
        </div>
      </motion.div>

      {!datasetLoaded && (
        <motion.div variants={itemVariants}>
          <div className="panel p-4 border border-cyan-900/40 bg-cyan-950/10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="w-8 h-8 border border-cyan-900/60 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-mono font-semibold text-gray-200 mb-1 uppercase tracking-wider">NO_DATASET_LOADED</h3>
                <p className="text-[11px] text-gray-400 mb-1">
                  UPLOAD_TELEMETRY_CSV TO INITIATE_HEALTH_ANALYSIS
                </p>
                <p className="text-[9px] text-gray-600 font-mono">
                  REQ: EngineID,Cycle,Altitude_m,Mach,Tamb_K,Pamb_Pa,RPM_rev_min,FuelFlow_kg_s,P2_Pa,T2_K,P3_Pa,T3_K,P4_Pa,T4_K
                </p>
              </div>
              <div className="flex items-center gap-2 text-cyan-400">
                <Upload className="w-4 h-4" />
                <span className="text-[10px] font-mono">AWAITING_UPLOAD</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top Row: Status Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <StatusCard
          title="COMPRESSOR"
          value={datasetLoaded ? health.compressorHealth : 0}
          type="health"
          status={datasetLoaded ? (health.compressorHealth >= 0.8 ? 'healthy' : health.compressorHealth >= 0.6 ? 'attention' : health.compressorHealth >= 0.4 ? 'warning' : 'critical') : 'attention'}
        />
        <StatusCard
          title="COMBUSTOR"
          value={datasetLoaded ? health.combustorHealth : 0}
          type="health"
          status={datasetLoaded ? (health.combustorHealth >= 0.8 ? 'healthy' : health.combustorHealth >= 0.6 ? 'attention' : health.combustorHealth >= 0.4 ? 'warning' : 'critical') : 'attention'}
        />
        <StatusCard
          title="TURBINE"
          value={datasetLoaded ? health.turbineHealth : 0}
          type="health"
          status={datasetLoaded ? (health.turbineHealth >= 0.8 ? 'healthy' : health.turbineHealth >= 0.6 ? 'attention' : health.turbineHealth >= 0.4 ? 'warning' : 'critical') : 'attention'}
        />
        <StatusCard
          title="OVERALL"
          value={datasetLoaded ? health.overallHealth : 0}
          type="health"
          status={datasetLoaded ? (health.overallHealth >= 0.8 ? 'healthy' : health.overallHealth >= 0.6 ? 'attention' : health.overallHealth >= 0.4 ? 'warning' : 'critical') : 'attention'}
          large
        />
      </motion.div>

      {/* Middle Row: Engine Diagram + Gauges */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div className="lg:col-span-2">
          <EngineDiagram health={datasetLoaded ? health : { compressorHealth: 0, combustorHealth: 0, turbineHealth: 0, overallHealth: 0 }} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <HealthGauge label="THRUST" value={datasetLoaded ? prediction.thrust_N : 0} max={50000} unit="N" type="thrust" />
          <HealthGauge label="TSFC" value={datasetLoaded ? prediction.tsfc_g_N_s : 0} max={50} unit="g/kN·s" type="tsfc" />
          <HealthGauge label="CONF" value={datasetLoaded ? modelInfo.accuracy * 100 : 0} max={100} unit="%" type="confidence" />
          <HealthGauge label="RUL_EST" value={datasetLoaded ? health.overallHealth * 100 : 0} max={100} unit="%" type="rul" />
        </div>
      </motion.div>

      {/* Parameters Grid */}
      <motion.div variants={itemVariants} className="panel p-2">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800/80">
          <div className="w-1 h-3 bg-cyan-400" />
          <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.25em]">
            LIVE_TELEMETRY
          </h3>
          <span className="ml-auto text-[9px] font-mono text-gray-600 uppercase tracking-wider">
            {datasetLoaded ? 'STREAM:OK' : 'STREAM:NULL'}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1.5">
          {datasetLoaded ? (
            params.map((p) => (
              <ParameterCard key={p.label} {...p} />
            ))
          ) : (
            params.map((p) => (
              <div key={p.label} className="panel-dense opacity-40">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p.icon className="w-2.5 h-2.5 text-gray-600" />
                  <span className="text-[8px] uppercase tracking-wider text-gray-600 font-mono">{p.label}</span>
                </div>
                <div className="text-sm font-mono text-gray-600">--</div>
                <div className="text-[8px] text-gray-700 font-mono">{p.unit}</div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Bottom Row: Charts + Warnings */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div className="lg:col-span-2 space-y-2">
          {datasetLoaded ? (
            <DegradationForecast
              trends={degradationTrends}
              currentHealth={health.overallHealth}
            />
          ) : (
            <div className="panel p-4 h-[280px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">DEGRADATION_TRENDS</p>
                <p className="text-[9px] font-mono text-gray-600">UPLOAD_DATASET_REQUIRED</p>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-2">
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
                  ? 'ALL_SYSTEMS_NOMINAL'
                  : health.overallHealth >= 0.6
                  ? `HEALTH_DEGRADING | ${(health.overallHealth * 100).toFixed(1)}%_REMAINING`
                  : `CRITICAL_DEGRADATION | ${(health.overallHealth * 100).toFixed(1)}%_REMAINING`
                : 'NO_DATASET_LOADED'
            }
            details={
              datasetLoaded && health.overallHealth < 0.8
                ? `CMP:${(health.compressorHealth * 100).toFixed(1)}% | CMB:${(health.combustorHealth * 100).toFixed(1)}% | TRB:${(health.turbineHealth * 100).toFixed(1)}%`
                : datasetLoaded
                ? undefined
                : 'UPLOAD_CSV_TO_ENABLE_MONITOR'
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
