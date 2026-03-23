-- 002_device_connections.sql
-- OAuth token storage for connected wearable devices.
-- Access and refresh tokens are encrypted at the application level (AES-256)
-- before being stored in these columns.

CREATE TABLE public.device_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('oura', 'fitbit', 'whoop', 'withings', 'garmin')),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  scopes TEXT[],
  provider_user_id TEXT,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_sync_at TIMESTAMPTZ,
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, provider)
);

COMMENT ON TABLE public.device_connections IS 'Wearable device OAuth connections. Tokens are AES-256 encrypted at application level.';
COMMENT ON COLUMN public.device_connections.access_token IS 'AES-256 encrypted OAuth access token.';
COMMENT ON COLUMN public.device_connections.refresh_token IS 'AES-256 encrypted OAuth refresh token.';

CREATE INDEX idx_device_connections_user ON public.device_connections(user_id, provider);

-- Index for finding connections that need token refresh
CREATE INDEX idx_device_connections_expiry ON public.device_connections(token_expires_at)
  WHERE is_active = TRUE AND token_expires_at IS NOT NULL;
