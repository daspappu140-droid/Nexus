'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  UsersIcon,
  WalletIcon,
  CreditCardIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  DocumentTextIcon,
  BellIcon,
  MegaphoneIcon,
  TicketIcon,
  BuildingOfficeIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  GlobeAltIcon,
  GiftIcon,
  IdentificationIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  ServerStackIcon,
  TruckIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  SparklesIcon,
  EllipsisHorizontalIcon,
  ListBulletIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const roleNavigation = {
  admin: [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Distributors', href: '/admin/distributors', icon: UserGroupIcon },
    { name: 'Master Distributors', href: '/admin/masterdistributors', icon: BuildingOfficeIcon },
    { name: 'Wallet', href: '/admin/wallet', icon: WalletIcon },
    { name: 'Corporates', href: '/admin/corporates', icon: BuildingLibraryIcon },
    { name: 'Cards', href: '/admin/cards', icon: CreditCardIcon },
    { name: 'KYC', href: '/admin/kyc', icon: IdentificationIcon },
    { divider: true, label: 'Settlements' },
    { name: 'Spend/Redeem', href: '/admin/settlement', icon: BanknotesIcon },
    { name: 'T+1 Settlement', href: '/admin/user-settlements', icon: ClockIcon },
    { divider: true, label: 'Platform' },
    { name: 'Cashback', href: '/admin/cashback', icon: ReceiptPercentIcon },
    { name: 'Support', href: '/admin/support', icon: TicketIcon },
    { name: 'Broadcast', href: '/admin/broadcast', icon: MegaphoneIcon },
    { name: 'Notifications', href: '/admin/notifications', icon: BellIcon },
    { name: 'Transactions', href: '/admin/transactions', icon: ListBulletIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartPieIcon },
    { name: 'Pages', href: '/admin/pages', icon: DocumentTextIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
    { divider: true, label: 'IT Services' },
    { name: 'Services', href: '/admin/services', icon: ServerStackIcon },
    { name: 'Orders', href: '/admin/orders', icon: ClipboardDocumentListIcon },
    { name: 'Invoices', href: '/admin/invoices', icon: DocumentDuplicateIcon },
    { name: 'Delivery Proof', href: '/admin/delivery', icon: TruckIcon },
    { name: 'Payment Logs', href: '/admin/payment-logs', icon: CurrencyRupeeIcon },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldCheckIcon },
  ],
  masterdistributor: [
    { name: 'Dashboard', href: '/masterdistributor', icon: HomeIcon },
    { name: 'Distributors', href: '/masterdistributor/distributors', icon: UserGroupIcon },
    { name: 'Users', href: '/masterdistributor/users', icon: UsersIcon },
    { name: 'Cards', href: '/masterdistributor/cards', icon: CreditCardIcon },
    { name: 'Wallet', href: '/masterdistributor/wallet', icon: WalletIcon },
    { name: 'Transactions', href: '/masterdistributor/transactions', icon: ListBulletIcon },
    { name: 'Settlement', href: '/masterdistributor/settlement', icon: BanknotesIcon },
    { name: 'Reports', href: '/masterdistributor/reports', icon: ChartBarIcon },
    { name: 'Settings', href: '/masterdistributor/settings', icon: Cog6ToothIcon },
  ],
  distributor: [
    { name: 'Dashboard', href: '/distributor', icon: HomeIcon },
    { name: 'Users', href: '/distributor/users', icon: UsersIcon },
    { name: 'Wallet', href: '/distributor/wallet', icon: WalletIcon },
    { name: 'Recharge', href: '/distributor/recharge', icon: ArrowPathIcon },
    { name: 'Reports', href: '/distributor/reports', icon: ChartBarIcon },
    { name: 'Support', href: '/distributor/support', icon: TicketIcon },
    { name: 'Settings', href: '/distributor/settings', icon: Cog6ToothIcon },
  ],
  corporate: [
    { name: 'Dashboard', href: '/corporate', icon: HomeIcon },
    { name: 'Employees', href: '/corporate/employees', icon: UsersIcon },
    { name: 'Cards', href: '/corporate/cards', icon: CreditCardIcon },
    { name: 'Wallet', href: '/corporate/wallet', icon: WalletIcon },
    { name: 'Reports', href: '/corporate/reports', icon: ChartBarIcon },
    { name: 'Settings', href: '/corporate/settings', icon: Cog6ToothIcon },
  ],
  employee: [
    { name: 'Dashboard', href: '/employee', icon: HomeIcon },
    { name: 'My Cards', href: '/employee/cards', icon: CreditCardIcon },
    { name: 'Allowance', href: '/employee/allowance', icon: BanknotesIcon },
    { name: 'Vouchers', href: '/employee/vouchers', icon: GiftIcon },
    { name: 'Transactions', href: '/employee/transactions', icon: ListBulletIcon },
  ],
  user: [
    { name: 'Dashboard', href: '/user', icon: HomeIcon },
    { name: 'Wallet', href: '/user/wallet', icon: WalletIcon },
    { name: 'My Cards', href: '/user/cards', icon: CreditCardIcon },
    { name: 'Gateway', href: '/user/gateway', icon: GlobeAltIcon },
    { name: 'Settlement', href: '/user/settlement', icon: BanknotesIcon },
    { name: 'KYC', href: '/user/kyc', icon: IdentificationIcon },
    { name: 'Gift Vouchers', href: '/user/vouchers', icon: GiftIcon },
    { name: 'Transactions', href: '/user/transactions', icon: ListBulletIcon },
    { name: 'Support', href: '/user/support', icon: TicketIcon },
    { name: 'Settings', href: '/user/settings', icon: Cog6ToothIcon },
  ],
};

const bottomNavRoles = {
  user: [
    { name: 'Home', href: '/user', icon: HomeIcon },
    { name: 'Wallet', href: '/user/wallet', icon: WalletIcon },
    { name: 'Cards', href: '/user/cards', icon: CreditCardIcon },
    { name: 'Settle', href: '/user/settlement', icon: BanknotesIcon },
    { name: 'More', icon: EllipsisHorizontalIcon, action: 'drawer' },
  ],
  masterdistributor: [
    { name: 'Home', href: '/masterdistributor', icon: HomeIcon },
    { name: 'Distrib', href: '/masterdistributor/distributors', icon: UserGroupIcon },
    { name: 'Users', href: '/masterdistributor/users', icon: UsersIcon },
    { name: 'Settle', href: '/masterdistributor/settlement', icon: BanknotesIcon },
    { name: 'More', icon: EllipsisHorizontalIcon, action: 'drawer' },
  ],
  distributor: [
    { name: 'Home', href: '/distributor', icon: HomeIcon },
    { name: 'Users', href: '/distributor/users', icon: UsersIcon },
    { name: 'Wallet', href: '/distributor/wallet', icon: WalletIcon },
    { name: 'Reports', href: '/distributor/reports', icon: ChartBarIcon },
    { name: 'More', icon: EllipsisHorizontalIcon, action: 'drawer' },
  ],
};

const roleColors = {
  admin: 'bg-red-500/10 text-red-400 border-red-500/20',
  masterdistributor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  distributor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  corporate: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  employee: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  user: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

const roleLabels = {
  admin: 'Admin',
  masterdistributor: 'Master Dist.',
  distributor: 'Distributor',
  corporate: 'Corporate',
  employee: 'Employee',
  user: 'User',
};

export default function Sidebar({ userRole = 'user', userName = 'User', userEmail = '' }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = roleNavigation[userRole] || roleNavigation.user;
  const bottomNav = bottomNavRoles[userRole] || null;
  const hasBottomNav = !!bottomNav;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  const isActive = (href) => {
    if (!href) return false;
    if (href === `/${userRole}` || href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-dark-950/95 backdrop-blur-xl border-b border-dark-800/50 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
            <BuildingLibraryIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-white">Nexus<span className="text-primary-400">Bank</span></span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-dark-800 transition-colors"
        >
          <Bars3Icon className="w-5 h-5 text-dark-300" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-dark-950 border-r border-dark-800/50 z-50 overflow-y-auto"
            >
              <div className="p-4 flex items-center justify-between border-b border-dark-800/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
                    <BuildingLibraryIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-white">Nexus<span className="text-primary-400">Bank</span></span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-dark-800">
                  <XMarkIcon className="w-5 h-5 text-dark-400" />
                </button>
              </div>
              <nav className="p-3 space-y-1">
                {navItems.map((item, i) =>
                  item.divider ? (
                    <div key={i} className="pt-4 pb-2 px-3">
                      <span className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">{item.label}</span>
                    </div>
                  ) : (
                    <Link
                      key={i}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive(item.href)
                          ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                          : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {item.name}
                    </Link>
                  )
                )}
              </nav>
              <div className="p-3 border-t border-dark-800/50">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col h-screen bg-dark-950 border-r border-dark-800/50 transition-all duration-300 flex-shrink-0 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}>
        {/* Header */}
        <div className={`flex items-center h-16 border-b border-dark-800/50 flex-shrink-0 ${collapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-neon">
                <BuildingLibraryIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-base font-bold text-white">Nexus<span className="text-primary-400">Bank</span></span>
                <div className="text-[9px] text-dark-500 font-medium tracking-widest uppercase">Platform</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-dark-800/50 text-dark-400 hover:text-white transition-colors"
          >
            <ChevronLeftIcon className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
          {navItems.map((item, i) =>
            item.divider ? (
              !collapsed ? (
                <div key={i} className="pt-5 pb-2 px-3">
                  <span className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">{item.label}</span>
                </div>
              ) : (
                <div key={i} className="pt-3 pb-1 flex justify-center">
                  <div className="w-6 h-px bg-dark-800" />
                </div>
              )
            ) : (
              <Link
                key={i}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={`group flex items-center gap-3 rounded-xl text-sm font-medium transition-all ${
                  collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
                } ${
                  isActive(item.href)
                    ? 'bg-primary-500/10 text-primary-400 shadow-sm border border-primary-500/20'
                    : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                }`}
              >
                <item.icon className={`flex-shrink-0 ${collapsed ? 'w-5 h-5' : 'w-5 h-5'}`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            )
          )}
        </nav>

        {/* Footer Card */}
        <div className={`flex-shrink-0 border-t border-dark-800/50 ${collapsed ? 'p-2' : 'p-3'}`}>
          {!collapsed ? (
            <div className="bg-dark-900/50 rounded-xl p-3 border border-dark-800/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                    {userName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-dark-950" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{userName}</p>
                  <p className="text-xs text-dark-400 truncate">{userEmail}</p>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${roleColors[userRole]}`}>
                  {roleLabels[userRole]}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Sign Out"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                  {userName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-dark-950" />
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Sign Out"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      {hasBottomNav && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-dark-950/95 backdrop-blur-xl border-t border-dark-800/50 z-40">
          <div className="flex items-center justify-around h-full px-2">
            {bottomNav.map((item, i) => (
              item.action === 'drawer' ? (
                <button
                  key={i}
                  onClick={() => setMobileOpen(true)}
                  className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-dark-400"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.name}</span>
                </button>
              ) : (
                <Link
                  key={i}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
                    isActive(item.href) ? 'text-primary-400' : 'text-dark-400'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.name}</span>
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </>
  );
}
