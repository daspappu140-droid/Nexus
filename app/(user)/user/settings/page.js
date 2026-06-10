'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Cog6ToothIcon, UserIcon, LockClosedIcon, BellIcon } from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/ui/AdminComponents';

export default function UserSettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) setUser((await res.json()).user);
      } catch {}
      finally { setLoading(false); }
    };
    fetchUser();
  }, []);

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new) { toast.error('Fill all password fields'); return; }
    if (passwords.new !== passwords.confirm) { toast.error('New passwords do not match'); return; }
    if (passwords.new.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setChangingPassword(true);
    try {
      const res = await fetch('/api/user/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      });
      if (res.ok) {
        toast.success('Password changed successfully');
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed');
      }
    } catch { toast.error('Error'); }
    finally { setChangingPassword(false); }
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-dark-200 rounded-lg" /><div className="h-64 bg-dark-200 rounded-2xl" /></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader icon={Cog6ToothIcon} title="Settings" subtitle="Manage your account" color="from-dark-600 to-dark-800" />

      {/* Profile */}
      <div className="bg-white rounded-2xl border border-dark-100 shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center"><UserIcon className="w-5 h-5 text-white" /></div>
          <h3 className="font-bold text-dark-900">Profile Information</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-dark-50 rounded-xl">
            <p className="text-xs text-dark-500 mb-0.5">Name</p>
            <p className="font-semibold text-dark-800">{user?.name}</p>
          </div>
          <div className="p-4 bg-dark-50 rounded-xl">
            <p className="text-xs text-dark-500 mb-0.5">Email</p>
            <p className="font-semibold text-dark-800">{user?.email}</p>
          </div>
          <div className="p-4 bg-dark-50 rounded-xl">
            <p className="text-xs text-dark-500 mb-0.5">Phone</p>
            <p className="font-semibold text-dark-800">{user?.phone || 'Not set'}</p>
          </div>
          <div className="p-4 bg-dark-50 rounded-xl">
            <p className="text-xs text-dark-500 mb-0.5">Role</p>
            <p className="font-semibold text-dark-800 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-dark-100 shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center"><LockClosedIcon className="w-5 h-5 text-white" /></div>
          <h3 className="font-bold text-dark-900">Change Password</h3>
        </div>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-sm font-medium text-dark-700 mb-1.5 block">Current Password</label>
            <input type="password" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} className="input-field" placeholder="Enter current password" />
          </div>
          <div>
            <label className="text-sm font-medium text-dark-700 mb-1.5 block">New Password</label>
            <input type="password" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} className="input-field" placeholder="Min 6 characters" />
          </div>
          <div>
            <label className="text-sm font-medium text-dark-700 mb-1.5 block">Confirm New Password</label>
            <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} className="input-field" placeholder="Re-enter new password" />
          </div>
          <button onClick={handleChangePassword} disabled={changingPassword} className="btn-primary">
            {changingPassword ? 'Changing...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
}
