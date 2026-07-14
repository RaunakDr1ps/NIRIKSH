import { motion } from 'framer-motion';
import type { IntroPhase } from './AnimationContext';

interface Props {
  phase: IntroPhase;
}

/* Simple turbojet cross-section SVG.
   Every attribute always has a valid numeric value — NO undefined. */
export default function HolographicEngine({ phase }: Props) {
  const show = phase === 'intro';
  const delay = 1.4;
  const dur = 0.5;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      style={{ zIndex: 3 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: dur, delay }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 500 180"
        className="w-[70%] h-[70%]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="eg-heat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff6a00" stopOpacity="0" />
            <stop offset="50%" stopColor="#ff6a00" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ff6a00" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* — Outer casing — */}
        <motion.path
          d="M 60 75 L 90 72 L 210 68 L 290 68 L 400 72 L 440 80"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: show ? 1 : 0, opacity: show ? 0.5 : 0 }}
          transition={{ duration: 0.35, delay, ease: 'easeInOut' }}
        />
        <motion.path
          d="M 60 105 L 90 108 L 210 112 L 290 112 L 400 108 L 440 100"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: show ? 1 : 0, opacity: show ? 0.5 : 0 }}
          transition={{ duration: 0.35, delay: delay + 0.04, ease: 'easeInOut' }}
        />

        {/* Inlet / exhaust verticals */}
        <motion.line
          x1={60} y1={75} x2={60} y2={105}
          stroke="#00d4ff" strokeWidth="0.7"
          initial={{ opacity: 0 }} animate={{ opacity: show ? 0.4 : 0 }}
          transition={{ duration: 0.15, delay: delay + 0.1 }}
        />
        <motion.line
          x1={440} y1={80} x2={440} y2={100}
          stroke="#00d4ff" strokeWidth="0.7"
          initial={{ opacity: 0 }} animate={{ opacity: show ? 0.4 : 0 }}
          transition={{ duration: 0.15, delay: delay + 0.12 }}
        />

        {/* — Sections — */}
        {[
          { x: 90, y1: 72, y2: 108, d: delay + 0.18 },
          { x: 210, y1: 68, y2: 112, d: delay + 0.22 },
          { x: 290, y1: 68, y2: 112, d: delay + 0.26 },
          { x: 400, y1: 72, y2: 108, d: delay + 0.3 },
        ].map((s, i) => (
          <motion.line
            key={`div-${i}`}
            x1={s.x} y1={s.y1} x2={s.x} y2={s.y2}
            stroke="#00d4ff" strokeWidth="0.35" strokeDasharray="2,3"
            initial={{ opacity: 0 }} animate={{ opacity: show ? 0.2 : 0 }}
            transition={{ duration: 0.15, delay: s.d }}
          />
        ))}

        {/* — Center shaft — */}
        <motion.line
          x1={60} y1={90} x2={440} y2={90}
          stroke="#00d4ff" strokeWidth="0.4" strokeDasharray="4,3"
          initial={{ opacity: 0 }} animate={{ opacity: show ? 0.25 : 0 }}
          transition={{ duration: 0.2, delay: delay + 0.2 }}
        />

        {/* — Combustor chamber — */}
        <motion.rect
          x={220} y={78} width={65} height={24} rx={3}
          fill="url(#eg-heat)"
          stroke="#ff6a00" strokeWidth="0.4"
          initial={{ opacity: 0 }} animate={{ opacity: show ? 0.6 : 0 }}
          transition={{ duration: 0.2, delay: delay + 0.35 }}
        />
        <motion.rect
          x={224} y={82} width={57} height={16} rx={2}
          fill="none" stroke="#ff6a00" strokeWidth="0.25" strokeDasharray="2,3"
          initial={{ opacity: 0 }} animate={{ opacity: show ? 0.3 : 0 }}
          transition={{ duration: 0.2, delay: delay + 0.38 }}
        />
        <motion.ellipse
          cx={252} cy={90} rx={16} ry={8}
          fill="#ff6a00"
          initial={{ opacity: 0 }}
          animate={{ opacity: show ? [0.05, 0.12, 0.05] : 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.4 }}
        />

        {/* — Compressor blades — */}
        {[105, 120, 135, 150, 165, 180, 195].map((x, i) => (
          <motion.line
            key={`comp-${i}`}
            x1={x - 2.5} y1={70} x2={x + 2.5} y2={110}
            stroke="#00d4ff" strokeWidth="0.5" strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: show ? [0.15, 0.45, 0.15] : 0 }}
            transition={{
              opacity: { duration: 1.2, repeat: Infinity, delay: delay + 0.3 + i * 0.03, ease: 'easeInOut' },
            }}
          />
        ))}

        {/* — Turbine blades — */}
        {[305, 322, 339, 356, 373, 390].map((x, i) => (
          <motion.line
            key={`turb-${i}`}
            x1={x + 2.5} y1={70} x2={x - 2.5} y2={110}
            stroke="#ff6a00" strokeWidth="0.5" strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: show ? [0.15, 0.4, 0.15] : 0 }}
            transition={{
              opacity: { duration: 1.4, repeat: Infinity, delay: delay + 0.45 + i * 0.04, ease: 'easeInOut' },
            }}
          />
        ))}

        {/* — Exhaust cone — */}
        <motion.path
          d="M 400 72 L 440 80 L 440 100 L 400 108 Z"
          fill="none" stroke="#00d4ff" strokeWidth="0.6"
          initial={{ opacity: 0 }} animate={{ opacity: show ? 0.35 : 0 }}
          transition={{ duration: 0.2, delay: delay + 0.4 }}
        />

        {/* — Section labels — */}
        {[
          { label: 'INTAKE', x: 75, d: delay + 0.35 },
          { label: 'COMPRESSOR', x: 150, d: delay + 0.38 },
          { label: 'COMBUSTOR', x: 252, d: delay + 0.41 },
          { label: 'TURBINE', x: 350, d: delay + 0.44 },
          { label: 'EXHAUST', x: 420, d: delay + 0.47 },
        ].map((s, i) => (
          <motion.text
            key={`lbl-${i}`}
            x={s.x} y={140}
            textAnchor="middle"
            fill="#00d4ff"
            fontSize="4"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="500"
            letterSpacing="3"
            initial={{ opacity: 0, y: 145 }}
            animate={{ opacity: show ? 0.3 : 0, y: show ? 140 : 145 }}
            transition={{ duration: 0.2, delay: s.d, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {s.label}
          </motion.text>
        ))}

        {/* — HUD overlays — */}
        {[
          { label: 'P3 2.45 MPa', x: 30, y: 30, color: '#00d4ff' },
          { label: 'N1 14 250', x: 215, y: 30, color: '#ffb300' },
          { label: 'T4 1 892 K', x: 380, y: 30, color: '#ff6a00' },
          { label: 'η 0.87', x: 30, y: 160, color: '#00ff88' },
          { label: 'Wf 0.123', x: 215, y: 160, color: '#00ffb9' },
          { label: 'DET NONE', x: 380, y: 160, color: '#00ff88' },
        ].map((h, i) => (
          <motion.text
            key={`hud-${i}`}
            x={h.x}
            y={h.y}
            fill={h.color}
            fontSize="4.5"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="400"
            letterSpacing="1.5"
            textAnchor="middle"
            initial={{ opacity: 0 }}
            animate={{ opacity: show ? 0.5 : 0 }}
            transition={{ duration: 0.25, delay: delay + 0.6 + i * 0.06 }}
          >
            {h.label}
          </motion.text>
        ))}
      </svg>
    </motion.div>
  );
}
