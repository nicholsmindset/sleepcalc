-- =====================================
-- DRIFT SLEEP: Full Database Setup
-- Run this in Supabase SQL Editor
-- =====================================


-- ======== 001_profiles.sql ========
-- 001_profiles.sql
-- Profiles table extending Supabase auth.users with application-specific fields.

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  timezone TEXT DEFAULT 'UTC',
  age_years INTEGER CHECK (age_years IS NULL OR (age_years >= 0 AND age_years <= 150)),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth.users with sleep app preferences and subscription info.';
COMMENT ON COLUMN public.profiles.preferences IS 'User preferences JSON: e.g. {"default_calculator": "bedtime", "notifications": true}';
COMMENT ON COLUMN public.profiles.subscription_tier IS 'Current subscription tier: free or pro';

-- Auto-create a profile row when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generic updated_at trigger function (reused by other tables)
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Index for Stripe customer lookups (webhook processing)
CREATE INDEX idx_profiles_stripe_customer ON public.profiles(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;


-- ======== 002_device_connections.sql ========
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


-- ======== 003_sleep_sessions.sql ========
-- 003_sleep_sessions.sql
-- Normalized sleep session data from any wearable device or manual entry.
-- All device-specific data is normalized into this common schema via lib/integrations/normalize.ts.

CREATE TABLE public.sleep_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source TEXT NOT NULL,                    -- 'oura', 'fitbit', 'whoop', 'apple_health', 'manual'
  source_session_id TEXT,                  -- Provider's unique session ID for dedup
  bedtime_start TIMESTAMPTZ NOT NULL,      -- When user got into bed
  bedtime_end TIMESTAMPTZ NOT NULL,        -- When user got out of bed
  sleep_onset TIMESTAMPTZ,                 -- When user actually fell asleep
  wake_time TIMESTAMPTZ,                   -- Final wake time
  total_duration_min INTEGER,              -- Total sleep time in minutes (excluding awake)
  sleep_latency_min INTEGER,               -- Minutes to fall asleep
  deep_min INTEGER,                        -- Deep/N3 sleep minutes
  light_min INTEGER,                       -- Light/N1+N2 sleep minutes
  rem_min INTEGER,                         -- REM sleep minutes
  awake_min INTEGER,                       -- Awake minutes during sleep period
  efficiency NUMERIC(5,2),                 -- Sleep efficiency percentage (0-100)
  sleep_score INTEGER CHECK (sleep_score IS NULL OR (sleep_score >= 0 AND sleep_score <= 100)),
  cycles_completed NUMERIC(3,1),           -- Number of full sleep cycles
  avg_heart_rate INTEGER,
  min_heart_rate INTEGER,
  resting_heart_rate INTEGER,
  hrv_rmssd NUMERIC(6,2),                 -- Heart rate variability (ms)
  respiratory_rate NUMERIC(4,1),           -- Breaths per minute
  spo2 NUMERIC(5,2),                       -- Blood oxygen saturation percentage
  skin_temp_delta NUMERIC(4,2),            -- Skin temperature deviation from baseline (C)
  disturbance_count INTEGER,
  is_nap BOOLEAN DEFAULT FALSE,
  hypnogram JSONB,                         -- Array of {timestamp, stage} for visualization
  raw_data JSONB,                          -- Full provider API response for debugging
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, source, source_session_id)
);

COMMENT ON TABLE public.sleep_sessions IS 'Normalized sleep session data from all wearable sources and manual entry.';
COMMENT ON COLUMN public.sleep_sessions.hypnogram IS 'Sleep stage timeline: [{t: "2026-01-01T23:00:00Z", s: "deep"}, ...]';
COMMENT ON COLUMN public.sleep_sessions.raw_data IS 'Original provider API response stored for debugging and future re-processing.';

-- Primary query pattern: user's recent sleep sessions
CREATE INDEX idx_sleep_sessions_user_date ON public.sleep_sessions(user_id, bedtime_start DESC);

-- Filter by source device
CREATE INDEX idx_sleep_sessions_source ON public.sleep_sessions(user_id, source);

-- Nap filtering
CREATE INDEX idx_sleep_sessions_naps ON public.sleep_sessions(user_id, is_nap, bedtime_start DESC)
  WHERE is_nap = TRUE;

-- Constraint: bedtime_end must be after bedtime_start
ALTER TABLE public.sleep_sessions
  ADD CONSTRAINT chk_bedtime_order CHECK (bedtime_end > bedtime_start);

-- Constraint: reasonable duration (up to 24 hours)
ALTER TABLE public.sleep_sessions
  ADD CONSTRAINT chk_duration CHECK (
    total_duration_min IS NULL OR (total_duration_min >= 0 AND total_duration_min <= 1440)
  );


-- ======== 004_ai_insights.sql ========
-- 004_ai_insights.sql
-- AI-generated sleep coaching insights, weekly digests, and anomaly alerts.

CREATE TABLE public.ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('coach', 'weekly_digest', 'anomaly', 'score_explanation')),
  content TEXT NOT NULL,
  data_context JSONB,              -- Sleep data snapshot that generated this insight
  model_used TEXT,                 -- e.g. 'mistralai/mistral-7b-instruct' via OpenRouter
  tokens_used INTEGER,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.ai_insights IS 'AI-generated sleep insights from the coaching system and weekly digest emails.';
COMMENT ON COLUMN public.ai_insights.data_context IS 'Snapshot of the sleep data used to generate this insight for reproducibility.';

-- Primary query: latest insights by type for a user
CREATE INDEX idx_ai_insights_user_type ON public.ai_insights(user_id, type, generated_at DESC);

-- Cleanup: index for purging old insights (retention policy)
CREATE INDEX idx_ai_insights_generated ON public.ai_insights(generated_at);


-- ======== 005_subscriptions.sql ========
-- 005_subscriptions.sql
-- Stripe subscription tracking, synced via webhook handlers.

CREATE TABLE public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.subscriptions IS 'Stripe subscription records synced via webhook. Source of truth for Pro tier access.';

-- Reuse the updated_at trigger from 001_profiles.sql
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Lookup by user (check active subscription)
CREATE INDEX idx_subscriptions_user_status ON public.subscriptions(user_id, status);

-- Lookup by Stripe ID (webhook processing)
CREATE INDEX idx_subscriptions_stripe ON public.subscriptions(stripe_subscription_id);


-- ======== 006_rls_policies.sql ========
-- 006_rls_policies.sql
-- Row Level Security: users can only access their own data.

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- profiles
-- ============================================================
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Insert is handled by the on_auth_user_created trigger (SECURITY DEFINER)
-- Delete is not allowed from client side

-- ============================================================
-- device_connections
-- ============================================================
CREATE POLICY "Users can view own devices"
  ON public.device_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own devices"
  ON public.device_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own devices"
  ON public.device_connections FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own devices"
  ON public.device_connections FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- sleep_sessions
-- ============================================================
CREATE POLICY "Users can view own sleep sessions"
  ON public.sleep_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sleep sessions"
  ON public.sleep_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sleep sessions"
  ON public.sleep_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sleep sessions"
  ON public.sleep_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- ai_insights
-- ============================================================
CREATE POLICY "Users can view own insights"
  ON public.ai_insights FOR SELECT
  USING (auth.uid() = user_id);

-- Insert is done server-side via service role key (AI coaching endpoint)
-- No client-side insert/update/delete needed

-- ============================================================
-- subscriptions
-- ============================================================
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Insert/update is done server-side via Stripe webhook handler (service role key)
-- No client-side mutations needed

