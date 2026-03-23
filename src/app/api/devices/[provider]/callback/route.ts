/**
 * GET /api/devices/[provider]/callback
 * Handles OAuth callback: exchanges code for tokens, encrypts and stores them.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PROVIDER_CONFIGS } from '@/lib/integrations/normalize';
import { encryptToken } from '@/lib/crypto';

const VALID_PROVIDERS = ['oura', 'fitbit', 'whoop'] as const;
type ValidProvider = (typeof VALID_PROVIDERS)[number];

function isValidProvider(p: string): p is ValidProvider {
  return VALID_PROVIDERS.includes(p as ValidProvider);
}

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;

  if (!isValidProvider(provider)) {
    return NextResponse.redirect(new URL('/dashboard/devices?error=invalid_provider', request.url));
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Handle provider-side errors
  if (error) {
    return NextResponse.redirect(
      new URL(`/dashboard/devices?error=${encodeURIComponent(error)}`, request.url),
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL('/dashboard/devices?error=missing_params', request.url));
  }

  // Verify CSRF state
  const storedState = request.cookies.get(`oauth_state_${provider}`)?.value;
  const userId = request.cookies.get(`oauth_user_${provider}`)?.value;

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(new URL('/dashboard/devices?error=invalid_state', request.url));
  }

  if (!userId) {
    return NextResponse.redirect(new URL('/dashboard/devices?error=no_user', request.url));
  }

  // Exchange code for tokens
  const config = PROVIDER_CONFIGS[provider];
  const clientId = process.env[config.clientIdEnv]!;
  const clientSecret = process.env[config.clientSecretEnv]!;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectUri = `${siteUrl}/api/devices/${provider}/callback`;

  try {
    const tokenRes = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(provider === 'fitbit'
          ? { Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}` }
          : {}),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        ...(provider !== 'fitbit' ? { client_id: clientId, client_secret: clientSecret } : {}),
      }),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error(`Token exchange failed for ${provider}:`, text);
      return NextResponse.redirect(
        new URL('/dashboard/devices?error=token_exchange_failed', request.url),
      );
    }

    const tokens = await tokenRes.json();
    const accessToken = tokens.access_token as string;
    const refreshToken = (tokens.refresh_token as string) || null;
    const expiresIn = tokens.expires_in as number | undefined;

    // Encrypt tokens before storage
    const encryptedAccess = encryptToken(accessToken);
    const encryptedRefresh = refreshToken ? encryptToken(refreshToken) : null;

    const tokenExpiresAt = expiresIn
      ? new Date(Date.now() + expiresIn * 1000).toISOString()
      : null;

    // Store in database (upsert — one connection per user per provider)
    const supabase = getAdminSupabase();
    const { error: dbError } = await supabase
      .from('device_connections')
      .upsert(
        {
          user_id: userId,
          provider,
          access_token: encryptedAccess,
          refresh_token: encryptedRefresh,
          scopes: config.scopes,
          provider_user_id: tokens.user_id ? String(tokens.user_id) : null,
          connected_at: new Date().toISOString(),
          last_sync_at: null,
          token_expires_at: tokenExpiresAt,
          is_active: true,
        },
        { onConflict: 'user_id,provider' },
      );

    if (dbError) {
      console.error(`DB error storing ${provider} connection:`, dbError);
      return NextResponse.redirect(
        new URL('/dashboard/devices?error=storage_failed', request.url),
      );
    }

    // Clean up state cookies
    const response = NextResponse.redirect(
      new URL(`/dashboard/devices?connected=${provider}`, request.url),
    );
    response.cookies.delete(`oauth_state_${provider}`);
    response.cookies.delete(`oauth_user_${provider}`);

    return response;
  } catch (err) {
    console.error(`OAuth callback error for ${provider}:`, err);
    return NextResponse.redirect(
      new URL('/dashboard/devices?error=callback_failed', request.url),
    );
  }
}
