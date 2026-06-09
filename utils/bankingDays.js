// Indian Banking Day Calculator
// Skips: Sundays, 2nd & 4th Saturdays, Indian national/bank holidays

const INDIAN_HOLIDAYS_2024 = [
  '2024-01-26', // Republic Day
  '2024-03-25', // Holi
  '2024-03-29', // Good Friday
  '2024-04-11', // Id-ul-Fitr
  '2024-04-14', // Ambedkar Jayanti
  '2024-04-17', // Ram Navami
  '2024-04-21', // Mahavir Jayanti
  '2024-05-23', // Buddha Purnima
  '2024-06-17', // Eid ul-Adha
  '2024-07-17', // Muharram
  '2024-08-15', // Independence Day
  '2024-09-16', // Milad-un-Nabi
  '2024-10-02', // Gandhi Jayanti
  '2024-10-12', // Dussehra
  '2024-10-31', // Diwali (Bank)
  '2024-11-01', // Diwali
  '2024-11-15', // Guru Nanak Jayanti
  '2024-12-25', // Christmas
];

const INDIAN_HOLIDAYS_2025 = [
  '2025-01-26', // Republic Day
  '2025-02-26', // Maha Shivaratri
  '2025-03-14', // Holi
  '2025-03-31', // Id-ul-Fitr
  '2025-04-10', // Mahavir Jayanti
  '2025-04-14', // Ambedkar Jayanti
  '2025-04-18', // Good Friday
  '2025-05-12', // Buddha Purnima
  '2025-06-07', // Eid ul-Adha
  '2025-07-06', // Muharram
  '2025-08-15', // Independence Day
  '2025-08-16', // Janmashtami
  '2025-09-05', // Milad-un-Nabi
  '2025-10-02', // Gandhi Jayanti / Dussehra
  '2025-10-20', // Diwali
  '2025-10-21', // Diwali
  '2025-11-05', // Guru Nanak Jayanti
  '2025-12-25', // Christmas
];

const ALL_HOLIDAYS = [...INDIAN_HOLIDAYS_2024, ...INDIAN_HOLIDAYS_2025];

function isSecondOrFourthSaturday(date) {
  if (date.getDay() !== 6) return false;
  const dayOfMonth = date.getDate();
  const weekNumber = Math.ceil(dayOfMonth / 7);
  return weekNumber === 2 || weekNumber === 4;
}

function isHoliday(date) {
  const dateStr = date.toISOString().split('T')[0];
  return ALL_HOLIDAYS.includes(dateStr);
}

export function isBankingDay(date = new Date()) {
  const day = date.getDay();
  // Sunday
  if (day === 0) return false;
  // 2nd & 4th Saturday
  if (isSecondOrFourthSaturday(date)) return false;
  // Holiday
  if (isHoliday(date)) return false;
  return true;
}

export function getNextBankingDay(fromDate = new Date()) {
  const date = new Date(fromDate);
  date.setDate(date.getDate() + 1);
  while (!isBankingDay(date)) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}

export function getBankingDaysFromNow(days = 1) {
  let count = 0;
  const date = new Date();
  while (count < days) {
    date.setDate(date.getDate() + 1);
    if (isBankingDay(date)) count++;
  }
  return date;
}
