import { createClient } from '@/lib/supabase/server';
import { TrendsClient } from './trends-client';
import type { SleepSession } from '@/lib/supabase/types';

export const metadata = {
  title: 'Sleep Trends — Sleep Stack',
  description: 'Analyze your sleep trends over time.',
};

export default async function TrendsPage() {
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

  return <TrendsClient sessions={(sessions as SleepSession[]) ?? []} />;
}
