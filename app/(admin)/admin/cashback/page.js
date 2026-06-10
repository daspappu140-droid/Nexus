'use client';
import { useState } from 'react';
import { ReceiptPercentIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { PageHeader, StatsCard, EmptyState } from '@/components/ui/AdminComponents';

export default function AdminCashbackPage() {
  const [cashbacks, setCashbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader icon={ReceiptPercentIcon} title="Cashback Management" subtitle="Configure cashback rewards" color="from-pink-500 to-rose-600" action={<button className="btn-primary flex items-center gap-2 text-sm"><PlusIcon className="w-4 h-4" />Create Rule</button>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={ReceiptPercentIcon} title="Active Rules" value="0" color="from-pink-500 to-rose-500" />
        <StatsCard icon={ReceiptPercentIcon} title="Total Rewarded" value="₹0" color="from-emerald-500 to-teal-500" />
        <StatsCard icon={ReceiptPercentIcon} title="This Month" value="₹0" color="from-amber-500 to-orange-500" />
        <StatsCard icon={ReceiptPercentIcon} title="Users Rewarded" value="0" color="from-blue-500 to-indigo-500" />
      </div>
      <EmptyState icon={ReceiptPercentIcon} title="No Cashback Rules" description="Create cashback rules to reward users for transactions" action={<button className="btn-primary text-sm">Create First Rule</button>} />
    </div>
  );
}
