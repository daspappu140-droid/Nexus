'use client';
import { useState } from 'react';
import { ClipboardDocumentListIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { PageHeader, StatsCard, EmptyState } from '@/components/ui/AdminComponents';

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader icon={ClipboardDocumentListIcon} title="Orders" subtitle="Order processing and management" color="from-indigo-500 to-blue-600" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={ClipboardDocumentListIcon} title="Total Orders" value="0" color="from-indigo-500 to-blue-500" />
        <StatsCard icon={ClipboardDocumentListIcon} title="Pending" value="0" color="from-amber-500 to-orange-500" />
        <StatsCard icon={ClipboardDocumentListIcon} title="Completed" value="0" color="from-emerald-500 to-teal-500" />
        <StatsCard icon={ClipboardDocumentListIcon} title="Revenue" value="₹0" color="from-purple-500 to-violet-500" />
      </div>
      <EmptyState icon={ClipboardDocumentListIcon} title="No Orders" description="Orders will appear here when customers purchase services" />
    </div>
  );
}
