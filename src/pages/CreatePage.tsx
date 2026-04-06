import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createEvent } from '@/services/ddayService';
import { TEXT } from '@/constants/text';
import { RecurringToggle } from '@/components/RecurringToggle';
import { GridGlow } from '@/components/backgrounds/GridGlow';
import type { CreateDdayEventInput, Recurring } from '@/types';

const DEFAULT_COLOR = '#a78bfa';

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      {TEXT.colors.options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          title={opt.label}
          onClick={() => onChange(opt.value)}
          className="w-7 h-7 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none"
          style={{
            background: opt.value,
            boxShadow: value === opt.value ? `0 0 0 2px #080808, 0 0 0 3.5px ${opt.value}` : undefined,
          }}
        />
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "w-full rounded-xl px-4 py-3 text-sm border border-border bg-surface/60 backdrop-blur-sm text-text placeholder:text-text-muted transition-all duration-150 focus:outline-none focus:border-white/25";

export function CreatePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState<CreateDdayEventInput>({
    title: '',
    target_date: '',
    note: '',
    color: DEFAULT_COLOR,
    recurring: 'none',
  });

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const created = await createEvent({
        title: form.title.trim(),
        target_date: form.target_date,
        note: form.note?.trim() || undefined,
        color: form.color,
      });
      navigate(`/events/${created.id}`);
    } catch {
      setErrorMsg(TEXT.create.errorMessage);
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-bg animate-page">
      <GridGlow />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <Link to="/" className="text-xs text-text-muted hover:text-white transition-colors">
            ← Back
          </Link>
          <h1 className="text-2xl font-semibold text-text mt-4">{TEXT.create.pageTitle}</h1>
          <p className="text-sm text-text-muted mt-1">{TEXT.create.pageSubtitle}</p>
        </div>

        {errorMsg && (
          <div className="mb-6 px-4 py-3 rounded-xl text-xs bg-error-bg text-error border border-error/20">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Field label={TEXT.create.titleLabel}>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder={TEXT.create.titlePlaceholder}
              required
              maxLength={100}
              className={inputClass}
            />
          </Field>

          <Field label={TEXT.create.dateLabel}>
            <input
              type="date"
              name="target_date"
              value={form.target_date}
              onChange={handleChange}
              required
              className={inputClass}
              style={{ colorScheme: 'dark' }}
            />
          </Field>

          <Field label={TEXT.create.noteLabel}>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder={TEXT.create.notePlaceholder}
              rows={3}
              maxLength={300}
              className={`${inputClass} resize-none`}
            />
          </Field>

          <Field label={TEXT.create.colorLabel}>
            <ColorPicker
              value={form.color ?? DEFAULT_COLOR}
              onChange={(c) => setForm((prev) => ({ ...prev, color: c }))}
            />
          </Field>

          <div className="rounded-xl border border-border bg-surface/40 px-4 py-3">
            <RecurringToggle
              value={form.recurring ?? 'none'}
              onChange={(v: Recurring) => setForm((prev) => ({ ...prev, recurring: v }))}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 min-h-11 rounded-full text-sm font-semibold text-black bg-white hover:bg-white/90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? TEXT.create.submittingButton : TEXT.create.submitButton}
            </button>
            <Link
              to="/"
              className="flex-1 min-h-11 rounded-full text-sm font-semibold text-center flex items-center justify-center transition-all duration-200 border border-border text-text-muted hover:border-white/20 hover:text-white"
            >
              {TEXT.create.cancelButton}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
