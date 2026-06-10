'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  UsersIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  NoSymbolIcon,
  WalletIcon,
  ArrowPathIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { PageHeader, StatusBadge, AdminModal, DataTable } from '@/components/ui/AdminComponents';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [walletAmount, setWalletAmount] = useState('');
  const [walletAction, setWalletAction] = useState('add');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const handleApprove = async (userId) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/approve`, { method: 'PATCH' });
      if (res.ok) { toast.success('User approved'); fetchUsers(); }
      else toast.error('Failed to approve');
    } catch { toast.error('Error'); }
  };

  const handleBlock = async (userId) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/block`, { method: 'PATCH' });
      if (res.ok) { toast.success('User blocked'); fetchUsers(); }
      else toast.error('Failed to block');
    } catch { toast.error('Error'); }
  };

  const handleWallet = async () => {
    if (!walletAmount || Number(walletAmount) <= 0) { toast.error('Enter valid amount'); return; }
    try {
      const res = await fetch(`/api/admin/users/${selectedUser._id}/wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(walletAmount), action: walletAction }),
      });
      if (res.ok) { toast.success(`Wallet ${walletAction === 'add' ? 'credited' : 'debited'}`); setShowModal(null); fetchUsers(); }
      else toast.error('Failed');
    } catch { toast.error('Error'); }
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.status === filter;
    return matchSearch && matchFilter;
  });

  const columns = [
    {
      header: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            {row.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-dark-800 text-sm">{row.name}</p>
            <p className="text-xs text-dark-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    { header: 'Phone', key: 'phone', render: (row) => <span className="text-dark-500 text-sm">{row.phone || '—'}</span> },
    {
      header: 'Wallet',
      render: (row) => <span className="font-semibold text-dark-800">₹{Number(row.walletBalance || 0).toLocaleString('en-IN')}</span>,
    },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Joined',
      render: (row) => <span className="text-xs text-dark-400">{new Date(row.createdAt).toLocaleDateString('en-IN')}</span>,
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.status === 'pending' && (
            <button onClick={() => handleApprove(row._id)} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50" title="Approve">
              <CheckCircleIcon className="w-5 h-5" />
            </button>
          )}
          <button onClick={() => { setSelectedUser(row); setShowModal('wallet'); }} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50" title="Wallet">
            <WalletIcon className="w-5 h-5" />
          </button>
          {row.status !== 'blocked' ? (
            <button onClick={() => handleBlock(row._id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50" title="Block">
              <NoSymbolIcon className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={() => handleApprove(row._id)} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50" title="Unblock">
              <CheckCircleIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        icon={UsersIcon}
        title="User Management"
        subtitle={`${users.length} total users`}
        color="from-blue-500 to-cyan-600"
        action={
          <button className="btn-primary flex items-center gap-2 text-sm">
            <PlusIcon className="w-4 h-4" />
            Add User
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="input-field pl-11"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field w-full sm:w-44"
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="blocked">Blocked</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filteredUsers} loading={loading} />

      {/* Wallet Modal */}
      {showModal === 'wallet' && selectedUser && (
        <AdminModal title="Wallet Operation" subtitle={`User: ${selectedUser.name}`} onClose={() => setShowModal(null)}>
          <div className="space-y-4">
            <div className="p-4 bg-dark-50 rounded-xl">
              <p className="text-sm text-dark-500">Current Balance</p>
              <p className="text-2xl font-bold text-dark-900">₹{Number(selectedUser.walletBalance || 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setWalletAction('add')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${walletAction === 'add' ? 'bg-emerald-500 text-white' : 'bg-dark-100 text-dark-600'}`}
              >
                Add Balance
              </button>
              <button
                onClick={() => setWalletAction('deduct')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${walletAction === 'deduct' ? 'bg-red-500 text-white' : 'bg-dark-100 text-dark-600'}`}
              >
                Deduct Balance
              </button>
            </div>
            <input
              type="number"
              value={walletAmount}
              onChange={(e) => setWalletAmount(e.target.value)}
              placeholder="Enter amount"
              className="input-field"
            />
            <button onClick={handleWallet} className="btn-primary w-full">
              Confirm {walletAction === 'add' ? 'Credit' : 'Debit'}
            </button>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
