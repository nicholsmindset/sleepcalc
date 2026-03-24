import { createClient } from '@/lib/supabase/server';
import { HistoryClient } from './history-client';
import type { SleepSession } from '@/lib/supabase/types';

export const metadata = {
  title: 'Sleep History — Drift Sleep',
  description: 'Browse your complete sleep history timeline.',
};

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const daysBack = 90;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysBack);

  const { data: sessions } = await supabase
    .from('sleep_sessions')
    .select('*')
    .eq('user_id', user.id)
    .gte('bedtime_start', cutoff.toISOString())
    .order('bedtime_start', { ascending: false });

  return (
    <HistoryClient
      sessions={(sessions as SleepSession[]) ?? []}
    />
  );
}
