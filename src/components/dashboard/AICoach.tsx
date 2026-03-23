'use client';

import { useState, useCallback } from 'react';
import { MessageSquare, RefreshCw, Loader2, AlertTriangle, Sparkles, Lock } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';

interface AICoachProps {
  hasData: boolean;
}

export function AICoach({ hasData }: AICoachProps) {
  const { isPro } = useSubscription();
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(0);

  const maxFreePerWeek = 3;
  const isLimited = !isPro && usageCount >= maxFreePerWeek;

  const getCoaching = useCallback(async () => {
    if (isLimited) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/coach', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError('You\'ve reached your weekly limit. Upgrade to Pro for unlimited coaching.');
        } else {
          setError(data.error || 'Failed to get coaching');
        }
        return;
      }

      setResponse(data.content);
      setUsageCount((c) => c + 1);
    } catch {
      setError('Failed to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isLimited]);

  if (!hasData) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <MessageSquare className="w-10 h-10 text-on-surface-variant/30 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-on-surface font-headline mb-2">AI Sleep Coach</h3>
        <p className="text-sm text-on-surface-variant">
          Connect a device and sync at least 3 nights of data to unlock personalized coaching.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-on-surface font-headline">AI Sleep Coach</h3>
        </div>
        {!isPro && (
          <span className="text-xs text-on-surface-variant">
            {usageCount}/{maxFreePerWeek} free this week
          </span>
        )}
      </div>

      {/* Response area */}
      {response && (
        <div className="px-4 py-3 rounded-xl bg-surface-container-high text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
          {response}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#ff6b6b]/10 text-[#ff6b6b] text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        {isLimited ? (
          <a
            href="/pricing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-[#f9ca24] to-[#f0932b] text-[#0a0a1a] hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-4 h-4" />
            Upgrade for Unlimited
          </a>
        ) : (
          <button
            onClick={getCoaching}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-light transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : response ? (
              <RefreshCw className="w-4 h-4" />
            ) : (
              <MessageSquare className="w-4 h-4" />
            )}
            {loading ? 'Analyzing...' : response ? 'Get New Advice' : 'Get Sleep Advice'}
          </button>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
        <Lock className="w-3 h-3" />
        AI-generated insights. Not medical advice. Consult a healthcare professional for sleep disorders.
      </p>
    </div>
  );
}
