import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { useDashboardContext } from '@/context/DashboardContext';
import { formatThrust, formatTSFC, formatPercentage } from '@/utils/format';

export default function Predictions() {
  const { data, loading } = useDashboardContext();

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-hud-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const { prediction, modelInfo } = data;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="w-6 h-6 text-hud-blue" />
        <h1 className="text-2xl font-bold text-white">Predictions</h1>
        <span className="text-xs text-gray-600 font-mono self-end mb-1">ML INFERENCE ENGINE</span>
      </div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel-hover p-6 text-center"
        >
          <TrendingUp className="w-8 h-8 text-hud-amber mx-auto mb-3" />
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Predicted Thrust</p>
          <p className="text-3xl font-bold font-mono text-white">{formatThrust(prediction.thrust_N)}</p>
          <p className="text-[10px] text-gray-600 mt-1">At current operating conditions</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel-hover p-6 text-center"
        >
          <Target className="w-8 h-8 text-hud-cyan mx-auto mb-3" />
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Predicted TSFC</p>
          <p className="text-3xl font-bold font-mono text-white">{formatTSFC(prediction.tsfc_g_N_s)}</p>
          <p className="text-[10px] text-gray-600 mt-1">Specific fuel consumption</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-panel-hover p-6 text-center"
        >
          <BarChart3 className="w-8 h-8 text-hud-green mx-auto mb-3" />
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Confidence</p>
          <p className="text-3xl font-bold font-mono text-hud-green">{formatPercentage(prediction.confidence)}</p>
          <p className="text-[10px] text-gray-600 mt-1">Model prediction confidence</p>
        </motion.div>
      </div>

      {/* Model Info */}
      <div className="glass-panel p-6">
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
      </div>

      {/* Feature List */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Feature Engineering</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {modelInfo.features.map((f) => (
            <div key={f} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-700/50 border border-surface-600/30">
              <span className="w-1.5 h-1.5 rounded-full bg-hud-blue/60" />
              <span className="text-xs font-mono text-gray-400">{f}</span>
            </div>
          ))}
        </div>
      </div>
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
    <div className="glass-panel p-3">
      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-mono font-bold" style={{ color: color ?? '#e5e7eb' }}>{value}</p>
    </div>
  );
}
