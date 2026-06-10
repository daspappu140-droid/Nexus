'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { BuildingLibraryIcon, PlusIcon, MagnifyingGlassIcon, UsersIcon, WalletIcon } from '@heroicons/react/24/outline';
import { PageHeader, StatusBadge, DataTable, StatsCard } from '@/components/ui/AdminComponents';

export default function AdminCorporatesPage() {
  const [corporates, setCorporates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/users?role=corporate');
        if (res.ok) setCorporates((await res.json()).users || []);
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const filtered = corporates.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.includes(search));

  const columns = [
    { header: 'Corporate', render: (row) => <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white">{row.name?.charAt(0)?.toUpperCase()}</div><div><p className="font-semibold text-dark-800 text-sm">{row.name}</p><p className="text-xs text-dark-400">{row.email}</p></div></div> },
    { header: 'Phone', render: (row) => <span className="text-sm text-dark-500">{row.phone || '—'}</span> },
    { header: 'Wallet', render: (row) => <span className="font-semibold text-dark-800">₹{Number(row.walletBalance || 0).toLocaleString('en-IN')}</span> },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Joined', render: (row) => <span className="text-xs text-dark-400">{new Date(row.createdAt).toLocaleDateString('en-IN')}</span> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader icon={BuildingLibraryIcon} title="Corporates" subtitle={`${corporates.length} corporate accounts`} color="from-emerald-500 to-teal-600" action={<button className="btn-primary flex items-center gap-2 text-sm"><PlusIcon className="w-4 h-4" />Add Corporate</button>} />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard icon={BuildingLibraryIcon} title="Total Corporates" value={corporates.length} color="from-emerald-500 to-teal-500" />
        <StatsCard icon={UsersIcon} title="Active" value={corporates.filter(c => c.status === 'approved').length} color="from-blue-500 to-indigo-500" />
        <StatsCard icon={WalletIcon} title="Total Wallet" value={`₹${corporates.reduce((a, c) => a + (c.walletBalance || 0), 0).toLocaleString('en-IN')}`} color="from-purple-500 to-violet-500" />
      </div>
      <div className="relative"><MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-dark-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search corporates..." className="input-field pl-11" /></div>
      <DataTable columns={columns} data={filtered} loading={loading} />
    </div>
  );
}
