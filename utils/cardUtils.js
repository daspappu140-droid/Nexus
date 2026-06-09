// Card utility functions

export function generateCardNumber() {
  // Visa-style: starts with 4
  let num = '4532';
  for (let i = 0; i < 12; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

export function generateCVV() {
  return String(Math.floor(100 + Math.random() * 900));
}

export function generatePIN() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function generateExpiry() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 3);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${year}`;
}

export function maskCardNumber(number) {
  if (!number || number.length < 16) return '•••• •••• •••• ••••';
  return `•••• •••• •••• ${number.slice(-4)}`;
}

export function formatCardNumber(number) {
  if (!number) return '';
  return number.replace(/(.{4})/g, '$1 ').trim();
}

export function isCardExpired(expiryDate) {
  if (!expiryDate) return false;
  const [month, year] = expiryDate.split('/');
  const expiry = new Date(2000 + parseInt(year), parseInt(month), 0);
  return expiry < new Date();
}
