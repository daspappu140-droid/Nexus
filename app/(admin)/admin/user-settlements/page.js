'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/outline';
import { PageHeader, StatusBadge, DataTable, AdminModal } from '@/components/ui/AdminComponents';

export default function AdminUserSettlementsPage() {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => { fetchSettlements(); }, []);

  const fetchSettlements = async () => {
    try {
      const res = await fetch('/api/admin/settlements?type=t_plus_1');
      if (res.ok) {
        const data = await res.json();
        setSettlements(data.settlements || []);
      }
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/admin/settlements/${id}/process`, { method: 'PATCH' });
      if (res.ok) { toast.success('Settlement approved'); fetchSettlements(); }
    } catch { toast.error('Error'); }
  };

  const handleReject = async () => {
    if (!rejectReason) { toast.error('Enter reason'); return; }
    try {
      const res = await fetch(`/api/admin/settlements/${rejectModal}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason }),
      });
      if (res.ok) { toast.success('Rejected & refunded'); setRejectModal(null); setRejectReason(''); fetchSettlements(); }
    } catch { toast.error('Error'); }
  };

  const handleHold = async (userId, hold) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/hold`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOnHold: hold, reason: 'Due to bank internal server issues' }),
      });
      if (res.ok) { toast.success(hold ? 'User settlement on hold' : 'Hold removed'); fetchSettlements(); }
    } catch { toast.error('Error'); }
  };

  const columns = [
    {
      header: 'User',
      render: (row) => (
        <div>
          <p className="font-semibold text-dark-800 text-sm">{row.userId?.name}</p>
          <p className="text-xs text-dark-400">{row.userId?.email}</p>
        </div>
      ),
    },
    { header: 'Amount', render: (row) => <span className="font-semibold text-dark-800">₹{Number(row.settlementAmount).toLocaleString('en-IN')}</span> },
    {
      header: 'Bank',
      render: (row) => (
        <div className="text-xs text-dark-500">
          <p>{row.bankDetails?.bankName}</p>
          <p className="font-mono">{row.bankDetails?.accountNumber}</p>
        </div>
      ),
    },
    { header: 'Source', render: (row) => <span className="badge-info">{row.source}</span> },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Date', render: (row) => <span className="text-xs text-dark-400">{new Date(row.createdAt).toLocaleDateString('en-IN')}</span> },
    {
      header: 'Actions',
      render: (row) => row.status === 'pending' && (
        <div className="flex items-center gap-1">
          <button onClick={() => handleApprove(row._id)} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50" title="Approve">
            <CheckCircleIcon className="w-4.5 h-4.5" />
          </button>
          <button onClick={() => setRejectModal(row._id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50" title="Reject">
            <XCircleIcon className="w-4.5 h-4.5" />
          </button>
          <button onClick={() => handleHold(row.userId?._id, !row.userId?.isOnHold)} className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50" title="Hold/Unhold">
            {row.userId?.isOnHold ? <PlayCircleIcon className="w-4.5 h-4.5" /> : <PauseCircleIcon className="w-4.5 h-4.5" />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        icon={ClockIcon}
        title="T+1 User Settlements"
        subtitle="User-initiated settlement requests"
        color="from-amber-500 to-orange-600"
      />
      <DataTable columns={columns} data={settlements} loading={loading} />

      {rejectModal && (
        <AdminModal title="Reject Settlement" subtitle="Amount will be refunded to user wallet" onClose={() => setRejectModal(null)}>
          <div className="space-y-4">
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Rejection reason..." rows={3} className="input-field" />
            <button onClick={handleReject} className="btn-danger w-full">Reject & Refund</button>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
