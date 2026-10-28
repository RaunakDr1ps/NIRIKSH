import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, AlertOctagon } from 'lucide-react';
import type { Warning } from '@/types/engine';

interface WarningPanelProps {
  warnings: Warning[];
}

const iconMap = {
  critical: AlertOctagon,
  warning: AlertCircle,
  info: Info,
};

export default function WarningPanel({ warnings }: WarningPanelProps) {
  const activeWarnings = warnings.filter((w) => w.active);

  return (
    <motion.div
      className="panel p-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          ALERTS
        </h3>
        <span className="text-[9px] font-mono text-gray-600">
          {activeWarnings.length}_ACTIVE
        </span>
      </div>
      <div className="space-y-1.5">
        <AnimatePresence mode="popLayout">
          {activeWarnings.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-2"
            >
              <p className="text-[10px] text-emerald-400 font-mono">NO_ALERTS</p>
            </motion.div>
          ) : (
            activeWarnings.slice(0, 4).map((w) => {
              const Icon = iconMap[w.type];
              const borderColor = w.type === 'critical' ? 'border-red-900/60' : w.type === 'warning' ? 'border-amber-900/60' : 'border-cyan-900/60';
              const bgColor = w.type === 'critical' ? 'bg-red-950/10' : w.type === 'warning' ? 'bg-amber-950/10' : 'bg-cyan-950/10';
              const iconColor = w.type === 'critical' ? 'text-red-500' : w.type === 'warning' ? 'text-amber-400' : 'text-cyan-400';
              return (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-start gap-1.5 p-1.5 border ${borderColor} ${bgColor}`}
                >
                  <Icon className={`w-3 h-3 mt-0.5 flex-shrink-0 ${iconColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-300 font-mono truncate">{w.message}</p>
                    <p className="text-[8px] text-gray-600 font-mono">{w.component}</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
