'use client';
import { DocumentDuplicateIcon, PlusIcon } from '@heroicons/react/24/outline';
import { PageHeader, StatsCard, EmptyState } from '@/components/ui/AdminComponents';

export default function AdminInvoicesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader icon={DocumentDuplicateIcon} title="Invoices" subtitle="Invoice generation and tracking" color="from-teal-500 to-emerald-600" action={<button className="btn-primary flex items-center gap-2 text-sm"><PlusIcon className="w-4 h-4" />Generate Invoice</button>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={DocumentDuplicateIcon} title="Total Invoices" value="0" color="from-teal-500 to-emerald-500" />
        <StatsCard icon={DocumentDuplicateIcon} title="Paid" value="0" color="from-emerald-500 to-green-500" />
        <StatsCard icon={DocumentDuplicateIcon} title="Unpaid" value="0" color="from-red-500 to-rose-500" />
        <StatsCard icon={DocumentDuplicateIcon} title="Total Amount" value="₹0" color="from-purple-500 to-violet-500" />
      </div>
      <EmptyState icon={DocumentDuplicateIcon} title="No Invoices" description="Generate invoices for completed orders" />
    </div>
  );
}
