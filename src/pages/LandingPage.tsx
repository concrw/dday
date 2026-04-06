import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDdayEvents } from '@/hooks/useDdayEvents';
import { EventCard } from '@/components/EventCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { TEXT } from '@/constants/text';
import type { DdayEvent } from '@/types';

type SortKey = 'date_asc' | 'date_desc' | 'created';

function getDayDiff(targetDate: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate); target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 text-center px-4">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary/10">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-text">
          {filtered ? '검색 결과가 없습니다' : TEXT.landing.emptyTitle}
        </h3>
        <p className="text-base text-text-secondary">
          {filtered ? '다른 검색어를 입력해 보세요.' : TEXT.landing.emptySubtitle}
        </p>
      </div>
      {!filtered && (
        <Link
          to="/create"
          className="inline-flex items-center justify-center min-h-12 px-8 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-dark transition-all duration-200 hover:scale-105 active:scale-[0.97] w-full max-w-xs"
        >
          {TEXT.landing.createCta}
        </Link>
      )}
    </div>
  );
}

function SortButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
        active ? 'bg-primary text-white' : 'bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary'
      }`}
    >
      {children}
    </button>
  );
}

function sortEvents(events: DdayEvent[], sort: SortKey): DdayEvent[] {
  const copy = [...events];
  if (sort === 'date_asc') return copy.sort((a, b) => getDayDiff(a.target_date) - getDayDiff(b.target_date));
  if (sort === 'date_desc') return copy.sort((a, b) => getDayDiff(b.target_date) - getDayDiff(a.target_date));
  return copy.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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
    <div className="min-h-screen bg-bg animate-page">
      <section className="py-16 px-4 bg-gradient-to-br from-primary to-primary-dark">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center gap-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">{TEXT.landing.heroTitle}</h1>
          <p className="text-lg text-white/80 max-w-md">{TEXT.landing.heroSubtitle}</p>
          <Link
            to="/create"
            className="inline-flex items-center justify-center min-h-12 px-8 rounded-xl text-base font-semibold text-white bg-accent hover:bg-accent-dark transition-all duration-200 hover:scale-105 active:scale-[0.97] mt-2"
          >
            {TEXT.landing.createCta}
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-6">
        {/* Search + Sort controls */}
        {!loading && !error && events.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-150"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <SortButton active={sort === 'date_asc'} onClick={() => setSort('date_asc')}>Nearest</SortButton>
              <SortButton active={sort === 'date_desc'} onClick={() => setSort('date_desc')}>Furthest</SortButton>
              <SortButton active={sort === 'created'} onClick={() => setSort('created')}>Recent</SortButton>
            </div>
          </div>
        )}

        {loading && <LoadingSpinner text={TEXT.landing.loadingText} />}

        {error && <p className="text-center py-8 text-error">{TEXT.landing.errorText}</p>}

        {!loading && !error && filtered.length === 0 && <EmptyState filtered={query.trim().length > 0} />}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((event, i) => (
              <div key={event.id} className="animate-card" style={{ animationDelay: `${i * 50}ms` }}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
