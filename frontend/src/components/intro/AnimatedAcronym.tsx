import { motion } from 'framer-motion';

interface AnimatedAcronymProps {
  phase: 'hidden' | 'revealing' | 'complete';
}

const ACRONYM = [
  { letter: 'N', word: 'Next-generation' },
  { letter: 'I', word: 'Intelligent' },
  { letter: 'R', word: 'Real-time' },
  { letter: 'I', word: 'Intelligent' },
  { letter: 'K', word: 'Knowledge-based' },
  { letter: 'S', word: 'Surveillance' },
  { letter: 'H', word: 'Health Framework' },
];

const STAGGER = 0.09;
const WORD_FONT_SIZE = 'clamp(0.4rem, 0.8vw, 0.65rem)';
const LETTER_FONT_SIZE = 'clamp(2.8rem, 9vw, 6.5rem)';

export default function AnimatedAcronym({ phase }: AnimatedAcronymProps) {
  const show = phase !== 'hidden';

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
      style={{ zIndex: 5 }}
      aria-label="NIRIKSH - Next-generation Intelligent Real-time Intelligent Knowledge-based Surveillance Health Framework"
    >
      {/* NIRIKSH letters */}
      <motion.div
        className="flex items-center gap-1 sm:gap-3 mb-2 sm:mb-3"
        initial="hidden"
        animate={show ? 'visible' : 'hidden'}
      >
        {ACRONYM.map(({ letter }, i) => (
          <motion.div
            key={letter + i}
            className="relative flex flex-col items-center"
            custom={i}
            initial={{ opacity: 0, y: 16, scale: 0.85, filter: 'blur(6px)' }}
            animate={
              show
                ? {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                  }
                : { opacity: 0, y: 16, scale: 0.85, filter: 'blur(6px)' }
            }
            transition={{
              delay: i * STAGGER + 0.08,
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <motion.span
              className="inline-block font-mono font-bold tracking-tight leading-none"
              style={{
                fontSize: LETTER_FONT_SIZE,
                color: phase === 'complete' ? '#00d4ff' : '#0f2540',
                textShadow:
                  phase === 'complete'
                    ? '0 0 20px rgba(0,212,255,0.35), 0 0 60px rgba(0,212,255,0.15)'
                    : 'none',
              }}
              animate={{
                color: phase === 'complete' ? '#00d4ff' : '#0f2540',
                textShadow:
                  phase === 'complete'
                    ? '0 0 20px rgba(0,212,255,0.35), 0 0 60px rgba(0,212,255,0.15)'
                    : 'none',
              }}
              transition={{
                delay: i * STAGGER + 0.2,
                duration: 0.25,
              }}
            >
              {letter}
            </motion.span>
          </motion.div>
        ))}
      </motion.div>

      {/* Acronym words */}
      <motion.div
        className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-4 gap-y-0.5 px-4"
        initial="hidden"
        animate={show ? 'visible' : 'hidden'}
      >
        {ACRONYM.map(({ word }, i) => (
          <motion.span
            key={word}
            className="font-mono tracking-wider text-gray-500"
            style={{ fontSize: WORD_FONT_SIZE }}
            custom={i}
            initial={{ opacity: 0, x: -8, filter: 'blur(3px)' }}
            animate={
              show
                ? {
                    opacity: 0.65,
                    x: 0,
                    filter: 'blur(0px)',
                  }
                : { opacity: 0, x: -8, filter: 'blur(3px)' }
            }
            transition={{
              delay: i * STAGGER + 0.12,
              duration: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
