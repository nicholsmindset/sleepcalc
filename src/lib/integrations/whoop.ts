/**
 * WHOOP API v2 integration.
 * Docs: https://developer.whoop.com/api
 * All durations in milliseconds.
 */

import type { NormalizedSleepSession } from './normalize';
import { estimateCycles } from './normalize';

const WHOOP_API = 'https://api.prod.whoop.com/developer/v2';

// ---------------------------------------------------------------------------
// Types (WHOOP API response shapes)
// ---------------------------------------------------------------------------

interface WhoopStageSummary {
  total_in_bed_time_milli: number;
  total_awake_time_milli: number;
  total_no_data_time_milli: number;
  total_light_sleep_time_milli: number;
  total_slow_wave_sleep_time_milli: number; // deep
  total_rem_sleep_time_milli: number;
  sleep_cycle_count: number;
  disturbance_count: number;
}

interface WhoopSleepScore {
  stage_summary: WhoopStageSummary;
  sleep_needed: {
    baseline_milli: number;
    need_from_sleep_debt_milli: number;
    need_from_recent_strain_milli: number;
    need_from_recent_nap_milli: number;
  };
  respiratory_rate: number | null;
  sleep_performance_percentage: number | null; // 0-100
  sleep_consistency_percentage: number | null;
  sleep_efficiency_percentage: number | null;
}

interface WhoopSleep {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  start: string; // ISO 8601
  end: string;
  timezone_offset: string;
  nap: boolean;
  score_state: 'SCORED' | 'PENDING_SCORE' | 'UNSCORABLE';
  score: WhoopSleepScore | null;
}

interface WhoopSleepResponse {
  records: WhoopSleep[];
  next_token: string | null;
}

interface WhoopRecovery {
  cycle_id: number;
  sleep_id: number;
  user_id: number;
  score: {
    user_calibrating: boolean;
    recovery_score: number; // 0-100
    resting_heart_rate: number;
    hrv_rmssd_milli: number; // in milliseconds
    spo2_percentage: number | null;
    skin_temp_celsius: number | null;
  } | null;
}

interface WhoopRecoveryResponse {
  records: WhoopRecovery[];
  next_token: string | null;
}

// ---------------------------------------------------------------------------
// Fetch functions
// ---------------------------------------------------------------------------

export async function fetchWhoopSleep(
  accessToken: string,
  startDate: string,
  endDate: string,
): Promise<WhoopSleep[]> {
  const params = new URLSearchParams({
    start: `${startDate}T00:00:00.000Z`,
    end: `${endDate}T23:59:59.999Z`,
    limit: '25',
  });

  const res = await fetch(`${WHOOP_API}/activity/sleep?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WHOOP API error ${res.status}: ${text}`);
  }

  const data: WhoopSleepResponse = await res.json();
  return data.records;
}

export async function fetchWhoopRecovery(
  accessToken: string,
  startDate: string,
  endDate: string,
): Promise<WhoopRecovery[]> {
  const params = new URLSearchParams({
    start: `${startDate}T00:00:00.000Z`,
    end: `${endDate}T23:59:59.999Z`,
    limit: '25',
  });

  const res = await fetch(`${WHOOP_API}/recovery?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WHOOP recovery API error ${res.status}: ${text}`);
  }

  const data: WhoopRecoveryResponse = await res.json();
  return data.records;
}

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

function msToMin(ms: number): number {
  return Math.round(ms / 60000);
}

export function normalizeWhoopSleep(
  sleepRecords: WhoopSleep[],
  recoveryRecords: WhoopRecovery[] = [],
): NormalizedSleepSession[] {
  // Build a lookup map from sleep_id to recovery
  const recoveryBySleepId = new Map<number, WhoopRecovery>();
  for (const r of recoveryRecords) {
    recoveryBySleepId.set(r.sleep_id, r);
  }

  return sleepRecords
    .filter((s) => s.score_state === 'SCORED' && s.score != null)
    .map((s) => {
      const score = s.score!;
      const stages = score.stage_summary;
      const recovery = recoveryBySleepId.get(s.id);

      const deepMin = msToMin(stages.total_slow_wave_sleep_time_milli);
      const lightMin = msToMin(stages.total_light_sleep_time_milli);
      const remMin = msToMin(stages.total_rem_sleep_time_milli);
      const awakeMin = msToMin(stages.total_awake_time_milli);
      const totalSleepMin = deepMin + lightMin + remMin;

      return {
        source: 'whoop' as const,
        sourceSessionId: String(s.id),
        bedtimeStart: s.start,
        bedtimeEnd: s.end,
        sleepOnset: null, // WHOOP doesn't provide latency separately
        wakeTime: s.end,
        totalDurationMin: totalSleepMin,
        sleepLatencyMin: null,
        deepMin,
        lightMin,
        remMin,
        awakeMin,
        efficiency: score.sleep_efficiency_percentage,
        sleepScore: score.sleep_performance_percentage,
        cyclesCompleted: stages.sleep_cycle_count || estimateCycles(deepMin, lightMin, remMin),
        avgHeartRate: null,
        minHeartRate: null,
        restingHeartRate: recovery?.score?.resting_heart_rate ?? null,
        hrvRmssd: recovery?.score?.hrv_rmssd_milli != null
          ? Math.round(recovery.score.hrv_rmssd_milli * 100) / 100
          : null,
        respiratoryRate: score.respiratory_rate,
        spo2: recovery?.score?.spo2_percentage ?? null,
        skinTempDelta: recovery?.score?.skin_temp_celsius ?? null,
        disturbanceCount: stages.disturbance_count,
        isNap: s.nap,
        hypnogram: null, // WHOOP doesn't expose granular hypnogram via API
        rawData: { sleep: s, recovery: recovery ?? null } as unknown as Record<string, unknown>,
      };
    });
}

// ---------------------------------------------------------------------------
// Token refresh
// ---------------------------------------------------------------------------

export async function refreshWhoopToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const clientId = process.env.WHOOP_CLIENT_ID!;
  const clientSecret = process.env.WHOOP_CLIENT_SECRET!;

  const res = await fetch('https://api.prod.whoop.com/oauth/oauth2/token', {
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
    throw new Error(`WHOOP token refresh failed ${res.status}: ${text}`);
  }

  return res.json();
}
