import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDdayEvent } from '@/hooks/useDdayEvent';
import { useCountdown } from '@/hooks/useCountdown';
import { deleteEvent } from '@/services/ddayService';
import { CountdownBlock } from '@/components/CountdownBlock';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ShareCardModal } from '@/components/ShareCardModal';
import { TEXT } from '@/constants/text';
import { getEffectiveDate, recurringLabel } from '@/utils/recurring';

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

function CelebrationBurst() {
  const dots = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {dots.map((i) => (
        <span
          key={i}
          className="absolute w-2 h-2 rounded-full opacity-0"
          style={{
            background: i % 3 === 0 ? 'var(--color-accent)' : i % 3 === 1 ? '#fff' : 'var(--color-primary)',
            top: `${20 + Math.sin((i / 12) * Math.PI * 2) * 35}%`,
            left: `${50 + Math.cos((i / 12) * Math.PI * 2) * 40}%`,
            animation: `fadeSlideUp 0.6s ease ${i * 0.05}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

function CountdownSection({ targetDate }: { targetDate: string; color: string }) {
  const countdown = useCountdown(targetDate);
  const diff = getDayDiff(targetDate);
  const label = TEXT.detail.ddayLabel(diff);
  const isToday = diff === 0;

  return (
    <div className={`relative rounded-2xl p-6 md:p-10 flex flex-col items-center gap-6 ${
      isToday
        ? 'bg-gradient-to-br from-accent to-[#D97706]'
        : 'bg-gradient-to-br from-primary-dark to-[#312E81]'
    }`}>
      {isToday && <CelebrationBurst />}
      <div className="text-5xl md:text-6xl font-bold text-white" style={{ transition: 'color 0.4s ease' }}>
        {label}
      </div>

      {isToday && (
        <p className="text-white/90 text-lg font-semibold text-center">
          오늘이 바로 그 날입니다!
        </p>
      )}

      {!countdown.isPast && !isToday && (
        <div className="flex flex-wrap justify-center gap-4">
          <CountdownBlock value={countdown.days} label={TEXT.detail.daysUnit} />
          <CountdownBlock value={countdown.hours} label={TEXT.detail.hoursUnit} />
          <CountdownBlock value={countdown.minutes} label={TEXT.detail.minutesUnit} />
          <CountdownBlock value={countdown.seconds} label={TEXT.detail.secondsUnit} pulse />
        </div>
      )}

      {countdown.isPast && !isToday && (
        <p className="text-white/70 text-base">{Math.abs(diff)}일 전에 지나갔습니다.</p>
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
  const effectiveDate = getEffectiveDate(event);
  const recurring = recurringLabel(event.recurring);

  return (
    <div className="min-h-screen bg-bg animate-page">
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-sm font-medium transition-all duration-200 hover:opacity-75 text-primary"
            aria-label="홈으로 돌아가기"
          >
            {TEXT.detail.backButton}
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight text-text">
            {event.title}
          </h1>
          {recurring && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary w-fit">
              {recurring}
            </span>
          )}
        </div>

        <CountdownSection targetDate={effectiveDate} color={accentColor} />

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
          <Link
            to={`/events/${event.id}/edit`}
            className="flex-1 min-h-12 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-[0.97]"
          >
            수정
          </Link>
          <button
            type="button"
            onClick={() => setShowShareCard(true)}
            className="flex-1 min-h-12 rounded-xl text-base font-semibold text-white bg-accent hover:bg-accent-dark transition-all duration-200 hover:scale-105 active:scale-[0.97]"
          >
            카드 공유
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 min-h-12 rounded-xl text-base font-semibold border border-border text-text-secondary bg-surface transition-all duration-200 hover:scale-105 active:scale-[0.97]"
          >
            {shareCopied ? TEXT.detail.shareSuccess : '링크 복사'}
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

        {showShareCard && (
          <ShareCardModal event={event} onClose={() => setShowShareCard(false)} />
        )}
      </div>
    </div>
  );
}
