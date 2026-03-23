/**
 * Sleep coaching logic — aggregates data and generates AI coaching responses.
 */

import type { SleepSession } from '@/lib/supabase/types';
import { format } from 'date-fns';

export interface SleepAggregate {
  avgDurationMin: number;
  avgEfficiency: number | null;
  avgDeepMin: number | null;
  avgRemMin: number | null;
  avgScore: number | null;
  nightsTracked: number;
  sleepDebtMin: number;
  bestNightScore: number | null;
  worstNightScore: number | null;
  avgBedtime: string | null;
  avgWakeTime: string | null;
}

const RECOMMENDED_SLEEP_MIN = 480; // 8 hours

export function aggregateSleepData(sessions: SleepSession[]): SleepAggregate {
  const nights = sessions.filter((s) => !s.is_nap);

  if (nights.length === 0) {
    return {
      avgDurationMin: 0,
      avgEfficiency: null,
      avgDeepMin: null,
      avgRemMin: null,
      avgScore: null,
      nightsTracked: 0,
      sleepDebtMin: 0,
      bestNightScore: null,
      worstNightScore: null,
      avgBedtime: null,
      avgWakeTime: null,
    };
  }

  const durations = nights.map((s) => s.total_duration_min ?? 0);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / nights.length;

  const efficiencies = nights.map((s) => s.efficiency).filter((e): e is number => e != null);
  const avgEfficiency = efficiencies.length > 0
    ? efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length
    : null;

  const deepMins = nights.map((s) => s.deep_min).filter((d): d is number => d != null);
  const avgDeep = deepMins.length > 0
    ? deepMins.reduce((a, b) => a + b, 0) / deepMins.length
    : null;

  const remMins = nights.map((s) => s.rem_min).filter((r): r is number => r != null);
  const avgRem = remMins.length > 0
    ? remMins.reduce((a, b) => a + b, 0) / remMins.length
    : null;

  const scores = nights.map((s) => s.sleep_score).filter((s): s is number => s != null);
  const avgScore = scores.length > 0
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : null;

  const sleepDebt = durations.reduce(
    (debt, dur) => debt + Math.max(0, RECOMMENDED_SLEEP_MIN - dur),
    0,
  );

  // Average bedtime/wake time
  const bedtimeHours = nights.map((s) => {
    const d = new Date(s.bedtime_start);
    let h = d.getHours() + d.getMinutes() / 60;
    if (h < 12) h += 24; // Normalize late-night times
    return h;
  });
  const avgBedtimeH = bedtimeHours.reduce((a, b) => a + b, 0) / nights.length;
  const normalizedBedtime = avgBedtimeH >= 24 ? avgBedtimeH - 24 : avgBedtimeH;
  const bedtimeDate = new Date();
  bedtimeDate.setHours(Math.floor(normalizedBedtime), Math.round((normalizedBedtime % 1) * 60), 0);

  const wakeHours = nights.map((s) => {
    const d = new Date(s.bedtime_end);
    return d.getHours() + d.getMinutes() / 60;
  });
  const avgWakeH = wakeHours.reduce((a, b) => a + b, 0) / nights.length;
  const wakeDate = new Date();
  wakeDate.setHours(Math.floor(avgWakeH), Math.round((avgWakeH % 1) * 60), 0);

  return {
    avgDurationMin: avgDuration,
    avgEfficiency,
    avgDeepMin: avgDeep,
    avgRemMin: avgRem,
    avgScore,
    nightsTracked: nights.length,
    sleepDebtMin: sleepDebt,
    bestNightScore: scores.length > 0 ? Math.max(...scores) : null,
    worstNightScore: scores.length > 0 ? Math.min(...scores) : null,
    avgBedtime: format(bedtimeDate, 'h:mm a'),
    avgWakeTime: format(wakeDate, 'h:mm a'),
  };
}
