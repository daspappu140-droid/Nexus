'use client';
import { useState, useEffect } from 'react';
import { ShieldCheckIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { PageHeader, DataTable, StatsCard } from '@/components/ui/AdminComponents';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/admin/audit-logs');
        if (res.ok) setLogs((await res.json()).logs || []);
      } catch {}
      finally { setLoading(false); }
    };
    fetchLogs();
  }, []);

  const filtered = logs.filter(l => l.action?.toLowerCase().includes(search.toLowerCase()) || l.userId?.name?.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { header: 'Admin', render: (row) => <div><p className="text-sm font-medium text-dark-800">{row.userId?.name || 'System'}</p><p className="text-xs text-dark-400">{row.userId?.email}</p></div> },
    { header: 'Action', render: (row) => <span className="text-sm font-medium text-dark-800">{row.action}</span> },
    { header: 'Target', render: (row) => <span className="text-sm text-dark-500">{row.target || '—'}</span> },
    { header: 'IP Address', render: (row) => <span className="font-mono text-xs text-dark-400">{row.ipAddress || '—'}</span> },
    { header: 'Date', render: (row) => <span className="text-xs text-dark-400">{new Date(row.createdAt).toLocaleString('en-IN')}</span> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader icon={ShieldCheckIcon} title="Audit Logs" subtitle="All admin actions recorded" color="from-slate-600 to-slate-800" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard icon={ShieldCheckIcon} title="Total Entries" value={logs.length} color="from-slate-500 to-slate-700" />
        <StatsCard icon={ShieldCheckIcon} title="Today" value={logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length} color="from-blue-500 to-indigo-500" />
        <StatsCard icon={ShieldCheckIcon} title="This Week" value={logs.filter(l => new Date(l.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} color="from-purple-500 to-violet-500" />
      </div>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-dark-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by action or admin name..." className="input-field pl-11" />
      </div>
      <DataTable columns={columns} data={filtered} loading={loading} />
    </div>
  );
}
