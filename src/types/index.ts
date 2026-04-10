export type Recurring = 'none' | 'yearly';

export interface DdayEvent {
  id: string;
  user_id: string;
  title: string;
  target_date: string;
  note: string | null;
  color: string | null;
  recurring: Recurring;
  created_at: string;
}

export interface CreateDdayEventInput {
  title: string;
  target_date: string;
  note?: string;
  color?: string;
  recurring?: Recurring;
}

export interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  isToday: boolean;
}
