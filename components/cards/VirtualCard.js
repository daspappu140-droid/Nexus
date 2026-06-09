'use client';
import { motion } from 'framer-motion';
import { BuildingLibraryIcon, WifiIcon } from '@heroicons/react/24/outline';

export default function VirtualCard({
  cardNumber = '•••• •••• •••• ••••',
  holderName = 'CARD HOLDER',
  expiry = 'MM/YY',
  cardName = 'NexusBank Platinum',
  status = 'active',
  balance,
  compact = false,
}) {
  const maskedNumber = cardNumber.length === 16
    ? `${cardNumber.slice(0, 4)} •••• •••• ${cardNumber.slice(12)}`
    : cardNumber;

  const statusColors = {
    active: 'from-dark-800 via-dark-900 to-dark-950',
    frozen: 'from-blue-900 via-blue-950 to-dark-950',
    expired: 'from-dark-700 via-dark-800 to-dark-900',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, rotateY: 2 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`relative rounded-2xl bg-gradient-to-br ${statusColors[status]} border border-dark-700/50 shadow-intense overflow-hidden ${
        compact ? 'p-4 w-full max-w-[280px]' : 'p-6 w-full max-w-[400px]'
      }`}
      style={{ aspectRatio: compact ? '1.7/1' : '1.6/1' }}
    >
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/10 rounded-full blur-[60px]" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/8 rounded-full blur-[50px]" />
      {status === 'frozen' && (
        <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[1px]" />
      )}

      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Top */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center ${compact ? 'w-6 h-6' : 'w-8 h-8'}`}>
              <BuildingLibraryIcon className={`text-white ${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
            </div>
            <span className={`font-bold text-white/90 ${compact ? 'text-xs' : 'text-sm'}`}>NexusBank</span>
          </div>
          <div className="flex items-center gap-2">
            {status === 'frozen' && (
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                FROZEN
              </span>
            )}
            <WifiIcon className={`text-white/50 rotate-90 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </div>
        </div>

        {/* Chip */}
        <div className={`rounded-md bg-gradient-to-br from-amber-300 to-amber-500 shadow-sm ${compact ? 'w-7 h-5' : 'w-10 h-7'}`} />

        {/* Number */}
        <div className={`font-mono tracking-[0.15em] text-white/80 ${compact ? 'text-sm' : 'text-lg'}`}>
          {maskedNumber}
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-dark-500 uppercase tracking-wider ${compact ? 'text-[8px]' : 'text-[10px]'}`}>Card Holder</div>
            <div className={`font-semibold text-white/90 ${compact ? 'text-[10px]' : 'text-xs'}`}>{holderName}</div>
          </div>
          <div>
            <div className={`text-dark-500 uppercase tracking-wider ${compact ? 'text-[8px]' : 'text-[10px]'}`}>Expires</div>
            <div className={`font-semibold text-white/90 ${compact ? 'text-[10px]' : 'text-xs'}`}>{expiry}</div>
          </div>
          {balance !== undefined && (
            <div>
              <div className={`text-dark-500 uppercase tracking-wider ${compact ? 'text-[8px]' : 'text-[10px]'}`}>Balance</div>
              <div className={`font-semibold text-emerald-400 ${compact ? 'text-[10px]' : 'text-xs'}`}>
                ₹{Number(balance).toLocaleString('en-IN')}
              </div>
            </div>
          )}
          <div className="flex gap-0.5">
            <div className={`rounded-full bg-red-500/80 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
            <div className={`rounded-full bg-amber-500/80 ${compact ? 'w-4 h-4 -ml-2' : 'w-5 h-5 -ml-2.5'}`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
