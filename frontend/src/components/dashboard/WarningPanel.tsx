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
      className="glass-panel p-4 card-border-glow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-hud-amber" />
          Warnings
        </h3>
        <motion.span
          className="text-[10px] font-mono text-gray-500"
          key={activeWarnings.length}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
        >
          {activeWarnings.length} active
        </motion.span>
      </div>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {activeWarnings.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-4"
            >
              <motion.div
                className="w-8 h-8 rounded-full bg-hud-green/10 border border-hud-green/20 flex items-center justify-center mx-auto mb-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-hud-green text-xs">✓</span>
              </motion.div>
              <p className="text-xs text-hud-green font-mono">ALL SYSTEMS NOMINAL</p>
              <p className="text-[10px] text-gray-600 mt-0.5">No active warnings</p>
            </motion.div>
          ) : (
            activeWarnings.slice(0, 5).map((w) => {
              const Icon = iconMap[w.type];
              return (
                <motion.div
                  key={w.id}
                  layout
                  initial={{ opacity: 0, x: -16, scale: 0.96 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    borderColor: w.type === 'critical'
                      ? ['rgba(255,0,64,0.4)', 'rgba(255,0,64,0.15)', 'rgba(255,0,64,0.4)']
                      : undefined,
                  }}
                  exit={{ opacity: 0, x: 16, scale: 0.96 }}
                  transition={{
                    type: 'spring', stiffness: 300, damping: 25,
                    borderColor: w.type === 'critical' ? { duration: 1.5, repeat: Infinity } : undefined,
                  }}
                  className={`flex items-start gap-2 p-2.5 rounded-lg border relative overflow-hidden ${
                    w.type === 'critical'
                      ? 'bg-hud-red/5 border-hud-red/30 shadow-[0_0_12px_rgba(255,0,64,0.08)]'
                      : w.type === 'warning'
                      ? 'bg-hud-amber/5 border-hud-amber/20'
                      : 'bg-hud-blue/5 border-hud-blue/20'
                  }`}
                >
                  {/* Critical scan line */}
                  {w.type === 'critical' && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      animate={{ opacity: [0, 0.04, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        background: 'linear-gradient(180deg, transparent, rgba(255,0,64,0.08), transparent)',
                      }}
                    />
                  )}
                  <motion.div
                    animate={w.type === 'critical' ? { rotate: [0, 8, -8, 0] } : {}}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                        w.type === 'critical'
                          ? 'text-hud-red'
                          : w.type === 'warning'
                          ? 'text-hud-amber'
                          : 'text-hud-blue'
                      }`}
                    />
                  </motion.div>
              <div className="flex-1 min-w-0 relative z-10">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <motion.span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      w.type === 'critical' ? 'bg-hud-red' : w.type === 'warning' ? 'bg-hud-amber' : 'bg-hud-blue'
                    }`}
                    animate={w.type === 'critical' ? { scale: [1, 1.5, 1] } : w.type === 'warning' ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: w.type === 'critical' ? 0.8 : 1.5, repeat: Infinity }}
                    style={{
                      boxShadow: w.type === 'critical'
                        ? '0 0 10px rgba(255, 0, 64, 0.8)'
                        : w.type === 'warning'
                        ? '0 0 6px rgba(255, 179, 0, 0.4)'
                        : '0 0 6px rgba(0, 212, 255, 0.4)',
                    }}
                  />
                  <p className="text-xs font-medium text-gray-300 truncate">{w.message}</p>
                </div>
                <p className="text-[10px] text-gray-600 font-mono ml-[10px]">{w.component}</p>
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
