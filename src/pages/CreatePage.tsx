import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createEvent } from '@/services/ddayService';
import { TEXT } from '@/constants/text';
import { RecurringToggle } from '@/components/RecurringToggle';
import type { CreateDdayEventInput, Recurring } from '@/types';

const DEFAULT_COLOR = '#6366F1';

function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {TEXT.colors.options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          title={opt.label}
          onClick={() => onChange(opt.value)}
          className="w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none"
          style={{
            background: opt.value,
            boxShadow: value === opt.value ? `0 0 0 3px white, 0 0 0 5px ${opt.value}` : undefined,
          }}
        />
      ))}
    </div>
  );
}

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
    <div className="min-h-screen bg-bg animate-page">
      <section className="py-12 px-4 bg-gradient-to-br from-primary to-primary-dark">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{TEXT.create.pageTitle}</h1>
          <p className="text-white/75 mt-2 text-base">{TEXT.create.pageSubtitle}</p>
        </div>
      </section>

      <section className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-surface rounded-2xl shadow-card border border-border p-6">
          {errorMsg && (
            <div className="mb-5 px-4 py-3 rounded-lg text-sm bg-error-bg text-error">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text">
                {TEXT.create.titleLabel}
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder={TEXT.create.titlePlaceholder}
                required
                maxLength={100}
                className="w-full rounded-lg px-4 py-3 text-base border border-border bg-surface text-text transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text">
                {TEXT.create.dateLabel}
              </label>
              <input
                type="date"
                name="target_date"
                value={form.target_date}
                onChange={handleChange}
                required
                className="w-full rounded-lg px-4 py-3 text-base border border-border bg-surface text-text transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text">
                {TEXT.create.noteLabel}
              </label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder={TEXT.create.notePlaceholder}
                rows={3}
                maxLength={300}
                className="w-full rounded-lg px-4 py-3 text-base border border-border bg-surface text-text transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text">
                {TEXT.create.colorLabel}
              </label>
              <ColorPicker
                value={form.color ?? DEFAULT_COLOR}
                onChange={(c) => setForm((prev) => ({ ...prev, color: c }))}
              />
            </div>

            <div className="bg-bg rounded-xl px-4 py-3">
              <RecurringToggle
                value={form.recurring ?? 'none'}
                onChange={(v: Recurring) => setForm((prev) => ({ ...prev, recurring: v }))}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 min-h-12 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-dark transition-all duration-200 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? TEXT.create.submittingButton : TEXT.create.submitButton}
              </button>
              <Link
                to="/"
                className="flex-1 min-h-12 rounded-xl text-base font-semibold text-center flex items-center justify-center transition-all duration-200 hover:scale-105 border border-border text-text-secondary"
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
