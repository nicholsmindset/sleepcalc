/**
 * GET /api/devices/[provider]/connect
 * Generates OAuth authorization URL and redirects the user to the provider.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PROVIDER_CONFIGS } from '@/lib/integrations/normalize';
import { randomBytes } from 'crypto';

const VALID_PROVIDERS = ['oura', 'fitbit', 'whoop'] as const;
type ValidProvider = (typeof VALID_PROVIDERS)[number];

function isValidProvider(p: string): p is ValidProvider {
  return VALID_PROVIDERS.includes(p as ValidProvider);
}

export async function GET(
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

  const config = PROVIDER_CONFIGS[provider];
  const clientId = process.env[config.clientIdEnv];
  if (!clientId) {
    return NextResponse.json({ error: 'Provider not configured' }, { status: 500 });
  }

  // Generate state token for CSRF protection
  const state = randomBytes(32).toString('hex');

  // Store state in a cookie for verification on callback
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectUri = `${siteUrl}/api/devices/${provider}/callback`;

  const authUrl = new URL(config.authUrl);
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', config.scopes.join(' '));
  authUrl.searchParams.set('state', state);

  const response = NextResponse.redirect(authUrl.toString());

  // Set state cookie (httpOnly, secure, 10 min expiry)
  response.cookies.set(`oauth_state_${provider}`, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  });

  // Also store user ID in cookie for callback
  response.cookies.set(`oauth_user_${provider}`, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  });

  return response;
}
