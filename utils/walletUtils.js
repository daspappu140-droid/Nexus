// Wallet utility functions

export function generateUTR() {
  return `UTR${Date.now()}${Math.floor(100000 + Math.random() * 900000)}`;
}

export function formatCurrency(amount, currency = 'INR') {
  if (amount === null || amount === undefined) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function calculateSettlementFee(amount, rate = 1.77) {
  const deduction = (amount * rate) / 100;
  return {
    originalAmount: amount,
    rate,
    deduction: Math.round(deduction * 100) / 100,
    netAmount: Math.round((amount - deduction) * 100) / 100,
  };
}

export function calculateMDSettlementFee(amount) {
  // ₹300 per ₹1,00,000
  const fee = Math.ceil((amount / 100000) * 300);
  return {
    originalAmount: amount,
    fee,
    netAmount: amount - fee,
  };
}
