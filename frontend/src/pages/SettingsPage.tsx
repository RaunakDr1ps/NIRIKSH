import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Globe, Database, Sliders, Monitor, Sun, Moon, Brain } from 'lucide-react';

export default function SettingsPage() {
  const [pollingRate, setPollingRate] = useState(5000);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-hud-blue" />
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <span className="text-xs text-gray-600 font-mono self-end mb-1">SYSTEM CONFIGURATION</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Display Settings */}
        <div className="glass-panel p-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
            <Monitor className="w-4 h-4 text-hud-blue" />
            Display
          </h3>
          <div className="space-y-4">
            <SettingRow label="Theme" icon={theme === 'dark' ? Moon : Sun}>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-surface-700 hover:bg-surface-600 border border-surface-500/50 text-gray-300 transition-colors"
              >
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </SettingRow>
            <SettingRow label="Auto Refresh" icon={Sliders}>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                  autoRefresh
                    ? 'bg-hud-green/10 border-hud-green/30 text-hud-green'
                    : 'bg-surface-700 border-surface-500/50 text-gray-500'
                }`}
              >
                {autoRefresh ? 'Enabled' : 'Disabled'}
              </button>
            </SettingRow>
            <SettingRow label="Polling Rate" icon={Globe}>
              <select
                value={pollingRate}
                onChange={(e) => setPollingRate(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-surface-700 border border-surface-500/50 text-gray-300"
              >
                <option value={1000}>1 second</option>
                <option value={5000}>5 seconds</option>
                <option value={10000}>10 seconds</option>
                <option value={30000}>30 seconds</option>
              </select>
            </SettingRow>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass-panel p-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-hud-blue" />
            Notifications
          </h3>
          <div className="space-y-4">
            <SettingRow label="Push Notifications" icon={Bell}>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                  notifications
                    ? 'bg-hud-green/10 border-hud-green/30 text-hud-green'
                    : 'bg-surface-700 border-surface-500/50 text-gray-500'
                }`}
              >
                {notifications ? 'Enabled' : 'Disabled'}
              </button>
            </SettingRow>
            <SettingRow label="Warning Alerts" icon={Bell}>
              <span className="px-3 py-1.5 rounded-lg text-xs font-mono bg-surface-700 border border-surface-500/50 text-hud-green">Active</span>
            </SettingRow>
            <SettingRow label="Critical Alerts" icon={Bell}>
              <span className="px-3 py-1.5 rounded-lg text-xs font-mono bg-hud-red/10 border border-hud-red/30 text-hud-red">Always Active</span>
            </SettingRow>
          </div>
        </div>

        {/* Data Management */}
        <div className="glass-panel p-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-hud-blue" />
            Data Management
          </h3>
          <div className="space-y-4">
            <SettingRow label="Dataset" icon={Database}>
              <span className="text-xs text-gray-500 font-mono">turbojet_complete_dataset.csv</span>
            </SettingRow>
            <SettingRow label="Records Loaded" icon={Database}>
              <span className="text-xs text-hud-blue font-mono">12,847</span>
            </SettingRow>
            <SettingRow label="Cache Size" icon={Database}>
              <span className="text-xs text-gray-400 font-mono">24.3 MB</span>
            </SettingRow>
          </div>
        </div>

        {/* System Info */}
        <div className="glass-panel p-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
            <Monitor className="w-4 h-4 text-hud-blue" />
            System Information
          </h3>
          <div className="space-y-4">
            <SettingRow label="Version" icon={Settings}>
              <span className="text-xs text-gray-300 font-mono">NIRIKSH v2.1.0</span>
            </SettingRow>
            <SettingRow label="API Status" icon={Globe}>
              <span className="text-xs text-hud-green font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-hud-green shadow-[0_0_6px_rgba(0,255,136,0.6)]" />
                Connected
              </span>
            </SettingRow>
            <SettingRow label="ML Model" icon={Brain}>
              <span className="text-xs text-hud-blue font-mono">NIRIKSH-XGB (Accuracy: 96.7%)</span>
            </SettingRow>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SettingRow({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      {children}
    </div>
  );
}
