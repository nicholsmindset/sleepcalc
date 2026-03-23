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
