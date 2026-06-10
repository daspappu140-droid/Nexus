'use client';
import { useState, useEffect } from 'react';
import { TicketIcon, MagnifyingGlassIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { PageHeader, StatusBadge, DataTable, StatsCard } from '@/components/ui/AdminComponents';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch('/api/admin/support');
        if (res.ok) setTickets((await res.json()).tickets || []);
      } catch {}
      finally { setLoading(false); }
    };
    fetchTickets();
  }, []);

  const filtered = tickets.filter(t => filter === 'all' || t.status === filter);
  const stats = { total: tickets.length, open: tickets.filter(t => t.status === 'open').length, inProgress: tickets.filter(t => t.status === 'in_progress').length, resolved: tickets.filter(t => t.status === 'resolved').length };

  const columns = [
    { header: 'Subject', render: (row) => <p className="font-semibold text-dark-800 text-sm truncate max-w-[200px]">{row.subject}</p> },
    { header: 'User', render: (row) => <div><p className="text-sm text-dark-700">{row.userId?.name}</p><p className="text-xs text-dark-400">{row.userId?.email}</p></div> },
    { header: 'Priority', render: (row) => <StatusBadge status={row.priority} /> },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Date', render: (row) => <span className="text-xs text-dark-400">{new Date(row.createdAt).toLocaleDateString('en-IN')}</span> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader icon={TicketIcon} title="Support Tickets" subtitle="Customer support management" color="from-orange-500 to-red-600" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={TicketIcon} title="Total" value={stats.total} color="from-blue-500 to-indigo-500" />
        <StatsCard icon={ChatBubbleLeftRightIcon} title="Open" value={stats.open} color="from-amber-500 to-orange-500" />
        <StatsCard icon={TicketIcon} title="In Progress" value={stats.inProgress} color="from-purple-500 to-violet-500" />
        <StatsCard icon={TicketIcon} title="Resolved" value={stats.resolved} color="from-emerald-500 to-teal-500" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {['all', 'open', 'in_progress', 'resolved', 'closed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-dark-600 border border-dark-200 hover:bg-dark-50'}`}>{f === 'all' ? 'All' : f.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</button>
        ))}
      </div>
      <DataTable columns={columns} data={filtered} loading={loading} />
    </div>
  );
}
