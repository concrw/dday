import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchEvent, updateEvent } from '@/services/ddayService';
import { TEXT } from '@/constants/text';
import { RecurringToggle } from '@/components/RecurringToggle';
import type { DdayEvent, Recurring } from '@/types';

const DEFAULT_COLOR = '#6366F1';

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      {TEXT.colors.options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          title={opt.label}
          onClick={() => onChange(opt.value)}
          className="w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none"
          style={{
            background: opt.value,
            boxShadow: value === opt.value ? `0 0 0 3px white, 0 0 0 5px ${opt.value}` : undefined,
          }}
        />
      ))}
    </div>
  );
}

export function EditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<DdayEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', target_date: '', note: '', color: DEFAULT_COLOR, recurring: 'none' as Recurring });

  useEffect(() => {
    if (!id) return;
    fetchEvent(id)
      .then((e) => {
        setEvent(e);
        setForm({
          title: e.title,
          target_date: e.target_date,
          note: e.note ?? '',
          color: e.color ?? DEFAULT_COLOR,
          recurring: e.recurring ?? 'none',
        });
      })
      .catch(() => setErrorMsg('이벤트를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [id]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!event) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await updateEvent(event.id, {
        title: form.title.trim(),
        target_date: form.target_date,
        note: form.note?.trim() || undefined,
        color: form.color,
        recurring: form.recurring,
      });
      navigate(`/events/${event.id}`);
    } catch {
      setErrorMsg('수정에 실패했습니다. 다시 시도해 주세요.');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <span className="text-text-secondary text-sm">불러오는 중...</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4">
        <p className="text-error">이벤트를 찾을 수 없습니다.</p>
        <Link to="/" className="text-sm text-primary underline">홈으로</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg animate-page">
      <section className="py-12 px-4 bg-gradient-to-br from-primary to-primary-dark">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">이벤트 수정</h1>
          <p className="text-white/75 mt-2 text-base">이벤트 정보를 업데이트하세요.</p>
        </div>
      </section>

      <section className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-surface rounded-2xl shadow-card border border-border p-6">
          {errorMsg && (
            <div className="mb-5 px-4 py-3 rounded-lg text-sm bg-error-bg text-error">{errorMsg}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text">{TEXT.create.titleLabel}</label>
              <input
                type="text" name="title" value={form.title} onChange={handleChange}
                placeholder={TEXT.create.titlePlaceholder} required maxLength={100}
                className="w-full rounded-lg px-4 py-3 text-base border border-border bg-surface text-text transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text">{TEXT.create.dateLabel}</label>
              <input
                type="date" name="target_date" value={form.target_date} onChange={handleChange} required
                className="w-full rounded-lg px-4 py-3 text-base border border-border bg-surface text-text transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text">{TEXT.create.noteLabel}</label>
              <textarea
                name="note" value={form.note} onChange={handleChange}
                placeholder={TEXT.create.notePlaceholder} rows={3} maxLength={300}
                className="w-full rounded-lg px-4 py-3 text-base border border-border bg-surface text-text transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text">{TEXT.create.colorLabel}</label>
              <ColorPicker value={form.color} onChange={(c) => setForm((p) => ({ ...p, color: c }))} />
            </div>

            <div className="bg-bg rounded-xl px-4 py-3">
              <RecurringToggle
                value={form.recurring}
                onChange={(v: Recurring) => setForm((p) => ({ ...p, recurring: v }))}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit" disabled={submitting}
                className="flex-1 min-h-12 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-dark transition-all duration-200 hover:scale-105 active:scale-[0.97] disabled:opacity-60"
              >
                {submitting ? '저장 중...' : '저장'}
              </button>
              <Link
                to={`/events/${event.id}`}
                className="flex-1 min-h-12 rounded-xl text-base font-semibold text-center flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-[0.97] border border-border text-text-secondary"
              >
                {TEXT.create.cancelButton}
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
