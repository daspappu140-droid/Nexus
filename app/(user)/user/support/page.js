'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { TicketIcon, PlusIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { PageHeader, StatusBadge, AdminModal, EmptyState } from '@/components/ui/AdminComponents';

export default function UserSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/user/support');
      if (res.ok) setTickets((await res.json()).tickets || []);
    } catch {}
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!formData.subject || !formData.message) { toast.error('Please fill all fields'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/user/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('Ticket submitted successfully');
        setShowCreate(false);
        setFormData({ subject: '', message: '' });
        fetchTickets();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed');
      }
    } catch { toast.error('Error'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        icon={TicketIcon}
        title="Support"
        subtitle="Get help from our team"
        color="from-orange-500 to-red-600"
        action={<button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 text-sm"><PlusIcon className="w-4 h-4" />New Ticket</button>}
      />

      {tickets.length > 0 ? (
        <div className="bg-white rounded-2xl border border-dark-100 shadow-card overflow-hidden divide-y divide-dark-100">
          {tickets.map((ticket, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-semibold text-dark-800 text-sm">{ticket.subject}</p>
                <p className="text-xs text-dark-400 mt-0.5 line-clamp-1">{ticket.message}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={ticket.status} />
                <span className="text-xs text-dark-400">{new Date(ticket.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={TicketIcon} title="No Tickets" description="Need help? Create a support ticket and our team will respond shortly." action={<button onClick={() => setShowCreate(true)} className="btn-primary text-sm">Create Ticket</button>} />
      )}

      {showCreate && (
        <AdminModal title="Create Support Ticket" subtitle="Describe your issue" onClose={() => setShowCreate(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-dark-700 mb-1.5 block">Subject</label>
              <input type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} placeholder="Brief description of issue" className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-dark-700 mb-1.5 block">Message</label>
              <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="Explain your issue in detail..." rows={4} className="input-field" />
            </div>
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
              {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><PaperAirplaneIcon className="w-4 h-4" /> Submit Ticket</>}
            </button>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
