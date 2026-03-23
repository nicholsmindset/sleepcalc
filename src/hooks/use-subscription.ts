'use client';

import { useUser } from './use-user';

interface UseSubscriptionReturn {
  isPro: boolean;
  tier: 'free' | 'pro';
  loading: boolean;
}

export function useSubscription(): UseSubscriptionReturn {
  const { profile, loading } = useUser();

  return {
    isPro: profile?.subscription_tier === 'pro',
    tier: profile?.subscription_tier ?? 'free',
    loading,
  };
}
