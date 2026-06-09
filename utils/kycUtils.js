// KYC utility functions

export function validatePAN(pan) {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
}

export function validateIFSC(ifsc) {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc);
}

export function validateAadhaar(aadhaar) {
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(aadhaar.replace(/\s/g, ''));
}

export function validatePhone(phone) {
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function maskAccountNumber(accountNumber) {
  if (!accountNumber || accountNumber.length < 4) return '••••';
  return `••••${accountNumber.slice(-4)}`;
}

export function getKYCStatusColor(status) {
  const colors = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    rekyc: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  };
  return colors[status] || colors.pending;
}
