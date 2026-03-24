import { createClient } from '@/lib/supabase/server';
import { DashboardClient } from './dashboard-client';
import type { SleepSession } from '@/lib/supabase/types';

export const metadata = {
  title: 'Dashboard — Sleep Stack',
  description: 'Your personal sleep dashboard with real device data and AI coaching.',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch last 30 days of sleep data server-side
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: sessions } = await supabase
    .from('sleep_sessions')
    .select('*')
    .eq('user_id', user.id)
    .gte('bedtime_start', thirtyDaysAgo.toISOString())
    .order('bedtime_start', { ascending: false });

  return <DashboardClient sessions={(sessions as SleepSession[]) ?? []} />;
}
