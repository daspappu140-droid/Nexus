'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { CreditCardIcon, MagnifyingGlassIcon, LockClosedIcon, LockOpenIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PageHeader, StatusBadge, DataTable, StatsCard } from '@/components/ui/AdminComponents';

export default function AdminCardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch('/api/admin/cards');
        if (res.ok) setCards((await res.json()).cards || []);
      } catch {}
      finally { setLoading(false); }
    };
    fetchCards();
  }, []);

  const filtered = cards.filter(c => {
    const matchSearch = c.cardNumber?.includes(search) || c.userId?.name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = { total: cards.length, active: cards.filter(c => c.status === 'active').length, frozen: cards.filter(c => c.status === 'frozen').length, expired: cards.filter(c => c.status === 'expired').length };

  const columns = [
    { header: 'Card Number', render: (row) => <span className="font-mono text-sm text-dark-800">•••• •••• •••• {row.cardNumber?.slice(-4)}</span> },
    { header: 'User', render: (row) => <div><p className="text-sm font-medium text-dark-800">{row.userId?.name || 'Unknown'}</p><p className="text-xs text-dark-400">{row.userId?.email}</p></div> },
    { header: 'Balance', render: (row) => <span className="font-semibold text-dark-800">₹{Number(row.balance || 0).toLocaleString('en-IN')}</span> },
    { header: 'Limit', render: (row) => <span className="text-sm text-dark-500">₹{Number(row.spendingLimit || 0).toLocaleString('en-IN')}</span> },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Created', render: (row) => <span className="text-xs text-dark-400">{new Date(row.createdAt).toLocaleDateString('en-IN')}</span> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader icon={CreditCardIcon} title="Cards Management" subtitle="All virtual cards on platform" color="from-cyan-500 to-blue-600" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={CreditCardIcon} title="Total" value={stats.total} color="from-blue-500 to-indigo-500" />
        <StatsCard icon={CreditCardIcon} title="Active" value={stats.active} color="from-emerald-500 to-teal-500" />
        <StatsCard icon={LockClosedIcon} title="Frozen" value={stats.frozen} color="from-blue-500 to-cyan-500" />
        <StatsCard icon={CreditCardIcon} title="Expired" value={stats.expired} color="from-dark-400 to-dark-500" />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-dark-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by card number or user..." className="input-field pl-11" /></div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-full sm:w-40"><option value="all">All</option><option value="active">Active</option><option value="frozen">Frozen</option><option value="expired">Expired</option></select>
      </div>
      <DataTable columns={columns} data={filtered} loading={loading} />
    </div>
  );
}
