import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { useDashboardContext } from '@/context/DashboardContext';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { formatThrust, formatTSFC, formatPercentage } from '@/utils/format';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
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
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <Brain className="w-6 h-6 text-hud-blue" />
        <div>
          <h1 className="text-2xl font-bold text-white">Predictions</h1>
          <p className="text-[10px] text-gray-600 font-mono">ML INFERENCE ENGINE</p>
        </div>
      </motion.div>

      {/* Prediction Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="glass-panel-hover p-6 text-center card-border-glow"
          whileHover={{ y: -4 }}
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <TrendingUp className="w-8 h-8 text-hud-amber mx-auto mb-3" />
          </motion.div>
          <p className="text-xs text-gray-500 uppercase tracking-[0.15em] mb-1">Predicted Thrust</p>
          <p className="text-3xl font-bold font-mono tabular-nums text-white">{formatThrust(prediction.thrust_N)}</p>
          <p className="text-[10px] text-gray-600 mt-1">At current operating conditions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass-panel-hover p-6 text-center card-border-glow"
          whileHover={{ y: -4 }}
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <Target className="w-8 h-8 text-hud-cyan mx-auto mb-3" />
          </motion.div>
          <p className="text-xs text-gray-500 uppercase tracking-[0.15em] mb-1">Predicted TSFC</p>
          <p className="text-3xl font-bold font-mono tabular-nums text-white">{formatTSFC(prediction.tsfc_g_N_s)}</p>
          <p className="text-[10px] text-gray-600 mt-1">Specific fuel consumption</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass-panel-hover p-6 text-center card-border-glow"
          whileHover={{ y: -4 }}
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          >
            <BarChart3 className="w-8 h-8 text-hud-green mx-auto mb-3" />
          </motion.div>
          <p className="text-xs text-gray-500 uppercase tracking-[0.15em] mb-1">Confidence</p>
          <p className="text-3xl font-bold font-mono tabular-nums" style={{ color: '#00ff88' }}>{formatPercentage(prediction.confidence)}</p>
          <p className="text-[10px] text-gray-600 mt-1">Model prediction confidence</p>
        </motion.div>
      </motion.div>

      {/* Model Info */}
      <motion.div variants={itemVariants} className="glass-panel p-6 card-border-glow">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Model Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoItem label="Model" value={modelInfo.name} />
          <InfoItem label="Version" value={modelInfo.version} />
          <InfoItem label="Accuracy" value={formatPercentage(modelInfo.accuracy)} color="#00ff88" />
          <InfoItem label="Precision" value={formatPercentage(modelInfo.precision)} color="#00d4ff" />
          <InfoItem label="Recall" value={formatPercentage(modelInfo.recall)} color="#ffb300" />
          <InfoItem label="F1 Score" value={formatPercentage(modelInfo.f1Score)} color="#00ffb9" />
          <InfoItem label="Last Trained" value={modelInfo.lastTrained} />
          <InfoItem label="Features" value={`${modelInfo.features.length} inputs`} />
        </div>
      </motion.div>

      {/* Feature List */}
      <motion.div variants={itemVariants} className="glass-panel p-6 card-border-glow">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Feature Engineering</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {modelInfo.features.map((f) => (
            <motion.div
              key={f}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-700/50 border border-surface-600/30"
              whileHover={{ borderColor: 'rgba(0, 212, 255, 0.4)', backgroundColor: 'rgba(0, 212, 255, 0.05)' }}
              transition={{ duration: 0.2 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-hud-blue/60" />
              <span className="text-xs font-mono text-gray-400">{f}</span>
            </motion.div>
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
    <motion.div
      className="glass-panel p-3"
      whileHover={{ y: -1, borderColor: 'rgba(0, 212, 255, 0.2)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-mono font-bold tabular-nums" style={{ color: color ?? '#e5e7eb' }}>{value}</p>
    </motion.div>
  );
}
