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

  const bgColor = isCritical
    ? 'bg-hud-red/8'
    : isWarning
    ? 'bg-hud-amber/6'
    : 'bg-hud-green/5';

  const borderColor = isCritical
    ? 'border-hud-red/30'
    : isWarning
    ? 'border-hud-amber/20'
    : 'border-hud-green/20';

  const textColor = isCritical
    ? 'text-hud-red'
    : isWarning
    ? 'text-hud-amber'
    : 'text-hud-green';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={severity + message}
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`
          relative overflow-hidden rounded-lg border ${borderColor} ${bgColor} p-3
          ${isCritical ? 'shadow-[0_0_20px_rgba(255,0,64,0.15)]' : ''}
          ${isWarning ? 'shadow-[0_0_15px_rgba(255,179,0,0.08)]' : ''}
        `}
      >
        {/* Critical glow top border */}
        {isCritical && (
          <motion.div
            className="absolute inset-x-0 top-0 h-0.5 bg-hud-red"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        <div className="flex items-start gap-3 relative z-10">
          {/* Icon */}
          <motion.div
            animate={
              isCritical
                ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }
                : isWarning
                ? { scale: [1, 1.08, 1] }
                : { scale: [1, 1.05, 1] }
            }
            transition={{
              duration: isCritical ? 1.2 : 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {isCritical ? (
              <AlertOctagon className={`w-5 h-5 ${textColor}`} />
            ) : isWarning ? (
              <AlertTriangle className={`w-5 h-5 ${textColor}`} />
            ) : (
              <CheckCircle className={`w-5 h-5 ${textColor}`} />
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <motion.span
                className={`text-xs font-bold font-mono uppercase tracking-wider ${textColor}`}
                animate={
                  isCritical
                    ? { opacity: [1, 0.4, 1] }
                    : isWarning
                    ? { opacity: [1, 0.6, 1] }
                    : { opacity: 1 }
                }
                transition={
                  isCritical
                    ? { duration: 1.5, repeat: Infinity }
                    : isWarning
                    ? { duration: 2.5, repeat: Infinity }
                    : { duration: 0 }
                }
              >
                {isCritical ? 'CRITICAL' : isWarning ? 'WARNING' : 'NORMAL'}
              </motion.span>

              {(isCritical || isWarning) && (
                <motion.span
                  className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-hud-red' : 'bg-hud-amber'}`}
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: isCritical ? 0.8 : 1.5, repeat: Infinity }}
                  style={{
                    boxShadow: isCritical
                      ? '0 0 6px rgba(255, 0, 64, 0.8)'
                      : '0 0 6px rgba(255, 179, 0, 0.4)',
                  }}
                />
              )}
            </div>
            <p className="text-sm text-gray-300 mt-0.5 font-medium">{message}</p>
            {details && (
              <p className="text-[10px] text-gray-600 font-mono mt-1">{details}</p>
            )}
          </div>
        </div>

        {/* Scan line for critical */}
        {isCritical && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0, 0.04, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              background: 'linear-gradient(180deg, transparent, rgba(255,0,64,0.1), transparent)',
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
