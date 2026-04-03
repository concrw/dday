import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmojiSelector from "../components/EmojiSelector";

const LABELS = {
  back: "← Back",
  title: "Event Title",
  titlePlaceholder: "e.g. Birthday Party",
  date: "Target Date",
  emoji: "Pick an Emoji",
  submit: "Create Countdown",
  submitting: "Creating…",
  errorRequired: "Title and date are required.",
};

const TITLE_MAX = 60;
const TITLE_WARN = 50;

export default function Create() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [emoji, setEmoji] = useState("🎉");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) {
      setError(LABELS.errorRequired);
      return;
    }
    setError("");
    setSubmitting(true);
    // createCountdown will be wired here in a future task
    setTimeout(() => {
      setSubmitting(false);
      navigate("/");
    }, 500);
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-start justify-center px-4 py-8">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl p-6 flex flex-col gap-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-slate-400 text-sm w-fit hover:text-slate-50 transition-colors"
        >
          {LABELS.back}
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-slate-400 text-sm">{LABELS.title}</label>
            <input
              type="text"
              value={title}
              maxLength={TITLE_MAX}
              placeholder={LABELS.titlePlaceholder}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-800 border border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 rounded-xl p-3 w-full text-slate-50 outline-none transition-all duration-150"
            />
            <span
              className={[
                "text-xs text-right",
                title.length >= TITLE_WARN ? "text-amber-400" : "text-slate-500",
              ].join(" ")}
            >
              {title.length}/{TITLE_MAX}
            </span>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1">
            <label className="text-slate-400 text-sm">{LABELS.date}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-slate-800 border border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 rounded-xl p-3 w-full text-slate-50 outline-none transition-all duration-150"
            />
          </div>

          {/* Emoji */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-400 text-sm">{LABELS.emoji}</label>
            <EmojiSelector selected={emoji} onChange={setEmoji} />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm mt-1 animate-in fade-in duration-200">
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
          >
            {submitting ? LABELS.submitting : LABELS.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
