'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  IdentificationIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';
import { PageHeader, StatusBadge, AdminModal, DataTable } from '@/components/ui/AdminComponents';

export default function AdminKYCPage() {
  const [kycList, setKycList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewDoc, setViewDoc] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => { fetchKYC(); }, []);

  const fetchKYC = async () => {
    try {
      const res = await fetch('/api/admin/kyc');
      if (res.ok) {
        const data = await res.json();
        setKycList(data.kycList || []);
      }
    } catch { toast.error('Failed to load KYC'); }
    finally { setLoading(false); }
  };

  const handleApprove = async (kycId) => {
    try {
      const res = await fetch(`/api/admin/kyc/${kycId}/approve`, { method: 'PATCH' });
      if (res.ok) { toast.success('KYC Approved'); fetchKYC(); }
      else toast.error('Failed');
    } catch { toast.error('Error'); }
  };

  const handleReject = async () => {
    if (!rejectionReason) { toast.error('Please enter a reason'); return; }
    try {
      const res = await fetch(`/api/admin/kyc/${rejectModal}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason }),
      });
      if (res.ok) { toast.success('KYC Rejected'); setRejectModal(null); setRejectionReason(''); fetchKYC(); }
      else toast.error('Failed');
    } catch { toast.error('Error'); }
  };

  const handleReKYC = async (kycId) => {
    try {
      const res = await fetch(`/api/admin/kyc/${kycId}/rekyc`, { method: 'PATCH' });
      if (res.ok) { toast.success('Re-KYC requested'); fetchKYC(); }
      else toast.error('Failed');
    } catch { toast.error('Error'); }
  };

  const filtered = kycList.filter(k => filter === 'all' || k.status === filter);

  const stats = {
    total: kycList.length,
    pending: kycList.filter(k => k.status === 'pending').length,
    approved: kycList.filter(k => k.status === 'approved').length,
    rejected: kycList.filter(k => k.status === 'rejected').length,
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
    { header: 'PAN', render: (row) => <span className="font-mono text-sm text-dark-600">{row.panNumber || '—'}</span> },
    { header: 'Bank', render: (row) => <span className="text-sm text-dark-600">{row.bankName || '—'}</span> },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Submitted',
      render: (row) => <span className="text-xs text-dark-400">{new Date(row.submittedAt).toLocaleDateString('en-IN')}</span>,
    },
    {
      header: 'Documents',
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.aadhaarFront && (
            <button onClick={() => setViewDoc({ url: row.aadhaarFront, title: 'Aadhaar Front' })} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50">
              <DocumentIcon className="w-4 h-4" />
            </button>
          )}
          {row.panCard && (
            <button onClick={() => setViewDoc({ url: row.panCard, title: 'PAN Card' })} className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50">
              <DocumentIcon className="w-4 h-4" />
            </button>
          )}
          {row.bankDocument && (
            <button onClick={() => setViewDoc({ url: row.bankDocument, title: 'Bank Document' })} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50">
              <DocumentIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.status === 'pending' && (
            <>
              <button onClick={() => handleApprove(row._id)} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50" title="Approve">
                <CheckCircleIcon className="w-4.5 h-4.5" />
              </button>
              <button onClick={() => setRejectModal(row._id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50" title="Reject">
                <XCircleIcon className="w-4.5 h-4.5" />
              </button>
            </>
          )}
          <button onClick={() => handleReKYC(row._id)} className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50" title="Re-KYC">
            <ArrowPathIcon className="w-4.5 h-4.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        icon={IdentificationIcon}
        title="KYC Management"
        subtitle="Verify user documents"
        color="from-teal-500 to-cyan-600"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-500' },
          { label: 'Pending', value: stats.pending, color: 'bg-amber-500' },
          { label: 'Approved', value: stats.approved, color: 'bg-emerald-500' },
          { label: 'Rejected', value: stats.rejected, color: 'bg-red-500' },
        ].map((s, i) => (
          <div key={i} className="stats-card flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${s.color}`} />
            <div>
              <p className="text-xs text-dark-500">{s.label}</p>
              <p className="text-lg font-bold text-dark-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'approved', 'rejected', 'rekyc'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-dark-600 border border-dark-200 hover:bg-dark-50'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} />

      {/* Doc Viewer */}
      {viewDoc && (
        <AdminModal title={viewDoc.title} onClose={() => setViewDoc(null)} size="lg">
          <div className="flex justify-center">
            <img src={viewDoc.url} alt={viewDoc.title} className="max-w-full max-h-[500px] rounded-xl object-contain" />
          </div>
        </AdminModal>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <AdminModal title="Reject KYC" subtitle="Provide a reason for rejection" onClose={() => setRejectModal(null)}>
          <div className="space-y-4">
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={3}
              className="input-field"
            />
            <button onClick={handleReject} className="btn-danger w-full">Reject KYC</button>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
