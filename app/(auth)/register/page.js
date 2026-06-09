'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  BuildingLibraryIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  PhoneIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Account created! Awaiting admin approval.');
        router.push('/login');
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-dark-950 to-primary-900/30" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-primary-600/15 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative z-10 flex flex-col justify-center px-16 space-y-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-neon">
              <BuildingLibraryIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">Nexus<span className="text-primary-400">Bank</span></span>
              <div className="text-xs text-dark-400 tracking-widest uppercase">Digital Banking Platform</div>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight">
            Join India&apos;s Most<br />
            <span className="bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">
              Advanced Banking Network
            </span>
          </h2>
          <p className="text-dark-400 text-lg max-w-md">
            Create your account and unlock virtual cards, instant settlements, and enterprise-grade banking tools.
          </p>

          <div className="space-y-4 pt-4">
            {[
              'Free account creation — no hidden charges',
              'KYC-verified secure banking',
              'Instant virtual card issuance',
              'T+1 settlement processing',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-dark-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
              <BuildingLibraryIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Nexus<span className="text-primary-400">Bank</span></span>
          </div>

          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="text-dark-400">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-dark-300">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field-dark pl-12"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-dark-300">Email Address</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field-dark pl-12"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-dark-300">Phone Number</label>
              <div className="relative">
                <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field-dark pl-12"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-dark-300">Password</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field-dark pl-12 pr-12"
                  placeholder="Min 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-dark-300">Confirm Password</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input-field-dark pl-12"
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl font-semibold
                hover:from-primary-500 hover:to-indigo-500 transition-all shadow-lg shadow-primary-600/25
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-400 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-dark-800/50">
            <div className="flex items-center justify-center gap-2 text-xs text-dark-500">
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              Your data is protected under RBI guidelines
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
