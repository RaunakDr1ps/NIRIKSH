export default function StatusBar() {
  return (
    <footer className="h-7 border-t border-surface-600/50 bg-surface-900/90 backdrop-blur-md flex items-center justify-between px-4 text-[10px] text-gray-500 font-mono">
      <div className="flex items-center gap-4">
        <span>NIRIKSH v2.1.0</span>
        <span className="text-surface-500">|</span>
        <span>Engine Health Monitoring System</span>
        <span className="text-surface-500">|</span>
        <span className="text-hud-green">SYSTEM NOMINAL</span>
      </div>
      <div className="flex items-center gap-4">
        <span>DATA LINK: <span className="text-hud-blue">ACTIVE</span></span>
        <span className="text-surface-500">|</span>
        <span>CLOCK: <span className="text-hud-cyan">UTC</span></span>
        <span className="text-surface-500">|</span>
        <span>LOAD: <span className="text-hud-green">23%</span></span>
      </div>
    </footer>
  );
}
