'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';

export default function EmployeeLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) { router.push('/login'); return; }
        const data = await res.json();
        if (data.user.role !== 'employee') { router.push('/login'); return; }
        setUser(data.user);
      } catch { router.push('/login'); }
      finally { setLoading(false); }
    };
    fetchUser();
  }, [router]);

  if (loading) return <div className="flex h-screen bg-gray-50 items-center justify-center"><div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>;
  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar userRole="employee" userName={user.name} userEmail={user.email} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-8 pt-16 lg:pt-6 pb-20 lg:pb-8">{children}</div>
      </main>
    </div>
  );
}
