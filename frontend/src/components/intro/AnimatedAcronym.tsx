import { motion } from 'framer-motion';
import type { IntroPhase } from './AnimationContext';

interface Props {
  phase: IntroPhase;
}

const DATA = [
  { letter: 'N', word: 'Next-generation' },
  { letter: 'I', word: 'Intelligent' },
  { letter: 'R', word: 'Real-time' },
  { letter: 'I', word: 'Intelligent' },
  { letter: 'K', word: 'Knowledge-based' },
  { letter: 'S', word: 'Surveillance' },
  { letter: 'H', word: 'Health Framework' },
];

const letterVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8, filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { delay: 0.3 + i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  }),
  exit: { opacity: 0, y: -10, scale: 0.95, filter: 'blur(4px)', transition: { duration: 0.3 } },
};

const wordVariants = {
  hidden: { opacity: 0, x: -8, filter: 'blur(3px)' },
  visible: (i: number) => ({
    opacity: 0.65,
    x: 0,
    filter: 'blur(0px)',
    transition: { delay: 0.5 + i * 0.06, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  }),
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function AnimatedAcronym({ phase }: Props) {
  const show = phase === 'intro';

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
      style={{ zIndex: 5 }}
      aria-label="NIRIKSH — Next-generation Intelligent Real-time Intelligent Knowledge-based Surveillance Health Framework"
    >
      {/* NIRIKSH letters */}
      <motion.div
        className="flex items-center gap-1 sm:gap-3 mb-2 sm:mb-3"
        initial="hidden"
        animate={show ? 'visible' : 'exit'}
      >
        {DATA.map(({ letter }, i) => (
          <motion.div key={letter + i} className="relative" custom={i} variants={letterVariants}>
            <span
              className="inline-block font-mono font-bold tracking-tight leading-none"
              style={{
                fontSize: 'clamp(2.5rem, 9vw, 6rem)',
                color: show ? '#00d4ff' : '#0f2540',
                textShadow: show
                  ? '0 0 20px rgba(0,212,255,0.35), 0 0 60px rgba(0,212,255,0.15)'
                  : 'none',
              }}
            >
              {letter}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Acronym words */}
      <motion.div
        className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-4 gap-y-0.5 px-4"
        initial="hidden"
        animate={show ? 'visible' : 'exit'}
      >
        {DATA.map(({ word }, i) => (
          <motion.span
            key={word}
            className="font-mono tracking-wider text-gray-500"
            style={{ fontSize: 'clamp(0.4rem, 0.8vw, 0.65rem)' }}
            custom={i}
            variants={wordVariants}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
