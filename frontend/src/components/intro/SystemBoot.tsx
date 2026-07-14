import { motion } from 'framer-motion';

interface SystemBootProps {
  phase: 'hidden' | 'booting' | 'complete';
}

const BOOT_STEPS = [
  { text: 'Physics Model Loaded', key: 'physics' },
  { text: 'Synchronizing Telemetry', key: 'telemetry' },
  { text: 'Estimating Hidden Health States', key: 'states' },
  { text: 'Predicting Remaining Useful Life', key: 'rul' },
  { text: 'Digital Twin Locked', key: 'locked' },
];

const STEP_INTERVAL = 0.15;

export default function SystemBoot({ phase }: SystemBootProps) {
  const show = phase !== 'hidden';

  return (
    <div
      className="absolute bottom-6 sm:bottom-10 right-4 sm:right-8 pointer-events-none select-none"
      style={{ zIndex: 5 }}
      role="status"
      aria-label="System initialization status"
    >
      <motion.div
        className="flex flex-col items-end gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {BOOT_STEPS.map(({ text, key }, i) => {
          const completed = phase === 'complete';

          return (
            <motion.div
              key={key}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -12, filter: 'blur(4px)' }}
              animate={{
                opacity: show ? 1 : 0,
                x: show ? 0 : -12,
                filter: show ? 'blur(0px)' : 'blur(4px)',
              }}
              transition={{
                delay: i * STEP_INTERVAL + 0.3,
                duration: 0.25,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <motion.span
                className="font-mono text-[10px] sm:text-xs tracking-wider whitespace-nowrap tabular-nums"
                style={{
                  color: completed
                    ? 'rgba(0, 255, 136, 0.9)'
                    : 'rgba(148, 163, 184, 0.65)',
                }}
              >
                {text}
              </motion.span>

              <motion.div
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm flex items-center justify-center flex-shrink-0"
                style={{
                  border: completed
                    ? '1px solid rgba(0, 255, 136, 0.5)'
                    : '1px solid rgba(0, 212, 255, 0.25)',
                  backgroundColor: completed
                    ? 'rgba(0, 255, 136, 0.1)'
                    : 'transparent',
                  boxShadow: completed
                    ? '0 0 8px rgba(0, 255, 136, 0.2)'
                    : 'none',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: show ? 1 : 0,
                  opacity: show ? 1 : 0,
                }}
                transition={{
                  delay: i * STEP_INTERVAL + 0.4,
                  duration: 0.2,
                  ease: 'backOut',
                }}
              >
                <motion.span
                  className="text-[7px] sm:text-[8px] font-bold leading-none"
                  style={{ color: '#00ff88' }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: completed ? 1 : 0,
                    scale: completed ? 1 : 0,
                  }}
                  transition={{
                    delay: i * STEP_INTERVAL + 0.45,
                    duration: 0.15,
                  }}
                >
                  ✓
                </motion.span>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
