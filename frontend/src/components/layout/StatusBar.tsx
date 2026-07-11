import { motion } from 'framer-motion';

export default function StatusBar() {
  return (
    <footer className="h-7 border-t border-surface-600/50 bg-surface-900/90 backdrop-blur-md flex items-center justify-between px-4 text-[10px] text-gray-600 font-mono">
      <div className="flex items-center gap-4">
        <span className="text-gray-500 font-semibold tracking-wider">NIRIKSH</span>
        <span className="text-gray-700/60">v2.1.0</span>
        <span className="text-gray-700/40">|</span>
        <span className="text-gray-500 tracking-wide">Engine Health Monitoring System</span>
        <span className="text-gray-700/40">|</span>
        <span className="flex items-center gap-1.5">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-hud-green"
            style={{ boxShadow: '0 0 4px rgba(0,255,136,0.6)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-hud-green/70 font-semibold tracking-wider">SYSTEM NOMINAL</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="tracking-wider">DATA LINK <span className="text-hud-blue/70 font-semibold">ACTIVE</span></span>
        <span className="text-gray-700/40">|</span>
        <span className="tracking-wider">CLOCK <span className="text-hud-cyan/70 font-semibold">UTC</span></span>
        <span className="text-gray-700/40">|</span>
        <span className="tracking-wider">SYS LOAD <span className="text-hud-green/70 font-semibold">23%</span></span>
      </div>
    </footer>
  );
}
