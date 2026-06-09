'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

export function PageHeader({ icon: Icon, title, subtitle, color = 'from-primary-600 to-indigo-600', action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-dark-900">{title}</h1>
          {subtitle && <p className="text-sm text-dark-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    processed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
    open: 'bg-blue-50 text-blue-700 border-blue-200',
    paused: 'bg-amber-50 text-amber-700 border-amber-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    blocked: 'bg-red-50 text-red-700 border-red-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
    frozen: 'bg-blue-50 text-blue-700 border-blue-200',
    expired: 'bg-dark-100 text-dark-600 border-dark-200',
    closed: 'bg-dark-100 text-dark-600 border-dark-200',
    rekyc: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const style = styles[status] || 'bg-dark-100 text-dark-600 border-dark-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}>
      {status?.replace(/_/g, ' ')?.replace(/\b\w/g, l => l.toUpperCase())}
    </span>
  );
}

export function AdminModal({ title, subtitle, onClose, children, size = 'md' }) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-dark-950/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className={`relative bg-white rounded-2xl shadow-intense w-full ${sizes[size]} max-h-[85vh] overflow-hidden`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-dark-100">
            <div>
              <h3 className="text-lg font-bold text-dark-900">{title}</h3>
              {subtitle && <p className="text-sm text-dark-500 mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-dark-100 text-dark-400 hover:text-dark-700 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-6">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function ActionBtn({ icon: Icon, onClick, color = 'text-dark-500 hover:bg-dark-100', title, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-xl transition-all ${color} disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <Icon className="w-4.5 h-4.5" />
    </button>
  );
}

export function StatsCard({ icon: Icon, title, value, change, color = 'from-primary-500 to-indigo-600', trend }) {
  return (
    <div className="stats-card group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {change && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
            trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-sm text-dark-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-dark-900 mt-1">{value}</p>
    </div>
  );
}

export function DataTable({ columns, data, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-dark-100 overflow-hidden">
        <div className="p-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 skeleton w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-dark-100 overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-100 bg-dark-50/50">
              {columns.map((col, i) => (
                <th key={i} className="px-5 py-3.5 text-left text-xs font-semibold text-dark-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-100">
            {data?.length > 0 ? data.map((row, i) => (
              <tr key={i} className="hover:bg-dark-50/50 transition-colors">
                {columns.map((col, j) => (
                  <td key={j} className="px-5 py-3.5 text-sm text-dark-700">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-dark-400">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-dark-100 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-dark-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-dark-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-dark-400 text-center max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-dark-200" />
        <div className="space-y-2">
          <div className="h-5 w-40 bg-dark-200 rounded-lg" />
          <div className="h-3 w-24 bg-dark-200 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-dark-200 rounded-2xl" />
        ))}
      </div>
      <div className="h-64 bg-dark-200 rounded-2xl" />
    </div>
  );
}
