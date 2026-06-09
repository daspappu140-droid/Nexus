'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  CreditCardIcon,
  BanknotesIcon,
  WalletIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { PageHeader, StatsCard } from '@/components/ui/AdminComponents';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const chartData = [
  { name: 'Jan', transactions: 4000, settlements: 2400 },
  { name: 'Feb', transactions: 3000, settlements: 1398 },
  { name: 'Mar', transactions: 5000, settlements: 3800 },
  { name: 'Apr', transactions: 4780, settlements: 3908 },
  { name: 'May', transactions: 5890, settlements: 4800 },
  { name: 'Jun', transactions: 6390, settlements: 3800 },
  { name: 'Jul', transactions: 7490, settlements: 4300 },
];

const pieData = [
  { name: 'Active', value: 65, color: '#10b981' },
  { name: 'Pending', value: 20, color: '#f59e0b' },
  { name: 'Blocked', value: 10, color: '#ef4444' },
  { name: 'Rejected', value: 5, color: '#6b7280' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
        }
      } catch {}
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const statCards = [
    { icon: UsersIcon, title: 'Total Users', value: stats?.totalUsers || '0', color: 'from-blue-500 to-cyan-500', change: '+12%', trend: 'up' },
    { icon: UserGroupIcon, title: 'Distributors', value: stats?.totalDistributors || '0', color: 'from-purple-500 to-violet-500', change: '+5%', trend: 'up' },
    { icon: BuildingOfficeIcon, title: 'Master Distributors', value: stats?.totalMasterDistributors || '0', color: 'from-amber-500 to-orange-500' },
    { icon: CreditCardIcon, title: 'Active Cards', value: stats?.totalCards || '0', color: 'from-emerald-500 to-teal-500', change: '+23%', trend: 'up' },
    { icon: BanknotesIcon, title: 'Total Settlements', value: `₹${Number(stats?.totalSettlementAmount || 0).toLocaleString('en-IN')}`, color: 'from-rose-500 to-pink-500' },
    { icon: WalletIcon, title: 'Total Wallet Load', value: `₹${Number(stats?.totalWalletBalance || 0).toLocaleString('en-IN')}`, color: 'from-indigo-500 to-blue-500' },
    { icon: ClockIcon, title: 'Pending Settlements', value: stats?.pendingSettlements || '0', color: 'from-amber-500 to-yellow-500' },
    { icon: ShieldCheckIcon, title: 'KYC Pending', value: stats?.pendingKYC || '0', color: 'from-teal-500 to-cyan-500' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        icon={ShieldCheckIcon}
        title="Admin Dashboard"
        subtitle="Platform overview and analytics"
        color="from-red-500 to-rose-600"
      />

      {/* Alert Banner */}
      {stats?.pendingSettlements > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-amber-800 text-sm">Pending Settlements</p>
            <p className="text-xs text-amber-600">You have {stats.pendingSettlements} settlement(s) awaiting processing</p>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <StatsCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-dark-100 p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-dark-900">Transaction Overview</h3>
              <p className="text-sm text-dark-500">Monthly transactions & settlements</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary-500" />
                <span className="text-dark-500">Transactions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-dark-500">Settlements</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSettlements" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
              />
              <Area type="monotone" dataKey="transactions" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTransactions)" />
              <Area type="monotone" dataKey="settlements" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSettlements)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl border border-dark-100 p-6 shadow-card">
          <h3 className="text-lg font-bold text-dark-900 mb-2">User Status</h3>
          <p className="text-sm text-dark-500 mb-4">Distribution by account status</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-dark-500">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-dark-100 p-6 shadow-card">
        <h3 className="text-lg font-bold text-dark-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'New user registration', user: 'Rahul Sharma', time: '2 mins ago', type: 'info' },
            { action: 'Settlement processed', user: 'MD - Priya Networks', time: '15 mins ago', type: 'success' },
            { action: 'KYC submitted for review', user: 'Amit Patel', time: '1 hour ago', type: 'warning' },
            { action: 'Wallet credited', user: 'Dist - Kumar Solutions', time: '2 hours ago', type: 'success' },
            { action: 'Card frozen by admin', user: 'Suresh Kumar', time: '3 hours ago', type: 'danger' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-dark-50 transition-colors">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                item.type === 'success' ? 'bg-emerald-500' :
                item.type === 'warning' ? 'bg-amber-500' :
                item.type === 'danger' ? 'bg-red-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-800 truncate">{item.action}</p>
                <p className="text-xs text-dark-400">{item.user}</p>
              </div>
              <span className="text-xs text-dark-400 flex-shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
