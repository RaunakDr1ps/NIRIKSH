import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { uploadDataset } from '@/services/api';
import { useDashboardContext } from '@/context/DashboardContext';
import { useToast } from '@/context/ToastContext';

export default function UploadButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { refetch } = useDashboardContext();
  const { addToast } = useToast();

  const handleClick = () => {
    if (!uploading) inputRef.current?.click();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      addToast('Please select a CSV file', 'error');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const result = await uploadDataset(file, (p) => setProgress(p));
      addToast(`Dataset loaded: ${result.rows} rows`, 'success');
      refetch();
    } catch {
      addToast('Upload failed. Please try again.', 'error');
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFile}
      />
      <motion.button
        onClick={handleClick}
        disabled={uploading}
        whileHover={uploading ? undefined : { scale: 1.02, borderColor: 'rgba(0, 212, 255, 0.6)' }}
        whileTap={uploading ? undefined : { scale: 0.98 }}
        className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-hud-blue bg-surface-800/80 border border-hud-blue/30 rounded-lg hover:bg-hud-blue/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
      >
        {uploading ? (
          <>
            <motion.svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </motion.svg>
            <span>Uploading {progress}%</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            <span>Upload Dataset</span>
          </>
        )}
      </motion.button>
      {uploading && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-surface-600 rounded-full overflow-hidden -mb-1">
          <motion.div
            className="h-full bg-hud-blue"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      )}
    </div>
  );
}
