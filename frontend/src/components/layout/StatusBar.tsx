export default function StatusBar() {
  return (
    <footer className="h-6 border-t border-slate-800/80 bg-[#0a0d14] flex items-center justify-between px-3 text-[8px] text-gray-600 font-mono uppercase tracking-wider">
      <div className="flex items-center gap-3">
        <span className="text-gray-500">NIRIKSH</span>
        <span>v2.1.0</span>
        <span className="text-gray-800">|</span>
        <span>EHM_SYS</span>
        <span className="text-gray-800">|</span>
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 bg-emerald-400" />
          <span className="text-emerald-400/70">NOMINAL</span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span>DLK:<span className="text-cyan-400/70">ACT</span></span>
        <span className="text-gray-800">|</span>
        <span>CLK:<span className="text-cyan-400/70">UTC</span></span>
        <span className="text-gray-800">|</span>
        <span>LD:<span className="text-emerald-400/70">23%</span></span>
      </div>
    </footer>
  );
}
