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
    <aside
      className={`relative bg-surface-900/95 backdrop-blur-md border-r border-surface-600/50 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="flex-1 flex flex-col gap-1 p-2 pt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-hud-blue/10 text-hud-blue border border-hud-blue/20 shadow-[0_0_10px_rgba(0,212,255,0.05)]'
                  : 'text-gray-400 hover:bg-surface-800 hover:text-gray-200 border border-transparent'
              }`
            }
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${collapsed ? 'mx-auto' : ''}`} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="m-2 p-2 rounded-lg hover:bg-surface-800 text-gray-500 hover:text-gray-300 transition-colors self-end"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className={`p-3 border-t border-surface-600/50 ${collapsed ? 'text-center' : ''}`}>
        <div className={`flex items-center gap-2 ${collapsed ? 'justify-center' : ''}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-hud-green shadow-[0_0_6px_rgba(0,255,136,0.6)]" />
          {!collapsed && (
            <span className="text-[10px] text-gray-500 font-mono tracking-wider">API: CONNECTED</span>
          )}
        </div>
      </div>
    </aside>
  );
}
