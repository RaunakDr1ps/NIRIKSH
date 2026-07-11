import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { DegradationTrend } from '@/types/engine';

interface TrendChartProps {
  data: DegradationTrend[];
  title: string;
  lines: Array<{
    dataKey: keyof DegradationTrend;
    color: string;
    name: string;
  }>;
}

export default function TrendChart({ data, title, lines }: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <motion.div
        className="glass-panel p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-surface-700 border border-surface-600/50 flex items-center justify-center mx-auto mb-2">
              <span className="text-gray-500 text-xs">—</span>
            </div>
            <span className="text-xs text-gray-600 font-mono">No data available</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass-panel p-4 card-border-glow"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              {lines.map((line) => (
                <linearGradient key={line.dataKey} id={`gradient-${line.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={line.color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={line.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2540" strokeWidth={0.5} />
            <XAxis
              dataKey="cycle"
              stroke="#4a5568"
              tick={{ fill: '#4a5568', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
              tickLine={false}
              axisLine={{ stroke: '#1a2540' }}
            />
            <YAxis
              domain={[0, 1]}
              stroke="#4a5568"
              tick={{ fill: '#4a5568', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
              tickLine={false}
              axisLine={{ stroke: '#1a2540' }}
              tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 21, 36, 0.96)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(26, 37, 64, 0.8)',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono, monospace',
                padding: '12px 16px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              }}
              labelStyle={{ color: '#9ca3af', marginBottom: '6px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}
              formatter={(value: number) => [`${(value * 100).toFixed(1)}%`]}
            />
            <Legend
              wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', paddingTop: '4px' }}
              iconType="circle"
              iconSize={6}
              onMouseEnter={() => {}}
            />
            {lines.map((line, i) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.color}
                name={line.name}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, strokeWidth: 1, stroke: line.color, fill: '#0f1524' }}
                animationBegin={i * 200}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
