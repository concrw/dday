import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmojiSelector from "../components/EmojiSelector";
import { insertCountdown } from "../services/countdowns";
import { TEXT } from "../constants/text";

const COLOR_SWATCHES = [
  { id: "violet", bg: "bg-violet-500" },
  { id: "rose",   bg: "bg-rose-500"   },
  { id: "sky",    bg: "bg-sky-500"    },
  { id: "amber",  bg: "bg-amber-500"  },
  { id: "emerald",bg: "bg-emerald-500"},
] as const;

type ColorId = (typeof COLOR_SWATCHES)[number]["id"];

function getOrCreateSessionId(): string {
  const key = "dday_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export default function Create() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [emoji, setEmoji] = useState("🎂");
  const [color, setColor] = useState<ColorId>("violet");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError(TEXT.ERROR_TITLE_REQUIRED);
      return;
    }
    if (!date || date <= today) {
      setError(TEXT.ERROR_DATE_FUTURE);
      return;
    }

    setSubmitting(true);
    try {
      await insertCountdown({
        title: title.trim(),
        date,
        emoji,
        color,
        share_token: crypto.randomUUID(),
        session_id: getOrCreateSessionId(),
      });
      navigate("/");
    } catch {
      setError(TEXT.ERROR_DB);
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-slate-900 rounded-2xl p-6 flex flex-col gap-5"
      >
        <h1 className="text-xl font-bold text-slate-100">{TEXT.CREATE_TITLE}</h1>

        {/* TitleInput */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-slate-400">{TEXT.TITLE_LABEL}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={TEXT.TITLE_PLACEHOLDER}
            className="bg-slate-800 border border-slate-700 focus:border-violet-500 text-slate-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-violet-500 transition-colors duration-150 placeholder:text-slate-500"
          />
        </div>

        {/* DatePicker */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-slate-400">{TEXT.DATE_LABEL}</label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-800 border border-slate-700 focus:border-violet-500 text-slate-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-violet-500 transition-colors duration-150"
          />
        </div>

        {/* EmojiPicker */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-slate-400">{TEXT.EMOJI_LABEL}</label>
          <EmojiSelector selected={emoji} onChange={setEmoji} />
        </div>

        {/* ColorPicker */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-slate-400">{TEXT.COLOR_LABEL}</label>
          <div className="flex gap-3">
            {COLOR_SWATCHES.map(({ id, bg }) => (
              <button
                key={id}
                type="button"
                onClick={() => setColor(id)}
                aria-label={id}
                aria-pressed={color === id}
                className={[
                  bg,
                  "w-7 h-7 rounded-full cursor-pointer ring-2 ring-offset-2 ring-offset-slate-900 transition-all duration-150",
                  color === id ? "ring-violet-400" : "ring-transparent",
                ].join(" ")}
              />
            ))}
          </div>
        </div>

        {/* ErrorBanner */}
        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 rounded-xl p-3 text-sm">
            {error}
          </div>
        )}

        {/* SubmitButton */}
        <button
          type="submit"
          disabled={submitting}
          className="bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl py-3 w-full disabled:opacity-50 transition-colors duration-150"
        >
          {submitting ? TEXT.SUBMITTING : TEXT.SUBMIT}
        </button>
      </form>
    </div>
  );
}
