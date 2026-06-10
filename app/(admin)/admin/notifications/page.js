'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { BellIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';
import { PageHeader, StatusBadge, DataTable, StatsCard } from '@/components/ui/AdminComponents';

export default function AdminNotificationsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRequests(); const interval = setInterval(fetchRequests, 15000); return () => clearInterval(interval); }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/admin/transactions?type=payment_request');
      if (res.ok) setRequests((await res.json()).transactions || []);
    } catch {}
    finally { setLoading(false); }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');

  const columns = [
    { header: 'User', render: (row) => <div><p className="font-semibold text-dark-800 text-sm">{row.userId?.name}</p><p className="text-xs text-dark-400">{row.userId?.email}</p></div> },
    { header: 'Amount', render: (row) => <span className="font-semibold text-dark-800">₹{Number(row.amount).toLocaleString('en-IN')}</span> },
    { header: 'Reference', render: (row) => <span className="font-mono text-xs text-dark-500">{row.reference}</span> },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Date', render: (row) => <span className="text-xs text-dark-400">{new Date(row.createdAt).toLocaleString('en-IN')}</span> },
    {
      header: 'Actions',
      render: (row) => row.status === 'pending' && (
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50" title="Approve"><CheckCircleIcon className="w-5 h-5" /></button>
          <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50" title="Reject"><XCircleIcon className="w-5 h-5" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader icon={BellIcon} title="Payment Notifications" subtitle="Real-time payment requests (auto-refresh: 15s)" color="from-rose-500 to-pink-600" action={<button onClick={fetchRequests} className="btn-secondary flex items-center gap-2 text-sm"><ArrowPathIcon className="w-4 h-4" />Refresh</button>} />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard icon={BellIcon} title="Total Requests" value={requests.length} color="from-rose-500 to-pink-500" />
        <StatsCard icon={CurrencyRupeeIcon} title="Pending" value={pendingRequests.length} color="from-amber-500 to-orange-500" />
        <StatsCard icon={CurrencyRupeeIcon} title="Pending Amount" value={`₹${pendingRequests.reduce((a, r) => a + r.amount, 0).toLocaleString('en-IN')}`} color="from-emerald-500 to-teal-500" />
      </div>
      <DataTable columns={columns} data={requests} loading={loading} />
    </div>
  );
}
