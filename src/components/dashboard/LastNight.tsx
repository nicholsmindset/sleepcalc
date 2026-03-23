'use client';

import type { SleepSession } from '@/lib/supabase/types';
import { SleepScoreRing } from './SleepScoreRing';
import { Hypnogram } from './Hypnogram';
import { Moon, Heart, Activity, Wind, Droplets } from 'lucide-react';
import { format } from 'date-fns';

interface LastNightProps {
  session: SleepSession | null;
}

function formatDuration(min: number | null): string {
  if (min == null) return '--';
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

function StageBar({ label, minutes, total, color }: { label: string; minutes: number | null; total: number; color: string }) {
  const pct = minutes != null && total > 0 ? (minutes / total) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-on-surface-variant">{label}</span>
        <span className="font-mono text-on-surface">{minutes != null ? `${minutes}m` : '--'}</span>
      </div>
      <div className="h-2 rounded-full bg-outline-variant/15 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function BiometricStat({ icon: Icon, label, value, unit }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number | null; unit: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
        <Icon className="w-4 h-4 text-on-surface-variant" />
      </div>
      <div>
        <p className="text-xs text-on-surface-variant">{label}</p>
        <p className="text-sm font-mono font-medium text-on-surface">
          {value != null ? `${value} ${unit}` : '--'}
        </p>
      </div>
    </div>
  );
}

export function LastNight({ session }: LastNightProps) {
  if (!session) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <Moon className="w-10 h-10 text-on-surface-variant/30 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-on-surface font-headline mb-2">No Sleep Data Yet</h3>
        <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
          Connect a wearable device or import Apple Health data to see your sleep analysis here.
        </p>
      </div>
    );
  }

  const totalStageMin = (session.deep_min ?? 0) + (session.light_min ?? 0) + (session.rem_min ?? 0) + (session.awake_min ?? 0);
  const bedtimeDate = new Date(session.bedtime_start);
  const wakeDate = new Date(session.bedtime_end);
  const hypnogramData = session.hypnogram as { timestamp: string; stage: 'deep' | 'light' | 'rem' | 'awake'; durationSec: number }[] | null;

  return (
    <div className="glass-card rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-on-surface font-headline">Last Night</h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {format(bedtimeDate, 'EEE, MMM d')} &middot; {format(bedtimeDate, 'h:mm a')} — {format(wakeDate, 'h:mm a')}
          </p>
        </div>
        <SleepScoreRing score={session.sleep_score} size={100} strokeWidth={8} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold font-mono text-on-surface">{formatDuration(session.total_duration_min)}</p>
          <p className="text-xs text-on-surface-variant">Duration</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold font-mono text-on-surface">
            {session.efficiency != null ? `${Math.round(session.efficiency)}%` : '--'}
          </p>
          <p className="text-xs text-on-surface-variant">Efficiency</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold font-mono text-on-surface">
            {session.cycles_completed != null ? session.cycles_completed : '--'}
          </p>
          <p className="text-xs text-on-surface-variant">Cycles</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-on-surface-variant mb-2">Sleep Stages</h4>
        <Hypnogram data={hypnogramData} />
      </div>

      <div className="space-y-3">
        <StageBar label="Deep" minutes={session.deep_min} total={totalStageMin} color="#6c5ce7" />
        <StageBar label="Light" minutes={session.light_min} total={totalStageMin} color="#a29bfe" />
        <StageBar label="REM" minutes={session.rem_min} total={totalStageMin} color="#46eae5" />
        <StageBar label="Awake" minutes={session.awake_min} total={totalStageMin} color="#fdcb6e" />
      </div>

      {(session.resting_heart_rate || session.hrv_rmssd || session.respiratory_rate || session.spo2) && (
        <div>
          <h4 className="text-sm font-medium text-on-surface-variant mb-3">Biometrics</h4>
          <div className="grid grid-cols-2 gap-3">
            <BiometricStat icon={Heart} label="Resting HR" value={session.resting_heart_rate} unit="bpm" />
            <BiometricStat icon={Activity} label="HRV" value={session.hrv_rmssd ? Math.round(session.hrv_rmssd) : null} unit="ms" />
            <BiometricStat icon={Wind} label="Resp. Rate" value={session.respiratory_rate ? Math.round(session.respiratory_rate) : null} unit="brpm" />
            <BiometricStat icon={Droplets} label="SpO2" value={session.spo2 ? Math.round(session.spo2) : null} unit="%" />
          </div>
        </div>
      )}
    </div>
  );
}
