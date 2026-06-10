'use client';
import { useState } from 'react';
import { DocumentTextIcon, PlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { PageHeader, EmptyState } from '@/components/ui/AdminComponents';

const defaultPages = [
  { title: 'About Us', slug: '/about', status: 'published', updatedAt: '2024-03-15' },
  { title: 'Terms of Service', slug: '/terms', status: 'published', updatedAt: '2024-03-10' },
  { title: 'Privacy Policy', slug: '/privacy', status: 'published', updatedAt: '2024-03-10' },
  { title: 'Refund Policy', slug: '/refund', status: 'published', updatedAt: '2024-02-28' },
  { title: 'Contact Us', slug: '/contact', status: 'published', updatedAt: '2024-03-01' },
];

export default function AdminPagesPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader icon={DocumentTextIcon} title="Pages" subtitle="Manage static content pages" color="from-teal-500 to-cyan-600" action={<button className="btn-primary flex items-center gap-2 text-sm"><PlusIcon className="w-4 h-4" />New Page</button>} />
      <div className="bg-white rounded-2xl border border-dark-100 shadow-card overflow-hidden">
        <div className="divide-y divide-dark-100">
          {defaultPages.map((page, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-dark-50/50 transition-colors">
              <div>
                <p className="font-semibold text-dark-800 text-sm">{page.title}</p>
                <p className="text-xs text-dark-400">{page.slug} • Updated: {page.updatedAt}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="badge-success">Published</span>
                <button className="p-1.5 rounded-lg text-dark-500 hover:bg-dark-100"><PencilSquareIcon className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
