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
      className="relative bg-[#0a0d14] border-r border-slate-800/80 flex flex-col"
      animate={{ width: collapsed ? 56 : 200 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-1 flex flex-col gap-0.5 p-1 pt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : undefined}
            className="flex items-center gap-2 px-2 py-1.5 border border-transparent relative"
          >
            {({ isActive }: { isActive: boolean }) => (
              <div className="flex items-center gap-2 overflow-hidden w-full">
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3 bg-cyan-400" />
                )}
                <div
                  className={`flex items-center gap-2 w-full px-2 py-1.5 -mx-2 -my-1.5 ${
                    isActive
                      ? 'bg-cyan-950/20 text-cyan-400 border border-cyan-900/40'
                      : 'text-gray-500 hover:bg-slate-900/40 hover:text-gray-300'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="text-[10px] font-mono uppercase tracking-wider whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </NavLink>
        ))}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="m-1 p-1 border border-slate-800/80 text-gray-600 hover:text-gray-400 hover:bg-slate-900/40 self-end"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      <div className="p-2 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5" style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <span className="w-1.5 h-1.5 bg-emerald-400 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[8px] text-gray-600 font-mono uppercase tracking-wider whitespace-nowrap"
              >
                LINK:OK
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
