import { Link } from 'react-router-dom';
import type { DdayEvent } from '@/types';
import { TEXT } from '@/constants/text';
import { getEffectiveDate, recurringLabel } from '@/utils/recurring';

interface EventCardProps {
  event: DdayEvent;
}

function getDayDiff(targetDate: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate); target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function DdayDisplay({ diff, color }: { diff: number; color: string }) {
  const label = TEXT.landing.ddayLabel(diff);
  // split "D-25" into prefix and number for styling
  const match = label.match(/^(D[-+]?)(\d+)$/);
  if (match) {
    return (
      <div className="font-num leading-none" style={{ color }}>
        <span className="text-sm opacity-60">{match[1]}</span>
        <span className="text-5xl font-medium tracking-tight">{match[2]}</span>
      </div>
    );
  }
  return (
    <div className="font-num text-4xl font-medium leading-none" style={{ color }}>
      {label}
    </div>
  );
}

export function EventCard({ event }: EventCardProps) {
  const effectiveDate = getEffectiveDate(event);
  const diff = getDayDiff(effectiveDate);
  const accentColor = event.color ?? 'var(--color-accent)';
  const recurring = recurringLabel(event.recurring);
  const isPast = diff < 0;

  return (
    <Link
      to={`/events/${event.id}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface/60 backdrop-blur-sm p-5 gap-4 transition-all duration-200 hover:border-white/15 hover:bg-surface/80 focus:outline-none"
      aria-label={`${event.title}, ${TEXT.landing.ddayLabel(diff)}`}
    >
      {/* Top: D-day number */}
      <DdayDisplay diff={diff} color={accentColor} />

      {/* Bottom: title + meta */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold text-text leading-tight truncate">
          {event.title}
        </h3>
        <div className="flex items-center gap-2">
          {recurring && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full border border-border text-text-muted">
              {recurring}
            </span>
          )}
          <span className={`text-xs ${isPast ? 'text-text-muted' : 'text-text-secondary'}`}>
            {formatDate(effectiveDate)}
          </span>
        </div>
      </div>

      {/* Color accent bar */}
      <div
        className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full opacity-60"
        style={{ background: accentColor }}
      />
    </Link>
  );
}
