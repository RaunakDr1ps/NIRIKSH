import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardProvider } from '@/context/DashboardContext';
import { ToastProvider } from '@/context/ToastContext';
import { AnimationProvider, useAnimationContext } from '@/components/intro/AnimationContext';
import IntroAnimation from '@/components/intro/IntroAnimation';
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

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30, mass: 0.8 }}
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

function AppContent() {
  const { ready } = useAnimationContext();

  return (
    <motion.div
      className="h-screen flex flex-col bg-[#0a0d14]"
      initial={{ opacity: 0 }}
      animate={{
        opacity: ready ? 1 : 0,
      }}
      transition={{
        duration: 0.4,
      }}
    >
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative bg-[#0a0d14]">
          <div className="relative p-3">
            <AnimatedRoutes />
          </div>
        </main>
      </div>
      <StatusBar />
    </motion.div>
  );
}

export default function App() {
  return (
    <AnimationProvider>
      <ToastProvider>
        <DashboardProvider>
          <AppContent />
          <IntroAnimation />
          <ToastContainer />
        </DashboardProvider>
      </ToastProvider>
    </AnimationProvider>
  );
}
