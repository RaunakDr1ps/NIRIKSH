import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Cpu,
  BarChart3,
  Brain,
  Wrench,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/health', label: 'Health Monitor', icon: Activity },
  { path: '/engine', label: 'Engine View', icon: Cpu },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/predictions', label: 'Predictions', icon: Brain },
  { path: '/maintenance', label: 'Maintenance', icon: Wrench },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      className="relative bg-surface-900/95 backdrop-blur-md border-r border-surface-600/50 flex flex-col"
      animate={{ width: collapsed ? 64 : 224 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex-1 flex flex-col gap-1 p-2 pt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group border border-transparent relative"
          >
            {({ isActive }: { isActive: boolean }) => (
              <motion.div layout className="flex items-center gap-3 overflow-hidden w-full">
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-hud-blue rounded-full"
                    style={{ boxShadow: '0 0 6px rgba(0,212,255,0.4)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <div
                  className={`flex items-center gap-3 w-full px-3 py-2.5 -mx-3 -my-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-hud-blue/10 text-hud-blue shadow-[0_0_10px_rgba(0,212,255,0.05)] border border-hud-blue/20'
                      : 'text-gray-400 hover:bg-surface-800 hover:text-gray-200'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>

      <motion.button
        onClick={() => setCollapsed(!collapsed)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="m-2 p-2 rounded-lg hover:bg-surface-800 text-gray-500 hover:text-gray-300 transition-colors self-end"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </motion.button>

      <div className="p-3 border-t border-surface-600/50">
        <motion.div
          className="flex items-center gap-2"
          animate={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-hud-green flex-shrink-0"
            style={{ boxShadow: '0 0 6px rgba(0,255,136,0.6)' }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] text-gray-500 font-mono tracking-wider whitespace-nowrap"
              >
                API: CONNECTED
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.aside>
  );
}
