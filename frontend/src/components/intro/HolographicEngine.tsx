import { useMemo } from 'react';
import { motion } from 'framer-motion';

export type EnginePhase = 'hidden' | 'blueprint' | 'constructing' | 'complete' | 'morphing';

interface HolographicEngineProps {
  phase: EnginePhase;
}

const C = '#00d4ff';
const C_DIM = 'rgba(0, 212, 255, 0.2)';
const C_DASH = 'rgba(0, 212, 255, 0.12)';

const FLOW_WAYPOINTS = [
  { x: 70, y: 120 },
  { x: 110, y: 118 },
  { x: 180, y: 117 },
  { x: 240, y: 117 },
  { x: 285, y: 121 },
  { x: 320, y: 121 },
  { x: 380, y: 119 },
  { x: 450, y: 119 },
  { x: 530, y: 120 },
  { x: 570, y: 124 },
];

function generateFlowParticles() {
  const colors = ['#00d4ff', '#ff6a00', '#00ffb9', '#ffb300', '#00ff88'];
  return Array.from({ length: 12 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    delay: i * 0.18,
    size: 1.2 + (i % 4) * 0.6,
  }));
}

function generateBlades() {
  const compressor: { x1: number; y1: number; x2: number; y2: number; i: number }[] = [];
  const turbine: { x1: number; y1: number; x2: number; y2: number; i: number }[] = [];

  for (let i = 0; i < 10; i++) {
    const x = 122 + i * 12;
    compressor.push({
      x1: x - 3, y1: 90, x2: x + 3, y2: 150, i,
    });
  }
  for (let i = 0; i < 8; i++) {
    const x = 332 + i * 14;
    turbine.push({
      x1: x + 3, y1: 90, x2: x - 3, y2: 150, i,
    });
  }
  return { compressor, turbine };
}

const HUD_ITEMS = [
  { label: 'P3', value: '2.45 MPa', x: 8, y: 32, color: C },
  { label: 'N1', value: '14 250', x: 50, y: 32, color: '#ffb300' },
  { label: 'Wf', value: '0.123', x: 82, y: 32, color: '#00ffb9' },
  { label: 'T4', value: '1 892 K', x: 8, y: 220, color: '#ff6a00' },
  { label: 'η', value: '0.87', x: 50, y: 220, color: '#00ff88' },
  { label: 'DET', value: 'NONE', x: 82, y: 220, color: '#00ff88' },
];

const SECTION_LABELS = [
  { label: 'INTAKE', x: 90 },
  { label: 'COMPRESSOR', x: 175 },
  { label: 'COMBUSTOR', x: 280 },
  { label: 'TURBINE', x: 385 },
  { label: 'EXHAUST', x: 490 },
];

export default function HolographicEngine({ phase }: HolographicEngineProps) {
  const isConstructing = phase === 'constructing' || phase === 'complete' || phase === 'morphing';
  const isComplete = phase === 'complete' || phase === 'morphing';
  const isMorphing = phase === 'morphing';
  const visible = phase !== 'hidden';

  const flowParticles = useMemo(() => generateFlowParticles(), []);
  const { compressor, turbine } = useMemo(() => generateBlades(), []);

  const waypoints = useMemo(() => FLOW_WAYPOINTS, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-visible"
      style={{ zIndex: 3 }}
      animate={{
        scale: isMorphing ? 0.18 : 1,
        y: isMorphing ? -100 : 0,
        opacity: isMorphing ? 0 : 1,
      }}
      transition={{
        scale: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
        y: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
        opacity: { duration: 0.5, ease: 'easeIn' },
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 600 240"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="engineFill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C} stopOpacity="0" />
            <stop offset="20%" stopColor={C} stopOpacity="0.08" />
            <stop offset="50%" stopColor={C} stopOpacity="0.12" />
            <stop offset="80%" stopColor={C} stopOpacity="0.08" />
            <stop offset="100%" stopColor={C} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="combustorHeat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff6a00" stopOpacity="0" />
            <stop offset="40%" stopColor="#ff6a00" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#ffb300" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ff6a00" stopOpacity="0" />
          </linearGradient>
          <filter id="bloom">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softBloom">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="blueprintGrid" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 12 0 L 0 0 0 12" fill="none" stroke={C_DASH} strokeWidth="0.2" />
          </pattern>
        </defs>

        {/* Grid background */}
        <motion.rect
          x="0" y="0" width="600" height="240"
          fill="url(#blueprintGrid)"
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 0.4 : 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        />

        {/* Center crosshair */}
        <motion.line
          x1="0" y1="120" x2="600" y2="120"
          stroke={C_DASH} strokeWidth="0.3" strokeDasharray="2,6"
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.line
          x1="300" y1="0" x2="300" y2="240"
          stroke={C_DASH} strokeWidth="0.3" strokeDasharray="2,6"
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 0.2 : 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />

        {/* Outer casing — top contour */}
        <motion.path
          d="M 70 95 L 110 90 L 240 86 L 320 88 L 450 94 L 530 104"
          fill="none"
          stroke={C}
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: visible ? 1 : 0,
            opacity: visible ? 0.5 : 0,
          }}
          transition={{ duration: 0.35, delay: 0, ease: 'easeInOut' }}
        />
        {/* Construction parallel - top */}
        <motion.path
          d="M 70 99 L 110 94 L 240 90 L 320 92 L 450 98 L 530 108"
          fill="none"
          stroke={C}
          strokeWidth="0.3"
          strokeDasharray="3,5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 0.2 : 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />

        {/* Outer casing — bottom contour */}
        <motion.path
          d="M 70 145 L 110 150 L 240 154 L 320 152 L 450 146 L 530 136"
          fill="none"
          stroke={C}
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: visible ? 1 : 0,
            opacity: visible ? 0.5 : 0,
          }}
          transition={{ duration: 0.35, delay: 0.04, ease: 'easeInOut' }}
        />
        {/* Construction parallel - bottom */}
        <motion.path
          d="M 70 141 L 110 146 L 240 150 L 320 148 L 450 142 L 530 132"
          fill="none"
          stroke={C}
          strokeWidth="0.3"
          strokeDasharray="3,5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 0.2 : 0 }}
          transition={{ duration: 0.3, delay: 0.14 }}
        />

        {/* Inlet vertical */}
        <motion.path
          d="M 70 95 L 70 145"
          fill="none"
          stroke={C}
          strokeWidth="0.8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: visible ? 1 : 0,
            opacity: visible ? 0.45 : 0,
          }}
          transition={{ duration: 0.15, delay: 0.12, ease: 'easeInOut' }}
        />

        {/* Exhaust vertical */}
        <motion.path
          d="M 530 104 L 530 136"
          fill="none"
          stroke={C}
          strokeWidth="0.8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: visible ? 1 : 0,
            opacity: visible ? 0.45 : 0,
          }}
          transition={{ duration: 0.15, delay: 0.16, ease: 'easeInOut' }}
        />

        {/* Engine fill */}
        <motion.path
          d="M 70 95 L 110 90 L 240 86 L 320 88 L 450 94 L 530 104 L 530 136 L 450 146 L 320 152 L 240 154 L 110 150 L 70 145 Z"
          fill="url(#engineFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 0.5 : 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />

        {/* Center shaft */}
        <motion.path
          d="M 70 120 L 530 120"
          fill="none"
          stroke={C}
          strokeWidth="0.5"
          strokeDasharray="5,3"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isConstructing ? 0.3 : 0,
          }}
          transition={{ duration: 0.2, delay: 0.25 }}
        />

        {/* Section dividers */}
        {[
          { x: 110, y1: 90, y2: 150, delay: 0.3 },
          { x: 240, y1: 86, y2: 154, delay: 0.34 },
          { x: 320, y1: 88, y2: 152, delay: 0.38 },
          { x: 450, y1: 94, y2: 146, delay: 0.42 },
        ].map((d, i) => (
          <motion.line
            key={`div-${i}`}
            x1={d.x} y1={d.y1} x2={d.x} y2={d.y2}
            stroke={C} strokeWidth="0.4" strokeDasharray="2,4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isConstructing ? 0.25 : 0 }}
            transition={{ duration: 0.15, delay: d.delay }}
          />
        ))}

        {/* Structural ribs */}
        {[130, 150, 170, 190, 210].map((x, i) => (
          <motion.line
            key={`rib-${i}`}
            x1={x} y1={88} x2={x} y2={152}
            stroke={C_DIM} strokeWidth="0.3"
            initial={{ opacity: 0 }}
            animate={{ opacity: isConstructing ? 0.15 : 0 }}
            transition={{ duration: 0.1, delay: 0.35 + i * 0.03 }}
          />
        ))}

        {/* Compressor blades */}
        {compressor.map((b) => (
          <motion.line
            key={`comp-${b.i}`}
            x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}
            stroke={C} strokeWidth="0.6"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isConstructing ? [0.15, 0.5, 0.15] : 0,
            }}
            transition={{
              opacity: {
                duration: 1.2,
                repeat: Infinity,
                delay: 0.4 + b.i * 0.04,
                ease: 'easeInOut',
              },
            }}
          />
        ))}

        {/* Combustor chamber */}
        <motion.rect
          x="248" y="104" width="68" height="32" rx="3"
          fill="url(#combustorHeat)"
          stroke="#ff6a00" strokeWidth="0.5"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isConstructing ? 0.6 : 0,
          }}
          transition={{ duration: 0.2, delay: 0.48 }}
        />
        <motion.rect
          x="252" y="108" width="60" height="24" rx="2"
          fill="none" stroke="#ff6a00" strokeWidth="0.3"
          strokeDasharray="2,3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isConstructing ? 0.3 : 0 }}
          transition={{ duration: 0.2, delay: 0.5 }}
        />
        {/* Combustor glow */}
        <motion.ellipse
          cx="282" cy="120" rx="22" ry="12"
          fill="#ff6a00"
          filter="url(#softBloom)"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isConstructing
              ? [0.06, 0.15, 0.06]
              : 0,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.55,
          }}
        />
        {/* Flame core */}
        <motion.path
          d="M 270 120 Q 282 108 294 120 Q 282 132 270 120"
          fill="#ffb300" opacity={0}
          initial={{ opacity: 0 }}
          animate={{
            opacity: isConstructing ? [0, 0.25, 0] : 0,
            d: [
              'M 270 120 Q 282 108 294 120 Q 282 132 270 120',
              'M 268 120 Q 282 104 296 120 Q 282 136 268 120',
              'M 270 120 Q 282 108 294 120 Q 282 132 270 120',
            ],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.55,
          }}
          filter="url(#bloom)"
        />

        {/* Turbine blades */}
        {turbine.map((b) => (
          <motion.line
            key={`turb-${b.i}`}
            x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}
            stroke="#ff6a00" strokeWidth="0.6"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isConstructing ? [0.15, 0.45, 0.15] : 0,
            }}
            transition={{
              opacity: {
                duration: 1.4,
                repeat: Infinity,
                delay: 0.55 + b.i * 0.05,
                ease: 'easeInOut',
              },
            }}
          />
        ))}

        {/* Exhaust cone */}
        <motion.path
          d="M 450 94 L 530 104 L 530 136 L 450 146 Z"
          fill="none"
          stroke={C}
          strokeWidth="0.7"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: isConstructing ? 1 : 0,
            opacity: isConstructing ? 0.4 : 0,
          }}
          transition={{ duration: 0.2, delay: 0.6, ease: 'easeInOut' }}
        />
        {/* Exhaust construction lines */}
        <motion.path
          d="M 455 98 L 528 106 L 528 134 L 455 142 Z"
          fill="none"
          stroke={C}
          strokeWidth="0.3"
          strokeDasharray="2,4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isConstructing ? 0.15 : 0 }}
          transition={{ duration: 0.15, delay: 0.65 }}
        />

        {/* Compressor flow arrows */}
        {[0, 1, 2, 3].map((i) => (
          <motion.path
            key={`arr-c-${i}`}
            d={`M ${150 + i * 22} 115 L ${160 + i * 22} 115`}
            stroke={C}
            strokeWidth="0.5"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isComplete
                ? [0.1, 0.5, 0.1]
                : 0,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.12,
              ease: 'easeInOut',
            }}
          />
        ))}
        {/* Turbine flow arrows */}
        {[0, 1, 2, 3].map((i) => (
          <motion.path
            key={`arr-t-${i}`}
            d={`M ${360 + i * 22} 115 L ${370 + i * 22} 115`}
            stroke="#ff6a00"
            strokeWidth="0.5"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isComplete
                ? [0.1, 0.45, 0.1]
                : 0,
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: i * 0.14 + 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Flow particles */}
        {flowParticles.map((p) => (
          <motion.circle
            key={`flow-${p.id}`}
            r={p.size}
            fill={p.color}
            filter="url(#bloom)"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isComplete ? [0, 0.8, 0] : 0,
              cx: isComplete
                ? waypoints.map((wp) => wp.x)
                : [70],
              cy: isComplete
                ? waypoints.map((wp) => wp.y)
                : [120],
            }}
            transition={{
              opacity: {
                duration: 0.3,
                delay: p.delay,
              },
              cx: {
                duration: 2.8,
                repeat: Infinity,
                delay: p.delay,
                ease: 'linear',
              },
              cy: {
                duration: 2.8,
                repeat: Infinity,
                delay: p.delay,
                ease: 'linear',
              },
            }}
          />
        ))}

        {/* Section labels */}
        {SECTION_LABELS.map((s, i) => (
          <motion.text
            key={`slabel-${i}`}
            x={s.x}
            y={180}
            textAnchor="middle"
            fill={C}
            fontSize="4"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="500"
            letterSpacing="3"
            initial={{ opacity: 0, y: 185 }}
            animate={{
              opacity: isConstructing ? 0.35 : 0,
              y: isConstructing ? 180 : 185,
            }}
            transition={{
              duration: 0.2,
              delay: 0.5 + i * 0.06,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {s.label}
          </motion.text>
        ))}

        {/* HUD corner brackets */}
        <motion.path
          d="M 12 12 L 12 28 M 12 12 L 28 12"
          stroke={C} strokeWidth="0.6" fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isComplete ? 0.25 : 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        />
        <motion.path
          d="M 588 12 L 588 28 M 588 12 L 572 12"
          stroke={C} strokeWidth="0.6" fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isComplete ? 0.25 : 0 }}
          transition={{ duration: 0.3, delay: 0.72 }}
        />
        <motion.path
          d="M 12 228 L 12 212 M 12 228 L 28 228"
          stroke={C} strokeWidth="0.6" fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isComplete ? 0.25 : 0 }}
          transition={{ duration: 0.3, delay: 0.74 }}
        />
        <motion.path
          d="M 588 228 L 588 212 M 588 228 L 572 228"
          stroke={C} strokeWidth="0.6" fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isComplete ? 0.25 : 0 }}
          transition={{ duration: 0.3, delay: 0.76 }}
        />

        {/* HUD overlays */}
        {HUD_ITEMS.map((item, i) => (
          <motion.g
            key={`hud-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isComplete ? 0.6 : 0 }}
            transition={{ duration: 0.25, delay: 0.8 + i * 0.06 }}
          >
            <text
              x={`${item.x}%`}
              y={item.y}
              fill={item.color}
              fontSize="4"
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="600"
              letterSpacing="2"
              textAnchor="start"
              opacity="0.4"
            >
              {item.label}
            </text>
            <text
              x={`${item.x}%`}
              y={item.y + 8}
              fill={item.color}
              fontSize="4.5"
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="400"
              letterSpacing="1"
              textAnchor="start"
              filter="url(#bloom)"
            >
              {item.value}
            </text>
          </motion.g>
        ))}
      </svg>
    </motion.div>
  );
}
