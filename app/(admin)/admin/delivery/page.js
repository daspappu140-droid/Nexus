'use client';
import { TruckIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { PageHeader, StatsCard, EmptyState } from '@/components/ui/AdminComponents';

export default function AdminDeliveryPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader icon={TruckIcon} title="Delivery Proof" subtitle="Delivery confirmation uploads" color="from-amber-500 to-orange-600" action={<button className="btn-primary flex items-center gap-2 text-sm"><CloudArrowUpIcon className="w-4 h-4" />Upload Proof</button>} />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard icon={TruckIcon} title="Total Deliveries" value="0" color="from-amber-500 to-orange-500" />
        <StatsCard icon={TruckIcon} title="Confirmed" value="0" color="from-emerald-500 to-teal-500" />
        <StatsCard icon={TruckIcon} title="Pending" value="0" color="from-blue-500 to-indigo-500" />
      </div>
      <EmptyState icon={TruckIcon} title="No Delivery Records" description="Upload delivery proof for completed orders" />
    </div>
  );
}
