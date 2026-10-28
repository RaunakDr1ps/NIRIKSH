import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { useDashboardContext } from '@/context/DashboardContext';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { formatThrust, formatTSFC, formatPercentage } from '@/utils/format';

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

export default function Predictions() {
  const { data, loading } = useDashboardContext();

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 skeleton-pulse rounded" />
          <div className="h-7 w-40 skeleton-pulse rounded" />
        </div>
        <LoadingSkeleton type="card" count={3} />
        <LoadingSkeleton type="card" count={4} />
      </div>
    );
  }

  if (!data) return null;

  const { prediction, modelInfo } = data;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-2">
        <Brain className="w-4 h-4 text-cyan-400" />
        <div>
          <h1 className="text-sm font-mono text-gray-200 uppercase tracking-[0.25em]">PREDICTIONS</h1>
          <p className="text-[9px] text-gray-600 font-mono uppercase tracking-wider">ML_INFERENCE</p>
        </div>
      </motion.div>

      {/* Prediction Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <motion.div
          className="panel p-3 text-center"
        >
          <TrendingUp className="w-4 h-4 text-amber-400 mx-auto mb-1.5" />
          <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mb-1 font-mono">THRUST_PRED</p>
          <p className="text-xl font-bold font-mono tabular-nums text-gray-200">{formatThrust(prediction.thrust_N)}</p>
          <p className="text-[8px] text-gray-600 mt-0.5 font-mono">AT_OP_COND</p>
        </motion.div>

        <motion.div
          className="panel p-3 text-center"
        >
          <Target className="w-4 h-4 text-cyan-400 mx-auto mb-1.5" />
          <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mb-1 font-mono">TSFC_PRED</p>
          <p className="text-xl font-bold font-mono tabular-nums text-gray-200">{formatTSFC(prediction.tsfc_g_N_s)}</p>
          <p className="text-[8px] text-gray-600 mt-0.5 font-mono">FUEL_CONS</p>
        </motion.div>

        <motion.div
          className="panel p-3 text-center"
        >
          <BarChart3 className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
          <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mb-1 font-mono">CONFIDENCE</p>
          <p className="text-xl font-bold font-mono tabular-nums text-emerald-400">{formatPercentage(prediction.confidence)}</p>
          <p className="text-[8px] text-gray-600 mt-0.5 font-mono">MODEL_CERTAINTY</p>
        </motion.div>
      </motion.div>

      {/* Model Info */}
      <motion.div variants={itemVariants} className="panel p-2">
        <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em] mb-2">MODEL_INFO</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
          <InfoItem label="MODEL" value={modelInfo.name} />
          <InfoItem label="VER" value={modelInfo.version} />
          <InfoItem label="ACC" value={formatPercentage(modelInfo.accuracy)} color="#34d399" />
          <InfoItem label="PREC" value={formatPercentage(modelInfo.precision)} color="#22d3ee" />
          <InfoItem label="REC" value={formatPercentage(modelInfo.recall)} color="#fbbf24" />
          <InfoItem label="F1" value={formatPercentage(modelInfo.f1Score)} color="#22d3ee" />
          <InfoItem label="TRAINED" value={modelInfo.lastTrained} />
          <InfoItem label="FEAT" value={`${modelInfo.features.length}`} />
        </div>
      </motion.div>

      {/* Feature List */}
      <motion.div variants={itemVariants} className="panel p-2">
        <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em] mb-2">FEATURE_SET</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
          {modelInfo.features.map((f) => (
            <div
              key={f}
              className="flex items-center gap-1.5 px-2 py-1 border border-slate-800/80"
            >
              <span className="w-1 h-1 bg-cyan-400" />
              <span className="text-[9px] font-mono text-gray-400">{f}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function InfoItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      className="panel-dense"
    >
      <p className="text-[8px] text-gray-600 uppercase tracking-wider font-mono mb-0.5">{label}</p>
      <p className="text-[11px] font-mono font-bold tabular-nums" style={{ color: color ?? '#d1d5db' }}>{value}</p>
    </div>
  );
}
