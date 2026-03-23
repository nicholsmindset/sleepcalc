'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Lock, Sparkles } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';

interface ProGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  feature?: string;
}

function DefaultUpgradePrompt({ feature }: { feature?: string }) {
  return (
    <div className="glass-card rounded-2xl p-8 text-center">
      <div className="w-14 h-14 rounded-full bg-[#f9ca24]/15 flex items-center justify-center mx-auto mb-4">
        <Lock className="w-7 h-7 text-[#f9ca24]" />
      </div>
      <h3 className="text-lg font-bold text-on-surface font-headline mb-2">
        Pro Feature
      </h3>
      <p className="text-sm text-on-surface-variant mb-6 max-w-sm mx-auto">
        {feature
          ? `${feature} is available on the Pro plan.`
          : 'This feature is available on the Pro plan.'}{' '}
        Upgrade to unlock unlimited AI coaching, 90-day history, and more.
      </p>
      <Link
        href="/pricing"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm bg-gradient-to-r from-[#f9ca24] to-[#f0932b] text-[#0a0a1a] hover:opacity-90 transition-opacity"
      >
        <Sparkles className="w-4 h-4" />
        Upgrade to Pro
      </Link>
    </div>
  );
}

export function ProGate({ children, fallback, feature }: ProGateProps) {
  const { isPro, loading } = useSubscription();

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-8 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isPro) {
    return <>{fallback ?? <DefaultUpgradePrompt feature={feature} />}</>;
  }

  return <>{children}</>;
}
