import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target } from 'lucide-react';
import { formatThrust, formatTSFC, formatPercentage } from '@/utils/format';
import type { ModelInfo } from '@/types/engine';

interface PredictionPanelProps {
  thrust: number;
  tsfc: number;
  confidence: number;
  modelInfo: ModelInfo;
}

const itemMotion = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, ease: 'easeOut' },
};

export default function PredictionPanel({ thrust, tsfc, confidence, modelInfo }: PredictionPanelProps) {
  return (
    <div className="glass-panel p-4 card-border-glow">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 mb-4"
      >
        <Brain className="w-4 h-4 text-hud-blue" />
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Predictions</h3>
      </motion.div>

      <div className="space-y-3">
        <motion.div {...itemMotion} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-700/50 hover:bg-surface-700/70 transition-colors">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-hud-amber" />
            <span className="text-xs text-gray-400">Thrust</span>
          </div>
          <span className="text-sm font-mono text-white font-bold tabular-nums">{formatThrust(thrust)}</span>
        </motion.div>

        <motion.div {...itemMotion} transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-700/50 hover:bg-surface-700/70 transition-colors">
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-hud-cyan" />
            <span className="text-xs text-gray-400">TSFC</span>
          </div>
          <span className="text-sm font-mono text-white font-bold tabular-nums">{formatTSFC(tsfc)}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="pt-2 border-t border-surface-600/50"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Confidence</span>
            <span className="text-xs font-mono text-hud-blue tabular-nums">{formatPercentage(confidence)}</span>
          </div>
          <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence * 100}%` }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full rounded-full bg-hud-blue"
              style={{ boxShadow: '0 0 8px rgba(0,212,255,0.4)' }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-2 border-t border-surface-600/50 space-y-0.5"
        >
          <p className="text-[10px] text-gray-600 font-mono">
            Model: {modelInfo.name} v{modelInfo.version}
          </p>
          <p className="text-[10px] text-gray-600 font-mono">
            Accuracy: {formatPercentage(modelInfo.accuracy)}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
