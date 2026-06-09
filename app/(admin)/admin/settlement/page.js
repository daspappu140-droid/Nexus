'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';
import { PageHeader, StatusBadge, DataTable, StatsCard } from '@/components/ui/AdminComponents';

export default function AdminSettlementPage() {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [processing, setProcessing] = useState(false);

  useEffect(() => { fetchSettlements(); }, []);

  const fetchSettlements = async () => {
    try {
      const res = await fetch('/api/admin/settlements?type=spend_redeem');
      if (res.ok) {
        const data = await res.json();
        setSettlements(data.settlements || []);
      }
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const handleProcess = async (id) => {
    try {
      const res = await fetch(`/api/admin/settlements/${id}/process`, { method: 'PATCH' });
      if (res.ok) { toast.success('Settlement processed'); fetchSettlements(); }
      else toast.error('Failed');
    } catch { toast.error('Error'); }
  };

  const handleBulkProcess = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/admin/settlements/bulk-process', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        toast.success(`${data.processed} settlements processed`);
        fetchSettlements();
      } else toast.error('Failed');
    } catch { toast.error('Error'); }
    finally { setProcessing(false); }
  };

  const filtered = settlements.filter(s => filter === 'all' || s.status === filter);
  const stats = {
    total: settlements.length,
    pending: settlements.filter(s => s.status === 'pending').length,
    processed: settlements.filter(s => s.status === 'processed').length,
    totalAmount: settlements.filter(s => s.status === 'processed').reduce((a, s) => a + s.settlementAmount, 0),
  };

  const columns = [
    {
      header: 'User',
      render: (row) => (
        <div>
          <p className="font-semibold text-dark-800 text-sm">{row.userId?.name || 'Unknown'}</p>
          <p className="text-xs text-dark-400">{row.userId?.email}</p>
        </div>
      ),
    },
    { header: 'Spend', render: (row) => <span className="font-semibold text-dark-800">₹{Number(row.spendAmount).toLocaleString('en-IN')}</span> },
    { header: 'Rate', render: (row) => <span className="text-sm text-dark-500">{row.settlementRate}%</span> },
    { header: 'Settlement', render: (row) => <span className="font-semibold text-emerald-600">₹{Number(row.settlementAmount).toLocaleString('en-IN')}</span> },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Date', render: (row) => <span className="text-xs text-dark-400">{new Date(row.createdAt).toLocaleDateString('en-IN')}</span> },
    {
      header: 'Actions',
      render: (row) => row.status === 'pending' && (
        <button onClick={() => handleProcess(row._id)} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors">
          Process
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        icon={BanknotesIcon}
        title="Spend/Redeem Settlement"
        subtitle="Auto-generated from gateway spends"
        color="from-emerald-500 to-teal-600"
        action={
          <button onClick={handleBulkProcess} disabled={processing} className="btn-success flex items-center gap-2 text-sm">
            {processing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowPathIcon className="w-4 h-4" />}
            Process All Pending
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={BanknotesIcon} title="Total" value={stats.total} color="from-blue-500 to-indigo-500" />
        <StatsCard icon={ClockIcon} title="Pending" value={stats.pending} color="from-amber-500 to-orange-500" />
        <StatsCard icon={CheckCircleIcon} title="Processed" value={stats.processed} color="from-emerald-500 to-teal-500" />
        <StatsCard icon={CurrencyRupeeIcon} title="Total Settled" value={`₹${stats.totalAmount.toLocaleString('en-IN')}`} color="from-purple-500 to-violet-500" />
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'processed', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-dark-600 border border-dark-200 hover:bg-dark-50'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} />
    </div>
  );
}
