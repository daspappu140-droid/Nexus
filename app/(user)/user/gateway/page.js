'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  GlobeAltIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/ui/AdminComponents';

export default function UserGatewayPage() {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch('/api/user/cards');
        if (res.ok) {
          const data = await res.json();
          setCards((data.cards || []).filter(c => c.status === 'active'));
        }
      } catch {}
      finally { setLoading(false); }
    };
    fetchCards();
  }, []);

  const handlePay = async () => {
    if (!selectedCard) { toast.error('Select a card'); return; }
    if (!amount || Number(amount) <= 0) { toast.error('Enter valid amount'); return; }
    if (!pin || pin.length !== 4) { toast.error('Enter 4-digit PIN'); return; }

    setProcessing(true);
    try {
      const res = await fetch('/api/user/gateway/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: selectedCard, amount: Number(amount), pin }),
      });
      if (res.ok) {
        toast.success('Payment successful! Settlement will be processed T+1.');
        setAmount('');
        setPin('');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Payment failed');
      }
    } catch { toast.error('Error'); }
    finally { setProcessing(false); }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader icon={GlobeAltIcon} title="Payment Gateway" subtitle="Spend & redeem through secure gateway" color="from-blue-500 to-indigo-600" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-dark-100 shadow-card p-6 space-y-5"
      >
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <ShieldCheckIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-700">Payments are processed securely. Settlements are auto-generated at T+1.</p>
        </div>

        <div>
          <label className="text-sm font-medium text-dark-700 mb-1.5 block">Select Card</label>
          <select
            value={selectedCard}
            onChange={(e) => setSelectedCard(e.target.value)}
            className="input-field"
          >
            <option value="">Choose a card</option>
            {cards.map(c => (
              <option key={c._id} value={c._id}>
                •••• {c.cardNumber.slice(-4)} — Balance: ₹{Number(c.balance).toLocaleString('en-IN')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-dark-700 mb-1.5 block">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter payment amount"
            className="input-field"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-dark-700 mb-1.5 block">Card PIN</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="4-digit PIN"
            maxLength={4}
            className="input-field"
          />
        </div>

        <button
          onClick={handlePay}
          disabled={processing}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {processing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Pay Now
              <ArrowRightIcon className="w-4 h-4" />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
