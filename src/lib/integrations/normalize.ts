/**
 * Shared types and normalization utilities for wearable device integrations.
 * All providers normalize their data to NormalizedSleepSession before storage.
 */

import type { SleepSession } from '@/lib/supabase/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HypnogramEntry {
  timestamp: string; // ISO 8601
  stage: 'deep' | 'light' | 'rem' | 'awake';
  durationSec: number;
}

export interface NormalizedSleepSession {
  source: 'oura' | 'fitbit' | 'whoop' | 'withings' | 'garmin' | 'apple_health' | 'manual';
  sourceSessionId: string | null;
  bedtimeStart: string; // ISO 8601
  bedtimeEnd: string;
  sleepOnset: string | null;
  wakeTime: string | null;
  totalDurationMin: number | null;
  sleepLatencyMin: number | null;
  deepMin: number | null;
  lightMin: number | null;
  remMin: number | null;
  awakeMin: number | null;
  efficiency: number | null; // 0-100
  sleepScore: number | null; // 0-100
  cyclesCompleted: number | null;
  avgHeartRate: number | null;
  minHeartRate: number | null;
  restingHeartRate: number | null;
  hrvRmssd: number | null;
  respiratoryRate: number | null;
  spo2: number | null;
  skinTempDelta: number | null;
  disturbanceCount: number | null;
  isNap: boolean;
  hypnogram: HypnogramEntry[] | null;
  rawData: Record<string, unknown> | null;
}

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

/**
 * Estimate number of sleep cycles from stage data.
 * A cycle ≈ light → deep → REM transition (~90 min avg).
 */
export function estimateCycles(
  deepMin: number | null,
  lightMin: number | null,
  remMin: number | null,
): number | null {
  if (deepMin == null || lightMin == null || remMin == null) return null;
  const totalSleepMin = deepMin + lightMin + remMin;
  if (totalSleepMin === 0) return null;
  // Average cycle is ~90 minutes
  return Math.round((totalSleepMin / 90) * 10) / 10;
}

/**
 * Convert a database SleepSession row back to NormalizedSleepSession.
 */
export function dbRowToNormalized(row: SleepSession): NormalizedSleepSession {
  return {
    source: row.source as NormalizedSleepSession['source'],
    sourceSessionId: row.source_session_id,
    bedtimeStart: row.bedtime_start,
    bedtimeEnd: row.bedtime_end,
    sleepOnset: row.sleep_onset,
    wakeTime: row.wake_time,
    totalDurationMin: row.total_duration_min,
    sleepLatencyMin: row.sleep_latency_min,
    deepMin: row.deep_min,
    lightMin: row.light_min,
    remMin: row.rem_min,
    awakeMin: row.awake_min,
    efficiency: row.efficiency,
    sleepScore: row.sleep_score,
    cyclesCompleted: row.cycles_completed,
    avgHeartRate: row.avg_heart_rate,
    minHeartRate: row.min_heart_rate,
    restingHeartRate: row.resting_heart_rate,
    hrvRmssd: row.hrv_rmssd,
    respiratoryRate: row.respiratory_rate,
    spo2: row.spo2,
    skinTempDelta: row.skin_temp_delta,
    disturbanceCount: row.disturbance_count,
    isNap: row.is_nap,
    hypnogram: row.hypnogram as HypnogramEntry[] | null,
    rawData: row.raw_data,
  };
}

/**
 * Convert a NormalizedSleepSession to a database insert object.
 */
export function normalizedToDbInsert(
  userId: string,
  session: NormalizedSleepSession,
): Omit<SleepSession, 'id' | 'created_at'> {
  return {
    user_id: userId,
    source: session.source,
    source_session_id: session.sourceSessionId,
    bedtime_start: session.bedtimeStart,
    bedtime_end: session.bedtimeEnd,
    sleep_onset: session.sleepOnset,
    wake_time: session.wakeTime,
    total_duration_min: session.totalDurationMin,
    sleep_latency_min: session.sleepLatencyMin,
    deep_min: session.deepMin,
    light_min: session.lightMin,
    rem_min: session.remMin,
    awake_min: session.awakeMin,
    efficiency: session.efficiency,
    sleep_score: session.sleepScore,
    cycles_completed: session.cyclesCompleted,
    avg_heart_rate: session.avgHeartRate,
    min_heart_rate: session.minHeartRate,
    resting_heart_rate: session.restingHeartRate,
    hrv_rmssd: session.hrvRmssd,
    respiratory_rate: session.respiratoryRate,
    spo2: session.spo2,
    skin_temp_delta: session.skinTempDelta,
    disturbance_count: session.disturbanceCount,
    is_nap: session.isNap,
    hypnogram: session.hypnogram as Record<string, unknown>[] | null,
    raw_data: session.rawData,
  };
}
