// src/services/dateService.js

/**
 * Returns YYYY-MM-DD string for a given Date object (defaults to today)
 */
export function getFormattedDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns human friendly date string e.g. "Sunday, Aug 16, 2026"
 */
export function getDisplayDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Shifts date by offsetDays (+1 or -1)
 */
export function addDaysToDate(dateString, offsetDays) {
  const [year, month, day] = dateString.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  dateObj.setDate(dateObj.getDate() + offsetDays);
  return getFormattedDateString(dateObj);
}

/**
 * Returns greeting based on time of day
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Gets array of last N date strings (YYYY-MM-DD) including today
 */
export function getLastNDays(n = 7, endDateString = getFormattedDateString()) {
  const dates = [];
  const [year, month, day] = endDateString.split('-').map(Number);
  const baseDate = new Date(year, month - 1, day);

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    dates.push(getFormattedDateString(d));
  }
  return dates;
}
