'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { WalletIcon, ArrowDownLeftIcon, ArrowUpRightIcon, MagnifyingGlassIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';
import { PageHeader, StatusBadge, DataTable, StatsCard } from '@/components/ui/AdminComponents';

export default function AdminWalletPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/transactions');
      if (res.ok) {
        const data = await res.json();
        setTransactions((data.transactions || []).filter(t => t.type === 'credit' || t.type === 'debit'));
      }
    } catch {}
    finally { setLoading(false); }
  };

  const totalCredits = transactions.filter(t => t.type === 'credit').reduce((a, t) => a + t.amount, 0);
  const totalDebits = transactions.filter(t => t.type === 'debit').reduce((a, t) => a + t.amount, 0);

  const filtered = transactions.filter(t => {
    const matchSearch = t.userId?.name?.toLowerCase().includes(search.toLowerCase()) || t.reference?.includes(search);
    const matchFilter = filter === 'all' || t.type === filter;
    return matchSearch && matchFilter;
  });

  const columns = [
    { header: 'User', render: (row) => <div><p className="font-semibold text-dark-800 text-sm">{row.userId?.name || 'System'}</p><p className="text-xs text-dark-400">{row.userId?.email}</p></div> },
    { header: 'Type', render: (row) => row.type === 'credit' ? <span className="badge-success">Credit</span> : <span className="badge-danger">Debit</span> },
    { header: 'Amount', render: (row) => <span className={`font-semibold ${row.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>{row.type === 'credit' ? '+' : '-'}₹{Number(row.amount).toLocaleString('en-IN')}</span> },
    { header: 'Reference', render: (row) => <span className="font-mono text-xs text-dark-500">{row.reference || '—'}</span> },
    { header: 'Description', render: (row) => <span className="text-sm text-dark-500 truncate max-w-[200px] block">{row.description || '—'}</span> },
    { header: 'Date', render: (row) => <span className="text-xs text-dark-400">{new Date(row.createdAt).toLocaleString('en-IN')}</span> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader icon={WalletIcon} title="Wallet Management" subtitle="All wallet transactions" color="from-indigo-500 to-blue-600" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard icon={CurrencyRupeeIcon} title="Total Transactions" value={transactions.length} color="from-indigo-500 to-blue-500" />
        <StatsCard icon={ArrowDownLeftIcon} title="Total Credited" value={`₹${totalCredits.toLocaleString('en-IN')}`} color="from-emerald-500 to-teal-500" />
        <StatsCard icon={ArrowUpRightIcon} title="Total Debited" value={`₹${totalDebits.toLocaleString('en-IN')}`} color="from-red-500 to-rose-500" />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="input-field pl-11" /></div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-full sm:w-40"><option value="all">All</option><option value="credit">Credits</option><option value="debit">Debits</option></select>
      </div>
      <DataTable columns={columns} data={filtered} loading={loading} />
    </div>
  );
}
