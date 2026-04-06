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
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function EventCard({ event }: EventCardProps) {
  const effectiveDate = getEffectiveDate(event);
  const diff = getDayDiff(effectiveDate);
  const label = TEXT.landing.ddayLabel(diff);
  const accentColor = event.color ?? 'var(--color-accent)';
  const recurring = recurringLabel(event.recurring);

  // split "D-25" → prefix "D-" + number "25"
  const match = label.match(/^(D[-+]?)(\d+)$/);
  const prefix = match ? match[1] : null;
  const numStr = match ? match[2] : label;

  return (
    <Link
      to={`/events/${event.id}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface/50 backdrop-blur-sm px-5 pt-5 pb-4 transition-all duration-200 hover:border-white/15 hover:bg-surface/70 focus:outline-none overflow-hidden"
      style={{ minHeight: '160px' }}
      aria-label={`${event.title}, ${label}`}
    >
      {/* Color accent — left edge */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{ background: accentColor, opacity: 0.7 }}
      />

      {/* Big number */}
      <div className="flex items-start gap-1 leading-none font-num">
        {prefix && (
          <span
            className="text-sm font-light mt-1 tracking-wider"
            style={{ color: accentColor, opacity: 0.6 }}
          >
            {prefix}
          </span>
        )}
        <span
          className="font-black tracking-tighter"
          style={{
            fontSize: 'clamp(3.5rem, 12vw, 5rem)',
            lineHeight: 1,
            color: accentColor,
          }}
        >
          {numStr}
        </span>
      </div>

      {/* Bottom meta */}
      <div className="flex flex-col gap-0.5 mt-3">
        <h3
          className="font-light text-white/90 leading-snug truncate"
          style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}
        >
          {event.title}
        </h3>
        <div className="flex items-center gap-2">
          {recurring && (
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full border border-white/10 text-white/30 uppercase tracking-wider">
              {recurring}
            </span>
          )}
          <span className="text-[11px] font-light text-white/25 tracking-wide">
            {formatDate(effectiveDate)}
          </span>
        </div>
      </div>
    </Link>
  );
}
