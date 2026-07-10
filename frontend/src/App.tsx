import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardProvider } from '@/context/DashboardContext';
import { ToastProvider } from '@/context/ToastContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import StatusBar from '@/components/layout/StatusBar';
import ToastContainer from '@/components/common/ToastContainer';
import ParticleField from '@/components/common/ParticleField';
import Dashboard from '@/pages/Dashboard';
import HealthMonitor from '@/pages/HealthMonitor';
import EngineView from '@/pages/EngineView';
import Analytics from '@/pages/Analytics';
import Predictions from '@/pages/Predictions';
import Maintenance from '@/pages/Maintenance';
import SettingsPage from '@/pages/SettingsPage';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/health" element={<HealthMonitor />} />
          <Route path="/engine" element={<EngineView />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <DashboardProvider>
        <div className="h-screen flex flex-col bg-surface-900">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative">
              {/* Ambient layers */}
              <div className="grid-overlay-subtle absolute inset-0 pointer-events-none" />
              <ParticleField count={25} />
              <div className="scan-line-slow absolute inset-0 pointer-events-none z-[1]" />
              <div className="grain-overlay absolute inset-0 pointer-events-none z-[1]" />
              {/* Vignette effect */}
              <div className="absolute inset-0 pointer-events-none z-[1]" style={{
                background: 'radial-gradient(ellipse at center, transparent 60%, rgba(10, 14, 23, 0.4) 100%)'
              }} />
              {/* Content */}
              <div className="relative z-10 p-6">
                <AnimatedRoutes />
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
