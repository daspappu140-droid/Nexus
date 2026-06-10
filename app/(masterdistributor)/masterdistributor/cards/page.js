'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  CreditCardIcon,
  MagnifyingGlassIcon,
  LockClosedIcon,
  LockOpenIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { PageHeader, StatusBadge, DataTable, AdminModal } from '@/components/ui/AdminComponents';

export default function MDCardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');

  useEffect(() => { fetchCards(); }, []);

  const fetchCards = async () => {
    try {
      const res = await fetch('/api/masterdistributor/cards');
      if (res.ok) setCards((await res.json()).cards || []);
    } catch {}
    finally { setLoading(false); }
  };

  const handleFreeze = async (cardId, action) => {
    try {
      const res = await fetch(`/api/masterdistributor/cards/${cardId}/${action}`, { method: 'PATCH' });
      if (res.ok) { toast.success(`Card ${action}d`); fetchCards(); }
      else toast.error('Failed');
    } catch { toast.error('Error'); }
  };

  const handleDelete = async () => {
    if (!deleteReason) { toast.error('Reason required'); return; }
    try {
      const res = await fetch(`/api/masterdistributor/cards/${deleteModal}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: deleteReason }),
      });
      if (res.ok) { toast.success('Card deleted & balance refunded'); setDeleteModal(null); setDeleteReason(''); fetchCards(); }
      else toast.error('Failed');
    } catch { toast.error('Error'); }
  };

  const filtered = cards.filter(c =>
    c.cardNumber?.includes(search) || c.userId?.name?.toLowerCase().includes(search.toLowerCase()) || c.userId?.email?.includes(search)
  );

  const stats = { total: cards.length, active: cards.filter(c=>c.status==='active').length, frozen: cards.filter(c=>c.status==='frozen').length, expired: cards.filter(c=>c.status==='expired').length };

  const columns = [
    {
      header: 'Card',
      render: (row) => <span className="font-mono text-sm text-dark-800">•••• •••• •••• {row.cardNumber?.slice(-4)}</span>,
    },
    { header: 'User', render: (row) => <div><p className="text-sm font-medium text-dark-800">{row.userId?.name}</p><p className="text-xs text-dark-400">{row.userId?.email}</p></div> },
    { header: 'Balance', render: (row) => <span className="font-semibold text-dark-800">₹{Number(row.balance).toLocaleString('en-IN')}</span> },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.status === 'active' && <button onClick={()=>handleFreeze(row._id,'freeze')} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"><LockClosedIcon className="w-4 h-4"/></button>}
          {row.status === 'frozen' && <button onClick={()=>handleFreeze(row._id,'unfreeze')} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"><LockOpenIcon className="w-4 h-4"/></button>}
          <button onClick={()=>setDeleteModal(row._id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"><TrashIcon className="w-4 h-4"/></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader icon={CreditCardIcon} title="Cards Management" subtitle={`${cards.length} cards in network`} color="from-emerald-500 to-teal-600" />
      <div className="grid grid-cols-4 gap-4">
        {[{l:'Total',v:stats.total,c:'text-dark-900'},{l:'Active',v:stats.active,c:'text-emerald-600'},{l:'Frozen',v:stats.frozen,c:'text-blue-600'},{l:'Expired',v:stats.expired,c:'text-dark-400'}].map((s,i)=>(
          <div key={i} className="stats-card"><p className="text-xs text-dark-500">{s.l}</p><p className={`text-xl font-bold ${s.c}`}>{s.v}</p></div>
        ))}
      </div>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
        <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search by card number, user name or email..." className="input-field pl-11" />
      </div>
      <DataTable columns={columns} data={filtered} loading={loading} />
      {deleteModal && (
        <AdminModal title="Delete Card" subtitle="Balance will be refunded to user wallet" onClose={()=>setDeleteModal(null)}>
          <div className="space-y-4">
            <textarea value={deleteReason} onChange={(e)=>setDeleteReason(e.target.value)} placeholder="Reason for deletion (required)..." rows={3} className="input-field" />
            <button onClick={handleDelete} className="btn-danger w-full">Delete & Refund</button>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
