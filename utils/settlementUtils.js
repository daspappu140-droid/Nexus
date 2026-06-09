import { isBankingDay, getNextBankingDay } from './bankingDays';

export function getSettlementSchedule() {
  const now = new Date();
  const nextDay = getNextBankingDay(now);
  return {
    scheduledFor: nextDay,
    isToday: isBankingDay(now),
    formattedDate: nextDay.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  };
}

export function canProcessSettlement(user) {
  if (!user) return { allowed: false, reason: 'User not found' };
  if (user.isOnHold) return { allowed: false, reason: user.holdReason || 'Account on hold' };
  if (user.settlementBlocked) return { allowed: false, reason: user.settlementBlockReason || 'Settlement blocked' };
  if (user.status !== 'approved') return { allowed: false, reason: 'Account not approved' };
  return { allowed: true };
}

export function getSettlementTypeLabel(type) {
  const labels = {
    spend_redeem: 'Spend/Redeem',
    t_plus_1: 'T+1 Settlement',
    on_demand: 'On-Demand',
  };
  return labels[type] || type;
}
