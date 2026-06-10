'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MegaphoneIcon, ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const typeStyles = {
  info: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-300', icon: InformationCircleIcon },
  warning: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-300', icon: ExclamationTriangleIcon },
  success: { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-300', icon: CheckCircleIcon },
  error: { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-300', icon: ExclamationTriangleIcon },
};

export default function BroadcastBar() {
  const [broadcast, setBroadcast] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchBroadcast = async () => {
      try {
        const res = await fetch('/api/broadcast');
        if (res.ok) {
          const data = await res.json();
          if (data.broadcast) setBroadcast(data.broadcast);
        }
      } catch {}
    };
    fetchBroadcast();
    const interval = setInterval(fetchBroadcast, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!broadcast || dismissed) return null;

  const style = typeStyles[broadcast.type] || typeStyles.info;
  const TypeIcon = style.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={`border-b ${style.bg} overflow-hidden`}
      >
        <div className="flex items-center justify-between px-4 py-2.5 gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <TypeIcon className={`w-5 h-5 flex-shrink-0 ${style.text}`} />
            <p className={`text-sm font-medium truncate ${style.text}`}>{broadcast.message}</p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg hover:bg-white/5 text-dark-400 flex-shrink-0"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
