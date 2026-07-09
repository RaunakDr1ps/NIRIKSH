import { Routes, Route } from 'react-router-dom';
import { DashboardProvider } from '@/context/DashboardContext';
import { ToastProvider } from '@/context/ToastContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import StatusBar from '@/components/layout/StatusBar';
import ToastContainer from '@/components/common/ToastContainer';
import Dashboard from '@/pages/Dashboard';
import HealthMonitor from '@/pages/HealthMonitor';
import EngineView from '@/pages/EngineView';
import Analytics from '@/pages/Analytics';
import Predictions from '@/pages/Predictions';
import Maintenance from '@/pages/Maintenance';
import SettingsPage from '@/pages/SettingsPage';

export default function App() {
  return (
    <ToastProvider>
      <DashboardProvider>
        <div className="h-screen flex flex-col bg-surface-900">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative">
              <div className="grid-overlay absolute inset-0 pointer-events-none" />
              <div className="relative z-10 p-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/health" element={<HealthMonitor />} />
                  <Route path="/engine" element={<EngineView />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/predictions" element={<Predictions />} />
                  <Route path="/maintenance" element={<Maintenance />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </div>
            </main>
          </div>
          <StatusBar />
        </div>
        <ToastContainer />
      </DashboardProvider>
    </ToastProvider>
  );
}
