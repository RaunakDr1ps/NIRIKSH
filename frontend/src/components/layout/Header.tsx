import { useState, useEffect } from 'react';
import { Activity, Bell, Download, Settings } from 'lucide-react';

export default function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-12 border-b border-slate-800/80 bg-[#0a0d14] flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <div>
            <h1 className="text-xs font-mono font-bold text-gray-200 tracking-[0.2em]">
              NIRIKSH
            </h1>
            <p className="text-[8px] text-gray-600 tracking-[0.15em] uppercase">
              ENGINE_HEALTH_MONITOR
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1.5 ml-4 px-2 py-0.5 border border-emerald-900/40 bg-emerald-950/10">
          <span className="w-1.5 h-1.5 bg-emerald-400" />
          <span className="text-[8px] text-emerald-400 font-mono uppercase tracking-wider">SYS_ONLINE</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-[8px] text-gray-600 font-mono">
            {time.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-')}
          </p>
          <p className="text-[10px] text-cyan-400 font-mono tracking-wider tabular-nums">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </p>
        </div>

        <button
          className="p-1 border border-slate-800/80 text-gray-600 hover:text-gray-400 hover:bg-slate-900/40"
          aria-label="Notifications"
        >
          <Bell className="w-3.5 h-3.5" />
        </button>
        <button
          className="p-1 border border-slate-800/80 text-gray-600 hover:text-gray-400 hover:bg-slate-900/40"
          aria-label="Download data"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
        <button
          className="p-1 border border-slate-800/80 text-gray-600 hover:text-gray-400 hover:bg-slate-900/40"
          aria-label="Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
