'use client';

import { useState, useCallback } from 'react';
import { MessageSquare, RefreshCw, Loader2, AlertTriangle, Lock } from 'lucide-react';

interface AICoachProps {
  hasData: boolean;
}

export function AICoach({ hasData }: AICoachProps) {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCoaching = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/coach', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to get coaching');
        return;
      }

      setResponse(data.content);
    } catch {
      setError('Failed to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

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
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-on-surface font-headline">AI Sleep Coach</h3>
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
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
        <Lock className="w-3 h-3" />
        AI-generated insights. Not medical advice. Consult a healthcare professional for sleep disorders.
      </p>
    </div>
  );
}
