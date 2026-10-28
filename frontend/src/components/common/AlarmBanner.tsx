import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertOctagon, CheckCircle } from 'lucide-react';

interface AlarmBannerProps {
  severity: 'normal' | 'warning' | 'critical';
  message: string;
  details?: string;
}

export default function AlarmBanner({ severity, message, details }: AlarmBannerProps) {
  const isWarning = severity === 'warning';
  const isCritical = severity === 'critical';

  void isCritical;
  void isWarning;

  const panelBorder = isCritical ? 'border-red-900/60' : isWarning ? 'border-amber-900/60' : 'border-emerald-900/60';
  const panelBg = isCritical ? 'bg-red-950/10' : isWarning ? 'bg-amber-950/10' : 'bg-emerald-950/10';
  const iconColor = isCritical ? 'text-red-500' : isWarning ? 'text-amber-400' : 'text-emerald-400';
  const statusColor = isCritical ? 'text-red-500' : isWarning ? 'text-amber-400' : 'text-emerald-400';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={severity + message}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`panel p-2 ${panelBorder} ${panelBg}`}
      >
        <div className="flex items-start gap-2">
          <div className="mt-0.5">
            {isCritical ? (
              <AlertOctagon className={`w-4 h-4 ${iconColor}`} />
            ) : isWarning ? (
              <AlertTriangle className={`w-4 h-4 ${iconColor}`} />
            ) : (
              <CheckCircle className={`w-4 h-4 ${iconColor}`} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${statusColor}`}>
                {isCritical ? 'CRITICAL' : isWarning ? 'WARNING' : 'NOMINAL'}
              </span>
              {(isCritical || isWarning) && (
                <span className={`w-1.5 h-1.5 ${isCritical ? 'bg-red-500' : 'bg-amber-400'}`} />
              )}
            </div>
            <p className="text-[11px] text-gray-300 mt-0.5 font-mono">{message}</p>
            {details && (
              <p className="text-[9px] text-gray-600 font-mono mt-0.5">{details}</p>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
