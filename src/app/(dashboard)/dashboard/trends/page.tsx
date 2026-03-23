import { createClient } from '@/lib/supabase/server';
import { TrendsClient } from './trends-client';
import type { SleepSession } from '@/lib/supabase/types';

export const metadata = {
  title: 'Sleep Trends — Drift Sleep',
  description: 'Analyze your sleep trends over time.',
};

export default async function TrendsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  const isPro = profile?.subscription_tier === 'pro';
  const daysBack = isPro ? 90 : 30;

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
