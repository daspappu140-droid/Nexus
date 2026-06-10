'use client';
import { useState } from 'react';
import { GiftIcon } from '@heroicons/react/24/outline';
import { PageHeader, EmptyState } from '@/components/ui/AdminComponents';

export default function UserVouchersPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader icon={GiftIcon} title="Gift Vouchers" subtitle="Redeem and manage your vouchers" color="from-purple-500 to-pink-600" />
      <EmptyState icon={GiftIcon} title="No Vouchers Available" description="Gift vouchers from your distributor or corporate will appear here" />
    </div>
  );
}
