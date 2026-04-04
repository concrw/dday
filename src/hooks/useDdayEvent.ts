import { useState, useEffect } from 'react';
import { fetchEvent } from '@/services/ddayService';
import type { DdayEvent } from '@/types';

interface UseDdayEventResult {
  event: DdayEvent | null;
  loading: boolean;
  error: string | null;
}

export function useDdayEvent(id: string): UseDdayEventResult {
  const [event, setEvent] = useState<DdayEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchEvent(id)
      .then((data) => {
        if (!cancelled) {
          setEvent(data);
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
  }, [id]);

  return { event, loading, error };
}
