'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  WalletIcon,
  UserGroupIcon,
  UsersIcon,
  CreditCardIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { PageHeader, StatsCard } from '@/components/ui/AdminComponents';

export default function MDDashboard() {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, statsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/masterdistributor/stats'),
        ]);
        if (userRes.ok) setUser((await userRes.json()).user);
        if (statsRes.ok) setStats((await statsRes.json()).stats);
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="space-y-4 animate-pulse"><div className="h-8 w-48 bg-dark-200 rounded-lg" /><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_,i)=><div key={i} className="h-28 bg-dark-200 rounded-2xl"/>)}</div></div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        icon={UserGroupIcon}
        title="Master Distributor Dashboard"
        subtitle={`Welcome back, ${user?.name?.split(' ')[0]}`}
        color="from-purple-500 to-violet-600"
      />

      {/* Balance Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-purple-900 via-dark-900 to-dark-950 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <WalletIcon className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-dark-400">Wallet Balance</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">₹{Number(user?.walletBalance || 0).toLocaleString('en-IN')}</h2>
          <div className="flex gap-3">
            <Link href="/masterdistributor/settlement" className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-semibold transition-colors">
              Request Settlement
            </Link>
            <Link href="/masterdistributor/wallet" className="px-5 py-2.5 bg-white/10 hover:bg-white/15 rounded-xl text-sm font-semibold border border-white/10 transition-colors">
              View Wallet
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={UserGroupIcon} title="Total Distributors" value={stats?.totalDistributors || 0} color="from-purple-500 to-violet-500" />
        <StatsCard icon={UsersIcon} title="Total Users" value={stats?.totalUsers || 0} color="from-blue-500 to-indigo-500" />
        <StatsCard icon={CreditCardIcon} title="Total Cards" value={stats?.totalCards || 0} color="from-emerald-500 to-teal-500" />
        <StatsCard icon={BanknotesIcon} title="Total Transactions" value={stats?.totalTransactions || 0} color="from-amber-500 to-orange-500" />
      </div>

      {/* Settlement Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="stats-card">
          <div className="flex items-center gap-2 mb-2">
            <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-500" />
            <span className="text-xs text-dark-500">Total Settled</span>
          </div>
          <p className="text-xl font-bold text-dark-900">₹{Number(stats?.totalSettled || 0).toLocaleString('en-IN')}</p>
        </div>
        <div className="stats-card">
          <div className="flex items-center gap-2 mb-2">
            <ClockIcon className="w-5 h-5 text-amber-500" />
            <span className="text-xs text-dark-500">Pending</span>
          </div>
          <p className="text-xl font-bold text-dark-900">{stats?.pendingSettlements || 0}</p>
        </div>
        <div className="stats-card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
            <span className="text-xs text-dark-500">Approved</span>
          </div>
          <p className="text-xl font-bold text-dark-900">{stats?.approvedSettlements || 0}</p>
        </div>
        <div className="stats-card">
          <div className="flex items-center gap-2 mb-2">
            <XCircleIcon className="w-5 h-5 text-red-500" />
            <span className="text-xs text-dark-500">Rejected</span>
          </div>
          <p className="text-xl font-bold text-dark-900">{stats?.rejectedSettlements || 0}</p>
        </div>
      </div>

      {/* Can Settle Today */}
      <div className={`p-4 rounded-2xl border ${stats?.canSettleToday ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
        <p className={`text-sm font-semibold ${stats?.canSettleToday ? 'text-emerald-800' : 'text-amber-800'}`}>
          {stats?.canSettleToday ? '✓ You can request a settlement today' : '⏳ Settlement already requested today. Try again tomorrow.'}
        </p>
      </div>
    </div>
  );
}
