'use client';

import type { SleepSession } from '@/lib/supabase/types';
import { Calculator, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface VsCalculatorProps {
  sessions: SleepSession[];
}

export function VsCalculator({ sessions }: VsCalculatorProps) {
  const recentSessions = sessions.filter((s) => !s.is_nap).slice(0, 7);
  if (recentSessions.length === 0) return null;

  const recommendedMin = 480; // 8 hours default
  const avgDuration = Math.round(
    recentSessions.reduce((sum, s) => sum + (s.total_duration_min ?? 0), 0) / recentSessions.length,
  );
  const diff = avgDuration - recommendedMin;
  const weeklyDebt = diff < 0 ? Math.abs(diff) * recentSessions.length : 0;

  const formatHM = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Calculator className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-on-surface font-headline">You vs Calculator</h3>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-on-surface-variant">Recommended</span>
            <span className="font-mono font-medium text-on-surface">{formatHM(recommendedMin)}</span>
          </div>
          <div className="h-3 rounded-full bg-outline-variant/15 overflow-hidden">
            <div className="h-full rounded-full bg-primary/40" style={{ width: '100%' }} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-on-surface-variant">Your Average</span>
            <span className="font-mono font-medium text-on-surface">{formatHM(avgDuration)}</span>
          </div>
          <div className="h-3 rounded-full bg-outline-variant/15 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min((avgDuration / recommendedMin) * 100, 100)}%`,
                backgroundColor: diff >= 0 ? '#46eae5' : diff > -30 ? '#fdcb6e' : '#ff6b6b',
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-high">
        {diff > 0 ? (
          <TrendingUp className="w-4 h-4 text-[#46eae5]" />
        ) : diff < 0 ? (
          <TrendingDown className="w-4 h-4 text-[#ff6b6b]" />
        ) : (
          <Minus className="w-4 h-4 text-on-surface-variant" />
        )}
        <span className="text-sm text-on-surface">
          {diff > 0
            ? `${formatHM(diff)} above recommended`
            : diff < 0
              ? `${formatHM(Math.abs(diff))} below recommended`
              : 'Right on target'}
        </span>
      </div>

      {weeklyDebt > 0 && (
        <div className="px-3 py-2 rounded-xl bg-[#ff6b6b]/10 border border-[#ff6b6b]/20">
          <p className="text-sm text-[#ff6b6b]">
            Weekly sleep debt: <span className="font-mono font-bold">{formatHM(weeklyDebt)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
