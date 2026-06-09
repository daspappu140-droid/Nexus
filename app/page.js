'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  ArrowRightIcon,
  SparklesIcon,
  LockClosedIcon,
  GlobeAltIcon,
  BoltIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-950/95 backdrop-blur-xl border-b border-dark-800/50 shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-neon">
                  <BuildingLibraryIcon className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-dark-950 animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight">Nexus<span className="text-primary-400">Bank</span></span>
                <div className="text-[10px] text-dark-400 font-medium tracking-widest uppercase -mt-0.5">Digital Banking</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-dark-300 hover:text-white transition-colors font-medium">Features</a>
              <a href="#solutions" className="text-sm text-dark-300 hover:text-white transition-colors font-medium">Solutions</a>
              <a href="#security" className="text-sm text-dark-300 hover:text-white transition-colors font-medium">Security</a>
              <a href="#contact" className="text-sm text-dark-300 hover:text-white transition-colors font-medium">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="px-5 py-2.5 text-sm font-semibold text-dark-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-primary-600 to-indigo-600 rounded-xl text-white hover:from-primary-500 hover:to-indigo-500 transition-all shadow-lg shadow-primary-600/25">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-[128px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[200px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20">
                <SparklesIcon className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-primary-300">India&apos;s #1 Digital Banking Platform</span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                Banking{' '}
                <span className="relative">
                  <span className="bg-gradient-to-r from-primary-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Reimagined
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 8C50 2 100 2 150 6C200 10 250 4 298 8" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                    <defs><linearGradient id="gradient"><stop stopColor="#818cf8"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs>
                  </svg>
                </span>
                <br />
                for the Future
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg text-dark-400 max-w-lg leading-relaxed">
                Experience next-generation digital banking with virtual cards, instant settlements,
                enterprise-grade security, and a multi-tier distribution network built for scale.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
                <Link href="/register" className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl text-white font-semibold hover:from-primary-500 hover:to-indigo-500 transition-all shadow-2xl shadow-primary-600/30 hover:shadow-primary-500/40 hover:-translate-y-0.5">
                  Open Account Free
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#features" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-dark-700 text-dark-300 font-semibold hover:border-dark-600 hover:text-white hover:bg-dark-800/50 transition-all">
                  Explore Platform
                </a>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-indigo-500 border-2 border-dark-950 flex items-center justify-center text-xs font-bold">
                      {['A','S','R','M'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-amber-400" />)}
                  </div>
                  <p className="text-xs text-dark-400 mt-0.5">Trusted by 10,000+ businesses</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Card Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main Card */}
                <div className="relative w-[420px] h-[260px] mx-auto rounded-3xl bg-gradient-to-br from-dark-800 via-dark-900 to-dark-950 border border-dark-700/50 shadow-intense p-8 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px]" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px]" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
                          <BuildingLibraryIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-bold text-white/90">NexusBank</span>
                      </div>
                      <div className="text-xs text-dark-400 font-mono">PLATINUM</div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-300 to-amber-500 shadow-sm" />
                    </div>
                    <div className="font-mono text-xl tracking-[0.2em] text-white/80">
                      4532 •••• •••• 7891
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-dark-500 uppercase tracking-wider">Card Holder</div>
                        <div className="text-sm font-semibold text-white/90">RAJESH KUMAR</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-dark-500 uppercase tracking-wider">Expires</div>
                        <div className="text-sm font-semibold text-white/90">12/27</div>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-6 h-6 rounded-full bg-red-500/80" />
                        <div className="w-6 h-6 rounded-full bg-amber-500/80 -ml-3" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating stats */}
                <div className="absolute -top-6 -right-6 bg-dark-800/90 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-4 shadow-glass animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <BoltIcon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs text-dark-400">Instant Settlement</div>
                      <div className="text-sm font-bold text-emerald-400">T+1 Processing</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-8 bg-dark-800/90 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-4 shadow-glass animate-float" style={{ animationDelay: '2s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                      <ShieldCheckIcon className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <div className="text-xs text-dark-400">Bank Grade</div>
                      <div className="text-sm font-bold text-primary-400">256-bit Encrypted</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative border-y border-dark-800/50 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '₹50Cr+', label: 'Transactions Processed' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '<2s', label: 'Settlement Speed' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-dark-300 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-dark-400 mt-1 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
              <BoltIcon className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-primary-300">Powerful Features</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">Scale</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-dark-400 max-w-2xl mx-auto">
              A comprehensive digital banking infrastructure built for enterprises, distributors, and individuals.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: CreditCardIcon,
                title: 'Virtual Cards',
                desc: 'Issue unlimited virtual debit cards with customizable limits, PIN protection, and instant freeze capabilities.',
                gradient: 'from-blue-500 to-cyan-500',
                glow: 'blue',
              },
              {
                icon: BanknotesIcon,
                title: 'Instant Settlements',
                desc: 'T+1 settlements with automated banking day calculations. Skip weekends and holidays intelligently.',
                gradient: 'from-emerald-500 to-teal-500',
                glow: 'emerald',
              },
              {
                icon: ShieldCheckIcon,
                title: 'Enterprise Security',
                desc: '256-bit encryption, JWT authentication, role-based access control, and comprehensive audit trails.',
                gradient: 'from-primary-500 to-indigo-500',
                glow: 'primary',
              },
              {
                icon: UserGroupIcon,
                title: 'Multi-Tier Network',
                desc: 'Admin → Master Distributor → Distributor → User hierarchy with granular permission controls.',
                gradient: 'from-purple-500 to-pink-500',
                glow: 'purple',
              },
              {
                icon: ChartBarIcon,
                title: 'Real-time Analytics',
                desc: 'Live dashboards with transaction metrics, settlement tracking, and business intelligence reports.',
                gradient: 'from-amber-500 to-orange-500',
                glow: 'amber',
              },
              {
                icon: GlobeAltIcon,
                title: 'Payment Gateway',
                desc: 'Integrated payment processing with spend-redeem mechanics and automated cashback systems.',
                gradient: 'from-rose-500 to-red-500',
                glow: 'rose',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="group relative bg-dark-900/50 rounded-3xl border border-dark-800/50 p-8 hover:border-dark-700/50 transition-all duration-500 hover:-translate-y-1"
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-dark-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="relative py-24 bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold mb-4">
              Built for{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Every Role</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-dark-400 max-w-2xl mx-auto">
              Tailored experiences for administrators, distributors, corporates, and end users.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { role: 'Admin', desc: 'Complete platform control, user management, KYC verification, settlement processing, audit logs', color: 'from-red-500 to-rose-600' },
              { role: 'Master Distributor', desc: 'Network management, on-demand settlements, distributor oversight, card management', color: 'from-purple-500 to-violet-600' },
              { role: 'Distributor', desc: 'User onboarding, wallet recharges, reports generation, support management', color: 'from-blue-500 to-indigo-600' },
              { role: 'Corporate', desc: 'Employee management, bulk allowances, card issuance, expense tracking', color: 'from-emerald-500 to-teal-600' },
              { role: 'Employee', desc: 'Allowance management, virtual cards, voucher redemption, transaction history', color: 'from-amber-500 to-orange-600' },
              { role: 'User', desc: 'Digital wallet, virtual cards, payment gateway, T+1 settlements, KYC submission', color: 'from-cyan-500 to-blue-600' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="relative bg-dark-900/80 rounded-2xl border border-dark-800/50 p-6 hover:border-dark-700 transition-all"
              >
                <div className={`inline-flex px-3 py-1.5 rounded-lg bg-gradient-to-r ${item.color} text-white text-xs font-bold mb-4`}>
                  {item.role}
                </div>
                <p className="text-dark-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <LockClosedIcon className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">Bank-Grade Security</span>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold mb-6">
                Your Money,{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Fort Knox Protected
                </span>
              </motion.h2>
              <motion.div variants={fadeInUp} className="space-y-5">
                {[
                  'JWT tokens in HTTP-only cookies — Zero XSS vulnerability',
                  'bcrypt password hashing with 12-round salting',
                  'Role-based access control on every API endpoint',
                  'Comprehensive audit trail logging',
                  'Per-user maintenance mode & settlement blocking',
                  'Admin impersonation with 1-hour expiry tokens',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-dark-300 text-sm">{item}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative bg-dark-900 rounded-3xl border border-dark-800/50 p-8 shadow-intense overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px]" />
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-dark-800/50 border border-dark-700/30">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-mono text-dark-300">SSL/TLS encryption active</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-dark-800/50 border border-dark-700/30">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-mono text-dark-300">RBAC middleware verified</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-dark-800/50 border border-dark-700/30">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-mono text-dark-300">KYC compliance — RBI guidelines</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-dark-800/50 border border-dark-700/30">
                    <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-sm font-mono text-dark-300">Fraud monitoring — AI powered</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-dark-800/50 border border-dark-700/30">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-mono text-dark-300">Data residency — India servers</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="relative bg-gradient-to-br from-dark-900 via-dark-900 to-dark-800 rounded-[2rem] border border-dark-700/50 p-12 sm:p-16 overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />
            <motion.h2 variants={fadeInUp} className="relative text-3xl sm:text-5xl font-bold mb-6">
              Ready to Transform Your{' '}
              <span className="bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">Banking Experience?</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="relative text-dark-400 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of businesses using NexusBank for seamless digital transactions.
            </motion.p>
            <motion.div variants={fadeInUp} className="relative flex flex-wrap justify-center gap-4">
              <Link href="/register" className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl text-white font-semibold hover:from-primary-500 hover:to-indigo-500 transition-all shadow-2xl shadow-primary-600/30">
                Start Free Today
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-dark-700 text-dark-300 font-semibold hover:border-dark-600 hover:text-white transition-all">
                Sign In to Dashboard
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-dark-800/50 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
                  <BuildingLibraryIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Nexus<span className="text-primary-400">Bank</span></span>
              </div>
              <p className="text-sm text-dark-400 leading-relaxed">
                India&apos;s most advanced digital banking platform for enterprises and individuals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2.5">
                {['Virtual Cards', 'Settlements', 'Payment Gateway', 'KYC Verification', 'Analytics'].map((item, i) => (
                  <li key={i}><a href="#" className="text-sm text-dark-400 hover:text-primary-400 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2.5">
                {['About Us', 'Terms of Service', 'Privacy Policy', 'Refund Policy', 'Careers'].map((item, i) => (
                  <li key={i}><a href="#" className="text-sm text-dark-400 hover:text-primary-400 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-dark-400">
                  <EnvelopeIcon className="w-4 h-4 text-primary-400" />
                  support@nexusbank.in
                </li>
                <li className="flex items-center gap-2 text-sm text-dark-400">
                  <PhoneIcon className="w-4 h-4 text-primary-400" />
                  +91 9403893296
                </li>
                <li className="flex items-start gap-2 text-sm text-dark-400">
                  <MapPinIcon className="w-4 h-4 text-primary-400 mt-0.5" />
                  Mumbai, Maharashtra, India
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-dark-800/50 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-dark-500">&copy; 2024 NexusBank. All rights reserved.</p>
            <div className="flex items-center gap-2 text-xs text-dark-500">
              <LockClosedIcon className="w-3.5 h-3.5" />
              Secured with 256-bit encryption
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
