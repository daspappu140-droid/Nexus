'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Cog6ToothIcon, ShieldCheckIcon, BellIcon, PaintBrushIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/ui/AdminComponents';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    appName: 'NexusBank',
    supportEmail: 'support@nexusbank.in',
    supportPhone: '+91 9403893296',
    defaultSettlementRate: '1.77',
    minSettlement: '10000',
    mdFeePerLakh: '300',
    maintenanceMode: false,
  });

  const handleSave = () => { toast.success('Settings saved successfully'); };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader icon={Cog6ToothIcon} title="Settings" subtitle="Platform configuration" color="from-dark-600 to-dark-800" />

      <div className="space-y-6">
        {/* General */}
        <div className="bg-white rounded-2xl border border-dark-100 shadow-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center"><Cog6ToothIcon className="w-5 h-5 text-white" /></div>
            <h3 className="font-bold text-dark-900">General Settings</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium text-dark-700 mb-1.5 block">App Name</label><input type="text" className="input-field" value={settings.appName} onChange={(e) => setSettings({...settings, appName: e.target.value})} /></div>
            <div><label className="text-sm font-medium text-dark-700 mb-1.5 block">Support Email</label><input type="email" className="input-field" value={settings.supportEmail} onChange={(e) => setSettings({...settings, supportEmail: e.target.value})} /></div>
            <div><label className="text-sm font-medium text-dark-700 mb-1.5 block">Support Phone</label><input type="tel" className="input-field" value={settings.supportPhone} onChange={(e) => setSettings({...settings, supportPhone: e.target.value})} /></div>
          </div>
        </div>

        {/* Financial */}
        <div className="bg-white rounded-2xl border border-dark-100 shadow-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center"><CurrencyRupeeIcon className="w-5 h-5 text-white" /></div>
            <h3 className="font-bold text-dark-900">Financial Settings</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div><label className="text-sm font-medium text-dark-700 mb-1.5 block">Default Settlement Rate (%)</label><input type="number" className="input-field" value={settings.defaultSettlementRate} onChange={(e) => setSettings({...settings, defaultSettlementRate: e.target.value})} /></div>
            <div><label className="text-sm font-medium text-dark-700 mb-1.5 block">Min Settlement (₹)</label><input type="number" className="input-field" value={settings.minSettlement} onChange={(e) => setSettings({...settings, minSettlement: e.target.value})} /></div>
            <div><label className="text-sm font-medium text-dark-700 mb-1.5 block">MD Fee per ₹1L</label><input type="number" className="input-field" value={settings.mdFeePerLakh} onChange={(e) => setSettings({...settings, mdFeePerLakh: e.target.value})} /></div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl border border-dark-100 shadow-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center"><ShieldCheckIcon className="w-5 h-5 text-white" /></div>
            <h3 className="font-bold text-dark-900">Security</h3>
          </div>
          <div className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
            <div><p className="font-medium text-dark-800 text-sm">Maintenance Mode</p><p className="text-xs text-dark-400">Puts all users into maintenance screen</p></div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})} className="sr-only peer" />
              <div className="w-11 h-6 bg-dark-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary">Save All Settings</button>
      </div>
    </div>
  );
}
