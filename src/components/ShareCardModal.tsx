import { useState, useEffect, useRef } from 'react';
import { generateShareCard, shareOrDownload } from '@/utils/shareCard';
import type { DdayEvent } from '@/types';
import { TEXT } from '@/constants/text';

function getDayDiff(targetDate: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate); target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

interface ShareCardModalProps {
  event: DdayEvent;
  onClose: () => void;
}

export function ShareCardModal({ event, onClose }: ShareCardModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'sharing' | 'done' | 'error'>('idle');
  const blobRef = useRef<string | null>(null);

  const diff = getDayDiff(event.target_date);
  const ddayLabel = TEXT.landing.ddayLabel(diff);
  const relativeLabel = TEXT.landing.relativeLabel(diff);
  const color = event.color ?? '#6366F1';

  useEffect(() => {
    setLoading(true);
    generateShareCard({
      title: event.title,
      targetDate: event.target_date,
      color,
      ddayLabel,
      relativeLabel,
      note: event.note ?? undefined,
    }).then((b) => {
      const url = URL.createObjectURL(b);
      blobRef.current = url;
      setBlob(b);
      setPreviewUrl(url);
      setLoading(false);
    }).catch(() => setLoading(false));

    return () => {
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    };
  }, [event.id]);

  async function handleShare() {
    if (!blob) return;
    setStatus('sharing');
    try {
      const filename = `dday-${event.title.slice(0, 20).replace(/\s/g, '-')}.png`;
      const result = await shareOrDownload(blob, filename);
      setStatus('done');
      setTimeout(() => setStatus('idle'), result === 'shared' ? 1500 : 2500);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  }

  // Close on backdrop click
  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  const statusLabel = {
    idle: '저장 / 공유',
    sharing: '처리 중...',
    done: '완료!',
    error: '실패. 다시 시도',
  }[status];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-page"
      onClick={handleBackdrop}
    >
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="font-bold text-text">공유 카드</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-bg transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Preview */}
        <div className="p-4">
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-bg flex items-center justify-center">
            {loading && (
              <span className="text-sm text-text-muted">카드 생성 중...</span>
            )}
            {!loading && previewUrl && (
              <img src={previewUrl} alt="공유 카드 미리보기" className="w-full h-full object-cover" />
            )}
            {!loading && !previewUrl && (
              <span className="text-sm text-error">카드를 생성하지 못했습니다.</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 pb-5 flex flex-col gap-3">
          <button
            onClick={handleShare}
            disabled={loading || !blob || status === 'sharing'}
            className="w-full min-h-12 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-dark transition-all duration-200 hover:scale-105 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {statusLabel}
          </button>
          <p className="text-xs text-center text-text-muted">
            모바일에서는 SNS 공유, PC에서는 PNG로 저장됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
