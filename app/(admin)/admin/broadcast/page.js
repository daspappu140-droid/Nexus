'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { MegaphoneIcon, PlusIcon, TrashIcon, PauseCircleIcon } from '@heroicons/react/24/outline';
import { PageHeader, AdminModal, EmptyState } from '@/components/ui/AdminComponents';

export default function AdminBroadcastPage() {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({ message: '', type: 'info' });

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch('/api/admin/broadcasts');
        if (res.ok) setBroadcasts((await res.json()).broadcasts || []);
      } catch {}
      finally { setLoading(false); }
    };
    fetch_();
  }, []);

  const handleCreate = async () => {
    if (!formData.message) { toast.error('Message required'); return; }
    try {
      const res = await fetch('/api/admin/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) { toast.success('Broadcast created'); setShowCreate(false); setFormData({ message: '', type: 'info' }); }
      else toast.error('Failed');
    } catch { toast.error('Error'); }
  };

  const typeColors = { info: 'bg-blue-50 border-blue-200 text-blue-700', warning: 'bg-amber-50 border-amber-200 text-amber-700', success: 'bg-emerald-50 border-emerald-200 text-emerald-700', error: 'bg-red-50 border-red-200 text-red-700' };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader icon={MegaphoneIcon} title="Broadcast Messages" subtitle="Site-wide announcements" color="from-amber-500 to-orange-600" action={<button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 text-sm"><PlusIcon className="w-4 h-4" />New Broadcast</button>} />

      {broadcasts.length > 0 ? (
        <div className="space-y-3">
          {broadcasts.map((b, i) => (
            <div key={i} className={`p-4 rounded-2xl border ${typeColors[b.type] || typeColors.info} flex items-center justify-between`}>
              <div>
                <p className="font-semibold text-sm">{b.message}</p>
                <p className="text-xs mt-1 opacity-70">Type: {b.type} • {b.isActive ? 'Active' : 'Inactive'} • {new Date(b.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${b.isActive ? 'bg-emerald-500' : 'bg-dark-300'}`} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={MegaphoneIcon} title="No Broadcasts" description="Create a broadcast to display a site-wide announcement" />
      )}

      {showCreate && (
        <AdminModal title="Create Broadcast" subtitle="This will show to all logged-in users" onClose={() => setShowCreate(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-dark-700 mb-1.5 block">Message</label>
              <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="Enter broadcast message..." rows={3} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-dark-700 mb-1.5 block">Type</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="input-field">
                <option value="info">Info (Blue)</option>
                <option value="warning">Warning (Amber)</option>
                <option value="success">Success (Green)</option>
                <option value="error">Error (Red)</option>
              </select>
            </div>
            <button onClick={handleCreate} className="btn-primary w-full">Publish Broadcast</button>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
