'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SleepSession } from '@/lib/supabase/types';

interface UseSleepDataReturn {
  sessions: SleepSession[];
  latest: SleepSession | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useSleepData(days: number = 30): UseSleepDataReturn {
  const [sessions, setSessions] = useState<SleepSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      const { data, error: fetchError } = await supabase
        .from('sleep_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('bedtime_start', since)
        .order('bedtime_start', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setSessions((data as SleepSession[]) ?? []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sleep data');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    latest: sessions[0] ?? null,
    loading,
    error,
    refresh: fetchSessions,
  };
}
