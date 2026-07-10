import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Thermometer, Wind, Gauge, Activity } from 'lucide-react';
import { useDashboardContext } from '@/context/DashboardContext';
import { formatTemperature, formatPressure, formatNumber } from '@/utils/format';
import { getHealthBarColor } from '@/utils/format';

interface FlowParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function EngineView() {
  const { data } = useDashboardContext();

  const flowParticles: FlowParticle[] = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: 2 + Math.random() * 96,
        y: 35 + Math.random() * 30,
        size: 1.5 + Math.random() * 2.5,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.6,
      })),
    [],
  );

  const health = data?.health;

  const sections = [
    { id: 'intake', label: 'INTAKE', x: 2, w: 14, color: '#00d4ff', health: 1 },
    { id: 'compressor', label: 'COMPRESSOR', x: 18, w: 24, color: getHealthBarColor(health?.compressorHealth ?? 0.95), health: health?.compressorHealth ?? 0.95 },
    { id: 'combustor', label: 'COMBUSTOR', x: 44, w: 16, color: getHealthBarColor(health?.combustorHealth ?? 0.92), health: health?.combustorHealth ?? 0.92 },
    { id: 'turbine', label: 'TURBINE', x: 62, w: 22, color: getHealthBarColor(health?.turbineHealth ?? 0.88), health: health?.turbineHealth ?? 0.88 },
    { id: 'exhaust', label: 'EXHAUST', x: 86, w: 12, color: '#ff6a00', health: 1 },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <Cpu className="w-6 h-6 text-hud-blue" />
        <div>
          <h1 className="text-2xl font-bold text-white">Engine Visualization</h1>
          <p className="text-[10px] text-gray-600 font-mono">REAL-TIME SCHEMATIC</p>
        </div>
      </motion.div>

      {/* Main Engine SVG */}
      <motion.div variants={itemVariants} className="glass-panel p-6 relative overflow-hidden">
        <div className="scan-line" />
        <svg viewBox="0 0 100 100" className="w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="combustorGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff6a00" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ff6a00" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="intakeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background grid */}
          <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#1a2540" strokeWidth="0.1" />
          </pattern>
          <rect x="0" y="0" width="100" height="100" fill="url(#grid)" />

          {/* Engine housing */}
          <rect x="0" y="32" width="100" height="36" rx="8" fill="#0f1524" stroke="#1a2540" strokeWidth="1" />
          <rect x="0" y="34" width="100" height="32" rx="6" fill="none" stroke="#233150" strokeWidth="0.5" />

          {/* Sections */}
          {sections.map((s) => {
            const y = s.id === 'intake' || s.id === 'exhaust' ? 32 : 33;
            const h = s.id === 'intake' || s.id === 'exhaust' ? 36 : 34;
            const r = 6;
            return (
            <g key={s.id}>
              {s.id === 'intake' ? (
                <path
                  d={`M${s.x + r} ${y} L${s.x + s.w} ${y} L${s.x + s.w} ${y + h} L${s.x + r} ${y + h} A${r} ${r} 0 0 1 ${s.x} ${y + h - r} L${s.x} ${y + r} A${r} ${r} 0 0 1 ${s.x + r} ${y} Z`}
                  fill={`${s.color}12`}
                  stroke={s.color}
                  strokeWidth="0.8"
                  opacity={0.8}
                  style={{ filter: `url(#glow)` }}
                />
              ) : s.id === 'exhaust' ? (
                <path
                  d={`M${s.x} ${y} L${s.x + s.w - r} ${y} A${r} ${r} 0 0 1 ${s.x + s.w} ${y + r} L${s.x + s.w} ${y + h - r} A${r} ${r} 0 0 1 ${s.x + s.w - r} ${y + h} L${s.x} ${y + h} Z`}
                  fill={`${s.color}12`}
                  stroke={s.color}
                  strokeWidth="0.8"
                  opacity={0.8}
                  style={{ filter: `url(#glow)` }}
                />
              ) : (
                <rect
                  x={s.x}
                  y={y}
                  width={s.w}
                  height={h}
                  rx="0"
                  fill={`${s.color}12`}
                  stroke={s.color}
                  strokeWidth="0.8"
                  opacity={0.8}
                  style={{ filter: `url(#glow)` }}
                />
              )}

              {/* Section label */}
              <text
                x={s.x + s.w / 2}
                y={28}
                textAnchor="middle"
                fill={s.color}
                fontSize="3"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {s.label}
              </text>

              {/* Health bar */}
              {s.health < 1 && (
                <>
                  <rect x={s.x + 2} y={72} width={s.w - 4} height="2.5" rx="1" fill="#1a2540" />
                  <motion.rect
                    x={s.x + 2}
                    y={72}
                    width={(s.w - 4) * s.health}
                    height="2.5"
                    rx="1"
                    fill={s.color}
                    initial={{ width: 0 }}
                    animate={{ width: (s.w - 4) * s.health }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </>
              )}
            </g>
          );
        })}

          {/* Combustor glow */}
          <rect x="46" y="38" width="12" height="24" rx="3" fill="url(#combustorGlow)" />

          {/* Flame in combustor */}
          <motion.path
            d="M 48 50 Q 52 42 56 50 Q 52 58 48 50"
            fill="#ff004040"
            animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Compressor blades */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.line
              key={`cb-${i}`}
              x1={22 + i * 3.5}
              y1={36}
              x2={22 + i * 3.5}
              y2={64}
              stroke="#1a2540"
              strokeWidth="0.5"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
            />
          ))}

          {/* Turbine blades */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.line
              key={`tb-${i}`}
              x1={65 + i * 4}
              y1={36}
              x2={65 + i * 4}
              y2={64}
              stroke="#ff6a0050"
              strokeWidth="0.5"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity }}
            />
          ))}

          {/* Flow particles */}
          {flowParticles.map((p) => (
            <motion.circle
              key={p.id}
              cx={p.x}
              cy={p.y}
              r={p.size * 0.15}
              fill={p.x < 44 ? '#00d4ff' : p.x < 62 ? '#ff6a00' : '#ff0040'}
              opacity={p.opacity}
              animate={{
                cx: [p.x - 2, p.x + 2, p.x - 2],
                cy: [p.y, p.y - 1, p.y],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Center axis line */}
          <line x1="0" y1="50" x2="100" y2="50" stroke="#1a2540" strokeWidth="0.3" strokeDasharray="1,2" />

          {/* Intake arrow */}
          <motion.polygon
            points="0,46 6,46 6,44 10,50 6,56 6,54 0,54"
            fill="#00d4ff"
            opacity={0.5}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Exhaust arrow */}
          <motion.polygon
            points="100,46 94,46 94,44 90,50 94,56 94,54 100,54"
            fill="#ff6a00"
            opacity={0.5}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Exhaust heat waves */}
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.path
              key={`heat-${i}`}
              d={`M 90 ${44 + i * 4} Q 95 ${42 + i * 4} 100 ${44 + i * 4}`}
              stroke="#ff0040"
              strokeWidth="0.5"
              fill="none"
              opacity={0.4 - i * 0.08}
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 1 + i * 0.2, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Parameter Grid */}
      {data && (
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ParamBox label="T2 (Inlet)" value={formatTemperature(data.telemetry.t2_k)} icon={Thermometer} color="#00d4ff" />
          <ParamBox label="T3 (Comp. Out)" value={formatTemperature(data.telemetry.t3_k)} icon={Thermometer} color="#ffb300" />
          <ParamBox label="T4 (Turb. Inlet)" value={formatTemperature(data.telemetry.t4_k)} icon={Thermometer} color="#ff6a00" />
          <ParamBox label="P3 (Comp. Dis.)" value={formatPressure(data.telemetry.p3_pa)} icon={Wind} color="#00ffb9" />
          <ParamBox label="P2 (Inlet)" value={formatPressure(data.telemetry.p2_pa)} icon={Wind} color="#00d4ff" />
          <ParamBox label="P4 (Turb. Out)" value={formatPressure(data.telemetry.p4_pa)} icon={Wind} color="#ff6a00" />
          <ParamBox label="RPM" value={`${formatNumber(data.telemetry.rpm_rev_min / 1000, 1)}k`} icon={Gauge} color="#00ff88" />
          <ParamBox label="Fuel Flow" value={`${data.telemetry.fuelFlow_kg_s.toFixed(4)} kg/s`} icon={Activity} color="#ffb300" />
        </motion.div>
      )}
    </motion.div>
  );
}

function ParamBox({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}) {
  return (
    <motion.div
      className="glass-panel p-4 flex items-center gap-3"
      whileHover={{ y: -2, borderColor: `${color}50` }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
        whileHover={{ scale: 1.05 }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </motion.div>
      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">{label}</p>
        <p className="text-sm font-mono font-bold mt-0.5 tabular-nums" style={{ color }}>{value}</p>
      </div>
    </motion.div>
  );
}
