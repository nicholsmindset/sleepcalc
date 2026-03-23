/**
 * POST /api/sync/[provider]
 * Fetches latest sleep data from connected wearable, normalizes, and upserts.
 *
 * GET /api/sync/[provider]
 * Returns sync status for the provider.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { decryptToken, encryptToken } from '@/lib/crypto';
import { normalizedToDbInsert } from '@/lib/integrations/normalize';
import { fetchOuraSleep, normalizeOuraSleep, refreshOuraToken } from '@/lib/integrations/oura';
import { fetchFitbitSleep, normalizeFitbitSleep, refreshFitbitToken } from '@/lib/integrations/fitbit';
import { fetchWhoopSleep, fetchWhoopRecovery, normalizeWhoopSleep, refreshWhoopToken } from '@/lib/integrations/whoop';
import { format, subDays } from 'date-fns';

const VALID_PROVIDERS = ['oura', 'fitbit', 'whoop'] as const;
type ValidProvider = (typeof VALID_PROVIDERS)[number];

function isValidProvider(p: string): p is ValidProvider {
  return VALID_PROVIDERS.includes(p as ValidProvider);
}

function getAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/**
 * Check if token is expired and refresh if needed.
 * Returns the (possibly new) access token.
 */
async function getValidAccessToken(
  connection: { access_token: string; refresh_token: string | null; token_expires_at: string | null; id: string },
  provider: ValidProvider,
): Promise<string> {
  const accessToken = decryptToken(connection.access_token);

  // Check if token is expired (or will expire in next 5 minutes)
  if (connection.token_expires_at) {
    const expiresAt = new Date(connection.token_expires_at).getTime();
    const buffer = 5 * 60 * 1000; // 5 min buffer
    if (Date.now() + buffer < expiresAt) {
      return accessToken;
    }
  } else {
    // No expiry info — try using the token as-is
    return accessToken;
  }

  // Token expired — refresh it
  if (!connection.refresh_token) {
    throw new Error(`No refresh token available for ${provider}`);
  }

  const refreshTokenDecrypted = decryptToken(connection.refresh_token);

  const refreshFn = {
    oura: refreshOuraToken,
    fitbit: refreshFitbitToken,
    whoop: refreshWhoopToken,
  }[provider];

  const newTokens = await refreshFn(refreshTokenDecrypted);

  // Update tokens in database
  const supabase = getAdminSupabase();
  await supabase
    .from('device_connections')
    .update({
      access_token: encryptToken(newTokens.access_token),
      refresh_token: newTokens.refresh_token ? encryptToken(newTokens.refresh_token) : connection.refresh_token,
      token_expires_at: new Date(Date.now() + newTokens.expires_in * 1000).toISOString(),
    })
    .eq('id', connection.id);

  return newTokens.access_token;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;

  if (!isValidProvider(provider)) {
    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
  }

  // Verify user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get device connection
  const adminSupabase = getAdminSupabase();
  const { data: connection } = await adminSupabase
    .from('device_connections')
    .select('*')
    .eq('user_id', user.id)
    .eq('provider', provider)
    .eq('is_active', true)
    .single();

  if (!connection) {
    return NextResponse.json({ error: 'Device not connected' }, { status: 404 });
  }

  try {
    const accessToken = await getValidAccessToken(connection, provider);

    // Determine date range: 30 days for first sync, 7 days for subsequent
    const isFirstSync = !connection.last_sync_at;
    const daysBack = isFirstSync ? 30 : 7;
    const endDate = format(new Date(), 'yyyy-MM-dd');
    const startDate = format(subDays(new Date(), daysBack), 'yyyy-MM-dd');

    // Fetch and normalize data based on provider
    let normalized;
    switch (provider) {
      case 'oura': {
        const data = await fetchOuraSleep(accessToken, startDate, endDate);
        normalized = normalizeOuraSleep(data);
        break;
      }
      case 'fitbit': {
        const data = await fetchFitbitSleep(accessToken, startDate, endDate);
        normalized = normalizeFitbitSleep(data);
        break;
      }
      case 'whoop': {
        const [sleepData, recoveryData] = await Promise.all([
          fetchWhoopSleep(accessToken, startDate, endDate),
          fetchWhoopRecovery(accessToken, startDate, endDate),
        ]);
        normalized = normalizeWhoopSleep(sleepData, recoveryData);
        break;
      }
    }

    // Upsert sleep sessions
    if (normalized.length > 0) {
      const inserts = normalized.map((s) => normalizedToDbInsert(user.id, s));

      const { error: insertError } = await adminSupabase
        .from('sleep_sessions')
        .upsert(inserts, {
          onConflict: 'user_id,source,source_session_id',
        });

      if (insertError) {
        console.error('Sleep session upsert error:', insertError);
        return NextResponse.json({ error: 'Failed to store sleep data' }, { status: 500 });
      }
    }

    // Update last_sync_at
    await adminSupabase
      .from('device_connections')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', connection.id);

    return NextResponse.json({
      synced: normalized.length,
      provider,
      dateRange: { start: startDate, end: endDate },
    });
  } catch (err) {
    console.error(`Sync error for ${provider}:`, err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Sync failed' },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;

  if (!isValidProvider(provider)) {
    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: connection } = await supabase
    .from('device_connections')
    .select('provider, connected_at, last_sync_at, is_active')
    .eq('user_id', user.id)
    .eq('provider', provider)
    .single();

  if (!connection) {
    return NextResponse.json({ connected: false });
  }

  return NextResponse.json({
    connected: connection.is_active,
    provider: connection.provider,
    connectedAt: connection.connected_at,
    lastSyncAt: connection.last_sync_at,
  });
}
