import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { createEvent } from "@/services/ddayService";
import { COLOR_PRESETS, DEFAULT_COLOR } from "@/constants/colors";
import { TEXT } from "@/constants/text";

export default function Create() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [note, setNote] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetDate) return;

    setSubmitting(true);
    setError(null);
    try {
      const event = await createEvent({
        title: title.trim(),
        target_date: targetDate,
        note: note.trim() || null,
        color,
      });
      navigate(`/event/${event.id}`);
    } catch {
      setError(TEXT.ERROR_CREATE);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <Navbar />

      <div className="bg-[#333333] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white">{TEXT.CREATE_TITLE}</h1>
          <p className="text-gray-400 mt-1 text-lg">{TEXT.CREATE_SUBTITLE}</p>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#000000]">
                {TEXT.FORM_TITLE_LABEL}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={TEXT.FORM_TITLE_PLACEHOLDER}
                required
                className="border border-gray-200 rounded-lg px-4 py-3 text-[#000000] placeholder-gray-400 focus:outline-none focus:border-[#2A6FBB] focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#000000]">
                {TEXT.FORM_DATE_LABEL}
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
                className="border border-gray-200 rounded-lg px-4 py-3 text-[#000000] focus:outline-none focus:border-[#2A6FBB] focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#000000]">
                {TEXT.FORM_NOTE_LABEL}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={TEXT.FORM_NOTE_PLACEHOLDER}
                rows={3}
                className="border border-gray-200 rounded-lg px-4 py-3 text-[#000000] placeholder-gray-400 focus:outline-none focus:border-[#2A6FBB] focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#000000]">
                {TEXT.FORM_COLOR_LABEL}
              </label>
              <div className="flex gap-3 flex-wrap">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    title={preset.label}
                    onClick={() => setColor(preset.value)}
                    className="w-9 h-9 rounded-full transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: preset.value,
                      outline:
                        color === preset.value
                          ? `3px solid ${preset.value}`
                          : "none",
                      outlineOffset: "2px",
                    }}
                  />
                ))}
              </div>
            </div>

            {error && (
              <p className="text-[#CC0000] text-sm font-medium">{error}</p>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#2A6FBB] hover:bg-blue-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all duration-200 hover:scale-105 uppercase tracking-wide min-h-12"
              >
                {submitting ? TEXT.LOADING : TEXT.FORM_SUBMIT}
              </button>
              <Link
                to="/"
                className="w-full text-center border border-gray-300 hover:border-gray-400 text-[#555555] font-semibold py-3 rounded-xl transition-all duration-200 hover:bg-gray-50"
              >
                {TEXT.FORM_CANCEL}
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
