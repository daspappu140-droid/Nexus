'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  BanknotesIcon,
  PlusIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';
import { PageHeader, StatusBadge, AdminModal } from '@/components/ui/AdminComponents';

export default function UserSettlementPage() {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({ amount: '' });
  const [submitting, setSubmitting] = useState(false);
  const [kycApproved, setKycApproved] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [settRes, userRes] = await Promise.all([
        fetch('/api/user/settlements'),
        fetch('/api/auth/me'),
      ]);
      if (settRes.ok) setSettlements((await settRes.json()).settlements || []);
      if (userRes.ok) {
        const data = await userRes.json();
        setBalance(data.user.walletBalance || 0);
      }
      // Check KYC
      const kycRes = await fetch('/api/user/kyc');
      if (kycRes.ok) {
        const kycData = await kycRes.json();
        setKycApproved(kycData.kyc?.status === 'approved');
      }
    } catch {}
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    const amount = Number(formData.amount);
    if (amount < 10000) { toast.error('Minimum settlement amount is ₹10,000'); return; }
    if (amount > balance) { toast.error('Insufficient wallet balance'); return; }
    if (!kycApproved) { toast.error('Complete KYC verification first'); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/user/settlements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      if (res.ok) {
        toast.success('Settlement request submitted. Amount deducted from wallet.');
        setShowCreate(false);
        setFormData({ amount: '' });
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed');
      }
    } catch { toast.error('Error'); }
    finally { setSubmitting(false); }
  };

  const totalSettled = settlements.filter(s => s.status === 'processed').reduce((a, s) => a + s.settlementAmount, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        icon={BanknotesIcon}
        title="T+1 Settlement"
        subtitle="Request fund settlements to your bank"
        color="from-amber-500 to-orange-600"
        action={
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 text-sm">
            <PlusIcon className="w-4 h-4" />
            New Request
          </button>
        }
      />

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="stats-card">
          <p className="text-xs text-dark-500 mb-1">Wallet Balance</p>
          <p className="text-2xl font-bold text-dark-900">₹{Number(balance).toLocaleString('en-IN')}</p>
        </div>
        <div className="stats-card">
          <p className="text-xs text-dark-500 mb-1">Total Settled</p>
          <p className="text-2xl font-bold text-emerald-600">₹{Number(totalSettled).toLocaleString('en-IN')}</p>
        </div>
        <div className="stats-card">
          <p className="text-xs text-dark-500 mb-1">Pending Requests</p>
          <p className="text-2xl font-bold text-amber-600">{settlements.filter(s => s.status === 'pending').length}</p>
        </div>
      </div>

      {/* Settlements List */}
      <div className="bg-white rounded-2xl border border-dark-100 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-dark-100">
          <h3 className="font-bold text-dark-900">Settlement History</h3>
        </div>
        <div className="divide-y divide-dark-100">
          {settlements.length > 0 ? settlements.map((s, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <BuildingLibraryIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-800">
                  Settlement of ₹{Number(s.settlementAmount).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-dark-400">
                  {s.bankDetails?.bankName} • {s.bankDetails?.accountNumber?.slice(-4) ? `••••${s.bankDetails.accountNumber.slice(-4)}` : ''}
                </p>
              </div>
              <div className="text-right">
                <StatusBadge status={s.status} />
                <p className="text-xs text-dark-400 mt-1">{new Date(s.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          )) : (
            <div className="p-12 text-center text-dark-400">No settlement requests yet</div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <AdminModal title="Request Settlement" subtitle="Amount will be deducted immediately" onClose={() => setShowCreate(false)}>
          <div className="space-y-4">
            <div className="p-4 bg-dark-50 rounded-xl">
              <p className="text-sm text-dark-500">Available for Settlement</p>
              <p className="text-2xl font-bold text-dark-900">₹{Number(balance).toLocaleString('en-IN')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-dark-700 mb-1.5 block">Settlement Amount (min ₹10,000)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter amount"
                className="input-field"
              />
            </div>
            {!kycApproved && (
              <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                <p className="text-sm text-red-700 font-medium">KYC verification required before settlement</p>
              </div>
            )}
            <button onClick={handleSubmit} disabled={submitting || !kycApproved} className="btn-primary w-full">
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
