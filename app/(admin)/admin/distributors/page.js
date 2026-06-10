'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  WalletIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  TrashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { PageHeader, StatusBadge, AdminModal, DataTable, StatsCard } from '@/components/ui/AdminComponents';

export default function AdminDistributorsPage() {
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [walletModal, setWalletModal] = useState(null);
  const [walletAmount, setWalletAmount] = useState('');
  const [walletAction, setWalletAction] = useState('add');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });

  useEffect(() => { fetchDistributors(); }, []);

  const fetchDistributors = async () => {
    try {
      const res = await fetch('/api/admin/users?role=distributor');
      if (res.ok) setDistributors((await res.json()).users || []);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const handleHold = async (userId, hold) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/hold`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOnHold: hold, reason: 'Admin action' }),
      });
      if (res.ok) { toast.success(hold ? 'Distributor on hold' : 'Hold removed'); fetchDistributors(); }
    } catch { toast.error('Error'); }
  };

  const filtered = distributors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) || d.email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: distributors.length,
    active: distributors.filter(d => d.status === 'approved' && !d.isOnHold).length,
    held: distributors.filter(d => d.isOnHold).length,
    totalWallet: distributors.reduce((a, d) => a + (d.walletBalance || 0), 0),
  };

  const columns = [
    {
      header: 'Distributor',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            {row.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-dark-800 text-sm">{row.name}</p>
            <p className="text-xs text-dark-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    { header: 'Phone', render: (row) => <span className="text-sm text-dark-500">{row.phone || '—'}</span> },
    { header: 'Wallet', render: (row) => <span className="font-semibold text-dark-800">₹{Number(row.walletBalance || 0).toLocaleString('en-IN')}</span> },
    { header: 'Status', render: (row) => row.isOnHold ? <span className="badge-warning">On Hold</span> : <StatusBadge status={row.status} /> },
    { header: 'Joined', render: (row) => <span className="text-xs text-dark-400">{new Date(row.createdAt).toLocaleDateString('en-IN')}</span> },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => { setWalletModal(row); setWalletAction('add'); }} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50" title="Wallet">
            <WalletIcon className="w-4 h-4" />
          </button>
          <button onClick={() => handleHold(row._id, !row.isOnHold)} className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50" title={row.isOnHold ? 'Unhold' : 'Hold'}>
            {row.isOnHold ? <PlayCircleIcon className="w-4 h-4" /> : <PauseCircleIcon className="w-4 h-4" />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader icon={UserGroupIcon} title="Distributors" subtitle={`${stats.total} distributors registered`} color="from-blue-500 to-indigo-600" action={<button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 text-sm"><PlusIcon className="w-4 h-4" />Add Distributor</button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={UserGroupIcon} title="Total" value={stats.total} color="from-blue-500 to-indigo-500" />
        <StatsCard icon={CheckCircleIcon} title="Active" value={stats.active} color="from-emerald-500 to-teal-500" />
        <StatsCard icon={PauseCircleIcon} title="On Hold" value={stats.held} color="from-amber-500 to-orange-500" />
        <StatsCard icon={WalletIcon} title="Total Wallet" value={`₹${stats.totalWallet.toLocaleString('en-IN')}`} color="from-purple-500 to-violet-500" />
      </div>

      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search distributors..." className="input-field pl-11" />
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} />

      {walletModal && (
        <AdminModal title="Wallet Operation" subtitle={`Distributor: ${walletModal.name}`} onClose={() => setWalletModal(null)}>
          <div className="space-y-4">
            <div className="p-4 bg-dark-50 rounded-xl">
              <p className="text-sm text-dark-500">Current Balance</p>
              <p className="text-2xl font-bold text-dark-900">₹{Number(walletModal.walletBalance || 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setWalletAction('add')} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${walletAction === 'add' ? 'bg-emerald-500 text-white' : 'bg-dark-100 text-dark-600'}`}>Add</button>
              <button onClick={() => setWalletAction('deduct')} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${walletAction === 'deduct' ? 'bg-red-500 text-white' : 'bg-dark-100 text-dark-600'}`}>Deduct</button>
            </div>
            <input type="number" value={walletAmount} onChange={(e) => setWalletAmount(e.target.value)} placeholder="Enter amount" className="input-field" />
            <button onClick={() => { toast.success('Wallet updated'); setWalletModal(null); }} className="btn-primary w-full">Confirm</button>
          </div>
        </AdminModal>
      )}

      {showCreate && (
        <AdminModal title="Add Distributor" onClose={() => setShowCreate(false)}>
          <div className="space-y-4">
            <input type="text" placeholder="Full Name" className="input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input type="email" placeholder="Email" className="input-field" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input type="tel" placeholder="Phone" className="input-field" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <input type="password" placeholder="Password" className="input-field" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            <button onClick={() => { toast.success('Distributor created'); setShowCreate(false); }} className="btn-primary w-full">Create Distributor</button>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
