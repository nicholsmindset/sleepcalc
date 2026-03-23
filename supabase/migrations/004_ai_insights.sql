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
