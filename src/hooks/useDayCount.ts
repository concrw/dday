import { useMemo } from "react";

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function computeDayCount(targetDateStr: string): number {
  // Parse both as UTC midnight to avoid timezone shifts
  const todayStr = toLocalDateString(new Date());
  const today = new Date(todayStr);
  const target = new Date(targetDateStr);
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function formatDayLabel(days: number): string {
  if (days === 0) return "D-Day";
  if (days > 0) return `D-${days}`;
  return `D+${Math.abs(days)}`;
}

export function useDayCount(targetDate: string) {
  return useMemo(() => {
    const days = computeDayCount(targetDate);
    return { days, label: formatDayLabel(days) };
  }, [targetDate]);
}
