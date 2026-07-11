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
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <Wrench className="w-6 h-6 text-hud-blue" />
        <div>
          <h1 className="text-2xl font-bold text-white">Maintenance</h1>
          <p className="text-[10px] text-gray-600 font-mono">PREDICTIVE MAINTENANCE</p>
        </div>
      </motion.div>

      {/* Health Status */}
      <motion.div variants={itemVariants} className="glass-panel p-6 card-border-glow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-0.5 h-4 rounded-full" style={{ backgroundColor: statusColor, boxShadow: `0 0 6px ${statusColor}60` }} />
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Engine Health Overview</h3>
          </div>
          <motion.span
            className="text-[10px] font-mono font-semibold"
            style={{ color: statusColor }}
            key={overallHealth >= 0.8 ? 'healthy' : overallHealth >= 0.6 ? 'attention' : overallHealth >= 0.4 ? 'warning' : 'critical'}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {overallHealth >= 0.8 ? 'HEALTHY' : overallHealth >= 0.6 ? 'ATTENTION' : overallHealth >= 0.4 ? 'WARNING' : 'CRITICAL'}
          </motion.span>
        </div>
        <div className="h-3 bg-surface-700/80 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallHealth * 100}%` }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-full rounded-full"
            style={{ backgroundColor: statusColor, boxShadow: `0 0 12px ${statusColor}60` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-mono">
          <span className="text-gray-600">0%</span>
          <span className="text-gray-600">50%</span>
          <span className="text-gray-600">100%</span>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={itemVariants} className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Calendar className="w-4 h-4 text-hud-blue" />
          Maintenance Recommendations
        </h3>
        {recommendations.map((rec) => (
          <motion.div
            key={rec.component}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className={`glass-panel p-4 border-l-2 card-border-glow ${
              rec.priority === 'critical'
                ? 'border-l-hud-red'
                : rec.priority === 'high'
                ? 'border-l-hud-orange'
                : 'border-l-hud-green'
            }`}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {rec.priority === 'critical' ? (
                  <AlertTriangle className="w-5 h-5 text-hud-red mt-0.5" />
                ) : rec.priority === 'high' ? (
                  <Clock className="w-5 h-5 text-hud-orange mt-0.5" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-hud-green mt-0.5" />
                )}
                <div>
                  <h4 className="text-sm font-semibold text-white">{rec.component}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{rec.action}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono font-semibold" style={{ color: rec.priority === 'critical' ? '#ff0040' : rec.priority === 'high' ? '#ff6a00' : '#00ff88' }}>
                  {rec.priority.toUpperCase()}
                </p>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">Due: {rec.due}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
