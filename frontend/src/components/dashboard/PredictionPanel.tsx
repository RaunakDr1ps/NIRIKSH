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

export default function PredictionPanel({ thrust, tsfc, confidence, modelInfo }: PredictionPanelProps) {
  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-hud-blue" />
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Predictions</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 rounded-lg bg-surface-700/50">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-hud-amber" />
            <span className="text-xs text-gray-400">Thrust</span>
          </div>
          <span className="text-sm font-mono text-white font-bold">{formatThrust(thrust)}</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-surface-700/50">
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-hud-cyan" />
            <span className="text-xs text-gray-400">TSFC</span>
          </div>
          <span className="text-sm font-mono text-white font-bold">{formatTSFC(tsfc)}</span>
        </div>

        <div className="pt-2 border-t border-surface-600/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Confidence</span>
            <span className="text-xs font-mono text-hud-blue">{formatPercentage(confidence)}</span>
          </div>
          <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-hud-blue"
              style={{ boxShadow: '0 0 8px rgba(0,212,255,0.4)' }}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-surface-600/50">
          <p className="text-[10px] text-gray-600 font-mono">
            Model: {modelInfo.name} v{modelInfo.version}
          </p>
          <p className="text-[10px] text-gray-600 font-mono">
            Accuracy: {formatPercentage(modelInfo.accuracy)}
          </p>
        </div>
      </div>
    </div>
  );
}
