/**
 * POST /api/upload/apple-health
 * Receives normalized Apple Health sleep sessions from client-side parsing
 * and stores them in the database.
 *
 * The actual XML parsing happens client-side (apple-health.ts).
 * This route just receives the normalized data and upserts it.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import type { NormalizedSleepSession } from '@/lib/integrations/normalize';
import { normalizedToDbInsert } from '@/lib/integrations/normalize';

function getAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(request: NextRequest) {
  // Verify user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check subscription tier for upload limits
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  const isPro = profile?.subscription_tier === 'pro';

  // Parse request body
  let sessions: NormalizedSleepSession[];
  try {
    const body = await request.json();
    sessions = body.sessions;

    if (!Array.isArray(sessions) || sessions.length === 0) {
      return NextResponse.json({ error: 'No sessions provided' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Free users: limit to latest 7 days of data
  if (!isPro) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    sessions = sessions.filter((s) => s.bedtimeStart >= sevenDaysAgo);
  }

  // Limit batch size
  const MAX_SESSIONS = isPro ? 500 : 50;
  if (sessions.length > MAX_SESSIONS) {
    sessions = sessions.slice(-MAX_SESSIONS); // Keep most recent
  }

  try {
    const adminSupabase = getAdminSupabase();
    const inserts = sessions.map((s) =>
      normalizedToDbInsert(user.id, {
        ...s,
        source: 'apple_health',
      }),
    );

    const { error: insertError, count } = await adminSupabase
      .from('sleep_sessions')
      .upsert(inserts, {
        onConflict: 'user_id,source,source_session_id',
        count: 'exact',
      });

    if (insertError) {
      console.error('Apple Health upsert error:', insertError);
      return NextResponse.json({ error: 'Failed to store sleep data' }, { status: 500 });
    }

    return NextResponse.json({
      stored: count ?? sessions.length,
      total: sessions.length,
      limited: !isPro,
    });
  } catch (err) {
    console.error('Apple Health upload error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 },
    );
  }
}
