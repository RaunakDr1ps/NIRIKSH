import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { DegradationTrend } from '@/types/engine';

interface DegradationForecastProps {
  trends: DegradationTrend[];
  currentHealth: number;
}

interface ForecastPoint {
  label: string;
  cycle: number;
  health: number;
  confidenceLow: number;
  confidenceHigh: number;
}

function formatCycle(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export default function DegradationForecast({ trends, currentHealth }: DegradationForecastProps) {
  const { forecast, projectedEndOfLife, failureThreshold } = useMemo(() => {
    if (!trends || trends.length < 2) {
      return { forecast: [], projectedEndOfLife: 0, failureThreshold: 0.4 };
    }

    const sorted = [...trends].sort((a, b) => a.cycle - b.cycle);
    const lastCycle = sorted[sorted.length - 1].cycle;

    const rates = sorted.slice(-10).map((t, i, arr) => {
      if (i === 0) return 0;
      return (arr[i - 1].overallHealth - t.overallHealth) / (t.cycle - arr[i - 1].cycle);
    });
    const avgRate = rates.filter(r => r > 0).reduce((a, b) => a + b, 0) / Math.max(rates.filter(r => r > 0).length, 1);
    const degradationRate = Math.max(avgRate, 0.0005);

    const failureH = 0.4;
    const cyclesToFailure = (currentHealth - failureH) / degradationRate;

    const points: ForecastPoint[] = [
      {
        label: 'Current',
        cycle: lastCycle,
        health: currentHealth,
        confidenceLow: Math.max(0, currentHealth - 0.05),
        confidenceHigh: Math.min(1, currentHealth + 0.05),
      },
      {
        label: 'Tomorrow',
        cycle: lastCycle + 1,
        health: Math.max(0, currentHealth - degradationRate),
        confidenceLow: Math.max(0, currentHealth - degradationRate - 0.08),
        confidenceHigh: Math.min(1, currentHealth - degradationRate + 0.08),
      },
      {
        label: '+20 cycles',
        cycle: lastCycle + 20,
        health: Math.max(0, currentHealth - degradationRate * 20),
        confidenceLow: Math.max(0, currentHealth - degradationRate * 20 - 0.12),
        confidenceHigh: Math.min(1, currentHealth - degradationRate * 20 + 0.12),
      },
      {
        label: '+50 cycles',
        cycle: lastCycle + 50,
        health: Math.max(0, currentHealth - degradationRate * 50),
        confidenceLow: Math.max(0, currentHealth - degradationRate * 50 - 0.18),
        confidenceHigh: Math.min(1, currentHealth - degradationRate * 50 + 0.18),
      },
    ];

    const projectedEnd = Math.round(lastCycle + cyclesToFailure);

    return {
      forecast: points,
      projectedEndOfLife: projectedEnd,
      failureThreshold: failureH,
    };
  }, [trends, currentHealth]);

  if (!forecast || forecast.length === 0) {
    return (
      <div className="glass-panel p-4 card-border-glow">
        <div className="text-center py-8">
          <span className="text-xs text-gray-600 font-mono">Insufficient data for forecast</span>
        </div>
      </div>
    );
  }

  const padding = { top: 20, right: 20, bottom: 36, left: 36 };
  const width = 600;
  const height = 260;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const minCycle = Math.max(0, forecast[0].cycle - 5);
  const maxCycle = Math.max(projectedEndOfLife + 10, forecast[forecast.length - 1].cycle + 30);
  const cycleRange = maxCycle - minCycle;

  const xScale = (cycle: number) => padding.left + ((cycle - minCycle) / cycleRange) * chartW;
  const yScale = (health: number) => padding.top + (1 - health) * chartH;

  const linePath = forecast.map((p, i) => {
    const x = xScale(p.cycle);
    const y = yScale(p.health);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  const confLowPath = forecast.map((p, i) => {
    const x = xScale(p.cycle);
    const y = yScale(p.confidenceLow);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  const failureY = yScale(failureThreshold);

  const rul = Math.max(0, projectedEndOfLife - forecast[0].cycle);
  const rulPercent = Math.min(100, (rul / Math.max(projectedEndOfLife, 1)) * 100);

  return (
    <motion.div
      className="glass-panel p-4 card-border-glow"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-4 bg-hud-blue rounded-full" />
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Degradation Forecast
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-hud-green" />
            <span className="text-[9px] text-gray-500 font-mono">RUL</span>
            <motion.span
              className="text-[11px] font-mono font-bold text-hud-green tabular-nums"
              key={rul}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {rul} cycles
            </motion.span>
          </div>
          <div className="w-0.5 h-3 bg-surface-600" />
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-hud-red" />
            <span className="text-[9px] text-gray-500 font-mono">EOL</span>
            <span className="text-[11px] font-mono font-bold text-hud-red tabular-nums">{formatCycle(projectedEndOfLife)}</span>
          </div>
        </div>
      </div>

      <div className="relative" style={{ height }}>
        {/* RUL bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-surface-700/80 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${rulPercent}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              background: `linear-gradient(90deg, #ff0040, #ff6a00, #ffb300, #00ff88)`,
              boxShadow: '0 0 8px rgba(0,255,136,0.3)',
            }}
          />
        </motion.div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="confBandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.02" />
            </linearGradient>
            <filter id="forecastGlow">
              <feGaussianBlur stdDeviation="2" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => {
            const y = yScale(v);
            const isFailure = v === 0.4;
            return (
              <g key={v}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke={isFailure ? '#ff004030' : '#1a2540'}
                  strokeWidth={isFailure ? 0.5 : 0.5}
                  strokeDasharray={isFailure ? '4,3' : '2,3'}
                />
                <text
                  x={padding.left - 4}
                  y={y + 3}
                  textAnchor="end"
                  fill={isFailure ? '#ff004080' : '#4a5568'}
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {`${(v * 100).toFixed(0)}%`}
                </text>
                {isFailure && (
                  <text
                    x={padding.left - 4}
                    y={y - 5}
                    textAnchor="end"
                    fill="#ff004060"
                    fontSize="6"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    FAILURE THRESHOLD
                  </text>
                )}
              </g>
            );
          })}

          {/* Y-axis label */}
          <text
            x={8}
            y={padding.top + chartH / 2}
            textAnchor="middle"
            fill="#4a5568"
            fontSize="7"
            fontFamily="JetBrains Mono, monospace"
            transform={`rotate(-90, 8, ${padding.top + chartH / 2})`}
          >
            HEALTH %
          </text>

          {/* Confidence band */}
          <path
            d={`${confLowPath} ${forecast.slice().reverse().map((p) => {
              const x = xScale(p.cycle);
              const y = yScale(p.confidenceHigh);
              return `L${x},${y}`;
            }).join(' ')} Z`}
            fill="url(#confBandGrad)"
          />
          {(() => {
            const upperPath = forecast.map((p, i) => {
              const x = xScale(p.cycle);
              const y = yScale(p.confidenceHigh);
              return `${i === 0 ? 'M' : 'L'}${x},${y}`;
            }).join(' ');
            return (
              <path d={upperPath} fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity={0.2} strokeDasharray="2,2" />
            );
          })()}

          {/* Forecast line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="#00d4ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ filter: 'url(#forecastGlow)' }}
          />

          {/* Failure threshold line */}
          <line
            x1={padding.left}
            y1={failureY}
            x2={width - padding.right}
            y2={failureY}
            stroke="#ff0040"
            strokeWidth="1"
            strokeDasharray="6,4"
            opacity={0.7}
          />

          {/* Data points */}
          {forecast.map((p, i) => {
            const x = xScale(p.cycle);
            const y = yScale(p.health);
            return (
              <g key={p.label}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r={i === 0 ? 5 : 3.5}
                  fill="#0f1524"
                  stroke="#00d4ff"
                  strokeWidth={i === 0 ? 2 : 1.5}
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: i === 0 ? 5 : 3.5, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                  style={i === 0 ? { filter: 'drop-shadow(0 0 4px rgba(0,212,255,0.6))' } : undefined}
                />
                {i === 0 && (
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={8}
                    fill="none"
                    stroke="#00d4ff"
                    strokeWidth="0.5"
                    opacity={0.3}
                    initial={{ r: 0, opacity: 0 }}
                    animate={{ r: 8, opacity: 0.3 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  />
                )}
                <text
                  x={x}
                  y={height - 6}
                  textAnchor="middle"
                  fill="#6b7280"
                  fontSize="7"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {p.label}
                </text>
                <text
                  x={x}
                  y={y - (i === 0 ? 10 : 8)}
                  textAnchor="middle"
                  fill="#d1d5db"
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="bold"
                >
                  {`${(p.health * 100).toFixed(1)}%`}
                </text>
              </g>
            );
          })}

          {/* EOL marker */}
          <g>
            <motion.line
              x1={xScale(projectedEndOfLife)}
              y1={padding.top}
              x2={xScale(projectedEndOfLife)}
              y2={height - padding.bottom}
              stroke="#ff0040"
              strokeWidth="0.5"
              strokeDasharray="3,3"
              opacity={0.5}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.2 }}
            />
            <motion.text
              x={xScale(projectedEndOfLife)}
              y={padding.top - 4}
              textAnchor="middle"
              fill="#ff004080"
              fontSize="6"
              fontFamily="JetBrains Mono, monospace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              EOL
            </motion.text>
          </g>
        </svg>
      </div>

      {/* Health status indicators */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-surface-600/30">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-hud-green" />
          <span className="text-[9px] text-gray-600 font-mono">Healthy &gt;80%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-hud-amber" />
          <span className="text-[9px] text-gray-600 font-mono">Attention &gt;60%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-hud-orange" />
          <span className="text-[9px] text-gray-600 font-mono">Warning &gt;40%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-hud-red" />
          <span className="text-[9px] text-gray-600 font-mono">Critical</span>
        </div>
      </div>
    </motion.div>
  );
}
