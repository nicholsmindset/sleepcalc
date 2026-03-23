import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { aggregateSleepData } from '@/lib/ai/coach';
import { buildCoachPrompt, SLEEP_COACH_SYSTEM } from '@/lib/ai/prompts';
import { callOpenRouter } from '@/lib/ai/openrouter';
import type { SleepSession } from '@/lib/supabase/types';

const FREE_WEEKLY_LIMIT = 3;

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check subscription tier
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  const isPro = profile?.subscription_tier === 'pro';

  // Rate limit free users: count AI coach insights this week
  if (!isPro) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { count } = await supabase
      .from('ai_insights')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('type', 'coach')
      .gte('generated_at', weekAgo.toISOString());

    if ((count ?? 0) >= FREE_WEEKLY_LIMIT) {
      return NextResponse.json(
        { error: 'Weekly limit reached. Upgrade to Pro for unlimited coaching.' },
        { status: 429 },
      );
    }
  }

  // Fetch recent sleep sessions (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: sessions } = await supabase
    .from('sleep_sessions')
    .select('*')
    .eq('user_id', user.id)
    .gte('bedtime_start', thirtyDaysAgo.toISOString())
    .order('bedtime_start', { ascending: false });

  if (!sessions || sessions.length < 3) {
    return NextResponse.json(
      { error: 'Need at least 3 nights of data for coaching.' },
      { status: 400 },
    );
  }

  // Aggregate and build prompt
  const aggregate = aggregateSleepData(sessions as SleepSession[]);
  const userMessage = buildCoachPrompt(aggregate);

  try {
    const result = await callOpenRouter(
      [
        { role: 'system', content: SLEEP_COACH_SYSTEM },
        { role: 'user', content: userMessage },
      ],
      500,
    );

    // Store insight
    await supabase.from('ai_insights').insert({
      user_id: user.id,
      type: 'coach',
      content: result.content,
      data_context: aggregate,
      model_used: result.model,
      tokens_used: result.tokensUsed,
    });

    return NextResponse.json({
      content: result.content,
      model: result.model,
    });
  } catch (err) {
    console.error('AI coach error:', err);
    return NextResponse.json(
      { error: 'Failed to generate coaching. Please try again.' },
      { status: 500 },
    );
  }
}
