import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDdayEvent } from '@/hooks/useDdayEvent';
import { useCountdown } from '@/hooks/useCountdown';
import { deleteEvent } from '@/services/ddayService';
import { CountdownBlock } from '@/components/CountdownBlock';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { TEXT } from '@/constants/text';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getDayDiff(targetDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function CountdownSection({ targetDate, color }: { targetDate: string; color: string }) {
  const countdown = useCountdown(targetDate);
  const diff = getDayDiff(targetDate);
  const label = TEXT.detail.ddayLabel(diff);

  return (
    <div className="rounded-2xl p-6 md:p-10 flex flex-col items-center gap-6 bg-gradient-to-br from-primary-dark to-[#312E81]">
      <div className="text-5xl md:text-6xl font-bold" style={{ color }}>
        {label}
      </div>

      {!countdown.isPast && !countdown.isToday && (
        <div className="flex flex-wrap justify-center gap-4">
          <CountdownBlock value={countdown.days} label={TEXT.detail.daysUnit} />
          <CountdownBlock value={countdown.hours} label={TEXT.detail.hoursUnit} />
          <CountdownBlock value={countdown.minutes} label={TEXT.detail.minutesUnit} />
          <CountdownBlock value={countdown.seconds} label={TEXT.detail.secondsUnit} pulse />
        </div>
      )}

      <p className="text-white/60 text-sm">{formatDate(targetDate)}</p>
    </div>
  );
}

export function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { event, loading, error } = useDdayEvent(id ?? '');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

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
    } catch {
      // fallback: select the URL bar
    }
  }

  if (loading) return <LoadingSpinner text={TEXT.detail.loadingText} />;

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-bg">
        <p className="text-lg text-error">{TEXT.detail.errorText}</p>
        <Link to="/" className="text-sm underline text-primary">
          {TEXT.detail.backButton}
        </Link>
      </div>
    );
  }

  const accentColor = event.color ?? 'var(--color-primary)';

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-sm font-medium transition-all duration-200 hover:opacity-75 text-primary"
          >
            {TEXT.detail.backButton}
          </Link>
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight text-text">
            {event.title}
          </h1>
        </div>

        <CountdownSection targetDate={event.target_date} color={accentColor} />

        {event.note && (
          <div className="bg-surface rounded-2xl border border-border p-6">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-text-muted">
              {TEXT.detail.noteLabel}
            </p>
            <p className="text-base text-text">
              {event.note}
            </p>
          </div>
        )}

        <div className="bg-surface rounded-2xl border border-border p-6">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-text-muted">
            {TEXT.detail.createdLabel}
          </p>
          <p className="text-sm text-text-secondary">
            {formatDate(event.created_at.split('T')[0])}
          </p>
        </div>

        {deleteError && (
          <p className="text-sm px-4 py-3 rounded-lg bg-error-bg text-error">
            {deleteError}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 min-h-12 rounded-xl text-base font-semibold text-white bg-accent hover:bg-accent-dark transition-all duration-200 hover:scale-105"
          >
            {shareCopied ? TEXT.detail.shareSuccess : TEXT.detail.shareButton}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 min-h-12 rounded-xl text-base font-semibold border border-error text-error bg-surface transition-all duration-200 hover:scale-105 disabled:opacity-60"
          >
            {deleting ? '...' : TEXT.detail.deleteButton}
          </button>
        </div>
      </div>
    </div>
  );
}
