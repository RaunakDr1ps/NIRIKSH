import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { EngineHealth } from '@/types/engine';

interface EngineDiagramProps {
  health: EngineHealth;
}

interface SectionConfig {
  id: string;
  label: string;
  healthValue: number;
  x: number;
  width: number;
  color: string;
}

const INTRAKE_COLOR = '#00d4ff';
const EXHAUST_COLOR = '#ff6a00';

function getHealthColor(value: number): string {
  if (value >= 0.8) return '#00ff88';
  if (value >= 0.6) return '#ffb300';
  if (value >= 0.4) return '#ff6a00';
  return '#ff0040';
}

export default function EngineDiagram({ health }: EngineDiagramProps) {
  const sections: SectionConfig[] = useMemo(() => {
    if (!health) return [];
    return [
      { id: 'intake', label: 'INTAKE', healthValue: 1, x: 2, width: 14, color: INTRAKE_COLOR },
      { id: 'compressor', label: 'COMPRESSOR', healthValue: health.compressorHealth, x: 18, width: 22, color: getHealthColor(health.compressorHealth) },
      { id: 'combustor', label: 'COMBUSTOR', healthValue: health.combustorHealth, x: 42, width: 16, color: getHealthColor(health.combustorHealth) },
      { id: 'turbine', label: 'TURBINE', healthValue: health.turbineHealth, x: 60, width: 20, color: getHealthColor(health.turbineHealth) },
      { id: 'exhaust', label: 'EXHAUST', healthValue: 1, x: 82, width: 16, color: EXHAUST_COLOR },
    ];
  }, [health]);

  if (!health) return null;

  const isCombustorCritical = health.combustorHealth < 0.4;

  return (
    <motion.div
      className="glass-panel p-4 h-full card-border-glow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-hud-blue flex-shrink-0"
          style={{ boxShadow: '0 0 6px rgba(0,212,255,0.6)' }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Engine Schematic</h3>
      </div>

      <div className="relative">
        <svg viewBox="0 0 100 30" className="w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="engineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1a2540" />
              <stop offset="50%" stopColor="#233150" />
              <stop offset="100%" stopColor="#1a2540" />
            </linearGradient>
              <filter id="glow-svg">
                <feGaussianBlur stdDeviation="1" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
          </defs>

          {/* Engine Body */}
          <rect x="0" y="8" width="100" height="14" rx="7" fill="url(#engineGrad)" stroke="#233150" strokeWidth="0.5" />

          {/* Sections */}
          {sections.map((s) => {
            const r = 6;
            return (
            <g key={s.id}>
              {s.id === 'exhaust' ? (
                <path
                  d={`M${s.x} 9 L${s.x + s.width - r} 9 A${r} ${r} 0 0 1 ${s.x + s.width} 15 A${r} ${r} 0 0 1 ${s.x + s.width - r} 21 L${s.x} 21 Z`}
                  fill={`${s.color}15`}
                  stroke={s.color}
                  strokeWidth="0.5"
                  style={{ filter: `url(#glow-svg)` }}
                />
              ) : (
                <motion.rect
                  x={s.x}
                  y="9"
                  width={s.width}
                  height="12"
                  rx={s.id === 'intake' ? '6' : '0'}
                  fill={`${s.color}15`}
                  stroke={s.color}
                  strokeWidth="0.5"
                  style={{ filter: `url(#glow-svg)` }}
                  animate={{
                    strokeOpacity: s.healthValue < 0.6 ? [0.6, 1, 0.6] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: s.healthValue < 0.6 ? Infinity : 0,
                    ease: 'easeInOut',
                  }}
                />
              )}
              {/* Combustor flame */}
              {s.id === 'combustor' && (
                <>
                  <rect x={s.x + 2} y="11" width={s.width - 4} height="8" rx="2" fill="#ff6a0020" />
                  <motion.rect
                    x={s.x + 4}
                    y="12"
                    width={s.width - 8}
                    height="6"
                    rx="1.5"
                    fill="#ff004030"
                    animate={{
                      opacity: isCombustorCritical ? [0.4, 1, 0.4] : [0.3, 0.8, 0.3],
                      scaleY: isCombustorCritical ? [1, 0.7, 1] : [1, 1, 1],
                    }}
                    transition={{ duration: isCombustorCritical ? 0.8 : 2, repeat: Infinity }}
                  />
                  {/* Flame core */}
                  <motion.ellipse
                    cx={s.x + s.width / 2}
                    cy={15}
                    rx={3}
                    ry={2}
                    fill="#ffb300"
                    opacity={0.15}
                    animate={{ opacity: [0.1, 0.25, 0.1], rx: [3, 4, 3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </>
              )}
            </g>
          );
        })}

          {/* Center line */}
          <line x1="0" y1="15" x2="100" y2="15" stroke="#1a2540" strokeWidth="0.3" strokeDasharray="1,2" />

          {/* Airflow particles */}
          {[8, 22, 30, 38, 50, 60, 70, 78, 90].map((x, i) => (
            <motion.circle
              key={`flow-${i}`}
              cx={x}
              cy={15}
              r={0.6 + (i % 3) * 0.3}
              fill={i < 2 ? INTRAKE_COLOR : i > 6 ? EXHAUST_COLOR : '#ffb300'}
              opacity={0.7}
              animate={{
                cx: [x, x + 2, x + 5, x + 2, x],
                opacity: [0.7, 1, 0.2, 1, 0.7],
              }}
              transition={{
                duration: 1.8 + i * 0.15,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.1,
              }}
            />
          ))}

          {/* Hot particles in combustor */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.circle
              key={`heat-${i}`}
              cx={44 + i * 2.5}
              cy={12 + Math.sin(i * 0.8)}
              r={0.5 + (i % 3) * 0.2}
              fill={i % 2 === 0 ? '#ff6a00' : '#ffb300'}
              animate={{
                cy: [12 + Math.sin(i * 0.8), 10, 14, 12 + Math.sin(i * 0.8)],
                opacity: [0.5, 1, 0.2, 0.5],
                cx: [44 + i * 2.5, 44 + i * 2.5 + 1, 44 + i * 2.5 - 1, 44 + i * 2.5],
              }}
              transition={{
                duration: 1 + i * 0.12,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.08,
              }}
            />
          ))}

          {/* Flow arrows */}
          <motion.path
            d="M 1 15 L 8 15"
            stroke={INTRAKE_COLOR}
            strokeWidth="0.8"
            strokeLinecap="round"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.path
            d="M 84 15 L 98 15"
            stroke={EXHAUST_COLOR}
            strokeWidth="0.8"
            strokeLinecap="round"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </svg>

        {/* Labels */}
        <div className="flex justify-between mt-2 px-1">
          {sections.map((s) => (
            <div key={s.id} className="text-center" style={{ marginLeft: s.id === 'intake' ? '0' : '-8px', marginRight: s.id === 'exhaust' ? '0' : '-8px' }}>
              <motion.div
                className="h-0.5 w-full rounded-full mb-1"
                style={{ backgroundColor: s.color, boxShadow: `0 0 4px ${s.color}60` }}
                animate={{ opacity: s.healthValue < 0.6 ? [0.4, 1, 0.4] : 0.6 }}
                transition={{ duration: 2, repeat: s.healthValue < 0.6 ? Infinity : 0 }}
              />
              <span className="text-[8px] font-mono font-semibold tracking-wider" style={{ color: s.color }}>
                {s.label}
              </span>
              {s.healthValue < 1 && (
                <div className="text-[7px] font-mono mt-0.5" style={{ color: getHealthColor(s.healthValue) }}>
                  {(s.healthValue * 100).toFixed(0)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
