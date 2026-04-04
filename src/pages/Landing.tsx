import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchEvents } from "@/services/ddayService";
import type { DdayEvent } from "@/services/ddayService";
import { TEXT } from "@/constants/text";

export default function Landing() {
  const [events, setEvents] = useState<DdayEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetchEvents()
      .then(setEvents)
      .catch(() => setError(TEXT.ERROR_LOAD))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <Navbar />

      <div className="bg-[#333333] py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white">{TEXT.LANDING_TITLE}</h1>
          <p className="text-gray-400 mt-1 text-lg">{TEXT.LANDING_SUBTITLE}</p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading && <LoadingSpinner />}

        {error && (
          <div className="flex flex-col items-center py-16 gap-4">
            <p className="text-[#CC0000] font-medium">{error}</p>
            <button
              onClick={load}
              className="bg-[#2A6FBB] hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
            >
              {TEXT.RETRY}
            </button>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="flex flex-col items-center py-24 gap-4 text-center">
            <div className="w-16 h-16 bg-[#2A6FBB] rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">D</span>
            </div>
            <h2 className="text-xl font-bold text-[#000000]">{TEXT.EMPTY_TITLE}</h2>
            <p className="text-[#555555]">{TEXT.EMPTY_SUBTITLE}</p>
            <Link
              to="/create"
              className="mt-2 bg-[#2A6FBB] hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-xl transition-all duration-200 hover:scale-105 uppercase tracking-wide"
            >
              {TEXT.EMPTY_CTA}
            </Link>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="flex flex-col gap-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
