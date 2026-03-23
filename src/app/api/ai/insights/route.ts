import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildScoreExplainerPrompt, SCORE_EXPLAINER_SYSTEM } from '@/lib/ai/prompts';
import { callOpenRouter } from '@/lib/ai/openrouter';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { type, sessionId } = body as { type?: string; sessionId?: string };

  if (type === 'score_explanation' && sessionId) {
    const { data: session } = await supabase
      .from('sleep_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (!session.sleep_score) {
      return NextResponse.json({ error: 'No sleep score for this session' }, { status: 400 });
    }

    const userMessage = buildScoreExplainerPrompt(
      session.sleep_score,
      session.total_duration_min,
      session.efficiency ? Number(session.efficiency) : null,
      session.deep_min,
      session.rem_min,
      session.awake_min,
    );

    try {
      const result = await callOpenRouter(
        [
          { role: 'system', content: SCORE_EXPLAINER_SYSTEM },
          { role: 'user', content: userMessage },
        ],
        300,
      );

      await supabase.from('ai_insights').insert({
        user_id: user.id,
        type: 'score_explanation',
        content: result.content,
        data_context: { sessionId, score: session.sleep_score },
        model_used: result.model,
        tokens_used: result.tokensUsed,
      });

      return NextResponse.json({ content: result.content });
    } catch (err) {
      console.error('AI insights error:', err);
      return NextResponse.json(
        { error: 'Failed to generate insight.' },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ error: 'Invalid insight type' }, { status: 400 });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: insights } = await supabase
    .from('ai_insights')
    .select('*')
    .eq('user_id', user.id)
    .order('generated_at', { ascending: false })
    .limit(20);

  return NextResponse.json({ insights: insights ?? [] });
}
