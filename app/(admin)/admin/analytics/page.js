'use client';
import { useState } from 'react';
import { ChartPieIcon, ArrowTrendingUpIcon, UsersIcon, CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { PageHeader, StatsCard } from '@/components/ui/AdminComponents';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const monthlyData = [
  { name: 'Jan', users: 120, transactions: 450, revenue: 125000 },
  { name: 'Feb', users: 180, transactions: 620, revenue: 198000 },
  { name: 'Mar', users: 250, transactions: 890, revenue: 312000 },
  { name: 'Apr', users: 310, transactions: 1050, revenue: 405000 },
  { name: 'May', users: 420, transactions: 1380, revenue: 520000 },
  { name: 'Jun', users: 580, transactions: 1820, revenue: 689000 },
];

const roleData = [
  { name: 'Users', value: 65, color: '#6366f1' },
  { name: 'Distributors', value: 20, color: '#10b981' },
  { name: 'MDs', value: 8, color: '#f59e0b' },
  { name: 'Corporates', value: 7, color: '#8b5cf6' },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader icon={ChartPieIcon} title="Analytics" subtitle="Platform insights and metrics" color="from-violet-500 to-purple-600" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={UsersIcon} title="Total Signups" value="1,580" color="from-blue-500 to-indigo-500" change="+18%" trend="up" />
        <StatsCard icon={CreditCardIcon} title="Cards Issued" value="842" color="from-emerald-500 to-teal-500" change="+24%" trend="up" />
        <StatsCard icon={BanknotesIcon} title="Monthly Volume" value="₹6.89L" color="from-purple-500 to-violet-500" change="+31%" trend="up" />
        <StatsCard icon={ArrowTrendingUpIcon} title="Growth Rate" value="23%" color="from-amber-500 to-orange-500" change="+5%" trend="up" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-dark-100 p-6 shadow-card">
          <h3 className="text-lg font-bold text-dark-900 mb-1">User Growth</h3>
          <p className="text-sm text-dark-500 mb-4">Monthly new registrations</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs><linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-dark-100 p-6 shadow-card">
          <h3 className="text-lg font-bold text-dark-900 mb-1">Transaction Volume</h3>
          <p className="text-sm text-dark-500 mb-4">Monthly transaction count</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="transactions" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-dark-100 p-6 shadow-card">
          <h3 className="text-lg font-bold text-dark-900 mb-4">Role Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={roleData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {roleData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {roleData.map((item, i) => (<div key={i} className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-xs text-dark-500">{item.name} ({item.value}%)</span></div>))}
          </div>
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl border border-dark-100 p-6 shadow-card">
          <h3 className="text-lg font-bold text-dark-900 mb-1">Revenue Trend</h3>
          <p className="text-sm text-dark-500 mb-4">Monthly revenue growth</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData}>
              <defs><linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
