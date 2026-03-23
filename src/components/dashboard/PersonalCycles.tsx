'use client';

import { useMemo } from 'react';
import type { SleepSession } from '@/lib/supabase/types';
import { analyzePersonalCycles } from '@/utils/personal-cycles';
import { ProGate } from '@/components/marketing/ProGate';
import { Fingerprint, BarChart3, Target } from 'lucide-react';

interface PersonalCyclesProps {
  sessions: SleepSession[];
}

function PersonalCyclesContent({ sessions }: PersonalCyclesProps) {
  const analysis = useMemo(() => analyzePersonalCycles(sessions), [sessions]);

  if (!analysis) {
    const sessionsWithHypnogram = sessions.filter(
      (s) => s.hypnogram && Array.isArray(s.hypnogram) && s.hypnogram.length > 0,
    ).length;

    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <Fingerprint className="w-10 h-10 text-on-surface-variant/30 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-on-surface font-headline mb-2">
          Personal Cycle Analysis
        </h3>
        <p className="text-sm text-on-surface-variant max-w-sm mx-auto mb-4">
          Need at least 14 nights with sleep stage data.
          You have <span className="font-mono font-bold text-primary">{sessionsWithHypnogram}</span> so far.
        </p>
        <div className="h-2 rounded-full bg-outline-variant/15 max-w-xs mx-auto overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${Math.min((sessionsWithHypnogram / 14) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-on-surface-variant/60 mt-2">
          {14 - sessionsWithHypnogram > 0
            ? `${14 - sessionsWithHypnogram} more nights needed`
            : 'Almost there!'}
        </p>
      </div>
    );
  }

  const standardCycle = 90;
  const avgCycle = analysis.avgCycleDurationMin;
  const diff = Math.round(avgCycle - standardCycle);
  const optimalCycles = 5;
  const optimalDuration = Math.round(avgCycle * optimalCycles);

  return (
    <div className="glass-card rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Fingerprint className="w-5 h-5 text-[#f9ca24]" />
        <h3 className="text-lg font-bold text-on-surface font-headline">Your Sleep Cycles</h3>
        <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-[#f9ca24] to-[#f0932b] text-[#0a0a1a]">
          PRO
        </span>
      </div>

      <div className="text-center py-4">
        <p className="text-4xl font-bold font-mono text-on-surface">
          {Math.round(avgCycle)}
          <span className="text-lg text-on-surface-variant ml-1">min</span>
        </p>
        <p className="text-sm text-on-surface-variant mt-1">
          Your average cycle length
          {diff !== 0 && (
            <span className={diff > 0 ? 'text-[#46eae5]' : 'text-[#fdcb6e]'}>
              {' '}({diff > 0 ? '+' : ''}{diff} min vs 90 min standard)
            </span>
          )}
        </p>
      </div>

      {analysis.cyclesByPosition.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-on-surface-variant" />
            <h4 className="text-sm font-medium text-on-surface-variant">Cycle Duration by Position</h4>
          </div>
          <div className="flex gap-2">
            {analysis.cyclesByPosition.map((cycle) => (
              <div key={cycle.position} className="flex-1 text-center">
                <div
                  className="mx-auto rounded-lg mb-1.5 transition-all"
                  style={{
                    height: `${Math.max((cycle.avgDurationMin / 120) * 80, 20)}px`,
                    width: '100%',
                    maxWidth: '48px',
                    backgroundColor: `rgba(108, 92, 231, ${0.2 + (cycle.avgDurationMin / 120) * 0.4})`,
                  }}
                />
                <p className="text-xs font-mono font-medium text-on-surface">{Math.round(cycle.avgDurationMin)}m</p>
                <p className="text-[10px] text-on-surface-variant">Cycle {cycle.position}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#46eae5]/10 border border-[#46eae5]/20">
        <Target className="w-5 h-5 text-[#46eae5] shrink-0" />
        <div>
          <p className="text-sm font-medium text-on-surface">
            Optimal sleep: {Math.floor(optimalDuration / 60)}h {optimalDuration % 60}m
          </p>
          <p className="text-xs text-on-surface-variant">
            {optimalCycles} cycles x {Math.round(avgCycle)} min
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-on-surface-variant">
        <span>Based on {analysis.nightsAnalyzed} nights</span>
        <span className="flex items-center gap-1.5">
          Confidence:
          <span className={
            analysis.confidence === 'high' ? 'text-[#46eae5]' :
            analysis.confidence === 'medium' ? 'text-[#fdcb6e]' :
            'text-[#ff6b6b]'
          }>
            {analysis.confidence}
          </span>
        </span>
      </div>
    </div>
  );
}

export function PersonalCycles({ sessions }: PersonalCyclesProps) {
  return (
    <ProGate feature="Personal Sleep Cycle Analysis">
      <PersonalCyclesContent sessions={sessions} />
    </ProGate>
  );
}
