'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ListBulletIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { PageHeader, StatusBadge, DataTable } from '@/components/ui/AdminComponents';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/admin/transactions');
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const filtered = transactions.filter(t => {
    const matchSearch = t.userId?.name?.toLowerCase().includes(search.toLowerCase()) || t.reference?.includes(search);
    const matchType = typeFilter === 'all' || t.type === typeFilter;
    return matchSearch && matchType;
  });

  const columns = [
    {
      header: 'User',
      render: (row) => (
        <div>
          <p className="font-semibold text-dark-800 text-sm">{row.userId?.name || 'System'}</p>
          <p className="text-xs text-dark-400">{row.userId?.email}</p>
        </div>
      ),
    },
    {
      header: 'Type',
      render: (row) => {
        const colors = { credit: 'badge-success', debit: 'badge-danger', refund: 'badge-info', transfer: 'badge-info', voucher: 'badge-warning', payment_request: 'badge-neutral' };
        return <span className={colors[row.type] || 'badge-neutral'}>{row.type?.replace(/_/g, ' ')}</span>;
      },
    },
    {
      header: 'Amount',
      render: (row) => (
        <span className={`font-semibold ${row.type === 'credit' || row.type === 'refund' ? 'text-emerald-600' : 'text-red-600'}`}>
          {row.type === 'credit' || row.type === 'refund' ? '+' : '-'}₹{Number(row.amount).toLocaleString('en-IN')}
        </span>
      ),
    },
    { header: 'Reference', render: (row) => <span className="font-mono text-xs text-dark-500">{row.reference || '—'}</span> },
    { header: 'Description', render: (row) => <span className="text-sm text-dark-500 truncate max-w-[200px] block">{row.description || '—'}</span> },
    { header: 'Date', render: (row) => <span className="text-xs text-dark-400">{new Date(row.createdAt).toLocaleString('en-IN')}</span> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader icon={ListBulletIcon} title="Transactions" subtitle="All platform transactions" color="from-indigo-500 to-purple-600" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or reference..." className="input-field pl-11" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input-field w-full sm:w-44">
          <option value="all">All Types</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
          <option value="refund">Refund</option>
          <option value="transfer">Transfer</option>
          <option value="payment_request">Payment Request</option>
        </select>
      </div>
      <DataTable columns={columns} data={filtered} loading={loading} />
    </div>
  );
}
