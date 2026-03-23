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
