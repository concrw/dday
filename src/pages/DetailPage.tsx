import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDdayEvent } from '@/hooks/useDdayEvent';
import { useCountdown } from '@/hooks/useCountdown';
import { deleteEvent } from '@/services/ddayService';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ShareCardModal } from '@/components/ShareCardModal';
import { AuroraBlur } from '@/components/backgrounds/AuroraBlur';
import { TEXT } from '@/constants/text';
import { getEffectiveDate, recurringLabel } from '@/utils/recurring';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getDayDiff(targetDate: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate); target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-num text-4xl md:text-5xl font-medium text-white tabular-nums leading-none">
        {padded}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-text-muted">{label}</span>
    </div>
  );
}

function CountdownSection({ targetDate, color }: { targetDate: string; color: string }) {
  const countdown = useCountdown(targetDate);
  const diff = getDayDiff(targetDate);
  const label = TEXT.detail.ddayLabel(diff);
  const isToday = diff === 0;
  const isPast = diff < 0;

  const match = label.match(/^(D[-+]?)(\d+)$/);

  return (
    <div className="flex flex-col items-center gap-8 py-16">
      {/* Big D-number */}
      <div className="text-center">
        {match ? (
          <div className="font-num leading-none" style={{ color }}>
            <span className="text-2xl md:text-3xl opacity-40 tracking-wider">{match[1]}</span>
            <span
              className="block font-black tracking-tighter"
              style={{ fontSize: 'clamp(7rem, 28vw, 18rem)', lineHeight: 0.9 }}
            >
              {match[2]}
            </span>
          </div>
        ) : (
          <div className="font-num text-8xl font-medium" style={{ color }}>
            {label}
          </div>
        )}
        <p className="text-text-muted text-xs font-light tracking-widest mt-5 uppercase">{formatDate(targetDate)}</p>
      </div>

      {/* HH:MM:SS row */}
      {!isPast && !isToday && (
        <div className="flex items-end gap-6 md:gap-10">
          <CountdownUnit value={countdown.hours} label={TEXT.detail.hoursUnit} />
          <span className="font-num text-3xl text-text-muted mb-4 leading-none">:</span>
          <CountdownUnit value={countdown.minutes} label={TEXT.detail.minutesUnit} />
          <span className="font-num text-3xl text-text-muted mb-4 leading-none">:</span>
          <div className="flex flex-col items-center gap-1">
            <span className={`font-num text-4xl md:text-5xl font-medium tabular-nums leading-none ${countdown.seconds % 2 === 0 ? 'text-white' : 'text-white/60'} transition-colors duration-500`}>
              {String(countdown.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-text-muted">{TEXT.detail.secondsUnit}</span>
          </div>
        </div>
      )}

      {isToday && (
        <p className="text-lg font-semibold text-accent">Today is the day.</p>
      )}

      {isPast && (
        <p className="text-sm text-text-muted">{Math.abs(diff)} days ago</p>
      )}
    </div>
  );
}

function ActionButton({ onClick, children, variant = 'ghost' }: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'ghost' | 'danger';
}) {
  const styles = {
    primary: 'bg-white text-black hover:bg-white/90',
    ghost: 'border border-border text-text-secondary hover:border-white/20 hover:text-white',
    danger: 'border border-white/10 text-red-400 hover:border-red-400/40',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 min-h-11 rounded-full text-sm font-semibold transition-all duration-200 ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { event, loading, error } = useDdayEvent(id ?? '');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  async function handleDelete() {
    if (!event) return;
    if (!window.confirm(TEXT.detail.deleteConfirm)) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteEvent(event.id);
      navigate('/');
    } catch {
      setDeleteError(TEXT.detail.deleteError);
      setDeleting(false);
    }
  }

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch { /* noop */ }
  }

  if (loading) return <LoadingSpinner text={TEXT.detail.loadingText} />;

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-error">{TEXT.detail.errorText}</p>
        <Link to="/" className="text-xs text-text-muted hover:text-white transition-colors">
          {TEXT.detail.backButton}
        </Link>
      </div>
    );
  }

  const accentColor = event.color ?? 'var(--color-accent)';
  const effectiveDate = getEffectiveDate(event);
  const recurring = recurringLabel(event.recurring);

  return (
    <div className="relative min-h-screen bg-bg animate-page">
      <AuroraBlur />

      <div className="relative z-10 max-w-2xl mx-auto px-4">
        {/* Back */}
        <div className="pt-6 pb-2">
          <Link to="/" className="text-xs text-text-muted hover:text-white transition-colors">
            {TEXT.detail.backButton}
          </Link>
        </div>

        {/* Title */}
        <div className="flex items-center gap-3 mt-2">
          <h1 className="text-sm font-light text-white/50 tracking-wide">{event.title}</h1>
          {recurring && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-border text-text-muted">
              {recurring}
            </span>
          )}
        </div>

        {/* Countdown hero */}
        <CountdownSection targetDate={effectiveDate} color={accentColor} />

        {/* Note */}
        {event.note && (
          <div className="rounded-2xl border border-border bg-surface/40 backdrop-blur-sm p-5 mb-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-2">
              {TEXT.detail.noteLabel}
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">{event.note}</p>
          </div>
        )}

        {deleteError && (
          <p className="text-xs px-4 py-3 rounded-xl bg-error-bg text-error mb-4">{deleteError}</p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pb-12">
          <Link
            to={`/events/${event.id}/edit`}
            className="flex-1 min-h-11 rounded-full text-sm font-semibold text-black bg-white hover:bg-white/90 transition-all duration-200 flex items-center justify-center"
          >
            Edit
          </Link>
          <ActionButton onClick={() => setShowShareCard(true)} variant="ghost">
            Share card
          </ActionButton>
          <ActionButton onClick={handleShare} variant="ghost">
            {shareCopied ? 'Copied!' : 'Copy link'}
          </ActionButton>
          <ActionButton onClick={handleDelete} variant="danger">
            {deleting ? '...' : TEXT.detail.deleteButton}
          </ActionButton>
        </div>

        {showShareCard && (
          <ShareCardModal event={event} onClose={() => setShowShareCard(false)} />
        )}
      </div>
    </div>
  );
}
