/**
 * Nap timing optimizer.
 *
 * Calculates optimal nap schedules based on nap type, current time, and the
 * user's planned bedtime. Warns when a nap would extend past the afternoon
 * cutoff and risk disrupting nighttime sleep.
 *
 * All functions are pure — no side effects, no React imports.
 */

/** Minutes it takes to fall asleep during a nap (sleep onset latency for naps) */
const NAP_LATENCY_MIN = 5;

/** Hour of day (24h) after which naps risk disrupting nighttime sleep */
const NAP_CUTOFF_HOUR = 15; // 3:00 PM

export type NapType = 'power' | 'recovery' | 'full_cycle';

export interface NapRecommendation {
  /** The nap type */
  type: NapType;
  /** Human-readable label */
  label: string;
  /** Total nap duration in minutes (including time to fall asleep) */
  durationMinutes: number;
  /** Recommended time to start the nap (lay down) */
  startTime: Date;
  /** Time to set the alarm */
  alarmTime: Date;
  /** Short explanation of this nap type */
  description: string;
  /** True if the nap ends after the 3 PM cutoff, which may hurt nighttime sleep */
  sleepImpactWarning: boolean;
}

/** Nap duration configurations (actual sleep time, not counting latency) */
const NAP_CONFIGS: Record<NapType, { sleepMinutes: number; label: string; description: string }> = {
  power: {
    sleepMinutes: 20,
    label: 'Power Nap',
    description:
      'A quick 20-minute nap in light sleep. Boosts alertness and motor performance without grogginess.',
  },
  recovery: {
    sleepMinutes: 60,
    label: 'Recovery Nap',
    description:
      'A 60-minute nap that reaches deep sleep. Improves memory consolidation and cognitive function, but may cause brief grogginess on waking.',
  },
  full_cycle: {
    sleepMinutes: 90,
    label: 'Full Cycle Nap',
    description:
      'A complete 90-minute sleep cycle through all stages. Wakes during light sleep to minimize grogginess. Best for significant sleep debt recovery.',
  },
};

/**
 * Calculate an optimal nap recommendation.
 *
 * The start time is set to the current time (nap now). The alarm time accounts
 * for the nap latency (time to fall asleep) plus the nap duration. A warning
 * is issued if the alarm time falls after the 3 PM cutoff, since late naps
 * can shift sleep onset and reduce nighttime sleep quality.
 *
 * @param currentTime - The current date/time (when the user starts the nap)
 * @param bedtimeTonight - The user's planned bedtime this evening
 * @param napType - power (20 min), recovery (60 min), or full_cycle (90 min)
 * @returns A complete nap recommendation with alarm time and warnings
 */
export function calculateNap(
  currentTime: Date,
  bedtimeTonight: Date,
  napType: NapType
): NapRecommendation {
  const config = NAP_CONFIGS[napType];
  const totalDuration = NAP_LATENCY_MIN + config.sleepMinutes;
  const startTime = new Date(currentTime.getTime());
  const alarmTime = new Date(startTime.getTime() + totalDuration * 60_000);

  // Determine if the nap end time falls after the afternoon cutoff
  const napEndHour = alarmTime.getHours() + alarmTime.getMinutes() / 60;
  const sleepImpactWarning = napEndHour >= NAP_CUTOFF_HOUR;

  // Additional check: warn if the nap alarm is within 4 hours of bedtime,
  // which can make it hard to fall asleep at the planned time
  const hoursBeforeBed = (bedtimeTonight.getTime() - alarmTime.getTime()) / 3_600_000;
  const tooCloseToBedtime = hoursBeforeBed < 4 && hoursBeforeBed > 0;

  return {
    type: napType,
    label: config.label,
    durationMinutes: totalDuration,
    startTime,
    alarmTime,
    description: tooCloseToBedtime
      ? `${config.description} Warning: this nap ends within 4 hours of your planned bedtime.`
      : config.description,
    sleepImpactWarning: sleepImpactWarning || tooCloseToBedtime,
  };
}
