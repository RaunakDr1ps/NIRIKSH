import { motion } from 'framer-motion';
import { Wrench, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useDashboardContext } from '@/context/DashboardContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function Maintenance() {
  const { data } = useDashboardContext();

  const health = data?.health;
  const overallHealth = health?.overallHealth ?? 0.92;

  const recommendations = [
    {
      component: 'Compressor',
      action: overallHealth < 0.6 ? 'Immediate inspection required' : 'Routine check',
      priority: overallHealth < 0.4 ? 'critical' : overallHealth < 0.7 ? 'high' : 'low',
      due: overallHealth < 0.6 ? 'ASAP' : `${Math.ceil((overallHealth - 0.5) * 100)} cycles`,
    },
    {
      component: 'Combustor',
      action: overallHealth < 0.6 ? 'Fuel nozzle inspection' : 'Performance monitoring',
      priority: overallHealth < 0.5 ? 'critical' : overallHealth < 0.7 ? 'high' : 'low',
      due: overallHealth < 0.6 ? 'ASAP' : `${Math.ceil((overallHealth - 0.4) * 120)} cycles`,
    },
    {
      component: 'Turbine',
      action: overallHealth < 0.5 ? 'Blade inspection required' : 'Thermal coating check',
      priority: overallHealth < 0.4 ? 'critical' : overallHealth < 0.6 ? 'high' : 'low',
      due: overallHealth < 0.5 ? 'ASAP' : `${Math.ceil((overallHealth - 0.3) * 150)} cycles`,
    },
  ];

  const statusColor = overallHealth >= 0.8 ? '#00ff88' : overallHealth >= 0.6 ? '#ffb300' : overallHealth >= 0.4 ? '#ff6a00' : '#ff0040';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-2">
        <Wrench className="w-4 h-4 text-cyan-400" />
        <div>
          <h1 className="text-sm font-mono text-gray-200 uppercase tracking-[0.25em]">MAINTENANCE</h1>
          <p className="text-[9px] text-gray-600 font-mono uppercase tracking-wider">PREDICTIVE_MAINTENANCE</p>
        </div>
      </motion.div>

      {/* Health Status */}
      <motion.div variants={itemVariants} className="panel p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3" style={{ backgroundColor: statusColor }} />
            <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em]">ENGINE_HEALTH</h3>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] font-mono font-bold tabular-nums"
              style={{ color: statusColor }}
            >
              {(overallHealth * 100).toFixed(1)}%
            </span>
            <span
              className="text-[9px] font-mono uppercase tracking-wider"
              style={{ color: statusColor }}
            >
              {overallHealth >= 0.8 ? 'NOMINAL' : overallHealth >= 0.6 ? 'DEGRADED' : overallHealth >= 0.4 ? 'WARNING' : 'CRITICAL'}
            </span>
          </div>
        </div>
        <div className="h-1 bg-slate-900 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallHealth * 100}%` }}
            transition={{ duration: 0.8, ease: 'linear' }}
            className="h-full"
            style={{ backgroundColor: statusColor }}
          />
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={itemVariants} className="space-y-1.5">
        <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-cyan-400" />
          MAINTENANCE_TASKS
        </h3>
        {recommendations.map((rec) => (
          <motion.div
            key={rec.component}
            className={`panel p-2 border-l ${
              rec.priority === 'critical'
                ? 'border-l-red-500'
                : rec.priority === 'high'
                ? 'border-l-amber-400'
                : 'border-l-emerald-400'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                {rec.priority === 'critical' ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5" />
                ) : rec.priority === 'high' ? (
                  <Clock className="w-3.5 h-3.5 text-amber-400 mt-0.5" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5" />
                )}
                <div>
                  <h4 className="text-[11px] font-mono text-gray-200 uppercase">{rec.component}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{rec.action}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-mono uppercase" style={{ color: rec.priority === 'critical' ? '#ef4444' : rec.priority === 'high' ? '#fbbf24' : '#34d399' }}>
                  {rec.priority}
                </p>
                <p className="text-[8px] text-gray-600 font-mono mt-0.5">DUE:{rec.due}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
