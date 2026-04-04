import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchEvent, deleteEvent } from "@/services/ddayService";
import type { DdayEvent } from "@/services/ddayService";
import { useDayCount } from "@/hooks/useDayCount";
import { DEFAULT_COLOR } from "@/constants/colors";
import { TEXT } from "@/constants/text";

function EventDetail({ event }: { event: DdayEvent }) {
  const { days, label } = useDayCount(event.target_date);
  const color = event.color ?? DEFAULT_COLOR;
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const sublabel =
    days === 0
      ? TEXT.EVENT_TODAY
      : days > 0
      ? `${days} ${TEXT.EVENT_DAYS_LEFT}`
      : `${Math.abs(days)} ${TEXT.EVENT_DAYS_AGO}`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(TEXT.EVENT_DELETE_CONFIRM)) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteEvent(event.id);
      navigate("/");
    } catch {
      setDeleteError(TEXT.ERROR_DELETE);
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center py-16 px-4 gap-6">
      <p
        className="text-[clamp(80px,20vw,160px)] font-bold font-mono leading-none tracking-tight"
        style={{ color }}
      >
        {label}
      </p>

      <p className="text-lg text-[#555555]">{sublabel}</p>

      <div className="w-12 h-0.5 bg-gray-300" />

      <h1 className="text-3xl font-bold text-[#000000]">{event.title}</h1>

      <p className="text-[#555555]">
        {new Date(event.target_date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "UTC",
        })}
      </p>

      {event.note && (
        <p className="max-w-md text-[#555555] text-lg">{event.note}</p>
      )}

      {deleteError && (
        <p className="text-[#CC0000] text-sm font-medium">{deleteError}</p>
      )}

      <div className="flex gap-3 mt-4 w-full max-w-sm">
        <button
          onClick={handleShare}
          className="flex-1 border-2 font-bold py-3 rounded-xl transition-all duration-200 hover:scale-105 uppercase tracking-wide min-h-12"
          style={{
            borderColor: color,
            color: copied ? "white" : color,
            backgroundColor: copied ? color : "transparent",
          }}
        >
          {copied ? TEXT.EVENT_COPIED : TEXT.EVENT_SHARE}
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 bg-[#CC0000] hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all duration-200 hover:scale-105 uppercase tracking-wide min-h-12"
        >
          {deleting ? TEXT.LOADING : TEXT.EVENT_DELETE}
        </button>
      </div>
    </div>
  );
}

export default function Event() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<DdayEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchEvent(id)
      .then(setEvent)
      .catch(() => setError(TEXT.ERROR_NOT_FOUND))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <Navbar />

      <div className="max-w-2xl mx-auto">
        <div className="px-4 pt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-[#555555] hover:text-[#2A6FBB] transition-colors duration-200"
          >
            &larr; {TEXT.EVENT_BACK}
          </Link>
        </div>

        {loading && <LoadingSpinner />}

        {error && (
          <div className="flex flex-col items-center py-24 gap-4 text-center px-4">
            <p className="text-[#CC0000] font-medium">{error}</p>
            <Link
              to="/"
              className="bg-[#2A6FBB] hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200"
            >
              {TEXT.EVENT_BACK}
            </Link>
          </div>
        )}

        {!loading && !error && event && <EventDetail event={event} />}
      </div>
    </div>
  );
}
