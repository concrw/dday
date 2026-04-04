export interface DdayEvent {
  id: string;
  title: string;
  target_date: string;
  note: string | null;
  color: string | null;
  created_at: string;
}

export interface CreateDdayEventInput {
  title: string;
  target_date: string;
  note?: string;
  color?: string;
}

export interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  isToday: boolean;
}
