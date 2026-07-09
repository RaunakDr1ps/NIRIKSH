import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/ToastContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const typeConfig = {
  success: { icon: CheckCircle, bg: 'border-hud-green/30 bg-hud-green/5', text: 'text-hud-green', Icon: CheckCircle },
  error: { icon: XCircle, bg: 'border-hud-red/30 bg-hud-red/5', text: 'text-hud-red', Icon: XCircle },
  info: { icon: Info, bg: 'border-hud-blue/30 bg-hud-blue/5', text: 'text-hud-blue', Icon: Info },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = typeConfig[toast.type];
          const Icon = config.Icon;
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg border ${config.bg} backdrop-blur-md shadow-lg`}
            >
              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.text}`} />
              <p className={`flex-1 text-sm font-mono ${config.text}`}>{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className={`p-0.5 rounded hover:bg-surface-600/50 transition-colors ${config.text}`}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
