import { Link } from 'react-router-dom';
import type { DdayEvent } from '@/types';
import { TEXT } from '@/constants/text';

interface EventCardProps {
  event: DdayEvent;
}

function getDayDiff(targetDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function EventCard({ event }: EventCardProps) {
  const diff = getDayDiff(event.target_date);
  const label = TEXT.landing.ddayLabel(diff);
  const relative = TEXT.landing.relativeLabel(diff);
  const accentColor = event.color ?? 'var(--color-primary)';

  return (
    <Link
      to={`/events/${event.id}`}
      className="card-hover-accent bg-surface rounded-2xl shadow-card border border-border p-6 flex flex-col gap-3 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.97] block"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold leading-tight truncate text-text">
          {event.title}
        </h3>
        <div className="flex flex-col items-end shrink-0">
          <span
            className="text-xl font-bold tabular-nums"
            style={{ color: accentColor }}
          >
            {label}
          </span>
          <span className="text-xs text-text-secondary mt-0.5">
            {relative}
          </span>
        </div>
      </div>

      {event.note && (
        <p className="text-sm line-clamp-2 text-text-secondary">
          {event.note}
        </p>
      )}

      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: accentColor }}
        />
        <span className="text-sm text-text-secondary">
          {formatDate(event.target_date)}
        </span>
      </div>
    </Link>
  );
}
