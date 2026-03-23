/**
 * Personal sleep cycle analysis from real wearable device data.
 *
 * While the standard sleep cycle is quoted at 90 minutes, individual cycles
 * range from 70-120 minutes and shift across the night. This module analyzes
 * hypnogram data from devices like Oura, Fitbit, and WHOOP to determine a
 * user's actual personal cycle duration and per-position averages.
 *
 * Requires 14+ nights of hypnogram data for any result, and 45+ nights
 * for high confidence. This is a Pro-tier feature.
 *
 * All functions are pure — no side effects, no React imports.
 */

import type { SleepSession } from '@/lib/supabase/types';

/** Minimum number of sessions with hypnogram data required for analysis */
const MIN_SESSIONS = 14;

/** Threshold for medium confidence */
const MEDIUM_CONFIDENCE_THRESHOLD = 21;

/** Threshold for high confidence */
const HIGH_CONFIDENCE_THRESHOLD = 45;

/** Minimum valid cycle duration in minutes (reject outliers below this) */
const MIN_CYCLE_DURATION = 60;

/** Maximum valid cycle duration in minutes (reject outliers above this) */
const MAX_CYCLE_DURATION = 130;

export interface PersonalCycleProfile {
  /** Average sleep cycle duration across all analyzed nights */
  avgCycleDurationMin: number;
  /** Per-position cycle averages (first cycle, second cycle, etc.) */
  cyclesByPosition: { position: number; avgDurationMin: number }[];
  /** Confidence level based on data quantity */
  confidence: 'low' | 'medium' | 'high';
  /** Total nights successfully analyzed */
  nightsAnalyzed: number;
  /** Typical bedtimes derived from the data (sorted) */
  personalBedtimes: Date[];
  /** Typical wake times derived from the data (sorted) */
  personalWakeTimes: Date[];
}

/**
 * Known sleep stage identifiers across wearable platforms.
 * Normalized to a common set for cycle boundary detection.
 */
type NormalizedStage = 'awake' | 'light' | 'deep' | 'rem';

/**
 * Normalize a stage string from various device formats to our standard set.
 * Handles Oura ("deep", "light", "rem", "awake"), Fitbit ("wake", "light",
 * "deep", "rem"), WHOOP (numeric stages), and generic formats.
 */
function normalizeStage(raw: string | number): NormalizedStage | null {
  if (typeof raw === 'number') {
    // WHOOP-style numeric: 0=awake, 1=light, 2=deep, 3=rem
    const map: Record<number, NormalizedStage> = {
      0: 'awake',
      1: 'light',
      2: 'deep',
      3: 'rem',
    };
    return map[raw] ?? null;
  }

  const lower = raw.toLowerCase().trim();

  if (lower === 'awake' || lower === 'wake' || lower === 'restless') return 'awake';
  if (lower === 'light' || lower === 'n1' || lower === 'n2' || lower === 'nrem1' || lower === 'nrem2') return 'light';
  if (lower === 'deep' || lower === 'n3' || lower === 'sws' || lower === 'nrem3') return 'deep';
  if (lower === 'rem') return 'rem';

  return null;
}

/**
 * A single epoch from the hypnogram with a normalized stage and timestamp.
 */
interface HypnogramEpoch {
  timestamp: number; // Unix ms
  stage: NormalizedStage;
}

/**
 * Parse a hypnogram JSONB array into normalized epochs.
 * Expects objects with a timestamp (ISO string or unix ms) and a stage field.
 */
function parseHypnogram(raw: Record<string, unknown>[]): HypnogramEpoch[] {
  const epochs: HypnogramEpoch[] = [];

  for (const entry of raw) {
    const stage = normalizeStage(
      (entry.stage ?? entry.sleep_stage ?? entry.level ?? '') as string | number
    );
    if (!stage) continue;

    let timestamp: number;
    const ts = entry.timestamp ?? entry.time ?? entry.datetime ?? entry.start;
    if (typeof ts === 'number') {
      // If it looks like seconds rather than milliseconds, convert
      timestamp = ts < 1e12 ? ts * 1000 : ts;
    } else if (typeof ts === 'string') {
      timestamp = new Date(ts).getTime();
    } else {
      continue;
    }

    if (isNaN(timestamp)) continue;
    epochs.push({ timestamp, stage });
  }

  return epochs.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Detect cycle boundaries from a sequence of hypnogram epochs.
 *
 * A cycle boundary is defined as a transition from REM to a non-REM stage
 * (light or deep), which marks the beginning of a new cycle. The first
 * cycle starts at the first non-awake epoch.
 *
 * Returns an array of cycle durations in minutes.
 */
function detectCycleDurations(epochs: HypnogramEpoch[]): number[] {
  if (epochs.length < 10) return [];

  const durations: number[] = [];
  let cycleStartMs: number | null = null;
  let previousStage: NormalizedStage | null = null;

  for (const epoch of epochs) {
    // Skip leading awake periods
    if (cycleStartMs === null && epoch.stage === 'awake') continue;

    // Start first cycle at first sleep epoch
    if (cycleStartMs === null) {
      cycleStartMs = epoch.timestamp;
      previousStage = epoch.stage;
      continue;
    }

    // Detect cycle boundary: REM -> non-REM (light or deep)
    if (
      previousStage === 'rem' &&
      (epoch.stage === 'light' || epoch.stage === 'deep')
    ) {
      const durationMin = (epoch.timestamp - cycleStartMs) / 60_000;

      // Only accept physiologically reasonable cycle durations
      if (durationMin >= MIN_CYCLE_DURATION && durationMin <= MAX_CYCLE_DURATION) {
        durations.push(Math.round(durationMin * 10) / 10);
      }

      cycleStartMs = epoch.timestamp;
    }

    previousStage = epoch.stage;
  }

  return durations;
}

/**
 * Analyze personal sleep cycles from real device data.
 *
 * Processes hypnogram data from multiple nights to determine the user's
 * actual sleep cycle duration. Identifies cycle boundaries by detecting
 * REM-to-NREM transitions and computes overall and per-position averages.
 *
 * Requires at least 14 sessions with valid hypnogram data to produce
 * a result. Returns null if insufficient data is available.
 *
 * Confidence levels:
 * - low: 14-20 nights (preliminary estimate, may shift with more data)
 * - medium: 21-44 nights (reasonably stable estimate)
 * - high: 45+ nights (robust, stable estimate)
 *
 * @param sessions - Array of SleepSession records from the database
 * @returns Personal cycle profile, or null if insufficient data
 */
export function analyzePersonalCycles(
  sessions: SleepSession[]
): PersonalCycleProfile | null {
  // Filter to sessions that have hypnogram data and are not naps
  const validSessions = sessions.filter(
    (s) =>
      !s.is_nap &&
      s.hypnogram !== null &&
      Array.isArray(s.hypnogram) &&
      s.hypnogram.length > 0
  );

  if (validSessions.length < MIN_SESSIONS) return null;

  // Collect per-position cycle durations across all nights
  const positionBuckets: Map<number, number[]> = new Map();
  const allDurations: number[] = [];
  let nightsWithCycles = 0;

  const bedtimes: Date[] = [];
  const wakeTimes: Date[] = [];

  for (const session of validSessions) {
    const epochs = parseHypnogram(session.hypnogram as Record<string, unknown>[]);
    const cycleDurations = detectCycleDurations(epochs);

    if (cycleDurations.length === 0) continue;

    nightsWithCycles++;

    cycleDurations.forEach((dur, idx) => {
      const position = idx + 1;
      if (!positionBuckets.has(position)) {
        positionBuckets.set(position, []);
      }
      positionBuckets.get(position)!.push(dur);
      allDurations.push(dur);
    });

    // Extract bedtime and wake time
    bedtimes.push(new Date(session.bedtime_start));
    wakeTimes.push(new Date(session.bedtime_end));
  }

  if (nightsWithCycles < MIN_SESSIONS || allDurations.length === 0) return null;

  // Compute overall average
  const avgCycleDurationMin =
    Math.round((allDurations.reduce((a, b) => a + b, 0) / allDurations.length) * 10) / 10;

  // Compute per-position averages
  const cyclesByPosition = Array.from(positionBuckets.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([position, durations]) => ({
      position,
      avgDurationMin:
        Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10,
    }));

  // Determine confidence
  let confidence: PersonalCycleProfile['confidence'];
  if (nightsWithCycles >= HIGH_CONFIDENCE_THRESHOLD) {
    confidence = 'high';
  } else if (nightsWithCycles >= MEDIUM_CONFIDENCE_THRESHOLD) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  // Sort bedtimes and wake times for the typical window
  const sortedBedtimes = [...bedtimes].sort((a, b) => {
    // Compare by time-of-day only (handle midnight crossover)
    const aMin = (a.getHours() < 12 ? a.getHours() + 24 : a.getHours()) * 60 + a.getMinutes();
    const bMin = (b.getHours() < 12 ? b.getHours() + 24 : b.getHours()) * 60 + b.getMinutes();
    return aMin - bMin;
  });

  const sortedWakeTimes = [...wakeTimes].sort((a, b) => {
    const aMin = a.getHours() * 60 + a.getMinutes();
    const bMin = b.getHours() * 60 + b.getMinutes();
    return aMin - bMin;
  });

  return {
    avgCycleDurationMin,
    cyclesByPosition,
    confidence,
    nightsAnalyzed: nightsWithCycles,
    personalBedtimes: sortedBedtimes,
    personalWakeTimes: sortedWakeTimes,
  };
}
