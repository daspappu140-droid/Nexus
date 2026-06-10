'use client';
import { useState, useEffect } from 'react';
import { CurrencyRupeeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { PageHeader, StatusBadge, DataTable, StatsCard } from '@/components/ui/AdminComponents';

export default function AdminPaymentLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/admin/transactions');
        if (res.ok) setLogs((await res.json()).transactions || []);
      } catch {}
      finally { setLoading(false); }
    };
    fetchLogs();
  }, []);

  const columns = [
    { header: 'User', render: (row) => <div><p className="text-sm font-medium text-dark-800">{row.userId?.name || 'System'}</p></div> },
    { header: 'Type', render: (row) => <StatusBadge status={row.type} /> },
    { header: 'Amount', render: (row) => <span className={`font-semibold ${row.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>₹{Number(row.amount).toLocaleString('en-IN')}</span> },
    { header: 'Reference', render: (row) => <span className="font-mono text-xs text-dark-500">{row.reference || '—'}</span> },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Date', render: (row) => <span className="text-xs text-dark-400">{new Date(row.createdAt).toLocaleString('en-IN')}</span> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader icon={CurrencyRupeeIcon} title="Payment Logs" subtitle="Complete payment history" color="from-green-500 to-emerald-600" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard icon={CurrencyRupeeIcon} title="Total Logs" value={logs.length} color="from-green-500 to-emerald-500" />
        <StatsCard icon={CurrencyRupeeIcon} title="Credits" value={logs.filter(l => l.type === 'credit').length} color="from-emerald-500 to-teal-500" />
        <StatsCard icon={CurrencyRupeeIcon} title="Debits" value={logs.filter(l => l.type === 'debit').length} color="from-red-500 to-rose-500" />
      </div>
      <DataTable columns={columns} data={logs.slice(0, 100)} loading={loading} />
    </div>
  );
}
