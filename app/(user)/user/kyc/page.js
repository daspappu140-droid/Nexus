'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  IdentificationIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { PageHeader, StatusBadge } from '@/components/ui/AdminComponents';

export default function UserKYCPage() {
  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    contactNumber: '',
    panNumber: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchKYC(); }, []);

  const fetchKYC = async () => {
    try {
      const res = await fetch('/api/user/kyc');
      if (res.ok) {
        const data = await res.json();
        if (data.kyc) {
          setKyc(data.kyc);
          setFormData({
            contactNumber: data.kyc.contactNumber || '',
            panNumber: data.kyc.panNumber || '',
            bankName: data.kyc.bankName || '',
            accountNumber: data.kyc.accountNumber || '',
            ifscCode: data.kyc.ifscCode || '',
          });
        }
      }
    } catch {}
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.panNumber || !formData.bankName || !formData.accountNumber || !formData.ifscCode) {
      toast.error('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/user/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('KYC submitted for review');
        fetchKYC();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Submission failed');
      }
    } catch { toast.error('Error'); }
    finally { setSubmitting(false); }
  };

  const statusIcon = {
    approved: <CheckCircleIcon className="w-16 h-16 text-emerald-500" />,
    pending: <ClockIcon className="w-16 h-16 text-amber-500" />,
    rejected: <XCircleIcon className="w-16 h-16 text-red-500" />,
    rekyc: <ArrowPathIcon className="w-16 h-16 text-purple-500" />,
  };

  if (loading) {
    return <div className="space-y-4 animate-pulse"><div className="h-8 w-48 bg-dark-200 rounded-lg" /><div className="h-64 bg-dark-200 rounded-2xl" /></div>;
  }

  // If KYC already submitted and approved/pending
  if (kyc && kyc.status === 'approved') {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <PageHeader icon={IdentificationIcon} title="KYC Verification" subtitle="Your verification status" color="from-emerald-500 to-teal-600" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-dark-100 shadow-card p-8 text-center">
          {statusIcon.approved}
          <h3 className="text-xl font-bold text-dark-900 mt-4 mb-2">KYC Approved</h3>
          <p className="text-dark-500">Your identity has been verified successfully.</p>
          <div className="mt-6 grid grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-dark-50 rounded-xl"><p className="text-xs text-dark-500">PAN Number</p><p className="font-semibold text-dark-800">{kyc.panNumber}</p></div>
            <div className="p-4 bg-dark-50 rounded-xl"><p className="text-xs text-dark-500">Bank</p><p className="font-semibold text-dark-800">{kyc.bankName}</p></div>
            <div className="p-4 bg-dark-50 rounded-xl"><p className="text-xs text-dark-500">Account</p><p className="font-semibold text-dark-800">{kyc.accountNumber}</p></div>
            <div className="p-4 bg-dark-50 rounded-xl"><p className="text-xs text-dark-500">IFSC</p><p className="font-semibold text-dark-800">{kyc.ifscCode}</p></div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (kyc && kyc.status === 'pending') {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <PageHeader icon={IdentificationIcon} title="KYC Verification" subtitle="Your verification status" color="from-amber-500 to-orange-600" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-dark-100 shadow-card p-8 text-center">
          {statusIcon.pending}
          <h3 className="text-xl font-bold text-dark-900 mt-4 mb-2">Under Review</h3>
          <p className="text-dark-500">Your KYC documents are being reviewed. This usually takes 24-48 hours.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader icon={IdentificationIcon} title="KYC Verification" subtitle="Submit your documents for verification" color="from-teal-500 to-cyan-600" />

      {kyc?.status === 'rejected' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-sm font-semibold text-red-800">KYC Rejected</p>
          <p className="text-sm text-red-600">{kyc.rejectionReason || 'Please resubmit with correct documents'}</p>
        </div>
      )}

      {kyc?.status === 'rekyc' && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
          <p className="text-sm font-semibold text-purple-800">Re-KYC Required</p>
          <p className="text-sm text-purple-600">{kyc.rekycReason || 'Please update your documents'}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-dark-100 shadow-card p-6 space-y-5">
        <h3 className="text-lg font-bold text-dark-900">Personal & Bank Details</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-dark-700 mb-1.5 block">Contact Number *</label>
            <input type="tel" value={formData.contactNumber} onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} className="input-field" placeholder="+91 9876543210" />
          </div>
          <div>
            <label className="text-sm font-medium text-dark-700 mb-1.5 block">PAN Number *</label>
            <input type="text" value={formData.panNumber} onChange={(e) => setFormData({...formData, panNumber: e.target.value.toUpperCase()})} className="input-field" placeholder="ABCDE1234F" maxLength={10} />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-dark-700 mb-1.5 block">Bank Name *</label>
            <input type="text" value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} className="input-field" placeholder="State Bank of India" />
          </div>
          <div>
            <label className="text-sm font-medium text-dark-700 mb-1.5 block">Account Number *</label>
            <input type="text" value={formData.accountNumber} onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} className="input-field" placeholder="1234567890" />
          </div>
          <div>
            <label className="text-sm font-medium text-dark-700 mb-1.5 block">IFSC Code *</label>
            <input type="text" value={formData.ifscCode} onChange={(e) => setFormData({...formData, ifscCode: e.target.value.toUpperCase()})} className="input-field" placeholder="SBIN0001234" maxLength={11} />
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Submitting...' : 'Submit KYC'}
        </button>
      </form>
    </div>
  );
}
