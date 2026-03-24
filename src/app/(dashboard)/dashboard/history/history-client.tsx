'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Clock, Moon, Zap, TrendingUp } from 'lucide-react';
import { SleepScoreRing } from '@/components/dashboard/SleepScoreRing';
import { Hypnogram } from '@/components/dashboard/Hypnogram';
import type { SleepSession } from '@/lib/supabase/types';

interface HistoryClientProps {
  sessions: SleepSession[];
}

export function HistoryClient({ sessions }: HistoryClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const nights = sessions.filter((s) => !s.is_nap);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-on-surface font-headline">Sleep History</h1>
        </div>
        <span className="text-sm text-on-surface-variant">
          {nights.length} nights (90 day window)
        </span>
      </div>

      {nights.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Moon className="w-10 h-10 text-on-surface-variant/30 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-on-surface font-headline mb-2">No Sleep Data</h3>
          <p className="text-sm text-on-surface-variant">
            Connect a device to start tracking your sleep history.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {nights.map((session) => {
            const isExpanded = expandedId === session.id;
            const date = new Date(session.bedtime_start);
            const durationH = Math.floor((session.total_duration_min ?? 0) / 60);
            const durationM = (session.total_duration_min ?? 0) % 60;

            return (
              <div key={session.id} className="glass-card rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : session.id)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-surface-container-high/50 transition-colors"
                >
                  <SleepScoreRing score={session.sleep_score ?? null} size={48} strokeWidth={4} />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface">
                      {format(date, 'EEEE, MMM d')}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {format(new Date(session.bedtime_start), 'h:mm a')} — {format(new Date(session.bedtime_end), 'h:mm a')}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-sm font-mono font-medium text-on-surface">
                        {durationH}h {durationM}m
                      </p>
                      <p className="text-xs text-on-surface-variant">Duration</p>
                    </div>
                    {session.efficiency != null && (
                      <div>
                        <p className="text-sm font-mono font-medium text-on-surface">
                          {Math.round(Number(session.efficiency))}%
                        </p>
                        <p className="text-xs text-on-surface-variant">Efficiency</p>
                      </div>
                    )}
                  </div>

                  <TrendingUp
                    className={`w-4 h-4 text-on-surface-variant transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4 border-t border-outline-variant/10 pt-4">
                    {/* Stage breakdown */}
                    <div className="grid grid-cols-4 gap-3">
                      {session.deep_min != null && (
                        <div className="text-center">
                          <p className="text-lg font-mono font-bold text-[#6c5ce7]">{session.deep_min}m</p>
                          <p className="text-xs text-on-surface-variant">Deep</p>
                        </div>
                      )}
                      {session.light_min != null && (
                        <div className="text-center">
                          <p className="text-lg font-mono font-bold text-[#a29bfe]">{session.light_min}m</p>
                          <p className="text-xs text-on-surface-variant">Light</p>
                        </div>
                      )}
                      {session.rem_min != null && (
                        <div className="text-center">
                          <p className="text-lg font-mono font-bold text-[#46eae5]">{session.rem_min}m</p>
                          <p className="text-xs text-on-surface-variant">REM</p>
                        </div>
                      )}
                      {session.awake_min != null && (
                        <div className="text-center">
                          <p className="text-lg font-mono font-bold text-[#fdcb6e]">{session.awake_min}m</p>
                          <p className="text-xs text-on-surface-variant">Awake</p>
                        </div>
                      )}
                    </div>

                    {/* Hypnogram */}
                    {session.hypnogram && Array.isArray(session.hypnogram) && session.hypnogram.length > 0 && (
                      <Hypnogram data={session.hypnogram as { timestamp: string; stage: 'deep' | 'light' | 'rem' | 'awake'; durationSec: number }[]} />
                    )}

                    {/* Biometrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {session.avg_heart_rate != null && (
                        <div className="px-3 py-2 rounded-xl bg-surface-container-high">
                          <p className="text-xs text-on-surface-variant">Avg HR</p>
                          <p className="text-sm font-mono font-medium text-on-surface">{session.avg_heart_rate} bpm</p>
                        </div>
                      )}
                      {session.hrv_rmssd != null && (
                        <div className="px-3 py-2 rounded-xl bg-surface-container-high">
                          <p className="text-xs text-on-surface-variant">HRV</p>
                          <p className="text-sm font-mono font-medium text-on-surface">{Math.round(Number(session.hrv_rmssd))} ms</p>
                        </div>
                      )}
                      {session.respiratory_rate != null && (
                        <div className="px-3 py-2 rounded-xl bg-surface-container-high">
                          <p className="text-xs text-on-surface-variant">Resp Rate</p>
                          <p className="text-sm font-mono font-medium text-on-surface">{Number(session.respiratory_rate).toFixed(1)}/min</p>
                        </div>
                      )}
                      {session.spo2 != null && (
                        <div className="px-3 py-2 rounded-xl bg-surface-container-high">
                          <p className="text-xs text-on-surface-variant">SpO2</p>
                          <p className="text-sm font-mono font-medium text-on-surface">{Number(session.spo2).toFixed(1)}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
