'use client';
import { useState } from 'react';
import { ServerStackIcon, PlusIcon } from '@heroicons/react/24/outline';
import { PageHeader, StatsCard, EmptyState } from '@/components/ui/AdminComponents';

export default function AdminServicesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader icon={ServerStackIcon} title="IT Services" subtitle="Service catalog management" color="from-slate-600 to-slate-800" action={<button className="btn-primary flex items-center gap-2 text-sm"><PlusIcon className="w-4 h-4" />Add Service</button>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={ServerStackIcon} title="Total Services" value="0" color="from-slate-500 to-slate-700" />
        <StatsCard icon={ServerStackIcon} title="Active" value="0" color="from-emerald-500 to-teal-500" />
        <StatsCard icon={ServerStackIcon} title="Categories" value="0" color="from-blue-500 to-indigo-500" />
        <StatsCard icon={ServerStackIcon} title="Total Orders" value="0" color="from-purple-500 to-violet-500" />
      </div>
      <EmptyState icon={ServerStackIcon} title="No Services" description="Add IT services to your catalog" action={<button className="btn-primary text-sm">Add First Service</button>} />
    </div>
  );
}
