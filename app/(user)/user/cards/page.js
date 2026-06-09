'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  CreditCardIcon,
  PlusIcon,
  LockClosedIcon,
  LockOpenIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { PageHeader, StatusBadge } from '@/components/ui/AdminComponents';
import VirtualCard from '@/components/cards/VirtualCard';

export default function UserCardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showPin, setShowPin] = useState({});
  const [userName, setUserName] = useState('');

  useEffect(() => { fetchCards(); }, []);

  const fetchCards = async () => {
    try {
      const [cardsRes, userRes] = await Promise.all([
        fetch('/api/user/cards'),
        fetch('/api/auth/me'),
      ]);
      if (cardsRes.ok) setCards((await cardsRes.json()).cards || []);
      if (userRes.ok) setUserName((await userRes.json()).user?.name || '');
    } catch { toast.error('Failed to load cards'); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    setCreating(true);
    setShowAnimation(true);
    try {
      const res = await fetch('/api/user/cards', { method: 'POST' });
      if (res.ok) {
        setTimeout(() => {
          setShowAnimation(false);
          toast.success('Virtual card created!');
          fetchCards();
        }, 3000);
      } else {
        setShowAnimation(false);
        const data = await res.json();
        toast.error(data.error || 'Failed to create card');
      }
    } catch {
      setShowAnimation(false);
      toast.error('Error');
    }
    finally { setCreating(false); }
  };

  const handleFreeze = async (cardId, action) => {
    try {
      const res = await fetch(`/api/user/cards/${cardId}/${action}`, { method: 'PATCH' });
      if (res.ok) { toast.success(`Card ${action === 'freeze' ? 'frozen' : 'unfrozen'}`); fetchCards(); }
      else toast.error('Failed');
    } catch { toast.error('Error'); }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        icon={CreditCardIcon}
        title="My Virtual Cards"
        subtitle={`${cards.length} card(s) issued`}
        color="from-emerald-500 to-teal-600"
        action={
          <button onClick={handleCreate} disabled={creating} className="btn-primary flex items-center gap-2 text-sm">
            <PlusIcon className="w-4 h-4" />
            New Card
          </button>
        }
      />

      {/* Card Creation Animation */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark-950/90 flex items-center justify-center"
          >
            <div className="text-center space-y-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 border-4 border-primary-500/30 border-t-primary-500 rounded-full mx-auto"
              />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Creating Your Card</h3>
                <p className="text-dark-400">Generating secure credentials...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards Grid */}
      {cards.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="space-y-4"
            >
              <VirtualCard
                cardNumber={card.cardNumber}
                holderName={userName.toUpperCase()}
                expiry={card.expiryDate}
                status={card.status}
                balance={card.balance}
              />
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={card.status} />
                  <span className="text-xs text-dark-400">Limit: ₹{Number(card.spendingLimit).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-1">
                  {card.status === 'active' ? (
                    <button onClick={() => handleFreeze(card._id, 'freeze')} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Freeze">
                      <LockClosedIcon className="w-4 h-4" />
                    </button>
                  ) : card.status === 'frozen' && (
                    <button onClick={() => handleFreeze(card._id, 'unfreeze')} className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors" title="Unfreeze">
                      <LockOpenIcon className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setShowPin(p => ({ ...p, [card._id]: !p[card._id] }))}
                    className="p-2 rounded-lg text-dark-500 hover:bg-dark-100 transition-colors"
                    title="Show PIN"
                  >
                    {showPin[card._id] ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {showPin[card._id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-dark-50 rounded-xl p-3 mx-2"
                >
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-[10px] text-dark-500 uppercase">CVV</p>
                      <p className="font-mono font-bold text-dark-800">{card.cvv}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-dark-500 uppercase">PIN</p>
                      <p className="font-mono font-bold text-dark-800">••••</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-dark-500 uppercase">Expiry</p>
                      <p className="font-mono font-bold text-dark-800">{card.expiryDate}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <CreditCardIcon className="w-16 h-16 text-dark-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-dark-700 mb-2">No Cards Yet</h3>
          <p className="text-dark-400 mb-6">Create your first virtual card to get started</p>
          <button onClick={handleCreate} className="btn-primary">
            <PlusIcon className="w-4 h-4 inline mr-2" />
            Create Virtual Card
          </button>
        </div>
      )}
    </div>
  );
}
