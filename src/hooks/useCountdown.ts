import { useState, useEffect } from 'react';
import type { CountdownValue } from '@/types';

function calculate(targetDate: string): CountdownValue {
  const now = new Date();
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  const todayMidnight = new Date(now);
  todayMidnight.setHours(0, 0, 0, 0);

  const dayDiff = Math.round(
    (target.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24)
  );

  const msUntilTarget = target.getTime() - now.getTime();

  if (msUntilTarget <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: dayDiff < 0, isToday: dayDiff === 0 };
  }

  return {
    days: Math.floor(msUntilTarget / (1000 * 60 * 60 * 24)),
    hours: Math.floor((msUntilTarget % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((msUntilTarget % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((msUntilTarget % (1000 * 60)) / 1000),
    isPast: false,
    isToday: dayDiff === 0,
  };
}

export function useCountdown(targetDate: string): CountdownValue {
  const [value, setValue] = useState<CountdownValue>(() => calculate(targetDate));

  useEffect(() => {
    setValue(calculate(targetDate));
    const id = setInterval(() => {
      setValue(calculate(targetDate));
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return value;
}
