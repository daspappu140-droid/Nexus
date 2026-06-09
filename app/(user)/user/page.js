'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  WalletIcon,
  CreditCardIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  ClockIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import VirtualCard from '@/components/cards/VirtualCard';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentTxns, setRecentTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, statsRes, txnRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/user/stats'),
          fetch('/api/user/transactions?limit=5'),
        ]);
        if (userRes.ok) setUser((await userRes.json()).user);
        if (statsRes.ok) setStats((await statsRes.json()).stats);
        if (txnRes.ok) setRecentTxns((await txnRes.json()).transactions || []);
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-dark-200 rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-dark-200 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-sm text-dark-500 mt-1">Here&apos;s your financial overview</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-700">Active</span>
        </div>
      </div>

      {/* Balance Card + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 relative bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 rounded-3xl p-8 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/8 rounded-full blur-[60px]" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <WalletIcon className="w-5 h-5 text-primary-400" />
              <span className="text-sm text-dark-400 font-medium">Available Balance</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              ₹{Number(user?.walletBalance || 0).toLocaleString('en-IN')}
              <span className="text-lg text-dark-400 font-normal ml-2">.00</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/user/wallet" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-semibold transition-colors">
                <ArrowDownLeftIcon className="w-4 h-4" /> Request Load
              </Link>
              <Link href="/user/settlement" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-sm font-semibold transition-colors border border-white/10">
                <ArrowUpRightIcon className="w-4 h-4" /> Settle Funds
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stats-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CreditCardIcon className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-dark-500">Active Cards</p>
            <p className="text-xl font-bold text-dark-900">{stats?.activeCards || 0}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="stats-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-dark-500">Pending Settlements</p>
            <p className="text-xl font-bold text-dark-900">{stats?.pendingSettlements || 0}</p>
          </motion.div>
        </div>
      </div>

      {/* Virtual Card Preview */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-dark-900">Your Card</h3>
            <Link href="/user/cards" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">View All</Link>
          </div>
          <VirtualCard
            cardNumber={stats?.latestCard?.cardNumber || '0000000000000000'}
            holderName={user?.name?.toUpperCase() || 'CARD HOLDER'}
            expiry={stats?.latestCard?.expiryDate || '••/••'}
            status={stats?.latestCard?.status || 'active'}
            balance={stats?.latestCard?.balance}
          />
        </motion.div>

        {/* Recent Transactions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-dark-900">Recent Transactions</h3>
            <Link href="/user/transactions" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">View All</Link>
          </div>
          <div className="bg-white rounded-2xl border border-dark-100 shadow-card divide-y divide-dark-100">
            {recentTxns.length > 0 ? recentTxns.map((txn, i) => (
              <div key={i} className="flex items-center gap-3 p-4">
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
                  <p className="text-sm font-medium text-dark-800 truncate">{txn.description || txn.type}</p>
                  <p className="text-xs text-dark-400">{new Date(txn.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <span className={`text-sm font-bold ${
                  txn.type === 'credit' || txn.type === 'refund' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {txn.type === 'credit' || txn.type === 'refund' ? '+' : '-'}₹{Number(txn.amount).toLocaleString('en-IN')}
                </span>
              </div>
            )) : (
              <div className="p-8 text-center text-dark-400 text-sm">No transactions yet</div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { name: 'Payment Gateway', href: '/user/gateway', icon: BanknotesIcon, color: 'from-blue-500 to-indigo-600' },
          { name: 'KYC Verification', href: '/user/kyc', icon: ShieldCheckIcon, color: 'from-emerald-500 to-teal-600' },
          { name: 'Gift Vouchers', href: '/user/vouchers', icon: ArrowTrendingUpIcon, color: 'from-purple-500 to-pink-600' },
          { name: 'Support', href: '/user/support', icon: ClockIcon, color: 'from-amber-500 to-orange-600' },
        ].map((item, i) => (
          <Link key={i} href={item.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="stats-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-semibold text-dark-800">{item.name}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
