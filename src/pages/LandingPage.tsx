import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDdayEvents } from '@/hooks/useDdayEvents';
import { EventCard } from '@/components/EventCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ParticleField } from '@/components/backgrounds/ParticleField';
import { TEXT } from '@/constants/text';
import type { DdayEvent } from '@/types';

type SortKey = 'date_asc' | 'date_desc' | 'created';

function getDayDiff(targetDate: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate); target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function sortEvents(events: DdayEvent[], sort: SortKey): DdayEvent[] {
  const copy = [...events];
  if (sort === 'date_asc') return copy.sort((a, b) => getDayDiff(a.target_date) - getDayDiff(b.target_date));
  if (sort === 'date_desc') return copy.sort((a, b) => getDayDiff(b.target_date) - getDayDiff(a.target_date));
  return copy.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-8 text-center px-4">
      <div className="flex flex-col gap-2">
        <p className="text-5xl font-num font-medium text-white/10 leading-none">D-0</p>
        <p className="text-sm text-text-muted">No events yet</p>
      </div>
      <Link
        to="/create"
        className="px-8 py-3 rounded-full text-sm font-semibold text-black bg-white hover:bg-white/90 transition-all duration-200"
      >
        {TEXT.landing.createCta}
      </Link>
    </div>
  );
}

function SortButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
        active
          ? 'bg-white text-black'
          : 'text-text-muted border border-border hover:border-white/20 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

export function LandingPage() {
  const { events, loading, error } = useDdayEvents();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('date_asc');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q ? events.filter((e) => e.title.toLowerCase().includes(q) || (e.note ?? '').toLowerCase().includes(q)) : events;
    return sortEvents(base, sort);
  }, [events, query, sort]);

  return (
    <div className="relative min-h-screen bg-bg animate-page">
      <ParticleField />

      <div className="relative z-10">
        {/* Controls */}
        {!loading && !error && events.length > 0 && (
          <div className="max-w-5xl mx-auto px-4 pt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full pl-8 pr-4 py-2 rounded-full border border-border bg-surface/60 backdrop-blur-sm text-text text-sm focus:outline-none focus:border-white/20 transition-all duration-150 placeholder:text-text-muted"
              />
            </div>
            <div className="flex gap-2 shrink-0 items-center">
              <SortButton active={sort === 'date_asc'} onClick={() => setSort('date_asc')}>Nearest</SortButton>
              <SortButton active={sort === 'date_desc'} onClick={() => setSort('date_desc')}>Furthest</SortButton>
              <SortButton active={sort === 'created'} onClick={() => setSort('created')}>Recent</SortButton>
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto px-4 py-6">
          {loading && <LoadingSpinner text={TEXT.landing.loadingText} />}
          {error && <p className="text-center py-8 text-error text-sm">{TEXT.landing.errorText}</p>}
          {!loading && !error && filtered.length === 0 && <EmptyState />}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((event, i) => (
                <div key={event.id} className="animate-card" style={{ animationDelay: `${i * 40}ms` }}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
