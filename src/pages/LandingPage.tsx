import { Link } from 'react-router-dom';
import { useDdayEvents } from '@/hooks/useDdayEvents';
import { EventCard } from '@/components/EventCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { TEXT } from '@/constants/text';

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 text-center px-4">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary/10">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-text">
          {TEXT.landing.emptyTitle}
        </h3>
        <p className="text-base text-text-secondary">
          {TEXT.landing.emptySubtitle}
        </p>
      </div>
      <Link
        to="/create"
        className="inline-flex items-center justify-center min-h-12 px-8 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-dark transition-all duration-200 hover:scale-105 w-full max-w-xs"
      >
        {TEXT.landing.createCta}
      </Link>
    </div>
  );
}

export function LandingPage() {
  const { events, loading, error } = useDdayEvents();

  return (
    <div className="min-h-screen bg-bg">
      <section className="py-16 px-4 bg-gradient-to-br from-primary to-primary-dark">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center gap-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {TEXT.landing.heroTitle}
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            {TEXT.landing.heroSubtitle}
          </p>
          <Link
            to="/create"
            className="inline-flex items-center justify-center min-h-12 px-8 rounded-xl text-base font-semibold text-white bg-accent hover:bg-accent-dark transition-all duration-200 hover:scale-105 mt-2"
          >
            {TEXT.landing.createCta}
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10">
        {loading && <LoadingSpinner text={TEXT.landing.loadingText} />}

        {error && (
          <p className="text-center py-8 text-error">
            {TEXT.landing.errorText}
          </p>
        )}

        {!loading && !error && events.length === 0 && <EmptyState />}

        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
