/**
 * Oura Ring API v2 integration.
 * Docs: https://cloud.ouraring.com/v2/docs
 */

import type { NormalizedSleepSession, HypnogramEntry } from './normalize';
import { estimateCycles } from './normalize';

const OURA_API = 'https://api.ouraring.com/v2';

// ---------------------------------------------------------------------------
// Types (Oura API response shapes)
// ---------------------------------------------------------------------------

interface OuraSleepPeriod {
  id: string;
  day: string;
  bedtime_start: string;
  bedtime_end: string;
  type: 'long_sleep' | 'late_nap' | 'rest' | 'sleep';
  total_sleep_duration: number | null; // seconds
  awake_time: number | null; // seconds
  deep_sleep_duration: number | null; // seconds
  light_sleep_duration: number | null; // seconds
  rem_sleep_duration: number | null; // seconds
  latency: number | null; // seconds
  efficiency: number | null; // 0-100
  time_in_bed: number | null; // seconds
  average_heart_rate: number | null;
  lowest_heart_rate: number | null;
  average_hrv: number | null;
  average_breath: number | null;
  sleep_score_total: number | null;
  hypnogram_5min: string | null; // "1" deep, "2" light, "3" REM, "4" awake
  readiness_score_delta: number | null;
}

interface OuraSleepResponse {
  data: OuraSleepPeriod[];
  next_token: string | null;
}

// ---------------------------------------------------------------------------
// Fetch functions
// ---------------------------------------------------------------------------

export async function fetchOuraSleep(
  accessToken: string,
  startDate: string,
  endDate: string,
): Promise<OuraSleepPeriod[]> {
  const url = `${OURA_API}/usercollection/sleep?start_date=${startDate}&end_date=${endDate}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Oura API error ${res.status}: ${text}`);
  }

  const data: OuraSleepResponse = await res.json();
  return data.data;
}

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

function parseHypnogram(
  encoded: string | null,
  bedtimeStart: string,
): HypnogramEntry[] | null {
  if (!encoded) return null;

  const stageMap: Record<string, HypnogramEntry['stage']> = {
    '1': 'deep',
    '2': 'light',
    '3': 'rem',
    '4': 'awake',
  };

  const entries: HypnogramEntry[] = [];
  const startMs = new Date(bedtimeStart).getTime();

  for (let i = 0; i < encoded.length; i++) {
    const char = encoded[i];
    const stage = stageMap[char];
    if (!stage) continue;

    entries.push({
      timestamp: new Date(startMs + i * 5 * 60 * 1000).toISOString(),
      stage,
      durationSec: 300, // 5 minutes per segment
    });
  }

  return entries.length > 0 ? entries : null;
}

function secToMin(sec: number | null): number | null {
  return sec != null ? Math.round(sec / 60) : null;
}

export function normalizeOuraSleep(periods: OuraSleepPeriod[]): NormalizedSleepSession[] {
  return periods.map((p) => {
    const deepMin = secToMin(p.deep_sleep_duration);
    const lightMin = secToMin(p.light_sleep_duration);
    const remMin = secToMin(p.rem_sleep_duration);

    return {
      source: 'oura' as const,
      sourceSessionId: p.id,
      bedtimeStart: p.bedtime_start,
      bedtimeEnd: p.bedtime_end,
      sleepOnset: p.latency != null
        ? new Date(new Date(p.bedtime_start).getTime() + p.latency * 1000).toISOString()
        : null,
      wakeTime: p.bedtime_end,
      totalDurationMin: secToMin(p.total_sleep_duration),
      sleepLatencyMin: secToMin(p.latency),
      deepMin,
      lightMin,
      remMin,
      awakeMin: secToMin(p.awake_time),
      efficiency: p.efficiency,
      sleepScore: p.sleep_score_total,
      cyclesCompleted: estimateCycles(deepMin, lightMin, remMin),
      avgHeartRate: p.average_heart_rate,
      minHeartRate: p.lowest_heart_rate,
      restingHeartRate: p.lowest_heart_rate,
      hrvRmssd: p.average_hrv,
      respiratoryRate: p.average_breath,
      spo2: null,
      skinTempDelta: null,
      disturbanceCount: null,
      isNap: p.type === 'late_nap' || p.type === 'rest',
      hypnogram: parseHypnogram(p.hypnogram_5min, p.bedtime_start),
      rawData: p as unknown as Record<string, unknown>,
    };
  });
}

// ---------------------------------------------------------------------------
// Token refresh
// ---------------------------------------------------------------------------

export async function refreshOuraToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const clientId = process.env.OURA_CLIENT_ID!;
  const clientSecret = process.env.OURA_CLIENT_SECRET!;

  const res = await fetch('https://api.ouraring.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Oura token refresh failed ${res.status}: ${text}`);
  }

  return res.json();
}
