'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ListBulletIcon, MagnifyingGlassIcon, ArrowDownLeftIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/ui/AdminComponents';

export default function UserTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTxns = async () => {
      try {
        const res = await fetch('/api/user/transactions');
        if (res.ok) setTransactions((await res.json()).transactions || []);
      } catch {}
      finally { setLoading(false); }
    };
    fetchTxns();
  }, []);

  const filtered = transactions.filter(t =>
    t.description?.toLowerCase().includes(search.toLowerCase()) || t.reference?.includes(search)
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader icon={ListBulletIcon} title="Transactions" subtitle="Your complete transaction history" color="from-indigo-500 to-purple-600" />

      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by description or reference..." className="input-field pl-11" />
      </div>

      <div className="bg-white rounded-2xl border border-dark-100 shadow-card overflow-hidden">
        <div className="divide-y divide-dark-100">
          {filtered.length > 0 ? filtered.map((txn, i) => (
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
                <div className="flex items-center gap-3 mt-0.5">
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
            <div className="p-12 text-center text-dark-400">
              {loading ? 'Loading...' : 'No transactions found'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
