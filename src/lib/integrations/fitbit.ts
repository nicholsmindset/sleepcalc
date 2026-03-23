/**
 * Fitbit Web API integration.
 * Docs: https://dev.fitbit.com/build/reference/web-api/sleep/
 * Rate limit: 150 requests/hour per user.
 */

import type { NormalizedSleepSession, HypnogramEntry } from './normalize';
import { estimateCycles } from './normalize';

const FITBIT_API = 'https://api.fitbit.com';

// ---------------------------------------------------------------------------
// Types (Fitbit API response shapes)
// ---------------------------------------------------------------------------

interface FitbitSleepLevel {
  dateTime: string;
  level: string; // "deep" | "light" | "rem" | "wake" | "asleep" | "restless" | "awake"
  seconds: number;
}

interface FitbitSleepSummary {
  deep?: { count: number; minutes: number; thirtyDayAvgMinutes: number };
  light?: { count: number; minutes: number; thirtyDayAvgMinutes: number };
  rem?: { count: number; minutes: number; thirtyDayAvgMinutes: number };
  wake?: { count: number; minutes: number; thirtyDayAvgMinutes: number };
  // Classic format
  asleep?: { count: number; minutes: number };
  restless?: { count: number; minutes: number };
  awake?: { count: number; minutes: number };
}

interface FitbitSleepLog {
  logId: number;
  dateOfSleep: string;
  startTime: string;
  endTime: string;
  duration: number; // ms
  minutesToFallAsleep: number;
  minutesAsleep: number;
  minutesAwake: number;
  minutesAfterWakeup: number;
  timeInBed: number;
  efficiency: number;
  type: 'stages' | 'classic';
  mainSleep: boolean;
  levels: {
    data: FitbitSleepLevel[];
    summary: FitbitSleepSummary;
  };
}

interface FitbitSleepResponse {
  sleep: FitbitSleepLog[];
}

// ---------------------------------------------------------------------------
// Fetch functions
// ---------------------------------------------------------------------------

export async function fetchFitbitSleep(
  accessToken: string,
  startDate: string,
  endDate: string,
): Promise<FitbitSleepLog[]> {
  const url = `${FITBIT_API}/1.2/user/-/sleep/date/${startDate}/${endDate}.json`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fitbit API error ${res.status}: ${text}`);
  }

  const data: FitbitSleepResponse = await res.json();
  return data.sleep;
}

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

function parseFitbitHypnogram(levels: FitbitSleepLevel[], type: string): HypnogramEntry[] | null {
  if (!levels || levels.length === 0) return null;

  const stageMap: Record<string, HypnogramEntry['stage']> = {
    deep: 'deep',
    light: 'light',
    rem: 'rem',
    wake: 'awake',
    // Classic format mappings
    asleep: 'light',
    restless: 'awake',
    awake: 'awake',
  };

  return levels
    .map((l) => ({
      timestamp: new Date(l.dateTime).toISOString(),
      stage: stageMap[l.level] || ('light' as const),
      durationSec: l.seconds,
    }))
    .filter((e) => e.stage != null);
}

export function normalizeFitbitSleep(logs: FitbitSleepLog[]): NormalizedSleepSession[] {
  return logs.map((log) => {
    const summary = log.levels.summary;
    const isStages = log.type === 'stages';

    const deepMin = isStages ? (summary.deep?.minutes ?? null) : null;
    const lightMin = isStages ? (summary.light?.minutes ?? null) : (summary.asleep?.minutes ?? null);
    const remMin = isStages ? (summary.rem?.minutes ?? null) : null;
    const awakeMin = isStages
      ? (summary.wake?.minutes ?? null)
      : ((summary.restless?.minutes ?? 0) + (summary.awake?.minutes ?? 0)) || null;

    return {
      source: 'fitbit' as const,
      sourceSessionId: String(log.logId),
      bedtimeStart: new Date(log.startTime).toISOString(),
      bedtimeEnd: new Date(log.endTime).toISOString(),
      sleepOnset: log.minutesToFallAsleep > 0
        ? new Date(new Date(log.startTime).getTime() + log.minutesToFallAsleep * 60 * 1000).toISOString()
        : null,
      wakeTime: new Date(log.endTime).toISOString(),
      totalDurationMin: log.minutesAsleep,
      sleepLatencyMin: log.minutesToFallAsleep || null,
      deepMin,
      lightMin,
      remMin,
      awakeMin,
      efficiency: log.efficiency,
      sleepScore: null, // Fitbit doesn't provide a sleep score via API
      cyclesCompleted: estimateCycles(deepMin, lightMin, remMin),
      avgHeartRate: null, // Requires separate HR endpoint
      minHeartRate: null,
      restingHeartRate: null,
      hrvRmssd: null,
      respiratoryRate: null,
      spo2: null,
      skinTempDelta: null,
      disturbanceCount: null,
      isNap: !log.mainSleep,
      hypnogram: parseFitbitHypnogram(log.levels.data, log.type),
      rawData: log as unknown as Record<string, unknown>,
    };
  });
}

// ---------------------------------------------------------------------------
// Token refresh (8-hour expiry!)
// ---------------------------------------------------------------------------

export async function refreshFitbitToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const clientId = process.env.FITBIT_CLIENT_ID!;
  const clientSecret = process.env.FITBIT_CLIENT_SECRET!;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch(`${FITBIT_API}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fitbit token refresh failed ${res.status}: ${text}`);
  }

  return res.json();
}
