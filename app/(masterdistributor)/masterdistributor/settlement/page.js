'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { BanknotesIcon, PlusIcon } from '@heroicons/react/24/outline';
import { PageHeader, StatusBadge, AdminModal } from '@/components/ui/AdminComponents';

export default function MDSettlementPage() {
  const [settlements, setSettlements] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [canSettle, setCanSettle] = useState(true);
  const [activated, setActivated] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [settRes, userRes, statsRes] = await Promise.all([
        fetch('/api/masterdistributor/settlements'),
        fetch('/api/auth/me'),
        fetch('/api/masterdistributor/stats'),
      ]);
      if (settRes.ok) setSettlements((await settRes.json()).settlements || []);
      if (userRes.ok) {
        const data = await userRes.json();
        setBalance(data.user.walletBalance || 0);
        setActivated(data.user.settlementActivated || false);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        setCanSettle(data.stats?.canSettleToday !== false);
      }
    } catch {}
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    const amt = Number(amount);
    if (amt <= 0) { toast.error('Enter valid amount'); return; }
    if (amt > balance) { toast.error('Insufficient balance'); return; }
    if (!activated && amt > 25000) { toast.error('New account limit: ₹25,000. Contact admin for activation.'); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/masterdistributor/settlements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt }),
      });
      if (res.ok) {
        toast.success('Settlement request submitted');
        setShowCreate(false);
        setAmount('');
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed');
      }
    } catch { toast.error('Error'); }
    finally { setSubmitting(false); }
  };

  const fee = Number(amount) > 0 ? Math.ceil((Number(amount) / 100000) * 300) : 0;
  const netAmount = Number(amount) - fee;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        icon={BanknotesIcon}
        title="On-Demand Settlement"
        subtitle="₹300 flat fee per ₹1,00,000 • 1 request per day"
        color="from-purple-500 to-violet-600"
        action={
          <button onClick={() => setShowCreate(true)} disabled={!canSettle} className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50">
            <PlusIcon className="w-4 h-4" />
            New Request
          </button>
        }
      />

      {!activated && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <p className="text-sm font-semibold text-amber-800">72-Hour Limit Active</p>
          <p className="text-xs text-amber-600">New accounts are limited to ₹25,000 per settlement until admin activates full access.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="stats-card">
          <p className="text-xs text-dark-500 mb-1">Wallet Balance</p>
          <p className="text-2xl font-bold text-dark-900">₹{Number(balance).toLocaleString('en-IN')}</p>
        </div>
        <div className="stats-card">
          <p className="text-xs text-dark-500 mb-1">Total Settled</p>
          <p className="text-2xl font-bold text-emerald-600">₹{settlements.filter(s=>s.status==='processed').reduce((a,s)=>a+s.settlementAmount,0).toLocaleString('en-IN')}</p>
        </div>
        <div className="stats-card">
          <p className="text-xs text-dark-500 mb-1">Today&apos;s Status</p>
          <p className="text-lg font-bold text-dark-900">{canSettle ? '✓ Available' : '⏳ Used'}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-dark-100 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-dark-100"><h3 className="font-bold text-dark-900">Settlement History</h3></div>
        <div className="divide-y divide-dark-100">
          {settlements.length > 0 ? settlements.map((s, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-dark-800">₹{Number(s.settlementAmount).toLocaleString('en-IN')}</p>
                <p className="text-xs text-dark-400">Fee: ₹{Math.ceil((s.spendAmount/100000)*300)} • {new Date(s.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <StatusBadge status={s.status} />
            </div>
          )) : <div className="p-12 text-center text-dark-400">No settlements yet</div>}
        </div>
      </div>

      {showCreate && (
        <AdminModal title="Request Settlement" subtitle="Flat fee: ₹300 per ₹1,00,000" onClose={() => setShowCreate(false)}>
          <div className="space-y-4">
            <div className="p-4 bg-dark-50 rounded-xl">
              <p className="text-sm text-dark-500">Available Balance</p>
              <p className="text-2xl font-bold text-dark-900">₹{Number(balance).toLocaleString('en-IN')}</p>
            </div>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="input-field" />
            {Number(amount) > 0 && (
              <div className="p-3 bg-primary-50 rounded-xl space-y-1">
                <div className="flex justify-between text-sm"><span className="text-dark-500">Amount</span><span className="font-semibold">₹{Number(amount).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-sm"><span className="text-dark-500">Fee (₹300/₹1L)</span><span className="font-semibold text-red-600">-₹{fee.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-sm border-t border-primary-200 pt-1 mt-1"><span className="font-semibold text-dark-700">Net Settlement</span><span className="font-bold text-emerald-600">₹{netAmount > 0 ? netAmount.toLocaleString('en-IN') : 0}</span></div>
              </div>
            )}
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full">{submitting ? 'Submitting...' : 'Submit Request'}</button>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
