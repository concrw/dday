import type { DdayEvent } from '@/types';

/**
 * For yearly recurring events, returns the effective target date:
 * - If this year's date hasn't passed → this year's date
 * - If already passed → next year's date
 */
export function getEffectiveDate(event: DdayEvent): string {
  if (event.recurring !== 'yearly') return event.target_date;

  const [, month, day] = event.target_date.split('-');
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const thisYear = new Date(`${now.getFullYear()}-${month}-${day}`);
  thisYear.setHours(0, 0, 0, 0);

  if (thisYear >= now) return `${now.getFullYear()}-${month}-${day}`;
  return `${now.getFullYear() + 1}-${month}-${day}`;
}

export function recurringLabel(recurring: DdayEvent['recurring']): string {
  return recurring === 'yearly' ? '매년 반복' : '';
}
