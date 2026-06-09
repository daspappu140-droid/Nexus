'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  WalletIcon,
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import { PageHeader, StatusBadge } from '@/components/ui/AdminComponents';

export default function UserWalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequest, setShowRequest] = useState(false);
  const [requestAmount, setRequestAmount] = useState('');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [userRes, txnRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/user/transactions'),
      ]);
      if (userRes.ok) {
        const data = await userRes.json();
        setBalance(data.user.walletBalance || 0);
      }
      if (txnRes.ok) {
        const data = await txnRes.json();
        setTransactions(data.transactions || []);
      }
    } catch {}
    finally { setLoading(false); }
  };

  const handleRequest = async () => {
    if (!requestAmount || Number(requestAmount) < 100) {
      toast.error('Minimum request amount is ₹100');
      return;
    }
    setRequesting(true);
    try {
      const res = await fetch('/api/user/wallet/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(requestAmount) }),
      });
      if (res.ok) {
        toast.success('Payment request submitted');
        setShowRequest(false);
        setRequestAmount('');
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Request failed');
      }
    } catch { toast.error('Error'); }
    finally { setRequesting(false); }
  };

  const totalCredits = transactions.filter(t => t.type === 'credit').reduce((a, t) => a + t.amount, 0);
  const totalDebits = transactions.filter(t => t.type === 'debit').reduce((a, t) => a + t.amount, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        icon={WalletIcon}
        title="My Wallet"
        subtitle="Manage your funds"
        color="from-primary-500 to-indigo-600"
        action={
          <button onClick={() => setShowRequest(true)} className="btn-primary flex items-center gap-2 text-sm">
            <PaperAirplaneIcon className="w-4 h-4" />
            Request Load
          </button>
        }
      />

      {/* Balance Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-dark-900 to-dark-800 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <WalletIcon className="w-5 h-5 text-primary-400" />
            <span className="text-sm text-dark-400">Available Balance</span>
          </div>
          <p className="text-3xl font-bold">₹{Number(balance).toLocaleString('en-IN')}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="stats-card">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownLeftIcon className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-dark-500">Total Credited</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">₹{Number(totalCredits).toLocaleString('en-IN')}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stats-card">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRightIcon className="w-5 h-5 text-red-500" />
            <span className="text-sm text-dark-500">Total Debited</span>
          </div>
          <p className="text-2xl font-bold text-red-600">₹{Number(totalDebits).toLocaleString('en-IN')}</p>
        </motion.div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-dark-100 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-dark-100">
          <h3 className="font-bold text-dark-900">Transaction History</h3>
        </div>
        <div className="divide-y divide-dark-100">
          {transactions.length > 0 ? transactions.map((txn, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-dark-50/50 transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                txn.type === 'credit' || txn.type === 'refund' ? 'bg-emerald-50' : 'bg-red-50'
              }`}>
                {txn.type === 'credit' || txn.type === 'refund' ? (
                  <ArrowDownLeftIcon className="w-5 h-5 text-emerald-600" />
                ) : (
                  <ArrowUpRightIcon className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-800">{txn.description || txn.type}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {txn.reference && <span className="text-xs font-mono text-dark-400">{txn.reference}</span>}
                  <span className="text-xs text-dark-400">{new Date(txn.createdAt).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${txn.type === 'credit' || txn.type === 'refund' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {txn.type === 'credit' || txn.type === 'refund' ? '+' : '-'}₹{Number(txn.amount).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-dark-400">Bal: ₹{Number(txn.balanceAfter || 0).toLocaleString('en-IN')}</p>
              </div>
            </div>
          )) : (
            <div className="p-12 text-center text-dark-400">No transactions found</div>
          )}
        </div>
      </div>

      {/* Request Modal */}
      {showRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-950/60 backdrop-blur-sm" onClick={() => setShowRequest(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-intense w-full max-w-md p-6"
          >
            <h3 className="text-lg font-bold text-dark-900 mb-4">Request Wallet Load</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-dark-700 mb-1.5 block">Amount (₹)</label>
                <input
                  type="number"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  placeholder="Enter amount (min ₹100)"
                  className="input-field"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowRequest(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleRequest} disabled={requesting} className="btn-primary flex-1">
                  {requesting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
