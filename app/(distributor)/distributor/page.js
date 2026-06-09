'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  WalletIcon,
  UsersIcon,
  ArrowPathIcon,
  ChartBarIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';
import { PageHeader, StatsCard } from '@/components/ui/AdminComponents';

export default function DistributorDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, statsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/distributor/stats'),
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
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        icon={ChartBarIcon}
        title="Distributor Dashboard"
        subtitle={`Welcome, ${user?.name?.split(' ')[0]}`}
        color="from-blue-500 to-indigo-600"
      />

      {/* Balance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-blue-900 via-dark-900 to-dark-950 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <WalletIcon className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-dark-400">Wallet Balance</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">₹{Number(user?.walletBalance || 0).toLocaleString('en-IN')}</h2>
          <div className="flex gap-3">
            <Link href="/distributor/recharge" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition-colors">Recharge User</Link>
            <Link href="/distributor/wallet" className="px-5 py-2.5 bg-white/10 hover:bg-white/15 rounded-xl text-sm font-semibold border border-white/10 transition-colors">View Wallet</Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={UsersIcon} title="Total Users" value={stats?.totalUsers || 0} color="from-blue-500 to-indigo-500" />
        <StatsCard icon={CurrencyRupeeIcon} title="Total Recharged" value={`₹${Number(stats?.totalRecharged || 0).toLocaleString('en-IN')}`} color="from-emerald-500 to-teal-500" />
        <StatsCard icon={ArrowPathIcon} title="Recharges Today" value={stats?.rechargesToday || 0} color="from-amber-500 to-orange-500" />
        <StatsCard icon={WalletIcon} title="Active Users" value={stats?.activeUsers || 0} color="from-purple-500 to-violet-500" />
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { name: 'Manage Users', href: '/distributor/users', icon: UsersIcon, color: 'from-blue-500 to-indigo-600' },
          { name: 'Recharge Wallet', href: '/distributor/recharge', icon: ArrowPathIcon, color: 'from-emerald-500 to-teal-600' },
          { name: 'View Reports', href: '/distributor/reports', icon: ChartBarIcon, color: 'from-purple-500 to-pink-600' },
        ].map((item, i) => (
          <Link key={i} href={item.href}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stats-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all cursor-pointer">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-dark-800">{item.name}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      {user?.isOnHold && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-sm font-semibold text-red-800">Account On Hold</p>
          <p className="text-xs text-red-600">{user.holdReason || 'Your account has been placed on hold by the master distributor.'}</p>
        </div>
      )}
    </div>
  );
}
