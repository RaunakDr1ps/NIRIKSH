import { motion } from 'framer-motion';
import type { IntroPhase } from './AnimationContext';

interface Props {
  phase: IntroPhase;
}

const STEPS = [
  { text: 'Initializing Physics Engine...', key: 'physics' },
  { text: 'Loading Digital Twin...', key: 'twin' },
  { text: 'Connecting Telemetry...', key: 'telemetry' },
  { text: 'Loading AI Models...', key: 'ai' },
  { text: 'Ready.', key: 'ready' },
];

const stepVariants = {
  hidden: { opacity: 0, x: -10, filter: 'blur(3px)' },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { delay: 1.8 + i * 0.15, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
  }),
  exit: { opacity: 0, x: 8, transition: { duration: 0.2 } },
};

export default function SystemBoot({ phase }: Props) {
  const show = phase === 'intro';

  return (
    <div
      className="absolute bottom-6 sm:bottom-10 right-4 sm:right-8 pointer-events-none select-none"
      style={{ zIndex: 5 }}
      role="status"
      aria-label="System initialization"
    >
      <motion.div
        className="flex flex-col items-end gap-2"
        initial="hidden"
        animate={show ? 'visible' : 'exit'}
      >
        {STEPS.map(({ text, key }, i) => (
          <motion.div
            key={key}
            className="flex items-center gap-2"
            custom={i}
            variants={stepVariants}
          >
            <span
              className="font-mono text-[10px] sm:text-xs tracking-wider whitespace-nowrap tabular-nums"
              style={{ color: 'rgba(148, 163, 184, 0.7)' }}
            >
              {text}
            </span>
            <motion.div
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm flex items-center justify-center flex-shrink-0"
              style={{
                border: '1px solid rgba(0, 212, 255, 0.25)',
              }}
              initial={{ scale: 0 }}
              animate={{ scale: show ? 1 : 0 }}
              transition={{ delay: 1.8 + i * 0.15 + 0.1, duration: 0.2, ease: 'backOut' }}
            >
              <motion.span
                className="text-[7px] sm:text-[8px] font-bold leading-none"
                style={{ color: '#00ff88' }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0 }}
                transition={{ delay: 1.8 + i * 0.15 + 0.2, duration: 0.15 }}
              >
                ✓
              </motion.span>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
