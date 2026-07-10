import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Bell, Download, Settings } from 'lucide-react';

export default function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 border-b border-surface-600/50 bg-surface-900/95 backdrop-blur-md flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Activity className="w-7 h-7 text-hud-blue" />
            <motion.span
              className="absolute -top-1 -right-1 w-2 h-2 bg-hud-green rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wider">
              <span className="text-hud-blue">NIRIKSH</span>
              <span className="text-xs ml-2 text-gray-500 font-normal">v2.1.0</span>
            </h1>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase">
              Engine Health Monitoring System
            </p>
          </div>
        </div>
        <motion.div
          className="hidden md:flex items-center gap-2 ml-8 px-4 py-1.5 bg-surface-800/80 rounded-full border border-surface-600/50"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-hud-green"
            style={{ boxShadow: '0 0 6px rgba(0,255,136,0.6)' }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs text-hud-green font-mono">SYSTEM ONLINE</span>
        </motion.div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right mr-2">
          <p className="text-xs text-gray-400 font-mono">
            {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          <motion.p
            className="text-sm text-hud-blue font-mono tracking-wider tabular-nums"
            key={time.getHours() + ':' + time.getMinutes()}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
          >
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </motion.p>
        </div>

        <motion.button
          className="relative p-2 rounded-lg hover:bg-surface-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="w-4 h-4 text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-hud-orange rounded-full" />
        </motion.button>
        <motion.button
          className="p-2 rounded-lg hover:bg-surface-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-4 h-4 text-gray-400" />
        </motion.button>
        <motion.button
          className="p-2 rounded-lg hover:bg-surface-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="w-4 h-4 text-gray-400" />
        </motion.button>
      </div>
    </header>
  );
}
