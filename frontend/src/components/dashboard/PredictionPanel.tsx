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
    <div className="panel p-2">
      <div className="flex items-center gap-1.5 mb-2">
        <Brain className="w-3 h-3 text-cyan-400" />
        <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em]">PREDICTION</h3>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between p-1.5 border border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-amber-400" />
            <span className="text-[9px] text-gray-500 font-mono uppercase">THRUST</span>
          </div>
          <span className="text-[11px] font-mono text-gray-200 tabular-nums">{formatThrust(thrust)}</span>
        </div>

        <div className="flex items-center justify-between p-1.5 border border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <Target className="w-3 h-3 text-cyan-400" />
            <span className="text-[9px] text-gray-500 font-mono uppercase">TSFC</span>
          </div>
          <span className="text-[11px] font-mono text-gray-200 tabular-nums">{formatTSFC(tsfc)}</span>
        </div>

        <div className="pt-1.5 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-gray-500 font-mono uppercase">CONFIDENCE</span>
            <span className="text-[10px] font-mono text-cyan-400 tabular-nums">{formatPercentage(confidence)}</span>
          </div>
          <div className="h-1 bg-slate-900 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence * 100}%` }}
              transition={{ duration: 0.6, ease: 'linear' }}
              className="h-full bg-cyan-400"
            />
          </div>
        </div>

        <div className="pt-1.5 border-t border-slate-800/80 space-y-0.5">
          <p className="text-[8px] text-gray-600 font-mono">
            MODEL:{' '}<span className="text-gray-400">{modelInfo.name}</span> v{modelInfo.version}
          </p>
          <p className="text-[8px] text-gray-600 font-mono">
            ACC:{' '}<span className="text-emerald-400">{formatPercentage(modelInfo.accuracy)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
