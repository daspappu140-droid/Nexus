'use client';
import { useState, useEffect } from 'react';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

export default function MaintenancePopup() {
  const [maintenance, setMaintenance] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user?.maintenanceMode) {
            setMaintenance(true);
            setMessage(data.user.maintenanceMessage || 'System under maintenance. Please wait.');
          } else {
            setMaintenance(false);
          }
        }
      } catch {}
    };
    checkMaintenance();
    const interval = setInterval(checkMaintenance, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!maintenance) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-dark-950/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
          <WrenchScrewdriverIcon className="w-10 h-10 text-amber-400 animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Under Maintenance</h2>
          <p className="text-dark-400">{message}</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs text-dark-500">Auto-checking every 15 seconds</span>
        </div>
      </div>
    </div>
  );
}
