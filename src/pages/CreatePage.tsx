import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createEvent } from '@/services/ddayService';
import { TEXT } from '@/constants/text';
import type { CreateDdayEventInput } from '@/types';

const DEFAULT_COLOR = '#1a9aaa';

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

  const inputClass =
    'w-full rounded-lg px-4 py-3 text-base border transition-all duration-200 focus:outline-none focus:ring-2';
  const inputStyle = {
    borderColor: '#e0e0e0',
    color: '#333333',
    background: '#fff',
  };

  return (
    <div className="min-h-screen" style={{ background: '#f0f0f0' }}>
      <section
        className="py-12 px-4"
        style={{ background: 'linear-gradient(135deg, #1a9aaa 0%, #1a5276 100%)' }}
      >
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{TEXT.create.pageTitle}</h1>
          <p className="text-white/75 mt-2 text-base">{TEXT.create.pageSubtitle}</p>
        </div>
      </section>

      <section className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {errorMsg && (
            <div
              className="mb-5 px-4 py-3 rounded-lg text-sm"
              style={{ background: '#fdecea', color: '#e74c3c' }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold" style={{ color: '#333333' }}>
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
                className={inputClass}
                style={{ ...inputStyle, '--tw-ring-color': '#1a9aaa' } as React.CSSProperties}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold" style={{ color: '#333333' }}>
                {TEXT.create.dateLabel}
              </label>
              <input
                type="date"
                name="target_date"
                value={form.target_date}
                onChange={handleChange}
                required
                className={inputClass}
                style={{ ...inputStyle, '--tw-ring-color': '#1a9aaa' } as React.CSSProperties}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold" style={{ color: '#333333' }}>
                {TEXT.create.noteLabel}
              </label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder={TEXT.create.notePlaceholder}
                rows={3}
                maxLength={300}
                className={inputClass + ' resize-none'}
                style={{ ...inputStyle, '--tw-ring-color': '#1a9aaa' } as React.CSSProperties}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" style={{ color: '#333333' }}>
                {TEXT.create.colorLabel}
              </label>
              <ColorPicker
                value={form.color ?? DEFAULT_COLOR}
                onChange={(c) => setForm((prev) => ({ ...prev, color: c }))}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 min-h-12 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(to right, #1a9aaa, #1a5276)' }}
              >
                {submitting ? TEXT.create.submittingButton : TEXT.create.submitButton}
              </button>
              <Link
                to="/"
                className="flex-1 min-h-12 rounded-xl text-base font-semibold text-center flex items-center justify-center transition-all duration-200 hover:scale-105 border"
                style={{ borderColor: '#e0e0e0', color: '#666' }}
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
