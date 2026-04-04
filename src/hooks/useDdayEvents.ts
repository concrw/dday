import { useState, useEffect } from 'react';
import { fetchEvents } from '@/services/ddayService';
import type { DdayEvent } from '@/types';

interface UseDdayEventsResult {
  events: DdayEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDdayEvents(): UseDdayEventsResult {
  const [events, setEvents] = useState<DdayEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchEvents()
      .then((data) => {
        if (!cancelled) {
          setEvents(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  const refetch = () => setTick((t) => t + 1);

  return { events, loading, error, refetch };
}
