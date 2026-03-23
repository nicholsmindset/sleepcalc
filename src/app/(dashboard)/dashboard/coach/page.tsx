import { createClient } from '@/lib/supabase/server';
import { CoachClient } from './coach-client';

export const metadata = {
  title: 'AI Sleep Coach — Drift Sleep',
  description: 'Get personalized AI-powered sleep coaching based on your real data.',
};

export default async function CoachPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Check if user has enough data
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count } = await supabase
    .from('sleep_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_nap', false)
    .gte('bedtime_start', thirtyDaysAgo.toISOString());

  // Fetch recent insights
  const { data: insights } = await supabase
    .from('ai_insights')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', 'coach')
    .order('generated_at', { ascending: false })
    .limit(5);

  return (
    <CoachClient
      hasData={(count ?? 0) >= 3}
      recentInsights={insights ?? []}
    />
  );
}
